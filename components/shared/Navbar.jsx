"use client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { GoMoon } from "react-icons/go";
import { IoSunnyOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

import { useDispatch, useSelector } from "react-redux"; // Redux'dan useDispatch ve useSelector import ediyoruz
import { setToken, logout } from "@/store/authSlice"; // Redux slice'tan action'ları import ediyoruz
import { useEffect } from "react";

const Navbar = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  // Redux store'dan isLoggedIn ve token'ı alıyoruz
  const { isLoggedIn, token } = useSelector((state) => state.auth);

  // Token'ı kontrol et ve Redux'a kaydet
  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      dispatch(setToken(storedToken)); // Redux store'a token'ı kaydediyoruz
    }
  }, [dispatch]);

  const handleLogout = () => {
    Cookies.remove("token", { secure: true, sameSite: "Strict" });
    dispatch(logout()); // Redux store'dan logout yap
    router.push("/signin");
  };
  return (
    <div className="flex justify-between mt-8">
      <Link
        href="/"
        className="tracking-widest underline decoration-primary decoration-4 underline-offset-8"
      >
        Interview Form
      </Link>
      <div className="flex gap-8">
        <div className="flex gap-2 items-center">
          <IoSunnyOutline />
          <Switch />
          <GoMoon />
        </div>

        {isLoggedIn && (
          <div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-black text-xs"
            >
              <CiLogout />
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
