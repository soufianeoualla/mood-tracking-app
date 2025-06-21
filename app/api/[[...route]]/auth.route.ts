import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import authSchema from "@/schemas/auth.schema";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UserRepository } from "@/prisma/repositories/user.repository";

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
  });

export default app;
