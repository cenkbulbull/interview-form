import connectDB from "../../../lib/connectDB"; // Veritabanı bağlantısı
import { Form } from "../../../../models/Form"; // Form modelini içeri aktar
import jwt from "jsonwebtoken"; // JWT doğrulama

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // JWT secret key

export default async function handler(req, res) {
  const {
    query: { id }, // URL'den gelen form id'si
  } = req;

  if (req.method === "GET") {
    const { authorization } = req.headers; // Header'dan token al
    const token = authorization?.split(" ")[1]; // Bearer token kısmı

    if (!token) {
      return res.status(401).json({ message: "Token is required" }); // Token yoksa hata
    }

    try {
      // Token'ı doğrulama
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
        return res.status(404).json({ message: "Form not found." }); // Form bulunamazsa hata
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
      return res.status(200).json({
        formName: form.formName,
        formWithAnswers, // Cevaplar ve e-posta bilgileri
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error." }); // Sunucu hatası
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" }); // Yalnızca GET methodu destekleniyor
  }
}
