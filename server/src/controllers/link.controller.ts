import { Request, Response } from "express";
import { LinkService } from "../services/link.service.js";
import { linkSchema } from "../validators/link.validator.js";

export class LinkController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const links = await LinkService.getAll();
      res.status(200).json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch links." });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const result = linkSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors[0].message });
        return;
      }
      const link = await LinkService.create(result.data);
      res.status(201).json(link);
    } catch (error) {
      res.status(400).json({ error: "Failed to create link." });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const result = linkSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors[0].message });
        return;
      }
      const link = await LinkService.update(req.params.id, result.data);
      if (!link) {
        res.status(404).json({ error: "Link not found." });
        return;
      }
      res.status(200).json(link);
    } catch (error) {
      res.status(400).json({ error: "Failed to update link." });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const link = await LinkService.delete(req.params.id);
      if (!link) {
        res.status(404).json({ error: "Link not found." });
        return;
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete link." });
    }
  }
}
