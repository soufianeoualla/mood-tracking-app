import { Hono } from "hono";
import authMiddleware from "./authMiddleware";
import { zValidator } from "@hono/zod-validator";
import profileSchema from "@/schemas/profile.schema";
import { HTTPException } from "hono/http-exception";
import { UserRepository } from "@/prisma/repositories/user.repository";

const userRepository = new UserRepository();

const app = new Hono().post(
  "/",
  authMiddleware,
  zValidator("json", profileSchema),
  async (c) => {
    try {
      const user = c.get("user");
      if (!user) {
        throw new HTTPException(400, {
          message: "User not found",
        });
      }
      const { name, cover } = c.req.valid("json");

      await userRepository.updateUser(user.id, {
        name,
        cover,
        onboardingComplete: true,
      });
      return c.json({
        message: "Onboarding completed successfully",
        user: {
          id: user.id,
          email: user.email,
          name:name.toLowerCase(),
          cover,
          onboardingComplete: true,
        },
      });
    } catch (error) {
      console.error("Error during onboarding:", error);
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(400, {
        message: "Onboarding failed",
      });
    }
  }
);

export default app;
