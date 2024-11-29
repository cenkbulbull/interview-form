import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// JWT_SECRET'ı Uint8Array'e dönüştürüyoruz
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret_key"
);

export async function middleware(request) {
  // Cookie'den token'ı al
  const token = request.cookies.get("token");

  // Eğer URL '/forms/dinamik/form' gibi bir path içeriyorsa, bu yolda token kontrolü yapılmaz
  const pathname = request.nextUrl.pathname;

  // '/forms/any/path/form' path'lerini dışarıda tutmak için kontrol
  if (pathname.startsWith("/forms/") && pathname.endsWith("/form")) {
    return NextResponse.next(); // Token kontrolü yapılmadan bu sayfaya geçiş yapılabilir
  }

  // Eğer token varsa, işlem devam etsin
  if (token) {
    try {
      // Token'ı doğrula
      await jwtVerify(token.value, JWT_SECRET);

      // Eğer zaten signin sayfasına gitmeye çalışıyorsa, anasayfaya yönlendir
      if (pathname.startsWith("/signin")) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Token geçerli, işlemi devam ettir
      return NextResponse.next();
    } catch (error) {
      console.log("Token geçersiz:", error);

      // Eğer kullanıcı zaten signin sayfasında ise, yönlendirme yapma
      if (pathname === "/signin") {
        return NextResponse.next();
      }

      // Geçersiz token ise signin sayfasına yönlendir
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  } else {
    // Eğer token yoksa, signin sayfasına yönlendir
    // Kullanıcı zaten signin sayfasında mı kontrol et
    if (request.nextUrl.pathname.startsWith("/signin")) {
      // Eğer zaten signin sayfasında ise başka yönlendirme yapma
      return NextResponse.next();
    }

    // Token yoksa ve kullanıcı signin sayfasında değilse, signin sayfasına yönlendir
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/", "/signin", "/forms/:path*"], // Hangi sayfalar middleware'e dahil olacak
};
