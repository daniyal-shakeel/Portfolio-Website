import React from "react";
import { Menu } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setIsMobileMenuOpen: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setIsMobileMenuOpen }) => {
  const getTabLabel = (tab: string) => {
    if (tab === "stats") return "figures";
    if (tab === "cv") return "CV";
    if (tab === "chat") return "AI Chat";
    if (tab === "learning") return "currently learning";
    return tab;
  };

  return (
    <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between md:justify-end">
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <Menu size={20} />
      </button>
      <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
        <span>Admin Console / {getTabLabel(activeTab)}</span>
      </div>
    </header>
  );
};
