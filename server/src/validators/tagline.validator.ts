import { z } from "zod";

export const taglineSchema = z.object({
  text: z.string().trim().min(1, "Punch line text is required"),
});
