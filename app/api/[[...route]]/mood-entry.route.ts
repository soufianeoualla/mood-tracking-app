import { Hono } from "hono";
import authMiddleware from "./authMiddleware";
import { zValidator } from "@hono/zod-validator";
import moodEntrySchema from "@/schemas/mood.entry";
import { MoodEntryRepository } from "@/prisma/repositories/mood-entry.repository";

const moodEntryRepository = new MoodEntryRepository();

const app = new Hono()
  .post("/", authMiddleware, zValidator("json", moodEntrySchema), async (c) => {
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
  })
  .get("/", authMiddleware, async (c) => {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const today = new Date();
      const moodEntryDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const entries = await moodEntryRepository.getEntriesByDate(
        user.id,
        moodEntryDate
      );

      if (entries.length === 0) {
        return c.json({
          moodEntry: null,
        });
      }

      return c.json({
        moodEntry: entries[0],
      });
    } catch (error) {
      console.error("Error fetching mood entry:", error);
      return c.json({ error: "Failed to fetch mood entry" }, 500);
    }
  })
  .get("/average", authMiddleware, async (c) => {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const entries = await moodEntryRepository.getLastEntries(user.id);
      if (entries.length === 0) {
        return c.json({ averageMood: null });
      }

      const totalMood = entries.reduce((sum, entry) => sum + entry.mood, 0);
      const totalSleepHours = entries.reduce(
        (sum, entry) => sum + entry.sleepHours,
        0
      );
      const averageMood = totalMood / entries.length;
      let averageSleepHours = totalSleepHours / entries.length;

      if (0 < averageSleepHours && averageSleepHours <= 3) {
        averageSleepHours = 1;
      }
      if (3 < averageSleepHours && averageSleepHours <= 5) {
        averageSleepHours = 3.5;
      }
      if (5 < averageSleepHours && averageSleepHours <= 7) {
        averageSleepHours = 5.5;
      }
      if (7 < averageSleepHours && averageSleepHours < 9) {
        averageSleepHours = 7.5;
      }
      if (averageSleepHours === 9) {
        averageSleepHours = 9;
      }

      return c.json({
        averageMood: Math.round(averageMood),
        averageSleepHours,
      });
    } catch (error) {
      console.error("Error fetching average mood:", error);
      return c.json({ error: "Failed to fetch average mood" }, 500);
    }
  });

export default app;
