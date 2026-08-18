import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { GitBranch, ExternalLink, Copy, Check, FileCode, AlertTriangle } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";
import { SAMPLE_COMMITS } from "@/lib/api";

const RISK_COLORS = {
  critical: { bg: "bg-[#f43f5e]/15", text: "text-[#fb7185]", border: "border-[#f43f5e]/30" },
  high: { bg: "bg-[#fb923c]/15", text: "text-[#fdba74]", border: "border-[#fb923c]/30" },
  medium: { bg: "bg-[#facc15]/15", text: "text-[#fde047]", border: "border-[#facc15]/30" },
  low: { bg: "bg-[#22c55e]/15", text: "text-[#86efac]", border: "border-[#22c55e]/30" },
};

// Simulated repository stats
const REPO_STATS = {
  name: "ThreatLens",
  owner: "ThreatLens",
  branch: "main",
  commitCount: 1428,
  totalFiles: 342,
  totalSize: "18.45 MB",
  languages: [
    { name: "Python", pct: 51, color: "#3572A5" },
    { name: "JavaScript", pct: 26, color: "#f1e05a" },
    { name: "TypeScript", pct: 17, color: "#2b7489" },
    { name: "CSS", pct: 6, color: "#563d7c" },
  ],
};

export default function GitAnalyzerView({ onSelectFinding }) {
  const [selectedCommit, setSelectedCommit] = useState(SAMPLE_COMMITS[0]);
  const [copiedSha, setCopiedSha] = useState(null);

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedSha(hash);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Repo metadata header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.06] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 text-[#4d8eff]">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{REPO_STATS.owner} / {REPO_STATS.name}</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-[#4d8eff]/10 border border-[#4d8eff]/20 text-[#93c5fd]">
                  {REPO_STATS.branch}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-[#475569]">
                <span>{REPO_STATS.commitCount.toLocaleString()} commits</span>
                <span>·</span>
                <span>{REPO_STATS.totalFiles} files</span>
                <span>·</span>
                <span>{REPO_STATS.totalSize}</span>
              </div>
            </div>
          </div>
          <Link
            href="/commit-analysis"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2546ff] hover:bg-[#1d3bef] text-white text-xs font-semibold transition-colors"
          >
            Full Analyzer <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Language bar */}
        <div className="space-y-2">
          <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.04]">
            {REPO_STATS.languages.map(lang => (
              <div
                key={lang.name}
                className="h-full transition-all"
                style={{ width: `${lang.pct}%`, background: lang.color }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {REPO_STATS.languages.map(lang => (
              <span key={lang.name} className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: lang.color }} />
                {lang.name} {lang.pct}%
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Commit feed + Diff viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Commit list */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.06] space-y-3 max-h-[600px] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
            <h3 className="text-sm font-semibold text-white">Commit Stream</h3>
            <span className="text-[11px] text-[#475569] font-mono">{SAMPLE_COMMITS.length} commits</span>
          </div>

          <div className="space-y-2">
            {SAMPLE_COMMITS.map(c => (
              <button
                key={c.hash}
                onClick={() => setSelectedCommit(c)}
                className={`w-full text-left p-3 rounded-xl transition-all border ${
                  selectedCommit.hash === c.hash
                    ? "bg-[#2546ff]/10 border-[#2546ff]/25"
                    : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.08]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#4d8eff]">{c.shortHash}</span>
                    <button
                      onClick={e => { e.stopPropagation(); copyHash(c.hash); }}
                      className="text-[#334155] hover:text-[#64748b]"
                    >
                      {copiedSha === c.hash ? <Check className="w-3 h-3 text-[#4ade80]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-[#334155]">{c.date}</span>
                </div>
                <div className="text-xs text-white leading-snug line-clamp-2">{c.message}</div>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#475569]">
                  <span>{c.author}</span>
                  <span className="text-[#1e293b]">·</span>
                  <span className="font-mono">{c.branch}</span>
                  <span className="text-[#1e293b]">·</span>
                  <span className="text-[#4ade80]">+{c.insertions}</span>
                  <span className="text-[#f43f5e]">-{c.deletions}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Diff viewer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.06] space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#4d8eff]" />
                <h3 className="text-sm font-bold text-white font-mono">{selectedCommit.shortHash}</h3>
              </div>
              <p className="text-xs text-[#475569] line-clamp-1">{selectedCommit.message}</p>
              <div className="text-[11px] text-[#334155]">
                {selectedCommit.author} ({selectedCommit.authorEmail}) · {selectedCommit.date}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#22c55e]/10 text-[#86efac] border border-[#22c55e]/20">
                +{selectedCommit.insertions}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#f43f5e]/10 text-[#fca5a5] border border-[#f43f5e]/20">
                -{selectedCommit.deletions}
              </span>
            </div>
          </div>

          {/* Diff content */}
          <div className="p-4 rounded-xl bg-[#06080d] border border-white/[0.04] font-mono text-xs leading-relaxed overflow-x-auto max-h-[400px] overflow-y-auto">
            <pre className="text-[#64748b]">
              {selectedCommit.diff.split("\n").map((line, idx) => {
                const isAdd = line.startsWith("+");
                const isDel = line.startsWith("-");
                const isHeader = line.startsWith("diff") || line.startsWith("---") || line.startsWith("+++") || line.startsWith("@@");
                return (
                  <div
                    key={idx}
                    className={`px-2 py-px rounded-sm ${
                      isHeader
                        ? "text-[#475569] font-semibold"
                        : isAdd
                        ? "bg-[#22c55e]/8 text-[#86efac]"
                        : isDel
                        ? "bg-[#f43f5e]/8 text-[#fca5a5]"
                        : "text-[#64748b]"
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </pre>
          </div>

          {/* AI Analysis summary */}
          {selectedCommit.existingAnalysis && (
            <div className="p-4 rounded-xl bg-[#0e1320] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-[#4d8eff]" />
                Security Analysis
              </div>
              <div className="text-xs text-[#8a99ad] leading-relaxed whitespace-pre-wrap">
                {selectedCommit.existingAnalysis
                  .replace(/### ⚡ /g, "")
                  .replace(/\*\*/g, "")
                  .replace(/- /g, "• ")}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
