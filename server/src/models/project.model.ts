import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  featured?: boolean;
  longDescription?: string;
  thumbnail?: string;
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String, required: true }],
  github: { type: String, required: true },
  demo: { type: String },
  featured: { type: Boolean, default: false },
  longDescription: { type: String },
  thumbnail: { type: String },
});

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
