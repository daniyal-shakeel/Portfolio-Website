import { Request, Response } from "express";
import { EducationService } from "../services/education.service.js";
import { educationSchema } from "../validators/education.validator.js";

export class EducationController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const edus = await EducationService.getAll();
      res.status(200).json(edus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch education records." });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const result = educationSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors[0].message });
        return;
      }
      const edu = await EducationService.create(result.data);
      res.status(201).json(edu);
    } catch (error) {
      res.status(400).json({ error: "Failed to create education record." });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const result = educationSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors[0].message });
        return;
      }
      const edu = await EducationService.update(req.params.id, result.data);
      if (!edu) {
        res.status(404).json({ error: "Education record not found." });
        return;
      }
      res.status(200).json(edu);
    } catch (error) {
      res.status(400).json({ error: "Failed to update education record." });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const edu = await EducationService.delete(req.params.id);
      if (!edu) {
        res.status(404).json({ error: "Education record not found." });
        return;
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete education record." });
    }
  }
}
