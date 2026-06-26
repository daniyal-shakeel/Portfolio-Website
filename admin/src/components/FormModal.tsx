import React from "react";
import { X } from "lucide-react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  activeTab: string;
  editingId: string | null;
  submitting: boolean;

  projectName: string;
  setProjectName: (val: string) => void;
  projectDesc: string;
  setProjectDesc: (val: string) => void;
  projectTags: string;
  setProjectTags: (val: string) => void;
  projectGithub: string;
  setProjectGithub: (val: string) => void;
  projectDemo: string;
  setProjectDemo: (val: string) => void;
  projectFeatured: boolean;
  setProjectFeatured: (val: boolean) => void;
  projectLongDesc: string;
  setProjectLongDesc: (val: string) => void;
  projectThumbnail: string;
  setProjectThumbnail: (val: string) => void;
  uploadingThumbnail: boolean;
  handleThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  API_BASE_URL: string;

  expRole: string;
  setExpRole: (val: string) => void;
  expCompany: string;
  setExpCompany: (val: string) => void;
  expLocation: string;
  setExpLocation: (val: string) => void;
  expStart: string;
  setExpStart: (val: string) => void;
  expEnd: string;
  setExpEnd: (val: string) => void;
  expBullets: string;
  setExpBullets: (val: string) => void;

  skillKey: string;
  setSkillKey: (val: string) => void;
  skillLabel: string;
  setSkillLabel: (val: string) => void;
  skillItems: string;
  setSkillItems: (val: string) => void;

  eduDegree: string;
  setEduDegree: (val: string) => void;
  eduInstitution: string;
  setEduInstitution: (val: string) => void;
  eduStart: string;
  setEduStart: (val: string) => void;
  eduEnd: string;
  setEduEnd: (val: string) => void;
  eduGpa: string;
  setEduGpa: (val: string) => void;

  learningName: string;
  setLearningName: (val: string) => void;

  taglineText: string;
  setTaglineText: (val: string) => void;

  linkLabel: string;
  setLinkLabel: (val: string) => void;
  linkUrl: string;
  setLinkUrl: (val: string) => void;
  linkIcon: string;
  setLinkIcon: (val: string) => void;
  linkHero: boolean;
  setLinkHero: (val: boolean) => void;
  linkFooter: boolean;
  setLinkFooter: (val: boolean) => void;
  linkContact: boolean;
  setLinkContact: (val: boolean) => void;

  statLabel: string;
  setStatLabel: (val: string) => void;
  statValue: string;
  setStatValue: (val: string) => void;
  statTooltip: string;
  setStatTooltip: (val: string) => void;
  statSortOrder: number;
  setStatSortOrder: (val: number) => void;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  activeTab,
  editingId,
  submitting,

  projectName,
  setProjectName,
  projectDesc,
  setProjectDesc,
  projectTags,
  setProjectTags,
  projectGithub,
  setProjectGithub,
  projectDemo,
  setProjectDemo,
  projectFeatured,
  setProjectFeatured,
  projectLongDesc,
  setProjectLongDesc,
  projectThumbnail,
  setProjectThumbnail,
  uploadingThumbnail,
  handleThumbnailUpload,
  API_BASE_URL,

  expRole,
  setExpRole,
  expCompany,
  setExpCompany,
  expLocation,
  setExpLocation,
  expStart,
  setExpStart,
  expEnd,
  setExpEnd,
  expBullets,
  setExpBullets,

  skillKey,
  setSkillKey,
  skillLabel,
  setSkillLabel,
  skillItems,
  setSkillItems,

  eduDegree,
  setEduDegree,
  eduInstitution,
  setEduInstitution,
  eduStart,
  setEduStart,
  eduEnd,
  setEduEnd,
  eduGpa,
  setEduGpa,

  learningName,
  setLearningName,

  taglineText,
  setTaglineText,

  linkLabel,
  setLinkLabel,
  linkUrl,
  setLinkUrl,
  linkIcon,
  setLinkIcon,
  linkHero,
  setLinkHero,
  linkFooter,
  setLinkFooter,
  linkContact,
  setLinkContact,

  statLabel,
  setStatLabel,
  statValue,
  setStatValue,
  statTooltip,
  setStatTooltip,
  statSortOrder,
  setStatSortOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="bg-muted/40 border-b border-border px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-bold text-foreground font-mono">
            {editingId ? "$ nano ./edit_record" : "$ nano ./create_record"}
          </span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {activeTab === "projects" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Project Name</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. NextFit — Virtual Try-On E-Commerce"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Brief Description</label>
                <input
                  type="text"
                  required
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="e.g. Because online shopping needed to stop being a gambling addiction."
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Tags (Comma-separated)</label>
                <input
                  type="text"
                  required
                  value={projectTags}
                  onChange={(e) => setProjectTags(e.target.value)}
                  placeholder="React, TypeScript, Python"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">GitHub URL</label>
                <input
                  type="text"
                  required
                  value={projectGithub}
                  onChange={(e) => setProjectGithub(e.target.value)}
                  placeholder="e.g. https://github.com/daniyal-shakeel/nextfit"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Demo URL (Optional)</label>
                <input
                  type="text"
                  value={projectDemo}
                  onChange={(e) => setProjectDemo(e.target.value)}
                  placeholder="e.g. https://nextfit.dev (Optional)"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="flex items-center pt-2">
                <label htmlFor="featured" className="flex items-center gap-3 cursor-pointer select-none group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={projectFeatured}
                      onChange={(e) => setProjectFeatured(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-8 h-4 rounded-full transition-colors duration-300 border ${
                      projectFeatured ? "bg-primary/20 border-primary" : "bg-muted border-border group-hover:border-muted-foreground/60"
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full absolute top-[3px] transition-all duration-300 ${
                        projectFeatured ? "bg-primary left-[19px]" : "bg-muted-foreground left-[3px]"
                      }`} />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                    Feature this project on top
                  </span>
                </label>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Project Thumbnail</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    id="thumbnail-file-input"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("thumbnail-file-input")?.click()}
                    disabled={uploadingThumbnail}
                    className="px-3 py-1.5 bg-muted border border-border rounded text-xs text-foreground font-mono hover:border-primary/50 transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    {uploadingThumbnail ? "Uploading..." : "Choose Image"}
                  </button>
                  {projectThumbnail && (
                    <button
                      type="button"
                      onClick={() => setProjectThumbnail("")}
                      className="px-3 py-1.5 bg-red-950/20 border border-red-900/50 hover:bg-red-900/20 text-red-400 rounded text-xs font-mono transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {projectThumbnail && (
                  <div className="mt-2 relative w-32 aspect-video overflow-hidden rounded border border-border bg-muted">
                    <img
                      src={projectThumbnail.startsWith("http") ? projectThumbnail : `${API_BASE_URL}${projectThumbnail}`}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Detailed Description (Markdown-ready, Optional)</label>
                <textarea
                  value={projectLongDesc}
                  onChange={(e) => setProjectLongDesc(e.target.value)}
                  rows={4}
                  placeholder="e.g. AI-powered virtual try-on with pose detection... (Optional)"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green font-mono"
                />
              </div>
            </>
          )}

          {activeTab === "experience" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Role Title</label>
                  <input
                    type="text"
                    required
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    placeholder="e.g. Software Engineer Intern"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Company Name</label>
                  <input
                    type="text"
                    required
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    placeholder="e.g. Boolmind"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Location</label>
                <input
                  type="text"
                  required
                  value={expLocation}
                  onChange={(e) => setExpLocation(e.target.value)}
                  placeholder="Lahore, Pakistan"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Start Date</label>
                  <input
                    type="text"
                    required
                    value={expStart}
                    onChange={(e) => setExpStart(e.target.value)}
                    placeholder="11 Sep 2025"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">End Date</label>
                  <input
                    type="text"
                    required
                    value={expEnd}
                    onChange={(e) => setExpEnd(e.target.value)}
                    placeholder="Dec 2025 or Present"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Responsibilities (One bullet per line)</label>
                <textarea
                  required
                  value={expBullets}
                  onChange={(e) => setExpBullets(e.target.value)}
                  rows={4}
                  placeholder="Contributed to internal tooling&#10;Maintained features"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green font-mono"
                />
              </div>
            </>
          )}

          {activeTab === "skills" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Category Key (URL/ID safe)</label>
                <input
                  type="text"
                  required
                  value={skillKey}
                  onChange={(e) => setSkillKey(e.target.value)}
                  placeholder="languages"
                  disabled={!!editingId}
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green disabled:opacity-60"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Category Label</label>
                <input
                  type="text"
                  required
                  value={skillLabel}
                  onChange={(e) => setSkillLabel(e.target.value)}
                  placeholder="Languages & Frameworks"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Skill Items (Comma-separated)</label>
                <input
                  type="text"
                  required
                  value={skillItems}
                  onChange={(e) => setSkillItems(e.target.value)}
                  placeholder="JavaScript, TypeScript, Python"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
            </>
          )}

          {activeTab === "education" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Degree Program</label>
                <input
                  type="text"
                  required
                  value={eduDegree}
                  onChange={(e) => setEduDegree(e.target.value)}
                  placeholder="B.S. Computer Science"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Institution</label>
                <input
                  type="text"
                  required
                  value={eduInstitution}
                  onChange={(e) => setEduInstitution(e.target.value)}
                  placeholder="University of Central Punjab"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Start Year</label>
                  <input
                    type="text"
                    required
                    value={eduStart}
                    onChange={(e) => setEduStart(e.target.value)}
                    placeholder="2021"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">End Year / Status</label>
                  <input
                    type="text"
                    required
                    value={eduEnd}
                    onChange={(e) => setEduEnd(e.target.value)}
                    placeholder="2025 or 2025 (Final Year)"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">GPA / Details (Optional)</label>
                <input
                  type="text"
                  value={eduGpa}
                  onChange={(e) => setEduGpa(e.target.value)}
                  placeholder="CGPA: 3.3"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
            </>
          )}

          {activeTab === "learning" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Learning Topic / Technology</label>
                <input
                  type="text"
                  required
                  value={learningName}
                  onChange={(e) => setLearningName(e.target.value)}
                  placeholder="e.g. NestJS"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
            </>
          )}

          {activeTab === "taglines" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Tagline Text</label>
                <input
                  type="text"
                  required
                  value={taglineText}
                  onChange={(e) => setTaglineText(e.target.value)}
                  placeholder="e.g. Architecting clean systems for modern web frameworks."
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
            </>
          )}

          {activeTab === "links" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Link Label</label>
                  <input
                    type="text"
                    required
                    value={linkLabel}
                    onChange={(e) => setLinkLabel(e.target.value)}
                    placeholder="e.g. GitHub"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Icon Identifier</label>
                  <input
                    type="text"
                    required
                    value={linkIcon}
                    onChange={(e) => setLinkIcon(e.target.value)}
                    placeholder="e.g. github, linkedin, external-link"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Full Destination URL</label>
                <input
                  type="url"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g. https://github.com/daniyal-shakeel"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green font-mono"
                />
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center">
                  <label htmlFor="linkHero" className="flex items-center gap-3 cursor-pointer select-none group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="linkHero"
                        checked={linkHero}
                        onChange={(e) => setLinkHero(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full transition-colors duration-300 border ${
                        linkHero ? "bg-primary/20 border-primary" : "bg-muted border-border group-hover:border-muted-foreground/60"
                      }`}>
                        <div className={`w-2.5 h-2.5 rounded-full absolute top-[3px] transition-all duration-300 ${
                          linkHero ? "bg-primary left-[19px]" : "bg-muted-foreground left-[3px]"
                        }`} />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                      Show in Hero Section
                    </span>
                  </label>
                </div>
                <div className="flex items-center">
                  <label htmlFor="linkFooter" className="flex items-center gap-3 cursor-pointer select-none group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="linkFooter"
                        checked={linkFooter}
                        onChange={(e) => setLinkFooter(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full transition-colors duration-300 border ${
                        linkFooter ? "bg-primary/20 border-primary" : "bg-muted border-border group-hover:border-muted-foreground/60"
                      }`}>
                        <div className={`w-2.5 h-2.5 rounded-full absolute top-[3px] transition-all duration-300 ${
                          linkFooter ? "bg-primary left-[19px]" : "bg-muted-foreground left-[3px]"
                        }`} />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                      Show in Footer Section
                    </span>
                  </label>
                </div>
                <div className="flex items-center">
                  <label htmlFor="linkContact" className="flex items-center gap-3 cursor-pointer select-none group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="linkContact"
                        checked={linkContact}
                        onChange={(e) => setLinkContact(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full transition-colors duration-300 border ${
                        linkContact ? "bg-primary/20 border-primary" : "bg-muted border-border group-hover:border-muted-foreground/60"
                      }`}>
                        <div className={`w-2.5 h-2.5 rounded-full absolute top-[3px] transition-all duration-300 ${
                          linkContact ? "bg-primary left-[19px]" : "bg-muted-foreground left-[3px]"
                        }`} />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                      Show in Contact Section
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}

          {activeTab === "stats" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Figure Label</label>
                <input
                  type="text"
                  required
                  value={statLabel}
                  onChange={(e) => setStatLabel(e.target.value)}
                  placeholder="e.g. Total Projects"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Figure Value</label>
                <input
                  type="text"
                  required
                  value={statValue}
                  onChange={(e) => setStatValue(e.target.value)}
                  placeholder="e.g. 18+ or 3"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Hover Tooltip (Optional)</label>
                <input
                  type="text"
                  value={statTooltip}
                  onChange={(e) => setStatTooltip(e.target.value)}
                  placeholder="e.g. send help or copy/paste (Optional)"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Sort Order</label>
                <input
                  type="number"
                  required
                  value={statSortOrder}
                  onChange={(e) => setStatSortOrder(Number(e.target.value))}
                  placeholder="e.g. 0"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green font-mono"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border text-foreground hover:bg-muted py-2 rounded text-xs transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary text-primary-foreground font-semibold py-2 rounded text-xs transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {submitting ? "Processing..." : "Commit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
