import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TerminalElementInspector from "@/components/TerminalElementInspector";
import ChatAssistant from "@/components/ChatAssistant";

interface SettingsData {
  logoText: string;
  subheading: string;
  openToWorkStatus: string;
  selectedPalette: string;
}

interface TaglineData {
  _id: string;
  text: string;
}

interface LinkData {
  _id: string;
  label: string;
  url: string;
  icon: string;
  showInHero: boolean;
  showInFooter: boolean;
  showInContact: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Index = () => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [taglines, setTaglines] = useState<TaglineData[]>([]);
  const [links, setLinks] = useState<LinkData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sRes = await fetch(`${API_BASE_URL}/api/settings`);
        if (sRes.ok) setSettings(await sRes.json());

        const tRes = await fetch(`${API_BASE_URL}/api/taglines`);
        if (tRes.ok) setTaglines(await tRes.json());

        const lRes = await fetch(`${API_BASE_URL}/api/links`);
        if (lRes.ok) setLinks(await lRes.json());
      } catch (err) {
      }
    };
    fetchData();
  }, []);

  const themeClass = settings?.selectedPalette ? `theme-${settings.selectedPalette}` : "theme-matrix";

  return (
    <div id="site-root" className={`min-h-screen ${themeClass}`}>
      <Navbar settings={settings} />
      <Hero settings={settings} taglines={taglines} links={links} />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact links={links} />
      <Footer settings={settings} links={links} />
      <TerminalElementInspector />
      <ChatAssistant />
    </div>
  );
};

export default Index;


