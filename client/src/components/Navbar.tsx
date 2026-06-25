import { useState, useEffect } from "react";
import { Menu, Terminal } from "lucide-react";
import { useTerminalView } from "@/contexts/TerminalViewContext";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  settings: {
    logoText: string;
  } | null;
}

const Navbar = ({ settings }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { terminalMode, toggleTerminalMode } = useTerminalView();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="site-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
        <a href="#" className="font-mono text-lg text-neon-green font-bold glow-green-text shrink-0">
          {settings?.logoText || "daniyal.dev"}
        </a>

        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={toggleTerminalMode}
            aria-pressed={terminalMode}
            aria-label={terminalMode ? "Exit terminal DOM view" : "Open terminal DOM view"}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition-colors",
              terminalMode
                ? "border-neon-green/50 bg-neon-green/10 text-neon-green"
                : "border-border text-muted-foreground hover:border-neon-green/30 hover:text-foreground",
            )}
          >
            <Terminal className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">term</span>
          </button>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <button
              type="button"
              className="md:hidden flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-neon-green/30 hover:text-foreground"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-sheet"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4 shrink-0" aria-hidden />
              <span>
                <span className="text-neon-green">$</span> menu
              </span>
            </button>
            <SheetContent
              side="right"
              id="mobile-nav-sheet"
              className="z-[100] w-[min(100vw,20rem)] border-border sm:max-w-sm"
            >
              <SheetHeader>
                <SheetTitle className="font-mono text-left text-neon-green">$ navigate</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
