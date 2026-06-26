import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { LearningItem } from "../../types";

interface LearningTabProps {
  learningList: LearningItem[];
  openEditForm: (item: LearningItem, type: "learning") => void;
  triggerDelete: (id: string, name: string, type: "learning") => void;
}

export const LearningTab: React.FC<LearningTabProps> = ({
  learningList,
  openEditForm,
  triggerDelete,
}) => {
  return (
    <div className="space-y-4">
      {learningList.map((item) => (
        <div key={item._id} className="bg-card border border-border rounded-lg p-5 flex items-center justify-between gap-4 card-glow">
          <div className="space-y-1 flex-1">
            <h3 className="font-bold text-sm text-neon-green">{item.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditForm(item, "learning")}
              className="p-1 hover:text-neon-green transition-colors"
              title="Edit"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => triggerDelete(item._id, item.name, "learning")}
              className="p-1 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      {learningList.length === 0 && (
        <div className="text-center py-10 text-xs text-muted-foreground">No learning items found.</div>
      )}
    </div>
  );
};
