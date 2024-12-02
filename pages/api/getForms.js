import connectDB from "../lib/connectDB";
import User from "../../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // JWT secret key

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { authorization } = req.headers; // token query parameter olarak alalım

    // Bearer token'ı almak için Authorization başlığını ayrıştırıyoruz | diğer kısımlarda body üzerinden almıştık, burada header üzerinden alıyoruz
    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    try {
      // JWT token'ı doğrulama
      const decoded = jwt.verify(token, JWT_SECRET);

      // Veritabanına bağlan
      await connectDB();

      // Kullanıcıyı ID'ye göre bul
      const user = await User.findById(decoded.id).populate("forms"); // Forms'ları da çekiyoruz, populate() metodu, MongoDB'nin referanslar (references) ile çalışmasını sağlar.

      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      // Kullanıcıya ait formlar döndürüyoruz
      return res.status(200).json({ forms: user.forms });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Only GET requests are allowed." });
  }
}
