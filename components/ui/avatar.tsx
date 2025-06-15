import Image from "next/image";
import React from "react";
import avatar from "@/assets/avatar.svg";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = "Avatar", size = 42 }) => {
  return (
    <Image
      src={src || avatar}
      alt={alt}
      width={size}
      height={size}
      style={{
        borderRadius: "50%",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
};

export default Avatar;
