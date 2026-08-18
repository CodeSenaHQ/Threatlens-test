import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Copy,
  Check,
  X,
} from "lucide-react";

// Individual Tab Views
import RepositoriesTab from "./views/RepositoriesTab";
import CommitsTab from "./views/CommitsTab";
import LiveFindingsTab from "./views/LiveFindingsTab";
import SecretDetectionTab from "./views/SecretDetectionTab";
import CicdDockerTab from "./views/CicdDockerTab";
import AccountsTab from "./views/AccountsTab";
import SystemConfigTab from "./views/SystemConfigTab";
import SessionsTab from "./views/SessionsTab";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [clockStr, setClockStr] = useState("--:--:--");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const kpis = [
    { label: "Critical findings", value: "3", sub: "secret_detection, security_code", type: "critical" },
    { label: "High severity", value: "9", sub: "across 3 repositories", type: "high" },
    { label: "Medium severity", value: "14", sub: "mostly suspicious_commit_pattern", type: "medium" },
    { label: "Repos monitored", value: "3", sub: "13,250 commits indexed (fastapi)", type: "low" },
  ];

  const commits = [
    {
      sha: "8b4f7a6",
      fullSha: "8b4f7a668a7de34693bb25d6f66abfcb4f7b095e",
      msg: "fix(auth): parameterize login query",
      meta: "Alex Vance · backend/routes/auth.py · 2 findings",
      risk: "risk 28 · medium",
      badgeClass: "badge-medium",
      score: 28,
      explanation: "Replaced raw string query execution with parameterized SQL statement bindings.",
      diff: `--- a/backend/routes/auth.py\n+++ b/backend/routes/auth.py\n@@ -42,8 +42,14 @@\n-    query = f"SELECT * FROM users WHERE email = '{email}'"\n+    query = "SELECT id, email FROM users WHERE email = :email"`,
    },
    {
      sha: "c19e2fd",
      fullSha: "c19e2fd912830114092b19280194092830114092",
      msg: "chore(ci): pin github actions to sha",
      meta: "Priya Nair · .github/workflows/deploy.yml · 1 finding",
      risk: "risk 8 · low",
      badgeClass: "badge-low",
      score: 8,
      explanation: "Pinned unversioned third-party GitHub Actions to immutable 40-character commit hashes.",
    },
    {
      sha: "f402a19",
      fullSha: "f402a19011f592cb1475e330a8901f443810c512",
      msg: "feat(search): add raw filter passthrough",
      meta: "Alex Vance · api/v1/users/search.py · 3 findings",
      risk: "risk 84 · critical",
      badgeClass: "badge-critical",
      score: 84,
      explanation: "CRITICAL: Direct user parameter passed to database execution clause without escaping.",
    },
    {
      sha: "a7710bb",
      fullSha: "a7710bb3501a2ce08914efb900234acb7712aa90",
      msg: "wip: skip auth for local testing",
      meta: "Marcus Lee · middleware/session.py · 2 findings",
      risk: "risk 62 · high",
      badgeClass: "badge-high",
      score: 62,
      explanation: "HIGH: Authentication bypass logic committed into session middleware.",
    },
    {
      sha: "031bd6e",
      fullSha: "031bd6e8bca711832049e21196e2a871b53c19d4",
      msg: "docs: update README badges",
      meta: "Priya Nair · README.md · 0 findings",
      risk: "risk 0 · low",
      badgeClass: "badge-low",
      score: 0,
      explanation: "Documentation update with zero security impact.",
    },
  ];

  const findings = [
    {
      severity: "critical",
      title: "SQL Injection Vector in User Query Filter",
      evidence: "Payload: ' OR '1'='1 returned HTTP 200 with 150 rows.",
      module: "injection",
      endpoint: "POST /api/v1/users/search · CWE-89",
      explanation: "Unsanitized user search parameters concatenated directly into PostgreSQL query builder clause.",
      remediation: "Use parameterized prepared statement binding.",
    },
    {
      severity: "high",
      title: "Missing Content-Security-Policy header",
      evidence: "Response lacks CSP, exposing app to XSS injection.",
      module: "headers",
      endpoint: "GET /repo · CWE-693",
      explanation: "The HTTP response does not include a Content-Security-Policy header.",
      remediation: "Add 'Content-Security-Policy: default-src \\'self\\''.",
    },
    {
      severity: "high",
      title: "Verbose stack trace exposed on 500",
      evidence: "Internal file paths and package versions leaked.",
      module: "exposure",
      endpoint: "POST /repo/commit/analysis · CWE-209",
      explanation: "Application uncaught exceptions return full tracebacks to client.",
      remediation: "Implement global exception handler returning sanitized error response.",
    },
    {
      severity: "medium",
      title: "No rate limiting on OTP request endpoint",
      evidence: "1000 req/min accepted without throttling.",
      module: "ratelimit",
      endpoint: "POST /tc-auth/otp/ · CWE-799",
      explanation: "OTP generation endpoint allows brute-force flooding.",
      remediation: "Configure sliding window rate limiter (5 requests / 60 seconds).",
    },
    {
      severity: "medium",
      title: "Weak JWT algorithm accepted",
      evidence: "Server accepts alg:none on session validation.",
      module: "auth",
      endpoint: "GET /tc-auth/me · CWE-347",
      explanation: "JWT decoder does not strictly whitelist cryptographic algorithms.",
      remediation: "Enforce HS256/RS256 algorithm validation.",
    },
    {
      severity: "info",
      title: "Server header discloses framework version",
      evidence: "Response includes uvicorn/0.30 in headers.",
      module: "headers",
      endpoint: "GET /tc-auth/config/pulse · CWE-200",
      explanation: "Server banner leaks server stack information.",
      remediation: "Disable server header in Uvicorn production startup.",
    },
  ];

  const repos = [
    {
      name: "fastapi",
      url: "fastapi/fastapi.git",
      branch: "master",
      commits: "13,250",
      files: "420",
      size: "9.2MB",
      py: 83,
      js: 5,
      other: 12,
      pyCount: 300,
      jsCount: 18,
    },
    {
      name: "threatlens-core",
      url: "dev47929/threatlens-core",
      branch: "main",
      commits: "842",
      files: "96",
      size: "1.4MB",
      py: 60,
      js: 30,
      other: 10,
      pyCount: 58,
      jsCount: 29,
    },
    {
      name: "tc-auth-service",
      url: "dev47929/tc-auth-service",
      branch: "develop",
      commits: "317",
      files: "54",
      size: "620KB",
      py: 40,
      js: 45,
      other: 15,
      pyCount: 22,
      jsCount: 24,
    },
  ];

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

  return (
    <div
      className="min-h-screen text-[#d8e2e8] flex flex-col select-none"
      style={{
        backgroundColor: "#0a0d10",
        fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
        backgroundImage:
          "linear-gradient(#222d38 1px, transparent 1px), linear-gradient(90deg, #222d38 1px, transparent 1px)",
        backgroundSize: "34px 34px",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ---------- TOPBAR ---------- */}
      <header
        className="flex items-center justify-between px-8 py-4 border-b border-[#253240] sticky top-0 z-30 shadow-md"
        style={{
          background: "linear-gradient(180deg, rgba(16,21,26,.97), rgba(16,21,26,.90))",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-6.5 h-6.5 rounded-sm"
            style={{
              width: "26px",
              height: "26px",
              background: "conic-gradient(from 220deg, #38bdf8, #0284c7 40%, transparent 41%)",
              boxShadow: "0 0 16px rgba(56,189,248,.65)",
            }}
          />
          <div className="font-mono font-bold tracking-wide text-base text-white">
            Threat<span className="text-[#38bdf8]">Lens</span>
          </div>
          <div className="font-mono text-[10px] text-[#8a99ad] tracking-[1.5px] uppercase ml-2 px-2 py-0.5 border border-[#2b3947] bg-[#12181f] rounded">
            Dev Instance
          </div>
        </div>

        {/* Pulse Strip */}
        <div className="hidden md:flex items-center gap-5 font-mono text-[11px] text-[#8a99ad]">
          <div className="flex items-center">
            <span
              className="w-2 h-2 rounded-full inline-block mr-2 animate-pulse"
              style={{
                backgroundColor: "#38bdf8",
                boxShadow: "0 0 10px #38bdf8",
              }}
            />
            API pulse: <span className="text-[#38bdf8] ml-1 font-semibold">nominal</span>
          </div>
          <div>
            Scanner :8765 · <span className="text-[#38bdf8] font-semibold">online</span>
          </div>
          <div className="text-[#d8e2e8] font-bold">{clockStr}</div>
        </div>

        {/* Profile Chip */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 border border-[#2b3947] rounded-full bg-[#10151a] shadow-sm hover:border-[#38bdf8]/40 transition-colors">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-[#03110c] shadow-sm"
            style={{
              background: "linear-gradient(135deg, #4d9cff, #38bdf8)",
            }}
          >
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "DV"}
          </div>
          <div>
            <div className="font-mono text-[11px] text-white font-medium leading-none">{user?.name || "Dev"}</div>
            <div className="text-[#8a99ad] text-[9px] uppercase tracking-wider leading-none mt-0.5">
              {user?.role || "superadmin"}
            </div>
          </div>
        </div>
      </header>

      {/* ---------- SHELL LAYOUT ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] flex-1 min-h-[calc(100vh-62px)]">
        {/* Navigation Sidebar */}
        <nav className="hidden md:flex flex-col gap-1 border-r border-[#253240] p-5.5 bg-[#0a0d10]/95">
          <div className="font-mono text-[10px] text-[#8a99ad] uppercase tracking-[1.5px] my-3 mx-2">
            Overview
          </div>
          <button
            onClick={() => setActiveNav("dashboard")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition-all text-left ${
              activeNav === "dashboard"
                ? "bg-[#141b21] text-white border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                : "text-[#8a99ad] border-transparent hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span className={`w-4 text-center font-mono text-xs ${activeNav === "dashboard" ? "text-[#38bdf8]" : ""}`}>
              ▣
            </span>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveNav("repositories")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition-all text-left ${
              activeNav === "repositories"
                ? "bg-[#141b21] text-white border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                : "text-[#8a99ad] border-transparent hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span className={`w-4 text-center font-mono text-xs ${activeNav === "repositories" ? "text-[#38bdf8]" : ""}`}>
              ◧
            </span>
            <span>Repositories</span>
          </button>
          <button
            onClick={() => setActiveNav("commits")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition-all text-left ${
              activeNav === "commits"
                ? "bg-[#141b21] text-white border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                : "text-[#8a99ad] border-transparent hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span className={`w-4 text-center font-mono text-xs ${activeNav === "commits" ? "text-[#38bdf8]" : ""}`}>
              ↯
            </span>
            <span>Commits</span>
          </button>

          <div className="font-mono text-[10px] text-[#8a99ad] uppercase tracking-[1.5px] mt-4 mb-2 mx-2">
            Security
          </div>
          <button
            onClick={() => setActiveNav("findings")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition-all text-left ${
              activeNav === "findings"
                ? "bg-[#141b21] text-white border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                : "text-[#8a99ad] border-transparent hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span className={`w-4 text-center font-mono text-xs ${activeNav === "findings" ? "text-[#38bdf8]" : ""}`}>
              ⌁
            </span>
            <span>Live Findings</span>
          </button>
          <button
            onClick={() => setActiveNav("secrets")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition-all text-left ${
              activeNav === "secrets"
                ? "bg-[#141b21] text-white border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                : "text-[#8a99ad] border-transparent hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span className={`w-4 text-center font-mono text-xs ${activeNav === "secrets" ? "text-[#38bdf8]" : ""}`}>
              ⚑
            </span>
            <span>Secret Detection</span>
          </button>
          <button
            onClick={() => setActiveNav("cicd")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition-all text-left ${
              activeNav === "cicd"
                ? "bg-[#141b21] text-white border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                : "text-[#8a99ad] border-transparent hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span className={`w-4 text-center font-mono text-xs ${activeNav === "cicd" ? "text-[#38bdf8]" : ""}`}>
              ◫
            </span>
            <span>CI/CD & Docker</span>
          </button>

          <div className="font-mono text-[10px] text-[#8a99ad] uppercase tracking-[1.5px] mt-4 mb-2 mx-2">
            Admin
          </div>
          <button
            onClick={() => setActiveNav("accounts")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition-all text-left ${
              activeNav === "accounts"
                ? "bg-[#141b21] text-white border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                : "text-[#8a99ad] border-transparent hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span className={`w-4 text-center font-mono text-xs ${activeNav === "accounts" ? "text-[#38bdf8]" : ""}`}>
              ☰
            </span>
            <span>Accounts</span>
          </button>
          <button
            onClick={() => setActiveNav("config")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition-all text-left ${
              activeNav === "config"
                ? "bg-[#141b21] text-white border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                : "text-[#8a99ad] border-transparent hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span className={`w-4 text-center font-mono text-xs ${activeNav === "config" ? "text-[#38bdf8]" : ""}`}>
              ⚙
            </span>
            <span>System Config</span>
          </button>
          <button
            onClick={() => setActiveNav("sessions")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition-all text-left ${
              activeNav === "sessions"
                ? "bg-[#141b21] text-white border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                : "text-[#8a99ad] border-transparent hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span className={`w-4 text-center font-mono text-xs ${activeNav === "sessions" ? "text-[#38bdf8]" : ""}`}>
              ◔
            </span>
            <span>Sessions</span>
          </button>
        </nav>

        {/* Main Content Area */}
        <main className="p-8 lg:p-10 pb-20 space-y-7 max-w-[1600px] w-full">
          {activeNav === "dashboard" && (
            <>
              {/* Page Head */}
              <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
                <div>
                  <h1 className="font-mono text-lg font-bold tracking-tight text-white">Security Overview</h1>
                  <p className="text-xs text-[#8a99ad] mt-1 font-mono">
                    repo.threatlens.local · scanning 3 repositories · live DAST daemon on :8765
                  </p>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <button
                    onClick={() => toast.success("Exported full security summary (CSV / JSON)")}
                    className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all cursor-pointer"
                  >
                    Export report
                  </button>
                  <button
                    onClick={() => setActiveNav("findings")}
                    className="px-4 py-2 rounded-lg border border-[#38bdf8] bg-[#38bdf8] text-[#04140c] font-bold hover:brightness-110 shadow-[0_0_16px_rgba(56,189,248,0.4)] transition-all cursor-pointer"
                  >
                    Run new scan
                  </button>
                </div>
              </div>

              {/* KPI ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
                {kpis.map((k, i) => (
                  <div
                    key={i}
                    className="bg-[#10151a] border border-[#263544] hover:border-[#38bdf8]/40 rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3.5px]"
                      style={{
                        backgroundColor:
                          k.type === "critical"
                            ? "#ff4d4f"
                            : k.type === "high"
                            ? "#ff9a3c"
                            : k.type === "medium"
                            ? "#f2c94c"
                            : "#38bdf8",
                        boxShadow:
                          k.type === "critical"
                            ? "0 0 10px #ff4d4f"
                            : k.type === "high"
                            ? "0 0 10px #ff9a3c"
                            : k.type === "medium"
                            ? "0 0 10px #f2c94c"
                            : "0 0 10px #38bdf8",
                      }}
                    />
                    <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">{k.label}</div>
                    <div
                      className="font-mono text-xl font-bold mt-1.5"
                      style={{
                        color:
                          k.type === "critical"
                            ? "#ff4d4f"
                            : k.type === "high"
                            ? "#ff9a3c"
                            : k.type === "medium"
                            ? "#f2c94c"
                            : "#38bdf8",
                      }}
                    >
                      {k.value}
                    </div>
                    <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* GAUGE + COMMITS SPLIT */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5.5">
                {/* Left: Latest Analyzed Commits */}
                <div className="bg-[#10151a] border border-[#263544] hover:border-[#2f4255] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex items-center justify-between p-3 px-4 border-b border-[#253240] bg-[#12181f]/60">
                      <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                        Latest analyzed commits
                      </h2>
                      <div className="font-mono text-[10px] text-[#8a99ad]">GET /repo/12/commits</div>
                    </div>

                    <div className="divide-y divide-[#222e3a]">
                      {commits.map((c, i) => (
                        <div
                          key={i}
                          onClick={() => handleOpenDetail(c)}
                          className="grid grid-cols-[auto_1fr_auto] gap-3.5 items-center p-3 px-4.5 hover:bg-white/[0.03] cursor-pointer transition-colors"
                        >
                          <span className="font-mono text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded text-[11px] border border-[#38bdf8]/30 font-semibold shadow-sm">
                            {c.sha}
                          </span>
                          <div className="min-w-0 pr-2">
                            <div className="text-[#d8e2e8] text-xs font-semibold truncate">{c.msg}</div>
                            <div className="text-[#8a99ad] text-[10.5px] font-mono truncate mt-0.5">{c.meta}</div>
                          </div>
                          <span
                            className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap"
                            style={{
                              color:
                                c.score >= 80
                                  ? "#ff4d4f"
                                  : c.score >= 50
                                  ? "#ff9a3c"
                                  : c.score >= 20
                                  ? "#f2c94c"
                                  : "#38bdf8",
                              borderColor:
                                c.score >= 80
                                  ? "#ff4d4f"
                                  : c.score >= 50
                                  ? "#ff9a3c"
                                  : c.score >= 20
                                  ? "#f2c94c"
                                  : "#38bdf8",
                              backgroundColor:
                                c.score >= 80
                                  ? "rgba(255,77,79,.10)"
                                  : c.score >= 50
                                  ? "rgba(255,154,60,.10)"
                                  : c.score >= 20
                                  ? "rgba(242,201,76,.10)"
                                  : "rgba(56,189,248,.10)",
                            }}
                          >
                            {c.risk}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Repo Risk Score Gauge + Pulse */}
                <div className="bg-[#10151a] border border-[#263544] hover:border-[#2f4255] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex items-center justify-between p-3 px-4 border-b border-[#253240] bg-[#12181f]/60">
                      <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                        Repo risk score
                      </h2>
                      <div className="font-mono text-[10px] text-[#8a99ad]">weighted</div>
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
                            stroke="#ff9a3c"
                            strokeWidth="10"
                            strokeDasharray="314"
                            strokeDashoffset="105"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                          <b className="text-lg text-white font-bold">58</b>
                          <span className="text-[8.5px] text-[#8a99ad] uppercase tracking-wider">/ 100</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 text-xs font-mono">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#ff4d4f] shadow-[0_0_6px_#ff4d4f]" />
                          <span>Critical × 40</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#ff9a3c] shadow-[0_0_6px_#ff9a3c]" />
                          <span>High × 20</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#f2c94c] shadow-[0_0_6px_#f2c94c]" />
                          <span>Medium × 8</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
                          <span>Low × 2</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#253240]">
                    <div className="flex items-center justify-between p-2.5 px-4 border-b border-[#253240]/60 bg-[#12181f]/40">
                      <h2 className="font-mono text-xs font-bold text-white">System pulse</h2>
                      <div className="font-mono text-[10px] text-[#8a99ad]">/tc-auth/config/pulse</div>
                    </div>
                    <div className="p-3.5 px-4 font-mono text-[11px] text-[#8a99ad] leading-relaxed">
                      accounts: <span className="text-white font-bold">18</span> · sessions:{" "}
                      <span className="text-white font-bold">6</span> · oauth:{" "}
                      <span className="text-white font-bold">4</span> · otp:{" "}
                      <span className="text-white font-bold">1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LIVE SECTEST FINDINGS TABLE */}
              <div className="bg-[#10151a] border border-[#263544] hover:border-[#2f4255] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all">
                <div className="flex items-center justify-between p-3 px-4 border-b border-[#253240] bg-[#12181f]/60">
                  <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Live SecTest findings
                  </h2>
                  <div className="font-mono text-[10px] text-[#8a99ad]">GET :8765/report.json · scanned 4 min ago</div>
                </div>

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
                      {findings.map((f, i) => {
                        const isCrit = f.severity === "critical";
                        const isHigh = f.severity === "high";
                        const isMed = f.severity === "medium";
                        const isInfo = f.severity === "info";
                        const color = isCrit
                          ? "#ff4d4f"
                          : isHigh
                          ? "#ff9a3c"
                          : isMed
                          ? "#f2c94c"
                          : isInfo
                          ? "#4d9cff"
                          : "#38bdf8";

                        return (
                          <tr
                            key={i}
                            onClick={() => handleOpenDetail(f)}
                            className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                          >
                            <td className="py-3 px-4.5 align-top">
                              <span
                                className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap font-medium"
                                style={{
                                  color: color,
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
                            <td className="py-3 px-4.5 align-top font-mono text-[10.5px] text-[#8a99ad]">{f.endpoint}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SCANNED REPOSITORIES GRID */}
              <div className="bg-[#10151a] border border-[#263544] hover:border-[#2f4255] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all">
                <div className="flex items-center justify-between p-3 px-4 border-b border-[#253240] bg-[#12181f]/60">
                  <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Scanned repositories
                  </h2>
                  <div className="font-mono text-[10px] text-[#8a99ad]">GET /repo</div>
                </div>

                <div className="p-4.5 grid grid-cols-1 md:grid-cols-3 gap-4.5">
                  {repos.map((r, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveNav("repositories")}
                      className="bg-[#10151a] border border-[#283747] hover:border-[#38bdf8]/40 rounded-xl p-4 space-y-3.5 shadow-sm transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono font-bold text-xs text-white">{r.name}</div>
                          <div className="text-[10.5px] text-[#8a99ad] font-mono mt-0.5">{r.url}</div>
                        </div>
                        <div className="font-mono text-[10px] text-[#38bdf8] border border-[#2b3947] bg-[#38bdf8]/10 px-2 py-0.5 rounded font-medium">
                          {r.branch}
                        </div>
                      </div>

                      <div className="flex gap-5 font-mono mt-3">
                        <div>
                          <b className="text-sm text-white">{r.commits}</b>
                          <span className="text-[9px] text-[#8a99ad] uppercase block mt-0.5">commits</span>
                        </div>
                        <div>
                          <b className="text-sm text-white">{r.files}</b>
                          <span className="text-[9px] text-[#8a99ad] uppercase block mt-0.5">files</span>
                        </div>
                        <div>
                          <b className="text-sm text-white">{r.size}</b>
                          <span className="text-[9px] text-[#8a99ad] uppercase block mt-0.5">size</span>
                        </div>
                      </div>

                      <div className="flex h-1.5 rounded overflow-hidden bg-[#222e3a] mt-3">
                        <div style={{ width: `${r.py}%` }} className="bg-[#4d9cff]" title={`Python ${r.py}%`} />
                        <div style={{ width: `${r.js}%` }} className="bg-[#f2c94c]" title={`JavaScript ${r.js}%`} />
                        <div style={{ width: `${r.other}%` }} className="bg-[#222e3a]" />
                      </div>

                      <div className="flex gap-3.5 text-[10px] font-mono text-[#8a99ad] mt-2">
                        <span>● Python {r.pyCount}</span>
                        <span>● JS {r.jsCount}</span>
                        <span>● other</span>
                      </div>
                    </div>
                  ))}
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

      {/* ---------- FOOTER ---------- */}
      <footer className="px-8 py-4 border-t border-[#253240] text-[#8a99ad] font-mono text-[10.5px] flex items-center justify-between bg-[#0a0d10]">
        <div>ThreatLens dashboard · live security telemetry</div>
        <div>local time {clockStr}</div>
      </footer>

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
    </div>
  );
}
