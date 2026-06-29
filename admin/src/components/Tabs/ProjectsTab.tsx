import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { Project } from "../../types";

interface ProjectsTabProps {
  projects: Project[];
  API_BASE_URL: string;
  openEditForm: (item: Project, type: "projects") => void;
  triggerDelete: (id: string, name: string, type: "projects") => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  API_BASE_URL,
  openEditForm,
  triggerDelete,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {projects.map((p) => (
        <div key={p._id} className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between card-glow">
          <div>
            {p.thumbnail && (
              <div className="w-full aspect-video rounded-md overflow-hidden border border-border bg-muted mb-3">
                <img
                  src={p.thumbnail.startsWith("http") ? p.thumbnail : `${API_BASE_URL}${p.thumbnail}`}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-sm text-foreground">{p.name}</h3>
              {p.featured && (
                <span className="bg-primary/10 border border-primary/30 text-neon-green text-[9px] px-1.5 py-0.5 rounded font-mono">
                  Featured
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-xs mb-3 italic">{p.description}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {p.tags.map((t) => (
                <span key={t} className="bg-muted border border-border text-muted-foreground text-[10px] px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border/50 pt-3 text-[11px]">
            {p.isPrivate ? (
              <span className="text-muted-foreground italic font-mono">Private Repository</span>
            ) : (
              <a href={p.github} target="_blank" rel="noreferrer" className="text-neon-cyan hover:underline">
                github.com/source
              </a>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditForm(p, "projects")}
                className="p-1 hover:text-neon-green transition-colors"
                title="Edit"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => triggerDelete(p._id, p.name, "projects")}
                className="p-1 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
      {projects.length === 0 && (
        <div className="col-span-2 text-center py-10 text-xs text-muted-foreground">No projects found.</div>
      )}
    </div>
  );
};
