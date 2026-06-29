import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { LINKEDIN_URL } from "@/lib/site";

const stats = [
  { label: "Total Projects", value: "18+", tooltip: null },
  { label: "Currently Building", value: "3", tooltip: "send help" },
  { label: "Proudly Failed", value: "5", tooltip: "they were learning experiences (cope)" },
  { label: "Cups of Tea", value: "∞", tooltip: null },
];

interface HeroProps {
  settings: {
    subheading: string;
    openToWorkStatus: string;
  } | null;
  taglines: { text: string }[];
  links: {
    label: string;
    url: string;
    icon: string;
    showInHero: boolean;
  }[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Hero = ({ settings, taglines, links }: HeroProps) => {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [statsList, setStatsList] = useState<any[]>([]);
  const [cvStatus, setCvStatus] = useState<{ exists: boolean; filename?: string }>({ exists: false });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const statsRes = await fetch(`${API_BASE_URL}/api/stats`);
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStatsList(data);
        }
      } catch (err) {
      }

      try {
        const cvRes = await fetch(`${API_BASE_URL}/api/cv/status`);
        if (cvRes.ok) {
          const data = await cvRes.json();
          setCvStatus(data);
        }
      } catch (err) {
      }
    };
    fetchHeroData();
  }, []);
  const [isTyping, setIsTyping] = useState(true);

  const activeTaglines = taglines.length > 0
    ? taglines.map((t) => t.text)
    : [
        "Trust me, I am a developer.",
        "It works on my machine™",
        "Turning coffee into questionable life decisions.",
        "Currently not in a meeting (for once)."
      ];

  useEffect(() => {
    if (activeTaglines.length === 0) return;
    const currentTagline = activeTaglines[taglineIndex % activeTaglines.length];

    if (isTyping) {
      if (displayText.length < currentTagline.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentTagline.slice(0, displayText.length + 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        setTaglineIndex((prev) => (prev + 1) % activeTaglines.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, taglineIndex, activeTaglines]);

  const heroLinks = links.filter((l) => l.showInHero);
  const defaultLinks = [
    { label: "GitHub", url: "https://github.com/daniyal-shakeel", icon: "github" },
    { label: "LinkedIn", url: LINKEDIN_URL, icon: "linkedin" },
    { label: "Email", url: "mailto:hafizdaniyalshakeel@gmail.com", icon: "mail" }
  ];
  const activeLinks = heroLinks.length > 0 ? heroLinks : defaultLinks;

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "github":
        return <Github size={16} className="text-neon-green" />;
      case "linkedin":
        return <Linkedin size={16} className="text-neon-cyan" />;
      case "mail":
        return <Mail size={16} className="text-neon-green" />;
      default:
        return <ExternalLink size={16} className="text-neon-cyan" />;
    }
  };

  const getDisplayUrl = (url: string) => {
    if (url.startsWith("mailto:")) {
      return url.replace("mailto:", "");
    }
    return url.replace(/^https?:\/\/(www\.)?/, "");
  };

  const renderStatusBadge = () => {
    const rawStatus = settings?.openToWorkStatus;
    if (!rawStatus) return null;

    const normalized = rawStatus.toLowerCase().trim();
    if (normalized === "hidden") return null;

    let badgeClass = "bg-primary/10 border-primary/30 text-neon-green hover:bg-primary/20 hover:border-primary/50";
    let dotClass = "bg-primary";
    let label = "Open to work";

    if (normalized === "collaborate" || normalized === "open to collaborating") {
      badgeClass = "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan/50";
      dotClass = "bg-neon-cyan";
      label = "Open to collaborating";
    } else if (normalized === "busy" || normalized === "busy building") {
      badgeClass = "bg-red-950/20 border-red-900/30 text-red-400 hover:bg-red-950/40 hover:border-red-500/30";
      dotClass = "bg-red-500";
      label = "Busy building";
    } else if (normalized === "open" || normalized === "open to work") {
      badgeClass = "bg-primary/10 border-primary/30 text-neon-green hover:bg-primary/20 hover:border-primary/50";
      dotClass = "bg-primary";
      label = "Open to work";
    } else {
      label = rawStatus;
    }

    return (
      <div className="pt-3 border-t border-border">
        <span className={`inline-flex items-center gap-2 border text-xs font-mono px-3 py-1.5 rounded-full transition-all duration-300 ${badgeClass}`}>
          <span className={`w-2 h-2 rounded-full pulse-soft ${dotClass}`} />
          {label}
        </span>
      </div>
    );
  };

  return (
    <section id="hero" className="min-h-screen flex items-center pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight" style={{ textWrap: "balance" }}>
                Muhammad Daniyal Shakeel
              </h1>
              <p className="text-lg text-neon-green font-mono">
                {settings?.subheading || "Full-Stack Developer · AI Integration Enthusiast"}
              </p>
              <p className="text-muted-foreground text-sm">Lahore, Pakistan 🇵🇰</p>
            </div>

            <div className="font-mono text-muted-foreground text-sm md:text-base h-8">
              <span className="text-neon-green">{">"}</span>{" "}
              <span>{displayText}</span>
              <span className="animate-blink text-neon-green">▊</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(statsList.length > 0 ? statsList : stats).map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border border-border rounded-lg p-4 text-center transition-all duration-300 card-glow group relative"
                  title={stat.tooltip || undefined}
                >
                  <div className="text-2xl font-bold text-neon-green font-mono">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  {stat.tooltip && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-muted text-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
                      {stat.tooltip}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <a
                href="#projects"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                View My Work
              </a>
              {cvStatus.exists ? (
                <a
                  href={`${API_BASE_URL}/api/cv/download`}
                  download={cvStatus.filename || "Muhammad_Daniyal_Shakeel_CV.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-border text-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:border-primary/50 transition-colors"
                >
                  Download CV
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center justify-center border border-border text-muted-foreground px-6 py-3 rounded-lg font-semibold text-sm cursor-not-allowed opacity-50"
                  title="No CV uploaded yet"
                >
                  Download CV
                </button>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4 card-glow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground font-mono ml-2">contact.sh</span>
            </div>

            <div className="space-y-3 font-mono text-sm">
              {activeLinks.map((link, idx) => {
                const isMail = link.url.startsWith("mailto:");
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noopener noreferrer"}
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    {getIcon(link.icon)}
                    <span className="break-all">{getDisplayUrl(link.url)}</span>
                    {!isMail && <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </a>
                );
              })}
            </div>

            {renderStatusBadge()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
