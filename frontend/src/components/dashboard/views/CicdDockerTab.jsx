import React from "react";
import {
  Layers,
  ShieldAlert,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Terminal,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function CicdDockerTab() {
  const audits = [
    {
      id: "CICD-01",
      target: ".github/workflows/deploy.yml:14",
      type: "Unpinned GitHub Action",
      severity: "medium",
      status: "Remediated",
      title: "Third-party action used with mutable tag instead of commit SHA",
      evidence: "- uses: actions/checkout@v4\n+ uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1",
      remediation: "Pin all actions to immutable 40-character commit hashes to defend against supply-chain tag hijacking.",
    },
    {
      id: "DOCKER-01",
      target: "backend/Dockerfile:42",
      type: "Insecure Container Execution",
      severity: "high",
      status: "Active Violation",
      title: "Container runs as default root user without non-privileged USER directive",
      evidence: "Missing 'USER appuser' directive before ENTRYPOINT",
      remediation: "Add: 'RUN useradd -u 10001 -ms /bin/sh appuser && USER appuser'.",
    },
    {
      id: "CICD-02",
      target: ".github/workflows/ci.yml:33",
      type: "Unsafe Command Execution",
      severity: "critical",
      status: "Active Violation",
      title: "Piping remote script directly to bash shell in CI runner",
      evidence: "run: curl -sSL https://raw.githubusercontent.com/install.sh | bash",
      remediation: "Download script, verify SHA256 checksum before execution.",
    },
    {
      id: "DOCKER-02",
      target: ".dockerignore:1",
      type: "Missing Build Context Filter",
      severity: "low",
      status: "Remediated",
      title: "Sensitive files (.env, .git, *.pem) included in build context",
      evidence: "+ .env\n+ .git\n+ *.pem\n+ **/__pycache__",
      remediation: "Maintain strict .dockerignore to minimize image layer size and prevent secret leakage.",
    },
  ];

  const handleExportSarif = () => {
    toast.success("Exported CI/CD & Docker security audit as SARIF 2.1.0 manifest!");
  };

  return (
    <div className="space-y-7">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-white">CI/CD & Container Security</h1>
          <p className="text-xs text-[#8a99ad] mt-1 font-mono">
            Automated supply chain verification for GitHub Actions, GitLab CI runners & Dockerfile hardening
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleExportSarif}
            className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SARIF 2.1</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#ff4d4f] shadow-[0_0_10px_#ff4d4f]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Critical Violations</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#ff4d4f]">1 Detected</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">curl | bash pipeline execution</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#ff9a3c] shadow-[0_0_10px_#ff9a3c]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">High Violations</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#ff9a3c]">1 Detected</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Root container execution</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Hardened Checks</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">2 Passed</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Pinned actions & .dockerignore</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Workflows Audited</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">6 Pipelines</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">GitHub Actions & Dockerfile</div>
        </div>
      </div>

      {/* Audits Feed */}
      <div className="space-y-4">
        {audits.map((item) => {
          const isCrit = item.severity === "critical";
          const isHigh = item.severity === "high";
          const isMed = item.severity === "medium";
          const color = isCrit ? "#ff4d4f" : isHigh ? "#ff9a3c" : isMed ? "#f2c94c" : "#38bdf8";

          return (
            <div
              key={item.id}
              className="bg-[#10151a] border border-[#263544] hover:border-[#2f4255] rounded-xl p-5 space-y-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap font-bold"
                      style={{
                        color: color,
                        borderColor: color,
                        backgroundColor: `${color}14`,
                      }}
                    >
                      {item.severity}
                    </span>
                    <span className="font-mono text-xs text-[#38bdf8] font-bold">{item.id}</span>
                    <span className="text-xs text-white font-semibold">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-[#8a99ad] font-mono mt-1">{item.target} · {item.type}</p>
                </div>

                <span className={`font-mono text-xs font-semibold ${item.status.includes("Active") ? "text-[#ff4d4f]" : "text-emerald-400"}`}>
                  {item.status}
                </span>
              </div>

              {/* Code Evidence */}
              <pre className="p-3 rounded-lg bg-[#07090d] border border-[#222e3a] font-mono text-[11px] text-[#d8e2e8] overflow-x-auto">
                {item.evidence}
              </pre>

              {/* Recommended Fix */}
              <div className="text-xs text-[#d8e2e8] p-3 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/25 font-mono">
                <strong className="text-[#38bdf8]">Remediation:</strong> {item.remediation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
