import { ChatLog, ChatSession } from "../models/chat.model.js";

export class ChatService {
  static async getSessionTokensUsed(sessionId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const logs = await ChatLog.find({
      sessionId,
      timestamp: { $gte: startOfDay }
    });

    return logs.reduce((sum, log) => sum + log.tokensUsed, 0);
  }

  static async logMessage(
    sessionId: string,
    role: "user" | "assistant",
    content: string,
    tokensUsed: number
  ): Promise<void> {
    const log = new ChatLog({
      sessionId,
      role,
      content,
      tokensUsed
    });
    await log.save();
  }

  static async getHistory(sessionId: string): Promise<{ role: "user" | "assistant"; content: string }[]> {
    const logs = await ChatLog.find({ sessionId })
      .sort({ timestamp: 1 })
      .limit(30);

    return logs.map(log => ({
      role: log.role,
      content: log.content
    }));
  }

  static async getAllLogs(): Promise<any[]> {
    return ChatLog.find().sort({ timestamp: -1 }).limit(100);
  }

  static async getStats(): Promise<any> {
    const startOfPeriod = new Date();
    startOfPeriod.setDate(startOfPeriod.getDate() - 30);

    const dailyAgg = await ChatLog.aggregate([
      { $match: { timestamp: { $gte: startOfPeriod } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          tokens: { $sum: "$tokensUsed" },
          requests: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const sessionAgg = await ChatLog.aggregate([
      {
        $group: {
          _id: "$sessionId",
          tokens: { $sum: "$tokensUsed" },
          requests: { $sum: 1 }
        }
      },
      { $sort: { tokens: -1 } },
      { $limit: 15 }
    ]);

    const dailyData = dailyAgg.map(item => ({
      date: item._id,
      tokens: item.tokens,
      requests: item.requests
    }));

    const sessionData = sessionAgg.map(item => ({
      session: item._id.substring(0, 8) + "...",
      tokens: item.tokens,
      requests: item.requests
    }));

    return {
      daily: dailyData,
      sessions: sessionData
    };
  }

  static async isValidSession(sessionId: string): Promise<boolean> {
    const session = await ChatSession.findOne({ sessionId });
    return !!session;
  }

  static async createSession(): Promise<string> {
    const sessionId = "session_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const session = new ChatSession({ sessionId });
    await session.save();
    return sessionId;
  }
}
