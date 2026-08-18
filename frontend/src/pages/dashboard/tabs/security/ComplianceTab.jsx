import React from "react";
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Shield,
  ExternalLink,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export default function ComplianceTab() {
  const frameworks = [
    { name: "OWASP ASVS 4.0 (Level 2)", score: "94%", status: "Passing", passed: 47, total: 50, color: "text-emerald-400" },
    { name: "OWASP Top 10 (2021)", score: "88%", status: "1 Flagged (CWE-89)", passed: 9, total: 10, color: "text-amber-400" },
    { name: "NIST SP 800-53 Rev. 5", score: "91%", status: "Compliant", passed: 82, total: 90, color: "text-emerald-400" },
    { name: "PCI-DSS v4.0 Requirement 6", score: "85%", status: "Remediation Active", passed: 17, total: 20, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-[#0f1118] border border-white/[0.07] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span>Cryptographic Security & Regulatory Compliance Attestation</span>
          </h2>
          <p className="text-xs text-[#8a99ad] font-mono mt-1">
            Automated AST and runtime verification against global cybersecurity standards
          </p>
        </div>

        <button
          onClick={() => toast.success("Exporting compliance attestation PDF...")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-white/[0.08] text-white text-xs font-bold transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Attestation</span>
        </button>
      </div>

      {/* 4 Compliance Frameworks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {frameworks.map((fw, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#0f1118] border border-white/[0.07] hover:border-white/[0.14] transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-tight">{fw.name}</span>
              <span className={`text-xl font-bold font-['Sora',sans-serif] ${fw.color}`}>{fw.score}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#f97316] to-emerald-400 rounded-full"
                style={{ width: fw.score }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#8a99ad]">
              <span>{fw.passed} of {fw.total} controls verified</span>
              <span className={fw.color}>{fw.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
