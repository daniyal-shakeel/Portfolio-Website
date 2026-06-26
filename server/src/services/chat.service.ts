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
    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOf30DaysAgo = new Date();
    startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 30);

    const startOf12WeeksAgo = new Date();
    startOf12WeeksAgo.setDate(startOf12WeeksAgo.getDate() - 84);

    const startOf12MonthsAgo = new Date();
    startOf12MonthsAgo.setMonth(startOf12MonthsAgo.getMonth() - 12);

    const activeThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const todayStats = await ChatLog.aggregate([
      { $match: { timestamp: { $gte: startOfToday } } },
      {
        $group: {
          _id: null,
          tokens: { $sum: "$tokensUsed" },
          requests: { $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] } }
        }
      }
    ]);

    const allTimeStats = await ChatLog.aggregate([
      {
        $group: {
          _id: null,
          tokens: { $sum: "$tokensUsed" },
          requests: { $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] } }
        }
      }
    ]);

    const todayTokens = todayStats[0]?.tokens || 0;
    const todayRequests = todayStats[0]?.requests || 0;
    const allTimeTokens = allTimeStats[0]?.tokens || 0;
    const allTimeRequests = allTimeStats[0]?.requests || 0;

    const sessionsData = await ChatSession.aggregate([
      {
        $lookup: {
          from: "chatlogs",
          localField: "sessionId",
          foreignField: "sessionId",
          as: "logs"
        }
      },
      {
        $project: {
          sessionId: 1,
          createdAt: 1,
          tokensUsed: { $sum: "$logs.tokensUsed" },
          totalRequests: {
            $size: {
              $filter: {
                input: "$logs",
                as: "log",
                cond: { $eq: ["$$log.role", "user"] }
              }
            }
          },
          lastActivity: {
            $ifNull: [
              { $max: "$logs.timestamp" },
              "$createdAt"
            ]
          },
          tokensUsedToday: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$logs",
                    as: "log",
                    cond: {
                      $and: [
                        { $gte: ["$$log.timestamp", startOfToday] },
                        { $eq: ["$$log.role", "assistant"] }
                      ]
                    }
                  }
                },
                as: "todayLog",
                in: "$$todayLog.tokensUsed"
              }
            }
          }
        }
      }
    ]);

    const totalSessions = sessionsData.length;
    let activeSessions = 0;
    let inactiveSessions = 0;

    const sessionBreakdown = sessionsData.map(s => {
      const isActive = s.lastActivity >= activeThreshold;
      if (isActive) {
        activeSessions++;
      } else {
        inactiveSessions++;
      }

      return {
        sessionId: s.sessionId,
        createdAt: s.createdAt,
        lastActivity: s.lastActivity,
        status: isActive ? "Active" : "Inactive",
        tokensUsed: s.tokensUsed,
        remainingTokens: Math.max(0, 3333 - (s.tokensUsedToday || 0)),
        totalRequests: s.totalRequests,
        averageTokensPerRequest: s.totalRequests > 0 ? Math.round(s.tokensUsed / s.totalRequests) : 0
      };
    });

    const averageTokensPerRequest = allTimeRequests > 0 ? Math.round(allTimeTokens / allTimeRequests) : 0;
    const averageRequestsPerSession = totalSessions > 0 ? Number((allTimeRequests / totalSessions).toFixed(1)) : 0;

    const dailyAgg = await ChatLog.aggregate([
      { $match: { timestamp: { $gte: startOf30DaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          tokens: { $sum: "$tokensUsed" },
          requests: { $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const weeklyAgg = await ChatLog.aggregate([
      { $match: { timestamp: { $gte: startOf12WeeksAgo } } },
      {
        $group: {
          _id: {
            $concat: [
              { $dateToString: { format: "%Y", date: "$timestamp" } },
              "-W",
              { $toString: { $isoWeek: "$timestamp" } }
            ]
          },
          tokens: { $sum: "$tokensUsed" },
          requests: { $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyAgg = await ChatLog.aggregate([
      { $match: { timestamp: { $gte: startOf12MonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$timestamp" } },
          tokens: { $sum: "$tokensUsed" },
          requests: { $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const sessionGrowthAgg = await ChatSession.aggregate([
      { $match: { createdAt: { $gte: startOf30DaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const baseCount = await ChatSession.countDocuments({ createdAt: { $lt: startOf30DaysAgo } });
    let cumulative = baseCount;
    const sessionGrowthData = sessionGrowthAgg.map(item => {
      cumulative += item.count;
      return {
        date: item._id,
        newSessions: item.count,
        totalSessions: cumulative
      };
    });

    const tokenDistribution = sessionBreakdown
      .sort((a, b) => b.tokensUsed - a.tokensUsed)
      .slice(0, 10)
      .map(s => ({
        session: s.sessionId.substring(0, 10) + "...",
        tokens: s.tokensUsed
      }));

    return {
      summary: {
        todayTokens,
        allTimeTokens,
        todayRequests,
        allTimeRequests,
        activeSessions,
        inactiveSessions,
        averageTokensPerRequest,
        averageRequestsPerSession
      },
      sessionBreakdown,
      graphs: {
        dailyTokens: dailyAgg.map(item => ({ date: item._id, tokens: item.tokens })),
        weeklyTokens: weeklyAgg.map(item => ({ week: item._id, tokens: item.tokens })),
        monthlyTokens: monthlyAgg.map(item => ({ month: item._id, tokens: item.tokens })),
        dailyRequests: dailyAgg.map(item => ({ date: item._id, requests: item.requests })),
        weeklyRequests: weeklyAgg.map(item => ({ week: item._id, requests: item.requests })),
        monthlyRequests: monthlyAgg.map(item => ({ month: item._id, requests: item.requests })),
        sessionGrowth: sessionGrowthData,
        tokenDistribution
      }
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
