import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  recommendations?: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const RECOMMENDED_QUESTIONS = [
  "Tell me about your featured projects",
  "What are your core technical skills?",
  "Are you currently open to work?",
  "Tell me about your education background"
];

const getRandomRecommendations = (excludeText: string): string[] => {
  const filtered = RECOMMENDED_QUESTIONS.filter(q => q.toLowerCase() !== excludeText.toLowerCase());
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
};

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<number>(() => {
    return Number(localStorage.getItem("__pw_chat_usage") || "0");
  });
  const [limit, setLimit] = useState<number>(() => {
    return Number(localStorage.getItem("__pw_chat_limit") || "3333");
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        let sessionId = localStorage.getItem("__pw_chat_session");
        let sessionValid = false;
        let data = { usage: Number(localStorage.getItem("__pw_chat_usage") || "0"), limit: Number(localStorage.getItem("__pw_chat_limit") || "3333") };

        if (sessionId) {
          const res = await fetch(`${API_BASE_URL}/api/chat/session?sessionId=${sessionId}`, {
            credentials: "include"
          });
          if (res.ok) {
            data = await res.json();
            sessionValid = true;
          } else {
            localStorage.removeItem("__pw_chat_session");
            localStorage.removeItem("__pw_chat_usage");
            localStorage.removeItem("__pw_chat_limit");
          }
        }

        if (!sessionValid) {
          const createRes = await fetch(`${API_BASE_URL}/api/chat/session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
          });
          if (createRes.ok) {
            const createData = await createRes.json();
            sessionId = createData.sessionId;
            if (sessionId) {
              localStorage.setItem("__pw_chat_session", sessionId);
              const statusRes = await fetch(`${API_BASE_URL}/api/chat/session?sessionId=${sessionId}`, {
                credentials: "include"
              });
              if (statusRes.ok) {
                data = await statusRes.json();
              }
            }
          }
        }

        setUsage(data.usage || 0);
        setLimit(data.limit || 3333);
        localStorage.setItem("__pw_chat_usage", String(data.usage || 0));
        localStorage.setItem("__pw_chat_limit", String(data.limit || 3333));
      } catch (err) {
        console.error(err);
      }
    };
    initSession();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const sessionId = localStorage.getItem("__pw_chat_session");
    if (!sessionId) {
      setMessages([...messages, { role: "assistant", content: "Session Error: No active chat session found. Please refresh the page.", isError: true, recommendations: [] }]);
      return;
    }

    const newMessages = [...messages, { role: "user", content: text } as Message];
    setMessages(newMessages);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        let friendlyError = data.error || "System Alert: An unexpected error occurred while communicating with the AI. Let's try again in a moment.";
        const errorStr = (data.error || "").toLowerCase();

        if (response.status === 429 || errorStr.includes("429") || errorStr.includes("rate_limit_exceeded") || errorStr.includes("rate limit")) {
          if (errorStr.includes("daily") || errorStr.includes("session")) {
            friendlyError = "Daily Limit Met: You have reached the token limit for this session today. Please try again tomorrow!";
          } else {
            friendlyError = "Rate Limit Warning: AI service is currently under heavy load. Please wait a few seconds and try again.";
          }
        } else if (response.status === 401 || response.status === 403 || errorStr.includes("api_key") || errorStr.includes("auth") || errorStr.includes("decommissioned")) {
          friendlyError = "System Alert: AI service is temporarily unavailable due to system configurations. Please contact the administrator.";
        }

        setMessages([...newMessages, { role: "assistant", content: friendlyError, isError: true, recommendations: [] }]);
        if (data.usage !== undefined) {
          setUsage(data.usage);
          localStorage.setItem("__pw_chat_usage", String(data.usage));
        }
        if (data.limit !== undefined) {
          setLimit(data.limit);
          localStorage.setItem("__pw_chat_limit", String(data.limit));
        }
        return;
      }

      const recs = getRandomRecommendations(text);
      setMessages([...newMessages, { role: "assistant", content: data.reply, recommendations: recs }]);
      
      const newUsage = data.sessionUsageToday || 0;
      const newLimit = data.sessionLimit || 3333;
      setUsage(newUsage);
      setLimit(newLimit);
      localStorage.setItem("__pw_chat_usage", String(newUsage));
      localStorage.setItem("__pw_chat_limit", String(newLimit));
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Connection Error: Failed to connect to AI assistant. Please check your network and try again.", isError: true, recommendations: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const usagePercent = Math.min((usage / limit) * 100, 100);

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-mono">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300 border border-primary/20 glow-green cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <Bot className="h-6 w-6 animate-pulse" />
        </button>
      ) : (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up card-glow">
          <div className="w-full h-1 bg-muted relative">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            />
            <div className="absolute top-1 right-2 text-[9px] text-muted-foreground">
              Usage: {usage} / {limit} ({usagePercent.toFixed(0)}%)
            </div>
          </div>

          <div className="bg-muted/40 border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-neon-green" />
              <span className="text-xs font-bold text-foreground">daniyal.dev / ai-assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.length === 0 && (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-8">
                <Sparkles className="h-8 w-8 text-neon-cyan animate-pulse" />
                <div className="space-y-1">
                  <p className="font-bold text-foreground">How can I help you today?</p>
                  <p className="text-[10px] text-muted-foreground max-w-[250px]">
                    Ask me anything about Daniyal's skills, projects, work experience, or availability.
                  </p>
                </div>
                <div className="w-full space-y-2 pt-2">
                  {RECOMMENDED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="w-full text-left bg-muted/60 border border-border hover:border-primary/50 hover:bg-muted p-2 rounded transition-colors text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className="space-y-1.5"
              >
                <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded px-3 py-2 border break-words transition-all duration-300 ${
                      m.role === "user"
                        ? "bg-primary/10 border-primary/30 text-neon-green"
                        : m.isError
                        ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_12px_rgba(239,68,68,0.15)] cursor-default"
                        : "bg-muted/60 border-border text-foreground hover:border-primary/30 hover:bg-muted/80 cursor-default"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
                {m.role === "assistant" && m.recommendations && m.recommendations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-start pl-2">
                    {m.recommendations.map((rec, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => handleSendMessage(rec)}
                        disabled={loading}
                        className="text-[9px] text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/80 border border-border/60 hover:border-primary/40 px-2 py-1 rounded transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {rec}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted/60 border border-border rounded px-3 py-2 text-muted-foreground animate-pulse">
                  System is generating response... ▊
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 border-t border-border bg-muted/20 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about skills, projects, etc..."
              disabled={loading}
              className="flex-1 bg-muted border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-neon-green text-foreground disabled:opacity-60 font-mono"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-primary text-primary-foreground p-2 rounded hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Send Message"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
