import { Request, Response } from "express";
import { StatService } from "../services/stat.service.js";
import { statSchema } from "../validators/stat.validator.js";

export class StatController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const stats = await StatService.getAll();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch figures." });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const result = statSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors[0].message });
        return;
      }
      const stat = await StatService.create(result.data);
      res.status(201).json(stat);
    } catch (error) {
      res.status(400).json({ error: "Failed to create figure." });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const result = statSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors[0].message });
        return;
      }
      const stat = await StatService.update(req.params.id, result.data);
      if (!stat) {
        res.status(404).json({ error: "Figure not found." });
        return;
      }
      res.status(200).json(stat);
    } catch (error) {
      res.status(400).json({ error: "Failed to update figure." });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const stat = await StatService.delete(req.params.id);
      if (!stat) {
        res.status(404).json({ error: "Figure not found." });
        return;
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete figure." });
    }
  }
}
