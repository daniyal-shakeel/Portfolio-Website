import { Project, IProject } from "../models/project.model.js";

export class ProjectService {
  static async getAll(): Promise<IProject[]> {
    return Project.find();
  }

  static async create(data: Partial<IProject>): Promise<IProject> {
    const project = new Project(data);
    return project.save();
  }

  static async update(id: string, data: Partial<IProject>): Promise<IProject | null> {
    return Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<IProject | null> {
    return Project.findByIdAndDelete(id);
  }
}
