import { z } from "zod";

export const settingsSchema = z.object({
  logoText: z.string().trim().min(1, "Logo text is required"),
  subheading: z.string().trim().min(1, "Subheading is required"),
  openToWorkStatus: z.string().trim().min(1, "Status is required"),
  selectedPalette: z.enum(["matrix", "dracula", "nordic", "sunset", "amber"]),
});
