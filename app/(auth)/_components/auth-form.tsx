"use client";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import authSchema, { AuthSchemaType } from "@/schemas/auth.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";

import { Controller, useForm } from "react-hook-form";

import FormMessage from "./form-message";

import { useAuthMutation } from "../_hooks/use-auth-mutations";
import Link from "next/link";

const AuthForm = () => {
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
  const {
    mutation,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
  } = useAuthMutation(isLogin, reset);

  const onSubmit = async (data: AuthSchemaType) => {
    mutation.mutate(data);
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
      <div className="flex flex-col gap-y-2 mt-5 ">
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
        <div className=" my-4 flex justify-end">
      {isLogin && (

        <Link
          href={"/forgot-password"}
          className="text-blue-600 text-preset-7 hover:underline"
          >
          Forgot your password?
        </Link>
      )}
          </div>
      <FormMessage message={successMessage} />
      <FormMessage message={errorMessage} isError />

      <Button className="w-full" disabled={mutation.isPending} type="submit">
        {isLogin ? "Login" : "Sign Up"}
      </Button>
    </form>
  );
};

export default AuthForm;
