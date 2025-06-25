import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import authSchema, { passwordResetSchema } from "@/schemas/auth.schema";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UserRepository } from "@/prisma/repositories/user.repository";
import { z } from "zod";
import { generateResetToken, generateVerificationToken } from "@/lib/tokens";
import { sendResetLinkEmail, sendVerificationEmail } from "@/lib/send-email";

const userRepository = new UserRepository();

const app = new Hono()
  .post("/login", zValidator("json", authSchema), async (c) => {
    try {
      const { email, password } = c.req.valid("json");

      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        throw new HTTPException(400, {
          message: "User not found",
        });
      }
      const isPasswordValid = bcrypt.compareSync(password, user.password!);

      if (!isPasswordValid) {
        throw new HTTPException(400, {
          message: "Invalid password",
        });
      }

      if (!user.emailVerified) {
        const verificationToken = await generateVerificationToken(email);

        await sendVerificationEmail(email, verificationToken.token);

        throw new HTTPException(403, {
          message: "Email not verified - check your email for confirmation!",
        });
      }

      const token = sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "7d",
        }
      );

      return c.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          cover: user.cover,
          onboardingComplete: user.onboardingComplete,
        },
        token,
      });
    } catch (error) {
      console.error("Error signing in:", error);
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(400, {
        message: "Login failed",
      });
    }
  })

  .post("/signup", zValidator("json", authSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    console.log("Received signup request:", { email, password });

    try {
      const user = await userRepository.getUserByEmail(email);
      if (user) {
        throw new HTTPException(400, {
          message: "User already exists",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = await userRepository.createUser({
        email,
        password: hashedPassword,
      });

      const verificationToken = await generateVerificationToken(email);

      await sendVerificationEmail(email, verificationToken.token);

      return c.json({
        message: "Check your email for confirmation!",
        user: newUser,
      });
    } catch (error) {
      console.error("Error signing up:", error);
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(400, {
        message: "Registration failed",
      });
    }
  })
  .post(
    "/verify",
    zValidator(
      "json",
      z.object({
        token: z.string().min(1, "Token is required"),
      })
    ),
    async (c) => {
      try {
        const { token } = c.req.valid("json");
        if (!token) {
          throw new HTTPException(400, {
            message: "Token is required",
          });
        }
        const existingToken = await userRepository.getVerificationToken(token);
        if (!existingToken) {
          throw new HTTPException(400, {
            message: "Invalid or expired token",
          });
        }
        const user = await userRepository.getUserByEmail(existingToken.email);
        if (!user) {
          throw new HTTPException(404, {
            message: "User not found",
          });
        }
        const updatedUser = await userRepository.updateUser(user.id, {
          emailVerified: new Date(),
        });
        await userRepository.deleteVerificationToken(token);
        return c.json({ updatedUser, message: "User verified successfully" });
      } catch (error) {
        console.error("Error verifying user:", error);
        if (error instanceof HTTPException) {
          throw error;
        }
        throw new HTTPException(500, {
          message: "Verification failed",
        });
      }
    }
  )
  .post(
    "/forgot-password",
    zValidator(
      "json",
      z.object({
        email: z.string().email("Invalid email address"),
      })
    ),
    async (c) => {
      try {
        const { email } = c.req.valid("json");
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
          throw new HTTPException(404, {
            message: "User not found",
          });
        }
        const resetToken = await generateResetToken(email);
        await sendResetLinkEmail(email, user.name ?? "", resetToken.token);
        return c.json({
          message: "Check your email for password reset instructions!",
        });
      } catch (error) {
        console.error("Error processing forgot password:", error);
        if (error instanceof HTTPException) {
          throw error;
        }
        throw new HTTPException(500, {
          message: "Failed to process forgot password",
        });
      }
    }
  )
  .post(
    "/reset-password",
    zValidator("json", passwordResetSchema),
    async (c) => {
      try {
        const { token, newPassword } = c.req.valid("json");
        const existingToken = await userRepository.getResetToken(token);
        if (!existingToken) {
          throw new HTTPException(400, {
            message: "Invalid or expired reset token",
          });
        }
        const user = await userRepository.getUserByEmail(existingToken.email);
        if (!user) {
          throw new HTTPException(404, {
            message: "User not found",
          });
        }
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await userRepository.updateUser(user.id, {
          password: hashedPassword,
        });

        await userRepository.deleteResetToken(token);
        return c.json({
          message: "Password reset successfully",
        });
      } catch (error) {
        console.error("Error resetting password:", error);
        if (error instanceof HTTPException) {
          throw error;
        }
        throw new HTTPException(500, {
          message: "Failed to reset password",
        });
      }
    }
  );

export default app;
