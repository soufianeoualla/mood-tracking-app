import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  cover: z.string().url({ message: "Cover must be a valid URL" }).optional(),
});

export type ProfileSchemaType = z.infer<typeof profileSchema>;

export default profileSchema;
