import { Switch } from "@/components/ui/switch";
import { Button } from "../ui/button";

import { GoMoon } from "react-icons/go";
import { IoSunnyOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";

const Navbar = () => {
  return (
    <div className="flex justify-between mt-8">
      <div className="tracking-widest underline decoration-primary decoration-4 underline-offset-8">
        Interview Form
      </div>
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
