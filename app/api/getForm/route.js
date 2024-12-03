import connectDB from "../../lib/connectDB"; // Veritabanı bağlantı fonksiyonu
import { Form } from "../../../models/Form"; // Form modelini dahil et
import { NextRequest, NextResponse } from "next/server"; // next/server'dan NextRequest ve NextResponse'ı import et

export async function GET(req) {
  // URL'deki searchParams'tan id parametresini alıyoruz
  const id = req.nextUrl.searchParams.get("id"); // "id" parametresini alıyoruz

  if (!id) {
    return NextResponse.json(
      { message: "Form ID is required." },
      { status: 400 }
    );
  }

  try {
    // Veritabanına bağlan
    await connectDB();

    // Formu ID'ye göre bul
    const form = await Form.findById(id).populate("questions"); // Soruları da getirelim

    // Eğer form bulunamazsa hata döndür
    if (!form) {
      return NextResponse.json({ message: "Form not found." }, { status: 404 });
    }

    // Başarılı şekilde formu döndür
    return NextResponse.json(form, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
