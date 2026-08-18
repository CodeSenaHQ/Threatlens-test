import React, { useState } from "react";
import {
  ShieldAlert,
  Zap,
  Play,
  Copy,
  Check,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Code,
} from "lucide-react";
import { toast } from "sonner";

export default function LiveFindingsTab({ onInspectFinding }) {
  const [targetUrl, setTargetUrl] = useState("http://localhost:8000");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedModule, setSelectedModule] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  const findings = [
    {
      id: "FND-1045",
      severity: "critical",
      title: "SQL Injection Vector in User Search Query",
      module: "injection",
      cwe: "CWE-89",
      cvss: 9.8,
      endpoint: "POST /api/v1/users/search",
      proofHash: "0x9f4a8b2c1d3e5f7a",
      evidence: "Payload: ' OR '1'='1 returned HTTP 200 with 150 rows instead of 1.",
      explanation: "Direct concatenation of search term parameter into raw SQL execution statement.",
      remediation: "Replace raw interpolation with SQLAlchemy or asyncpg parameterized bind variables.",
      time: "4 mins ago",
    },
    {
      id: "FND-0990",
      severity: "high",
      title: "Missing Content-Security-Policy (CSP) Header",
      module: "headers",
      cwe: "CWE-693",
      cvss: 7.5,
      endpoint: "GET /repo",
      proofHash: "0x4b7e1a9c3d2f5a8e",
      evidence: "Response headers lack CSP directive, exposing application to Cross-Site Scripting (XSS).",
      explanation: "No Content-Security-Policy or script-src restriction specified on HTTP responses.",
      remediation: "Configure header: 'Content-Security-Policy: default-src \\'self\\'; script-src \\'self\\' https://cdn.threatlens.io'.",
      time: "15 mins ago",
    },
    {
      id: "FND-0846",
      severity: "high",
      title: "Verbose Stack Trace & Internal System Leak",
      module: "exposure",
      cwe: "CWE-209",
      cvss: 7.2,
      endpoint: "POST /repo/commit/analysis",
      proofHash: "0x7a3e5c9b1f2d4a8e",
      evidence: "HTTP 500 payload includes local file system absolute paths and Python package versions.",
      explanation: "Uncaught exceptions dump full Python traceback to client in production mode.",
      remediation: "Implement generic global exception handler returning sanitized JSON errors.",
      time: "1 hour ago",
    },
    {
      id: "FND-1021",
      severity: "medium",
      title: "No Rate Limiting on Authentication & OTP Endpoints",
      module: "ratelimit",
      cwe: "CWE-799",
      cvss: 5.8,
      endpoint: "POST /tc-auth/login/password",
      proofHash: "0x2c5e8a1b3d9f4a7e",
      evidence: "100 consecutive login attempts executed in 2.4 seconds without HTTP 429 throttling.",
      explanation: "Endpoint does not enforce sliding-window request throttling.",
      remediation: "Configure Redis token-bucket rate limiter: max 5 requests / 60 seconds per IP.",
      time: "2 hours ago",
    },
    {
      id: "FND-0777",
      severity: "medium",
      title: "Weak JWT Algorithm Validation (Alg: none)",
      module: "auth",
      cwe: "CWE-347",
      cvss: 5.4,
      endpoint: "GET /tc-auth/me",
      proofHash: "0x1d4a7c2b5e8f9a3e",
      evidence: "JWT token with alg:none is decoded without cryptographic signature verification.",
      explanation: "Token validation allows arbitrary unauthenticated claim forging.",
      remediation: "Explicitly enforce HS256/RS256 algorithm whitelist in PyJWT decode call.",
      time: "3 hours ago",
    },
    {
      id: "FND-0612",
      severity: "info",
      title: "Server Banner Discloses Server Framework Details",
      module: "headers",
      cwe: "CWE-200",
      cvss: 2.1,
      endpoint: "GET /tc-auth/config/pulse",
      proofHash: "0x8e2b5a1c3d9f4a7e",
      evidence: "Response header 'server: uvicorn/0.30.6' detected.",
      explanation: "Server banner exposes backend framework version to attackers.",
      remediation: "Disable server header in Uvicorn ASGI server initialization.",
      time: "Yesterday",
    },
  ];

  const filteredFindings = findings.filter((f) => {
    return selectedModule === "all" || f.module.toLowerCase() === selectedModule.toLowerCase();
  });

  const handleTriggerProbe = () => {
    setIsScanning(true);
    toast.info(`Launching SecTest DAST penetration suite against ${targetUrl}...`);
    setTimeout(() => {
      setIsScanning(false);
      toast.success("SecTest dynamic audit complete! 6 findings indexed with cryptographic proof receipts.");
    }, 2000);
  };

  const handleCopyProof = (hash, id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    toast.success(`Proof hash ${hash} copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-7">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-white">Live SecTest Findings</h1>
          <p className="text-xs text-[#8a99ad] mt-1 font-mono">
            GET :8765/report.json · live DAST penetration prober, cryptographic proof hashes & remediation recipes
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => toast.success("Exported SecTest penetration report (PDF / JSON)")}
            className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DAST Report</span>
          </button>
        </div>
      </div>

      {/* Target URL Prober Control Bar */}
      <div className="p-4 rounded-xl bg-[#10151a] border border-[#263544] shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#38bdf8]" />
            <span>Target Endpoint:</span>
          </span>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="e.g. http://localhost:8000"
            className="flex-1 px-3.5 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-xs font-mono text-[#38bdf8] focus:border-[#38bdf8] focus:outline-none"
          />
        </div>

        <button
          onClick={handleTriggerProbe}
          disabled={isScanning}
          className="px-5 py-2 rounded-lg border border-[#38bdf8] bg-[#38bdf8] text-[#04140c] font-bold text-xs font-mono hover:brightness-110 shadow-[0_0_16px_rgba(56,189,248,0.4)] flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isScanning ? "Probing Target..." : "Launch Live Probe"}</span>
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#ff4d4f] shadow-[0_0_10px_#ff4d4f]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Critical Vulnerabilities</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#ff4d4f]">1 Detected</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">CWE-89 (SQL Injection)</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#ff9a3c] shadow-[0_0_10px_#ff9a3c]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">High Severity</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#ff9a3c]">2 Flagged</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Missing CSP, Stack Leak</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#f2c94c] shadow-[0_0_10px_#f2c94c]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Medium Severity</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#f2c94c]">2 Flagged</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Rate Limit, JWT Alg</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Daemon Status</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#38bdf8]">ONLINE :8765</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">5/5 modules armed</div>
        </div>
      </div>

      {/* Module Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["all", "injection", "headers", "exposure", "ratelimit", "auth"].map((mod) => (
          <button
            key={mod}
            onClick={() => setSelectedModule(mod)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-semibold transition-all shrink-0 ${
              selectedModule === mod
                ? "bg-[#38bdf8] text-[#04140c] font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                : "bg-[#10151a] border border-[#283747] text-[#8a99ad] hover:text-white"
            }`}
          >
            {mod === "all" ? "All Modules (6)" : mod}
          </button>
        ))}
      </div>

      {/* Findings Table */}
      <div className="bg-[#10151a] border border-[#263544] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between p-3.5 px-4.5 border-b border-[#253240] bg-[#12181f]/60">
          <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Detected Vulnerabilities & Exploits
          </h2>
          <div className="font-mono text-[10px] text-[#8a99ad]">GET :8765/report.json</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#253240] text-[10px] font-mono uppercase tracking-wider text-[#8a99ad] bg-[#0c1015]">
                <th className="py-3 px-4.5">Severity</th>
                <th className="py-3 px-4.5">Finding & Payload Proof</th>
                <th className="py-3 px-4.5">Module / CWE</th>
                <th className="py-3 px-4.5">Endpoint / Proof Hash</th>
                <th className="py-3 px-4.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222e3a]">
              {filteredFindings.map((f) => {
                const isCrit = f.severity === "critical";
                const isHigh = f.severity === "high";
                const isMed = f.severity === "medium";
                const color = isCrit ? "#ff4d4f" : isHigh ? "#ff9a3c" : isMed ? "#f2c94c" : "#38bdf8";

                return (
                  <tr
                    key={f.id}
                    onClick={() => onInspectFinding && onInspectFinding(f)}
                    className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4.5 align-top">
                      <span
                        className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap font-bold"
                        style={{
                          color: color,
                          borderColor: color,
                          backgroundColor: `${color}14`,
                        }}
                      >
                        {f.severity}
                      </span>
                    </td>

                    <td className="py-3 px-4.5 align-top min-w-[260px]">
                      <div className="font-semibold text-white">{f.title}</div>
                      <div className="font-mono text-[#8a99ad] text-[10.5px] mt-0.5">{f.evidence}</div>
                    </td>

                    <td className="py-3 px-4.5 align-top font-mono text-[11px] text-[#d8e2e8]">
                      <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] mr-2">
                        {f.module}
                      </span>
                      <span className="text-[#8a99ad]">{f.cwe}</span>
                    </td>

                    <td className="py-3 px-4.5 align-top font-mono text-[11px]">
                      <div className="text-[#d8e2e8]">{f.endpoint}</div>
                      <button
                        onClick={(e) => handleCopyProof(f.proofHash, f.id, e)}
                        className="text-[10px] text-[#38bdf8] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span>{f.proofHash}</span>
                        {copiedId === f.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-[#8a99ad]" />}
                      </button>
                    </td>

                    <td className="py-3 px-4.5 align-top text-right font-mono">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectFinding && onInspectFinding(f);
                        }}
                        className="px-3 py-1 rounded bg-[#141b21] hover:bg-[#1a232b] border border-[#2b3947] text-xs text-[#38bdf8] hover:text-white transition-colors"
                      >
                        Inspect
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
