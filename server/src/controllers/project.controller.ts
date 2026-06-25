import { Request, Response } from "express";
import { ProjectService } from "../services/project.service.js";

export class ProjectController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await ProjectService.getAll();
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects." });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectService.create(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: "Failed to create project." });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectService.update(req.params.id, req.body);
      if (!project) {
        res.status(404).json({ error: "Project not found." });
        return;
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({ error: "Failed to update project." });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectService.delete(req.params.id);
      if (!project) {
        res.status(404).json({ error: "Project not found." });
        return;
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project." });
    }
  }
}
