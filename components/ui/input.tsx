import { cn } from "@/utils";
import * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border border-neutral-300 h-12 px-4 rounded-[10px] placeholder:text-neutral-600 text-preset-6 text-neutral-900 outline-none focus:border-blue-600",
        className
      )}
      {...props}
    />
  );
}

export { Input };
