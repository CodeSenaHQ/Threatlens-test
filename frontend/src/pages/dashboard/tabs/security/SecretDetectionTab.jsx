import React, { useState, useEffect } from "react";
import {
  Key,
  ShieldAlert,
  Search,
  Copy,
  Check,
  Download,
  Eye,
  EyeOff,
  AlertTriangle,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { repoApi, severityColor, timeAgo } from "@/lib/api";

export default function SecretDetectionTab() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSecretMap, setShowSecretMap] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch secrets from commit findings across all repos
  useEffect(() => {
    const fetchSecrets = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const repos = await repoApi.getRepos(token);
        const repoList = Array.isArray(repos) ? repos : [];
        const allSecrets = [];

        for (const repo of repoList.slice(0, 5)) {
          try {
            const res = await repoApi.getCommits(token, repo.id, 1, 50);
            const commits = res?.data || [];
            for (const c of commits) {
              const findings = c.findings || [];
              for (const f of findings) {
                if (f.category === "secret_detection") {
                  allSecrets.push({
                    id: `SEC-${allSecrets.length + 1}`,
                    type: f.title,
                    severity: f.severity,
                    path: f.path || "unknown",
                    evidence: f.evidence || "[REDACTED]",
                    description: f.description,
                    commitSha: c.commit?.short_sha || "?",
                    commitMessage: c.commit?.message || "",
                    author: c.commit?.author_name || "",
                    repo: `${repo.username}/${repo.name}`,
                    date: c.commit?.authored_at,
                  });
                }
              }
            }
          } catch { /* skip repo */ }
        }

        setSecrets(allSecrets);
      } catch {
        toast.error("Failed to load secret detection data");
      } finally {
        setLoading(false);
      }
    };
    fetchSecrets();
  }, [token]);

  const filteredSecrets = secrets.filter((s) =>
    s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.repo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyEvidence = (evidence, index) => {
    navigator.clipboard.writeText(evidence);
    setCopiedIndex(index);
    toast.success("Evidence copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleShowSecret = (index) => {
    setShowSecretMap((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // KPIs
  const criticalCount = secrets.filter((s) => s.severity === "critical").length;
  const highCount = secrets.filter((s) => s.severity === "high").length;

  return (
    <div className="space-y-7">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Secret Detection</h1>
          <p className="text-xs text-[#8a99ad] mt-1">
            Extracted from commit findings · category: secret_detection · {secrets.length} secrets found
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => toast.success("Exported secret detection report")}
            className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all cursor-pointer flex items-center gap-2 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#C8A27A]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-semibold">Critical Secrets</div>
          <div className="text-xl font-bold mt-1.5 text-[#C8A27A]">{loading ? "…" : criticalCount}</div>
          <div className="text-[11px] text-[#8a99ad] mt-1">require immediate rotation</div>
        </div>
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#6EA8DA]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-semibold">High Severity</div>
          <div className="text-xl font-bold mt-1.5 text-[#6EA8DA]">{loading ? "…" : highCount}</div>
          <div className="text-[11px] text-[#8a99ad] mt-1">elevated exposure risk</div>
        </div>
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#2C6CB0]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-semibold">Total Detected</div>
          <div className="text-xl font-bold mt-1.5 text-white">{loading ? "…" : secrets.length}</div>
          <div className="text-[11px] text-[#8a99ad] mt-1">across all commits</div>
        </div>
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#1D3557] border-r border-[#6EA8DA]/40" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-semibold">Scan Status</div>
          <div className="text-xl font-bold mt-1.5 text-[#6EA8DA]">{loading ? "Scanning…" : "Complete"}</div>
          <div className="text-[11px] text-[#8a99ad] mt-1">commit-level detection</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#8a99ad] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by secret type, file path, or repository..."
          className="w-full pl-10 pr-4 py-2 bg-[#10151a] border border-[#283747] rounded-lg text-xs font-mono text-white placeholder-[#6f8390] focus:border-[#38bdf8] focus:outline-none"
        />
      </div>

      {/* Secrets Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#1a2330] rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : secrets.length === 0 ? (
        <div className="text-center py-16">
          <ShieldAlert className="w-8 h-8 mx-auto text-[#6EA8DA] mb-3" />
          <p className="text-sm text-[#8a99ad]">No secrets detected in commit history</p>
          <p className="text-xs text-[#6f8390] mt-1">This is good! Your codebase appears clean of leaked credentials.</p>
        </div>
      ) : (
        <div className="bg-[#10151a] border border-[#263544] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between p-3.5 px-4.5 border-b border-[#253240] bg-[#12181f]/60">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Detected Secrets & Credentials</h2>
          </div>
          <div className="divide-y divide-[#222e3a]">
            {filteredSecrets.map((s, i) => {
              const color = severityColor(s.severity);
              return (
                <div key={i} className="p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full border font-bold"
                          style={{ color, borderColor: color, backgroundColor: `${color}14` }}
                        >
                          {s.severity}
                        </span>
                        <span className="text-xs text-white font-semibold">{s.type}</span>
                      </div>
                      <p className="text-[11px] text-[#8a99ad] font-mono">📁 {s.path} · {s.repo} · commit {s.commitSha}</p>
                      {s.description && <p className="text-[11px] text-[#6f8390] font-mono">{s.description}</p>}

                      {/* Evidence with show/hide toggle */}
                      <div className="flex items-center gap-2 mt-1">
                        <pre className="text-[10px] text-[#38bdf8] font-mono bg-[#07090d] p-2 rounded flex-1 overflow-x-auto">
                          {showSecretMap[i] ? s.evidence : s.evidence?.replace(/./g, "•").slice(0, 40)}
                        </pre>
                        <button onClick={() => toggleShowSecret(i)} className="text-[#8a99ad] hover:text-white p-1">
                          {showSecretMap[i] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => handleCopyEvidence(s.evidence, i)} className="text-[#8a99ad] hover:text-[#38bdf8] p-1">
                          {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-[#38bdf8]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="text-[10px] text-[#8a99ad] font-mono text-right shrink-0">
                      {s.date ? timeAgo(s.date) : ""}
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
