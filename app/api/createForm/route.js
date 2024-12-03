import connectDB from "../../lib/connectDB";
import { Form } from "../../../models/Form";
import { Question } from "../../../models/Question";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // JWT secret key

export async function POST(req) {
  // POST isteği için body içeriğini alıyoruz
  const { token, formName, questions } = await req.json();

  // JWT token doğrulama
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

    // Kullanıcıyı ID'ye göre bul
    const user = await User.findById(decoded.id);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found!" }), {
        status: 404,
      });
    }

    // Soruları işleyelim ve her bir soruyu `Question` modeline kaydedelim
    const questionIds = [];

    // Soruları veritabanına kaydedelim (Soruların sadece metnini alıyoruz)
    for (let i = 0; i < questions.length; i++) {
      const question = new Question({
        questionText: questions[i].questionText,
      }); // Sorunun metnini alıyoruz
      await question.save();
      questionIds.push(question._id); // Kaydedilen her sorunun ObjectId'sini sorular dizisine ekliyoruz
    }

    // Formu oluşturuyoruz
    const newForm = new Form({
      formName,
      questions: questionIds, // Soruları ObjectId olarak veriyoruz
      respondents: [], // Başlangıçta yanıtlayan kişi yok
    });

    // Formu veritabanına kaydediyoruz
    await newForm.save();

    // Kullanıcının 'forms' alanına bu formu ekliyoruz
    user.forms.push(newForm);
    await user.save();

    return new Response(
      JSON.stringify({ message: "Form successfully created", form: newForm }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
