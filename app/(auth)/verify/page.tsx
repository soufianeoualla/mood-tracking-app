"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

import { useMutation } from "@tanstack/react-query";
import verifyService from "./_services/verify.service";
import toast from "react-hot-toast";

import { AxiosError } from "axios";
import { AlertTriangleIcon, Loader2 } from "lucide-react";

const Page = () => {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: verifyService,
    onSuccess: () => {
      toast.success("Email verified successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        console.error("Verification error:", error.response?.data);
        toast.error(
          error.response?.data || "Verification failed. Please try again."
        );
      } else {
        console.error("Verification error:", error);
      }
    },
  });

  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [token, mutate]);

  if (!token) {
    return (
      <div className="bg-neutral-0 py-10 md:px-8 px-4 w-[95%] md:w-[530px] rounded-2xl shadow-lg flex justify-center items-center flex-col">
        <h3 className="text-preset-3 text-neutral-900 mb-2">
          Invalid or missing token
        </h3>

        <div className="mt-6 flex justify-center items-center">
          <AlertTriangleIcon className="w-10 h-10 text-red-700 animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-0 py-10 md:px-8 px-4 w-[95%] md:w-[530px] rounded-2xl shadow-lg">
      <h3 className="text-preset-3 text-neutral-900 mb-2">
        {"Confirming your email..."}
      </h3>
      <p className="text-preset-6 text-neutral-600">
        Please wait while we verify your email address. This may take a few
        moments.
      </p>
      <div className="mt-6 flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    </div>
  );
};

export default Page;
