import { useState, useEffect } from "react";
import { Star, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Project {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  featured?: boolean;
  longDescription?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects`);
        if (res.ok) {
          const data = await res.json();
          setProjectsList(data);
        }
      } catch (err) {
      }
    };
    fetchProjects();
  }, []);

  const featured = projectsList.find((p) => p.featured);
  const secondary = projectsList.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-20">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        <h2 className="text-2xl font-mono text-neon-green font-bold">
          <span className="text-muted-foreground">$</span> ls -la ./projects
        </h2>

        {featured && (
          <div className="bg-card border border-primary/30 rounded-lg p-8 card-glow">
            <div className="flex items-center gap-2 mb-3">
              <Star size={18} className="text-neon-green" fill="currentColor" />
              <h3 className="text-xl font-bold text-foreground">{featured.name}</h3>
            </div>
            <p className="text-muted-foreground text-sm italic mb-4">{featured.description}</p>
            {featured.longDescription && (
              <pre className="text-muted-foreground text-xs font-mono whitespace-pre-wrap leading-relaxed mb-4">
                {featured.longDescription}
              </pre>
            )}
            <div className="flex flex-wrap gap-2 mb-6">
              {featured.tags.map((tag) => (
                <span key={tag} className="bg-muted text-foreground text-xs font-mono px-2.5 py-1 rounded border border-border pill-glow transition-all">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <a href={featured.github} target="_blank" rel="noopener noreferrer" onClick={featured.github === "#" ? handleRepoSoon : undefined} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                View on GitHub <ExternalLink size={14} />
              </a>
              {featured.demo && (
                <a href={featured.demo} target="_blank" rel="noopener noreferrer" onClick={featured.demo === "#" ? handleDemoSoon : undefined} className="flex items-center gap-2 border border-border text-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:border-primary/50 transition-colors">
                  Live Demo
                </a>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {secondary.map((project) => (
            <div
              key={project._id}
              className="bg-card border border-border rounded-lg p-5 card-glow transition-all duration-300 flex flex-col"
            >
              <h3 className="text-foreground font-semibold text-sm mb-1">{project.name}</h3>
              <p className="text-muted-foreground text-xs italic mb-4 flex-1">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="bg-muted text-muted-foreground text-xs font-mono px-2 py-0.5 rounded border border-border">
                    {tag}
                  </span>
                ))}
              </div>
              <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={project.github === "#" ? handleRepoSoon : undefined} className="text-neon-green text-xs font-mono hover:underline flex items-center gap-1">
                View Source <ExternalLink size={11} />
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;
