import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Education {
  _id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface LearningItem {
  _id: string;
  name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const About = () => {
  const [eduList, setEduList] = useState<Education[]>([]);
  const [learningList, setLearningList] = useState<LearningItem[]>([]);
  const [loadingEdu, setLoadingEdu] = useState(true);
  const [loadingLearning, setLoadingLearning] = useState(true);

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/learning`);
        if (res.ok) {
          const data = await res.json();
          setLearningList(data);
        }
      } catch (err) {
        console.error("Learning fetch failed", err);
      } finally {
        setLoadingLearning(false);
      }
    };
    fetchLearning();
  }, []);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/education`);
        if (res.ok) {
          const data = await res.json();
          setEduList(data);
        }
      } catch (err) {
        console.error("Education fetch failed", err);
      } finally {
        setLoadingEdu(false);
      }
    };
    fetchEducation();
  }, []);

  return (
    <section id="about" className="py-20">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        <h2 className="text-2xl font-mono text-neon-green font-bold">
          <span className="text-muted-foreground">$</span> whoami
        </h2>

        <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
          Final year BSCS student who somehow convinced two companies to let him intern, 
          shipped an AI-powered e-commerce system as his FYP, and is now looking for someone 
          to pay him to do this full-time. Goal: add real, measurable value — not just push PRs.
        </p>

        <div className="space-y-4 max-w-lg">
          {loadingEdu ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 space-y-2">
                <Skeleton className="h-5 w-3/4 mb-1" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-1/4 mt-1" />
              </div>
            ))
          ) : (
            eduList.map((edu) => (
              <div key={edu._id} className="bg-card border border-border rounded-lg p-6 card-glow">
                <div className="font-mono text-sm text-neon-green mb-1">{edu.degree}</div>
                <div className="text-foreground text-sm">
                  {edu.institution} · {edu.startDate} – {edu.endDate}
                </div>
                {edu.gpa && <div className="text-muted-foreground text-xs mt-1">{edu.gpa}</div>}
              </div>
            ))
          )}
        </div>

        <div>
          <h3 className="text-sm text-muted-foreground font-mono mb-3">
            <span className="text-neon-green">#</span> Currently Learning
          </h3>
          <div className="flex flex-wrap gap-2">
            {loadingLearning ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-24 rounded-full border border-primary/20" />
              ))
            ) : (
              learningList.map((item) => (
                <span
                  key={item._id}
                  className="bg-card border border-primary/30 text-neon-green text-xs font-mono px-3 py-1.5 rounded-full pulse-soft"
                >
                  {item.name}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
