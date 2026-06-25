import mongoose, { Schema, Document } from "mongoose";

export interface ITagline extends Document {
  text: string;
}

const TaglineSchema: Schema = new Schema({
  text: { type: String, required: true },
});

export const Tagline = mongoose.model<ITagline>("Tagline", TaglineSchema);
