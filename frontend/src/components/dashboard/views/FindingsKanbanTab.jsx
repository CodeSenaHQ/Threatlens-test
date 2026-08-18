import React, { useState } from "react";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Sparkles,
  Search,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

export default function FindingsKanbanTab({ onSelectFinding, selectedFindingId }) {
  const [selectedTeam, setSelectedTeam] = useState("Core Security");
  const [selectedTarget, setSelectedTarget] = useState("ThreatLens Primary");

  const columns = [
    {
      id: "open",
      title: "Open",
      count: 3,
      dotColor: "bg-rose-500",
      cards: [
        {
          id: "FND-1156",
          asset: "prod-db · 1.0",
          severity: "Critical",
          severityColor: "text-rose-400 bg-rose-500/20 border-rose-500/30",
          date: "2025-05-17",
          assignee: "KS",
          assigneeColor: "bg-emerald-600",
          cvss: 9.8,
          title: "Unauthenticated PostgreSQL remote code execution",
        },
        {
          id: "FND-0943",
          asset: "cloud-storage-1 · 8.4",
          severity: "High",
          severityColor: "text-amber-400 bg-amber-500/20 border-amber-500/30",
          date: "2025-05-09",
          assignee: "LO",
          assigneeColor: "bg-amber-600",
          cvss: 7.5,
          title: "Public S3 bucket ACL policy exposure",
        },
        {
          id: "FND-0777",
          asset: "vpn-node-3 · 1.3",
          severity: "High",
          severityColor: "text-amber-400 bg-amber-500/20 border-amber-500/30",
          date: "2025-05-08",
          assignee: "JO",
          assigneeColor: "bg-rose-600",
          cvss: 7.2,
          title: "OpenSSH weak cipher negotiation",
        },
      ],
    },
    {
      id: "triaged",
      title: "Triaged",
      count: 5,
      dotColor: "bg-amber-400",
      cards: [
        {
          id: "FND-0846",
          asset: "api-gateway · 8.4",
          severity: "High",
          severityColor: "text-amber-400 bg-amber-500/20 border-amber-500/30",
          date: "2025-05-17",
          assignee: "KS",
          assigneeColor: "bg-emerald-600",
          cvss: 7.8,
          title: "Rate limit bypass on authentication endpoint",
        },
        {
          id: "FND-0990",
          asset: "finance-app · 7.8",
          severity: "High",
          severityColor: "text-amber-400 bg-amber-500/20 border-amber-500/30",
          date: "2025-05-09",
          assignee: "NL",
          assigneeColor: "bg-blue-600",
          cvss: 8.1,
          title: "IDOR vulnerability on payout accounts",
        },
        {
          id: "FND-1021",
          asset: "auth-service · 3.5",
          severity: "Medium",
          severityColor: "text-blue-400 bg-blue-500/20 border-blue-500/30",
          date: "2025-05-02",
          assignee: "SM",
          assigneeColor: "bg-purple-600",
          cvss: 5.4,
          title: "JWT missing expiration verification",
        },
        {
          id: "FND-0815",
          asset: "legacy-server · 2.1",
          severity: "Low",
          severityColor: "text-blue-300 bg-blue-500/10 border-blue-500/20",
          date: "2025-04-31",
          assignee: "AR",
          assigneeColor: "bg-indigo-600",
          cvss: 3.2,
          title: "Server header banner information disclosure",
        },
      ],
    },
    {
      id: "in_progress",
      title: "In Progress",
      count: 4,
      dotColor: "bg-[#f97316]",
      cards: [
        {
          id: "FND-1045",
          asset: "tele-app-03 · 5.6",
          severity: "Critical",
          severityColor: "text-rose-400 bg-rose-500/20 border-rose-500/30",
          date: "2025-05-21",
          assignee: "JO",
          assigneeColor: "bg-rose-600",
          cvss: 9.1,
          title: "Remote Code Execution via Pickle deserialization",
        },
        {
          id: "FND-0874",
          asset: "internal-portal · 1.2",
          severity: "Medium",
          severityColor: "text-blue-400 bg-blue-500/20 border-blue-500/30",
          date: "2025-05-11",
          assignee: "IS",
          assigneeColor: "bg-[#f97316]",
          cvss: 3.4,
          title: "SQL injection in query filter",
          explanation: "Unsanitized user search parameters concatenated into database query builder.",
          evidence: "Payload ' OR '1'='1 dumped all records.",
          remediation: "Apply parameterized prepared statements.",
        },
        {
          id: "FND-0860",
          asset: "marketing-site · 7.6",
          severity: "Medium",
          severityColor: "text-blue-400 bg-blue-500/20 border-blue-500/30",
          date: "2025-05-07",
          assignee: "LL",
          assigneeColor: "bg-cyan-600",
          cvss: 4.8,
          title: "Missing CSP and X-Frame-Options headers",
        },
        {
          id: "FND-0977",
          asset: "cloud-db · 4.2",
          severity: "Low",
          severityColor: "text-blue-300 bg-blue-500/10 border-blue-500/20",
          date: "2025-04-29",
          assignee: "MS",
          assigneeColor: "bg-amber-700",
          cvss: 3.0,
          title: "TLS 1.0/1.1 enabled on legacy endpoint",
        },
      ],
    },
    {
      id: "resolved",
      title: "Resolved",
      count: 1,
      dotColor: "bg-emerald-400",
      cards: [
        {
          id: "FND-1012",
          asset: "email-server · 5.8",
          severity: "Resolved",
          severityColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
          date: "2025-05-16",
          assignee: "NA",
          assigneeColor: "bg-sky-600",
          cvss: 0.0,
          title: "STARTTLS downgrade attack remediated",
        },
      ],
    },
    {
      id: "canceled",
      title: "Canceled",
      count: 1,
      dotColor: "bg-rose-400",
      cards: [
        {
          id: "FND-0783",
          asset: "cloud-db · 4.2",
          severity: "Dismissed",
          severityColor: "text-[#8a99ad] bg-white/[0.06] border-white/[0.1]",
          date: "2025-05-02",
          assignee: "WT",
          assigneeColor: "bg-emerald-700",
          cvss: 0.0,
          title: "False positive duplicate alert on internal test IP",
        },
      ],
    },
  ];

  const handleExport = () => {
    toast.success("Exporting findings report (CSV)...");
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar (Directly matching video at 00:02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Filter dropdown pills */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f1118] border border-white/[0.08] text-xs font-semibold text-white cursor-pointer hover:border-white/[0.16] transition-colors">
            <span className="text-[#8a99ad]">Team:</span>
            <span>{selectedTeam}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8a99ad]" />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f1118] border border-white/[0.08] text-xs font-semibold text-white cursor-pointer hover:border-white/[0.16] transition-colors">
            <span className="text-[#8a99ad]">Target:</span>
            <span>{selectedTarget}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8a99ad]" />
          </div>
        </div>

        {/* Right: Export Button & Search */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0f1118] border border-white/[0.08] hover:border-white/[0.16] text-xs font-semibold text-[#cbd5e1] hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 5-Column Kanban Board Grid (Directly matching video) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div
            key={col.id}
            className="rounded-2xl bg-[#0f1118]/80 border border-white/[0.06] p-3.5 space-y-3.5 min-w-[220px] flex flex-col"
          >
            {/* Column Header: Dot + Title + Count */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] select-none">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <h3 className="text-xs font-bold text-white tracking-tight">{col.title}</h3>
                <span className="text-[11px] font-mono text-[#8a99ad]">({col.count})</span>
              </div>
            </div>

            {/* Cards List */}
            <div className="space-y-2.5 flex-1">
              {col.cards.map((card) => {
                const isSelected = selectedFindingId === card.id;

                return (
                  <div
                    key={card.id}
                    onClick={() => onSelectFinding && onSelectFinding(card)}
                    className={`p-3.5 rounded-xl bg-[#07090e] border cursor-pointer transition-all duration-150 space-y-2.5 group shadow-sm select-none ${
                      isSelected
                        ? "border-[#f97316] shadow-[0_0_15px_rgba(249,115,22,0.3)] bg-[#141620]"
                        : "border-white/[0.06] hover:border-white/[0.16] hover:bg-[#10121a]"
                    }`}
                  >
                    {/* Header Row: Dot + ID + More Menu */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${col.dotColor}`} />
                        <span className="font-mono text-xs font-bold text-white group-hover:text-[#f97316] transition-colors">
                          {card.id}
                        </span>
                      </div>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#8a99ad] hover:text-white p-0.5 rounded opacity-60 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Asset Name */}
                    <p className="text-[11px] text-[#cbd5e1] font-medium truncate">
                      {card.asset}
                    </p>

                    {/* Footer Row: Date + Assignee Avatar */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] font-mono">
                      <span className="text-[#8a99ad]">{card.date}</span>
                      <div
                        className={`w-5 h-5 rounded-md ${card.assigneeColor} flex items-center justify-center text-[9px] font-bold text-white uppercase shadow-sm`}
                        title={`Assigned to ${card.assignee}`}
                      >
                        {card.assignee}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
