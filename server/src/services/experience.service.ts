import { Experience, IExperience } from "../models/experience.model.js";

export class ExperienceService {
  static async getAll(): Promise<IExperience[]> {
    return Experience.find();
  }

  static async create(data: Partial<IExperience>): Promise<IExperience> {
    const exp = new Experience(data);
    return exp.save();
  }

  static async update(id: string, data: Partial<IExperience>): Promise<IExperience | null> {
    return Experience.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<IExperience | null> {
    return Experience.findByIdAndDelete(id);
  }
}
