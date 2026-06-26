import React from "react";
import type { CvMetadata } from "../../types";

interface CvTabProps {
  cvMetadata: CvMetadata | null;
  API_BASE_URL: string;
  handleDeleteCv: () => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  triggerFileSelect: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dragActive: boolean;
  uploadingCv: boolean;
}

export const CvTab: React.FC<CvTabProps> = ({
  cvMetadata,
  API_BASE_URL,
  handleDeleteCv,
  handleDrag,
  handleDrop,
  triggerFileSelect,
  handleFileChange,
  dragActive,
  uploadingCv,
}) => {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      {cvMetadata?.exists ? (
        <div className="bg-card border border-border rounded-lg p-6 card-glow space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded border border-primary/20 text-neon-green">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-foreground">{cvMetadata.filename}</h4>
              <p className="text-[10px] text-muted-foreground font-mono">
                Uploaded: {cvMetadata.uploadedAt ? new Date(cvMetadata.uploadedAt).toLocaleString() : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <a
              href={`${API_BASE_URL}/api/cv/download`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-primary text-primary-foreground font-semibold py-2 rounded text-xs text-center hover:opacity-90 transition-opacity"
            >
              Download CV
            </a>
            <button
              onClick={handleDeleteCv}
              className="flex-1 bg-red-950/20 border border-red-900/50 hover:bg-red-900/20 text-red-400 font-semibold py-2 rounded text-xs transition-colors"
            >
              Delete CV
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
            dragActive
              ? "border-primary bg-primary/10 glow-green"
              : "border-border hover:border-primary/50 hover:bg-card-glow/5"
          }`}
        >
          <input
            type="file"
            id="cv-file-input"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <div className={`p-4 rounded-full border transition-colors ${
            dragActive ? "bg-primary/20 border-primary text-neon-green" : "bg-muted border-border text-muted-foreground"
          }`}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          {uploadingCv ? (
            <div className="space-y-1">
              <p className="text-xs font-bold text-neon-green">Uploading CV document...</p>
              <p className="text-[10px] text-muted-foreground font-mono animate-blink">Please wait... ▊</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs font-bold text-foreground">
                {dragActive ? "Drop the PDF here!" : "Drag & drop your CV (PDF) here"}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                or click to browse local files (Max 5MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
