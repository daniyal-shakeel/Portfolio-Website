import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    username: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const cookieToken = req.cookies?.__dca_admin_token;
  let token = cookieToken;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    res.status(401).json({ error: "Access denied. No session token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { username: string };
    req.user = { username: decoded.username };
    next();
  } catch (error) {
    res.status(401).json({ error: "Access denied. Invalid session token." });
  }
}
