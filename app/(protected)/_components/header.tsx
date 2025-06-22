"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import Avatar from "@/components/ui/avatar";
import { ChevronDownIcon, LogOut, Settings } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

const Header = () => {
  const { user } = useAuthStore();
  const [showDropDown, setShowDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    if (showDropDown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropDown]);

  return (
    <header className="flex justify-between items-center relative">
      <Image src={logo} alt="mood tracker" />
      <div
        onClick={() => setShowDropDown((prev) => !prev)}
        className="flex items-center gap-x-2.5 cursor-pointer"
        ref={dropdownRef}
      >
        <Avatar src={user?.cover} />
        <ChevronDownIcon />
      </div>
      {showDropDown && (
        <div
          ref={dropdownRef}
          className="bg-neutral-0 shadow-md absolute top-14 right-0 rounded-lg py-3 px-4 flex flex-col min-w-[200px]"
        >
          <b className="text-neutral-900 text-preset-6 capitalize mb-0.5">{user?.name}</b>
          <span className="text-neutral-300 text-preset-7">{user?.email}</span>
          <hr className="text-neutral-100 my-3" />
          <div className="flex items-center gap-x-2 text-neutral-900 text-preset-7">
            <Settings />
            <span>Settings</span>
          </div>
          <div className="flex items-center gap-x-2 text-neutral-900 text-preset-7 mt-3">
            <LogOut />
            <span>Logout</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
