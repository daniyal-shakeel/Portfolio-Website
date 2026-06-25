import { Request, Response } from "express";
import { ExperienceService } from "../services/experience.service.js";

export class ExperienceController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const exps = await ExperienceService.getAll();
      res.status(200).json(exps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experiences." });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const exp = await ExperienceService.create(req.body);
      res.status(201).json(exp);
    } catch (error) {
      res.status(400).json({ error: "Failed to create experience." });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const exp = await ExperienceService.update(req.params.id, req.body);
      if (!exp) {
        res.status(404).json({ error: "Experience not found." });
        return;
      }
      res.status(200).json(exp);
    } catch (error) {
      res.status(400).json({ error: "Failed to update experience." });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const exp = await ExperienceService.delete(req.params.id);
      if (!exp) {
        res.status(404).json({ error: "Experience not found." });
        return;
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete experience." });
    }
  }
}
