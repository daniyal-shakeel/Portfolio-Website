import mongoose, { Schema, Document } from "mongoose";

export interface ILearning extends Document {
  name: string;
}

const LearningSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export const Learning = mongoose.model<ILearning>("Learning", LearningSchema);
