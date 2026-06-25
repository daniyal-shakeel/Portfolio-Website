import mongoose, { Schema, Document } from "mongoose";

export interface IChatLog extends Document {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  tokensUsed: number;
  timestamp: Date;
}

export interface IChatSession extends Document {
  sessionId: string;
  createdAt: Date;
}

const ChatLogSchema: Schema = new Schema({
  sessionId: { type: String, required: true, index: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  tokensUsed: { type: Number, required: true, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

const ChatSessionSchema: Schema = new Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

export const ChatLog = mongoose.model<IChatLog>("ChatLog", ChatLogSchema);
export const ChatSession = mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);
