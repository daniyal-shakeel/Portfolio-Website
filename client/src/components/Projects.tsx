import { useState, useEffect } from "react";
import { Star, ExternalLink, X, Github, Globe } from "lucide-react";
import { toast } from "sonner";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface Project {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  longDescription?: string;
  thumbnail?: string;
  isPrivate?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const getThumbnailUrl = (thumbnail?: string) => {
  if (!thumbnail) return "/placeholder.svg";
  return thumbnail.startsWith("http") ? thumbnail : `${API_BASE_URL}${thumbnail}`;
};

const handleRepoSoon = (e: React.MouseEvent) => {
  e.preventDefault();
  toast("Repository link coming soon.");
};

const handleDemoSoon = (e: React.MouseEvent) => {
  e.preventDefault();
  toast("Live demo coming soon.");
};

const Projects = () => {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects`);
        if (res.ok) {
          const data = await res.json();
          const sorted = [...data].sort((a: Project, b: Project) => {
            const aFeatured = !!a.featured;
            const bFeatured = !!b.featured;
            if (aFeatured && !bFeatured) return -1;
            if (!aFeatured && bFeatured) return 1;
            return 0;
          });
          setProjectsList(sorted);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  const renderMarkdown = (text: string) => {
    const rawHtml = marked.parse(text) as string;
    return { __html: DOMPurify.sanitize(rawHtml) };
  };

  return (
    <section id="projects" className="py-20">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        <h2 className="text-2xl font-mono text-neon-green font-bold">
          <span className="text-muted-foreground">$</span> ls -la ./projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projectsList.map((project) => (
            <div
              key={project._id}
              onClick={() => setSelectedProject(project)}
              className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(var(--primary),0.08)] card-glow"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border">
                <img
                  src={getThumbnailUrl(project.thumbnail)}
                  alt={project.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {project.featured && (
                  <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md border border-border/80 px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                    <Star size={12} className="text-neon-green" fill="currentColor" />
                    <span className="text-[10px] font-bold text-foreground font-mono">PRIMARY</span>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    {project.name}
                    {project.isPrivate && (
                      <span className="bg-red-950/40 border border-red-900/50 text-red-400 text-[9px] font-mono px-1.5 py-0.5 rounded">
                        PRIVATE
                      </span>
                    )}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-muted text-foreground text-[10px] font-mono px-2 py-0.5 rounded border border-border/60">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-muted-foreground text-[10px] font-mono px-1 py-0.5">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projectsList.length === 0 && (
          <div className="text-center py-10 text-xs text-muted-foreground">No projects found.</div>
        )}
      </div>

      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in-up"
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 bg-background/60 hover:bg-background/90 text-foreground hover:text-primary p-2 rounded-full border border-border/80 transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex justify-between items-center px-6 py-3 bg-muted/20 border-b border-border/40">
              <a
                href={getThumbnailUrl(selectedProject.thumbnail)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-neon-cyan hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink size={12} />
                See Full Image
              </a>
            </div>

            <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border">
              <img
                src={getThumbnailUrl(selectedProject.thumbnail)}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {selectedProject.featured && (
                      <Star size={18} className="text-neon-green" fill="currentColor" />
                    )}
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      {selectedProject.name}
                      {selectedProject.isPrivate && (
                        <span className="bg-red-950/40 border border-red-900/50 text-red-400 text-[10px] font-mono px-2 py-0.5 rounded">
                          PRIVATE
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-xs italic font-mono">{selectedProject.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <span key={tag} className="bg-muted text-foreground text-xs font-mono px-2.5 py-1 rounded border border-border/80 pill-glow transition-all">
                    {tag}
                  </span>
                ))}
              </div>

              {selectedProject.longDescription && (
                <div className="border-t border-border/60 pt-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary font-mono">Project Breakdown</h4>
                  <div
                    className="markdown-content text-muted-foreground text-xs font-mono leading-relaxed space-y-2"
                    dangerouslySetInnerHTML={renderMarkdown(selectedProject.longDescription)}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border/60">
                {selectedProject.isPrivate ? (
                  <div className="w-full bg-muted/30 border border-border/60 rounded-lg p-4 space-y-1">
                    <div className="text-xs font-bold text-foreground font-mono">Private Repository</div>
                    <div className="text-[11px] text-muted-foreground italic font-mono">
                      Ask the developer to view the source code and give email direct link.
                    </div>
                  </div>
                ) : (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={selectedProject.github === "#" ? handleRepoSoon : undefined}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    <Github size={14} />
                    <span>View Source</span>
                  </a>
                )}
                {selectedProject.demo && (
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={selectedProject.demo === "#" ? handleDemoSoon : undefined}
                    className="flex items-center gap-2 border border-border hover:border-primary/50 text-foreground px-5 py-2.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Globe size={14} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
