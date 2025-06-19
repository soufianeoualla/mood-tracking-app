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

  sleepHours: z.number().min(1).max(9, {
    message: "Sleep hours must be between 1 and 9",
  }),

  comment: z.string().min(10).max(150, {
    message: "Comment must be between 10 and 150 characters",
  }),

  feelings: z
    .array(z.nativeEnum(Feeling), {
      required_error: "Feelings are required",
      invalid_type_error: "Feelings must be one of the predefined options",
    })
    .min(1, { message: "At least one feeling must be selected" })
    .max(5, { message: "You can select up to 5 feelings" })
    .describe("List of feelings associated with the mood entry"),
});

export type MoodEntrySchemaType = z.infer<typeof moodEntrySchema>;
export default moodEntrySchema;
