import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Thin gradient bar at the top during client-side route changes.
 */
const TopLoadingBar = () => {
  const location = useLocation();
  const skipFirst = useRef(true);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }

    setVisible(true);
    setProgress(0.06);
    const raf = requestAnimationFrame(() => setProgress(0.42));
    const t1 = setTimeout(() => setProgress(0.78), 140);
    const t2 = setTimeout(() => setProgress(1), 360);
    const t3 = setTimeout(() => {
      setVisible(false);
    }, 520);
    const t4 = setTimeout(() => setProgress(0), 720);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [location.pathname]);

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[3px] w-full overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={cn(
          "h-full rounded-r-full bg-gradient-to-r from-primary via-[hsl(var(--neon-green))] to-[hsl(var(--neon-cyan))]",
          "transition-[width] duration-200 ease-out",
          visible ? "opacity-100" : "opacity-0 transition-opacity duration-300",
        )}
        style={{
          width: `${progress * 100}%`,
          boxShadow: visible ? "0 0 16px hsl(var(--neon-green) / 0.5), 0 1px 0 hsl(var(--foreground) / 0.08)" : "none",
        }}
      />
    </div>
  );
};

export default TopLoadingBar;
