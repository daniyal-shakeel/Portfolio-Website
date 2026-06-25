import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

interface FooterProps {
  settings: {
    logoText: string;
  } | null;
  links: {
    label: string;
    url: string;
    icon: string;
    showInFooter: boolean;
  }[];
}

const Footer = ({ settings, links }: FooterProps) => {
  const footerLinks = links.filter((l) => l.showInFooter);
  const defaultLinks = [
    { label: "GitHub", url: "https://github.com/daniyal-shakeel", icon: "github" }
  ];
  const activeLinks = footerLinks.length > 0 ? footerLinks : defaultLinks;

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "github":
        return <Github size={18} />;
      case "linkedin":
        return <Linkedin size={18} />;
      case "mail":
        return <Mail size={18} />;
      default:
        return <ExternalLink size={18} />;
    }
  };

  const nameDisplay = settings?.logoText ? settings.logoText.split(".")[0] : "Daniyal";

  return (
    <footer id="site-footer" className="border-t border-border py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground text-center md:text-left space-y-1">
          <p>Hand-built by {nameDisplay.charAt(0).toUpperCase() + nameDisplay.slice(1)} · Powered by caffeine & Stack Overflow</p>
          <p>© 2025 · No site builders — just code</p>
        </div>
        <div className="flex gap-4">
          {activeLinks.map((link, idx) => {
            const isMail = link.url.startsWith("mailto:");
            return (
              <a
                key={idx}
                href={link.url}
                target={isMail ? undefined : "_blank"}
                rel={isMail ? undefined : "noopener noreferrer"}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title={link.label}
              >
                {getIcon(link.icon)}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;


