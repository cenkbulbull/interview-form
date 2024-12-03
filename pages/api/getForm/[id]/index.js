import connectDB from "../../../lib/connectDB"; // Veritabanı bağlantı fonksiyonu
import { Form } from "../../../../models/Form"; // Form modelini dahil et

export default async function handler(req, res) {
  const {
    query: { id }, // URL'den gelen form ID'si
  } = req;

  if (req.method === "GET") {
    try {
      // Veritabanına bağlan
      await connectDB();

      // Formu ID'ye göre bul
      const form = await Form.findById(id).populate("questions"); // Soruları da getirelim

      // Eğer form bulunamazsa hata döndür
      if (!form) {
        return res.status(404).json({ message: "Form not found." });
      }

      // Başarılı şekilde formu döndür
      return res.status(200).json(form);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error." });
    }
  } else {
    // Yalnızca GET isteği kabul edilir
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
