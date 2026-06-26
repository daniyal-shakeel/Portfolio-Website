import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { Skill } from "../../types";

interface SkillsTabProps {
  skills: Skill[];
  openEditForm: (item: Skill, type: "skills") => void;
  triggerDelete: (id: string, name: string, type: "skills") => void;
}

export const SkillsTab: React.FC<SkillsTabProps> = ({
  skills,
  openEditForm,
  triggerDelete,
}) => {
  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <div key={skill._id} className="bg-card border border-border rounded-lg p-5 flex items-start justify-between gap-4 card-glow">
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-sm text-neon-cyan">"{skill.label}"</h3>
            <div className="flex flex-wrap gap-1.5">
              {skill.items.map((i) => (
                <span key={i} className="bg-muted border border-border text-foreground text-[10px] px-2.5 py-1 rounded">
                  {i}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditForm(skill, "skills")}
              className="p-1 hover:text-neon-green transition-colors"
              title="Edit"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => triggerDelete(skill._id, skill.label, "skills")}
              className="p-1 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      {skills.length === 0 && (
        <div className="text-center py-10 text-xs text-muted-foreground">No skill categories found.</div>
      )}
    </div>
  );
};
