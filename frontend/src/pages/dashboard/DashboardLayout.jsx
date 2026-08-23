import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authApi, repoApi, secTestApi, severityColor, formatBytes, timeAgo } from "@/lib/api";
import { toast } from "sonner";
import { useLocation, Link } from "wouter";
import { ThreatLensLogo } from "@/components/common/ThreatLensLogo";
import {
  Copy,
  Check,
  X,
  Loader2,
  AlertTriangle,
  WifiOff,
  LogOut,
  User,
  Bell,
  ChevronDown,
  BarChart3,
  Zap,
} from "lucide-react";

// Domain-Based Tab Views
import RepositoriesTab from "./tabs/repositories/RepositoriesTab";
import CommitsTab from "./tabs/commits/CommitsTab";
import LiveFindingsTab from "./tabs/security/LiveFindingsTab";
import SecretDetectionTab from "./tabs/security/SecretDetectionTab";
import CicdDockerTab from "./tabs/security/CicdDockerTab";
import AccountsTab from "./tabs/admin/AccountsTab";
import SystemConfigTab from "./tabs/admin/SystemConfigTab";
import SessionsTab from "./tabs/admin/SessionsTab";
import ChatBotTab from "./tabs/chatbot/ChatBotTab";
import TokenUsageTab from "./tabs/billing/TokenUsageTab";

// Drawers & Modals
import ProfileModal from "@/components/drawers/ProfileModal";

// ── Loading Skeleton ──
function SkeletonBlock({ className = "" }) {
  return <div className={`bg-[#1a2330] rounded animate-pulse ${className}`} />;
}

export default function DashboardLayout() {
  const { user, token, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [activeTopTab, setActiveTopTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [clockStr, setClockStr] = useState("--:--:--");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTokensOpen, setIsTokensOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const tokensRef = useRef(null);

  // Close tokens dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tokensRef.current && !tokensRef.current.contains(e.target)) {
        setIsTokensOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Responsive Media Query Listener for Screen Resize
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 1023px)");
    const handleMediaChange = (e) => {
      if (e.matches) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    mql.addEventListener("change", handleMediaChange);
    return () => mql.removeEventListener("change", handleMediaChange);
  }, []);

  const handleNavClick = (id) => {
    setActiveNav(id);
    setActiveTopTab("dashboard");
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const userRole = (user?.role || "analyst").toLowerCase();
  const isAdmin = userRole !== "user";

  // Redirect away from admin tabs if role is user
  useEffect(() => {
    if (!isAdmin && ["accounts", "config", "sessions"].includes(activeNav)) {
      setActiveNav("dashboard");
    }
  }, [isAdmin, activeNav]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully signed out");
      setLocation("/login");
    } catch (err) {
      toast.error("Logout failed: " + (err.message || "Unknown error"));
    }
  };

  // ── Live data state ──
  const [pulse, setPulse] = useState(null);
  const [counts, setCounts] = useState(null);
  const [repos, setRepos] = useState([]);
  const [latestCommits, setLatestCommits] = useState([]);
  const [secTestReport, setSecTestReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Digital Clock
  useEffect(() => {
    const pad = (n) => n.toString().padStart(2, "0");
    const tick = () => {
      const d = new Date();
      setClockStr(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Fetch all dashboard data ──
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [pulseRes, countsRes, reposRes, secTestRes] = await Promise.allSettled([
        authApi.getPulse(),
        authApi.getCounts(token),
        repoApi.getRepos(token),
        secTestApi.getReport(),
      ]);

      if (pulseRes.status === "fulfilled") setPulse(pulseRes.value);
      if (countsRes.status === "fulfilled") setCounts(countsRes.value);

      let fetchedRepos = [];
      if (reposRes.status === "fulfilled" && Array.isArray(reposRes.value)) {
        fetchedRepos = reposRes.value;
        setRepos(fetchedRepos);
      }

      if (secTestRes.status === "fulfilled") setSecTestReport(secTestRes.value);

      // Fetch latest commits from first repo
      if (fetchedRepos.length > 0) {
        try {
          const commitsRes = await repoApi.getCommits(token, fetchedRepos[0].id, 1, 5);
          setLatestCommits(commitsRes?.data || []);
        } catch { /* ignore */ }
      }
    } catch {
      // individual errors handled above
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ── Refresh pulse periodically ──
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const p = await authApi.getPulse();
        setPulse(p);
      } catch { /* ignore */ }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Computed dashboard KPIs ──
  const secTestFindings = secTestReport?.findings || [];
  const secTestSummary = secTestReport?.summary?.by_severity || {};

  // Aggregate findings from latest commits
  const commitFindingCounts = latestCommits.reduce(
    (acc, c) => {
      acc.critical += c.summary?.critical || 0;
      acc.high += c.summary?.high || 0;
      acc.medium += c.summary?.medium || 0;
      acc.low += c.summary?.low || 0;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 }
  );

  const kpis = [
    {
      label: "Critical findings",
      value: String((secTestSummary.critical || 0) + commitFindingCounts.critical),
      sub: secTestReport ? "commit + scanner combined" : "from commit analysis",
      type: "critical",
    },
    {
      label: "High severity",
      value: String((secTestSummary.high || 0) + commitFindingCounts.high),
      sub: `across ${repos.length} repositories`,
      type: "high",
    },
    {
      label: "Medium severity",
      value: String((secTestSummary.medium || 0) + commitFindingCounts.medium),
      sub: "commit + scanner combined",
      type: "medium",
    },
    {
      label: "Repos monitored",
      value: String(repos.length),
      sub: repos.length > 0
        ? `${repos.reduce((s, r) => s + (r.commit_count || 0), 0).toLocaleString()} total commits`
        : "no repos scanned yet",
      type: "low",
    },
  ];

  // ── Risk gauge ──
  const avgRiskScore = latestCommits.length > 0
    ? Math.round(latestCommits.reduce((s, c) => s + (c.summary?.risk_score || 0), 0) / latestCommits.length)
    : 0;
  const gaugeOffset = 314 - (314 * avgRiskScore) / 100;
  const gaugeColor = avgRiskScore >= 80 ? "#C8A27A" : avgRiskScore >= 50 ? "#6EA8DA" : avgRiskScore >= 20 ? "#2C6CB0" : "#1D3557";

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleCopyPayload = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Payload copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Pulse display ──
  const pulseHealthy = pulse?.status === "healthy" && pulse?.state === "active";
  const scannerOnline = secTestReport !== null;

  return (
    <div
      className="min-h-screen text-[#d8e2e8] flex flex-col select-none"
      style={{
        backgroundColor: "#000000",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        backgroundImage:
          "linear-gradient(#141416 1px, transparent 1px), linear-gradient(90deg, #141416 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ---------- TOP NAVBAR (Natural Page Flow - Scrolls up with page like LeetCode) ---------- */}
      <header className="relative z-50 w-full h-14 bg-[#080d1a]/95 backdrop-blur-md border-b border-[#18181b] px-4 lg:px-6 flex items-center justify-between shrink-0 shadow-md">
        {/* Left Side: Brand & Tabs */}
        <div className="h-full flex items-center gap-8 lg:gap-14">
          <Link href="/" className="hover:opacity-90 transition-opacity flex items-center">
            <ThreatLensLogo className="h-6.5 w-auto" />
          </Link>

          {/* Top Navigation Tabs */}
          <nav className="h-full flex items-center gap-7 sm:gap-8 ml-2 lg:ml-4">
            <button
              onClick={() => {
                setActiveTopTab("dashboard");
                setActiveNav("dashboard");
              }}
              className={`h-full flex items-center relative transition-colors cursor-pointer text-sm sm:text-[15px] ${
                activeTopTab === "dashboard" || !activeTopTab
                  ? "text-white font-medium"
                  : "text-[#8e8e93] hover:text-white"
              }`}
            >
              <span>Dashboard</span>
              {(activeTopTab === "dashboard" || !activeTopTab) && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-white rounded-t-sm" />
              )}
            </button>
            <button
              onClick={() => setActiveTopTab("chatbot")}
              className={`h-full flex items-center relative transition-colors cursor-pointer text-sm sm:text-[15px] ${
                activeTopTab === "chatbot"
                  ? "text-white font-medium"
                  : "text-[#8e8e93] hover:text-white"
              }`}
            >
              <span>Chat Bot</span>
              {activeTopTab === "chatbot" && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-white rounded-t-sm" />
              )}
            </button>
            <button
              onClick={() => setActiveTopTab("terminal")}
              className={`h-full flex items-center relative transition-colors cursor-pointer text-sm sm:text-[15px] ${
                activeTopTab === "terminal"
                  ? "text-white font-medium"
                  : "text-[#8e8e93] hover:text-white"
              }`}
            >
              <span>Terminal History</span>
              {activeTopTab === "terminal" && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-white rounded-t-sm" />
              )}
            </button>
          </nav>
        </div>

        {/* Right Side: Notifications, Avatar, Tokens Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => toast.info("No unread alerts")}
            className="p-1.5 text-[#8a99ad] hover:text-white hover:bg-[#18181b] rounded-lg transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center rounded-full ring-1 ring-white/10 hover:ring-[#6EA8DA]/60 transition-all cursor-pointer overflow-hidden p-0.5"
            title="Account Settings"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #2C6CB0, #6EA8DA)",
                }}
              >
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "TL"}
              </div>
            )}
          </button>

          {/* Tokens Dropdown */}
          <div className="relative" ref={tokensRef}>
            <button
              onClick={() => setIsTokensOpen(!isTokensOpen)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-b from-[#1e5adb] via-[#1342a8] to-[#0c2a74] hover:brightness-110 text-[#E0F2FE] hover:text-white text-xs font-bold shadow-[0_0_16px_rgba(29,78,216,0.35)] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 font-sans tracking-wide border-0 outline-none"
              title="Tokens & Subscriptions"
            >
              <span>Tokens</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#BAE6FD] transition-transform duration-200 ${isTokensOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isTokensOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#0b0f19] border border-[#222f46] shadow-[0_10px_40px_rgba(0,0,0,0.95)] p-1.5 backdrop-blur-xl z-[9999] select-none">
                <div className="px-3 py-1.5 border-b border-[#1c2638] mb-1">
                  <div className="text-[10px] uppercase font-bold text-[#6EA8DA] tracking-wider">
                    API & Credits
                  </div>
                </div>

                {/* Option 1: Token usage */}
                <button
                  onClick={() => {
                    setActiveTopTab("tokens");
                    setIsTokensOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-[#162032] text-[#d8e2e8] hover:text-white transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-md bg-[#1D3557]/60 border border-[#2C6CB0]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-3.5 h-3.5 text-[#6EA8DA]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white">Token usage</div>
                    <div className="text-[10px] text-[#8a99ad]">Quotas & usage metrics</div>
                  </div>
                </button>

                {/* Option 2: Premium plans */}
                <button
                  onClick={() => setIsTokensOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-[#162032] text-[#d8e2e8] hover:text-white transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-md bg-[#3b2d18]/60 border border-[#C8A27A]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Zap className="w-3.5 h-3.5 text-[#C8A27A]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white">Premium plans</div>
                    <div className="text-[10px] text-[#8a99ad]">Upgrade tier & limit</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ---------- MAIN CONTENT / CHATBOT / BILLING VIEW ---------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeTopTab === "chatbot" ? (
          <ChatBotTab user={user} />
        ) : activeTopTab === "tokens" ? (
          <TokenUsageTab user={user} />
        ) : (
          <div className="flex-1 flex min-w-0">
            {/* ---------- SIDEBAR (Responsive & Collapsible) ---------- */}
            {isSidebarOpen && (
            <>
              {/* Mobile backdrop overlay */}
              <div
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 top-14 bg-black/75 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
                aria-hidden="true"
              />

              <aside className="w-[240px] shrink-0 sticky top-0 h-screen flex flex-col border-r border-[#18181b] bg-[#000000] z-30 shadow-2xl lg:shadow-none">
              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                <div className="text-[7.5px] text-[#6EA8DA] font-bold uppercase tracking-[2px] mb-1.5 px-2 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#6EA8DA] animate-pulse" />
                  <span>Overview</span>
                </div>
                {[
                  { id: "dashboard", icon: "▣", label: "Dashboard", color: "#6EA8DA" },
                  { id: "repositories", icon: "◧", label: "Repositories", color: "#6EA8DA" },
                  { id: "commits", icon: "↯", label: "Commits", color: "#6EA8DA" },
                ].map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full group flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9.5px] font-medium border transition-all duration-200 text-left cursor-pointer ${
                        isActive
                          ? "bg-[#1D3557]/80 text-white border-[#2C6CB0] translate-x-0.5 shadow-sm"
                          : "border-transparent hover:bg-[#18181b] text-[#9caec2] hover:text-white hover:translate-x-0.5"
                      }`}
                    >
                      <span
                        className={`w-0.5 h-2 rounded-full transition-all duration-200 ${
                          isActive ? "bg-[#6EA8DA] opacity-100" : "bg-transparent opacity-0 group-hover:bg-[#6EA8DA]/50 group-hover:opacity-100"
                        }`}
                      />
                      <span
                        className={`w-3 text-center text-[8.5px] font-bold shrink-0 transition-all duration-200 group-hover:scale-110 ${
                          isActive ? "text-white" : "text-[#9caec2] group-hover:text-white"
                        }`}
                        style={{ color: isActive ? item.color : undefined }}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`truncate flex-1 transition-colors duration-200 ${
                          isActive ? "text-white font-semibold" : "text-[#9caec2] group-hover:text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}

              <div className="text-[7.5px] text-[#C8A27A] font-bold uppercase tracking-[2px] mt-3.5 mb-1.5 px-2 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#C8A27A] animate-pulse" />
                <span>Security</span>
              </div>
              {[
                { id: "findings", icon: "⌁", label: "Live Findings", color: "#C8A27A" },
                { id: "secrets", icon: "⚑", label: "Secret Detection", color: "#C8A27A" },
                { id: "cicd", icon: "◫", label: "CI/CD & Docker", color: "#C8A27A" },
              ].map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full group flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9.5px] font-medium border transition-all duration-200 text-left cursor-pointer ${
                      isActive
                        ? "bg-[#1D3557]/80 text-white border-[#2C6CB0] translate-x-0.5 shadow-sm"
                        : "border-transparent hover:bg-[#18181b] text-[#9caec2] hover:text-white hover:translate-x-0.5"
                    }`}
                  >
                    <span
                      className={`w-0.5 h-2 rounded-full transition-all duration-200 ${
                        isActive ? "bg-[#C8A27A] opacity-100" : "bg-transparent opacity-0 group-hover:bg-[#C8A27A]/50 group-hover:opacity-100"
                      }`}
                    />
                    <span
                      className={`w-3 text-center text-[8.5px] font-bold shrink-0 transition-all duration-200 group-hover:scale-110 ${
                        isActive ? "text-white" : "text-[#9caec2] group-hover:text-white"
                      }`}
                      style={{ color: isActive ? item.color : undefined }}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`truncate flex-1 transition-colors duration-200 ${
                        isActive ? "text-white font-semibold" : "text-[#9caec2] group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}

              {isAdmin && (
                <>
                  <div className="text-[7.5px] text-[#6EA8DA] font-bold uppercase tracking-[2px] mt-3.5 mb-1.5 px-2 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#6EA8DA] animate-pulse" />
                    <span>Admin</span>
                  </div>
                  {[
                    { id: "accounts", icon: "☰", label: "Accounts", color: "#6EA8DA" },
                    { id: "config", icon: "⚙", label: "System Config", color: "#6EA8DA" },
                    { id: "sessions", icon: "◔", label: "Sessions", color: "#6EA8DA" },
                  ].map((item) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full group flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9.5px] font-medium border transition-all duration-200 text-left cursor-pointer ${
                          isActive
                            ? "bg-[#1D3557]/80 text-white border-[#2C6CB0] translate-x-0.5 shadow-sm"
                            : "border-transparent hover:bg-[#18181b] text-[#9caec2] hover:text-white hover:translate-x-0.5"
                        }`}
                      >
                        <span
                          className={`w-0.5 h-2 rounded-full transition-all duration-200 ${
                            isActive ? "bg-[#6EA8DA] opacity-100" : "bg-transparent opacity-0 group-hover:bg-[#6EA8DA]/50 group-hover:opacity-100"
                          }`}
                        />
                        <span
                          className={`w-3 text-center text-[8.5px] font-bold shrink-0 transition-all duration-200 group-hover:scale-110 ${
                            isActive ? "text-white" : "text-[#9caec2] group-hover:text-white"
                          }`}
                          style={{ color: isActive ? item.color : undefined }}
                        >
                          {item.icon}
                        </span>
                        <span
                          className={`truncate flex-1 transition-colors duration-200 ${
                            isActive ? "text-white font-semibold" : "text-[#9caec2] group-hover:text-white"
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </>
              )}
            </nav>

            {/* Bottom User Card */}
            <div className="p-2 border-t border-[#18181b] bg-[#000000]">
              <button
                onClick={() => {
                  setIsProfileOpen(true);
                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
                title="Edit Profile & Account Details"
                className="w-full flex items-center gap-2 p-1.5 rounded-xl bg-[#0c0c0e] hover:bg-[#1D3557]/40 border border-[#222225] hover:border-[#2C6CB0]/60 transition-all duration-200 text-left group cursor-pointer"
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover border border-[#6EA8DA]/50 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm group-hover:scale-105 transition-transform shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #2C6CB0, #6EA8DA)",
                    }}
                  >
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : "TL"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-[#EAF2F8] font-semibold truncate group-hover:text-[#6EA8DA] transition-colors">
                    {user?.name || "User"}
                  </div>
                  <div className="text-[#8a99ad] text-[8px] uppercase font-medium tracking-wider truncate">
                    {user?.role || "analyst"} · edit
                  </div>
                </div>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">

        {/* Main Content */}
        <main className="p-8 lg:p-10 pb-20 space-y-7 max-w-[1600px] w-full">
          {activeNav === "dashboard" && (
            <>
              {/* Page Head */}
              <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white">Security Overview</h1>
                  <p className="text-xs text-[#8a99ad] mt-1">
                    {repos.length > 0
                      ? `scanning ${repos.length} repositories · ${scannerOnline ? "live DAST daemon on :8765" : "scanner offline"}`
                      : "no repositories scanned yet · connect backend to get started"}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <button
                    onClick={() => toast.success("Exported full security summary (CSV / JSON)")}
                    className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all cursor-pointer font-medium"
                  >
                    Export report
                  </button>
                  <button
                    onClick={() => setActiveNav("findings")}
                    className="px-4 py-2 rounded-lg bg-[#2962FF] hover:bg-[#1e4ed8] text-white font-semibold shadow-[0_0_15px_rgba(41,98,255,0.35)] transition-all cursor-pointer"
                  >
                    Run new scan
                  </button>
                </div>
              </div>

              {/* KPI ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonBlock key={i} className="h-24 rounded-xl" />
                    ))
                  : kpis.map((k, i) => (
                      <div
                        key={i}
                        className="bg-[#10151a] border border-[#263544] hover:border-[#38bdf8]/40 rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all"
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 w-[3.5px]"
                          style={{
                            backgroundColor: severityColor(k.type),
                          }}
                        />
                        <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-semibold">{k.label}</div>
                        <div
                          className="text-xl font-bold mt-1.5"
                          style={{ color: severityColor(k.type) }}
                        >
                          {k.value}
                        </div>
                        <div className="text-[11px] text-[#8a99ad] mt-1">{k.sub}</div>
                      </div>
                    ))}
              </div>

              {/* GAUGE + COMMITS SPLIT */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5.5">
                {/* Left: Latest Analyzed Commits */}
                <div className="bg-[#10151a] border border-[#263544] hover:border-[#2f4255] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex items-center justify-between p-3 px-4 border-b border-[#253240] bg-[#12181f]/60">
                      <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                        Latest analyzed commits
                      </h2>
                      <div className="text-[10px] text-[#8a99ad]">
                        {repos.length > 0 ? `GET /repo/${repos[0]?.id}/commits` : "no repo"}
                      </div>
                    </div>

                    <div className="divide-y divide-[#222e3a]">
                      {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="p-3 px-4.5">
                            <SkeletonBlock className="h-10 w-full" />
                          </div>
                        ))
                      ) : latestCommits.length === 0 ? (
                        <div className="p-8 text-center">
                          <WifiOff className="w-6 h-6 mx-auto text-[#8a99ad] mb-2" />
                          <p className="font-mono text-xs text-[#8a99ad]">No commit data available yet</p>
                          <p className="font-mono text-[10px] text-[#6f8390] mt-1">Run the CLI scanner to analyze commits</p>
                        </div>
                      ) : (
                        latestCommits.map((c, i) => {
                          const score = c.summary?.risk_score || 0;
                          const level = c.summary?.risk_level || "low";
                          const color = severityColor(level);
                          return (
                            <div
                              key={i}
                              onClick={() => handleOpenDetail({
                                sha: c.commit?.short_sha,
                                fullSha: c.commit?.sha,
                                msg: c.commit?.message,
                                meta: `${c.commit?.author_name} · ${c.summary?.files_changed || 0} files · ${(c.findings || []).length} findings`,
                                risk: `risk ${score} · ${level}`,
                                score,
                                explanation: c.findings?.[0]?.description || "",
                                evidence: c.findings?.[0]?.evidence || "",
                              })}
                              className="grid grid-cols-[auto_1fr_auto] gap-3.5 items-center p-3 px-4.5 hover:bg-white/[0.03] cursor-pointer transition-colors"
                            >
                              <span className="font-mono text-[#6EA8DA] bg-[#1D3557]/40 px-2 py-0.5 rounded text-[11px] border border-[#2C6CB0]/40 font-semibold shadow-sm">
                                {c.commit?.short_sha}
                              </span>
                              <div className="min-w-0 pr-2">
                                <div className="text-[#d8e2e8] text-xs font-semibold truncate">{c.commit?.message}</div>
                                <div className="text-[#8a99ad] text-[10.5px] truncate mt-0.5">
                                  {c.commit?.author_name} · {timeAgo(c.commit?.authored_at)} · {c.summary?.files_changed || 0} files
                                </div>
                              </div>
                              <span
                                className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap font-semibold"
                                style={{
                                  color,
                                  borderColor: color,
                                  backgroundColor: `${color}14`,
                                }}
                              >
                                risk {score} · {level}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Repo Risk Score Gauge + Pulse */}
                <div className="bg-[#10151a] border border-[#263544] hover:border-[#2f4255] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex items-center justify-between p-3 px-4 border-b border-[#253240] bg-[#12181f]/60">
                      <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                        Repo risk score
                      </h2>
                      <div className="text-[10px] text-[#8a99ad]">weighted average</div>
                    </div>

                    <div className="flex items-center gap-6 p-5 px-6">
                      <div className="relative w-24 h-24 shrink-0">
                        <svg width="96" height="96" viewBox="0 0 120 120" className="-rotate-90">
                          <circle cx="60" cy="60" r="50" fill="none" stroke="#222e3a" strokeWidth="10" />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke={gaugeColor}
                            strokeWidth="10"
                            strokeDasharray="314"
                            strokeDashoffset={gaugeOffset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <b className="text-lg text-white font-bold">{avgRiskScore}</b>
                          <span className="text-[8.5px] text-[#8a99ad] uppercase tracking-wider font-semibold">/ 100</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#C8A27A]" />
                          <span className="font-medium text-white">Critical × 40</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#6EA8DA]" />
                          <span className="font-medium text-white">High × 20</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#2C6CB0]" />
                          <span className="font-medium text-white">Medium × 8</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#1D3557] border border-[#6EA8DA]/40" />
                          <span className="font-medium text-white">Low × 2</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#253240]">
                    <div className="flex items-center justify-between p-2.5 px-4 border-b border-[#253240]/60 bg-[#12181f]/40">
                      <h2 className="text-xs font-bold text-white">System pulse</h2>
                      <div className="text-[10px] text-[#8a99ad]">/tc-auth/config/pulse</div>
                    </div>
                    <div className="p-3.5 px-4 font-mono text-[11px] text-[#8a99ad] leading-relaxed">
                      {counts ? (
                        <>
                          accounts: <span className="text-white font-bold">{counts.accounts}</span> · sessions:{" "}
                          <span className="text-white font-bold">{counts.sessions}</span> · oauth:{" "}
                          <span className="text-white font-bold">{counts.oauth}</span> · otp:{" "}
                          <span className="text-white font-bold">{counts.otp}</span>
                        </>
                      ) : (
                        <span className="text-[#6f8390]">connecting to backend…</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* LIVE SECTEST FINDINGS TABLE */}
              <div className="bg-[#10151a] border border-[#263544] hover:border-[#2f4255] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all">
                <div className="flex items-center justify-between p-3 px-4 border-b border-[#253240] bg-[#12181f]/60">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                    Live SecTest findings
                  </h2>
                  <div className="text-[10px] text-[#8a99ad]">
                    GET :8765/report.json{secTestReport?.scanned_at ? ` · scanned ${timeAgo(secTestReport.scanned_at)}` : ""}
                  </div>
                </div>

                {!scannerOnline ? (
                  <div className="p-8 text-center">
                    <WifiOff className="w-6 h-6 mx-auto text-[#ff9a3c] mb-2" />
                    <p className="font-mono text-xs text-[#8a99ad]">SecTest scanner is offline</p>
                    <p className="font-mono text-[10px] text-[#6f8390] mt-1">Start the scanner on port 8765 to see live vulnerability findings</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#253240] text-[10px] font-mono uppercase tracking-wider text-[#8a99ad] bg-[#0c1015]">
                          <th className="py-3 px-4.5">Severity</th>
                          <th className="py-3 px-4.5">Finding</th>
                          <th className="py-3 px-4.5">Module</th>
                          <th className="py-3 px-4.5">Endpoint / CWE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222e3a]">
                        {secTestFindings.map((f, i) => {
                          const color = severityColor(f.severity);
                          return (
                            <tr
                              key={i}
                              onClick={() => handleOpenDetail({
                                title: f.title,
                                severity: f.severity,
                                module: f.module,
                                endpoint: `${f.meta?.endpoint || ""} · ${f.meta?.cwe || ""}`,
                                evidence: f.evidence,
                                explanation: f.explanation,
                                remediation: f.remediation,
                              })}
                              className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                            >
                              <td className="py-3 px-4.5 align-top">
                                <span
                                  className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap font-medium"
                                  style={{
                                    color,
                                    borderColor: color,
                                    backgroundColor: `${color}14`,
                                  }}
                                >
                                  {f.severity}
                                </span>
                              </td>
                              <td className="py-3 px-4.5 align-top">
                                <div className="font-semibold text-white">{f.title}</div>
                                <div className="font-mono text-[#8a99ad] text-[10.5px] mt-0.5">{f.evidence}</div>
                              </td>
                              <td className="py-3 px-4.5 align-top font-mono text-[10.5px] text-[#8a99ad]">{f.module}</td>
                              <td className="py-3 px-4.5 align-top font-mono text-[10.5px] text-[#8a99ad]">
                                {f.meta?.endpoint} · {f.meta?.cwe}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SCANNED REPOSITORIES GRID */}
              <div className="bg-[#10151a] border border-[#263544] hover:border-[#2f4255] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all">
                <div className="flex items-center justify-between p-3 px-4 border-b border-[#253240] bg-[#12181f]/60">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                    Scanned repositories
                  </h2>
                  <div className="text-[10px] text-[#8a99ad]">GET /repo</div>
                </div>

                <div className="p-4.5 grid grid-cols-1 md:grid-cols-3 gap-4.5">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonBlock key={i} className="h-44 rounded-xl" />
                    ))
                  ) : repos.length === 0 ? (
                    <div className="md:col-span-3 p-8 text-center">
                      <p className="font-mono text-xs text-[#8a99ad]">No repositories scanned yet</p>
                      <p className="font-mono text-[10px] text-[#6f8390] mt-1">Use the CLI backend to scan a repository</p>
                    </div>
                  ) : (
                    repos.slice(0, 6).map((r, i) => {
                      const langs = r.languages || {};
                      const langTotal = Object.values(langs).reduce((s, v) => s + v, 0) || 1;
                      const langEntries = Object.entries(langs).sort((a, b) => b[1] - a[1]);
                      const langColors = ["#4d9cff", "#f2c94c", "#38bdf8", "#10b981", "#a78bfa"];

                      return (
                        <div
                          key={i}
                          onClick={() => setActiveNav("repositories")}
                          className="bg-[#10151a] border border-[#283747] hover:border-[#38bdf8]/40 rounded-xl p-4 space-y-3.5 shadow-sm transition-all cursor-pointer"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-mono font-bold text-xs text-white">{r.name}</div>
                              <div className="text-[10.5px] text-[#8a99ad] font-mono mt-0.5">{r.username}/{r.name}</div>
                            </div>
                            <div className="font-mono text-[10px] text-[#38bdf8] border border-[#2b3947] bg-[#38bdf8]/10 px-2 py-0.5 rounded font-medium">
                              {r.default_branch}
                            </div>
                          </div>

                          <div className="flex gap-5 font-mono mt-3">
                            <div>
                              <b className="text-sm text-white">{(r.commit_count || 0).toLocaleString()}</b>
                              <span className="text-[9px] text-[#8a99ad] uppercase block mt-0.5">commits</span>
                            </div>
                            <div>
                              <b className="text-sm text-white">{r.files_total || 0}</b>
                              <span className="text-[9px] text-[#8a99ad] uppercase block mt-0.5">files</span>
                            </div>
                            <div>
                              <b className="text-sm text-white">{formatBytes(r.total_size)}</b>
                              <span className="text-[9px] text-[#8a99ad] uppercase block mt-0.5">size</span>
                            </div>
                          </div>

                          <div className="flex h-1.5 rounded overflow-hidden bg-[#222e3a] mt-3">
                            {langEntries.map(([lang, count], li) => (
                              <div
                                key={lang}
                                style={{ width: `${(count / langTotal) * 100}%` }}
                                className={`${li === 0 ? "rounded-l" : ""}`}
                                title={`${lang} ${Math.round((count / langTotal) * 100)}%`}
                                {...{ style: { width: `${(count / langTotal) * 100}%`, backgroundColor: langColors[li % langColors.length] } }}
                              />
                            ))}
                          </div>

                          <div className="flex gap-3.5 text-[10px] font-mono text-[#8a99ad] mt-2 flex-wrap">
                            {langEntries.slice(0, 3).map(([lang, count], li) => (
                              <span key={lang}>
                                <span style={{ color: langColors[li % langColors.length] }}>●</span> {lang} {count}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}

          {activeNav === "repositories" && <RepositoriesTab onInspectCommit={handleOpenDetail} />}

          {activeNav === "commits" && <CommitsTab onInspectCommit={handleOpenDetail} />}

          {activeNav === "findings" && <LiveFindingsTab onInspectFinding={handleOpenDetail} />}

          {activeNav === "secrets" && <SecretDetectionTab />}

          {activeNav === "cicd" && <CicdDockerTab />}

          {activeNav === "accounts" && <AccountsTab />}

          {activeNav === "config" && <SystemConfigTab />}

          {activeNav === "sessions" && <SessionsTab />}
          </main>
        </div>
      </div>
      )}
    </div>



      {/* ---------- SLIDE-OVER DETAIL DRAWER ---------- */}
      {isDrawerOpen && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-[#10151a] border-l border-[#283747] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between p-6.5 overflow-y-auto space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-[#253240]">
                  <div>
                    <span className="font-mono text-[10px] text-[#38bdf8] uppercase tracking-wider font-semibold">
                      {selectedItem.sha ? `Commit ${selectedItem.sha}` : `Finding · ${selectedItem.module || "SecTest"}`}
                    </span>
                    <h2 className="text-base font-mono font-bold text-white mt-1">
                      {selectedItem.title || selectedItem.msg || selectedItem.message}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-[#8a99ad] hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {selectedItem.explanation && (
                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] uppercase text-[#8a99ad] tracking-wider">Technical Analysis:</p>
                    <p className="text-xs text-[#d8e2e8] leading-relaxed p-3.5 rounded-lg bg-[#0a0d10] border border-[#253240]">
                      {selectedItem.explanation}
                    </p>
                  </div>
                )}

                {(selectedItem.evidence || selectedItem.diff) && (
                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] uppercase text-[#8a99ad] tracking-wider">Evidence / Trace:</p>
                    <pre className="text-[11px] font-mono text-[#38bdf8] p-3.5 rounded-lg bg-[#0a0d10] border border-[#253240] overflow-x-auto whitespace-pre-wrap">
                      {selectedItem.evidence || selectedItem.diff}
                    </pre>
                  </div>
                )}

                {selectedItem.remediation && (
                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] uppercase text-[#38bdf8] tracking-wider font-bold">Recommended Fix:</p>
                    <p className="text-xs text-white p-3.5 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 font-mono">
                      {selectedItem.remediation}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#253240] flex items-center justify-between">
                <button
                  onClick={() => handleCopyPayload(JSON.stringify(selectedItem, null, 2))}
                  className="px-4 py-2 rounded-lg font-mono text-xs bg-[#141b21] border border-[#2b3947] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#1a232b] flex items-center gap-2 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#38bdf8]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Payload"}</span>
                </button>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4.5 py-2 rounded-lg font-mono text-xs bg-[#38bdf8] text-[#04140c] font-bold hover:brightness-110 shadow-[0_0_14px_rgba(56,189,248,0.4)] transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- PROFILE & CREDENTIALS MODAL ---------- */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
