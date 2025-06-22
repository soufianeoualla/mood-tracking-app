import ProtectedRoute from "@/components/auth-wrappers";
import React from "react";
import { Toaster } from "react-hot-toast";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster position="bottom-right" />
      <ProtectedRoute>{children}</ProtectedRoute>;
    </>
  );
};

export default layout;
