import mongoose, { Schema, Document } from "mongoose";

export interface ICv extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
  uploadedAt: Date;
}

const CvSchema: Schema = new Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Schema.Types.Buffer, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export const Cv = mongoose.model<ICv>("Cv", CvSchema);
