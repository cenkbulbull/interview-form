import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { GoMoon } from "react-icons/go";
import { IoSunnyOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";

import Link from "next/link";

const Navbar = () => {
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

        <div>
          <Button variant="outline" className="text-black text-xs">
            <CiLogout />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
