import { cn } from "@/utils";
import React from "react";

const Button = ({
  variant = "primary",
  className,
  onClick,
  children,
  disabled = false,
}: {
  variant?: "primary" | "secondary" | "outline";
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  let style;
  switch (variant) {
    case "primary":
      style = "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-200 ";
      break;
    case "outline":
      style =
        "border border-neutral-300 bg-transparent text-neutral-900 hover:border-neutral-900 disabled:bg-neutral-200";
    case "secondary":
      style =
        "bg-white textneutral-900 hover:bg-neutral-100 disabled:bg-white/60 ";
    default:
      break;
  }
  return (
    <button
      className={cn("py-3 px-8 rounded-[10px]  ", style, className)}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-preset-5">{children}</span>
    </button>
  );
};

export default Button;
