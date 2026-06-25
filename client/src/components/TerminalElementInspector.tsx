import { useEffect, useState } from "react";
import { useTerminalView } from "@/contexts/TerminalViewContext";
import { cn } from "@/lib/utils";

const SELECTOR = "nav#site-nav, section[id], footer#site-footer";

function formatOpenTag(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const id = el.id;
  const raw = typeof el.className === "string" ? el.className : "";
  const cls = raw.replace(/\s+/g, " ").trim();
  const clsShort = cls.length > 52 ? `${cls.slice(0, 52)}…` : cls;
  let s = `<${tag}`;
  if (id) s += ` id="${id}"`;
  if (clsShort) s += ` class="${clsShort}"`;
  s += ">";
  return s;
}

const TerminalElementInspector = () => {
  const { terminalMode } = useTerminalView();
  const [rows, setRows] = useState<{ el: HTMLElement; line: string }[]>([]);

  useEffect(() => {
    if (!terminalMode) {
      setRows([]);
      return;
    }
    const root = document.getElementById("site-root");
    if (!root) return;
    const els = Array.from(root.querySelectorAll(SELECTOR)) as HTMLElement[];
    setRows(
      els.map((el) => ({
        el,
        line: formatOpenTag(el),
      })),
    );
  }, [terminalMode]);

  useEffect(() => {
    if (!terminalMode) return;
    const root = document.getElementById("site-root");
    if (!root) return;
    const els = root.querySelectorAll(SELECTOR);
    els.forEach((node) => node.classList.add("terminal-dom-highlight"));
    return () => {
      els.forEach((node) => node.classList.remove("terminal-dom-highlight"));
    };
  }, [terminalMode]);

  if (!terminalMode) return null;

  const scrollTo = (el: HTMLElement) => {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside
      className={cn(
        "fixed z-40 w-[min(22rem,calc(100vw-2rem))] max-h-[min(70vh,32rem)] overflow-hidden rounded-lg border border-border",
        "bg-card/95 shadow-lg backdrop-blur-md",
        "right-4 top-20 md:top-24",
        "font-mono text-xs",
      )}
      aria-label="Live DOM tree"
    >
      <div className="border-b border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
        <span className="text-neon-green">$</span> inspect —{" "}
        <span className="text-foreground">#site-root</span>
      </div>
      <div className="max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain p-2">
        <div className="mb-1 pl-1 text-[10px] text-muted-foreground">tree (click to scroll)</div>
        <ul className="space-y-0.5">
          {rows.map(({ el, line }, i) => (
            <li key={`${el.tagName}-${el.id}-${i}`}>
              <button
                type="button"
                onClick={() => scrollTo(el)}
                className={cn(
                  "w-full rounded px-1.5 py-1 text-left transition-colors",
                  "text-neon-green/90 hover:bg-muted hover:text-neon-green",
                  "break-all",
                )}
              >
                <span className="text-muted-foreground select-none">{String(i).padStart(2, "0")}</span>{" "}
                <span className="text-neon-cyan/90">{line}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-2 border-t border-border pt-2 pl-1 text-[10px] text-muted-foreground">
          <span className="text-neon-green">$</span> _ elements mirror real DOM; outlines show scope
        </div>
      </div>
    </aside>
  );
};

export default TerminalElementInspector;
