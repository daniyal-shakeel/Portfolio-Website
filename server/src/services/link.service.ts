import { Link, ILink } from "../models/link.model.js";

export class LinkService {
  static async getAll(): Promise<ILink[]> {
    return Link.find();
  }

  static async create(data: Partial<ILink>): Promise<ILink> {
    const link = new Link(data);
    return link.save();
  }

  static async update(id: string, data: Partial<ILink>): Promise<ILink | null> {
    return Link.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<ILink | null> {
    return Link.findByIdAndDelete(id);
  }
}
