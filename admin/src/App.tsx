import { useState, useEffect } from "react";
import { Terminal, Lock, User, LogOut, Shield, Plus, Edit2, Trash2, X, AlertTriangle, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Toaster, toast } from "sonner";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid, BarChart, Bar } from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface Project {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  featured?: boolean;
  longDescription?: string;
}

interface Experience {
  _id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface Skill {
  _id: string;
  key: string;
  label: string;
  items: string[];
}

interface Education {
  _id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

function App() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<"projects" | "experience" | "skills" | "education" | "settings" | "taglines" | "links" | "stats" | "cv" | "chat">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [taglines, setTaglines] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [chatStats, setChatStats] = useState<any>({ daily: [], sessions: [] });
  const [filterSession, setFilterSession] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterQuery, setFilterQuery] = useState("");

  const [statsList, setStatsList] = useState<any[]>([]);
  const [statLabel, setStatLabel] = useState("");
  const [statValue, setStatValue] = useState("");
  const [statTooltip, setStatTooltip] = useState("");
  const [statSortOrder, setStatSortOrder] = useState(0);

  const [cvMetadata, setCvMetadata] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);



  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTags, setProjectTags] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectDemo, setProjectDemo] = useState("");
  const [projectFeatured, setProjectFeatured] = useState(false);
  const [projectLongDesc, setProjectLongDesc] = useState("");

  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expBullets, setExpBullets] = useState("");

  const [skillKey, setSkillKey] = useState("");
  const [skillLabel, setSkillLabel] = useState("");
  const [skillItems, setSkillItems] = useState("");

  const [eduDegree, setEduDegree] = useState("");
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduStart, setEduStart] = useState("");
  const [eduEnd, setEduEnd] = useState("");
  const [eduGpa, setEduGpa] = useState("");

  const [settingsLogoText, setSettingsLogoText] = useState("");
  const [settingsSubheading, setSettingsSubheading] = useState("");
  const [settingsStatus, setSettingsStatus] = useState("");
  const [settingsPalette, setSettingsPalette] = useState("matrix");

  const [taglineText, setTaglineText] = useState("");

  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkIcon, setLinkIcon] = useState("external-link");
  const [linkHero, setLinkHero] = useState(false);
  const [linkFooter, setLinkFooter] = useState(false);
  const [linkContact, setLinkContact] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteType, setDeleteType] = useState<"projects" | "experience" | "skills" | "education" | "taglines" | "links" | "stats">("projects");
  const [deleteName, setDeleteName] = useState("");

  const fetchAllData = async () => {
    try {
      const pRes = await fetch(`${API_BASE_URL}/api/projects`);
      if (pRes.ok) setProjects(await pRes.json());

      const eRes = await fetch(`${API_BASE_URL}/api/experience`);
      if (eRes.ok) setExperiences(await eRes.json());

      const sRes = await fetch(`${API_BASE_URL}/api/skills`);
      if (sRes.ok) setSkills(await sRes.json());

      const dRes = await fetch(`${API_BASE_URL}/api/education`);
      if (dRes.ok) setEducationList(await dRes.json());

      const settingsRes = await fetch(`${API_BASE_URL}/api/settings`);
      if (settingsRes.ok) setSettings(await settingsRes.json());

      const taglinesRes = await fetch(`${API_BASE_URL}/api/taglines`);
      if (taglinesRes.ok) setTaglines(await taglinesRes.json());

      const linksRes = await fetch(`${API_BASE_URL}/api/links`);
      if (linksRes.ok) setLinks(await linksRes.json());

      const statsRes = await fetch(`${API_BASE_URL}/api/stats`);
      if (statsRes.ok) setStatsList(await statsRes.json());

      const cvRes = await fetch(`${API_BASE_URL}/api/cv/status`);
      if (cvRes.ok) setCvMetadata(await cvRes.json());

      const chatLogsRes = await fetch(`${API_BASE_URL}/api/chat/logs`, { credentials: "include" });
      if (chatLogsRes.ok) setChatLogs(await chatLogsRes.json());

      const chatStatsRes = await fetch(`${API_BASE_URL}/api/chat/stats`, { credentials: "include" });
      if (chatStatsRes.ok) setChatStats(await chatStatsRes.json());
    } catch (err) {
      toast.error("Failed to sync database data.");
    }
  };

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.authenticated) {
          setIsAuthenticated(true);
          setAdminUser(data.username);
          fetchAllData();
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  useEffect(() => {
    if (settings) {
      setSettingsLogoText(settings.logoText || "");
      setSettingsSubheading(settings.subheading || "");
      let statusVal = settings.openToWorkStatus || "";
      if (statusVal === "Open to work") {
        statusVal = "open";
      }
      setSettingsStatus(statusVal);
      setSettingsPalette(settings.selectedPalette || "matrix");
    }
  }, [settings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setIsAuthenticated(true);
      setAdminUser(data.username || loginUsername);
      setLoginPassword("");
      toast.success("Welcome back, Administrator.");
      fetchAllData();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
    }
    setIsAuthenticated(false);
    setAdminUser("");
    toast.success("Session closed successfully.");
  };

  const openAddForm = () => {
    setEditingId(null);
    setProjectName("");
    setProjectDesc("");
    setProjectTags("");
    setProjectGithub("");
    setProjectDemo("");
    setProjectFeatured(false);
    setProjectLongDesc("");

    setExpRole("");
    setExpCompany("");
    setExpLocation("");
    setExpStart("");
    setExpEnd("");
    setExpBullets("");

    setSkillKey("");
    setSkillLabel("");
    setSkillItems("");

    setEduDegree("");
    setEduInstitution("");
    setEduStart("");
    setEduEnd("");
    setEduGpa("");

    setTaglineText("");

    setLinkLabel("");
    setLinkUrl("");
    setLinkIcon("external-link");
    setLinkHero(false);
    setLinkFooter(false);
    setLinkContact(false);

    setStatLabel("");
    setStatValue("");
    setStatTooltip("");
    setStatSortOrder(0);

    setIsFormOpen(true);
  };

  const openEditForm = (item: any, type: "projects" | "experience" | "skills" | "education" | "taglines" | "links" | "stats") => {
    setEditingId(item._id);
    if (type === "projects") {
      setProjectName(item.name || "");
      setProjectDesc(item.description || "");
      setProjectTags((item.tags || []).join(", "));
      setProjectGithub(item.github || "");
      setProjectDemo(item.demo || "");
      setProjectFeatured(!!item.featured);
      setProjectLongDesc(item.longDescription || "");
    } else if (type === "experience") {
      setExpRole(item.role || "");
      setExpCompany(item.company || "");
      setExpLocation(item.location || "");
      setExpStart(item.startDate || "");
      setExpEnd(item.endDate || "");
      setExpBullets((item.bullets || []).join("\n"));
    } else if (type === "skills") {
      setSkillKey(item.key || "");
      setSkillLabel(item.label || "");
      setSkillItems((item.items || []).join(", "));
    } else if (type === "education") {
      setEduDegree(item.degree || "");
      setEduInstitution(item.institution || "");
      setEduStart(item.startDate || "");
      setEduEnd(item.endDate || "");
      setEduGpa(item.gpa || "");
    } else if (type === "taglines") {
      setTaglineText(item.text || "");
    } else if (type === "links") {
      setLinkLabel(item.label || "");
      setLinkUrl(item.url || "");
      setLinkIcon(item.icon || "external-link");
      setLinkHero(!!item.showInHero);
      setLinkFooter(!!item.showInFooter);
      setLinkContact(!!item.showInContact);
    } else if (type === "stats") {
      setStatLabel(item.label || "");
      setStatValue(item.value || "");
      setStatTooltip(item.tooltip || "");
      setStatSortOrder(item.sortOrder || 0);
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let url = "";
    let method = "POST";
    let bodyData: any = {};

    if (activeTab === "projects") {
      url = `${API_BASE_URL}/api/projects`;
      bodyData = {
        name: projectName,
        description: projectDesc,
        tags: projectTags.split(",").map((t) => t.trim()).filter(Boolean),
        github: projectGithub,
        demo: projectDemo || undefined,
        featured: projectFeatured,
        longDescription: projectLongDesc || undefined,
      };
    } else if (activeTab === "experience") {
      url = `${API_BASE_URL}/api/experience`;
      bodyData = {
        role: expRole,
        company: expCompany,
        location: expLocation,
        startDate: expStart,
        endDate: expEnd,
        bullets: expBullets.split("\n").map((b) => b.trim()).filter(Boolean),
      };
    } else if (activeTab === "skills") {
      url = `${API_BASE_URL}/api/skills`;
      bodyData = {
        key: skillKey,
        label: skillLabel,
        items: skillItems.split(",").map((i) => i.trim()).filter(Boolean),
      };
    } else if (activeTab === "education") {
      url = `${API_BASE_URL}/api/education`;
      bodyData = {
        degree: eduDegree,
        institution: eduInstitution,
        startDate: eduStart,
        endDate: eduEnd,
        gpa: eduGpa || undefined,
      };
    } else if (activeTab === "settings") {
      url = `${API_BASE_URL}/api/settings`;
      bodyData = {
        logoText: settingsLogoText,
        subheading: settingsSubheading,
        openToWorkStatus: settingsStatus,
        selectedPalette: settingsPalette,
      };
      method = "PUT";
    } else if (activeTab === "taglines") {
      url = `${API_BASE_URL}/api/taglines`;
      bodyData = {
        text: taglineText,
      };
    } else if (activeTab === "links") {
      url = `${API_BASE_URL}/api/links`;
      bodyData = {
        label: linkLabel,
        url: linkUrl,
        icon: linkIcon,
        showInHero: linkHero,
        showFooter: linkFooter,
        showContact: linkContact,
      };
    } else if (activeTab === "stats") {
      url = `${API_BASE_URL}/api/stats`;
      bodyData = {
        label: statLabel,
        value: statValue,
        tooltip: statTooltip || undefined,
        sortOrder: Number(statSortOrder),
      };
    }

    if (activeTab !== "settings" && editingId) {
      url += `/${editingId}`;
      method = "PUT";
    }

    setSubmitting(true);
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Save action failed");
      }

      toast.success(editingId ? "Item updated successfully." : "Item created successfully.");
      setIsFormOpen(false);
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to commit record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processCvUpload(file);
    }
  };

  const triggerFileSelect = () => {
    document.getElementById("cv-file-input")?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processCvUpload(file);
    }
  };

  const processCvUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Invalid file format. Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Maximum size allowed is 5MB.");
      return;
    }

    setUploadingCv(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const response = await fetch(`${API_BASE_URL}/api/cv/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            base64Data,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Upload failed");
        }

        toast.success("CV uploaded successfully!");
        fetchAllData();
      } catch (err: any) {
        toast.error(err.message || "Failed to upload CV.");
      } finally {
        setUploadingCv(false);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read CV file.");
      setUploadingCv(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCv = async () => {
    if (!window.confirm("Are you sure you want to delete the uploaded CV?")) return;
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/cv`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete CV");
      }

      toast.success("CV deleted successfully.");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete CV.");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDelete = (id: string, name: string, type: "projects" | "experience" | "skills" | "education" | "taglines" | "links" | "stats") => {
    setDeleteId(id);
    setDeleteName(name);
    setDeleteType(type);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/${deleteType}/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete action failed");
      }

      toast.success("Record deleted successfully.");
      setIsDeleteOpen(false);
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete record.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono text-neon-green">
        <Toaster theme="dark" position="bottom-right" />
        <div className="flex items-center gap-2 text-sm">
          <span>[~] Loading secure session...</span>
          <span className="animate-blink">▊</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const themeClass = settings?.selectedPalette ? `theme-${settings.selectedPalette}` : "theme-matrix";
    return (
      <div className={`min-h-screen bg-background text-foreground font-mono flex flex-col ${themeClass}`}>
        <Toaster theme="dark" position="bottom-right" />
        
        <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-neon-green h-5 w-5" />
            <span className="font-bold text-sm">{settings?.logoText || "daniyal.dev"} / admin dashboard</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted-foreground">User: <span className="text-neon-cyan">{adminUser}</span></span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-950/20 border border-red-900/50 hover:bg-red-900/20 text-red-400 px-3 py-1.5 rounded transition-all text-xs"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex bg-muted/50 p-1 rounded-md border border-border self-start flex-wrap gap-1">
              {(["projects", "experience", "skills", "education", "settings", "taglines", "links", "stats", "cv", "chat"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded text-xs capitalize transition-all ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "stats" ? "figures" : tab === "cv" ? "CV" : tab === "chat" ? "AI Chat" : tab}
                </button>
              ))}
            </div>
            {activeTab !== "settings" && activeTab !== "cv" && activeTab !== "chat" && (
              <button
                onClick={openAddForm}
                className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold transition-opacity hover:opacity-90 self-start"
              >
                <Plus size={14} />
                <span>Add {activeTab === "projects" ? "Project" : activeTab === "experience" ? "Experience" : activeTab === "skills" ? "Skill Group" : activeTab === "education" ? "Education" : activeTab === "taglines" ? "Tagline" : activeTab === "links" ? "Link" : activeTab === "stats" ? "Figure" : ""}</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {activeTab === "projects" && (
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div key={p._id} className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between card-glow">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-sm text-foreground">{p.name}</h3>
                        {p.featured && (
                          <span className="bg-primary/10 border border-primary/30 text-neon-green text-[9px] px-1.5 py-0.5 rounded font-mono">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs mb-3 italic">{p.description}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {p.tags.map((t) => (
                          <span key={t} className="bg-muted border border-border text-muted-foreground text-[10px] px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-border/50 pt-3 text-[11px]">
                      <a href={p.github} target="_blank" rel="noreferrer" className="text-neon-cyan hover:underline">
                        github.com/source
                      </a>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditForm(p, "projects")}
                          className="p-1 hover:text-neon-green transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => triggerDelete(p._id, p.name, "projects")}
                          className="p-1 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="col-span-2 text-center py-10 text-xs text-muted-foreground">No projects found.</div>
                )}
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp._id} className="bg-card border border-border border-l-4 border-l-primary rounded-lg p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 card-glow">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className="font-bold text-sm text-foreground">{exp.role}</h3>
                        <span className="text-xs text-neon-green">{exp.company}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {exp.location} · {exp.startDate} – {exp.endDate}
                      </div>
                      <ul className="list-inside space-y-1 mt-2 text-xs text-muted-foreground">
                        {exp.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-neon-green shrink-0">→</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-start">
                      <button
                        onClick={() => openEditForm(exp, "experience")}
                        className="p-1 hover:text-neon-green transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => triggerDelete(exp._id, `${exp.role} @ ${exp.company}`, "experience")}
                        className="p-1 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && (
                  <div className="text-center py-10 text-xs text-muted-foreground">No experience records found.</div>
                )}
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill._id} className="bg-card border border-border rounded-lg p-5 flex items-start justify-between gap-4 card-glow">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-bold text-sm text-neon-cyan">"{skill.label}"</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.items.map((i) => (
                          <span key={i} className="bg-muted border border-border text-foreground text-[10px] px-2.5 py-1 rounded">
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditForm(skill, "skills")}
                        className="p-1 hover:text-neon-green transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => triggerDelete(skill._id, skill.label, "skills")}
                        className="p-1 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                {skills.length === 0 && (
                  <div className="text-center py-10 text-xs text-muted-foreground">No skill categories found.</div>
                )}
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-4">
                {educationList.map((edu) => (
                  <div key={edu._id} className="bg-card border border-border rounded-lg p-5 flex items-start justify-between gap-4 card-glow">
                    <div className="space-y-1 flex-1">
                      <h3 className="font-bold text-sm text-neon-green">{edu.degree}</h3>
                      <div className="text-xs text-foreground">{edu.institution}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {edu.startDate} – {edu.endDate} {edu.gpa ? `· ${edu.gpa}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditForm(edu, "education")}
                        className="p-1 hover:text-neon-green transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => triggerDelete(edu._id, `${edu.degree} @ ${edu.institution}`, "education")}
                        className="p-1 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                {educationList.length === 0 && (
                  <div className="text-center py-10 text-xs text-muted-foreground">No education records found.</div>
                )}
              </div>
            )}

            {activeTab === "settings" && settings && (
              <form onSubmit={handleFormSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-xl card-glow">
                <div className="space-y-1">
                  <label className="text-[11px] text-neon-green">Logo Text</label>
                  <input
                    type="text"
                    required
                    value={settingsLogoText}
                    onChange={(e) => setSettingsLogoText(e.target.value)}
                    placeholder="e.g. daniyal.dev"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-neon-green">Subheading Title</label>
                  <input
                    type="text"
                    required
                    value={settingsSubheading}
                    onChange={(e) => setSettingsSubheading(e.target.value)}
                    placeholder="e.g. Full-Stack Developer · AI Integration Enthusiast"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-neon-green">Open to Work Status</label>
                  <div className="relative">
                    <select
                      value={settingsStatus}
                      onChange={(e) => setSettingsStatus(e.target.value)}
                      className="w-full bg-muted border border-border rounded px-3 py-2 pr-10 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono appearance-none cursor-pointer hover:border-neon-green/50 transition-colors"
                    >
                      <option value="open">Open to work</option>
                      <option value="collaborate">Open to collaborating</option>
                      <option value="busy">Busy building</option>
                      <option value="hidden">Hidden (Do not display)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-neon-green">Active Theme Color Palette</label>
                  <div className="relative">
                    <select
                      value={settingsPalette}
                      onChange={(e) => setSettingsPalette(e.target.value)}
                      className="w-full bg-muted border border-border rounded px-3 py-2 pr-10 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono appearance-none cursor-pointer hover:border-neon-green/50 transition-colors"
                    >
                      <option value="matrix">Matrix (Green & Cyan)</option>
                      <option value="dracula">Dracula (Violet & Hot Pink)</option>
                      <option value="nordic">Nordic (Arctic Blue & Teal)</option>
                      <option value="sunset">Sunset (Amber & Rose Red)</option>
                      <option value="amber">Retro Amber (Phosphor Gold)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 pointer-events-none" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded text-xs transition-opacity hover:opacity-90 disabled:opacity-50 mt-4 flex items-center justify-center gap-1.5"
                >
                  {submitting ? "Saving..." : "Save Settings"}
                </button>
              </form>
            )}

            {activeTab === "taglines" && (
              <div className="space-y-4">
                {taglines.map((t) => (
                  <div key={t._id} className="bg-card border border-border rounded-lg p-5 flex items-center justify-between gap-4 card-glow">
                    <div className="font-mono text-xs text-foreground flex-1 break-all">
                      {t.text}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditForm(t, "taglines")}
                        className="p-1 hover:text-neon-green transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => triggerDelete(t._id, t.text, "taglines")}
                        className="p-1 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                {taglines.length === 0 && (
                  <div className="text-center py-10 text-xs text-muted-foreground">No taglines found.</div>
                )}
              </div>
            )}

            {activeTab === "links" && (
              <div className="grid md:grid-cols-2 gap-4">
                {links.map((l) => (
                  <div key={l._id} className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between card-glow">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-sm text-foreground">{l.label}</h3>
                        <span className="bg-primary/10 border border-primary/30 text-neon-green text-[9px] px-1.5 py-0.5 rounded font-mono capitalize">
                          {l.icon}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs font-mono mb-3 break-all">{l.url}</p>
                      <div className="flex flex-wrap gap-1 mb-4 text-[9px] font-mono text-muted-foreground">
                        {l.showInHero && <span className="bg-muted border border-border px-1.5 py-0.5 rounded">Hero</span>}
                        {l.showInFooter && <span className="bg-muted border border-border px-1.5 py-0.5 rounded">Footer</span>}
                        {l.showInContact && <span className="bg-muted border border-border px-1.5 py-0.5 rounded">Contact</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-border/50 pt-3">
                      <button
                        onClick={() => openEditForm(l, "links")}
                        className="p-1 hover:text-neon-green transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => triggerDelete(l._id, l.label, "links")}
                        className="p-1 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                {links.length === 0 && (
                  <div className="col-span-2 text-center py-10 text-xs text-muted-foreground">No links found.</div>
                )}
              </div>
            )}

            {activeTab === "stats" && (
              <div className="grid md:grid-cols-2 gap-4">
                {statsList.map((s) => (
                  <div key={s._id} className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between card-glow">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-sm text-foreground">{s.label}</h3>
                        <span className="bg-primary/10 border border-primary/30 text-neon-green text-[9px] px-1.5 py-0.5 rounded font-mono">
                          Order: {s.sortOrder}
                        </span>
                      </div>
                      <p className="text-neon-green text-sm font-mono mb-2">{s.value}</p>
                      {s.tooltip && (
                        <p className="text-muted-foreground text-xs italic font-mono mb-3">
                          Tooltip: "{s.tooltip}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-border/50 pt-3">
                      <button
                        onClick={() => openEditForm(s, "stats")}
                        className="p-1 hover:text-neon-green transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => triggerDelete(s._id, s.label, "stats")}
                        className="p-1 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                {statsList.length === 0 && (
                  <div className="col-span-2 text-center py-10 text-xs text-muted-foreground">No figures found.</div>
                )}
              </div>
            )}

            {activeTab === "cv" && (
              <div className="max-w-xl mx-auto space-y-6">
                {cvMetadata?.exists ? (
                  <div className="bg-card border border-border rounded-lg p-6 card-glow space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded border border-primary/20 text-neon-green">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-foreground">{cvMetadata.filename}</h4>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          Uploaded: {new Date(cvMetadata.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <a
                        href={`${API_BASE_URL}/api/cv/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-primary text-primary-foreground font-semibold py-2 rounded text-xs text-center hover:opacity-90 transition-opacity"
                      >
                        Download CV
                      </a>
                      <button
                        onClick={handleDeleteCv}
                        className="flex-1 bg-red-950/20 border border-red-900/50 hover:bg-red-900/20 text-red-400 font-semibold py-2 rounded text-xs transition-colors"
                      >
                        Delete CV
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                      dragActive
                        ? "border-primary bg-primary/10 glow-green"
                        : "border-border hover:border-primary/50 hover:bg-card-glow/5"
                    }`}
                  >
                    <input
                      type="file"
                      id="cv-file-input"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    <div className={`p-4 rounded-full border transition-colors ${
                      dragActive ? "bg-primary/20 border-primary text-neon-green" : "bg-muted border-border text-muted-foreground"
                    }`}>
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    {uploadingCv ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-neon-green">Uploading CV document...</p>
                        <p className="text-[10px] text-muted-foreground font-mono animate-blink">Please wait... ▊</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground">
                          {dragActive ? "Drop the PDF here!" : "Drag & drop your CV (PDF) here"}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          or click to browse local files (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "chat" && (() => {
              const PALETTE_COLORS: Record<string, { primary: string; secondary: string }> = {
                matrix: { primary: "#10b981", secondary: "#06b6d4" },
                dracula: { primary: "#bd93f9", secondary: "#ff79c6" },
                nordic: { primary: "#88c0d0", secondary: "#8fbcbb" },
                sunset: { primary: "#f59e0b", secondary: "#f43f5e" },
                amber: { primary: "#d97706", secondary: "#b45309" },
              };
              const activeColors = PALETTE_COLORS[settings?.selectedPalette || "matrix"] || PALETTE_COLORS.matrix;
              const totalTokens = chatStats.daily.reduce((sum: number, item: any) => sum + (item.tokens || 0), 0);
              const totalRequests = chatStats.daily.reduce((sum: number, item: any) => sum + (item.requests || 0), 0);

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Tokens Today</h4>
                        <p className="text-2xl font-bold text-neon-green mt-1">{totalTokens.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Requests Today</h4>
                        <p className="text-2xl font-bold text-neon-cyan mt-1">{totalRequests.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Active Sessions</h4>
                        <p className="text-2xl font-bold text-neon-green mt-1">{chatStats.sessions.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-lg p-5 card-glow">
                      <h4 className="text-xs font-bold text-foreground mb-4">Daily Token Usage Trend</h4>
                      <div className="h-64">
                        {chatStats.daily.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chatStats.daily}>
                              <defs>
                                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={activeColors.primary} stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor={activeColors.primary} stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.1} />
                              <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                              <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                              <ChartTooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", fontSize: "10px" }} />
                              <Area type="monotone" dataKey="tokens" name="Tokens" stroke={activeColors.primary} fillOpacity={1} fill="url(#colorTokens)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No stats logs available.</div>
                        )}
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-5 card-glow">
                      <h4 className="text-xs font-bold text-foreground mb-4">Top Sessions Tokens</h4>
                      <div className="h-64">
                        {chatStats.sessions.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chatStats.sessions}>
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.1} />
                              <XAxis dataKey="session" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                              <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                              <ChartTooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", fontSize: "10px" }} />
                              <Bar dataKey="tokens" name="Tokens Used" fill={activeColors.secondary} radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No sessions logs available.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-5 card-glow space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-foreground">AI Chat Logging Console</h4>
                      <button
                        onClick={() => {
                          setFilterSession("");
                          setFilterDate("");
                          setFilterRole("all");
                          setFilterQuery("");
                        }}
                        className="text-[10px] bg-muted hover:bg-muted/80 border border-border px-2.5 py-1 rounded transition-colors text-muted-foreground hover:text-foreground cursor-pointer self-start"
                      >
                        Reset Filters
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Session ID</label>
                        <input
                          type="text"
                          value={filterSession}
                          onChange={(e) => setFilterSession(e.target.value)}
                          placeholder="Search session..."
                          className="w-full bg-muted border border-border rounded px-2.5 py-1 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Date</label>
                        <input
                          type="date"
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="w-full bg-muted border border-border rounded px-2.5 py-1 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono appearance-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Role</label>
                        <div className="relative">
                          <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full bg-muted border border-border rounded px-2.5 py-1 pr-8 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono appearance-none cursor-pointer"
                          >
                            <option value="all">All Logs</option>
                            <option value="user">User Queries</option>
                            <option value="assistant">AI Replies</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Search Message</label>
                        <input
                          type="text"
                          value={filterQuery}
                          onChange={(e) => setFilterQuery(e.target.value)}
                          placeholder="Search content..."
                          className="w-full bg-muted border border-border rounded px-2.5 py-1 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono"
                        />
                      </div>
                    </div>

                    {(() => {
                      const filteredLogs = chatLogs.filter((log: any) => {
                        if (filterSession && !log.sessionId.toLowerCase().includes(filterSession.toLowerCase())) {
                          return false;
                        }
                        if (filterRole !== "all" && log.role !== filterRole) {
                          return false;
                        }
                        if (filterDate) {
                          const logDate = new Date(log.timestamp).toISOString().split("T")[0];
                          if (logDate !== filterDate) {
                            return false;
                          }
                        }
                        if (filterQuery && !log.content.toLowerCase().includes(filterQuery.toLowerCase())) {
                          return false;
                        }
                        return true;
                      });

                      return (
                        <div className="max-h-[300px] overflow-y-auto border border-border rounded divide-y divide-border">
                          {filteredLogs.map((log: any) => (
                            <div key={log._id} className="p-3 text-[11px] font-mono space-y-1">
                              <div className="flex justify-between text-muted-foreground text-[10px]">
                                <span className="text-neon-cyan">Session: {log.sessionId.substring(0, 12)}...</span>
                                <span>{new Date(log.timestamp).toLocaleString()} {log.tokensUsed > 0 ? `(${log.tokensUsed} tokens)` : ""}</span>
                              </div>
                              <div className="text-foreground">
                                <span className={log.role === "user" ? "text-neon-green" : "text-neon-cyan"}>
                                  {log.role === "user" ? "User: " : "AI: "}
                                </span>
                                {log.content}
                              </div>
                            </div>
                          ))}
                          {filteredLogs.length === 0 && (
                            <div className="text-center py-8 text-xs text-muted-foreground">
                              {chatLogs.length === 0 ? "Console is empty. No logs saved." : "No matches found for active filters."}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
          </div>
        </main>

        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
              <div className="bg-muted/40 border-b border-border px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {editingId ? "$ nano ./edit_record" : "$ nano ./create_record"}
                </span>
                <button onClick={() => setIsFormOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {activeTab === "projects" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Project Name</label>
                      <input
                        type="text"
                        required
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="e.g. NextFit — Virtual Try-On E-Commerce"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Brief Description</label>
                      <input
                        type="text"
                        required
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        placeholder="e.g. Because online shopping needed to stop being a gambling addiction."
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        required
                        value={projectTags}
                        onChange={(e) => setProjectTags(e.target.value)}
                        placeholder="React, TypeScript, Python"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">GitHub URL</label>
                      <input
                        type="text"
                        required
                        value={projectGithub}
                        onChange={(e) => setProjectGithub(e.target.value)}
                        placeholder="e.g. https://github.com/daniyal-shakeel/nextfit"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Demo URL (Optional)</label>
                      <input
                        type="text"
                        value={projectDemo}
                        onChange={(e) => setProjectDemo(e.target.value)}
                        placeholder="e.g. https://nextfit.dev (Optional)"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="flex items-center pt-2">
                      <label htmlFor="featured" className="flex items-center gap-3 cursor-pointer select-none group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={projectFeatured}
                            onChange={(e) => setProjectFeatured(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-8 h-4 rounded-full transition-colors duration-300 border ${
                            projectFeatured ? "bg-primary/20 border-primary" : "bg-muted border-border group-hover:border-muted-foreground/60"
                          }`}>
                            <div className={`w-2.5 h-2.5 rounded-full absolute top-[3px] transition-all duration-300 ${
                              projectFeatured ? "bg-primary left-[19px]" : "bg-muted-foreground left-[3px]"
                            }`} />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                          Feature this project on top
                        </span>
                      </label>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Detailed Description (Markdown-ready, Optional)</label>
                      <textarea
                        value={projectLongDesc}
                        onChange={(e) => setProjectLongDesc(e.target.value)}
                        rows={4}
                        placeholder="e.g. AI-powered virtual try-on with pose detection... (Optional)"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green font-mono"
                      />
                    </div>
                  </>
                )}

                {activeTab === "experience" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-foreground">Role Title</label>
                        <input
                          type="text"
                          required
                          value={expRole}
                          onChange={(e) => setExpRole(e.target.value)}
                          placeholder="e.g. Software Engineer Intern"
                          className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-foreground">Company Name</label>
                        <input
                          type="text"
                          required
                          value={expCompany}
                          onChange={(e) => setExpCompany(e.target.value)}
                          placeholder="e.g. Boolmind"
                          className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Location</label>
                      <input
                        type="text"
                        required
                        value={expLocation}
                        onChange={(e) => setExpLocation(e.target.value)}
                        placeholder="Lahore, Pakistan"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-foreground">Start Date</label>
                        <input
                          type="text"
                          required
                          value={expStart}
                          onChange={(e) => setExpStart(e.target.value)}
                          placeholder="11 Sep 2025"
                          className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-foreground">End Date</label>
                        <input
                          type="text"
                          required
                          value={expEnd}
                          onChange={(e) => setExpEnd(e.target.value)}
                          placeholder="Dec 2025 or Present"
                          className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Responsibilities (One bullet per line)</label>
                      <textarea
                        required
                        value={expBullets}
                        onChange={(e) => setExpBullets(e.target.value)}
                        rows={4}
                        placeholder="Contributed to internal tooling&#10;Maintained features"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green font-mono"
                      />
                    </div>
                  </>
                )}

                {activeTab === "skills" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Category Key (URL/ID safe)</label>
                      <input
                        type="text"
                        required
                        value={skillKey}
                        onChange={(e) => setSkillKey(e.target.value)}
                        placeholder="languages"
                        disabled={!!editingId}
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Category Label</label>
                      <input
                        type="text"
                        required
                        value={skillLabel}
                        onChange={(e) => setSkillLabel(e.target.value)}
                        placeholder="Languages & Frameworks"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Skill Items (Comma-separated)</label>
                      <input
                        type="text"
                        required
                        value={skillItems}
                        onChange={(e) => setSkillItems(e.target.value)}
                        placeholder="JavaScript, TypeScript, Python"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                  </>
                )}

                {activeTab === "education" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Degree Program</label>
                      <input
                        type="text"
                        required
                        value={eduDegree}
                        onChange={(e) => setEduDegree(e.target.value)}
                        placeholder="B.S. Computer Science"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Institution</label>
                      <input
                        type="text"
                        required
                        value={eduInstitution}
                        onChange={(e) => setEduInstitution(e.target.value)}
                        placeholder="University of Central Punjab"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-foreground">Start Year</label>
                        <input
                          type="text"
                          required
                          value={eduStart}
                          onChange={(e) => setEduStart(e.target.value)}
                          placeholder="2021"
                          className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-foreground">End Year / Status</label>
                        <input
                          type="text"
                          required
                          value={eduEnd}
                          onChange={(e) => setEduEnd(e.target.value)}
                          placeholder="2025 or 2025 (Final Year)"
                          className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">GPA / Details (Optional)</label>
                      <input
                        type="text"
                        value={eduGpa}
                        onChange={(e) => setEduGpa(e.target.value)}
                        placeholder="CGPA: 3.3"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                  </>
                )}

                {activeTab === "taglines" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Tagline Punch Line</label>
                      <input
                        type="text"
                        required
                        value={taglineText}
                        onChange={(e) => setTaglineText(e.target.value)}
                        placeholder="e.g. Trust me, I am a developer."
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                  </>
                )}

                {activeTab === "links" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Link Label</label>
                      <input
                        type="text"
                        required
                        value={linkLabel}
                        onChange={(e) => setLinkLabel(e.target.value)}
                        placeholder="e.g. GitHub"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Link URL</label>
                      <input
                        type="url"
                        required
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="e.g. https://github.com/daniyal-shakeel"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Icon</label>
                      <div className="relative">
                        <select
                          value={linkIcon}
                          onChange={(e) => setLinkIcon(e.target.value)}
                          className="w-full bg-muted border border-border rounded px-3 py-2 pr-10 text-xs focus:outline-none focus:border-neon-green text-foreground font-mono appearance-none cursor-pointer hover:border-neon-green/50 transition-colors"
                        >
                          <option value="github">github</option>
                          <option value="linkedin">linkedin</option>
                          <option value="mail">mail</option>
                          <option value="external-link">external-link</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <label className="text-[11px] text-muted-foreground">Display Placement (Select one or more)</label>
                      <div className="flex items-center gap-3">
                        <label htmlFor="linkHero" className="flex items-center gap-3 cursor-pointer select-none group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              id="linkHero"
                              checked={linkHero}
                              onChange={(e) => setLinkHero(e.target.checked)}
                              className="sr-only"
                            />
                            <div className={`w-8 h-4 rounded-full transition-colors duration-300 border ${
                                linkHero ? "bg-primary/20 border-primary" : "bg-muted border-border group-hover:border-muted-foreground/60"
                            }`}>
                              <div className={`w-2.5 h-2.5 rounded-full absolute top-[3px] transition-all duration-300 ${
                                  linkHero ? "bg-primary left-[19px]" : "bg-muted-foreground left-[3px]"
                              }`} />
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                            Show in Hero Section
                          </span>
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <label htmlFor="linkFooter" className="flex items-center gap-3 cursor-pointer select-none group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              id="linkFooter"
                              checked={linkFooter}
                              onChange={(e) => setLinkFooter(e.target.checked)}
                              className="sr-only"
                            />
                            <div className={`w-8 h-4 rounded-full transition-colors duration-300 border ${
                                linkFooter ? "bg-primary/20 border-primary" : "bg-muted border-border group-hover:border-muted-foreground/60"
                            }`}>
                              <div className={`w-2.5 h-2.5 rounded-full absolute top-[3px] transition-all duration-300 ${
                                  linkFooter ? "bg-primary left-[19px]" : "bg-muted-foreground left-[3px]"
                              }`} />
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                            Show in Footer
                          </span>
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <label htmlFor="linkContact" className="flex items-center gap-3 cursor-pointer select-none group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              id="linkContact"
                              checked={linkContact}
                              onChange={(e) => setLinkContact(e.target.checked)}
                              className="sr-only"
                            />
                            <div className={`w-8 h-4 rounded-full transition-colors duration-300 border ${
                                linkContact ? "bg-primary/20 border-primary" : "bg-muted border-border group-hover:border-muted-foreground/60"
                            }`}>
                              <div className={`w-2.5 h-2.5 rounded-full absolute top-[3px] transition-all duration-300 ${
                                  linkContact ? "bg-primary left-[19px]" : "bg-muted-foreground left-[3px]"
                              }`} />
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                            Show in Contact Section
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "stats" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Figure Label</label>
                      <input
                        type="text"
                        required
                        value={statLabel}
                        onChange={(e) => setStatLabel(e.target.value)}
                        placeholder="e.g. Total Projects"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Figure Value</label>
                      <input
                        type="text"
                        required
                        value={statValue}
                        onChange={(e) => setStatValue(e.target.value)}
                        placeholder="e.g. 18+ or 3"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Hover Tooltip (Optional)</label>
                      <input
                        type="text"
                        value={statTooltip}
                        onChange={(e) => setStatTooltip(e.target.value)}
                        placeholder="e.g. send help or copy/paste (Optional)"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Sort Order</label>
                      <input
                        type="number"
                        required
                        value={statSortOrder}
                        onChange={(e) => setStatSortOrder(Number(e.target.value))}
                        placeholder="e.g. 0"
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green font-mono"
                      />
                    </div>
                  </>
                )}


                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 border border-border text-foreground hover:bg-muted py-2 rounded text-xs transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary text-primary-foreground font-semibold py-2 rounded text-xs transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {submitting ? "Processing..." : "Commit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card border border-red-900/50 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
              <div className="bg-red-950/20 border-b border-red-900/30 px-4 py-2.5 flex items-center justify-between text-red-400">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  <span className="text-xs font-bold font-mono">WARNING: destructive action</span>
                </div>
                <button onClick={() => setIsDeleteOpen(false)} className="text-red-400 hover:text-red-300">
                  <X size={14} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs text-muted-foreground">
                  Confirm record removal. This cannot be undone.
                </p>
                <div className="bg-muted/60 border border-border rounded p-3 font-mono text-[11px] space-y-1.5">
                  <div className="text-muted-foreground">admin@daniyal.dev:~$</div>
                  <div className="text-red-400 font-semibold break-all">
                    rm -rf ./{deleteType}/{deleteName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsDeleteOpen(false)}
                    className="flex-1 border border-border text-foreground hover:bg-muted py-2 rounded text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={submitting}
                    className="flex-1 bg-red-650 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {submitting ? "Deleting..." : "Delete Record"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-mono">
      <Toaster theme="dark" position="bottom-right" />
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-2xl overflow-hidden card-glow">
        <div className="bg-muted/40 border-b border-border px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-[11px] text-muted-foreground">login.sh</span>
          <Terminal size={12} className="text-muted-foreground" />
        </div>
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="text-center space-y-1 mb-4">
            <h2 className="text-sm font-bold text-foreground">Secure Portal</h2>
            <p className="text-[10px] text-muted-foreground">Credentials authorized by system env variables</p>
          </div>
          {error && (
            <div className="bg-red-950/20 border border-red-900/50 rounded p-2.5 text-[11px] text-red-400 flex items-start gap-2">
              <span className="text-red-500 font-bold shrink-0">[Error]</span>
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground flex items-center gap-1">
              <User size={10} className="text-neon-cyan" />
              <span>Username</span>
            </label>
            <input
              type="text"
              required
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-neon-green transition-colors"
              placeholder="root"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Lock size={10} className="text-neon-cyan" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-muted border border-border rounded pl-3 pr-10 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-neon-green transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded font-semibold text-xs transition-opacity hover:opacity-90 disabled:opacity-50 mt-2"
          >
            {submitting ? "Processing..." : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
