import connectDB from "../../lib/connectDB";
import User from "../../../models/User";
import Form from "../../../models/Form";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // JWT secret key

export async function GET(req) {
  // Authorization başlığını almak için get metodunu kullanıyoruz
  const authorization = req.headers.get("authorization"); // Authorization başlığını almak

  // Bearer token'ı almak için Authorization başlığını ayrıştırıyoruz
  const token = authorization?.split(" ")[1]; // "Bearer <token>" formatında, token'ı ayırıyoruz

  if (!token) {
    return new Response(JSON.stringify({ message: "Token is required" }), {
      status: 401,
    });
  }

  try {
    // JWT token'ı doğrulama
    const decoded = jwt.verify(token, JWT_SECRET);

    // Veritabanına bağlan
    await connectDB();

    // Kullanıcıyı ID'ye göre buluyoruz, Forms ile birlikte
    const user = await User.findById(decoded.id).populate("forms");

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found!" }), {
        status: 404,
      });
    }

    // Kullanıcıya ait formlar ile başarılı yanıt
    return new Response(JSON.stringify({ forms: user.forms }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
