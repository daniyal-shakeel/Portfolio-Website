import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { StatItem } from "../../types";

interface StatsTabProps {
  statsList: StatItem[];
  openEditForm: (item: StatItem, type: "stats") => void;
  triggerDelete: (id: string, name: string, type: "stats") => void;
}

export const StatsTab: React.FC<StatsTabProps> = ({
  statsList,
  openEditForm,
  triggerDelete,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {statsList.map((s) => (
        <div key={s._id} className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between card-glow">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-sm text-foreground">{s.label}</h3>
              <span className="bg-primary/10 border border-primary/30 text-neon-green text-[9px] px-1.5 py-0.5 rounded font-mono">
                Order: {s.sortOrder}
              </span>
            </div>
            <p className="text-neon-green text-sm font-mono mb-2">{s.value}</p>
            {s.tooltip && (
              <p className="text-muted-foreground text-xs italic font-mono mb-3">
                Tooltip: "{s.tooltip}"
              </p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-border/50 pt-3">
            <button
              onClick={() => openEditForm(s, "stats")}
              className="p-1 hover:text-neon-green transition-colors"
              title="Edit"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => triggerDelete(s._id, s.label, "stats")}
              className="p-1 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      {statsList.length === 0 && (
        <div className="col-span-2 text-center py-10 text-xs text-muted-foreground">No figures found.</div>
      )}
    </div>
  );
};
