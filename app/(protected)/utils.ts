import { VeryHappy, Happy, Neutral, Sad, VerySad } from "@/components/icons";

import { MoodEntrySchemaType } from "@/schemas/mood.entry";

export const feelingsTags = [
  "Joyful",
  "Down",
  "Anxious",
  "Calm",
  "Excited",
  "Frustrated",
  "Lonely",
  "Grateful",
  "Overwhelmed",
  "Motivated",
  "Irritable",
  "Peaceful",
  "Tired",
  "Hopeful",
  "Confident",
  "Stressed",
  "Content",
  "Disappointed",
  "Optimistic",
  "Restless",
] as const;

export const sleepOptions: {
  label: string;
  value: MoodEntrySchemaType["sleepHours"];
}[] = [
  { label: "9+ hours", value: 9 },
  { label: "7-8 hours", value: 7.5 },
  { label: "5-6 hours", value: 5.5 },
  { label: "3-4 hours", value: 3.5 },
  { label: "0-2 hours", value: 1 },
];

export type MoodLevel = -2 | -1 | 0 | 1 | 2;

export interface MoodConfig {
  color: string;
  Icon: React.ComponentType<{ className?: string }>;
  moodText: string;
  value: MoodLevel;
}

export const MOODS_CONFIG: MoodConfig[] = [
  { color: "bg-amber-300", Icon: VeryHappy, moodText: "Very Happy", value: 2 },
  { color: "bg-green-300", Icon: Happy, moodText: "Happy", value: 1 },
  { color: "bg-blue-300", Icon: Neutral, moodText: "Neutral", value: 0 },
  { color: "bg-indigo-200", Icon: Sad, moodText: "Sad", value: -1 },
  { color: "bg-red-300", Icon: VerySad, moodText: "Very Sad", value: -2 },
];

export const getMoodConfig = (mood: MoodLevel) => {
  return (
    MOODS_CONFIG.find((config) => config.value === mood) || {
      color: "bg-indigo-200",
      Icon: Neutral,
      moodText: "Neutral",
      value: 0,
    }
  );
};

export const getSleepHours = (hours?: number | null) => {
  if (!hours) return null;
  return sleepOptions.find((o) => o.value === hours);
};
