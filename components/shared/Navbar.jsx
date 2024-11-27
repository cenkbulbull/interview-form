import { Switch } from "@/components/ui/switch";
import { GoMoon } from "react-icons/go";
import { IoSunnyOutline } from "react-icons/io5";

const Navbar = () => {
  return (
    <div className="flex justify-between mt-8">
      <div>LOGO</div>
      <div className="flex gap-2">
        <IoSunnyOutline />
        <Switch />
        <GoMoon />
      </div>
    </div>
  );
};

export default Navbar;
