import { Resend } from "resend";

import WelcomeTemplate from "@/components/welcome-email";
import ResetPassword from "@/components/reset-password-email";
const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const link = `${domain}/verify?token=${token}`;

  await resend.emails.send({
    from: "Mood Tracker <mood@soufian.me>",
    to: email,
    subject: "Confirm your email",
    react: WelcomeTemplate({ confirmationLink: link }),
  });
};

export const sendResetLinkEmail = async (
  email: string,
  name: string,
  token: string
) => {
  const link = `${domain}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "Reset Password <mood@soufian.me>",
    to: email,
    subject: "Reset your password",
    react: ResetPassword({ name, resetPasswordLink: link }),
  });
};
