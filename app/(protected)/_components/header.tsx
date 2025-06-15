import React from "react";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import Avatar from "@/components/ui/avatar";
import { ChevronDownIcon } from "lucide-react";

const Header = () => {
  return (
    <header className="flex justify-between items-center">
      <Image src={logo} alt="mood tracker" />
      <div className="flex items-center gap-x-2.5">
        <Avatar />
        <ChevronDownIcon />
      </div>
    </header>
  );
};

export default Header;
