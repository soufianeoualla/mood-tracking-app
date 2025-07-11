"use client";

import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import profileSchema, { ProfileSchemaType } from "@/schemas/profile.schema";
import React, { useRef, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";

import FormMessage from "@/app/(auth)/_components/form-message";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import uploadService from "@/lib/upload.service";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  onSubmit: (data: ProfileSchemaType) => void;
  defaultValues?: ProfileSchemaType;
  isSubmitting?: boolean;
  title?: string;
  description?: string;
  ctaLabel?: string;
  errorMessage?: string;
}

const validateFile = (file: File): string | null => {
  const maxSize = 250 * 1024;
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(file.type))
    return "Please select a PNG or JPEG file";
  if (file.size > maxSize) return "File size must be less than 250KB";
  return null;
};

const UserProfileForm = ({
  onSubmit,
  defaultValues = { name: "", cover: undefined },
  isSubmitting = false,
  title = "Personalize your experience",
  description = "Add your name and a profile picture to make Mood yours.",
  ctaLabel = "Start Tracking",
  errorMessage = "",
}: Props) => {
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    defaultValues.cover || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<ProfileSchemaType, "cover">
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    try {
      const result = await uploadService(file);
      setUploadStatus("success");
      setUploadedImageUrl(result.secure_url);
      field.onChange(result.secure_url);
    } catch {
      setUploadStatus("error");
    }
  };

  const getButtonContent = () => {
    switch (uploadStatus) {
      case "uploading":
        return (
          <div className="flex items-center gap-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </div>
        );
      case "success":
        return (
          <div className="flex items-center gap-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Uploaded
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Try Again
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-x-2">
            <Upload className="w-4 h-4" />
            Upload
          </div>
        );
    }
  };

  return (
    <div className="bg-neutral-0 py-10 md:px-8 px-4 w-[95%] md:w-[530px] rounded-2xl shadow-lg">
      <h3 className="text-preset-3 text-neutral-900 mb-2">{title}</h3>
      <p className="text-preset-6 text-neutral-600">{description}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="name">Name</Label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                type="text"
                id="name"
                placeholder="Jane Appleseed"
                {...field}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-700 text-preset-8 font-medium">
              * {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2 mt-5 mb-8">
          <Controller
            control={control}
            name="cover"
            render={({ field }) => (
              <div className="flex items-start gap-x-5">
                <Avatar size={64} src={uploadedImageUrl || undefined} />
                <div>
                  <label htmlFor="cover-upload" className="text-preset-6 text-neutral-900">
                    Upload Image
                  </label>
                  <p className="text-neutral-600 text-preset-7 mt-1.5">
                    Max 250KB, PNG or JPEG
                  </p>

                  <Button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={uploadStatus === "uploading"}
                    className="px-4 py-2 text-preset-6 mt-4 border border-neutral-300 bg-transparent hover:bg-transparent cursor-pointer text-neutral-900 hover:border-neutral-900 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  >
                    {getButtonContent()}
                  </Button>

                  {uploadStatus === "success" && uploadedImageUrl && (
                    <div className="mt-2">
                      <p className="text-green-600 text-sm">
                        Upload successful!
                      </p>
                    </div>
                  )}

                  <Input
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    id="cover-upload"
                    className="hidden"
                    ref={(e) => {
                      fileInputRef.current = e;
                      field.ref(e);
                    }}
                    onChange={(e) => handleFileSelect(e, field)}
                  />
                </div>
              </div>
            )}
          />
          {errors.cover && (
            <p className="text-red-500 text-sm">{errors.cover.message}</p>
          )}
        </div>

        <FormMessage message={errorMessage} isError />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || uploadStatus === "uploading"}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-x-2">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </div>
          ) : (
            ctaLabel
          )}
        </Button>
      </form>
    </div>
  );
};

export default UserProfileForm;
