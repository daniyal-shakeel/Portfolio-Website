import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { Experience } from "../../types";

interface ExperienceTabProps {
  experiences: Experience[];
  openEditForm: (item: Experience, type: "experience") => void;
  triggerDelete: (id: string, name: string, type: "experience") => void;
}

export const ExperienceTab: React.FC<ExperienceTabProps> = ({
  experiences,
  openEditForm,
  triggerDelete,
}) => {
  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <div key={exp._id} className="bg-card border border-border border-l-4 border-l-primary rounded-lg p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 card-glow">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="font-bold text-sm text-foreground">{exp.role}</h3>
              <span className="text-xs text-neon-green">{exp.company}</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {exp.location} · {exp.startDate} – {exp.endDate}
            </div>
            <ul className="list-inside space-y-1 mt-2 text-xs text-muted-foreground">
              {exp.bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-neon-green shrink-0">→</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2 self-end md:self-start">
            <button
              onClick={() => openEditForm(exp, "experience")}
              className="p-1 hover:text-neon-green transition-colors"
              title="Edit"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => triggerDelete(exp._id, `${exp.role} @ ${exp.company}`, "experience")}
              className="p-1 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      {experiences.length === 0 && (
        <div className="text-center py-10 text-xs text-muted-foreground">No experience records found.</div>
      )}
    </div>
  );
};
