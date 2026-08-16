import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCommit,
  GitBranch,
  ShieldCheck,
  FileCode,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Search,
  Fingerprint,
  ChevronRight,
  X,
  History,
  Terminal,
} from "lucide-react";
import { SAMPLE_COMMITS, CommitItem } from "../services/api";
import { CommitAnalysisPanel } from "../components/CommitAnalysisPanel";

export default function CommitAnalysisPage() {
  const [commits] = useState<CommitItem[]>(SAMPLE_COMMITS);
  // Default to null so initially all commits cover the full screen
  const [selectedCommit, setSelectedCommit] = useState<CommitItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);

  // Filtered commits based on search query
  const filteredCommits = commits.filter(
    (c) =>
      c.hash.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.author.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.branch.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (filteredCommits.length > 0) {
      setSelectedCommit(filteredCommits[0]);
    } else {
      // Create custom dynamic commit for custom hash or query
      const newCustomCommit: CommitItem = {
        hash: searchQuery.trim(),
        shortHash: searchQuery.trim().slice(0, 7),
        author: "Developer (Local)",
        authorEmail: "dev@workspace.local",
        date: "Just now",
        branch: "main",
        message: `custom commit: inspect delta for ${searchQuery.trim().slice(0, 7)}`,
        filesChanged: 1,
        insertions: 8,
        deletions: 3,
        diff: `diff --git a/src/index.ts b/src/index.ts
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,6 +1,8 @@
-export function processInput(val: string) {
-  return eval(val);
+export function processInput(val: string) {
  // ThreatLens Sanitizer AST Pass
  return JSON.parse(sanitizeJsonString(val));
+}`,
      };
      setSelectedCommit(newCustomCommit);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-[#edf2f7] selection:bg-[#8b4513] selection:text-white pb-24 font-sans">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none bg-[linear-gradient(rgba(64,74,89,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(64,74,89,0.3)_1px,transparent_1px)] bg-[size:86px_86px]" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07090d]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="brand group">
              <img src="/threatlens-icon.png" alt="ThreatLens" className="brand-icon" />
              <span className="brand-name">
                ThreatLens <em>AI</em>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-[#cbd5e1]">
              <GitCommit className="w-3.5 h-3.5 text-[#d4a373]" />
              <span className="font-mono">AI Commit Analyzer</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#8a99ad] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-semibold rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
            >
              GitHub Repo
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              AI Code &amp; Commit Security Analysis
            </h1>
            <p className="text-base text-[#94a3b8] max-w-2xl mt-3 leading-relaxed">
              Continuously inspect diff deltas, syntax control paths, hardcoded secrets, and supply-chain vulnerabilities before merging into production.
            </p>
          </div>

          {/* Quick Commit Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8a99ad]" />
              <input
                type="text"
                placeholder="Search commit, branch, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b0e14] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-[#718096] focus:outline-none focus:border-white/25 font-mono"
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-2.5 text-[#8a99ad] hover:text-white bg-white/5 border border-white/10 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#8b4513] hover:bg-[#9c4f17] text-white text-sm font-semibold rounded-lg transition-colors border border-white/10 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Responsive Split-Pane Workspace */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 mt-4">
        <motion.div layout className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column / Full Width: Vertical Commits Stream */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`w-full ${
              selectedCommit ? "lg:w-[44%] lg:shrink-0" : "max-w-5xl mx-auto"
            } space-y-3`}
          >
            <div className="flex items-center justify-between px-1 pb-1 text-xs text-[#8a99ad]">
              <span className="flex items-center gap-1.5 font-medium">
                <History className="w-3.5 h-3.5 text-[#d4a373]" /> Repository Commit Stream ({filteredCommits.length})
              </span>
              <span className="text-[11px] text-[#8a99ad] font-mono">
                {selectedCommit ? "Selected: " + selectedCommit.shortHash : "Click any commit to inspect"}
              </span>
            </div>

            {/* Vertical Stack of Commit Boxes */}
            <div className="space-y-3">
              {filteredCommits.map((c) => {
                const isSelected = selectedCommit?.hash === c.hash;

                return (
                  <motion.div
                    layout
                    key={c.hash}
                    onClick={() => setSelectedCommit(isSelected ? null : c)}
                    whileHover={{ scale: 1.004 }}
                    whileTap={{ scale: 0.996 }}
                    className={`p-4 rounded-xl transition-colors cursor-pointer border relative group ${
                      isSelected
                        ? "bg-[#0e121a] border-white/25 ring-1 ring-white/10 shadow-none"
                        : "bg-[#0b0e14] border-white/10 hover:border-white/20 hover:bg-[#0d1017]"
                    }`}
                  >
                    {/* Top Row: Branch & Time & Hash */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                            isSelected
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-white/5 border-white/10 text-[#8a99ad]"
                          }`}
                        >
                          {c.branch}
                        </span>
                        <span className="text-xs text-[#718096]">{c.date}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-[#8a99ad] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          {c.shortHash}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isSelected
                              ? "text-white rotate-90 lg:rotate-0 translate-x-0.5"
                              : "text-[#718096] group-hover:text-white group-hover:translate-x-0.5"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Commit Message */}
                    <h3
                      className={`text-sm font-medium leading-snug line-clamp-2 ${
                        isSelected ? "text-white font-semibold" : "text-[#cbd5e1]"
                      }`}
                    >
                      {c.message}
                    </h3>

                    {/* Bottom Row: Author & Diff Stats */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-xs text-[#8a99ad]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold text-white">
                          {c.author[0]}
                        </div>
                        <span className="text-[#cbd5e1]">{c.author}</span>
                      </div>

                      <div className="flex items-center gap-2.5 font-mono text-xs text-[#8a99ad]">
                        <span className="text-[#86efac]/80">+{c.insertions}</span>
                        <span className="text-[#fca5a5]/80">-{c.deletions}</span>
                        <span>{c.filesChanged}f</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredCommits.length === 0 && (
                <div className="p-12 text-center rounded-xl bg-[#0b0e14] border border-white/10 text-sm text-[#8a99ad]">
                  No commits found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Selected Commit Full Details Workspace */}
          <AnimatePresence>
            {selectedCommit && (
              <motion.div
                layout
                initial={{ opacity: 0, x: 24, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full lg:w-[56%] lg:shrink-0 space-y-6 lg:sticky lg:top-24"
              >
                {/* Unified Diff Viewer */}
                <div className="rounded-xl bg-[#0b0e14] border border-white/10 overflow-hidden shadow-none">
                  <div className="px-4 py-3 bg-[#07090d] border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs font-mono text-[#cbd5e1] font-semibold">
                      <FileCode className="w-4 h-4 text-[#8a99ad]" />
                      <span>Unified Diff Stream</span>
                      <span className="text-[#718096] font-normal">({selectedCommit.shortHash})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#86efac]/80 font-medium">+{selectedCommit.insertions}</span>
                      <span className="text-xs font-mono text-[#fca5a5]/80 font-medium">-{selectedCommit.deletions}</span>
                      <button
                        onClick={() => copyToClipboard(selectedCommit.hash)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8a99ad] hover:text-white bg-white/5 px-2 py-0.5 rounded border border-white/10 transition-colors cursor-pointer"
                        title="Copy full commit hash"
                      >
                        {copiedHash ? <Check className="w-3 h-3 text-[#86efac]" /> : <Copy className="w-3 h-3" />}
                        <span>Hash</span>
                      </button>
                      <button
                        onClick={() => setSelectedCommit(null)}
                        className="p-1 text-[#8a99ad] hover:text-white bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors cursor-pointer"
                        title="Close details view"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed bg-[#040608] max-h-[320px] scrollbar-thin">
                    {selectedCommit.diff.split("\n").map((line, idx) => {
                      const isAddition = line.startsWith("+") && !line.startsWith("+++");
                      const isDeletion = line.startsWith("-") && !line.startsWith("---");
                      const isHeader = line.startsWith("@@") || line.startsWith("diff");

                      return (
                        <div
                          key={idx}
                          className={`px-2 py-0.5 whitespace-pre rounded-xs ${
                            isAddition
                              ? "bg-emerald-500/[0.07] text-[#a7f3d0]/90"
                              : isDeletion
                              ? "bg-rose-500/[0.07] text-[#fca5a5]/90"
                              : isHeader
                              ? "text-[#718096] font-medium bg-transparent"
                              : "text-[#94a3b8]"
                          }`}
                        >
                          {line}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Commit Analysis Panel */}
                <div className="p-5 rounded-xl bg-[#0b0e14] border border-white/10 shadow-none">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#8a99ad]" />
                      <h3 className="text-sm font-bold text-white">AI Vulnerability &amp; Diff Scanner</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-[#8a99ad]">
                      AST v2.4
                    </span>
                  </div>
                  <p className="text-xs text-[#8a99ad] leading-relaxed mb-4">
                    Trigger instant context-aware security synthesis powered by ThreatLens AI engine.
                  </p>

                  {/* Embedded CommitAnalysisPanel Component */}
                  <CommitAnalysisPanel
                    commitHash={selectedCommit.hash}
                    existingAnalysis={selectedCommit.existingAnalysis}
                  />
                </div>

                {/* Cryptographic Attestation Receipt */}
                <div className="p-5 rounded-xl bg-[#0b0e14] border border-white/10 shadow-none">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-[#8a99ad]" />
                      <h3 className="text-sm font-bold text-white">Cryptographic Receipt</h3>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-[#8a99ad] font-mono font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#cbd5e1]" /> VERIFIED
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                      <span className="text-[#8a99ad]">SHA-256 Delta Hash:</span>
                      <span className="font-mono text-[#cbd5e1] text-xs">
                        {selectedCommit.hash.slice(0, 18)}...
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                      <span className="text-[#8a99ad]">Signer Key Algorithm:</span>
                      <span className="font-mono text-[#cbd5e1] text-xs">ECDSA secp256k1</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                      <span className="text-[#8a99ad]">Polygon Attestation:</span>
                      <span className="font-mono text-[#cbd5e1] text-xs font-semibold">#58,291,042</span>
                    </div>
                  </div>
                </div>

                {/* Quick Terminal Command */}
                <div className="p-4 rounded-xl bg-[#07090d] border border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-[#8a99ad] mb-2 font-mono text-[11px]">
                    <Terminal className="w-3.5 h-3.5 text-[#d4a373]" /> Run from CLI / TUI:
                  </div>
                  <code className="block bg-[#0b0e14] p-2.5 rounded border border-white/5 text-white font-mono text-xs leading-normal">
                    python sectest/cli.py analyze --commit {selectedCommit.shortHash}
                  </code>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
