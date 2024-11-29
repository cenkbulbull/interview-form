"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();

    try {
      // API'ye POST isteği gönder
      const response = await fetch("/api/auth/Signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Giriş başarılıysa, token'ı yerel depolamaya kaydet
        // localStorage.setItem("token", data.token);

        // Token'ı HttpOnly cookie olarak kaydediyoruz
        Cookies.set("token", data.token, {
          expires: 1, // 1 gün sonra token süresi dolacak
          secure: true, // HTTPS üzerinden gönderilmesi için
          // httpOnly: true, //token'lar yalnızca sunucuya gönderilir ve JavaScript tarafından erişilemez
          sameSite: "Strict", // Aynı domain üzerinde geçerli olmasını sağlamak
        });

        // Kullanıcıyı anasayfaya yönlendir
        router.push("/");
      } else {
        // Hata varsa, hata mesajını göster
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <div className="text-2xl lg:text-5xl font-light leading-tight">
          Welcome to the
          <span className="font-bold tracking-widest underline decoration-primary decoration-4 underline-offset-8">
            Interview Form
          </span>
        </div>

        <div className="italic">Log in to create form.</div>
      </div>

      <div className="bg-white p-8 lg:p-12 rounded-2xl text-gray-800">
        <form onSubmit={login} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="text-xs placeholder:text-xs focus-visible:ring-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="text-xs placeholder:text-xs focus-visible:ring-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full text-xs">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
