import { Request, Response } from "express";
import { SettingsService } from "../services/settings.service.js";
import { settingsSchema } from "../validators/settings.validator.js";

export class SettingsController {
  static async get(req: Request, res: Response): Promise<void> {
    try {
      const settings = await SettingsService.get();
      if (!settings) {
        res.status(404).json({ error: "Settings not found." });
        return;
      }
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings." });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const result = settingsSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors[0].message });
        return;
      }
      const settings = await SettingsService.update(result.data);
      res.status(200).json(settings);
    } catch (error) {
      res.status(400).json({ error: "Failed to update settings." });
    }
  }
}
