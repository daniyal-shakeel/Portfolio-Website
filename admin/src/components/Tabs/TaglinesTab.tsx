import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { Tagline } from "../../types";

interface TaglinesTabProps {
  taglines: Tagline[];
  openEditForm: (item: Tagline, type: "taglines") => void;
  triggerDelete: (id: string, name: string, type: "taglines") => void;
}

export const TaglinesTab: React.FC<TaglinesTabProps> = ({
  taglines,
  openEditForm,
  triggerDelete,
}) => {
  return (
    <div className="space-y-4">
      {taglines.map((t) => (
        <div key={t._id} className="bg-card border border-border rounded-lg p-5 flex items-center justify-between gap-4 card-glow">
          <div className="font-mono text-xs text-foreground flex-1 break-all">
            {t.text}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditForm(t, "taglines")}
              className="p-1 hover:text-neon-green transition-colors"
              title="Edit"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => triggerDelete(t._id, t.text, "taglines")}
              className="p-1 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      {taglines.length === 0 && (
        <div className="text-center py-10 text-xs text-muted-foreground">No taglines found.</div>
      )}
    </div>
  );
};
