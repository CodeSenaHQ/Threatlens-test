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
  ChevronUp,
  BarChart3,
  Zap,
  Search,
  Sparkles,
  FolderGit2,
  GitCommit,
  ShieldAlert,
  Lock,
  Terminal,
  Users,
  Settings,
  Clock,
  Flag,
  Moon,
  Type,
  Repeat,
  ArrowUpCircle,
  Box,
  Share2,
  Figma,
  FileText,
  Globe,
  UserCheck,
  CheckCircle,
  Layers,
  LayoutGrid,
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
import IntroductionTab from "./tabs/overview/IntroductionTab";
import CliAgentTab from "./tabs/docs/CliAgentTab";

// Drawers & Modals
import ProfileModal from "@/components/drawers/ProfileModal";

// â”€â”€ Loading Skeleton â”€â”€
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
  const [isDocNavOpen, setIsDocNavOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const tokensRef = useRef(null);
  const docNavRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tokensRef.current && !tokensRef.current.contains(e.target)) {
        setIsTokensOpen(false);
      }
      if (docNavRef.current && !docNavRef.current.contains(e.target)) {
        setIsDocNavOpen(false);
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

  // â”€â”€ Live data state â”€â”€
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

  // â”€â”€ Fetch all dashboard data â”€â”€
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

  // â”€â”€ Refresh pulse periodically â”€â”€
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const p = await authApi.getPulse();
        setPulse(p);
      } catch { /* ignore */ }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // â”€â”€ Computed dashboard KPIs â”€â”€
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

  // â”€â”€ Risk gauge â”€â”€
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

  // â”€â”€ Pulse display â”€â”€
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
      {/* ---------- STICKY TOP NAVBAR (Untitled UI Docs Style) ---------- */}
      <header className="sticky top-0 z-50 w-full h-14 bg-[#09090b]/80 backdrop-blur-xl border-b border-[#27272a] px-4 lg:px-6 flex items-center justify-between shrink-0">
        {/* Left Side: Brand Logo + Breadcrumbs */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/" className="hover:opacity-90 transition-opacity flex items-center">
            <ThreatLensLogo className="h-6 w-auto" />
          </Link>

          {/* Breadcrumb Navigation with Quick Module Switcher */}
          <div className="flex items-center gap-1.5 text-xs text-[#71717a] relative" ref={docNavRef}>
            <button
              onClick={() => handleNavClick("dashboard")}
              className="hover:text-[#f4f4f5] transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-[#18181b]"
              title="Go to Security Overview"
            >
              Documentation
            </button>
            <span className="text-[#3f3f46]">/</span>
            
            {/* Active module pill button - click to toggle switcher dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDocNavOpen(!isDocNavOpen)}
                className="px-2 py-0.5 rounded-md bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-[#f4f4f5] font-medium capitalize flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Switch Module"
              >
                <span>{activeNav === "chatbot" ? "ThreatLensGO" : activeNav === "dashboard" ? "Dashboard" : activeNav}</span>
                <ChevronDown className={`w-3 h-3 text-[#71717a] transition-transform duration-200 ${isDocNavOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Quick Navigation Menu */}
              {isDocNavOpen && (
                <div className="absolute left-0 top-full mt-2 w-60 rounded-xl bg-[#09090b] border border-[#27272a] shadow-2xl p-1.5 backdrop-blur-xl z-[9999] select-none animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-2.5 py-1 text-[10.5px] font-semibold text-[#71717a] uppercase tracking-wider">
                    Quick Navigation
                  </div>

                  <div className="space-y-0.5 mt-1">
                    {[
                      { id: "dashboard", icon: Sparkles, label: "Introduction / Overview" },
                      { id: "chatbot", icon: Zap, label: "ThreatLensGO Assistant" },
                      { id: "repositories", icon: FolderGit2, label: "Repositories" },
                      { id: "commits", icon: GitCommit, label: "Commit Analysis" },
                      { id: "findings", icon: ShieldAlert, label: "Live Findings" },
                      { id: "secrets", icon: Lock, label: "Secret Detection" },
                      { id: "cicd", icon: Box, label: "CI/CD & Docker" },
                      { id: "compliance", icon: CheckCircle, label: "Compliance & Posture" },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isItemActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleNavClick(item.id);
                            setIsDocNavOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                            isItemActive
                              ? "bg-[#18181b] text-white font-semibold"
                              : "text-[#a1a1aa] hover:text-white hover:bg-[#18181b]/50"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isItemActive ? "text-[#38bdf8]" : "text-[#71717a]"}`} />
                          <span className="truncate flex-1">{item.label}</span>
                          {isItemActive && <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Search, Pulse, Tokens, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Quick Search */}
          <div
            onClick={() => toast.info("Press Ctrl+K or select tabs from sidebar to navigate")}
            className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#a1a1aa] hover:border-[#3f3f46] transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#71717a]" />
            <span className="text-[11.5px] text-[#71717a]">Search docs...</span>
            <kbd className="text-[9.5px] px-1 py-0.2 rounded bg-[#27272a] text-[#a1a1aa] border border-[#3f3f46] font-mono">âŒ˜K</kbd>
          </div>

          {/* Pulse Signal */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-[10.5px] font-mono text-[#a1a1aa]">
            <span className={`w-1.5 h-1.5 rounded-full ${pulseHealthy ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-amber-400"}`} />
            <span className="text-white font-medium">{clockStr}</span>
          </div>

          {/* Notifications */}
          <button
            onClick={() => toast.info("No unread alerts")}
            className="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#18181b] rounded-lg transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Tokens Dropdown */}
          <div className="relative" ref={tokensRef}>
            <button
              onClick={() => setIsTokensOpen(!isTokensOpen)}
              className="px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
              title="Tokens & Subscriptions"
            >
              <Zap className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="font-semibold text-xs">Tokens</span>
              <ChevronDown className={`w-3 h-3 text-[#71717a] transition-transform duration-200 ${isTokensOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isTokensOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#09090b] border border-[#27272a] shadow-2xl p-1.5 backdrop-blur-xl z-[9999] select-none">
                <div className="px-3 py-1.5 border-b border-[#27272a] mb-1">
                  <div className="text-[10px] uppercase font-bold text-[#71717a] tracking-wider">
                    API & Credits
                  </div>
                </div>

                {/* Option 1: Token usage */}
                <button
                  onClick={() => {
                    setActiveTopTab("tokens");
                    setIsTokensOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-[#18181b] text-[#d4d4d8] hover:text-white transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-md bg-[#27272a] border border-[#3f3f46] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-3.5 h-3.5 text-[#38bdf8]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white">Token usage</div>
                    <div className="text-[10px] text-[#71717a]">Quotas & usage metrics</div>
                  </div>
                </button>

                {/* Option 2: Premium plans */}
                <button
                  onClick={() => setIsTokensOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-[#18181b] text-[#d4d4d8] hover:text-white transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-md bg-[#27272a] border border-[#3f3f46] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white">Premium plans</div>
                    <div className="text-[10px] text-[#71717a]">Upgrade tier & limit</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center rounded-full ring-1 ring-[#27272a] hover:ring-[#3f3f46] transition-all cursor-pointer overflow-hidden p-0.5"
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
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#27272a] border border-[#3f3f46] shadow-sm"
              >
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "TL"}
              </div>
            )}
          </button>
        </div>
      </header>

      {/* ---------- MAIN CONTENT / BILLING VIEW ---------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeTopTab === "tokens" ? (
          <TokenUsageTab user={user} />
        ) : (
          <div className="flex-1 flex min-w-0">
            {/* ---------- SIDEBAR (Untitled UI Hierarchical Collapsible Style) ---------- */}
            {isSidebarOpen && (
            <>
              {/* Mobile backdrop overlay */}
              <div
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 top-14 bg-black/80 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
                aria-hidden="true"
              />

              <aside className="w-[256px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] flex flex-col border-r border-[#1c1c1f] bg-[#050507] z-30 select-none">
              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4" style={{ scrollbarWidth: "none" }}>

                {/* SECTION 1: DOCUMENTATION */}
                <div className="mb-1">
                  <div className="flex items-center justify-between px-2 py-1.5 mb-0.5">
                    <span className="text-[12.5px] font-bold text-white tracking-[-0.01em]">Documentation</span>
                    <ChevronUp className="w-3.5 h-3.5 text-[#52525b]" />
                  </div>
                  <div className="space-y-px">
                    {[
                      { id: "dashboard", icon: Sparkles, label: "Introduction" },
                      { id: "chatbot", icon: Zap, label: "ThreatLensGO", badge: "AI" },
                      { id: "repositories", icon: FolderGit2, label: "Repositories" },
                      { id: "commits", icon: GitCommit, label: "Commit Analysis" },
                      { id: "cli", icon: Terminal, label: "CLI & Local Agent" },
                    ].map((item) => {
                      const isActive = activeNav === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-[6px] rounded-lg text-[13.5px] font-medium transition-all text-left cursor-pointer ${
                            isActive
                              ? "bg-[#1c1c1f] text-white"
                              : "text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#0f0f11]"
                          }`}
                        >
                          <Icon className="w-[15px] h-[15px] shrink-0 opacity-80" />
                          <span className="truncate flex-1 leading-none">{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#1c1c1f] text-[#a1a1aa] border border-[#27272a] tracking-wide">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dotted Separator */}
                <div className="border-t border-dashed border-[#1c1c1f] my-3.5 mx-1" />

                {/* SECTION 2: SECURITY & RESOURCES */}
                <div className="mb-1">
                  <div className="flex items-center justify-between px-2 py-1.5 mb-0.5">
                    <span className="text-[12.5px] font-bold text-white tracking-[-0.01em]">Security & Resources</span>
                    <ChevronUp className="w-3.5 h-3.5 text-[#52525b]" />
                  </div>
                  <div className="space-y-px">
                    {[
                      { id: "findings", icon: ShieldAlert, label: "Live Findings" },
                      { id: "secrets", icon: Lock, label: "Secret Detection" },
                      { id: "cicd", icon: Box, label: "CI/CD & Docker" },
                      { id: "compliance", icon: CheckCircle, label: "Compliance & Posture" },
                    ].map((item) => {
                      const isActive = activeNav === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-[6px] rounded-lg text-[13.5px] font-medium transition-all text-left cursor-pointer ${
                            isActive
                              ? "bg-[#1c1c1f] text-white"
                              : "text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#0f0f11]"
                          }`}
                        >
                          <Icon className="w-[15px] h-[15px] shrink-0 opacity-80" />
                          <span className="truncate flex-1 leading-none">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dotted Separator */}
                {isAdmin && <div className="border-t border-dashed border-[#1c1c1f] my-3.5 mx-1" />}

                {/* SECTION 3: ADMINISTRATION */}
                {isAdmin && (
                  <div className="mb-1">
                    <div className="flex items-center justify-between px-2 py-1.5 mb-0.5">
                      <span className="text-[12.5px] font-bold text-white tracking-[-0.01em]">Administration</span>
                      <ChevronUp className="w-3.5 h-3.5 text-[#52525b]" />
                    </div>
                    <div className="space-y-px">
                      {[
                        { id: "accounts", icon: Users, label: "Accounts" },
                        { id: "config", icon: Settings, label: "System Config" },
                        { id: "sessions", icon: Clock, label: "Sessions" },
                      ].map((item) => {
                        const isActive = activeNav === item.id;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-[6px] rounded-lg text-[13.5px] font-medium transition-all text-left cursor-pointer ${
                              isActive
                                ? "bg-[#1c1c1f] text-white"
                                : "text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#0f0f11]"
                            }`}
                          >
                            <Icon className="w-[15px] h-[15px] shrink-0 opacity-80" />
                            <span className="truncate flex-1 leading-none">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </nav>

              {/* Bottom User Card */}
              <div className="p-3 border-t border-[#1c1c1f] bg-[#050507]">
                <button
                  onClick={() => {
                    setIsProfileOpen(true);
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  title="Edit Profile & Account Details"
                  className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-[#0f0f11] transition-all text-left group cursor-pointer"
                >
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-[#27272a]"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#18181b] border border-[#27272a] shrink-0"
                    >
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : "TL"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] text-[#d4d4d8] font-semibold truncate leading-tight">
                      {user?.name || "Dev User"}
                    </div>
                    <div className="text-[#52525b] text-[11px] truncate leading-tight mt-0.5">
                      {user?.email || (user?.role ? `${user.role} Â· team` : "dev@threatlens.io")}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#52525b] shrink-0" />
                </button>
              </div>
            </aside>
          </>
        )}

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {activeNav === "chatbot" ? (
          <div className="flex-1 flex flex-col min-w-0 h-[calc(100vh-3.5rem)]">
            <ChatBotTab user={user} />
          </div>
        ) : (
          /* Main Content */
          <main className="p-8 lg:p-10 pb-20 space-y-7 max-w-[1600px] w-full">
            {activeNav === "dashboard" && (
              <div className="pb-20">
                <IntroductionTab onNavigate={handleNavClick} />
              </div>
            )}





          {activeNav === "cli" && (
            <div className="p-5 sm:p-8 flex-1 overflow-y-auto">
              <CliAgentTab onNavigate={handleNavClick} />
            </div>
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
        )}
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
                      {selectedItem.sha ? `Commit ${selectedItem.sha}` : `Finding Â· ${selectedItem.module || "SecTest"}`}
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
