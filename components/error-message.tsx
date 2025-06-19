import Image from "next/image";
import info_circle from "@/assets/info-circle.svg";


const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div
        className="text-red-700 text-preset-7 flex items-center mb-4"
        role="alert"
      >
        <Image
          src={info_circle}
          alt="Error icon"
          className="inline-block mr-2 w-4 h-4"
        />
        {message}
      </div>
    );
  };

  export default ErrorMessage;