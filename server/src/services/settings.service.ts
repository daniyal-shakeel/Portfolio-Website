import { Settings, ISettings } from "../models/settings.model.js";

export class SettingsService {
  static async get(): Promise<ISettings | null> {
    return Settings.findOne();
  }

  static async update(data: Partial<ISettings>): Promise<ISettings | null> {
    const settings = await Settings.findOne();
    if (!settings) {
      const newSettings = new Settings(data);
      return newSettings.save();
    }
    return Settings.findOneAndUpdate({}, data, { new: true, runValidators: true });
  }
}
