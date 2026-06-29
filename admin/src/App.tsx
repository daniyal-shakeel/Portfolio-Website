import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Toaster, toast } from "sonner";
import type {
  Project,
  Experience,
  Skill,
  Education,
  LearningItem,
  Tagline,
  LinkItem,
  StatItem,
  CvMetadata,
  ChatStats,
} from "./types";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DeleteDialog } from "./components/DeleteDialog";
import { FormModal } from "./components/FormModal";
import { ProjectsTab } from "./components/Tabs/ProjectsTab";
import { ExperienceTab } from "./components/Tabs/ExperienceTab";
import { SkillsTab } from "./components/Tabs/SkillsTab";
import { EducationTab } from "./components/Tabs/EducationTab";
import { LearningTab } from "./components/Tabs/LearningTab";
import { SettingsTab } from "./components/Tabs/SettingsTab";
import { TaglinesTab } from "./components/Tabs/TaglinesTab";
import { LinksTab } from "./components/Tabs/LinksTab";
import { StatsTab } from "./components/Tabs/StatsTab";
import { CvTab } from "./components/Tabs/CvTab";
import { ChatTab } from "./components/Tabs/ChatTab";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function App() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<"projects" | "experience" | "skills" | "education" | "learning" | "settings" | "taglines" | "links" | "stats" | "cv" | "chat">(() => {
    return (localStorage.getItem("__pw_admin_active_tab") as any) || "projects";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tokenGraphTab, setTokenGraphTab] = useState<"daily" | "weekly" | "monthly">("daily");
  const [requestGraphTab, setRequestGraphTab] = useState<"daily" | "weekly" | "monthly">("daily");
  const [sessionSearch, setSessionSearch] = useState("");
  const [sessionSortKey, setSessionSortKey] = useState<"createdAt" | "lastActivity" | "tokensUsed" | "totalRequests">("lastActivity");
  const [sessionSortOrder, setSessionSortOrder] = useState<"asc" | "desc">("desc");

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    localStorage.setItem("__pw_admin_active_tab", tab);
    setIsMobileMenuOpen(false);
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [learningList, setLearningList] = useState<LearningItem[]>([]);
  const [learningName, setLearningName] = useState("");
  const [settings, setSettings] = useState<any>(null);
  const [taglines, setTaglines] = useState<Tagline[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [chatStats, setChatStats] = useState<ChatStats>({
    summary: {
      todayTokens: 0,
      allTimeTokens: 0,
      todayRequests: 0,
      allTimeRequests: 0,
      activeSessions: 0,
      inactiveSessions: 0,
      averageTokensPerRequest: 0,
      averageRequestsPerSession: 0
    },
    sessionBreakdown: [],
    graphs: {
      dailyTokens: [],
      weeklyTokens: [],
      monthlyTokens: [],
      dailyRequests: [],
      weeklyRequests: [],
      monthlyRequests: [],
      sessionGrowth: [],
      tokenDistribution: []
    }
  });

  const [statsList, setStatsList] = useState<StatItem[]>([]);
  const [statLabel, setStatLabel] = useState("");
  const [statValue, setStatValue] = useState("");
  const [statTooltip, setStatTooltip] = useState("");
  const [statSortOrder, setStatSortOrder] = useState(0);

  const [cvMetadata, setCvMetadata] = useState<CvMetadata | null>(null);
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
  const [projectThumbnail, setProjectThumbnail] = useState("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [projectIsPrivate, setProjectIsPrivate] = useState(false);

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
  const [deleteType, setDeleteType] = useState<"projects" | "experience" | "skills" | "education" | "learning" | "taglines" | "links" | "stats">("projects");
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

      const lRes = await fetch(`${API_BASE_URL}/api/learning`);
      if (lRes.ok) setLearningList(await lRes.json());

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
    setProjectThumbnail("");
    setProjectIsPrivate(false);

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

    setLearningName("");

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

  const openEditForm = (item: any, type: "projects" | "experience" | "skills" | "education" | "learning" | "taglines" | "links" | "stats") => {
    setEditingId(item._id);
    if (type === "projects") {
      setProjectName(item.name || "");
      setProjectDesc(item.description || "");
      setProjectTags((item.tags || []).join(", "));
      setProjectGithub(item.github || "");
      setProjectDemo(item.demo || "");
      setProjectFeatured(!!item.featured);
      setProjectLongDesc(item.longDescription || "");
      setProjectThumbnail(item.thumbnail || "");
      setProjectIsPrivate(!!item.isPrivate);
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
    } else if (type === "learning") {
      setLearningName(item.name || "");
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
        github: projectIsPrivate ? undefined : (projectGithub || undefined),
        demo: projectDemo || undefined,
        featured: projectFeatured,
        longDescription: projectLongDesc || undefined,
        thumbnail: projectThumbnail || undefined,
        isPrivate: projectIsPrivate,
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
    } else if (activeTab === "learning") {
      url = `${API_BASE_URL}/api/learning`;
      bodyData = {
        name: learningName,
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

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file format. Only JPG, JPEG, PNG, and WEBP files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large. Maximum size allowed is 5MB.");
        return;
      }

      setUploadingThumbnail(true);
      const formData = new FormData();
      formData.append("thumbnail", file);

      try {
        const response = await fetch(`${API_BASE_URL}/api/projects/upload`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Upload failed");
        }

        const data = await response.json();
        setProjectThumbnail(data.filePath);
        toast.success("Thumbnail uploaded successfully!");
      } catch (err: any) {
        toast.error(err.message || "Failed to upload thumbnail.");
      } finally {
        setUploadingThumbnail(false);
      }
    }
  };

  const triggerDelete = (id: string, name: string, type: "projects" | "experience" | "skills" | "education" | "learning" | "taglines" | "links" | "stats") => {
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
      <div className={`min-h-screen bg-background text-foreground font-mono flex flex-col md:flex-row ${themeClass}`}>
        <Toaster theme="dark" position="bottom-right" />
        <Sidebar
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          adminUser={adminUser}
          handleLogout={handleLogout}
          settings={settings}
        />
        {isMobileMenuOpen && (
          <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" />
        )}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Header activeTab={activeTab} setIsMobileMenuOpen={setIsMobileMenuOpen} />
          <main className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-4">
              <h2 className="text-xl font-bold capitalize text-foreground flex items-center gap-2">
                <span>{activeTab === "stats" ? "figures" : activeTab === "cv" ? "CV" : activeTab === "chat" ? "AI Chat" : activeTab === "learning" ? "currently learning" : activeTab}</span>
              </h2>
              {activeTab !== "settings" && activeTab !== "cv" && activeTab !== "chat" && (
                <button
                  onClick={openAddForm}
                  className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold transition-opacity hover:opacity-90 self-start cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add {activeTab === "projects" ? "Project" : activeTab === "experience" ? "Experience" : activeTab === "skills" ? "Skill Group" : activeTab === "education" ? "Education" : activeTab === "learning" ? "Learning Item" : activeTab === "taglines" ? "Tagline" : activeTab === "links" ? "Link" : activeTab === "stats" ? "Figure" : ""}</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {activeTab === "projects" && (
                <ProjectsTab
                  projects={projects}
                  API_BASE_URL={API_BASE_URL}
                  openEditForm={openEditForm}
                  triggerDelete={triggerDelete}
                />
              )}
              {activeTab === "experience" && (
                <ExperienceTab
                  experiences={experiences}
                  openEditForm={openEditForm}
                  triggerDelete={triggerDelete}
                />
              )}
              {activeTab === "skills" && (
                <SkillsTab
                  skills={skills}
                  openEditForm={openEditForm}
                  triggerDelete={triggerDelete}
                />
              )}
              {activeTab === "education" && (
                <EducationTab
                  educationList={educationList}
                  openEditForm={openEditForm}
                  triggerDelete={triggerDelete}
                />
              )}
              {activeTab === "learning" && (
                <LearningTab
                  learningList={learningList}
                  openEditForm={openEditForm}
                  triggerDelete={triggerDelete}
                />
              )}
              {activeTab === "settings" && settings && (
                <SettingsTab
                  settingsLogoText={settingsLogoText}
                  setSettingsLogoText={setSettingsLogoText}
                  settingsSubheading={settingsSubheading}
                  setSettingsSubheading={setSettingsSubheading}
                  settingsStatus={settingsStatus}
                  setSettingsStatus={setSettingsStatus}
                  settingsPalette={settingsPalette}
                  setSettingsPalette={setSettingsPalette}
                  handleFormSubmit={handleFormSubmit}
                  submitting={submitting}
                />
              )}
              {activeTab === "taglines" && (
                <TaglinesTab
                  taglines={taglines}
                  openEditForm={openEditForm}
                  triggerDelete={triggerDelete}
                />
              )}
              {activeTab === "links" && (
                <LinksTab
                  links={links}
                  openEditForm={openEditForm}
                  triggerDelete={triggerDelete}
                />
              )}
              {activeTab === "stats" && (
                <StatsTab
                  statsList={statsList}
                  openEditForm={openEditForm}
                  triggerDelete={triggerDelete}
                />
              )}
              {activeTab === "cv" && (
                <CvTab
                  cvMetadata={cvMetadata}
                  API_BASE_URL={API_BASE_URL}
                  handleDeleteCv={handleDeleteCv}
                  handleDrag={handleDrag}
                  handleDrop={handleDrop}
                  triggerFileSelect={triggerFileSelect}
                  handleFileChange={handleFileChange}
                  dragActive={dragActive}
                  uploadingCv={uploadingCv}
                />
              )}
              {activeTab === "chat" && (
                <ChatTab
                  chatStats={chatStats}
                  settings={settings}
                  tokenGraphTab={tokenGraphTab}
                  setTokenGraphTab={setTokenGraphTab}
                  requestGraphTab={requestGraphTab}
                  setRequestGraphTab={setRequestGraphTab}
                  sessionSearch={sessionSearch}
                  setSessionSearch={setSessionSearch}
                  sessionSortKey={sessionSortKey}
                  setSessionSortKey={setSessionSortKey}
                  sessionSortOrder={sessionSortOrder}
                  setSessionSortOrder={setSessionSortOrder}
                />
              )}
            </div>
          </main>
        </div>

        <FormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          activeTab={activeTab}
          editingId={editingId}
          submitting={submitting}
          projectName={projectName}
          setProjectName={setProjectName}
          projectDesc={projectDesc}
          setProjectDesc={setProjectDesc}
          projectTags={projectTags}
          setProjectTags={setProjectTags}
          projectGithub={projectGithub}
          setProjectGithub={setProjectGithub}
          projectDemo={projectDemo}
          setProjectDemo={setProjectDemo}
          projectFeatured={projectFeatured}
          setProjectFeatured={setProjectFeatured}
          projectLongDesc={projectLongDesc}
          setProjectLongDesc={setProjectLongDesc}
          projectThumbnail={projectThumbnail}
          setProjectThumbnail={setProjectThumbnail}
          uploadingThumbnail={uploadingThumbnail}
          handleThumbnailUpload={handleThumbnailUpload}
          API_BASE_URL={API_BASE_URL}
          projectIsPrivate={projectIsPrivate}
          setProjectIsPrivate={setProjectIsPrivate}
          expRole={expRole}
          setExpRole={setExpRole}
          expCompany={expCompany}
          setExpCompany={setExpCompany}
          expLocation={expLocation}
          setExpLocation={setExpLocation}
          expStart={expStart}
          setExpStart={setExpStart}
          expEnd={expEnd}
          setExpEnd={setExpEnd}
          expBullets={expBullets}
          setExpBullets={setExpBullets}
          skillKey={skillKey}
          setSkillKey={setSkillKey}
          skillLabel={skillLabel}
          setSkillLabel={setSkillLabel}
          skillItems={skillItems}
          setSkillItems={setSkillItems}
          eduDegree={eduDegree}
          setEduDegree={setEduDegree}
          eduInstitution={eduInstitution}
          setEduInstitution={setEduInstitution}
          eduStart={eduStart}
          setEduStart={setEduStart}
          eduEnd={eduEnd}
          setEduEnd={setEduEnd}
          eduGpa={eduGpa}
          setEduGpa={setEduGpa}
          learningName={learningName}
          setLearningName={setLearningName}
          taglineText={taglineText}
          setTaglineText={setTaglineText}
          linkLabel={linkLabel}
          setLinkLabel={setLinkLabel}
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          linkIcon={linkIcon}
          setLinkIcon={setLinkIcon}
          linkHero={linkHero}
          setLinkHero={setLinkHero}
          linkFooter={linkFooter}
          setLinkFooter={setLinkFooter}
          linkContact={linkContact}
          setLinkContact={setLinkContact}
          statLabel={statLabel}
          setStatLabel={setStatLabel}
          statValue={statValue}
          setStatValue={setStatValue}
          statTooltip={statTooltip}
          setStatTooltip={setStatTooltip}
          statSortOrder={statSortOrder}
          setStatSortOrder={setStatSortOrder}
        />

        <DeleteDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          submitting={submitting}
          deleteName={deleteName}
          deleteType={deleteType}
        />
      </div>
    );
  }

  return (
    <Login
      loginUsername={loginUsername}
      setLoginUsername={setLoginUsername}
      loginPassword={loginPassword}
      setLoginPassword={setLoginPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      handleLogin={handleLogin}
      error={error}
      submitting={submitting}
    />
  );
}

export default App;
