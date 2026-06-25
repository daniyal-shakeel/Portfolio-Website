import { Stat, IStat } from "../models/stat.model.js";

export class StatService {
  static async getAll(): Promise<IStat[]> {
    return Stat.find().sort({ sortOrder: 1 });
  }

  static async create(data: Partial<IStat>): Promise<IStat> {
    const stat = new Stat(data);
    return stat.save();
  }

  static async update(id: string, data: Partial<IStat>): Promise<IStat | null> {
    return Stat.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<IStat | null> {
    return Stat.findByIdAndDelete(id);
  }
}
