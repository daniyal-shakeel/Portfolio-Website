import { Request, Response } from "express";
import { TaglineService } from "../services/tagline.service.js";
import { taglineSchema } from "../validators/tagline.validator.js";

export class TaglineController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const taglines = await TaglineService.getAll();
      res.status(200).json(taglines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch taglines." });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const result = taglineSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors[0].message });
        return;
      }
      const tagline = await TaglineService.create(result.data);
      res.status(201).json(tagline);
    } catch (error) {
      res.status(400).json({ error: "Failed to create tagline." });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const result = taglineSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors[0].message });
        return;
      }
      const tagline = await TaglineService.update(req.params.id, result.data);
      if (!tagline) {
        res.status(404).json({ error: "Tagline not found." });
        return;
      }
      res.status(200).json(tagline);
    } catch (error) {
      res.status(400).json({ error: "Failed to update tagline." });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const tagline = await TaglineService.delete(req.params.id);
      if (!tagline) {
        res.status(404).json({ error: "Tagline not found." });
        return;
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete tagline." });
    }
  }
}
