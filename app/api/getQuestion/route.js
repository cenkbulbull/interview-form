import connectDB from "../../lib/connectDB"; // Veritabanı bağlantısını import ediyoruz
import { Question } from "../../../models/Question"; // Soruları içeren model
import jwt from "jsonwebtoken"; // JWT doğrulaması için kullanacağız

export async function GET(req) {
  // Query string'den id'yi alıyoruz
  const id = req.nextUrl.searchParams.get("id");

  // Authorization başlığından token'ı alıyoruz
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return new Response(JSON.stringify({ error: "Token is required" }), {
      status: 401,
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "questionId is required" }), {
      status: 400,
    });
  }

  try {
    // Token'ı doğrulama
    jwt.verify(token, process.env.JWT_SECRET); // Token'ı doğruluyoruz. JWT_SECRET çevresel değişkende saklanmalı

    // MongoDB'ye bağlanıyoruz
    await connectDB();

    // Veritabanında questionId'ye sahip soruyu buluyoruz
    const question = await Question.findById(id);

    if (!question) {
      return new Response(JSON.stringify({ error: "Question not found" }), {
        status: 404,
      });
    }

    // Soruyu başarılı bir şekilde bulduysak, geri gönderiyoruz
    return new Response(JSON.stringify(question), { status: 200 });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      }); // Token geçersizse
    }
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
