import connectDB from "../../../lib/connectDB";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// JWT ve API Key'leri
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const API_KEY = process.env.API_KEY;

export async function POST(req) {
  try {
    // Kullanıcı verisini al
    const { email, password } = await req.json();

    // API Key doğrulaması
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== API_KEY) {
      return new Response(JSON.stringify({ message: "Invalid API key." }), {
        status: 403,
      });
    }

    // Boş alan kontrolü
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Please fill in all fields!" }),
        { status: 400 }
      );
    }

    // Veritabanı bağlantısı
    await connectDB();

    // Kullanıcıyı bul
    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      // Kullanıcı yoksa, yeni kullanıcı oluştur
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser = new User({
        email,
        password: hashedPassword,
        forms: [],
      });

      // Yeni kullanıcıyı kaydet
      await existingUser.save();

      // JWT token oluştur
      const token = jwt.sign(
        { id: existingUser._id, email: existingUser.email },
        JWT_SECRET,
        { expiresIn: "3h" }
      );

      return new Response(
        JSON.stringify({
          message: "User created successfully!",
          token,
          user: { email: existingUser.email },
        }),
        { status: 200 }
      );
    }

    // Kullanıcı varsa, şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Password is wrong!" }), {
        status: 401,
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    return new Response(
      JSON.stringify({
        message: "Login successful!",
        token,
        user: { email: existingUser.email },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "An error occurred on the server!" }),
      { status: 500 }
    );
  }
}
