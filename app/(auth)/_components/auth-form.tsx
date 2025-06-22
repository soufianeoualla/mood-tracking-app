"use client";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import authSchema, { AuthSchemaType } from "@/schemas/auth.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import React, { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import signUpService from "./_services/sign-up.service";
import loginService from "./_services/login.service";
import FormMessage from "./form-message";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";

const AuthForm = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const { setToken, setUser } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<AuthSchemaType>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const { control, reset } = form;

  const pathname = usePathname();

  const isLogin = pathname.includes("login");

  const onSubmit = async (data: AuthSchemaType) => {
    startTransition(async () => {
      try {
        if (isLogin) {
          const response = await loginService(data);
          setSuccessMessage(response.message);
          console.log("Login response:", response);
          setToken(response.token);
          setUser({
            id: response.user.id,
            email: response.user.email,
            cover: response.user.cover,
            onboardingComplete: response.user.onboardingComplete,
          });
          reset();
        } else {
          const response = await signUpService(data);
          setSuccessMessage(response.message);
          reset();
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setErrorMessage(
            error.response?.data || `${isLogin ? "Login" : "Signup"} failed`
          );

          return;
        }
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="email">Email address</Label>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              type="email"
              onFocus={() => {
                setSuccessMessage("");
                setErrorMessage("");
              }}
              placeholder="name@mail.com"
              {...field}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-5 mb-8">
        <Label htmlFor="password">password</Label>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              type="password"
              placeholder="*******"
              id="password"
              {...field}
            />
          )}
        />
      </div>
      <FormMessage message={successMessage} />
      <FormMessage message={errorMessage} isError />

      <Button className="w-full" disabled={isPending}>
        {isLogin ? "Login" : "Sign Up"}
      </Button>
    </form>
  );
};

export default AuthForm;
