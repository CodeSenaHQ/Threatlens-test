import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Users, KeyRound, Wifi, ShieldCheck, AlertTriangle,
  Activity, TrendingUp, Clock, Globe
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MetricCard } from "./MetricCard";
import { SeverityBadge } from "./SeverityBadge";
import { useAuth } from "@/contexts/AuthContext";
import { authApi, secTestApi } from "@/lib/api";

const SEVERITY_COLORS = {
  critical: "#f43f5e",
  high: "#fb923c",
  medium: "#facc15",
  low: "#38bdf8",
  info: "#64748b",
};

// Fallback sample findings when SecTest is offline
const FALLBACK_FINDINGS = [
  {
    id: "SEC-8041",
    module: "injection",
    title: "SQL Injection Vector in User Query Filter",
    severity: "critical",
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
    explanation: "Publicly accessible OpenAPI schema exposes internal endpoint schemas and parameter data types.",
    remediation: "Restrict OpenAPI and Swagger UI access to authenticated administrators in production.",
    evidence: "HTTP 200 OK received at /openapi.json.",
    diffSnippet: "- app = FastAPI(docs_url='/docs', openapi_url='/openapi.json')\n+ app = FastAPI(docs_url=None if IS_PROD else '/docs')",
    meta: { endpoint: "GET /openapi.json", cwe: "CWE-200", proof_hash: "0x66de1209871029384729102837461928" }
  },
];

export default function OverviewView({ onSelectFinding }) {
  const { token, user } = useAuth();
  const [counts, setCounts] = useState(null);
  const [pulse, setPulse] = useState(null);
  const [scanReport, setScanReport] = useState(null);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [loadingPulse, setLoadingPulse] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch pulse (public)
      try {
        const p = await authApi.getPulse();
        setPulse(p);
      } catch { setPulse(null); }
      setLoadingPulse(false);

      // Fetch counts (requires auth)
      if (token) {
        try {
          const c = await authApi.getCounts(token);
          setCounts(c);
        } catch { setCounts(null); }
      }
      setLoadingCounts(false);

      // Fetch SecTest report
      const report = await secTestApi.getReport();
      setScanReport(report);
    };
    fetchData();
  }, [token]);

  // Live telemetry canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let time = 0;
    const dataBlue = Array(50).fill(55);
    const dataGreen = Array(50).fill(40);

    const render = () => {
      time += 0.04;
      dataBlue.shift();
      dataBlue.push(60 + Math.sin(time * 1.1) * 20 + Math.random() * 6);
      dataGreen.shift();
      dataGreen.push(45 + Math.cos(time * 0.8) * 15 + Math.random() * 4);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      const drawLine = (data, color, fill) => {
        const step = w / (data.length - 1);
        ctx.beginPath();
        data.forEach((v, i) => {
          const y = h - (v / 110) * h;
          i === 0 ? ctx.moveTo(0, y) : ctx.lineTo(i * step, y);
        });
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = fill; ctx.fill();
        ctx.beginPath();
        data.forEach((v, i) => {
          const y = h - (v / 110) * h;
          i === 0 ? ctx.moveTo(0, y) : ctx.lineTo(i * step, y);
        });
        ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
      };

      drawLine(dataBlue, "#4d8eff", "rgba(77,142,255,0.06)");
      drawLine(dataGreen, "#22c55e", "rgba(34,197,94,0.04)");
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const findings = scanReport?.findings || FALLBACK_FINDINGS;
  const summary = scanReport?.summary || {
    total: findings.length,
    by_severity: {
      critical: findings.filter(f => f.severity === "critical").length,
      high: findings.filter(f => f.severity === "high").length,
      medium: findings.filter(f => f.severity === "medium").length,
      low: findings.filter(f => f.severity === "low").length,
      info: findings.filter(f => f.severity === "info").length,
    }
  };

  const severityChartData = Object.entries(summary.by_severity || {})
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: SEVERITY_COLORS[key] || "#64748b",
    }));

  const isBackendOnline = pulse?.status === "healthy" || pulse?.state === "active";

  return (
    <div className="space-y-6">
      {/* System status bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-3 px-4 rounded-xl bg-[#0a0d15] border border-white/[0.06]"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isBackendOnline ? "bg-[#22c55e] shadow-[0_0_8px_#22c55e]" : "bg-[#f43f5e]"}`} />
          <span className="text-xs font-medium text-[#94a3b8]">
            System Status:
            <span className={`ml-1.5 font-semibold ${isBackendOnline ? "text-[#4ade80]" : "text-[#f43f5e]"}`}>
              {isBackendOnline ? "All Systems Operational" : "Backend Offline"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#475569]">
          {pulse?.system_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {new Date(pulse.system_time).toLocaleTimeString()}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            Engine v2.4
          </span>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          label="Total Accounts"
          value={counts?.accounts ?? "—"}
          sublabel="Registered users across all roles"
          accentColor="#4d8eff"
          delay={0}
        />
        <MetricCard
          icon={KeyRound}
          label="Active Sessions"
          value={counts?.sessions ?? "—"}
          sublabel="Device tokens currently active"
          accentColor="#22c55e"
          delay={0.05}
        />
        <MetricCard
          icon={Wifi}
          label="OAuth Links"
          value={counts?.oauth ?? "—"}
          sublabel="Google & GitHub connections"
          accentColor="#a78bfa"
          delay={0.1}
        />
        <MetricCard
          icon={AlertTriangle}
          label="Vulnerabilities"
          value={summary.total}
          sublabel={`${summary.by_severity?.critical || 0} critical · ${summary.by_severity?.high || 0} high`}
          accentColor={summary.by_severity?.critical > 0 ? "#f43f5e" : "#fb923c"}
          delay={0.15}
        />
      </div>

      {/* Middle: Telemetry chart + Severity distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Telemetry chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.06] space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#4d8eff]/10 border border-[#4d8eff]/20 text-[#4d8eff]">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Network Telemetry</h3>
                <p className="text-[11px] text-[#475569]">Request throughput & response health</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-[#475569]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-0.5 rounded bg-[#4d8eff]" />Traffic</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-0.5 rounded bg-[#22c55e]" />Uptime</span>
            </div>
          </div>
          <div className="w-full h-44 bg-[#06080d] rounded-xl border border-white/[0.04] p-2 overflow-hidden">
            <canvas ref={canvasRef} width={800} height={170} className="w-full h-full block" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="text-[10px] text-[#475569]">Avg Throughput</div>
              <div className="text-xs font-bold text-white font-mono mt-0.5">1,480 req/s</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="text-[10px] text-[#475569]">Response Latency</div>
              <div className="text-xs font-bold text-[#4ade80] font-mono mt-0.5">14.2 ms</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="text-[10px] text-[#475569]">Uptime</div>
              <div className="text-xs font-bold text-white font-mono mt-0.5">99.98%</div>
            </div>
          </div>
        </motion.div>

        {/* Severity distribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.06] space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#f43f5e]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Severity Breakdown</h3>
              <p className="text-[11px] text-[#475569]">{summary.total} total findings</p>
            </div>
          </div>

          {severityChartData.length > 0 ? (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityChartData} barCategoryGap="25%">
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#0a0d15", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 11 }}
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {severityChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-[#475569] text-xs">
              No findings detected
            </div>
          )}

          <div className="space-y-1.5">
            {Object.entries(summary.by_severity || {}).map(([sev, count]) => (
              <div key={sev} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm" style={{ background: SEVERITY_COLORS[sev] }} />
                  <span className="text-[#8a99ad] capitalize">{sev}</span>
                </span>
                <span className="font-mono font-semibold text-white">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent findings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.06] space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Security Findings</h3>
            <p className="text-[11px] text-[#475569]">
              {scanReport ? "Live from SecTest scanner" : "Sample data — scanner offline"}
            </p>
          </div>
          {!scanReport && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#facc15]/10 text-[#fde047] border border-[#facc15]/20">
              Offline
            </span>
          )}
        </div>

        <div className="space-y-2">
          {findings.slice(0, 5).map((f, i) => (
            <button
              key={i}
              onClick={() => onSelectFinding?.(f)}
              className="w-full text-left p-3.5 rounded-xl bg-[#06080d] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white group-hover:text-[#93c5fd] transition-colors truncate">
                    {f.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#475569]">
                    {(f.meta?.cwe || f.cwe) && (
                      <span className="font-mono">{f.meta?.cwe || f.cwe}</span>
                    )}
                    {(f.meta?.endpoint || f.endpoint) && (
                      <>
                        <span className="text-[#334155]">·</span>
                        <span className="font-mono truncate">{f.meta?.endpoint || f.endpoint}</span>
                      </>
                    )}
                  </div>
                </div>
                <SeverityBadge severity={f.severity} />
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
