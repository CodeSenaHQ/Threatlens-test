import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, ExternalLink, Shield } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";

export function FindingDrawer({ finding, onClose }) {
  const [copied, setCopied] = React.useState(null);

  if (!finding) return null;

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const severity = finding.severity?.toLowerCase() || "info";

  return (
    <AnimatePresence>
      {finding && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-[#0a0d15] border-l border-white/[0.08] shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0a0d15]/95 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f43f5e]/10 border border-[#f43f5e]/20">
                  <Shield className="w-4 h-4 text-[#f43f5e]" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#64748b]">Finding Detail</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {finding.id && (
                      <span className="text-xs font-mono font-bold text-white">{finding.id}</span>
                    )}
                    <SeverityBadge severity={finding.severity} />
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[#64748b] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-base font-bold text-white leading-snug">{finding.title}</h3>
                {finding.meta?.endpoint && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-[#8a99ad]">
                    <ExternalLink className="w-3 h-3" />
                    {finding.meta.endpoint}
                  </div>
                )}
                {/* Fallback for older data shape */}
                {!finding.meta?.endpoint && finding.endpoint && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-[#8a99ad]">
                    <ExternalLink className="w-3 h-3" />
                    {finding.endpoint}
                  </div>
                )}
              </div>

              {/* Metadata pills */}
              <div className="flex flex-wrap gap-2">
                {(finding.meta?.cwe || finding.cwe) && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#2546ff]/10 border border-[#2546ff]/20 text-[11px] font-mono font-semibold text-[#93c5fd]">
                    {finding.meta?.cwe || finding.cwe}
                  </span>
                )}
                {finding.module && (
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-[#8a99ad] capitalize">
                    {finding.module}
                  </span>
                )}
                {finding.category && (
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-[#8a99ad] uppercase">
                    {finding.category}
                  </span>
                )}
              </div>

              {/* Explanation */}
              {(finding.explanation || finding.description) && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">Root Cause</h4>
                  <p className="text-sm text-[#94a3b8] leading-relaxed">
                    {finding.explanation || finding.description}
                  </p>
                </div>
              )}

              {/* Evidence */}
              {finding.evidence && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">Evidence</h4>
                  <div className="p-4 rounded-xl bg-[#06080d] border border-white/[0.06] font-mono text-xs text-[#94a3b8] leading-relaxed whitespace-pre-wrap break-all">
                    {finding.evidence}
                  </div>
                </div>
              )}

              {/* Remediation */}
              {(finding.remediation || finding.diffSnippet) && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">Remediation</h4>
                  {finding.remediation && (
                    <p className="text-sm text-[#94a3b8] leading-relaxed">{finding.remediation}</p>
                  )}
                  {finding.diffSnippet && (
                    <div className="p-4 rounded-xl bg-[#06080d] border border-white/[0.06] font-mono text-xs leading-relaxed overflow-x-auto">
                      {finding.diffSnippet.split("\n").map((line, i) => (
                        <div
                          key={i}
                          className={`px-2 py-0.5 rounded ${
                            line.startsWith("+")
                              ? "bg-[#22c55e]/10 text-[#86efac]"
                              : line.startsWith("-")
                              ? "bg-[#f43f5e]/10 text-[#fca5a5]"
                              : "text-[#64748b]"
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Proof hash */}
              {(finding.meta?.proof_hash || finding.proofHash) && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
                    Cryptographic Proof
                  </h4>
                  <button
                    onClick={() => copyText(finding.meta?.proof_hash || finding.proofHash, "proof")}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#06080d] border border-white/[0.06] hover:border-[#2546ff]/30 transition-colors group"
                  >
                    <code className="text-xs font-mono text-[#b8caff] truncate">
                      {finding.meta?.proof_hash || finding.proofHash}
                    </code>
                    {copied === "proof" ? (
                      <Check className="w-3.5 h-3.5 text-[#4ade80] shrink-0 ml-2" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#64748b] group-hover:text-white shrink-0 ml-2" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
