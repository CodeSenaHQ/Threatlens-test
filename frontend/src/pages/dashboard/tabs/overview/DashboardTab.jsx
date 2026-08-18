import React from "react";
import {
  ShieldAlert,
  Zap,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Globe,
  ChevronRight,
  Sparkles,
  FileText,
  AlertTriangle,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function DashboardTab({ onInspectFinding, onSwitchTab }) {
  const kpiStats = [
    { label: "Open vulnerabilities", value: "235", change: "+12%", changeType: "up", sub: "11 last week" },
    { label: "Active incidents", value: "7", change: "1 last week", changeType: "neutral", sub: "3 critical targets" },
    { label: "Compliance score", value: "51%", change: "+8%", changeType: "up", sub: "47/47 ASVS verified" },
    { label: "Time to remediate", value: "2d:06h", change: "-11h", changeType: "down", sub: "vs 2.8d baseline" },
  ];

  const cityThreats = [
    { count: "12", city: "Sydney, Australia", barWidth: "60%" },
    { count: "58", city: "New York, USA", barWidth: "90%" },
    { count: "31", city: "São Paulo, Brazil", barWidth: "75%" },
    { count: "12", city: "Singapore", barWidth: "60%" },
    { count: "4", city: "Los Angeles, USA", barWidth: "40%" },
    { count: "0.76", city: "Miami, USA", barWidth: "25%" },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Policy 'iOS Benchmark' applied",
      sub: "Applied to clusters 4 mins ago",
      icon: CheckCircle2,
      iconColor: "text-emerald-400 bg-emerald-500/15",
      time: "2 mins ago",
    },
    {
      id: 2,
      title: "Critical vulnerability detected",
      sub: "Found in live-api (CVE-2025-0112 · CVSS 9.8)",
      icon: AlertTriangle,
      iconColor: "text-rose-400 bg-rose-500/15",
      time: "5 mins ago",
      onClick: true,
    },
    {
      id: 3,
      title: "SLA breach on Incident #4653",
      sub: "Unresolved for exceeding target SLA (> 72 hours)",
      icon: Clock,
      iconColor: "text-amber-400 bg-amber-500/15",
      time: "12 hours ago",
    },
    {
      id: 4,
      title: "Compliance scan started",
      sub: "Automated ASVS Level 2 evaluation",
      icon: Layers,
      iconColor: "text-[#38bdf8] bg-[#2546ff]/15",
      time: "3 days ago",
    },
    {
      id: 5,
      title: "Report scheduled: 'Monthly Summary'",
      sub: "Set to run on Aug 1, 4:00 UTC",
      icon: FileText,
      iconColor: "text-purple-400 bg-purple-500/15",
      time: "4 days ago",
    },
    {
      id: 6,
      title: "Export completed: Findings (CSV)",
      sub: "145 records downloaded",
      icon: ArrowUpRight,
      iconColor: "text-[#8a99ad] bg-white/[0.05]",
      time: "6 days ago",
    },
    {
      id: 7,
      title: "Remediation task marked complete",
      sub: "Resolved by admin (FND-1012 · email-server)",
      icon: CheckCircle2,
      iconColor: "text-emerald-400 bg-emerald-500/15",
      time: "8 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metric Cards (Directly matching video 00:00) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#0f1118] border border-white/[0.07] hover:border-white/[0.14] transition-all space-y-2 shadow-lg"
          >
            <div className="flex items-center justify-between text-xs text-[#8a99ad] font-medium">
              <span>{stat.label}</span>
              <div className="flex items-center gap-1 font-mono text-[11px]">
                {stat.changeType === "up" && (
                  <span className="text-rose-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                )}
                {stat.changeType === "down" && (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    {stat.change}
                  </span>
                )}
                {stat.changeType === "neutral" && (
                  <span className="text-[#8a99ad]">{stat.change}</span>
                )}
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-extrabold text-white font-['Sora',sans-serif] tracking-tight">
                {stat.value}
              </p>
              <span className="text-[11px] text-[#8a99ad] font-mono">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-Pane Split: Threat Map on Left + Recent Activity on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane (7 Cols): Threat Map & Attack Surface */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0f1118] border border-white/[0.07] shadow-xl flex flex-col justify-between space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#f97316]" />
              <h2 className="text-sm font-bold text-white tracking-tight">Threat Map</h2>
            </div>
            <span className="text-xs text-[#8a99ad] font-mono hover:text-white cursor-pointer transition-colors">
              Last Week ▾
            </span>
          </div>

          {/* Dark Radar Heatmap Map Visualization Canvas */}
          <div className="relative w-full h-56 rounded-xl bg-[#07090e] border border-white/[0.06] overflow-hidden flex items-center justify-center">
            {/* Ambient Red Glow Beacons */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_40%,rgba(239,68,68,0.3)_0%,transparent_50%),radial-gradient(circle_at_70%_60%,rgba(249,115,22,0.3)_0%,transparent_50%)]" />

            {/* Radar Circular Grid Rings */}
            <div className="absolute w-44 h-44 rounded-full border border-white/[0.06] animate-ping opacity-20" />
            <div className="absolute w-32 h-32 rounded-full border border-white/[0.08]" />
            <div className="absolute w-16 h-16 rounded-full border border-[#f97316]/30 bg-[#f97316]/10" />

            {/* Pulsing Hotspots matching the video */}
            <div className="absolute top-1/4 left-1/4 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_15px_#f43f5e] animate-pulse" />
              <span className="absolute w-8 h-8 rounded-full bg-rose-500/20 animate-ping" />
            </div>

            <div className="absolute top-1/2 right-1/3 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] shadow-[0_0_12px_#f97316]" />
            </div>

            <div className="absolute bottom-1/3 left-1/2 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_10px_#f87171]" />
            </div>

            <div className="z-10 text-center space-y-1">
              <p className="text-xs font-mono font-bold text-white tracking-widest uppercase text-shadow">
                Global Threat Surface Radar
              </p>
              <p className="text-[10px] font-mono text-[#8a99ad]">6 Active Geolocation Attack Vectors</p>
            </div>
          </div>

          {/* City / Endpoint Metrics List */}
          <div className="space-y-2.5">
            {cityThreats.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono gap-4">
                <div className="flex items-center gap-3 w-1/3 min-w-0">
                  <span className="font-bold text-white w-6 text-right shrink-0">{c.count}</span>
                  <div className="h-1.5 rounded-full bg-white/[0.06] flex-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#f97316] to-[#ff4d2d] rounded-full"
                      style={{ width: c.barWidth }}
                    />
                  </div>
                </div>

                <span className="text-[#8a99ad] text-right truncate flex-1">{c.city}</span>
              </div>
            ))}
          </div>

          {/* Full Report Footer Button */}
          <div className="pt-2 border-t border-white/[0.05]">
            <button
              onClick={() => onSwitchTab && onSwitchTab("findings")}
              className="w-full py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-xs font-semibold text-[#cbd5e1] hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Full Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Pane (5 Cols): Recent Activity Stream */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0f1118] border border-white/[0.07] shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-tight">Recent Activity</h2>
            <span className="text-xs text-[#8a99ad] font-mono hover:text-white cursor-pointer transition-colors">
              Sort by ▾
            </span>
          </div>

          {/* Chronological Activity Feed List (Matching video 00:00) */}
          <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  onClick={() => act.onClick && onInspectFinding && onInspectFinding({
                    id: "FND-1045",
                    title: "Critical vulnerability detected on live-api",
                    severity: "critical",
                    cwe: "CVE-2025-0112",
                    module: "injection",
                    endpoint: "POST /api/v1/checkout",
                    evidence: "CVSS 9.8 Remote Code Execution payload accepted",
                    explanation: "Unsafe pickle deserialization in checkout handler",
                    remediation: "Replace pickle with JSON schema verification",
                  })}
                  className={`p-3 rounded-xl bg-[#07090e]/80 border border-white/[0.05] hover:border-white/[0.12] transition-all flex items-start gap-3 ${
                    act.onClick ? "cursor-pointer hover:bg-[#12141e]" : ""
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${act.iconColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{act.title}</p>
                    <p className="text-[11px] text-[#8a99ad] truncate mt-0.5">{act.sub}</p>
                    <p className="text-[10px] text-[#8a99ad]/70 font-mono mt-1">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
