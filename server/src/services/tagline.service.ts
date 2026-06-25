import { Tagline, ITagline } from "../models/tagline.model.js";

export class TaglineService {
  static async getAll(): Promise<ITagline[]> {
    return Tagline.find();
  }

  static async create(data: Partial<ITagline>): Promise<ITagline> {
    const tagline = new Tagline(data);
    return tagline.save();
  }

  static async update(id: string, data: Partial<ITagline>): Promise<ITagline | null> {
    return Tagline.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<ITagline | null> {
    return Tagline.findByIdAndDelete(id);
  }
}
