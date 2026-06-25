import { Request, Response } from "express";
import { SkillService } from "../services/skill.service.js";

export class SkillController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const skills = await SkillService.getAll();
      res.status(200).json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills." });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const skill = await SkillService.create(req.body);
      res.status(201).json(skill);
    } catch (error) {
      res.status(400).json({ error: "Failed to create skill category." });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const skill = await SkillService.update(req.params.id, req.body);
      if (!skill) {
        res.status(404).json({ error: "Skill category not found." });
        return;
      }
      res.status(200).json(skill);
    } catch (error) {
      res.status(400).json({ error: "Failed to update skill category." });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const skill = await SkillService.delete(req.params.id);
      if (!skill) {
        res.status(404).json({ error: "Skill category not found." });
        return;
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete skill category." });
    }
  }
}
