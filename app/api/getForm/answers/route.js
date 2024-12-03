import connectDB from "../../../lib/connectDB";
import { Form } from "../../../../models/Form";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // JWT secret key

// Veritabanı sorgusunda id doğrulaması
export async function GET(req) {
  const { searchParams } = req.nextUrl; // URL'deki query params'ı alıyoruz
  const id = searchParams.get("id"); // ID'yi query params'dan alıyoruz
  const token = req.headers.get("authorization")?.split(" ")[1]; // Bearer token kısmı

  // Token kontrolü
  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 401 });
  }

  // id kontrolü: Geçerli bir ObjectId olup olmadığını kontrol et
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid Form ID" }, { status: 400 });
  }

  try {
    // JWT doğrulama
    const decoded = jwt.verify(token, JWT_SECRET);

    // Veritabanına bağlan
    await connectDB();

    // Formu ve soruları alıyoruz, yanıtları ile birlikte
    const form = await Form.findById(id)
      .populate({
        path: "questions", // Soruları popüle ediyoruz
        select: "questionText", // Sadece questionText'i alıyoruz
      })
      .populate({
        path: "respondents.answers", // Yanıtları popüle ediyoruz
        populate: {
          path: "questionId", // Yanıtların sorusunu popüle ediyoruz
          select: "questionText", // Sorunun sadece questionText'ini alıyoruz
        },
      })
      .select("formName questions respondents"); // Sadece gerekli alanları seç

    if (!form) {
      return NextResponse.json({ message: "Form not found." }, { status: 404 });
    }

    // Yanıtları ve her bir cevaplayan kişinin e-posta adresini ekleyerek döndürüyoruz
    const formWithAnswers = form.respondents.map((respondent) => {
      return {
        userEmail: respondent.userEmail, // Kullanıcı e-posta adresi
        answers: respondent.answers.map((answer) => {
          const questionText = answer.questionId
            ? answer.questionId.questionText || "No question text available" // questionId doğru şekilde alındıysa, text'i kullan
            : "No question text available"; // questionId null ise
          const answerText = answer.answer || "No answer provided"; // Yanıtın metni

          return {
            question: questionText, // Sorunun metni
            answer: answerText, // Yanıtın metni
          };
        }),
      };
    });

    // Form adı ve cevaplar ile birlikte döndürüyoruz
    return NextResponse.json({
      formName: form.formName,
      formWithAnswers, // Cevaplar ve e-posta bilgileri
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error." }, { status: 500 }); // Sunucu hatası
  }
}
