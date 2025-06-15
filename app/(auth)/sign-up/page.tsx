import React from "react";
import AuthCardWrapper from "../_components/auth-card-warpper";
import AuthForm from "../_components/auth-form";

const page = () => {
  return (
    <AuthCardWrapper
      title="Create an account"
      text="Join to track your daily mood and sleep with ease."
      bottomHref="/login"
      bottomLabel="Already got an account? Log in."
    >
      <AuthForm />
    </AuthCardWrapper>
  );
};

export default page;
