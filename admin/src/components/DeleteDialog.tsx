import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
  deleteName: string;
  deleteType: string;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  submitting,
  deleteName,
  deleteType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-red-900/50 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-red-950/20 border-b border-red-900/30 px-4 py-2.5 flex items-center justify-between text-red-400">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} />
            <span className="text-xs font-bold font-mono">WARNING: destructive action</span>
          </div>
          <button onClick={onClose} className="text-red-400 hover:text-red-300">
            <X size={14} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-muted-foreground">
            Confirm record removal. This cannot be undone.
          </p>
          <div className="bg-muted/60 border border-border rounded p-3 font-mono text-[11px] space-y-1.5">
            <div className="text-muted-foreground">admin@daniyal.dev:~$</div>
            <div className="text-red-400 font-semibold break-all">
              rm -rf ./{deleteType}/{deleteName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 border border-border text-foreground hover:bg-muted py-2 rounded text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={submitting}
              className="flex-1 bg-red-650 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {submitting ? "Deleting..." : "Delete Record"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
