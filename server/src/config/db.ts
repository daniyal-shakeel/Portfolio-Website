import mongoose from "mongoose";
import { config } from "./env.js";
import { Project } from "../models/project.model.js";
import { Experience } from "../models/experience.model.js";
import { Skill } from "../models/skill.model.js";
import { Education } from "../models/education.model.js";
import { Settings } from "../models/settings.model.js";
import { Tagline } from "../models/tagline.model.js";
import { Link } from "../models/link.model.js";
import { Stat } from "../models/stat.model.js";
import { Learning } from "../models/learning.model.js";


const initialProjects = [
  {
    name: "NextFit — Virtual Try-On E-Commerce System",
    description: "Because online shopping needed to stop being a gambling addiction.",
    longDescription: "AI-powered virtual try-on with two modes:\n→ Live Camera Mode — Real-time MediaPipe pose detection + Canvas overlay\n→ AI Photo Try-On — Stable Diffusion inpainting via Modal.com (T4 GPU)\n\nCustom preprocessing & postprocessing pipelines for garment fitting.\nDeployed AI backend on Modal.com · React + TypeScript frontend.",
    tags: ["React", "TypeScript", "Python", "FastAPI", "Stable Diffusion", "MediaPipe", "Modal.com"],
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    name: "POS System",
    description: "Because Excel sheets are a crime against humanity.",
    tags: ["Node.js", "PostgreSQL", "QuickBooks API"],
    github: "#",
  },
  {
    name: "ERP Integration Hub",
    description: "MRPeasy meets QuickBooks. Nobody asked, we delivered.",
    tags: ["Node.js", "REST APIs", "MRPeasy"],
    github: "#",
  },
  {
    name: "Auth Microservice",
    description: "JWT tokens and broken dreams.",
    tags: ["NestJS", "Redis", "Docker"],
    github: "#",
  },
];

const initialExperiences = [
  {
    role: "Software Engineer Intern",
    company: "Boolmind",
    location: "Lahore, Pakistan",
    startDate: "11 Sep 2025",
    endDate: "11 Dec 2025",
    bullets: [
      "Built and maintained full-stack features",
      "Worked on real client-facing products",
      "Did not break production (most of the time)",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "CompuWiz Technologies",
    location: "Gujrat, Pakistan",
    startDate: "21 May 2025",
    endDate: "21 Aug 2025",
    bullets: [
      "Contributed to internal tooling and ERP integrations",
      "Survived legacy codebases and lived to tell the tale",
      "git blame never revealed my name (skill issue or skill?)",
    ],
  },
];

const initialSkills = [
  {
    key: "languages",
    label: "Languages & Frameworks",
    items: ["JavaScript", "TypeScript", "Python", "Node.js", "React", "NestJS", "FastAPI", "Express"],
  },
  {
    key: "databases",
    label: "Databases & Storage",
    items: ["PostgreSQL", "Supabase", "Firebase", "Redis", "MongoDB"],
  },
  {
    key: "ai",
    label: "AI / ML Tooling",
    items: ["Stable Diffusion", "MediaPipe", "HuggingFace", "Modal.com", "LangChain", "n8n Agents"],
  },
  {
    key: "devops",
    label: "DevOps & Infrastructure",
    items: ["Docker", "Kubernetes (k8s)", "Linux", "Nginx", "GitHub Actions", "CI/CD"],
  },
  {
    key: "cloud",
    label: "Cloud & Services",
    items: ["Google Cloud Console", "Hostinger", "Firebase Hosting", "Supabase Edge Functions"],
  },
  {
    key: "tools",
    label: "Developer Tooling",
    items: ["Claude Code", "Cursor", "Nodemailer", "Pub/Sub", "Socket.io", "Postman", "Git"],
  },
  {
    key: "exploring",
    label: "Currently Exploring",
    items: ["NestJS", "n8n Agents", "System Design"],
  },
];

const initialEducation = [
  {
    degree: "B.S. Computer Science",
    institution: "University of Central Punjab",
    startDate: "2021",
    endDate: "2025 (Final Year)",
    gpa: "CGPA: 3.3",
  },
];

const initialSettings = {
  logoText: "daniyal.dev",
  subheading: "Full-Stack Developer · AI Integration Enthusiast",
  openToWorkStatus: "Open to work",
  selectedPalette: "matrix",
};

const initialTaglines = [
  { text: "Trust me, I am a developer." },
  { text: "It works on my machine™" },
  { text: "Turning coffee into questionable life decisions." },
  { text: "Currently not in a meeting (for once)." },
];

const initialLinks = [
  {
    label: "Email Me",
    url: "mailto:hafizdaniyalshakeel@gmail.com",
    icon: "mail",
    showInHero: true,
    showInFooter: false,
    showInContact: true,
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/hafiz-daniyal-shakeel-239441316",
    icon: "linkedin",
    showInHero: true,
    showInFooter: false,
    showInContact: true,
  },
  {
    label: "GitHub",
    url: "https://github.com/daniyal-shakeel",
    icon: "github",
    showInHero: true,
    showInFooter: true,
    showInContact: true,
  },
];

const initialStats = [
  { label: "Total Projects", value: "18+", tooltip: "", sortOrder: 0 },
  { label: "Currently Building", value: "3", tooltip: "send help", sortOrder: 1 },
  { label: "Proudly Failed", value: "5", tooltip: "they were learning experiences (cope)", sortOrder: 2 },
  { label: "Cups of Tea", value: "∞", tooltip: "", sortOrder: 3 },
];

const initialLearning = [
  { name: "NestJS" },
  { name: "n8n Agents" },
  { name: "System Design" },
  { name: "Cloud Architecture" }
];

async function seedData(): Promise<void> {
  const [
    projectCount,
    expCount,
    skillCount,
    eduCount,
    settingsCount,
    taglineCount,
    linkCount,
    statCount,
    learningCount
  ] = await Promise.all([
    Project.countDocuments(),
    Experience.countDocuments(),
    Skill.countDocuments(),
    Education.countDocuments(),
    Settings.countDocuments(),
    Tagline.countDocuments(),
    Link.countDocuments(),
    Stat.countDocuments(),
    Learning.countDocuments()
  ]);

  if (
    projectCount > 0 &&
    expCount > 0 &&
    skillCount > 0 &&
    eduCount > 0 &&
    settingsCount > 0 &&
    taglineCount > 0 &&
    linkCount > 0 &&
    statCount > 0 &&
    learningCount > 0
  ) {
    return;
  }

  try {
    const lockResult = await mongoose.connection.collection("_initialization_locks").updateOne(
      { _id: "seed_lock" as any },
      { $setOnInsert: { initializedAt: new Date() } },
      { upsert: true }
    );
    if (!lockResult.upsertedCount) {
      return;
    }
  } catch (error: any) {
    if (error.code === 11000) {
      return;
    }
    throw error;
  }

  if (projectCount === 0) {
    await Project.insertMany(initialProjects);
  }

  if (expCount === 0) {
    await Experience.insertMany(initialExperiences);
  }

  if (skillCount === 0) {
    await Skill.insertMany(initialSkills);
  }

  if (eduCount === 0) {
    await Education.insertMany(initialEducation);
  }

  if (settingsCount === 0) {
    await Settings.create(initialSettings);
  }

  if (taglineCount === 0) {
    await Tagline.insertMany(initialTaglines);
  }

  if (linkCount === 0) {
    await Link.insertMany(initialLinks);
  }

  if (statCount === 0) {
    await Stat.insertMany(initialStats);
  }

  if (learningCount === 0) {
    await Learning.insertMany(initialLearning);
  }
}

let cachedPromise: Promise<typeof mongoose> | null = null;
let seedPromise: Promise<void> | null = null;

async function runSeed(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedData().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    await runSeed();
    return mongoose;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(config.mongodbUri).catch((error) => {
      cachedPromise = null;
      throw error;
    });
  }

  const conn = await cachedPromise;
  console.log("MongoDB connection established successfully");
  await runSeed();
  return conn;
}


