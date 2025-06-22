import { MoodEntrySchemaType } from "@/schemas/mood.entry";

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
