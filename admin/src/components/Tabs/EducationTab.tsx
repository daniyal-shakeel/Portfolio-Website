import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { Education } from "../../types";

interface EducationTabProps {
  educationList: Education[];
  openEditForm: (item: Education, type: "education") => void;
  triggerDelete: (id: string, name: string, type: "education") => void;
}

export const EducationTab: React.FC<EducationTabProps> = ({
  educationList,
  openEditForm,
  triggerDelete,
}) => {
  return (
    <div className="space-y-4">
      {educationList.map((edu) => (
        <div key={edu._id} className="bg-card border border-border rounded-lg p-5 flex items-start justify-between gap-4 card-glow">
          <div className="space-y-1 flex-1">
            <h3 className="font-bold text-sm text-neon-green">{edu.degree}</h3>
            <div className="text-xs text-foreground">{edu.institution}</div>
            <div className="text-[10px] text-muted-foreground">
              {edu.startDate} – {edu.endDate} {edu.gpa ? `· ${edu.gpa}` : ""}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditForm(edu, "education")}
              className="p-1 hover:text-neon-green transition-colors"
              title="Edit"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => triggerDelete(edu._id, `${edu.degree} @ ${edu.institution}`, "education")}
              className="p-1 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      {educationList.length === 0 && (
        <div className="text-center py-10 text-xs text-muted-foreground">No education records found.</div>
      )}
    </div>
  );
};
