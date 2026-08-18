import React from "react";
import { motion } from "framer-motion";
import {
  FolderGit2,
  ShieldAlert,
  Link2,
  ShieldCheck,
  MoreHorizontal,
  Activity,
  Cpu
} from "lucide-react";

export function QuickAccessCards({ onSelectCard, activeCard, activeRepo }) {
  const cards = [
    {
      id: "repo",
      title: activeRepo ? activeRepo.name : "ThreatLens Core",
      meta: activeRepo ? `${activeRepo.commitCount.toLocaleString()} Commits · ${activeRepo.fileCount} files` : "1.4k Commits · 342 files",
      size: activeRepo ? activeRepo.size : "18.4 MB",
      icon: FolderGit2,
      color: activeRepo?.primaryColor || "#3b82f6",
      bgGradient: "from-[#2546ff]/20 to-[#3b82f6]/10",
      badge: "ACTIVE",
    },
    {
      id: "engine",
      title: "SecTest Engine",
      meta: activeRepo ? `${activeRepo.vulnerabilitiesSummary?.total || 0} Findings Detected` : "v2.4 · 5 Fuzz Modules",
      size: activeRepo ? (activeRepo.vulnerabilitiesSummary?.critical > 0 ? `${activeRepo.vulnerabilitiesSummary.critical} Critical` : "Clean") : "360 Probes",
      icon: Cpu,
      color: activeRepo?.vulnerabilitiesSummary?.critical > 0 ? "#f43f5e" : "#06b6d4",
      bgGradient: activeRepo?.vulnerabilitiesSummary?.critical > 0 ? "from-[#f43f5e]/20 to-[#fb7185]/10" : "from-[#06b6d4]/20 to-[#3b82f6]/10",
      badge: activeRepo?.vulnerabilitiesSummary?.critical > 0 ? "ATTENTION" : "ONLINE",
    },
    {
      id: "ledger",
      title: "Polygon Ledger",
      meta: `Block ${activeRepo?.proofBlock || "#48,192"} · PoS`,
      size: "SHA-256",
      icon: Link2,
      color: "#a855f7",
      bgGradient: "from-[#a855f7]/20 to-[#6366f1]/10",
      badge: "ANCHORED",
    },
    {
      id: "score",
      title: "Security Index",
      meta: activeRepo ? `${activeRepo.language}` : "0 Leaks · 100% AST",
      size: activeRepo ? `${activeRepo.securityScore}% · ${activeRepo.grade}` : "98.4% · A+",
      icon: ShieldCheck,
      color: activeRepo?.grade === "A+" ? "#22c55e" : activeRepo?.grade === "A" ? "#3b82f6" : "#f59e0b",
      bgGradient: activeRepo?.grade === "A+" ? "from-[#22c55e]/20 to-[#10b981]/10" : "from-[#f59e0b]/20 to-[#fbbf24]/10",
      badge: `GRADE ${activeRepo?.grade || "A+"}`,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Quick Access</h3>
        <button
          className="p-1 rounded-lg text-[#64748b] hover:text-white hover:bg-white/5 transition-colors"
          title="More Options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const isSelected = activeCard === card.id;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => onSelectCard?.(card.id)}
              className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                isSelected
                  ? "bg-[#0e1424] border-[#2546ff]/50 shadow-[0_0_25px_rgba(37,70,255,0.2)]"
                  : "bg-[#0a0d15] border-white/[0.06] hover:border-white/[0.14] hover:bg-[#0c101a]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.bgGradient} border border-white/[0.08] flex items-center justify-center`}
                  style={{ color: card.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border border-white/[0.08]"
                  style={{ color: card.color, backgroundColor: `${card.color}15` }}
                >
                  {card.badge}
                </span>
              </div>

              <div className="mt-3.5 space-y-0.5">
                <div className="text-xs font-bold text-white group-hover:text-[#93c5fd] transition-colors truncate">
                  {card.title}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                  <span className="truncate">{card.meta}</span>
                  <span className="font-mono text-white/80 font-semibold shrink-0 ml-1">
                    {card.size}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
