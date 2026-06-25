import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

const ExperienceSchema: Schema = new Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  bullets: [{ type: String, required: true }],
});

export const Experience = mongoose.model<IExperience>("Experience", ExperienceSchema);
