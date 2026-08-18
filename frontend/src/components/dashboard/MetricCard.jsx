import React from "react";
import { motion } from "framer-motion";

export function MetricCard({ icon: Icon, label, value, sublabel, accentColor = "#4d8eff", trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="group relative p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
    >
      {/* Subtle accent glow on hover */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-500 pointer-events-none"
        style={{ background: accentColor }}
      />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-[#64748b] tracking-wide uppercase">{label}</span>
          {Icon && (
            <div
              className="p-1.5 rounded-lg border"
              style={{
                background: `${accentColor}15`,
                borderColor: `${accentColor}25`,
                color: accentColor,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl font-bold text-white font-[var(--font-mono)] tracking-tight">
            {value ?? "—"}
          </span>
          {trend && (
            <span
              className={`text-[11px] font-semibold ${
                trend.startsWith("+") ? "text-[#4ade80]" : trend.startsWith("-") ? "text-[#f43f5e]" : "text-[#64748b]"
              }`}
            >
              {trend}
            </span>
          )}
        </div>

        {sublabel && <p className="text-[11px] text-[#475569] leading-relaxed">{sublabel}</p>}
      </div>
    </motion.div>
  );
}
