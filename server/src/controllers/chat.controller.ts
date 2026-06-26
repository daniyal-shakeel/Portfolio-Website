import { Request, Response } from "express";
import { ChatService } from "../services/chat.service.js";
import { GroqService } from "../services/groq.service.js";
import { chatSchema } from "../validators/chat.validator.js";

export class ChatController {
  static async ask(req: Request, res: Response): Promise<void> {
    try {
      const result = chatSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors[0].message });
        return;
      }

      const cookieSessionId = req.cookies?.__pw_chat_session;
      const bodySessionId = req.body.sessionId;

      if (cookieSessionId && bodySessionId && bodySessionId !== cookieSessionId) {
        res.status(400).json({ error: "Session tampering detected. Request blocked." });
        return;
      }

      const sessionId = cookieSessionId || bodySessionId;
      if (!sessionId) {
        res.status(400).json({ error: "Session ID is required." });
        return;
      }

      const isValid = await ChatService.isValidSession(sessionId);
      if (!isValid) {
        res.status(400).json({ error: "Invalid or expired chat session. Please refresh the page." });
        return;
      }

      if (!cookieSessionId) {
        res.cookie("__pw_chat_session", sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });
      }

      const { message } = result.data;
      const tokensUsedToday = await ChatService.getSessionTokensUsed(sessionId);
      
      const defaultDailyLimit = 10000;
      const sessionLimit = Math.floor(defaultDailyLimit / 3);

      if (tokensUsedToday >= sessionLimit) {
        res.status(429).json({
          error: "Daily session token limit exceeded. Please try again tomorrow.",
          usage: tokensUsedToday,
          limit: sessionLimit
        });
        return;
      }

      const history = await ChatService.getHistory(sessionId);
      const completion = await GroqService.getCompletion(message, history);

      await ChatService.logMessage(sessionId, "user", message, 0);
      await ChatService.logMessage(sessionId, "assistant", completion.reply, completion.totalTokens);

      const updatedTokensUsed = tokensUsedToday + completion.totalTokens;

      res.status(200).json({
        reply: completion.reply,
        tokensUsed: completion.totalTokens,
        sessionUsageToday: updatedTokensUsed,
        sessionLimit
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to call AI Assistant." });
    }
  }

  static async getSessionStatus(req: Request, res: Response): Promise<void> {
    try {
      const cookieSessionId = req.cookies?.__pw_chat_session;
      const querySessionId = req.query.sessionId as string;

      if (cookieSessionId && querySessionId && querySessionId !== cookieSessionId) {
        res.status(400).json({ error: "Session tampering detected. Request blocked." });
        return;
      }

      const sessionId = cookieSessionId || querySessionId;
      if (!sessionId) {
        res.status(200).json({ usage: 0, limit: 33333 });
        return;
      }

      const isValid = await ChatService.isValidSession(sessionId);
      if (!isValid) {
        res.status(400).json({ error: "Session not found or invalid." });
        return;
      }

      if (!cookieSessionId) {
        res.cookie("__pw_chat_session", sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });
      }

      const tokensUsedToday = await ChatService.getSessionTokensUsed(sessionId);
      const sessionLimit = Math.floor(10000 / 3);

      res.status(200).json({
        usage: tokensUsedToday,
        limit: sessionLimit
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session status." });
    }
  }

  static async createSession(req: Request, res: Response): Promise<void> {
    try {
      const cookieSessionId = req.cookies?.__pw_chat_session;
      if (cookieSessionId) {
        const isValid = await ChatService.isValidSession(cookieSessionId);
        if (isValid) {
          res.status(200).json({ sessionId: cookieSessionId });
          return;
        }
      }

      const sessionId = await ChatService.createSession();

      res.cookie("__pw_chat_session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ sessionId });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create chat session." });
    }
  }

  static async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const logs = await ChatService.getAllLogs();
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat logs." });
    }
  }

  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await ChatService.getStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat statistics." });
    }
  }
}
