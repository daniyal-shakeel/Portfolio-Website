import React from "react";
import { ChevronDown } from "lucide-react";

interface SettingsTabProps {
  settingsLogoText: string;
  setSettingsLogoText: (val: string) => void;
  settingsSubheading: string;
  setSettingsSubheading: (val: string) => void;
  settingsStatus: string;
  setSettingsStatus: (val: string) => void;
  settingsPalette: string;
  setSettingsPalette: (val: string) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settingsLogoText,
  setSettingsLogoText,
  settingsSubheading,
  setSettingsSubheading,
  settingsStatus,
  setSettingsStatus,
  settingsPalette,
  setSettingsPalette,
  handleFormSubmit,
  submitting,
}) => {
  return (
    <form onSubmit={handleFormSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-xl card-glow">
      <div className="space-y-1">
        <label className="text-[11px] text-neon-green">Logo Text</label>
        <input
          type="text"
          required
          value={settingsLogoText}
          onChange={(e) => setSettingsLogoText(e.target.value)}
          placeholder="e.g. daniyal.dev"
          className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[11px] text-neon-green">Subheading Title</label>
        <input
          type="text"
          required
          value={settingsSubheading}
          onChange={(e) => setSettingsSubheading(e.target.value)}
          placeholder="e.g. Full-Stack Developer · AI Integration Enthusiast"
          className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[11px] text-neon-green">Open to Work Status</label>
        <div className="relative">
          <select
            value={settingsStatus}
            onChange={(e) => setSettingsStatus(e.target.value)}
            className="w-full bg-muted border border-border rounded px-3 py-2 pr-10 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono appearance-none cursor-pointer hover:border-neon-green/50 transition-colors"
          >
            <option value="open">Open to work</option>
            <option value="collaborate">Open to collaborating</option>
            <option value="busy">Busy building</option>
            <option value="hidden">Hidden (Do not display)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 pointer-events-none" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[11px] text-neon-green">Active Theme Color Palette</label>
        <div className="relative">
          <select
            value={settingsPalette}
            onChange={(e) => setSettingsPalette(e.target.value)}
            className="w-full bg-muted border border-border rounded px-3 py-2 pr-10 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono appearance-none cursor-pointer hover:border-neon-green/50 transition-colors"
          >
            <option value="matrix">Matrix (Green & Cyan)</option>
            <option value="dracula">Dracula (Violet & Hot Pink)</option>
            <option value="nordic">Nordic (Arctic Blue & Teal)</option>
            <option value="sunset">Sunset (Amber & Rose Red)</option>
            <option value="amber">Retro Amber (Phosphor Gold)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 pointer-events-none" />
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded text-xs transition-opacity hover:opacity-90 disabled:opacity-50 mt-4 flex items-center justify-center gap-1.5"
      >
        {submitting ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
};
