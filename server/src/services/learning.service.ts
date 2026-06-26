import { Learning, ILearning } from "../models/learning.model.js";

export class LearningService {
  static async getAll(): Promise<ILearning[]> {
    return Learning.find();
  }

  static async create(data: Partial<ILearning>): Promise<ILearning> {
    const item = new Learning(data);
    return item.save();
  }

  static async update(id: string, data: Partial<ILearning>): Promise<ILearning | null> {
    return Learning.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<ILearning | null> {
    return Learning.findByIdAndDelete(id);
  }
}
