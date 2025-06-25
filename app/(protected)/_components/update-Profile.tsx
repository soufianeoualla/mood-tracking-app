import UserProfileForm from "@/components/profile-form";

import useAuthStore from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import updateProfileService from "../_services/update-profile.service";
import toast from "react-hot-toast";
import { ProfileSchemaType } from "@/schemas/profile.schema";

const UpdateProfile = ({ hideModal }: { hideModal: () => void }) => {
  const { user, setUser } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProfileSchemaType) => updateProfileService(data),
    onSuccess: (response) => {
      setUser(response.user);
      toast.success("Profile updated successfully!");
      hideModal();
    },
    onError: (error: unknown) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    },

  });

  if (!user) {
    return null;
  }

  return (
    <UserProfileForm
      onSubmit={(data) => mutate(data)}
      isSubmitting={isPending}
      defaultValues={{ name: user.name!, cover: user.cover! }}
      ctaLabel="Save changes"
      title="Update your profile"
      description="Personalize your account with your name and photo."
    />
  );
};

export default UpdateProfile;
