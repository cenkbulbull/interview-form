import connectDB from "../../lib/connectDB";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // JWT secret key
const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // .env dosyasından API key

// CORS Kontrolü: Sadece izin verilen yerden istek al
const allowedOrigins = process.env.allowedOrigins; // Buraya izin verilen URL'leri ekleyin

// CORS seçenekleri
const corsOptions = {
  origin: (origin, callback) => {
    // Eğer 'origin' başlığı yoksa ya da izin verilen kaynaklardan geliyorsa, izin ver
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(
        new Error("You do not have permission to access this resource."),
        false
      );
    }
  },
};

export default async function handler(req, res) {
  // CORS işlemi
  cors(corsOptions)(req, res, async () => {
    // API Key doğrulaması
    const apiKey = req.headers["x-api-key"]; // X-API-KEY başlığını kontrol et

    if (apiKey !== API_KEY) {
      return res.status(403).json({ message: "Invalid API key." }); // API anahtarı geçersizse hata döndür
    }

    if (req.method === "POST") {
      const { email, password } = req.body;

      // Basit form doğrulaması
      if (!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields!" });
      }

      try {
        // Veritabanına bağlan
        await connectDB();

        // Kullanıcıyı kontrol et, aynı email'e sahip bir kullanıcı var mı?
        let existingUser = await User.findOne({ email });

        if (!existingUser) {
          // Eğer kullanıcı yoksa, yeni kullanıcı oluştur
          const hashedPassword = await bcrypt.hash(password, 10); // Şifreyi hashle

          // Yeni kullanıcıyı oluştur
          existingUser = new User({
            email,
            password: hashedPassword,
            forms: [], // Başlangıçta boş form listesi
          });

          // Kullanıcıyı kaydet
          await existingUser.save();

          // Kullanıcıyı doğruladıktan sonra JWT token oluştur
          const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email },
            JWT_SECRET,
            { expiresIn: "3h" } // Token 3 saat geçerli olacak
          );

          return res.status(200).json({
            message: "User created successful!",
            token, // Kullanıcıya token'ı veriyoruz
            user: {
              email: existingUser.email,
            },
          });
        }

        // Eğer kullanıcı varsa, şifreyi doğrula
        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Password is wrong!" });
        }

        // Kullanıcıyı doğruladıktan sonra JWT token oluştur
        const token = jwt.sign(
          { id: existingUser._id, email: existingUser.email },
          JWT_SECRET,
          { expiresIn: "3h" } // Token 3 saat geçerli olacak
        );

        // Token'ı ve kullanıcı bilgisini döndür
        return res.status(200).json({
          message: "Login successful!",
          token, // Kullanıcıya token'ı veriyoruz
          user: {
            email: existingUser.email,
          },
        });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "An error occurred on the server!" });
      }
    } else {
      return res
        .status(405)
        .json({ message: "Only POST request is accepted." });
    }
  });
}
