import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { ChatStats, SessionBreakdownItem } from "../../types";

interface ChatTabProps {
  chatStats: ChatStats;
  settings: any;
  tokenGraphTab: "daily" | "weekly" | "monthly";
  setTokenGraphTab: (tab: "daily" | "weekly" | "monthly") => void;
  requestGraphTab: "daily" | "weekly" | "monthly";
  setRequestGraphTab: (tab: "daily" | "weekly" | "monthly") => void;
  sessionSearch: string;
  setSessionSearch: (val: string) => void;
  sessionSortKey: "createdAt" | "lastActivity" | "tokensUsed" | "totalRequests";
  setSessionSortKey: (key: "createdAt" | "lastActivity" | "tokensUsed" | "totalRequests") => void;
  sessionSortOrder: "asc" | "desc";
  setSessionSortOrder: (order: "asc" | "desc") => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  chatStats,
  settings,
  tokenGraphTab,
  setTokenGraphTab,
  requestGraphTab,
  setRequestGraphTab,
  sessionSearch,
  setSessionSearch,
  sessionSortKey,
  setSessionSortKey,
  sessionSortOrder,
  setSessionSortOrder,
}) => {
  const PALETTE_COLORS: Record<string, { primary: string; secondary: string }> = {
    matrix: { primary: "#10b981", secondary: "#06b6d4" },
    dracula: { primary: "#bd93f9", secondary: "#ff79c6" },
    nordic: { primary: "#88c0d0", secondary: "#8fbcbb" },
    sunset: { primary: "#f59e0b", secondary: "#f43f5e" },
    amber: { primary: "#d97706", secondary: "#b45309" },
  };
  const activeColors = PALETTE_COLORS[settings?.selectedPalette || "matrix"] || PALETTE_COLORS.matrix;

  const handleSort = (key: typeof sessionSortKey) => {
    if (sessionSortKey === key) {
      setSessionSortOrder(sessionSortOrder === "asc" ? "desc" : "asc");
    } else {
      setSessionSortKey(key);
      setSessionSortOrder("desc");
    }
  };

  const filteredSessions = (chatStats.sessionBreakdown || []).filter((s: SessionBreakdownItem) => {
    if (!sessionSearch) return true;
    return s.sessionId.toLowerCase().includes(sessionSearch.toLowerCase());
  });

  const sortedSessions = [...filteredSessions].sort((a: SessionBreakdownItem, b: SessionBreakdownItem) => {
    let valA = a[sessionSortKey];
    let valB = b[sessionSortKey];
    
    if (sessionSortKey === "createdAt" || sessionSortKey === "lastActivity") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (valA < valB) return sessionSortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sessionSortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const tokenData = tokenGraphTab === "daily" 
    ? (chatStats.graphs?.dailyTokens || [])
    : tokenGraphTab === "weekly" 
    ? (chatStats.graphs?.weeklyTokens || []) 
    : (chatStats.graphs?.monthlyTokens || []);
  
  const tokenDataKey = tokenGraphTab === "daily" ? "date" : tokenGraphTab === "weekly" ? "week" : "month";

  const requestData = requestGraphTab === "daily" 
    ? (chatStats.graphs?.dailyRequests || [])
    : requestGraphTab === "weekly" 
    ? (chatStats.graphs?.weeklyRequests || []) 
    : (chatStats.graphs?.monthlyRequests || []);

  const requestDataKey = requestGraphTab === "daily" ? "date" : requestGraphTab === "weekly" ? "week" : "month";

  const statusData = [
    { name: "Active", value: chatStats.summary?.activeSessions || 0 },
    { name: "Inactive", value: chatStats.summary?.inactiveSessions || 0 }
  ];
  const statusColors = [activeColors.primary, "#4b5563"];

  const renderSortIcon = (key: typeof sessionSortKey) => {
    if (sessionSortKey !== key) return null;
    return sessionSortOrder === "asc" ? <ArrowUp size={12} className="inline ml-1" /> : <ArrowDown size={12} className="inline ml-1" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Today's Tokens</h4>
            <p className="text-2xl font-bold text-neon-green mt-1">{(chatStats.summary?.todayTokens || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">All Time Tokens</h4>
            <p className="text-2xl font-bold text-neon-green mt-1">{(chatStats.summary?.allTimeTokens || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Today's Requests</h4>
            <p className="text-2xl font-bold text-neon-cyan mt-1">{(chatStats.summary?.todayRequests || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">All Time Requests</h4>
            <p className="text-2xl font-bold text-neon-cyan mt-1">{(chatStats.summary?.allTimeRequests || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Active Sessions</h4>
            <p className="text-2xl font-bold text-neon-green mt-1">{(chatStats.summary?.activeSessions || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Inactive Sessions</h4>
            <p className="text-2xl font-bold text-muted-foreground mt-1">{(chatStats.summary?.inactiveSessions || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Avg Tokens / Request</h4>
            <p className="text-2xl font-bold text-neon-cyan mt-1">{(chatStats.summary?.averageTokensPerRequest || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Avg Requests / Session</h4>
            <p className="text-2xl font-bold text-neon-cyan mt-1">{(chatStats.summary?.averageRequestsPerSession || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h4 className="text-xs font-bold text-foreground">Token Usage Trend</h4>
            <div className="flex bg-muted/40 p-0.5 rounded border border-border self-start gap-0.5">
              {(["daily", "weekly", "monthly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTokenGraphTab(t)}
                  className={`px-2 py-1 rounded text-[9px] capitalize transition-all cursor-pointer ${
                    tokenGraphTab === t
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-60">
            {tokenData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tokenData}>
                  <defs>
                    <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeColors.primary} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={activeColors.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.1} />
                  <XAxis dataKey={tokenDataKey} stroke="var(--muted-foreground)" fontSize={9} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={9} tickLine={false} />
                  <ChartTooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)", fontSize: "10px" }} itemStyle={{ color: "var(--foreground)" }} />
                  <Area type="monotone" dataKey="tokens" name="Tokens" stroke={activeColors.primary} fillOpacity={1} fill="url(#colorTokens)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No token logs available.</div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h4 className="text-xs font-bold text-foreground">Request Counts Trend</h4>
            <div className="flex bg-muted/40 p-0.5 rounded border border-border self-start gap-0.5">
              {(["daily", "weekly", "monthly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setRequestGraphTab(t)}
                  className={`px-2 py-1 rounded text-[9px] capitalize transition-all cursor-pointer ${
                    requestGraphTab === t
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-60">
            {requestData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={requestData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeColors.secondary} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={activeColors.secondary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.1} />
                  <XAxis dataKey="requestDataKey" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={9} tickLine={false} />
                  <ChartTooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)", fontSize: "10px" }} itemStyle={{ color: "var(--foreground)" }} />
                  <Area type="monotone" dataKey="requests" name="Requests" stroke={activeColors.secondary} fillOpacity={1} fill="url(#colorRequests)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No request logs available.</div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <h4 className="text-xs font-bold text-foreground mb-4">Session Growth (Last 30 Days)</h4>
          <div className="h-60">
            {chatStats.graphs?.sessionGrowth?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chatStats.graphs.sessionGrowth}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeColors.primary} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={activeColors.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.1} />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={9} tickLine={false} />
                  <ChartTooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)", fontSize: "10px" }} itemStyle={{ color: "var(--foreground)" }} />
                  <Area type="monotone" dataKey="totalSessions" name="Total Sessions" stroke={activeColors.primary} fillOpacity={1} fill="url(#colorGrowth)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No session growth data.</div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-foreground">Active vs Inactive Ratio</h4>
            <div className="text-[10px] text-muted-foreground">
              Active: {chatStats.summary?.activeSessions || 0} / Inactive: {chatStats.summary?.inactiveSessions || 0}
            </div>
          </div>
          <div className="h-60 flex items-center justify-center">
            {chatStats.summary?.activeSessions + chatStats.summary?.inactiveSessions > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)", fontSize: "10px" }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "10px", color: "var(--foreground)" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No session ratio data.</div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 card-glow flex flex-col justify-between lg:col-span-2">
          <h4 className="text-xs font-bold text-foreground mb-4">Token Distribution (Top 10 Sessions)</h4>
          <div className="h-60">
            {chatStats.graphs?.tokenDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chatStats.graphs.tokenDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.1} />
                  <XAxis dataKey="session" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={9} tickLine={false} />
                  <ChartTooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)", fontSize: "10px" }} itemStyle={{ color: "var(--foreground)" }} />
                  <Bar dataKey="tokens" name="Tokens Consumed" fill={activeColors.secondary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No session token distribution data.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 card-glow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <h4 className="text-xs font-bold text-foreground">Session Usage Breakdown</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Track and query token allocations across active customer sockets</p>
          </div>
          <input
            type="text"
            placeholder="Search by session key..."
            value={sessionSearch}
            onChange={(e) => setSessionSearch(e.target.value)}
            className="bg-muted border border-border rounded px-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-neon-green transition-colors font-mono w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10px]">
            <thead>
              <tr className="border-b border-border/40 text-muted-foreground uppercase text-[9px] tracking-wider select-none">
                <th className="py-2.5 px-3">Session ID</th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("createdAt")}>
                  Registered {renderSortIcon("createdAt")}
                </th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("lastActivity")}>
                  Last Activity {renderSortIcon("lastActivity")}
                </th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-foreground text-right" onClick={() => handleSort("tokensUsed")}>
                  Tokens {renderSortIcon("tokensUsed")}
                </th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-foreground text-right" onClick={() => handleSort("totalRequests")}>
                  Queries {renderSortIcon("totalRequests")}
                </th>
                <th className="py-2.5 px-3 text-right">Avg T/Q</th>
              </tr>
            </thead>
            <tbody>
              {sortedSessions.map((session) => (
                <tr key={session.sessionId} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                  <td className="py-2 px-3 text-neon-cyan select-all max-w-[120px] truncate" title={session.sessionId}>
                    {session.sessionId}
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">
                    {new Date(session.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">
                    {new Date(session.lastActivity).toLocaleString()}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      session.status === "Active" 
                        ? "bg-emerald-950/30 border border-emerald-900/50 text-emerald-400" 
                        : "bg-gray-800/30 border border-gray-700/50 text-muted-foreground"
                    }`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-neon-green font-bold">
                    {session.tokensUsed.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-foreground">
                    {session.totalRequests.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-muted-foreground">
                    {session.averageTokensPerRequest.toFixed(0)}
                  </td>
                </tr>
              ))}
              {sortedSessions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted-foreground">No active sessions located.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
