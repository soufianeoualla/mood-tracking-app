"use client";
import React, { useState } from "react";
import { useOnboardingMutation } from "../_hooks/use-onboarding-mutation";
import useAuthStore from "@/store/useAuthStore";
import UserProfileForm from "@/components/profile-form";

import { AxiosError } from "axios";
import { ProfileSchemaType } from "@/schemas/profile.schema";

const OnboardingForm = () => {
  const { setUser } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState("");
  const { mutate, isPending } = useOnboardingMutation();

  const onSubmit = (data: ProfileSchemaType) => {
    setErrorMessage("");
    mutate(data, {
      onSuccess: (response) => {
        setUser(response.user);
      },
      onError: (err: unknown) => {
        if (err instanceof AxiosError)
          setErrorMessage(err?.response?.data || "Failed to submit the form");
      },
    });
  };

  return (
    <UserProfileForm
      onSubmit={onSubmit}
      isSubmitting={isPending}
      errorMessage={errorMessage}
    />
  );
};

export default OnboardingForm;
