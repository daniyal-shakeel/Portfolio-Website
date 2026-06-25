import mongoose, { Schema, Document } from "mongoose";

export interface IEducation extends Document {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

const EducationSchema: Schema = new Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  gpa: { type: String },
});

export const Education = mongoose.model<IEducation>("Education", EducationSchema);
