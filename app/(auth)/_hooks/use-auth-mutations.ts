"use client";

import { AuthSchemaType } from "@/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";
import loginService from "../_components/_services/login.service";
import signUpService from "../_components/_services/sign-up.service";
import useAuthStore from "@/store/useAuthStore";
import { useState } from "react";

export const useAuthMutation = (isLogin: boolean, reset: () => void) => {
  const { setToken, setUser } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: AuthSchemaType) => {
      if (isLogin) {
        return await loginService(data);
      } else {
        return await signUpService(data);
      }
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      if (isLogin) {
        setToken(data.token);
        setUser({
          id: data.user.id,
          email: data.user.email,
          cover: data.user.cover,
          onboardingComplete: data.user.onboardingComplete,
        });
      }
      reset();
      return data;
    },
    onError: (error: AxiosError) => {
      setErrorMessage(
        String(error.response?.data) || `${isLogin ? "Login" : "Signup"} failed`
      );

      return;
    },
  });

  return { mutation, successMessage, errorMessage, setSuccessMessage, setErrorMessage};
};
