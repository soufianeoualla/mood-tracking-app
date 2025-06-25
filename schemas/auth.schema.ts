import { z } from "zod";

const authSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const passwordResetSchema = z
  .object({
    token: z.string().min(1, { message: "Token is required" }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordResetSchemaType = z.infer<typeof passwordResetSchema>;

export type AuthSchemaType = z.infer<typeof authSchema>;

export default authSchema;
