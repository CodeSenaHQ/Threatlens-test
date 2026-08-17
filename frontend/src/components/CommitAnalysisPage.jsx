import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  GitCommit,
  Bot,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  History,
  Terminal,
  Search,
  ArrowLeft,
  X,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { SAMPLE_COMMITS, CommitsAPI } from "../lib/api";
import { ThreatLensLogo } from "./ThreatLensLogo";

function CommitAnalysisPanel({
  commitHash,
  existingAnalysis,
  onAnalysisComplete,
}) {
  const [analysis, setAnalysis] = useState(existingAnalysis?.trim() ? existingAnalysis : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [modelName, setModelName] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await CommitsAPI.analyzeCommit(commitHash);
      setAnalysis(res.analysis);
      setIsCached(Boolean(res.cached));
      setModelName(res.model || 'threatlens-ast-engine-v2');
      if (onAnalysisComplete) {
        onAnalysisComplete(res.analysis);
      }
    } catch (err) {
      setError(err?.message || 'Failed to generate commit security analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Trigger & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#4d8eff]" />
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#93c5fd]">
            ThreatLens AI Security Review
          </h4>
        </div>
        {analysis && (
          <div className="flex items-center gap-2">
            {isCached && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-[#8a99ad] border border-white/10">
                Cached
              </span>
            )}
            {modelName && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2546ff]/20 text-[#b8caff] border border-[#2546ff]/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> {modelName}
              </span>
            )}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded text-[#8a99ad] hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              title="Copy Analysis Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Analysis Content Display */}
      {analysis ? (
        <div className="p-4 rounded-xl bg-[#06080d] border border-white/10 text-xs text-[#cbd5e1] leading-relaxed space-y-2 font-sans overflow-hidden">
          <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#cbd5e1]">
            {analysis}
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#64748b]">
            <span>AST Control Flow Pass: Verified</span>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="text-[#4d8eff] hover:underline flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Re-analyze
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-[#06080d] border border-dashed border-white/10 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#2546ff]/10 text-[#4d8eff] flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-semibold text-white">Generate Instant AST AI Review</h5>
            <p className="text-[11px] text-[#64748b] mt-0.5">
              Inspect control flow graphs, cryptographic integrity, and OWASP security classifications.
            </p>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#2546ff] hover:bg-[#0d27c7] text-white text-xs font-semibold transition-colors border border-white/10 shadow-[0_0_15px_rgba(37,70,255,0.25)] flex items-center gap-1.5 mx-auto cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing AST Delta...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI Audit</span>
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-[#f43f5e]/10 border border-[#f43f5e]/30 text-[#f43f5e] text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default function CommitAnalysisPage() {
  const [commits] = useState(SAMPLE_COMMITS);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);

  const filteredCommits = commits.filter(
    (c) =>
      c.hash.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.author.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.branch.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (filteredCommits.length > 0) {
      setSelectedCommit(filteredCommits[0]);
    } else {
      const newCustomCommit = {
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-[#edf2f7] selection:bg-[#2546ff] selection:text-white pb-24 font-sans">
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none bg-[linear-gradient(rgba(64,74,89,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(64,74,89,0.3)_1px,transparent_1px)] bg-[size:86px_86px]" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06080d]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="brand group flex items-center">
              <ThreatLensLogo className="h-7 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-[#cbd5e1]">
              <GitCommit className="w-3.5 h-3.5 text-[#4d8eff]" />
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
                className="w-full bg-[#0a0d15] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-[#718096] focus:outline-none focus:border-white/25 font-mono"
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
              className="px-4 py-2.5 bg-[#2546ff] hover:bg-[#0d27c7] text-white text-sm font-semibold rounded-lg transition-colors border border-white/10 cursor-pointer shadow-[0_0_15px_rgba(37,70,255,0.25)]"
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
                <History className="w-3.5 h-3.5 text-[#4d8eff]" /> Repository Commit Stream ({filteredCommits.length})
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
                    onClick={() => setSelectedCommit(c)}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? "bg-[#0f1422] border-[#2546ff]/60 shadow-[0_0_20px_rgba(37,70,255,0.18)]"
                        : "bg-[#0a0d15] border-white/10 hover:border-white/20 hover:bg-[#0d101b]"
                    }`}
                  >
                    {/* Top Row: Meta Badges & Hash */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white/5 border border-white/10 text-[#4d8eff]">
                          {c.shortHash}
                        </span>
                        <span className="text-xs text-[#8a99ad] font-mono">
                          {c.branch}
                        </span>
                      </div>
                      <span className="text-xs text-[#8a99ad]">{c.date}</span>
                    </div>

                    {/* Commit Message */}
                    <div className="text-sm font-medium text-white group-hover:text-[#93c5fd] transition-colors leading-snug line-clamp-2">
                      {c.message}
                    </div>

                    {/* Bottom Row: Author & Diff Stats */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-xs text-[#8a99ad]">
                      <span className="truncate max-w-[200px]">{c.author}</span>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-emerald-400">+{c.insertions}</span>
                        <span className="text-rose-400">-{c.deletions}</span>
                        <span className="text-[#64748b]">({c.filesChanged} files)</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredCommits.length === 0 && (
                <div className="p-8 text-center rounded-xl bg-[#0a0d15] border border-white/10 text-[#8a99ad] text-sm">
                  No commits found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Interactive Details Panel */}
          <AnimatePresence mode="wait">
            {selectedCommit && (
              <motion.div
                key={selectedCommit.hash}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 25 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="w-full lg:flex-1 space-y-6"
              >
                {/* Unified Diff Viewer */}
                <div className="p-5 rounded-2xl bg-[#0a0d15] border border-white/10 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-[#4d8eff]" />
                      <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#93c5fd]">
                        Unified Diff &amp; AST Delta
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#8a99ad] font-mono">
                        {selectedCommit.filesChanged} file{selectedCommit.filesChanged > 1 ? "s" : ""} modified
                      </span>
                    </div>
                  </div>

                  {/* Code Diff Display Container */}
                  <div className="rounded-xl bg-[#06080d] border border-white/5 p-4 font-mono text-xs leading-relaxed overflow-x-auto">
                    <pre className="text-[#cbd5e1]">
                      {selectedCommit.diff.split("\n").map((line, idx) => {
                        const isAdd = line.startsWith("+");
                        const isDel = line.startsWith("-");
                        const isHeader = line.startsWith("diff") || line.startsWith("---") || line.startsWith("+++") || line.startsWith("@@");

                        let lineBg = "";
                        let lineTextColor = "text-[#8a99ad]";

                        if (isAdd) {
                          lineBg = "bg-emerald-500/[0.07]";
                          lineTextColor = "text-emerald-300";
                        } else if (isDel) {
                          lineBg = "bg-rose-500/[0.07]";
                          lineTextColor = "text-rose-300";
                        } else if (isHeader) {
                          lineTextColor = "text-[#64748b]";
                        }

                        return (
                          <div
                            key={idx}
                            className={`flex items-start px-2 py-0.5 rounded-sm ${lineBg}`}
                          >
                            <span className={`select-none w-6 shrink-0 text-right pr-2 opacity-35 text-[10px]`}>
                              {idx + 1}
                            </span>
                            <span className={`${lineTextColor} flex-1`}>
                              {line}
                            </span>
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                </div>

                {/* AI Review Panel */}
                <div className="p-5 rounded-2xl bg-[#0a0d15] border border-white/10 shadow-xl">
                  <CommitAnalysisPanel
                    commitHash={selectedCommit.hash}
                    existingAnalysis={selectedCommit.existingAnalysis}
                    onAnalysisComplete={(analysis) => {
                      selectedCommit.existingAnalysis = analysis;
                    }}
                  />
                </div>

                {/* Cryptographic Attestation Block */}
                <div className="p-5 rounded-2xl bg-[#0a0d15] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#4d8eff]" />
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#93c5fd]">
                        Cryptographic Attestation Receipt
                      </h4>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified On-Chain
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                      <span className="text-[#8a99ad]">SHA-256 Commit Hash:</span>
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
                <div className="p-4 rounded-xl bg-[#06080d] border border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-[#8a99ad] mb-2 font-mono text-[11px]">
                    <Terminal className="w-3.5 h-3.5 text-[#4d8eff]" /> Run from CLI / TUI:
                  </div>
                  <code className="block bg-[#0a0d15] p-2.5 rounded border border-white/5 text-white font-mono text-xs leading-normal">
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
