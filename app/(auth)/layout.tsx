import Image from "next/image";
import React from "react";
import logo from "@/assets/logo.svg";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex gap-y-12 flex-col items-center  pt-20 custom-linear-gradiant min-h-screen">
      <Image src={logo} alt="mood tracker" />
      {children}
    </div>
  );
};

export default layout;
