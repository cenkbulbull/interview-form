"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = (e) => {
    e.preventDefault();
    if (true) {
      router.push("/");
    } else {
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <div className="text-2xl lg:text-5xl font-light leading-tight">
          Welcome to the
          <span className="font-bold tracking-widest"> Interview Form</span>
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
              required
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
              required
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
