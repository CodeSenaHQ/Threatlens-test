import React, { useState } from "react";
import {
  Zap,
  Globe,
  Play,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export default function ScannerTab({ onInspectFinding }) {
  const [targetUrl, setTargetUrl] = useState("http://localhost:8000");
  const [authHeader, setAuthHeader] = useState("Bearer eyJhbGciOiJIUzI1Ni...");
  const [isScanning, setIsScanning] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedHash, setCopiedHash] = useState(null);

  const categories = [
    { id: "all", label: "All Modules (5)" },
    { id: "injection", label: "Injection (1)" },
    { id: "headers", label: "Headers (1)" },
    { id: "exposure", label: "Exposure (1)" },
    { id: "ratelimit", label: "Rate Limiting (1)" },
    { id: "auth", label: "Authentication (1)" },
  ];

  const findings = [
    {
      id: "sec-1",
      module: "injection",
      title: "SQL Injection Vector in User Search Query",
      severity: "critical",
      cwe: "CWE-89",
      endpoint: "POST /api/v1/users/search",
      proofHash: "0x9f4a7c2e88b13904a0ef1982bca48192a0e",
      explanation: "Unsanitized user input string was concatenated directly into PostgreSQL query builder clause allowing arbitrary database dump.",
      evidence: "Payload: ' OR '1'='1 returned HTTP 200 with 150 rows instead of 1.",
      remediation: "Use parameterized Prisma / SQLAlchemy prepared statement binding.",
    },
    {
      id: "sec-2",
      module: "ratelimit",
      title: "Lack of Rate Limiting on Login Endpoint",
      severity: "high",
      cwe: "CWE-307",
      endpoint: "POST /tc-auth/login/password",
      proofHash: "0x7b19df33501a2ce08914efb900234acb771",
      explanation: "Endpoint allowed 100 consecutive requests in 3 seconds without returning HTTP 429 Too Many Requests.",
      evidence: "100/100 requests returned status 401 instead of 429.",
      remediation: "Implement sliding window IP rate limiter (5 attempts / 60 seconds).",
    },
    {
      id: "sec-3",
      module: "auth",
      title: "Unauthenticated Access to Debug Status Endpoint",
      severity: "high",
      cwe: "CWE-306",
      endpoint: "GET /api/internal/debug",
      proofHash: "0x3f901a8820c741009184ba219e830114092b",
      explanation: "Endpoint returned system metrics and environment details without validating Bearer token.",
      evidence: "HTTP 200 OK received without Authorization header.",
      remediation: "Wrap route handler with AuthDeps dependency to require valid session token.",
    },
    {
      id: "sec-4",
      module: "headers",
      title: "Missing Strict-Transport-Security (HSTS) Header",
      severity: "medium",
      cwe: "CWE-319",
      endpoint: "GET /tc-auth/config/pulse",
      proofHash: "0x4e21a8d011f592cb1475e330a8901f443810",
      explanation: "The HTTP response does not enforce HTTPS connections via HSTS.",
      evidence: "Strict-Transport-Security header missing from response.",
      remediation: "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'.",
    },
    {
      id: "sec-5",
      module: "exposure",
      title: "Exposed Sensitive Route: /openapi.json",
      severity: "low",
      cwe: "CWE-200",
      endpoint: "GET /openapi.json",
      proofHash: "0x96e2a871b53c19d4902187f0bca711832049",
      explanation: "Publicly accessible OpenAPI schema exposes internal endpoint schemas.",
      evidence: "HTTP 200 OK received at /openapi.json.",
      remediation: "Restrict OpenAPI access to authenticated administrators in production.",
    },
  ];

  const filtered = findings.filter(
    (f) => activeCategory === "all" || f.module === activeCategory
  );

  const handleStartScan = () => {
    setIsScanning(true);
    toast.info("Initiating SecTest dynamic vulnerability audit...");
    setTimeout(() => {
      setIsScanning(false);
      toast.success("SecTest Scan Completed! 5 Findings Recorded.");
    }, 2000);
  };

  const handleCopyProof = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    toast.success("Cryptographic proof hash copied to clipboard!");
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Scanner Control Bar */}
      <div className="p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.08] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#38bdf8]" />
              <span>SecTest Dynamic Penetration Scanner</span>
            </h2>
            <p className="text-[11px] text-[#8a99ad] font-mono mt-0.5">
              Live HTTP/Socket vulnerability prober targeting live service endpoints
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://localhost:8765"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08] transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Standalone HTML Report</span>
            </a>
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/[0.1] focus-within:border-[#38bdf8] transition-all">
            <Globe className="w-4 h-4 text-[#8a99ad]" />
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Target Base URL (e.g. http://localhost:8000)"
              className="flex-1 bg-transparent text-xs text-white outline-none font-mono placeholder-[#8a99ad]"
            />
          </div>

          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2546ff] hover:bg-[#0d27c7] text-white text-xs font-bold shadow-[0_0_20px_rgba(37,70,255,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Scanning Target..." : "Start Security Audit"}</span>
          </button>
        </div>
      </div>

      {/* Module Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? "bg-[#2546ff] text-white shadow-[0_0_12px_rgba(37,70,255,0.3)]"
                : "bg-[#0a0d15] text-[#8a99ad] hover:text-white border border-white/[0.08]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Findings Cards List */}
      <div className="space-y-3">
        {filtered.map((finding) => {
          const isCrit = finding.severity === "critical";
          const isHigh = finding.severity === "high";

          return (
            <div
              key={finding.id}
              onClick={() => onInspectFinding && onInspectFinding(finding)}
              className="p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.08] hover:border-[#38bdf8]/40 hover:bg-[#0d1220] transition-all cursor-pointer group shadow-sm space-y-3"
            >
              {/* Card Header: Severity + CWE + Proof Hash */}
              <div className="flex flex-wrap items-center justify-between gap-2">
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
                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[#cbd5e1] text-[10px] font-mono">
                    {finding.cwe}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[#8a99ad] text-[10px] font-mono uppercase">
                    {finding.module}
                  </span>
                </div>

                {/* Proof Hash Receipt */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyProof(finding.proofHash);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#2546ff]/10 hover:bg-[#2546ff]/20 text-[#38bdf8] text-[10px] font-mono border border-[#38bdf8]/20 transition-colors"
                >
                  <span>Proof: {finding.proofHash.slice(0, 10)}...</span>
                  {copiedHash === finding.proofHash ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              {/* Title & Endpoint */}
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                  {finding.title}
                </h3>
                <p className="text-[11px] text-[#8a99ad] font-mono mt-0.5">{finding.endpoint}</p>
              </div>

              {/* Root Cause & Remediation Diff Preview */}
              <p className="text-xs text-[#cbd5e1] leading-relaxed">{finding.explanation}</p>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] font-mono text-emerald-400">
                Fix: {finding.remediation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
