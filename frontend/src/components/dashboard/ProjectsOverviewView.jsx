import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderGit2,
  GitBranch,
  ShieldCheck,
  ShieldAlert,
  Plus,
  LayoutGrid,
  ListFilter,
  MoreHorizontal,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  HardDrive,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { USER_REPOSITORIES } from "@/lib/repositories";
import { SeverityBadge } from "./SeverityBadge";

export function ProjectsOverviewView({ onSelectRepo, onOpenRepo, selectedRepo }) {
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRepos = USER_REPOSITORIES.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.language.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });

  const totalCommits = USER_REPOSITORIES.reduce((acc, r) => acc + r.commitCount, 0);
  const totalVulns = USER_REPOSITORIES.reduce((acc, r) => acc + r.vulnerabilitiesSummary.total, 0);
  const criticalVulns = USER_REPOSITORIES.reduce((acc, r) => acc + r.vulnerabilitiesSummary.critical, 0);

  return (
    <div className="space-y-6">
      {/* Quick Access Top Cards: Organization-wide Telemetry */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Organization Health Overview</h3>
          <span className="text-[11px] font-mono text-[#64748b]">5 Connected Repositories</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.06] hover:border-white/[0.14] transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2546ff]/20 to-[#3b82f6]/10 border border-white/[0.08] text-[#3b82f6] flex items-center justify-center">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#3b82f6]/15 text-[#60a5fa] border border-[#3b82f6]/30">
                ACTIVE
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Connected Projects</div>
              <div className="flex items-baseline justify-between text-[11px] text-[#64748b] mt-0.5">
                <span>{USER_REPOSITORIES.length} Repositories</span>
                <span className="font-mono text-white/90 font-bold">{totalCommits.toLocaleString()} Commits</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.06] hover:border-white/[0.14] transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e]/20 to-[#10b981]/10 border border-white/[0.08] text-[#22c55e] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30">
                GRADE A+
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Organization Posture</div>
              <div className="flex items-baseline justify-between text-[11px] text-[#64748b] mt-0.5">
                <span>Composite Score</span>
                <span className="font-mono text-[#4ade80] font-bold">94.8% Average</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.06] hover:border-white/[0.14] transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f43f5e]/20 to-[#fb7185]/10 border border-white/[0.08] text-[#f43f5e] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                criticalVulns > 0 ? "bg-[#f43f5e]/15 text-[#fb7185] border-[#f43f5e]/30" : "bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/30"
              }`}>
                {criticalVulns > 0 ? `${criticalVulns} CRITICAL` : "0 CRITICAL"}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Vulnerability Findings</div>
              <div className="flex items-baseline justify-between text-[11px] text-[#64748b] mt-0.5">
                <span>Across all repos</span>
                <span className="font-mono text-white/90 font-bold">{totalVulns} Total</span>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.06] hover:border-white/[0.14] transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7]/20 to-[#6366f1]/10 border border-white/[0.08] text-[#a855f7] flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#a855f7]/15 text-[#c084fc] border border-[#a855f7]/30">
                POLYGON
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Attestation Ledger</div>
              <div className="flex items-baseline justify-between text-[11px] text-[#64748b] mt-0.5">
                <span>Merkle Root Proofs</span>
                <span className="font-mono text-[#c084fc] font-bold">Block #48,192</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Center Explorer Table Card */}
      <div className="rounded-2xl bg-[#0a0d15] border border-white/[0.07] overflow-hidden shadow-2xl">
        {/* Header Bar */}
        <div className="p-4 sm:px-6 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#8a99ad]">ThreatLens SOC</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#475569]" />
            <span className="text-white font-bold">All Connected Repositories</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-[#2546ff]/30 text-white" : "text-[#64748b] hover:text-white"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-[#2546ff]/30 text-white" : "text-[#64748b] hover:text-white"
                }`}
                title="List View"
              >
                <ListFilter className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => alert("Connect Repository dialog: Choose GitHub, GitLab, or Bitbucket")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2546ff] hover:bg-[#1d3bef] text-white text-xs font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(37,70,255,0.25)] border border-white/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Repo</span>
            </button>
          </div>
        </div>

        {/* Repositories Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-[#64748b] text-[11px] font-mono select-none">
                <th className="py-3 px-5 font-semibold">Repository Name</th>
                <th className="py-3 px-4 font-semibold">Language Stack</th>
                <th className="py-3 px-4 font-semibold">Security Posture</th>
                <th className="py-3 px-4 font-semibold">Vulnerabilities</th>
                <th className="py-3 px-4 font-semibold">Commits &amp; Size</th>
                <th className="py-3 px-4 font-semibold">Last Scanned</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredRepos.map((repo, idx) => {
                const isSelected = selectedRepo?.id === repo.id;
                return (
                  <tr
                    key={repo.id || idx}
                    onClick={() => onSelectRepo?.(repo)}
                    onDoubleClick={() => onOpenRepo?.(repo)}
                    className={`cursor-pointer transition-all duration-150 group ${
                      isSelected
                        ? "bg-[#2546ff]/15 border-l-2 border-l-[#4d8eff]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Repo Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/[0.08]"
                          style={{
                            background: `${repo.primaryColor}15`,
                            color: repo.primaryColor,
                          }}
                        >
                          <FolderGit2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-[#93c5fd] transition-colors text-xs">
                              {repo.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/5 text-[#8a99ad] border border-white/10">
                              {repo.defaultBranch}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#64748b] truncate max-w-[220px]">
                            {repo.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Stack */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#8a99ad]">
                      {repo.language}
                    </td>

                    {/* Security Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                            repo.grade === "A+"
                              ? "bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/30"
                              : repo.grade === "A"
                              ? "bg-[#3b82f6]/15 text-[#60a5fa] border-[#3b82f6]/30"
                              : "bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30"
                          }`}
                        >
                          {repo.grade} · {repo.securityScore}%
                        </span>
                      </div>
                    </td>

                    {/* Vulnerabilities Breakdown */}
                    <td className="py-3.5 px-4">
                      {repo.vulnerabilitiesSummary.critical > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#f43f5e]/15 text-[#fb7185] border border-[#f43f5e]/30">
                          {repo.vulnerabilitiesSummary.critical} Critical
                        </span>
                      ) : repo.vulnerabilitiesSummary.high > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#fb923c]/15 text-[#fdba74] border border-[#fb923c]/30">
                          {repo.vulnerabilitiesSummary.high} High
                        </span>
                      ) : repo.vulnerabilitiesSummary.total > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#8a99ad] bg-white/5 border border-white/10">
                          {repo.vulnerabilitiesSummary.total} Total
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4ade80]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Clean
                        </span>
                      )}
                    </td>

                    {/* Commits & Size */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#8a99ad]">
                      {repo.commitCount.toLocaleString()} commits · {repo.size}
                    </td>

                    {/* Last Scanned */}
                    <td className="py-3.5 px-4 text-[11px] text-[#64748b]">
                      {repo.lastScanDate}
                    </td>

                    {/* Enter Workspace Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenRepo?.(repo);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] hover:bg-[#2546ff] text-white text-[11px] font-semibold transition-all border border-white/[0.08] hover:border-[#2546ff]/40 shadow-sm"
                      >
                        <span>Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
