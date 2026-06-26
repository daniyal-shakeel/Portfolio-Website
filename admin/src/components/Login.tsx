import React from "react";
import { Terminal, User, Lock, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  loginUsername: string;
  setLoginUsername: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  error: string;
  submitting: boolean;
}

export const Login: React.FC<LoginProps> = ({
  loginUsername,
  setLoginUsername,
  loginPassword,
  setLoginPassword,
  showPassword,
  setShowPassword,
  handleLogin,
  error,
  submitting,
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-mono">
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
};
