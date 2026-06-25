import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  logoText: string;
  subheading: string;
  openToWorkStatus: string;
  selectedPalette: string;
}

const SettingsSchema: Schema = new Schema({
  logoText: { type: String, required: true },
  subheading: { type: String, required: true },
  openToWorkStatus: { type: String, required: true },
  selectedPalette: { type: String, required: true },
});

export const Settings = mongoose.model<ISettings>("Settings", SettingsSchema);
