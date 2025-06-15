import { cn } from "@/utils";
import React from "react";

const Radio = ({
  isChecked,
  onChange,
}: {
  isChecked: boolean;
  onChange: () => void;
}) => {
  return (
    <div
      onClick={onChange}
      className={cn(
        "w-5 h-5 rounded-full border border-blue-200 cursor-pointer z-50",
        isChecked && "border-4 border-blue-600"
      )}
    />
  );
};

export default Radio;
