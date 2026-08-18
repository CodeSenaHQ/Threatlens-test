import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Shield,
  FileCode,
  Check,
  Copy,
  ExternalLink,
  Tag,
  Users,
  Activity,
  GitCommit,
  FolderGit2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  GitBranch,
  Layers,
  Cpu
} from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";

export function InspectorPanel({ item, onClose, onOpenRepo }) {
  const [activeTab, setActiveTab] = useState("activity");
  const [copiedKey, setCopiedKey] = useState(null);

  if (!item) {
    return (
      <aside className="w-80 border-l border-white/[0.07] bg-[#0a0d15]/90 backdrop-blur-xl p-5 flex flex-col items-center justify-center text-center space-y-3 shrink-0 hidden xl:flex">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#64748b]">
          <Shield className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-white">Item Inspector</div>
          <p className="text-[11px] text-[#475569] max-w-[180px]">
            Select any repository, vulnerability finding, or commit to inspect its telemetry, diffs, and proofs.
          </p>
        </div>
      </aside>
    );
  }

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Check item type
  const isRepo = Boolean(item.languages || item.fullName || item.commitCount);
  const isFinding = Boolean(!isRepo && (item.severity || item.cwe || item.module || item.title));
  const isCommit = Boolean(!isRepo && (item.hash || item.shortHash));

  const reviewers = [
    { name: "Dev Sharma", initials: "DS", color: "from-[#2546ff] to-[#4d8eff]" },
    { name: "Alex Vance", initials: "AV", color: "from-[#06b6d4] to-[#3b82f6]" },
    { name: "SecTest Bot", initials: "AI", color: "from-[#a855f7] to-[#ec4899]" },
  ];

  // ===================== REPOSITORY VIEW IN INSPECTOR =====================
  if (isRepo) {
    return (
      <aside className="w-80 border-l border-white/[0.07] bg-[#0a0d15]/95 backdrop-blur-xl flex flex-col shrink-0 h-full overflow-y-auto z-20">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.07] flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border border-white/[0.08]"
              style={{
                background: `${item.primaryColor || "#3b82f6"}15`,
                color: item.primaryColor || "#3b82f6",
              }}
            >
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white leading-tight truncate">{item.name}</h4>
              <div className="text-[10px] text-[#64748b] font-mono mt-0.5 truncate">
                {item.fullName || item.name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748b] hover:text-white hover:bg-white/5 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-5 flex-1">
          {/* Primary Action Button: Enter Workspace */}
          <button
            onClick={() => onOpenRepo?.(item)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2546ff] hover:bg-[#1d3bef] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(37,70,255,0.25)] border border-white/10"
          >
            <span>Open Repository SOC</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Security Posture & Grade Card */}
          <div className="p-3 rounded-xl bg-[#06080d] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#64748b] uppercase">Security Posture</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                  item.grade === "A+"
                    ? "bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/30"
                    : item.grade === "A"
                    ? "bg-[#3b82f6]/15 text-[#60a5fa] border-[#3b82f6]/30"
                    : "bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30"
                }`}
              >
                Grade {item.grade} · {item.securityScore}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2546ff] to-[#4ade80]"
                style={{ width: `${item.securityScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#8a99ad] pt-1">
              <span>{item.vulnerabilitiesSummary?.critical || 0} Critical</span>
              <span>{item.vulnerabilitiesSummary?.total || 0} Findings</span>
              <span>{item.commitCount} Commits</span>
            </div>
          </div>

          {/* Language Composition */}
          {item.languages && (
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-[#64748b] uppercase">Codebase Composition</div>
              <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.04]">
                {item.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="h-full"
                    style={{ width: `${lang.pct}%`, background: lang.color }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] text-[#8a99ad]">
                {item.languages.map((lang) => (
                  <span key={lang.name} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm" style={{ background: lang.color }} />
                    {lang.name} {lang.pct}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SecOps Reviewers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#64748b] uppercase">
              <span>Project Reviewers</span>
              <span className="text-[#4d8eff] cursor-pointer">Manage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1.5 overflow-hidden">
                {reviewers.map((r, i) => (
                  <div
                    key={i}
                    title={r.name}
                    className={`inline-block h-6 w-6 rounded-full ring-2 ring-[#0a0d15] bg-gradient-to-tr ${r.color} text-[9px] font-bold text-white flex items-center justify-center uppercase font-mono shadow-sm`}
                  >
                    {r.initials}
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-[#64748b] font-mono ml-1">+2 Analysts</span>
            </div>
          </div>

          {/* Ledger Attestation Receipt */}
          <div className="p-3 rounded-xl bg-[#06080d] border border-white/[0.06] space-y-1.5">
            <div className="text-[10px] text-[#64748b] font-mono uppercase">Polygon PoS Anchor</div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-white font-bold">{item.proofBlock || "#48,192"}</span>
              <span className="text-[10px] font-semibold text-[#4ade80] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
            <div className="text-[10px] text-[#475569]">Last automated AST audit {item.lastScanDate}</div>
          </div>
        </div>
      </aside>
    );
  }

  // ===================== FINDING OR COMMIT DETAIL VIEW =====================
  const title = item.title || item.message || "Selected Item";
  const subtitle = item.id
    ? `${item.id} · ${item.module || "SecTest"} · Active Finding`
    : item.shortHash
    ? `Commit ${item.shortHash} · ${item.author || "Author"}`
    : "Security Telemetry";

  const tags = [
    item.meta?.cwe || item.cwe,
    item.module || (isCommit ? "Git Commit" : "Security"),
    item.severity?.toUpperCase(),
  ].filter(Boolean);

  return (
    <aside className="w-80 border-l border-white/[0.07] bg-[#0a0d15]/95 backdrop-blur-xl flex flex-col shrink-0 h-full overflow-y-auto z-20">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.07] flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#2546ff]/15 border border-[#2546ff]/30 text-[#4d8eff] flex items-center justify-center shrink-0 mt-0.5">
            {isCommit ? <GitCommit className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white leading-tight truncate">{title}</h4>
            <div className="text-[10px] text-[#64748b] font-mono mt-0.5 truncate">{subtitle}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[#64748b] hover:text-white hover:bg-white/5 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Tags Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#8a99ad] uppercase tracking-wider text-[10px] font-mono">Tags</span>
            <button className="text-[11px] font-medium text-[#4d8eff] hover:underline">Edit</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#2546ff]/10 border border-[#2546ff]/20 text-[#93c5fd]"
              >
                {tag}
              </span>
            ))}
            {item.severity && <SeverityBadge severity={item.severity} />}
          </div>
        </div>

        {/* Reviewers Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#8a99ad] uppercase tracking-wider text-[10px] font-mono">
              SecOps Reviewers
            </span>
            <button className="text-[11px] font-medium text-[#4d8eff] hover:underline">Manage</button>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1.5 overflow-hidden">
              {reviewers.map((r, i) => (
                <div
                  key={i}
                  title={r.name}
                  className={`inline-block h-6 w-6 rounded-full ring-2 ring-[#0a0d15] bg-gradient-to-tr ${r.color} text-[9px] font-bold text-white flex items-center justify-center uppercase font-mono shadow-sm`}
                >
                  {r.initials}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-[#64748b] font-mono ml-1">+2 Analysts</span>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="pt-2">
          <div className="flex border-b border-white/[0.07] text-xs">
            <button
              onClick={() => setActiveTab("activity")}
              className={`pb-2 px-1 font-semibold transition-colors relative ${
                activeTab === "activity"
                  ? "text-white"
                  : "text-[#64748b] hover:text-[#8a99ad]"
              }`}
            >
              Activity
              {activeTab === "activity" && (
                <motion.div
                  layoutId="inspectorTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4d8eff]"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("diff")}
              className={`pb-2 px-3 font-semibold transition-colors relative ${
                activeTab === "diff"
                  ? "text-white"
                  : "text-[#64748b] hover:text-[#8a99ad]"
              }`}
            >
              Remediation
              {activeTab === "diff" && (
                <motion.div
                  layoutId="inspectorTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4d8eff]"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("proof")}
              className={`pb-2 px-3 font-semibold transition-colors relative ${
                activeTab === "proof"
                  ? "text-white"
                  : "text-[#64748b] hover:text-[#8a99ad]"
              }`}
            >
              Proof
              {activeTab === "proof" && (
                <motion.div
                  layoutId="inspectorTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4d8eff]"
                />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content 1: Activity Timeline */}
        {activeTab === "activity" && (
          <div className="space-y-4 pt-1">
            <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/[0.08]">
              <div className="relative">
                <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-[#f43f5e] ring-4 ring-[#0a0d15]" />
                <div className="text-[10px] text-[#64748b] font-mono">Today, 12:30 UTC</div>
                <div className="text-xs text-white font-medium mt-0.5">
                  Dynamic probe detected vulnerability
                </div>
                <div className="text-[11px] text-[#8a99ad] mt-0.5 font-mono">
                  {item.meta?.endpoint || item.endpoint || "POST /api/v1/users/search"}
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-[#3b82f6] ring-4 ring-[#0a0d15]" />
                <div className="text-[10px] text-[#64748b] font-mono">Today, 12:35 UTC</div>
                <div className="text-xs text-white font-medium mt-0.5">
                  Alex Vance assigned AST remediation
                </div>
                <div className="text-[11px] text-[#8a99ad] mt-0.5">
                  Parameterized binding patch staged
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-[#22c55e] ring-4 ring-[#0a0d15]" />
                <div className="text-[10px] text-[#64748b] font-mono">Today, 12:40 UTC</div>
                <div className="text-xs text-white font-medium mt-0.5">
                  Polygon PoS Attestation Anchored
                </div>
                <div className="text-[11px] text-[#4ade80] mt-0.5 font-mono">
                  Block #48,192 · Verified
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Remediation Diff */}
        {activeTab === "diff" && (
          <div className="space-y-3 pt-1">
            <div className="text-[11px] text-[#8a99ad] leading-relaxed">
              {item.remediation || "Use parameterized query binding to prevent untrusted input interpolation."}
            </div>

            <div className="p-3 rounded-xl bg-[#06080d] border border-white/[0.06] font-mono text-[11px] leading-relaxed overflow-x-auto">
              <pre className="text-[#8a99ad]">
                {(item.diffSnippet || item.diff || "- const query = `SELECT * FROM users WHERE org_id = '${req.body.orgId}'`;\n+ const query = `SELECT * FROM users WHERE org_id = $1`;")
                  .split("\n")
                  .map((line, idx) => (
                    <div
                      key={idx}
                      className={
                        line.startsWith("+")
                          ? "text-[#86efac] bg-[#22c55e]/10 px-1 rounded"
                          : line.startsWith("-")
                          ? "text-[#fca5a5] bg-[#f43f5e]/10 px-1 rounded"
                          : "text-[#64748b]"
                      }
                    >
                      {line}
                    </div>
                  ))}
              </pre>
            </div>
          </div>
        )}

        {/* Tab Content 3: Proof */}
        {activeTab === "proof" && (
          <div className="space-y-3 pt-1">
            <div className="text-[11px] text-[#8a99ad]">
              Cryptographic SHA-256 Merkle root anchored permanently on the Polygon PoS ledger.
            </div>

            <div className="p-3 rounded-xl bg-[#06080d] border border-white/[0.06] space-y-2">
              <div className="text-[10px] text-[#64748b] font-mono uppercase">Proof Hash Digest</div>
              <button
                onClick={() =>
                  copyText(
                    item.meta?.proof_hash || item.proofHash || "0x9f4a7c2e88b13904a0ef1982bca48192a0e",
                    "proof"
                  )
                }
                className="w-full text-left p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-[#2546ff]/40 flex items-center justify-between group transition-colors"
              >
                <code className="text-[10px] font-mono text-[#b8caff] truncate">
                  {item.meta?.proof_hash || item.proofHash || "0x9f4a7c2e88b13904a0ef1982bca48192a0e"}
                </code>
                {copiedKey === "proof" ? (
                  <Check className="w-3.5 h-3.5 text-[#4ade80] shrink-0 ml-1" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#64748b] group-hover:text-white shrink-0 ml-1" />
                )}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/20 flex items-center gap-2 text-xs text-[#4ade80]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Immutable attestation receipt verified</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
