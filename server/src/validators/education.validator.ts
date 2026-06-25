import { z } from "zod";

export const educationSchema = z.object({
  degree: z.string().trim().min(1, "Degree is required"),
  institution: z.string().trim().min(1, "Institution is required"),
  startDate: z.string().trim().min(1, "Start Date is required"),
  endDate: z.string().trim().min(1, "End Date is required"),
  gpa: z.string().trim().optional(),
});
