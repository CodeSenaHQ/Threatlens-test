import React from "react";
import {
  FolderGit2,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Activity,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
  Layers,
  FileCode,
  CheckCircle2,
} from "lucide-react";

export default function OverviewTab({ onInspectFinding, onSwitchTab }) {
  const kpis = [
    { label: "Monitored Repositories", value: "4", change: "342 files indexed", icon: FolderGit2, color: "text-[#38bdf8]", bg: "bg-[#2546ff]/15 border-[#38bdf8]/30" },
    { label: "Analyzed Commits", value: "1,428", change: "98.2% clean AST pass", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30" },
    { label: "Detected Vulnerabilities", value: "5", change: "1 Critical · Needs Action", icon: ShieldAlert, color: "text-rose-400", bg: "bg-rose-500/15 border-rose-500/30" },
    { label: "Live Prober Status", value: "ACTIVE", change: "5/5 modules operational", icon: Zap, color: "text-[#00F2FE]", bg: "bg-cyan-500/15 border-cyan-500/30" },
  ];

  const recentFindings = [
    {
      id: "sqli-1",
      title: "SQL Injection Vector in User Query Filter",
      severity: "critical",
      cwe: "CWE-89",
      module: "injection",
      endpoint: "POST /api/v1/users/search",
      evidence: "Payload: ' OR '1'='1 returned 150 rows instead of 1.",
      remediation: "Use parameterized query prepared statements binding.",
      time: "10 mins ago",
    },
    {
      id: "rate-1",
      title: "Lack of Rate Limiting on Login Endpoint",
      severity: "high",
      cwe: "CWE-307",
      module: "ratelimit",
      endpoint: "POST /tc-auth/login/password",
      evidence: "100 requests in 3 seconds allowed without HTTP 429.",
      remediation: "Configure sliding window token bucket rate limiter (5 req/min).",
      time: "45 mins ago",
    },
    {
      id: "auth-1",
      title: "Unauthenticated Access to Internal Debug Route",
      severity: "high",
      cwe: "CWE-306",
      module: "auth",
      endpoint: "GET /api/internal/debug",
      evidence: "HTTP 200 returned system metrics without Bearer token.",
      remediation: "Wrap route handler with AuthDeps dependency.",
      time: "2 hours ago",
    },
    {
      id: "hsts-1",
      title: "Missing Strict-Transport-Security Header",
      severity: "medium",
      cwe: "CWE-319",
      module: "headers",
      endpoint: "GET /tc-auth/config/pulse",
      evidence: "HSTS header missing from response.",
      remediation: "Add 'Strict-Transport-Security: max-age=31536000'.",
      time: "Yesterday",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.08] shadow-lg hover:border-white/[0.16] transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8a99ad] font-medium">{kpi.label}</span>
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center border ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </span>
              </div>

              <div>
                <p className="text-2xl font-bold text-white tracking-tight font-['Sora',sans-serif]">
                  {kpi.value}
                </p>
                <p className="text-[11px] text-[#8a99ad] font-mono mt-0.5">{kpi.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Split: Recent Findings Stream + Security Posture Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Threat Stream */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">Active Security Findings Stream</h2>
            </div>
            <button
              onClick={() => onSwitchTab && onSwitchTab("scanner")}
              className="text-xs font-semibold text-[#38bdf8] hover:underline flex items-center gap-1"
            >
              <span>View in Scanner</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentFindings.map((finding) => {
              const isCrit = finding.severity === "critical";
              const isHigh = finding.severity === "high";
              return (
                <div
                  key={finding.id}
                  onClick={() => onInspectFinding && onInspectFinding(finding)}
                  className="p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.08] hover:border-[#38bdf8]/40 hover:bg-[#0d1220] transition-all cursor-pointer group shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          isCrit
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : isHigh
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {finding.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[#8a99ad] text-[10px] font-mono">
                        {finding.cwe}
                      </span>
                      <span className="text-[11px] text-[#8a99ad] font-mono">{finding.time}</span>
                    </div>

                    <h3 className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors truncate">
                      {finding.title}
                    </h3>
                    <p className="text-[11px] text-[#8a99ad] font-mono truncate">{finding.endpoint}</p>
                  </div>

                  <div className="shrink-0 pt-2 text-[#8a99ad] group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Security Health & Posture Matrix */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">Security Posture</h2>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.08] space-y-4 shadow-lg">
            {/* Severity Distribution */}
            <div className="space-y-2">
              <span className="text-xs text-[#8a99ad] font-semibold">Vulnerabilities by Severity</span>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical
                  </span>
                  <span className="font-bold text-white">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> High
                  </span>
                  <span className="font-bold text-white">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-yellow-400">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" /> Medium
                  </span>
                  <span className="font-bold text-white">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-400" /> Low
                  </span>
                  <span className="font-bold text-white">1</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <button
                onClick={() => onSwitchTab && onSwitchTab("repositories")}
                className="w-full py-2 rounded-xl bg-[#2546ff]/15 hover:bg-[#2546ff]/25 text-xs font-semibold text-[#38bdf8] border border-[#38bdf8]/30 transition-colors flex items-center justify-center gap-2"
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Inspect Repositories & Diffs</span>
              </button>

              <button
                onClick={() => onSwitchTab && onSwitchTab("scanner")}
                className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white border border-white/[0.06] transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Launch SecTest Prober</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
