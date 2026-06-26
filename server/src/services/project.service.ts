import { Project, IProject } from "../models/project.model.js";
import path from "path";
import fs from "fs";

export class ProjectService {
  static async getAll(): Promise<IProject[]> {
    return Project.find();
  }

  static async create(data: Partial<IProject>): Promise<IProject> {
    const project = new Project(data);
    return project.save();
  }

  static async update(id: string, data: Partial<IProject>): Promise<IProject | null> {
    const existing = await Project.findById(id);
    if (existing && existing.thumbnail && data.thumbnail !== undefined && existing.thumbnail !== data.thumbnail) {
      const filename = path.basename(existing.thumbnail);
      const filePath = path.join(process.cwd(), "project_thumbnails", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<IProject | null> {
    const existing = await Project.findById(id);
    if (existing && existing.thumbnail) {
      const filename = path.basename(existing.thumbnail);
      const filePath = path.join(process.cwd(), "project_thumbnails", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return Project.findByIdAndDelete(id);
  }
}
