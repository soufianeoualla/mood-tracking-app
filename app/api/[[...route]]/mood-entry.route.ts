import { Hono } from "hono";
import authMiddleware from "./authMiddleware";
import { zValidator } from "@hono/zod-validator";
import moodEntrySchema from "@/schemas/mood.entry";
import { MoodEntryRepository } from "@/prisma/repositories/mood-entry.repository";
import { MoodEntry } from "@prisma/client";

import { GoogleGenerativeAI } from "@google/generative-ai";
const generateQuotePrompt = ({
  mood,
  sleepHours,
  feelings,
}: {
  mood: number;
  sleepHours: number;
  feelings: string[];
}) => {
  return `Give a short, inspiring quote for someone who is feeling mood level ${mood} (where -2 = very sad, -1 = sad, 0 = neutral, 1 = happy, 2 = very happy), slept ${sleepHours} hours, and feels ${feelings.join(
    ", "
  )}.`;
};

const moodEntryRepository = new MoodEntryRepository();

const getStartOfToday = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const getAverageSleepHours = (hours: number) => {
  if (hours <= 3) return 1;
  if (hours <= 5) return 3.5;
  if (hours <= 7) return 5.5;
  if (hours < 9) return 7.5;
  return 9;
};

const gemini = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const generateMoodQuote = async (entry: {
  mood: number;
  sleepHours: number;
  feelings: string[];
}) => {
  const prompt = generateQuotePrompt(entry);

  try {
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Make the API call to Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 60, // Set maximum output tokens
        temperature: 0.8, // Set generation temperature
      },
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating quote with Gemini:", error);

    return "Keep moving forward, one step at a time.";
  }
};

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
      const moodEntryDate = getStartOfToday();

      const existingEntry = await moodEntryRepository.getEntriesByDate(
        user.id,
        moodEntryDate
      );
      if (existingEntry.length > 0) {
        return c.json({ error: "Mood entry for today already exists" }, 400);
      }

      const generatedQuote = await generateMoodQuote({
        mood,
        sleepHours,
        feelings,
      });

      await moodEntryRepository.createEntry({
        user: {
          connect: {
            id: user.id,
          },
        },
        mood,
        sleepHours,
        comment,
        feelings,
        generatedQuote,
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

      const moodEntryDate = getStartOfToday();
      const entries = await moodEntryRepository.getEntriesByDate(
        user.id,
        moodEntryDate
      );

      return c.json({
        moodEntry: entries.length > 0 ? entries[0] : null,
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

      const calcAverages = (
        entries: Array<{ mood: number; sleepHours: number }>
      ) => {
        const moodSum = entries.reduce((sum, e) => sum + e.mood, 0);
        const sleepSum = entries.reduce((sum, e) => sum + e.sleepHours, 0);
        return {
          mood: moodSum / entries.length,
          sleep: getAverageSleepHours(sleepSum / entries.length),
        };
      };

      if (entries.length > 5) {
        const latestEntries = entries.slice(0, 5);
        const previousEntries = entries.slice(5);

        const latestAvg = calcAverages(latestEntries);
        const previousAvg = calcAverages(previousEntries);

        const moodStatus =
          latestAvg.mood > previousAvg.mood
            ? "up"
            : latestAvg.mood < previousAvg.mood
            ? "down"
            : "same";

        const sleepStatus =
          latestAvg.sleep > previousAvg.sleep
            ? "up"
            : latestAvg.sleep < previousAvg.sleep
            ? "down"
            : "same";

        return c.json({
          averageMood: Math.round(latestAvg.mood),
          averageSleepHours: latestAvg.sleep,
          moodStatus,
          sleepStatus,
        });
      }
      if (entries.length < 5) {
        return c.json({
          averageMood: null,
          averageSleepHours: null,
          moodStatus: null,
          sleepStatus: null,
        });
      }

      const { mood, sleep } = calcAverages(entries);

      return c.json({
        averageMood: Math.round(mood),
        averageSleepHours: sleep,
        moodStatus: null,
        sleepStatus: null,
      });
    } catch (error) {
      console.error("Error fetching average mood:", error);
      return c.json({ error: "Failed to fetch average mood" }, 500);
    }
  })
  .get("/chart", authMiddleware, async (c) => {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - 10);

      const entries = await moodEntryRepository.getEntriesBetweenDates(
        user.id,
        startDate,
        today
      );

      const entryMap = new Map<string, MoodEntry>();

      entries.forEach((entry: MoodEntry) => {
        const dateStr = entry.createdAt.toISOString().split("T")[0];
        entryMap.set(dateStr, {
          ...entry,
        });
      });

      const chartData = [];
      for (let i = 0; i < 11; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        const data = entryMap.get(dateStr);
        chartData.push({
          date: dateStr,
          entry: data ? data : null,
        });
      }

      return c.json({ chartData });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      return c.json({ error: "Failed to fetch chart data" }, 500);
    }
  });

export default app;
