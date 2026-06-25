import { Skill, ISkill } from "../models/skill.model.js";

export class SkillService {
  static async getAll(): Promise<ISkill[]> {
    return Skill.find();
  }

  static async create(data: Partial<ISkill>): Promise<ISkill> {
    const skill = new Skill(data);
    return skill.save();
  }

  static async update(id: string, data: Partial<ISkill>): Promise<ISkill | null> {
    return Skill.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string): Promise<ISkill | null> {
    return Skill.findByIdAndDelete(id);
  }
}
