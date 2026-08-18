import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FolderLock,
  ShieldAlert,
  ShieldCheck,
  FileCode,
  Globe,
  Plus,
  LayoutGrid,
  ListFilter,
  MoreHorizontal,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Bug,
  Zap,
  Lock,
  Search
} from "lucide-react";
import { QuickAccessCards } from "./QuickAccessCards";
import { SeverityBadge } from "./SeverityBadge";
import { useAuth } from "@/contexts/AuthContext";
import { authApi, secTestApi } from "@/lib/api";

const FALLBACK_FINDINGS = [
  {
    id: "SEC-8041",
    module: "injection",
    title: "SQL Injection Vector in User Query Filter",
    severity: "critical",
    status: "active",
    sharing: "Public",
    size: "150 rows",
    date: "Yesterday",
    icon: Bug,
    explanation: "Unsanitized user input string was concatenated directly into PostgreSQL query builder clause allowing arbitrary database dump.",
    remediation: "Replace raw string template with parameterized prepared statement binding.",
    evidence: "Payload: ' OR '1'='1 returned HTTP 200 with 150 rows instead of 1.",
    diffSnippet: "- const query = `SELECT * FROM users WHERE org_id = '${req.body.orgId}'`;\n+ const query = `SELECT * FROM users WHERE org_id = $1`;",
    meta: { endpoint: "POST /api/v1/users/search", cwe: "CWE-89", proof_hash: "0x9f4a7c2e88b13904a0ef1982bca48192a0e" }
  },
  {
    id: "SEC-8042",
    module: "ratelimit",
    title: "Lack of Rate Limiting on Login Endpoint",
    severity: "high",
    status: "mitigated",
    sharing: "Public",
    size: "100 req/s",
    date: "Yesterday",
    icon: Zap,
    explanation: "Endpoint allowed 100 consecutive requests in 3 seconds without returning HTTP 429.",
    remediation: "Implement sliding window IP rate limiter (5 attempts / 60 seconds) with Redis or memory store.",
    evidence: "100/100 requests returned status 401 instead of 429.",
    diffSnippet: "+ app.use('/tc-auth/login', rateLimiter({ max: 5, windowMs: 60000 }));",
    meta: { endpoint: "POST /tc-auth/login/password", cwe: "CWE-307", proof_hash: "0x4e21a8d011f592cb1475e330a8901f44" }
  },
  {
    id: "SEC-8043",
    module: "auth",
    title: "Unauthenticated Access to Debug Status Endpoint",
    severity: "high",
    status: "active",
    sharing: "Internal",
    size: "12.4 KB",
    date: "Apr 2, 2026",
    icon: Lock,
    explanation: "Endpoint returned system metrics and environment details without validating Bearer token.",
    remediation: "Wrap route handler with AuthDeps dependency to require valid session token.",
    evidence: "HTTP 200 OK received without Authorization header.",
    diffSnippet: "- @router.get('/debug')\n+ @router.get('/debug', dependencies=[Depends(require_auth)])",
    meta: { endpoint: "GET /api/internal/debug", cwe: "CWE-306", proof_hash: "0x7b19df33501a2ce08914efb900234acb" }
  },
  {
    id: "SEC-8044",
    module: "headers",
    title: "Missing Strict-Transport-Security (HSTS) Header",
    severity: "medium",
    status: "verified",
    sharing: "Public",
    size: "4 KB",
    date: "Oct 12, 2025",
    icon: Globe,
    explanation: "The HTTP response does not enforce HTTPS connections via HSTS, making clients vulnerable to SSL stripping.",
    remediation: "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' to response headers.",
    evidence: "Strict-Transport-Security header missing from response.",
    diffSnippet: "+ res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');",
    meta: { endpoint: "GET /tc-auth/config/pulse", cwe: "CWE-319", proof_hash: "0x1a88cf02931084ef77609a019488b710" }
  },
  {
    id: "SEC-8045",
    module: "exposure",
    title: "Exposed Sensitive Route: /openapi.json",
    severity: "low",
    status: "verified",
    sharing: "Public",
    size: "14 KB",
    date: "Oct 12, 2025",
    icon: FileCode,
    explanation: "Publicly accessible OpenAPI schema exposes internal endpoint schemas and parameter data types.",
    remediation: "Restrict OpenAPI and Swagger UI access to authenticated administrators in production.",
    evidence: "HTTP 200 OK received at /openapi.json.",
    diffSnippet: "- app = FastAPI(docs_url='/docs', openapi_url='/openapi.json')\n+ app = FastAPI(docs_url=None if IS_PROD else '/docs')",
    meta: { endpoint: "GET /openapi.json", cwe: "CWE-200", proof_hash: "0x66de1209871029384729102837461928" }
  },
];

export default function OverviewView({ onSelectItem, selectedItem, onRunAudit, isAuditing }) {
  const { token } = useAuth();
  const [scanReport, setScanReport] = useState(null);
  const [activeCard, setActiveCard] = useState("repo");
  const [viewMode, setViewMode] = useState("list");
  const [filterModule, setFilterModule] = useState("all");

  useEffect(() => {
    secTestApi.getReport().then(r => setScanReport(r)).catch(() => {});
  }, []);

  const rawFindings = scanReport?.findings || FALLBACK_FINDINGS;
  const findings = rawFindings.map((f, i) => ({
    ...FALLBACK_FINDINGS[i % FALLBACK_FINDINGS.length],
    ...f,
  }));

  const filteredFindings = findings.filter(f => {
    if (filterModule === "all") return true;
    return f.module === filterModule;
  });

  return (
    <div className="space-y-6">
      {/* Quick Access 4-Card Section */}
      <QuickAccessCards
        activeCard={activeCard}
        onSelectCard={(cardId) => setActiveCard(cardId)}
      />

      {/* Main Explorer Panel Card */}
      <div className="rounded-2xl bg-[#0a0d15] border border-white/[0.07] overflow-hidden shadow-2xl">
        {/* Panel Header with Breadcrumbs & Action Buttons */}
        <div className="p-4 sm:px-6 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#8a99ad] hover:text-white cursor-pointer">SOC</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#475569]" />
            <span className="text-[#8a99ad] hover:text-white cursor-pointer">ThreatLens Engine</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#475569]" />
            <span className="text-white font-bold">Security Findings</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#2546ff]/30 text-white"
                    : "text-[#64748b] hover:text-white"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-[#2546ff]/30 text-white"
                    : "text-[#64748b] hover:text-white"
                }`}
                title="List View"
              >
                <ListFilter className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Action Button: + Run Live Scan */}
            <button
              onClick={onRunAudit}
              disabled={isAuditing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2546ff] hover:bg-[#1d3bef] text-white text-xs font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(37,70,255,0.25)] border border-white/10 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAuditing ? "Scanning..." : "Run Audit"}</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-[#64748b] text-[11px] font-mono select-none">
                <th className="py-3 px-5 font-semibold">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                    <span>Name</span>
                    <span className="text-[10px]">▼</span>
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Severity</th>
                <th className="py-3 px-4 font-semibold">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                    <span>Evidence / Scope</span>
                    <span className="text-[10px]">▼</span>
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                    <span>Timestamp</span>
                    <span className="text-[10px]">▼</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredFindings.map((item, idx) => {
                const Icon = item.icon || ShieldAlert;
                const isSelected = selectedItem?.title === item.title;
                return (
                  <tr
                    key={item.id || idx}
                    onClick={() => onSelectItem?.(item)}
                    className={`cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "bg-[#2546ff]/15 border-l-2 border-l-[#4d8eff]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Item Icon & Title */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            item.severity === "critical"
                              ? "bg-[#f43f5e]/15 text-[#fb7185]"
                              : item.severity === "high"
                              ? "bg-[#fb923c]/15 text-[#fdba74]"
                              : "bg-[#2546ff]/15 text-[#93c5fd]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate text-xs">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-[#64748b] font-mono truncate">
                            {item.meta?.endpoint || item.endpoint}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Pill */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/[0.04] text-[#8a99ad] border border-white/[0.06]">
                        {item.module || "core"}
                      </span>
                    </td>

                    {/* Severity Badge */}
                    <td className="py-3 px-4">
                      <SeverityBadge severity={item.severity} />
                    </td>

                    {/* Evidence Scope */}
                    <td className="py-3 px-4 font-mono text-[11px] text-[#8a99ad] truncate max-w-[140px]">
                      {item.size || "1 item"}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-[11px] text-[#64748b] whitespace-nowrap">
                      {item.date || "Yesterday"}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem?.(item);
                        }}
                        className="p-1 rounded-lg text-[#64748b] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
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
