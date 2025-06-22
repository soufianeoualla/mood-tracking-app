import { Feeling } from "@/app/generated/prisma";
import { z } from "zod";

const moodEntrySchema = z.object({
  mood: z
    .union([
      z.literal(-2),
      z.literal(-1),
      z.literal(0),
      z.literal(1),
      z.literal(2),
    ])
    .describe("Mood rating from -2 (very sad) to 2 (very happy)"),

  sleepHours: z
    .union([
      z.literal(1),
      z.literal(3.5),
      z.literal(5.5),
      z.literal(7.5),
      z.literal(9),
    ])
    .describe("Number of hours slept, must be one of the predefined options"),

  comment: z.string().min(10).max(150, {
    message: "Comment must be between 10 and 150 characters",
  }),

  feelings: z
    .array(z.nativeEnum(Feeling), {
      required_error: "Feelings are required",
      invalid_type_error: "Feelings must be one of the predefined options",
    })
    .min(1, { message: "At least one feeling must be selected" })
    .max(3, { message: "You can select up to 3 feelings" })
    .describe("List of feelings associated with the mood entry"),
});

export type MoodEntrySchemaType = z.infer<typeof moodEntrySchema>;
export default moodEntrySchema;
