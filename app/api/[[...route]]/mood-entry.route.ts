import { Hono } from "hono";
import authMiddleware from "./authMiddleware";
import { zValidator } from "@hono/zod-validator";
import moodEntrySchema from "@/schemas/mood.entry";
import { MoodEntryRepository } from "@/prisma/repositories/mood-entry.repository";

const moodEntryRepository = new MoodEntryRepository();

const app = new Hono().post(
  "/",
  authMiddleware,
  zValidator("json", moodEntrySchema),
  async (c) => {
    try {
      const user = c.get("user");
      const moodEntry = c.req.valid("json");

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      if (!moodEntry) {
        return c.json({ error: "Mood entry data is required" }, 400);
      }
      const { mood, sleepHours, comment, feelings } = moodEntry;

      const today = new Date();
      const moodEntryDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const existingEntry = await moodEntryRepository.getEntriesByDate(
        user.id,
        moodEntryDate
      );

      if (existingEntry.length > 0) {
        return c.json({ error: "Mood entry for today already exists" }, 400);
      }

      await moodEntryRepository.createEntry({
        user: {
          connect: {
            id: user.id,
          },
        },

        mood,
        sleepHours,
        comment,
        feelings: feelings,
      });

      return c.json({
        message: "Mood entry created successfully",
        user: {
          id: user.id,
          email: user.email,
        },
        moodEntry,
      });
    } catch (error) {
      console.error("Error creating mood entry:", error);
      return c.json({ error: "Failed to create mood entry" }, 500);
    }
  }
);

export default app;
