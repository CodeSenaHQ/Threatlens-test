import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Zap,
  Play,
  Copy,
  Check,
  Search,
  Download,
  ExternalLink,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { secTestApi, severityColor, timeAgo } from "@/lib/api";

export default function LiveFindingsTab({ onInspectFinding }) {
  const [targetUrl, setTargetUrl] = useState("http://localhost:8000");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedModule, setSelectedModule] = useState("all");
  const [copiedId, setCopiedId] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const data = await secTestApi.getReport();
      setReport(data);
      setLoading(false);
    };
    fetchReport();
  }, []);

  const findings = report?.findings || [];
  const summary = report?.summary?.by_severity || {};
  const scannerOnline = report !== null;

  // Get unique modules
  const modules = ["all", ...new Set(findings.map((f) => f.module))];

  const filteredFindings = findings.filter((f) => {
    return selectedModule === "all" || f.module?.toLowerCase() === selectedModule.toLowerCase();
  });

  const handleTriggerProbe = async () => {
    setIsScanning(true);
    toast.info(`Launching SecTest DAST penetration suite against ${targetUrl}...`);
    // Re-fetch the report after a delay (simulating probe time)
    setTimeout(async () => {
      const data = await secTestApi.getReport();
      setReport(data);
      setIsScanning(false);
      if (data) {
        toast.success(`SecTest audit complete! ${data.findings?.length || 0} findings indexed.`);
      } else {
        toast.error("SecTest scanner is offline — could not fetch results.");
      }
    }, 3000);
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
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Live SecTest Findings</h1>
          <p className="text-xs text-[#8a99ad] mt-1">
            GET :8765/report.json · live DAST penetration prober
            {report?.scanned_at ? ` · scanned ${timeAgo(report.scanned_at)}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => {
              if (report) {
                const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "sectest_report.json";
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Exported SecTest report (JSON)");
              }
            }}
            className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all cursor-pointer flex items-center gap-2 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DAST Report</span>
          </button>
          <a
            href="http://localhost:8765/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all flex items-center gap-2 font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>HTML Report</span>
          </a>
        </div>
      </div>

      {/* Target URL Prober Control Bar */}
      <div className="p-4 rounded-xl bg-[#10151a] border border-[#263544] shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <span className="text-xs font-bold text-white uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#6EA8DA]" />
            <span>Target Endpoint:</span>
          </span>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="e.g. http://localhost:8000"
            className="flex-1 px-3.5 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-xs font-mono text-[#6EA8DA] focus:border-[#6EA8DA] focus:outline-none"
          />
        </div>

        <button
          onClick={handleTriggerProbe}
          disabled={isScanning}
          className="px-5 py-2 rounded-lg bg-[#2962FF] hover:bg-[#1e4ed8] text-white font-semibold text-xs shadow-[0_0_15px_rgba(41,98,255,0.35)] flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isScanning ? "Probing Target..." : "Launch Live Probe"}</span>
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#C8A27A]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-semibold">Critical Vulnerabilities</div>
          <div className="text-xl font-bold mt-1.5 text-[#C8A27A]">{loading ? "…" : `${summary.critical || 0} Detected`}</div>
          <div className="text-[11px] text-[#8a99ad] mt-1">highest severity</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#6EA8DA]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-semibold">High Severity</div>
          <div className="text-xl font-bold mt-1.5 text-[#6EA8DA]">{loading ? "…" : `${summary.high || 0} Flagged`}</div>
          <div className="text-[11px] text-[#8a99ad] mt-1">requires attention</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#2C6CB0]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-semibold">Medium + Low</div>
          <div className="text-xl font-bold mt-1.5 text-[#2C6CB0]">{loading ? "…" : `${(summary.medium || 0) + (summary.low || 0)} Flagged`}</div>
          <div className="text-[11px] text-[#8a99ad] mt-1">lower priority</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px]" style={{ backgroundColor: scannerOnline ? "#6EA8DA" : "#C8A27A" }} />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-semibold">Daemon Status</div>
          <div className={`text-xl font-bold mt-1.5 ${scannerOnline ? "text-[#6EA8DA]" : "text-[#C8A27A]"}`}>
            {scannerOnline ? "ONLINE :8765" : "OFFLINE"}
          </div>
          <div className="text-[11px] text-[#8a99ad] mt-1">
            {scannerOnline ? `${report?.summary?.total || 0} findings total` : "scanner unreachable"}
          </div>
        </div>
      </div>

      {/* Module Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {modules.map((mod) => (
          <button
            key={mod}
            onClick={() => setSelectedModule(mod)}
            className={`px-3 py-1.5 rounded-lg text-xs uppercase font-semibold transition-all shrink-0 cursor-pointer ${
              selectedModule === mod
                ? "bg-[#2962FF] hover:bg-[#1e4ed8] text-white font-bold shadow-[0_0_15px_rgba(41,98,255,0.35)]"
                : "bg-[#10151a] border border-[#283747] text-[#8a99ad] hover:text-white"
            }`}
          >
            {mod === "all" ? `All Modules (${findings.length})` : mod}
          </button>
        ))}
      </div>

      {/* Findings Table */}
      {!scannerOnline && !loading ? (
        <div className="text-center py-16">
          <WifiOff className="w-8 h-8 mx-auto text-[#C8A27A] mb-3" />
          <p className="text-sm text-[#8a99ad]">SecTest scanner is offline</p>
          <p className="text-xs text-[#6f8390] mt-1">Start the scanner on port 8765 to see live vulnerability findings</p>
        </div>
      ) : (
        <div className="bg-[#10151a] border border-[#263544] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between p-3.5 px-4.5 border-b border-[#253240] bg-[#12181f]/60">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Detected Vulnerabilities & Exploits
            </h2>
            <div className="font-mono text-[10px] text-[#8a99ad]">GET :8765/report.json</div>
          </div>

          {report?.errors?.length > 0 && (
            <div className="px-4.5 py-2 bg-[#ff9a3c]/10 border-b border-[#ff9a3c]/30 font-mono text-xs text-[#ff9a3c]">
              ⚠ Scan may be incomplete — {report.errors.length} error(s) occurred during probing
            </div>
          )}

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
                {filteredFindings.map((f, i) => {
                  const color = severityColor(f.severity);
                  return (
                    <tr
                      key={i}
                      onClick={() => onInspectFinding && onInspectFinding({
                        title: f.title,
                        severity: f.severity,
                        module: f.module,
                        endpoint: f.meta?.endpoint,
                        evidence: f.evidence,
                        explanation: f.explanation,
                        remediation: f.remediation,
                      })}
                      className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4.5 align-top">
                        <span
                          className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap font-bold"
                          style={{
                            color,
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
                        <span className="text-[#8a99ad]">{f.meta?.cwe || ""}</span>
                      </td>

                      <td className="py-3 px-4.5 align-top font-mono text-[11px]">
                        <div className="text-[#d8e2e8]">{f.meta?.endpoint || ""}</div>
                        {f.meta?.proof_hash && (
                          <button
                            onClick={(e) => handleCopyProof(f.meta.proof_hash, i, e)}
                            className="text-[10px] text-[#38bdf8] hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>{f.meta.proof_hash}</span>
                            {copiedId === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-[#8a99ad]" />}
                          </button>
                        )}
                      </td>

                      <td className="py-3 px-4.5 align-top text-right font-mono">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectFinding && onInspectFinding({
                              title: f.title,
                              severity: f.severity,
                              module: f.module,
                              endpoint: f.meta?.endpoint,
                              evidence: f.evidence,
                              explanation: f.explanation,
                              remediation: f.remediation,
                            });
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
      )}
    </div>
  );
}
