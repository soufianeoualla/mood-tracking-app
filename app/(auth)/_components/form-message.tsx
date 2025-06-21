import { CircleInfo } from "@/components/icons";
import { cn } from "@/utils";
import { CheckCircle } from "lucide-react";
import React from "react";

const FormMessage = ({
  message,
  isError = false,
}: {
  message: string;
  isError?: boolean;
}) => {
  if (!message) return null;
  return (
    <div
      className={cn(
        "flex items-center gap-x-2 bg-green-300/10 rounded-lg p-3  mb-4",
        isError && "text-red-700 bg-red-700/10"
      )}
      role="alert"
    >
      {isError ? <CircleInfo /> : <CheckCircle className="text-green-500" />}
      <span
        className={cn(
          " text-green-600 font-medium",
          isError && "text-red-700 "
        )}
      >
        {message}
      </span>
    </div>
  );
};

export default FormMessage;
