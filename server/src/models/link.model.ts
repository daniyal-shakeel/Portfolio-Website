import mongoose, { Schema, Document } from "mongoose";

export interface ILink extends Document {
  label: string;
  url: string;
  icon: string;
  showInHero: boolean;
  showInFooter: boolean;
  showInContact: boolean;
}

const LinkSchema: Schema = new Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: true },
  showInHero: { type: Boolean, required: true, default: false },
  showInFooter: { type: Boolean, required: true, default: false },
  showInContact: { type: Boolean, required: true, default: false },
});

export const Link = mongoose.model<ILink>("Link", LinkSchema);
