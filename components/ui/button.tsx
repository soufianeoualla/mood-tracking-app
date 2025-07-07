import { cn } from "@/lib/utils";
import React from "react";

const Button = ({
  variant = "primary",
  className,
  onClick,
  children,
  disabled = false,
  type,
}: {
  variant?: "primary" | "secondary" | "outline";
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) => {
  let style;
  switch (variant) {
    case "primary":
      style = "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-200 ";
      break;

    case "secondary":
      style =
        "bg-white text-neutral-900 hover:bg-neutral-100 disabled:bg-white/60 ";
    default:
      break;
  }
  return (
    <button
      className={cn("py-3 px-8 rounded-[10px] flex justify-center items-center  ", style, className)}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-preset-5">{children}</span>
    </button>
  );
};

export default Button;
