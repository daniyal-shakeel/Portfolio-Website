export interface Project {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  longDescription?: string;
  thumbnail?: string;
  isPrivate?: boolean;
}

export interface Experience {
  _id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Skill {
  _id: string;
  key: string;
  label: string;
  items: string[];
}

export interface Education {
  _id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface LearningItem {
  _id: string;
  name: string;
}

export interface Settings {
  logoText: string;
  subheading: string;
  openToWorkStatus: string;
  selectedPalette: string;
}

export interface Tagline {
  _id: string;
  text: string;
}

export interface LinkItem {
  _id: string;
  label: string;
  url: string;
  icon: string;
  showInHero: boolean;
  showInFooter: boolean;
  showInContact: boolean;
}

export interface StatItem {
  _id: string;
  label: string;
  value: string;
  tooltip?: string;
  sortOrder: number;
}

export interface CvMetadata {
  exists: boolean;
  filename?: string;
  uploadedAt?: string;
}

export interface SessionBreakdownItem {
  sessionId: string;
  createdAt: string;
  lastActivity: string;
  status: "Active" | "Inactive";
  tokensUsed: number;
  remainingTokens: number;
  totalRequests: number;
  averageTokensPerRequest: number;
}

export interface ChatLogItem {
  _id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  tokensUsed: number;
  timestamp: string;
}

export interface ChatStats {
  summary: {
    todayTokens: number;
    allTimeTokens: number;
    todayRequests: number;
    allTimeRequests: number;
    activeSessions: number;
    inactiveSessions: number;
    averageTokensPerRequest: number;
    averageRequestsPerSession: number;
  };
  sessionBreakdown: SessionBreakdownItem[];
  graphs: {
    dailyTokens: any[];
    weeklyTokens: any[];
    monthlyTokens: any[];
    dailyRequests: any[];
    weeklyRequests: any[];
    monthlyRequests: any[];
    sessionGrowth: any[];
    tokenDistribution: any[];
  };
}
