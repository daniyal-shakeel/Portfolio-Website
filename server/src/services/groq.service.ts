import { Project } from "../models/project.model.js";
import { Experience } from "../models/experience.model.js";
import { Skill } from "../models/skill.model.js";
import { Education } from "../models/education.model.js";
import { Settings } from "../models/settings.model.js";
import { Link } from "../models/link.model.js";
import { config } from "../config/env.js";

export class GroqService {
  static async getDeveloperContext(): Promise<string> {
    const [projects, experiences, skills, education, settings, links] = await Promise.all([
      Project.find(),
      Experience.find(),
      Skill.find(),
      Education.find(),
      Settings.findOne(),
      Link.find()
    ]);

    const projectsText = projects.map(p => {
      return `- Name: ${p.name}\n  Desc: ${p.description}\n  Tags: ${p.tags.join(", ")}\n  Github: ${p.github}\n  Demo: ${p.demo || "N/A"}`;
    }).join("\n\n");

    const experienceText = experiences.map(e => {
      return `- Role: ${e.role} at ${e.company}\n  Location: ${e.location}\n  Dates: ${e.startDate} - ${e.endDate}\n  Bullets:\n${e.bullets.map(b => `    * ${b}`).join("\n")}`;
    }).join("\n\n");

    const skillsText = skills.map(s => {
      return `- ${s.label}: ${s.items.join(", ")}`;
    }).join("\n");

    const educationText = education.map(edu => {
      return `- ${edu.degree} from ${edu.institution} (${edu.startDate} - ${edu.endDate}) ${edu.gpa ? `· ${edu.gpa}` : ""}`;
    }).join("\n");

    const linksText = links.map(l => `- ${l.label}: ${l.url}`).join("\n");

    const logoText = settings?.logoText || "daniyal.dev";
    const subheading = settings?.subheading || "Full-Stack Developer";
    const status = settings?.openToWorkStatus || "Open to work";

    return `You are the AI Assistant for Muhammad Daniyal Shakeel, representing his developer portfolio website (${logoText}).
Respond in a friendly, conversational, yet professional tone matching the cyberpunk/terminal/developer vibe of the website.
Answer questions accurately and concisely using ONLY the developer context provided below. If you don't know something or it is not in the context, politely state that you don't have that information. Do not use markdown bolding (double asterisks), hashes, backticks, or other AI-specific special formatting characters in your reply. Respond in clean, plain text.

Developer Profile:
- Logo / Domain: ${logoText}
- Subheading: ${subheading}
- Status: ${status}
- Location: Lahore, Pakistan

Technical Skills:
${skillsText}

Projects:
${projectsText}

Work Experience:
${experienceText}

Education:
${educationText}

Contact Links:
${linksText}
`;
  }

  static async getCompletion(
    userMessage: string,
    history: { role: "user" | "assistant"; content: string }[]
  ): Promise<{ reply: string; totalTokens: number; limitTokens: number }> {
    const context = await this.getDeveloperContext();

    const messages = [
      { role: "system", content: context },
      ...history,
      { role: "user", content: userMessage }
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`GROQ API failure: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const rawReply = data.choices?.[0]?.message?.content || "";
    const reply = rawReply
      .replace(/^\s*\*\s+/gm, "• ")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#/g, "")
      .replace(/`/g, "")
      .trim();
    const totalTokens = data.usage?.total_tokens || 0;

    const limitHeader = response.headers.get("x-ratelimit-limit-tokens");
    const limitTokens = limitHeader ? parseInt(limitHeader, 10) : 100000;

    return {
      reply,
      totalTokens,
      limitTokens
    };
  }
}
