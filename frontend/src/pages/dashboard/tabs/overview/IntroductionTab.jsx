import React, { useState } from "react";
import {
  Sparkles, Shield, Terminal, Bot, FolderGit2, GitCommit,
  ShieldAlert, Lock, Box, CheckCircle, ArrowRight, Zap,
  Globe, Code2, Cpu, Users, ChevronRight, ExternalLink,
  Star, Activity, BookOpen, Package, Layers, GitBranch,
  Workflow, Key, AlertTriangle, TrendingUp,
} from "lucide-react";

const FEATURES = [
  {
    icon: GitCommit, color: "#38bdf8", label: "Commit Intelligence",
    desc: "Every commit is tokenized, AST-parsed, and ranked with a weighted risk score using LLM-assisted diff analysis.",
  },
  {
    icon: ShieldAlert, color: "#f43f5e", label: "Live DAST Findings",
    desc: "Active DAST scanner probes your running API for SQL injection, broken auth, rate-limit bypass, and header misconfigurations.",
  },
  {
    icon: Lock, color: "#a78bfa", label: "Secret Detection",
    desc: "Entropy-based scanning across all file diffs detects leaked API keys, tokens, and credentials before they reach production.",
  },
  {
    icon: Bot, color: "#34d399", label: "ThreatLensGO AI",
    desc: "Conversational security assistant powered by DeepSeek R1 — ask about findings, get remediation code, or review threat models.",
  },
  {
    icon: Box, color: "#f59e0b", label: "CI/CD & Docker Audit",
    desc: "Analyze your GitHub Actions workflows, Dockerfiles, and pipeline configs for privilege escalation and supply-chain risks.",
  },
  {
    icon: CheckCircle, color: "#10b981", label: "Compliance Posture",
    desc: "Map findings to OWASP Top 10, CWE categories, SOC 2, and PCI-DSS controls with automated evidence collection.",
  },
];

const TOOLS = [
  { icon: Terminal, label: "threatlens scan", color: "#38bdf8", badge: "CLI", desc: "Run a full commit-history security scan on any local or remote Git repository." },
  { icon: Bot, label: "ThreatLensGO", color: "#34d399", badge: "AI", desc: "Ask questions about your codebase, findings, or threat models in natural language." },
  { icon: Activity, label: "DAST Prober", color: "#f43f5e", badge: "Live", desc: "Actively probe your running API endpoints for OWASP Top 10 vulnerabilities in real time." },
  { icon: Lock, label: "Secret Scanner", color: "#a78bfa", badge: "Static", desc: "Entropy-based detection across diffs for leaked credentials and API tokens." },
  { icon: Package, label: "SCA Checker", color: "#f59e0b", badge: "Deps", desc: "Scan your dependency manifests for known CVEs and outdated packages." },
  { icon: Workflow, label: "CI/CD Auditor", color: "#60a5fa", badge: "DevOps", desc: "Audit GitHub Actions workflows and Dockerfiles for misconfigurations and privilege escalation." },
];

const QUICKSTART = [
  { step: "01", title: "Install the CLI", code: "pip install threatlens", color: "#38bdf8" },
  { step: "02", title: "Authenticate", code: "threatlens login --api-key <YOUR_KEY>", color: "#a78bfa" },
  { step: "03", title: "Scan a repository", code: "threatlens scan ./my-project --full", color: "#34d399" },
  { step: "04", title: "View results", code: "Open dashboard → Security Overview", color: "#f59e0b" },
];

export default function IntroductionTab({ onNavigate }) {
  const [copiedStep, setCopiedStep] = useState(null);

  const copyCmd = (cmd, idx) => {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopiedStep(idx);
      setTimeout(() => setCopiedStep(null), 2000);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-14 py-2">

      {/* ── HERO ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Platform v2.0
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
            <Activity className="w-3 h-3" /> Live
          </span>
        </div>

        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#a78bfa]">ThreatLens</span>
          </h1>
          <p className="mt-4 text-[#71717a] text-base sm:text-lg leading-relaxed max-w-2xl">
            An AI-powered security intelligence platform that scans your code, commits, and running services for vulnerabilities — giving every engineering team enterprise-grade AppSec.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => onNavigate && onNavigate("chatbot")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#38bdf8] hover:bg-[#7dd3fc] text-[#04101c] text-sm font-bold transition-all active:scale-[0.98] shadow-lg shadow-sky-500/20 cursor-pointer"
          >
            <Bot className="w-4 h-4" /> Open ThreatLensGO
          </button>
          <button
            onClick={() => onNavigate && onNavigate("cli")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-white text-sm font-semibold transition-all cursor-pointer"
          >
            <Terminal className="w-4 h-4" /> CLI Reference
          </button>
          <button
            onClick={() => onNavigate && onNavigate("findings")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-transparent border border-[#27272a] text-[#71717a] hover:text-white hover:border-[#3f3f46] text-sm font-semibold transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" /> View Findings
          </button>
        </div>
      </div>

      {/* ── STAT STRIP ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: "500K+", label: "Commits Analyzed", color: "#38bdf8" },
          { value: "OWASP", label: "Top 10 Coverage", color: "#a78bfa" },
          { value: "< 30s", label: "Scan Turnaround", color: "#34d399" },
          { value: "6", label: "Security Modules", color: "#f59e0b" },
        ].map(({ value, label, color }) => (
          <div key={label} className="bg-[#0d0d10] border border-[#1c1c1f] rounded-2xl p-4 space-y-1">
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
            <div className="text-xs text-[#52525b] font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* ── QUICKSTART ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Quickstart</h2>
          <p className="text-[#52525b] text-sm mt-1">Get scanning in under 2 minutes.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICKSTART.map(({ step, title, code, color }, idx) => (
            <div
              key={step}
              className="group relative bg-[#0d0d10] border border-[#1c1c1f] hover:border-[#27272a] rounded-2xl p-4 space-y-2.5 transition-all cursor-pointer"
              onClick={() => copyCmd(code, idx)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold" style={{ color }}>{step}</span>
                  <span className="text-sm font-semibold text-white">{title}</span>
                </div>
                <span className="text-[10px] text-[#3f3f46] group-hover:text-[#71717a] transition-colors">
                  {copiedStep === idx ? "✓ Copied" : "click to copy"}
                </span>
              </div>
              <pre className="font-mono text-[12px] text-[#a1a1aa] bg-[#09090b] rounded-lg px-3 py-2 border border-[#1c1c1f] overflow-x-auto">
                {code}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* ── PLATFORM CAPABILITIES ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Platform Capabilities</h2>
          <p className="text-[#52525b] text-sm mt-1">Six interconnected security modules that cover your entire software supply chain.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, color, label, desc }) => (
            <div key={label} className="group bg-[#0d0d10] border border-[#1c1c1f] hover:border-[#27272a] rounded-2xl p-5 space-y-3 transition-all">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                <Icon className="w-4.5 h-4.5" style={{ color }} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{label}</div>
                <p className="text-[12.5px] text-[#71717a] mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AVAILABLE TOOLS ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Available Tools</h2>
          <p className="text-[#52525b] text-sm mt-1">Every tool integrated into the ThreatLens platform.</p>
        </div>
        <div className="bg-[#0d0d10] border border-[#1c1c1f] rounded-2xl overflow-hidden divide-y divide-[#1c1c1f]">
          {TOOLS.map(({ icon: Icon, label, color, badge, desc }) => (
            <div key={label} className="flex items-start gap-4 px-5 py-4 hover:bg-[#111114] transition-colors group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-sm font-bold text-white font-mono">{label}</code>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border" style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                    {badge}
                  </span>
                </div>
                <p className="text-[12.5px] text-[#71717a] mt-0.5 leading-relaxed">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#3f3f46] group-hover:text-[#71717a] shrink-0 mt-1 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">How It Works</h2>
          <p className="text-[#52525b] text-sm mt-1">ThreatLens operates across three analysis planes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              phase: "Static Analysis", icon: Code2, color: "#38bdf8",
              points: ["Git commit history ingestion", "AST diff tokenization", "LLM-assisted risk scoring", "Secret entropy detection"],
            },
            {
              phase: "Dynamic Analysis", icon: Activity, color: "#f43f5e",
              points: ["Live API endpoint probing", "OWASP Top 10 test suite", "Rate-limit & auth bypass tests", "Header security checks"],
            },
            {
              phase: "AI Intelligence", icon: Sparkles, color: "#a78bfa",
              points: ["DeepSeek R1 reasoning engine", "Contextual remediation advice", "Threat model generation", "Compliance evidence mapping"],
            },
          ].map(({ phase, icon: Icon, color, points }) => (
            <div key={phase} className="bg-[#0d0d10] border border-[#1c1c1f] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-sm font-bold text-white">{phase}</span>
              </div>
              <ul className="space-y-2">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[12.5px] text-[#71717a]">
                    <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: color }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEXT STEPS ── */}
      <div className="bg-gradient-to-br from-[#0b1a30] to-[#090910] border border-[#1e4068] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center shrink-0">
            <BookOpen className="w-4.5 h-4.5 text-[#38bdf8]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Ready to dive deeper?</h3>
            <p className="text-[12.5px] text-[#71717a] mt-0.5 leading-relaxed">Explore the CLI reference for all available commands, or launch ThreatLensGO to start an interactive security session.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => onNavigate && onNavigate("cli")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#7dd3fc] text-[#04101c] text-sm font-bold transition-all cursor-pointer">
            <Terminal className="w-3.5 h-3.5" /> CLI & Local Agent
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onNavigate && onNavigate("repositories")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-white text-sm font-semibold transition-all cursor-pointer">
            <FolderGit2 className="w-3.5 h-3.5" /> Browse Repositories
          </button>
        </div>
      </div>
    </div>
  );
}
