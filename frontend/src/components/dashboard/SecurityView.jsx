import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Filter, Download, ExternalLink, RefreshCw, Search } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";
import { secTestApi } from "@/lib/api";

const FALLBACK_FINDINGS = [
  {
    module: "injection", title: "SQL Injection Vector in User Query Filter", severity: "critical",
    explanation: "Unsanitized user input string was concatenated directly into PostgreSQL query builder clause allowing arbitrary database dump.",
    remediation: "Replace raw string template with parameterized Prisma / pg-promise prepared statement binding.",
    evidence: "Payload: ' OR '1'='1 returned HTTP 200 with 150 rows instead of 1.",
    meta: { endpoint: "POST /api/v1/users/search", cwe: "CWE-89", proof_hash: "0x9f4a7c2e88b13904a0ef1982bca48192a0e" }
  },
  {
    module: "ratelimit", title: "Lack of Rate Limiting on Login Endpoint", severity: "high",
    explanation: "Endpoint allowed 100 consecutive requests in 3 seconds without returning HTTP 429.",
    remediation: "Implement sliding window IP rate limiter (5 attempts / 60 seconds) with Redis or memory store.",
    evidence: "100/100 requests returned status 401 instead of 429.",
    meta: { endpoint: "POST /tc-auth/login/password", cwe: "CWE-307" }
  },
  {
    module: "auth", title: "Unauthenticated Access to Debug Status Endpoint", severity: "high",
    explanation: "Endpoint returned system metrics and environment details without validating Bearer token.",
    remediation: "Wrap route handler with AuthDeps dependency to require valid session token.",
    evidence: "HTTP 200 OK received without Authorization header.",
    meta: { endpoint: "GET /api/internal/debug", cwe: "CWE-306" }
  },
  {
    module: "headers", title: "Missing Strict-Transport-Security (HSTS) Header", severity: "medium",
    explanation: "The HTTP response does not enforce HTTPS connections via HSTS, making clients vulnerable to SSL stripping.",
    remediation: "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' to response headers.",
    evidence: "Strict-Transport-Security header missing from response.",
    meta: { endpoint: "GET /tc-auth/config/pulse", cwe: "CWE-319" }
  },
  {
    module: "exposure", title: "Exposed Sensitive Route: /openapi.json", severity: "low",
    explanation: "Publicly accessible OpenAPI schema exposes internal endpoint schemas and parameter data types.",
    remediation: "Restrict OpenAPI and Swagger UI access to authenticated administrators in production.",
    evidence: "HTTP 200 OK received at /openapi.json.",
    meta: { endpoint: "GET /openapi.json", cwe: "CWE-200" }
  },
];

const MODULE_LABELS = {
  all: "All Findings",
  injection: "Injection",
  headers: "Headers",
  exposure: "Exposure",
  auth: "Auth",
  ratelimit: "Rate Limit",
};

export default function SecurityView({ onSelectFinding }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    const r = await secTestApi.getReport();
    setReport(r);
    setLoading(false);
  };

  useEffect(() => { fetchReport(); }, []);

  const findings = report?.findings || FALLBACK_FINDINGS;
  const summary = report?.summary || {
    total: findings.length,
    by_severity: {
      critical: findings.filter(f => f.severity === "critical").length,
      high: findings.filter(f => f.severity === "high").length,
      medium: findings.filter(f => f.severity === "medium").length,
      low: findings.filter(f => f.severity === "low").length,
      info: findings.filter(f => f.severity === "info").length,
    }
  };
  const isLive = !!report;

  const filteredFindings = findings.filter(f => {
    const matchesModule = activeModule === "all" || f.module === activeModule;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      f.title?.toLowerCase().includes(q) ||
      f.meta?.cwe?.toLowerCase().includes(q) ||
      f.meta?.endpoint?.toLowerCase().includes(q) ||
      f.module?.toLowerCase().includes(q);
    return matchesModule && matchesSearch;
  });

  // Get unique modules from findings
  const modules = ["all", ...new Set(findings.map(f => f.module).filter(Boolean))];

  return (
    <div className="space-y-5">
      {/* Summary header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.06] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#f43f5e]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Security Scanner Results</h2>
              <p className="text-xs text-[#475569]">
                {isLive ? (
                  <>Live from SecTest engine · Scanned {report.scanned_at ? new Date(report.scanned_at).toLocaleString() : "recently"}</>
                ) : (
                  "Scanner offline — showing sample vulnerability data"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] text-xs font-medium text-[#94a3b8] hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Re-scan
            </button>
            <button
              onClick={() => window.open("http://localhost:8765", "_blank")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] text-xs font-medium text-[#94a3b8] hover:text-white transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Report
            </button>
          </div>
        </div>

        {/* Severity summary pills */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(summary.by_severity || {}).map(([sev, count]) => (
            <div
              key={sev}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#06080d] border border-white/[0.04]"
            >
              <SeverityBadge severity={sev} />
              <span className="text-sm font-bold text-white font-mono">{count}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#06080d] border border-white/[0.04]">
            <span className="text-[11px] text-[#475569]">Total</span>
            <span className="text-sm font-bold text-white font-mono">{summary.total}</span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#475569]" />
          <input
            type="text"
            placeholder="Search by title, CWE, endpoint..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0d15] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#4d8eff]/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {modules.map(m => (
            <button
              key={m}
              onClick={() => setActiveModule(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                activeModule === m
                  ? "bg-[#2546ff]/15 text-[#93c5fd] border border-[#2546ff]/30"
                  : "bg-white/[0.03] text-[#64748b] border border-white/[0.04] hover:text-[#94a3b8] hover:border-white/[0.08]"
              }`}
            >
              {MODULE_LABELS[m] || m}
            </button>
          ))}
        </div>
      </div>

      {/* Findings list */}
      <div className="space-y-2.5">
        {filteredFindings.map((f, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onSelectFinding?.(f)}
            className="w-full text-left p-4 rounded-2xl bg-[#0a0d15] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2.5">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-xs font-semibold text-white group-hover:text-[#93c5fd] transition-colors truncate">
                    {f.title}
                  </span>
                </div>

                <p className="text-[11px] text-[#475569] line-clamp-2 leading-relaxed">
                  {f.explanation || f.description || "No description available."}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-[#334155]">
                  {f.meta?.endpoint && (
                    <span className="font-mono text-[#475569]">{f.meta.endpoint}</span>
                  )}
                  {f.meta?.cwe && (
                    <>
                      <span>·</span>
                      <span className="font-mono text-[#475569]">{f.meta.cwe}</span>
                    </>
                  )}
                  {f.module && (
                    <>
                      <span>·</span>
                      <span className="capitalize text-[#475569]">{f.module}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-[#334155] group-hover:text-[#64748b] transition-colors shrink-0 mt-1">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        ))}

        {filteredFindings.length === 0 && (
          <div className="py-16 text-center text-[#475569] text-sm">
            No findings match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
