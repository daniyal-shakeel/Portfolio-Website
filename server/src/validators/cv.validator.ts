import { z } from "zod";

export const cvUploadSchema = z.object({
  filename: z.string().trim().min(1, "Filename is required").refine(
    (val) => val.toLowerCase().endsWith(".pdf"),
    { message: "Filename must have a .pdf extension" }
  ),
  base64Data: z.string().trim().min(1, "Base64 data is required").refine(
    (val) => val.startsWith("data:application/pdf;base64,"),
    { message: "File must be a PDF document" }
  ),
});
