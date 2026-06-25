import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export class AuthService {
  static async verifyCredentials(username: string, password: string): Promise<string | null> {
    if (username === config.adminUsername && password === config.adminPassword) {
      return jwt.sign({ username }, config.jwtSecret, { expiresIn: "1d" });
    }
    return null;
  }
}
