import ProtectedRoute from "@/components/auth-wrappers";
import React from "react";


const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
};

export default layout;
