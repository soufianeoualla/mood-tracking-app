import React from "react";
import AuthCardWrapper from "../_components/auth-card-warpper";
import AuthForm from "../_components/auth-form";

const page = () => {
  return (
    <AuthCardWrapper
      title="Welcome back!"
      text="Log in to continue tracking your mood and sleep."
      bottomHref="/sign-up"
      bottomLabel="Haven't got an account? Sign up."
    >
      <AuthForm />
    </AuthCardWrapper>
  );
};

export default page;
