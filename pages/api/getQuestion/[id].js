import connectDB from "../../lib/connectDB";
import mongoose from "mongoose";
import { Question } from "../../../models/Question"; // Question modelini import ediyoruz
import jwt from "jsonwebtoken"; // JWT'yi kullanarak token doğrulaması yapacağız

export default async function handler(req, res) {
  if (req.method === "GET") {
    const {
      query: { id }, // URL'den gelen form ID'si
    } = req; // URL'den gelen questionId'yi alıyoruz
    const token = req.headers.authorization?.split(" ")[1]; // Authorization başlığından token'ı alıyoruz

    if (!token) {
      return res.status(401).json({ error: "Token is required" }); // Token olmadan erişim yok
    }

    if (!id) {
      return res.status(400).json({ error: "questionId is required" });
    }

    try {
      // Token'ı doğrulama
      jwt.verify(token, process.env.JWT_SECRET); // Token'ı doğruluyoruz. JWT_SECRET çevresel değişkende saklanmalı

      // MongoDB'ye bağlanıyoruz
      await connectDB();

      // Veritabanında questionId'ye sahip soruyu buluyoruz
      const question = await Question.findById(id);

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      // Soruyu başarılı bir şekilde bulduysak, geri gönderiyoruz
      return res.status(200).json(question);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" }); // Token geçersizse
      }
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Yalnızca GET istekleri kabul ediyoruz
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
