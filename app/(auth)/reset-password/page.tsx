"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  passwordResetSchema,
  PasswordResetSchemaType,
} from "@/schemas/auth.schema";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangleIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import resetPasswordService from "./_services/reset-password.service";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const Page = () => {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: resetPasswordService,
    onSuccess: () => {
      toast.success("Password reset successfully!");
      reset();
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data || "Failed to reset password. Please try again."
        );
      } else {
        console.error("Reset password error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
  });

  if (!token) {
    return (
      <div className="bg-neutral-0 py-10 px-8 w-[530px] rounded-2xl shadow-lg flex justify-center items-center flex-col">
        <h3 className="text-preset-3 text-neutral-900 mb-2">
          Invalid or missing token
        </h3>

        <div className="mt-6 flex justify-center items-center">
          <AlertTriangleIcon className="w-10 h-10 text-red-700 animate-bounce" />
        </div>
      </div>
    );
  }

  const onSubmit = async (data: PasswordResetSchemaType) => {
    mutate(data);
  };

  return (
    <div className="bg-neutral-0 py-10 px-8 w-[530px] rounded-2xl shadow-lg">
      <h3 className="text-preset-3 text-neutral-900 mb-2">
        {"Reset your password"}
      </h3>
      <p className="text-preset-6 text-neutral-600 mb-4">
        {"Enter your new password below and confirm it to reset your password."}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="mb-4">
          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  type="password"
                  placeholder="New Password"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  className={`w-full ${fieldState.error ? "border-red-500" : ""}`}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        <div className="mb-4">
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  className={`w-full ${fieldState.error ? "border-red-500" : ""}`}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        <Button
          disabled={isSubmitting || isPending}
          className="w-full"
          type="submit"
        >
          {isSubmitting || isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
