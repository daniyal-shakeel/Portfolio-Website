import mongoose, { Schema, Document } from "mongoose";

export interface IStat extends Document {
  label: string;
  value: string;
  tooltip?: string;
  sortOrder: number;
}

const StatSchema: Schema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  tooltip: { type: String, default: "" },
  sortOrder: { type: Number, required: true, default: 0 },
});

export const Stat = mongoose.model<IStat>("Stat", StatSchema);
