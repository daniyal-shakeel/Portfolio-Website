import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { LINKEDIN_URL } from "@/lib/site";

interface ContactProps {
  links: {
    label: string;
    url: string;
    icon: string;
    showInContact: boolean;
  }[];
}

const Contact = ({ links }: ContactProps) => {
  const contactLinks = links.filter((l) => l.showInContact);
  const defaultLinks = [
    { label: "Email Me", url: "mailto:hafizdaniyalshakeel@gmail.com", icon: "mail" },
    { label: "LinkedIn", url: LINKEDIN_URL, icon: "linkedin" },
    { label: "GitHub", url: "https://github.com/daniyal-shakeel", icon: "github" }
  ];
  const activeLinks = contactLinks.length > 0 ? contactLinks : defaultLinks;

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "github":
        return <Github size={16} />;
      case "linkedin":
        return <Linkedin size={16} />;
      case "mail":
        return <Mail size={16} />;
      default:
        return <ExternalLink size={16} />;
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
        <h2 className="text-2xl font-mono text-neon-green font-bold">
          <span className="text-muted-foreground">$</span> ping daniyal
        </h2>

        <p className="text-2xl md:text-3xl font-bold text-foreground max-w-lg mx-auto" style={{ textWrap: "balance" }}>
          Let's build something that doesn't get rolled back.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {activeLinks.map((link, idx) => {
            const isMail = link.url.startsWith("mailto:");
            const isPrimary = link.icon === "mail";
            return (
              <a
                key={idx}
                href={link.url}
                target={isMail ? undefined : "_blank"}
                rel={isMail ? undefined : "noopener noreferrer"}
                className={
                  isPrimary
                    ? "flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                    : "flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:border-primary/50 transition-colors"
                }
              >
                {getIcon(link.icon)} {link.label}
              </a>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          Response time: faster than my unit tests run.
        </p>
      </div>
    </section>
  );
};

export default Contact;


