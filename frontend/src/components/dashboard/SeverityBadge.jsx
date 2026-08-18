import React from "react";

const SEVERITY_STYLES = {
  critical: "bg-[#f43f5e]/15 text-[#fb7185] border-[#f43f5e]/30",
  high: "bg-[#fb923c]/15 text-[#fdba74] border-[#fb923c]/30",
  medium: "bg-[#facc15]/15 text-[#fde047] border-[#facc15]/30",
  low: "bg-[#38bdf8]/15 text-[#7dd3fc] border-[#38bdf8]/30",
  info: "bg-[#64748b]/15 text-[#94a3b8] border-[#64748b]/30",
};

const SEVERITY_DOT = {
  critical: "bg-[#f43f5e]",
  high: "bg-[#fb923c]",
  medium: "bg-[#facc15]",
  low: "bg-[#38bdf8]",
  info: "bg-[#64748b]",
};

export function SeverityBadge({ severity, className = "" }) {
  const s = severity?.toLowerCase() || "info";
  const style = SEVERITY_STYLES[s] || SEVERITY_STYLES.info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[s] || SEVERITY_DOT.info}`} />
      {severity}
    </span>
  );
}

export function SeverityDot({ severity, className = "" }) {
  const s = severity?.toLowerCase() || "info";
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${SEVERITY_DOT[s] || SEVERITY_DOT.info} ${className}`}
    />
  );
}
