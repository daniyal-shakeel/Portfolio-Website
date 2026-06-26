import React from "react";
import {
  Shield,
  X,
  LogOut,
  Folder,
  Briefcase,
  Wrench,
  GraduationCap,
  BookOpen,
  Settings as SettingsIcon,
  Type,
  Link2,
  BarChart2,
  FileText,
  MessageSquare,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  handleTabChange: (tab: any) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  adminUser: string;
  handleLogout: () => void;
  settings: any;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  handleTabChange,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  adminUser,
  handleLogout,
  settings,
}) => {
  const tabIconMap: Record<string, React.ReactNode> = {
    projects: <Folder size={14} />,
    experience: <Briefcase size={14} />,
    skills: <Wrench size={14} />,
    education: <GraduationCap size={14} />,
    learning: <BookOpen size={14} />,
    settings: <SettingsIcon size={14} />,
    taglines: <Type size={14} />,
    links: <Link2 size={14} />,
    stats: <BarChart2 size={14} />,
    cv: <FileText size={14} />,
    chat: <MessageSquare size={14} />,
  };

  const sidebarTabs = [
    { id: "projects", label: "projects" },
    { id: "experience", label: "experience" },
    { id: "skills", label: "skills" },
    { id: "education", label: "education" },
    { id: "learning", label: "currently learning" },
    { id: "settings", label: "settings" },
    { id: "taglines", label: "taglines" },
    { id: "links", label: "links" },
    { id: "stats", label: "figures" },
    { id: "cv", label: "CV" },
    { id: "chat", label: "AI Chat" },
  ] as const;

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between`}
    >
      <div>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-neon-green h-5 w-5" />
            <span className="font-bold text-sm truncate">{settings?.logoText || "daniyal.dev"}</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {tabIconMap[tab.id]}
                <span className="capitalize">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-3">
        <div className="text-[10px] text-muted-foreground truncate">
          User: <span className="text-neon-cyan">{adminUser}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-1.5 bg-red-950/20 border border-red-900/50 hover:bg-red-900/20 text-red-400 px-3 py-2 rounded transition-all text-xs cursor-pointer"
        >
          <LogOut size={12} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
