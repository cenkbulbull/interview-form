import mongoose from "mongoose";
import { Form } from "../../models/Form";
import { Answer } from "../../models/Answer";
import connectDB from "../lib/connectDB";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { formId, userEmail, answers } = req.body;

    // Gerekli alanların kontrolü
    if (
      !formId ||
      !userEmail ||
      !Array.isArray(answers) ||
      answers.length === 0
    ) {
      return res.status(400).json({
        message: "Form ID, user email, and answers are required.",
      });
    }

    try {
      // Veritabanına bağlan
      await connectDB();

      // Formu bul
      const form = await Form.findById(formId);
      if (!form) {
        return res.status(404).json({ message: "Form not found." });
      }

      // Kullanıcının daha önce bu formu doldurup doldurmadığını kontrol et
      const existingRespondent = form.respondents.find(
        (respondent) => respondent.userEmail === userEmail
      );
      if (existingRespondent) {
        return res.status(400).json({
          message: "User has already submitted answers for this form.",
        });
      }

      // Yanıtları işle ve `Answer` koleksiyonuna ekle
      const processedAnswers = [];
      for (let answer of answers) {
        const newAnswer = new Answer({
          questionId: answer.questionId, // `ObjectId` formatında geçiyor, `new ObjectId()` kullanmaya gerek yok
          answer: answer.answer,
        });

        // Yanıtı kaydet
        await newAnswer.save();
        processedAnswers.push(newAnswer._id); // `Answer`'ın `ObjectId`'sini ekle
      }

      // Yeni respondent ekle
      form.respondents.push({
        userEmail,
        answers: processedAnswers, // Yanıtların ObjectId'leri
      });

      // Formu güncelle
      await form.save();

      // Başarılı yanıt
      res.status(200).json({ message: "Form submitted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error, please try again." });
    }
  } else {
    // Yalnızca POST isteği kabul edilir
    res.status(405).json({ message: "Method Not Allowed" });
  }
}