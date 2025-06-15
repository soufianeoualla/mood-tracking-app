"use client";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import authSchema, { AuthSchema } from "@/schemas/auth";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const AuthForm = () => {
  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const { control } = form;

  const pathname = usePathname();

  const isLogin = pathname.includes("login");

  const onSubmit = (data: AuthSchema) => {
    console.log("Form submitted with data:", data);
    // Handle form submission logic here, e.g., API call
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="email">Email address</Label>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input type="email" placeholder="name@mail.com" {...field} />
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

      <Button className="w-full">{isLogin ? "Login" : "Sign Up"}</Button>
    </form>
  );
};

export default AuthForm;
