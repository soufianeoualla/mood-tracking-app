import { z } from "zod";

const onboardingSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  cover: z.string().url({ message: "Cover must be a valid URL" }).optional(),
});

export type OnboardingSchemaType = z.infer<typeof onboardingSchema>;

export default onboardingSchema;
