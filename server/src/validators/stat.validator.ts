import { z } from "zod";

export const statSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  value: z.string().trim().min(1, "Value is required"),
  tooltip: z.string().trim().default(""),
  sortOrder: z.number().int().default(0),
});
