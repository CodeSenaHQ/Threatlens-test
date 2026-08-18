import React, { useState } from "react";
import {
  Key,
  ShieldAlert,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Download,
  Filter,
  Eye,
  EyeOff,
  Sparkles,
  FileCode,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function SecretDetectionTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSecretMap, setShowSecretMap] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);

  const secrets = [
    {
      id: "SEC-001",
      type: "Stripe Secret Key",
      provider: "Stripe",
      severity: "critical",
      entropy: "4.85 bits",
      redacted: "sk_live_51MzaX••••••••••••••••••••941a",
      unmasked: "sk_live_51MzaX89B2aLp9Q41aZ941a",
      filePath: "backend/config.py:14",
      commitSha: "8f2a11b",
      author: "Marcus Brody",
      status: "Active (Exposed)",
      remediation: "Revoke key in Stripe Dashboard and migrate to AWS Secrets Manager / environment variable.",
    },
    {
      id: "SEC-002",
      type: "AWS Access Key ID",
      provider: "AWS IAM",
      severity: "high",
      entropy: "4.12 bits",
      redacted: "AKIAIOSFODNN7•••••••",
      unmasked: "AKIAIOSFODNN7EXAMPLE",
      filePath: "docker-compose.yml:28",
      commitSha: "4e21a8d",
      author: "Elena Rostov",
      status: "Revoked (Resolved)",
      remediation: "Enforce IAM role-based execution (IRSA) rather than static long-lived credentials.",
    },
    {
      id: "SEC-003",
      type: "GitHub Personal Access Token",
      provider: "GitHub",
      severity: "critical",
      entropy: "5.10 bits",
      redacted: "ghp_98aZ1b2C3d4E5f••••••••••••••••",
      unmasked: "ghp_98aZ1b2C3d4E5fG6h7I8j9K0l1M2n3",
      filePath: ".github/workflows/deploy.yml:19",
      commitSha: "7b19df3",
      author: "Sarah Chen",
      status: "Active (Exposed)",
      remediation: "Use GitHub Action OIDC federation token with repository claims.",
    },
    {
      id: "SEC-004",
      type: "RSA Private Key Block",
      provider: "OpenSSL / SSH",
      severity: "critical",
      entropy: "5.92 bits",
      redacted: "-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEA••••••••••••",
      unmasked: "-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEA0928...",
      filePath: "certs/jwt-signing.key:1",
      commitSha: "96e2a87",
      author: "Alex Vance",
      status: "Revoked (Resolved)",
      remediation: "Remove private key from git tree history using git-filter-repo and rotate certificates.",
    },
  ];

  const filteredSecrets = secrets.filter((s) => {
    return (
      s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.filePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const toggleShowSecret = (id) => {
    setShowSecretMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopySecret = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success("Secret copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-7">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-white">Secret & Credential Detection</h1>
          <p className="text-xs text-[#8a99ad] mt-1 font-mono">
            Shannon entropy analysis & regex pattern scanning for leaked API keys, tokens and cryptographic certificates
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => toast.success("Exported secret audit report (CSV)")}
            className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#ff4d4f] shadow-[0_0_10px_#ff4d4f]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Active Exposed Keys</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#ff4d4f]">2 Active</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Stripe & GitHub PAT</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Resolved / Revoked</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">2 Remediated</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">AWS & RSA Key Block</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Scanned Commits</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">1,428</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Full commit history scan</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Entropy Engine</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#38bdf8]">ARMED</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Threshold: 3.5 bits/byte</div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#8a99ad] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by secret type, file path, author..."
          className="w-full pl-10 pr-4 py-2 bg-[#10151a] border border-[#283747] rounded-lg text-xs font-mono text-white placeholder-[#6f8390] focus:border-[#38bdf8] focus:outline-none"
        />
      </div>

      {/* Secrets Table */}
      <div className="bg-[#10151a] border border-[#263544] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between p-3.5 px-4.5 border-b border-[#253240] bg-[#12181f]/60">
          <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Detected Secrets & Credential Exposures
          </h2>
          <div className="font-mono text-[10px] text-[#8a99ad]">Shannon Entropy & Regex AST Rules</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#253240] text-[10px] font-mono uppercase tracking-wider text-[#8a99ad] bg-[#0c1015]">
                <th className="py-3 px-4.5">Severity</th>
                <th className="py-3 px-4.5">Secret Type & Value</th>
                <th className="py-3 px-4.5">File & Location</th>
                <th className="py-3 px-4.5">Commit & Author</th>
                <th className="py-3 px-4.5">Status</th>
                <th className="py-3 px-4.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222e3a]">
              {filteredSecrets.map((s, idx) => {
                const isExposed = s.status.includes("Active");
                const isShown = showSecretMap[s.id];

                return (
                  <tr key={s.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4.5 align-top">
                      <span
                        className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap font-bold"
                        style={{
                          color: isExposed ? "#ff4d4f" : "#38bdf8",
                          borderColor: isExposed ? "#ff4d4f" : "#38bdf8",
                          backgroundColor: isExposed ? "rgba(255,77,79,.10)" : "rgba(56,189,248,.10)",
                        }}
                      >
                        {s.severity}
                      </span>
                    </td>

                    <td className="py-3 px-4.5 align-top min-w-[240px]">
                      <div className="font-semibold text-white">{s.type}</div>
                      <div className="flex items-center gap-2 mt-1 font-mono text-[11px]">
                        <code className="bg-[#0a0d10] px-2 py-0.5 rounded border border-[#222e3a] text-[#38bdf8]">
                          {isShown ? s.unmasked : s.redacted}
                        </code>
                        <button
                          onClick={() => toggleShowSecret(s.id)}
                          className="text-[#8a99ad] hover:text-white p-0.5"
                          title={isShown ? "Mask secret" : "Reveal secret"}
                        >
                          {isShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4.5 align-top font-mono text-[11px]">
                      <div className="text-white font-medium">{s.filePath}</div>
                      <div className="text-[#8a99ad] text-[10px] mt-0.5">Entropy: {s.entropy}</div>
                    </td>

                    <td className="py-3 px-4.5 align-top font-mono text-[11px]">
                      <div className="text-[#38bdf8] font-semibold">{s.commitSha}</div>
                      <div className="text-[#8a99ad] text-[10px] mt-0.5">{s.author}</div>
                    </td>

                    <td className="py-3 px-4.5 align-top font-mono text-[11px]">
                      <span className={isExposed ? "text-[#ff4d4f] font-semibold" : "text-emerald-400"}>
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3 px-4.5 align-top text-right font-mono">
                      <button
                        onClick={() => handleCopySecret(s.unmasked, idx)}
                        className="px-3 py-1 rounded bg-[#141b21] hover:bg-[#1a232b] border border-[#2b3947] text-xs text-[#38bdf8] hover:text-white transition-colors"
                      >
                        {copiedIndex === idx ? "Copied" : "Copy"}
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
