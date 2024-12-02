import connectDB from "../lib/connectDB";
import Form from "../../models/Form";
import User from "../../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // JWT secret key

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { token, formName, questions } = req.body;

    // JWT token doğrulama
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    try {
      // JWT token'ı doğrulama
      const decoded = jwt.verify(token, JWT_SECRET);

      // Veritabanına bağlan
      await connectDB();

      // Kullanıcıyı ID'ye göre bul
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      // Soruları içeren yeni formu oluştur
      const newForm = new Form({
        formName,
        questions, // Sorular doğrudan body'den alınıyor
        respondents: [], // Başlangıçta yanıtlayan kişi yok
      });

      // Formu veritabanına kaydet
      await newForm.save();

      // Kullanıcının 'forms' alanına bu formu ekle
      user.forms.push(newForm);
      await user.save();

      return res
        .status(200)
        .json({ message: "Form successfully created", form: newForm });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Only POST requests are allowed." });
  }
}
