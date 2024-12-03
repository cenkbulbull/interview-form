import mongoose from "mongoose";
import { Form } from "../../../models/Form";
import { Answer } from "../../../models/Answer";
import connectDB from "../../lib/connectDB";
import { NextRequest, NextResponse } from "next/server"; // next/server'dan NextRequest ve NextResponse

export async function POST(req) {
  const { formId, userEmail, answers } = await req.json(); // JSON verisini alıyoruz

  // Gerekli alanların kontrolü
  if (
    !formId ||
    !userEmail ||
    !Array.isArray(answers) ||
    answers.length === 0
  ) {
    return NextResponse.json(
      { message: "Form ID, user email, and answers are required." },
      { status: 400 }
    );
  }

  try {
    // Veritabanına bağlan
    await connectDB();

    // Formu bul
    const form = await Form.findById(formId);
    if (!form) {
      return NextResponse.json({ message: "Form not found." }, { status: 404 });
    }

    // Kullanıcının daha önce bu formu doldurup doldurmadığını kontrol et
    const existingRespondent = form.respondents.find(
      (respondent) => respondent.userEmail === userEmail
    );
    if (existingRespondent) {
      return NextResponse.json(
        { message: "User has already submitted answers for this form." },
        { status: 400 }
      );
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
    return NextResponse.json(
      { message: "Form submitted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error, please try again." },
      { status: 500 }
    );
  }
}
