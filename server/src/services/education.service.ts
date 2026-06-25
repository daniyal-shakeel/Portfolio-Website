import { Education, IEducation } from "../models/education.model.js";

export class EducationService {
  static async getAll(): Promise<IEducation[]> {
    return Education.find();
  }

  static async create(data: Partial<IEducation>): Promise<IEducation> {
    const edu = new Education(data);
    return edu.save();
  }

  static async update(id: string, data: Partial<IEducation>): Promise<IEducation | null> {
    return Education.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<IEducation | null> {
    return Education.findByIdAndDelete(id);
  }
}
