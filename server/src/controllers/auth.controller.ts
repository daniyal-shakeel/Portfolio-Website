import { Request, Response } from "express";
import { loginSchema } from "../validators/auth.validator.js";
import { AuthService } from "../services/auth.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0].message });
      return;
    }

    const { username, password } = result.data;
    const token = await AuthService.verifyCredentials(username, password);

    if (!token) {
      res.status(401).json({ error: "Invalid credentials." });
      return;
    }

    res.cookie("__pw_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, username });
  }

  static async verify(req: AuthenticatedRequest, res: Response): Promise<void> {
    res.status(200).json({ authenticated: true, username: req.user?.username });
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("__pw_admin_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ success: true });
  }
}
