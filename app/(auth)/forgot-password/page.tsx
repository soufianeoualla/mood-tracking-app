"use client";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import forgotPasswordService from "./_services/forgot-password.service";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const Page = () => {
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: forgotPasswordService,
    onSuccess: () => {
      toast.success("Reset link sent to your email!");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError)
        return toast.error(
          error.response?.data || "Failed to send reset link. Please try again."
        );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(email);
  };

  return (
    <div className="bg-neutral-0 py-10 md:px-8 px-4 w-[95%] md:w-[530px] rounded-2xl shadow-lg">
      <h3 className="text-preset-3 text-neutral-900 mb-2">
        {"Forgot your password?"}
      </h3>
      <p className="text-preset-6 text-neutral-600 mb-4">
        {
          "Enter your email address below, and we will send you a link to reset your password."
        }
      </p>
      <form onSubmit={handleSubmit} className="mt-8">
        <Input
          placeholder="name@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full"
        />
        <Button disabled={isPending} className="w-full" type="submit">
          Send Reset Link
        </Button>
      </form>
    </div>
  );
};

export default Page;
