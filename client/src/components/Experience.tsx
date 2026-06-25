import { useState, useEffect } from "react";

interface Experience {
  _id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Experience = () => {
  const [expList, setExpList] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/experience`);
        if (res.ok) {
          const data = await res.json();
          setExpList(data);
        }
      } catch (err) {
      }
    };
    fetchExperience();
  }, []);

  return (
    <section id="experience" className="py-20">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        <h2 className="text-2xl font-mono text-neon-green font-bold">
          <span className="text-muted-foreground">$</span> git log --oneline --experience
        </h2>

        <div className="space-y-6">
          {expList.map((exp) => (
            <div
              key={exp._id}
              className="bg-card border border-border rounded-lg p-6 border-l-4 border-l-primary card-glow"
            >
              <div className="font-mono text-sm text-neon-green font-semibold">{exp.role}</div>
              <div className="text-foreground text-sm mt-1">
                {exp.company} · {exp.location}
              </div>
              <div className="text-muted-foreground text-xs font-mono mt-1">
                {exp.startDate} – {exp.endDate}
              </div>
              <ul className="mt-4 space-y-2">
                {exp.bullets.map((bullet, j) => (
                  <li key={j} className="text-muted-foreground text-sm flex items-start gap-2">
                    <span className="text-neon-green mt-0.5">→</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
