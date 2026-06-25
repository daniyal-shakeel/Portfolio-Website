import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  key: string;
  label: string;
  items: string[];
}

const SkillSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  items: [{ type: String, required: true }],
});

export const Skill = mongoose.model<ISkill>("Skill", SkillSchema);
