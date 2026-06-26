import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { LinkItem } from "../../types";

interface LinksTabProps {
  links: LinkItem[];
  openEditForm: (item: LinkItem, type: "links") => void;
  triggerDelete: (id: string, name: string, type: "links") => void;
}

export const LinksTab: React.FC<LinksTabProps> = ({
  links,
  openEditForm,
  triggerDelete,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {links.map((l) => (
        <div key={l._id} className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between card-glow">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-sm text-foreground">{l.label}</h3>
              <span className="bg-primary/10 border border-primary/30 text-neon-green text-[9px] px-1.5 py-0.5 rounded font-mono capitalize">
                {l.icon}
              </span>
            </div>
            <p className="text-muted-foreground text-xs font-mono mb-3 break-all">{l.url}</p>
            <div className="flex flex-wrap gap-1 mb-4 text-[9px] font-mono text-muted-foreground">
              {l.showInHero && <span className="bg-muted border border-border px-1.5 py-0.5 rounded">Hero</span>}
              {l.showInFooter && <span className="bg-muted border border-border px-1.5 py-0.5 rounded">Footer</span>}
              {l.showInContact && <span className="bg-muted border border-border px-1.5 py-0.5 rounded">Contact</span>}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-border/50 pt-3">
            <button
              onClick={() => openEditForm(l, "links")}
              className="p-1 hover:text-neon-green transition-colors"
              title="Edit"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => triggerDelete(l._id, l.label, "links")}
              className="p-1 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      {links.length === 0 && (
        <div className="col-span-2 text-center py-10 text-xs text-muted-foreground">No links found.</div>
      )}
    </div>
  );
};
