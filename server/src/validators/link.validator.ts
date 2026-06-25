import { z } from "zod";

export const linkSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  url: z.string().trim().url("Invalid link URL"),
  icon: z.string().trim().min(1, "Icon name is required"),
  showInHero: z.boolean(),
  showInFooter: z.boolean(),
  showInContact: z.boolean(),
});
