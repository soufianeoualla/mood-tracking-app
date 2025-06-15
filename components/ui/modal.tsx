import { LucideX } from "lucide-react";
import React from "react";

const Modal = ({
  children,
  onClose,
  isVisible,
}: {
  children: React.ReactNode;
  onClose: () => void;
  isVisible: boolean;
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/70 w-full h-full z-50"
      />
      <div className=" fixed top-1/2 left-1/2 -translate-1/2 z-[90]">
        <LucideX
          className="absolute top-8 right-8 text-neutral-300 w-4 h-4 cursor-pointer"
          onClick={onClose}
        />

        {children}
      </div>
    </>
  );
};

export default Modal;
