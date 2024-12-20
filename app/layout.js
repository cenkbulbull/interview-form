import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/store/provider";

const poppins = Poppins({
  weight: ["100", "200", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Interview Form",
  description: "Interview Form",
};

export default function RootLayout({ children }) {
  return (
    <Providers>
      <html lang="en">
        <body className={`${poppins.className} antialiased bg-[#313e51]`}>
          <div className="flex flex-col min-h-screen px-8 lg:px-16 text-white">
            <Navbar />
            <div className="my-auto">{children}</div>
            <Toaster />
          </div>
        </body>
      </html>
    </Providers>
  );
}
