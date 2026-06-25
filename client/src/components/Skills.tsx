import { useState, useEffect } from "react";

interface SkillCategory {
  _id: string;
  key: string;
  label: string;
  items: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Skills = () => {
  const [skillsList, setSkillsList] = useState<SkillCategory[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/skills`);
        if (res.ok) {
          const data = await res.json();
          setSkillsList(data);
        }
      } catch (err) {
      }
    };
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-20">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        <h2 className="text-2xl font-mono text-neon-green font-bold">
          <span className="text-muted-foreground">$</span> cat skills.json
        </h2>

        <div className="bg-card border border-border rounded-lg p-6 font-mono text-sm space-y-6">
          <div className="text-muted-foreground">{"{"}</div>
          {skillsList.map((category, i) => {
            const isExploring = category.key === "exploring";
            return (
              <div key={category._id} className="pl-4">
                <div className="text-neon-cyan mb-2">
                  "{category.label}"<span className="text-muted-foreground">: [</span>
                </div>
                <div className="flex flex-wrap gap-2 pl-4 mb-1">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className={`bg-muted text-foreground text-xs px-2.5 py-1 rounded border border-border pill-glow transition-all cursor-default group relative ${
                        isExploring ? "pulse-soft border-primary/30 text-neon-green" : ""
                      }`}
                    >
                      {item}
                      {isExploring && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-muted text-foreground text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                          (still Googling this)
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                <div className="text-muted-foreground pl-0">
                  ]{i < skillsList.length - 1 ? "," : ""}
                </div>
              </div>
            );
          })}
          <div className="text-muted-foreground">{"}"}</div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
