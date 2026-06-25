import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors",
        "hover:border-neon-green/30 hover:text-foreground",
        "disabled:opacity-50",
        className,
      )}
    >
      {!mounted ? (
        <span className="h-4 w-4" aria-hidden />
      ) : isDark ? (
        <Sun className="h-4 w-4 text-neon-green" aria-hidden />
      ) : (
        <Moon className="h-4 w-4 text-neon-green" aria-hidden />
      )}
    </button>
  );
};

export default ThemeToggle;
