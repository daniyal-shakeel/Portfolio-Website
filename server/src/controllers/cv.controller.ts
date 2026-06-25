import { Request, Response } from "express";
import { CvService } from "../services/cv.service.js";
import { cvUploadSchema } from "../validators/cv.validator.js";

export class CvController {
  static async upload(req: Request, res: Response): Promise<void> {
    try {
      const result = cvUploadSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors[0].message });
        return;
      }
      const cv = await CvService.uploadCv(result.data.filename, result.data.base64Data);
      res.status(200).json({
        success: true,
        filename: cv.filename,
        uploadedAt: cv.uploadedAt,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload CV." });
    }
  }

  static async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const cv = await CvService.getCv();
      if (!cv) {
        res.status(200).json({ exists: false });
        return;
      }
      res.status(200).json({
        exists: true,
        filename: cv.filename,
        uploadedAt: cv.uploadedAt,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to read CV status." });
    }
  }

  static async download(req: Request, res: Response): Promise<void> {
    try {
      const cv = await CvService.getCv();
      if (!cv) {
        res.status(404).json({ error: "CV document not found." });
        return;
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${cv.filename}"`);
      res.status(200).send(cv.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to stream CV download." });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      await CvService.deleteCv();
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete CV." });
    }
  }
}
