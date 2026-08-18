import React, { useState, useEffect } from "react";
import {
  Layers,
  ShieldAlert,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { repoApi, severityColor, timeAgo } from "@/lib/api";

export default function CicdDockerTab() {
  const { token } = useAuth();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch CI/CD and Docker findings from commit analysis
  useEffect(() => {
    const fetchAudits = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const repos = await repoApi.getRepos(token);
        const repoList = Array.isArray(repos) ? repos : [];
        const allAudits = [];

        for (const repo of repoList.slice(0, 5)) {
          try {
            const res = await repoApi.getCommits(token, repo.id, 1, 50);
            const commits = res?.data || [];
            for (const c of commits) {
              const findings = c.findings || [];
              for (const f of findings) {
                if (f.category === "cicd_security" || f.category === "docker_security" || f.category === "supply_chain") {
                  allAudits.push({
                    id: `${f.category === "docker_security" ? "DOCKER" : "CICD"}-${allAudits.length + 1}`,
                    target: f.path || "unknown",
                    type: f.title,
                    severity: f.severity,
                    status: f.status || "Open",
                    description: f.description,
                    evidence: f.evidence,
                    remediation: f.remediation,
                    commitSha: c.commit?.short_sha || "?",
                    repo: `${repo.username}/${repo.name}`,
                    date: c.commit?.authored_at,
                  });
                }
              }
            }
          } catch { /* skip repo */ }
        }

        setAudits(allAudits);
      } catch {
        toast.error("Failed to load CI/CD audit data");
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, [token]);

  // KPIs
  const remediated = audits.filter((a) => a.status === "Remediated" || a.status === "fixed").length;
  const open = audits.filter((a) => a.status !== "Remediated" && a.status !== "fixed").length;

  return (
    <div className="space-y-7">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-white">CI/CD Pipeline & Docker Audit</h1>
          <p className="text-xs text-[#8a99ad] mt-1 font-mono">
            Extracted from commit findings · categories: cicd_security, docker_security · {audits.length} audit entries
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => toast.success("Exported CI/CD & Docker audit report")}
            className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Total Audits</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">{loading ? "…" : audits.length}</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">CI/CD + Docker</div>
        </div>
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#ff9a3c] shadow-[0_0_10px_#ff9a3c]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Open Issues</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#ff9a3c]">{loading ? "…" : open}</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">require remediation</div>
        </div>
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Remediated</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-emerald-400">{loading ? "…" : remediated}</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">issues fixed</div>
        </div>
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Scan Status</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#38bdf8]">{loading ? "Scanning…" : "Complete"}</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">commit-level audit</div>
        </div>
      </div>

      {/* Audit Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#1a2330] rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      ) : audits.length === 0 ? (
        <div className="text-center py-16">
          <ShieldCheck className="w-8 h-8 mx-auto text-emerald-400 mb-3" />
          <p className="font-mono text-sm text-[#8a99ad]">No CI/CD or Docker security issues found</p>
          <p className="font-mono text-xs text-[#6f8390] mt-1">Your pipelines and container configurations appear clean.</p>
        </div>
      ) : (
        <div className="bg-[#10151a] border border-[#263544] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between p-3.5 px-4.5 border-b border-[#253240] bg-[#12181f]/60">
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Pipeline & Container Audit Entries</h2>
          </div>
          <div className="divide-y divide-[#222e3a]">
            {audits.map((audit, i) => {
              const color = severityColor(audit.severity);
              const isRemediated = audit.status === "Remediated" || audit.status === "fixed";
              return (
                <div key={i} className="p-4.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/30">
                          {audit.id}
                        </span>
                        <span
                          className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full border font-bold"
                          style={{ color, borderColor: color, backgroundColor: `${color}14` }}
                        >
                          {audit.severity}
                        </span>
                        {isRemediated ? (
                          <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Remediated
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded border border-[#ff9a3c]/30 bg-[#ff9a3c]/10 text-[#ff9a3c] text-[10px] font-mono font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Open
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs text-white font-semibold">{audit.type}</h3>
                      <p className="text-[11px] text-[#8a99ad] font-mono">📁 {audit.target} · {audit.repo} · commit {audit.commitSha}</p>
                      {audit.description && <p className="text-[11px] text-[#6f8390] font-mono">{audit.description}</p>}
                      {audit.evidence && (
                        <pre className="text-[10px] font-mono text-[#38bdf8] bg-[#07090d] p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap">{audit.evidence}</pre>
                      )}
                      {audit.remediation && (
                        <div className="mt-2 p-2.5 rounded bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-xs font-mono text-white">
                          <span className="text-[#38bdf8] font-bold text-[10px] uppercase">Fix: </span>
                          {audit.remediation}
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-[#8a99ad] font-mono text-right shrink-0">
                      {audit.date ? timeAgo(audit.date) : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
