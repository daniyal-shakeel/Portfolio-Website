import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type TerminalViewContextValue = {
  terminalMode: boolean;
  toggleTerminalMode: () => void;
  setTerminalMode: (value: boolean) => void;
};

const TerminalViewContext = createContext<TerminalViewContextValue | null>(null);

export function TerminalViewProvider({ children }: { children: React.ReactNode }) {
  const [terminalMode, setTerminalMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("terminal-mode", terminalMode);
    return () => document.documentElement.classList.remove("terminal-mode");
  }, [terminalMode]);

  const toggleTerminalMode = useCallback(() => {
    setTerminalMode((v) => !v);
  }, []);

  const value = useMemo(
    () => ({ terminalMode, toggleTerminalMode, setTerminalMode }),
    [terminalMode, toggleTerminalMode],
  );

  return <TerminalViewContext.Provider value={value}>{children}</TerminalViewContext.Provider>;
}

export function useTerminalView() {
  const ctx = useContext(TerminalViewContext);
  if (!ctx) {
    throw new Error("useTerminalView must be used within TerminalViewProvider");
  }
  return ctx;
}
