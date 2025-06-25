import { Hono } from "hono";
import authMiddleware from "./authMiddleware";
import { zValidator } from "@hono/zod-validator";
import profileSchema from "@/schemas/profile.schema";
import { UserRepository } from "@/prisma/repositories/user.repository";

const userRepository = new UserRepository();

const app = new Hono().patch(
  "/",
  authMiddleware,
  zValidator("json", profileSchema),
  async (c) => {
    try {
      const user = c.get("user");
      const profileData = c.req.valid("json");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const existingUser = await userRepository.getUserById(user.id);
      if (!existingUser) {
        return c.json({ error: "User not found" }, 404);
      }
      const updatedUser = await userRepository.updateUser(user.id, profileData);

      return c.json({ user: updatedUser }, 200);
    } catch (error) {
      console.error("Error updating profile:", error);
      return c.json({ error: "Failed to update profile" }, 500);
    }
  }
);

export default app;
