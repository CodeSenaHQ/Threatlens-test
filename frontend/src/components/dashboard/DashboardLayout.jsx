import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShieldAlert,
  GitBranch,
  Settings,
  Terminal,
  Search,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Download,
  Play,
  RotateCcw,
  ExternalLink,
  LogOut,
  User,
  X,
  FileCode,
  Check,
  Copy,
  ChevronRight
} from "lucide-react";
import { ThreatLensLogo } from "../ThreatLensLogo";
import { useAuth } from "@/contexts/AuthContext";
import OverviewView from "./OverviewView";
import SecurityView from "./SecurityView";
import GitAnalyzerView from "./GitAnalyzerView";
import SettingsView from "./SettingsView";
import { FindingDrawer } from "./FindingDrawer";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState("overview");
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);
  const [copiedDigest, setCopiedDigest] = useState(false);

  const handleRunAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditProgress(0);

    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const navItems = [
    {
      id: "overview",
      label: "SOC Overview",
      icon: LayoutDashboard,
      badge: "LIVE",
      badgeColor: "bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/30",
    },
    {
      id: "security",
      label: "SecTest Scanner",
      icon: ShieldAlert,
      badge: "5",
      badgeColor: "bg-[#f43f5e]/15 text-[#fb7185] border-[#f43f5e]/30",
    },
    {
      id: "git",
      label: "Git Risk Analyzer",
      icon: GitBranch,
      badge: "1.4k",
      badgeColor: "bg-white/5 text-[#8a99ad] border-white/10",
    },
    {
      id: "settings",
      label: "Profile & Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen bg-[#06080d] text-[#edf2f7] font-sans overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(77,142,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(77,142,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="fixed -top-40 left-1/4 w-[600px] h-[300px] bg-[#2546ff]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 right-1/4 w-[600px] h-[300px] bg-[#4d8eff]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="relative z-20 w-64 border-r border-white/[0.07] bg-[#06080d]/95 backdrop-blur-xl flex flex-col shrink-0">
        <div className="p-5 border-b border-white/[0.07] flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <ThreatLensLogo className="h-7 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#475569] font-mono">
            Security Intelligence
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#2546ff]/15 text-[#93c5fd] border border-[#2546ff]/30 shadow-[0_0_20px_rgba(37,70,255,0.15)]"
                    : "text-[#8a99ad] hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#4d8eff]" : "text-[#64748b]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#475569] font-mono">
            Advanced Tooling
          </div>

          <Link
            href="/commit-analysis"
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#8a99ad] hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <FileCode className="w-4 h-4 text-[#4d8eff]" />
              <span>Diff Workspace</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#475569]" />
          </Link>
        </nav>

        {/* Sidebar Footer — Active Target Info */}
        <div className="p-3 border-t border-white/[0.07] space-y-2">
          <div className="p-3 rounded-xl bg-[#0a0d15] border border-white/[0.06] text-xs">
            <div className="flex items-center gap-1.5 text-[#4d8eff] font-mono text-[10px] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> Active Engine Target
            </div>
            <div className="font-semibold text-white truncate">ThreatLens / ThreatLens</div>
            <div className="text-[#64748b] text-[10px] font-mono mt-0.5">branch: main · 1,428 commits</div>
          </div>

          {/* User profile bar in sidebar */}
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2546ff] to-[#4d8eff] flex items-center justify-center text-[10px] font-bold text-white uppercase font-mono shrink-0">
                {user?.name ? user.name.slice(0, 2) : "TL"}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-white truncate leading-tight">
                  {user?.name || "Security Analyst"}
                </div>
                <div className="text-[9px] text-[#64748b] font-mono uppercase">
                  {user?.role || "ANALYST"}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#64748b] hover:text-[#fb7185] hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/[0.07] bg-[#06080d]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-[#8a99ad] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Landing
            </Link>
            <div className="h-4 w-px bg-white/[0.08]" />
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#64748b]">SOC</span>
              <ChevronRight className="w-3 h-3 text-[#475569]" />
              <span className="text-white font-semibold capitalize">
                {currentView === "overview" && "Executive Telemetry"}
                {currentView === "security" && "SecTest Vulnerability Scanner"}
                {currentView === "git" && "Git Repository Risk Engine"}
                {currentView === "settings" && "Account & Security Controls"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#64748b]" />
              <input
                type="text"
                placeholder="Search CVEs, endpoints, SHAs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0d15] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#4d8eff] transition-colors"
              />
            </div>

            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2546ff] hover:bg-[#1d3bef] text-white text-xs font-semibold rounded-xl transition-all border border-white/10 shadow-[0_0_15px_rgba(37,70,255,0.25)] cursor-pointer disabled:opacity-50"
            >
              {isAuditing ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning ({auditProgress}%)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Live Audit</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsAttestationModalOpen(true)}
              className="p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl text-[#8a99ad] hover:text-white transition-all"
              title="View Polygon Merkle Attestation Receipt"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {currentView === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <OverviewView onSelectFinding={(f) => setSelectedFinding(f)} />
              </motion.div>
            )}

            {currentView === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <SecurityView onSelectFinding={(f) => setSelectedFinding(f)} />
              </motion.div>
            )}

            {currentView === "git" && (
              <motion.div
                key="git"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <GitAnalyzerView onSelectFinding={(f) => setSelectedFinding(f)} />
              </motion.div>
            )}

            {currentView === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <SettingsView />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Slide-Over Vulnerability Finding Drawer */}
      <FindingDrawer
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />

      {/* On-Chain Attestation Certificate Modal */}
      <AnimatePresence>
        {isAttestationModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0a0d15] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#4ade80]" />
                  <span className="font-bold text-sm text-white">
                    ThreatLens Cryptographic Attestation Certificate
                  </span>
                </div>
                <button
                  onClick={() => setIsAttestationModalOpen(false)}
                  className="p-1 rounded text-[#8a99ad] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#06080d] border border-white/10 space-y-2 font-mono text-[11px]">
                <div className="text-[#8a99ad]">// Immutable Polygon Audit Receipt</div>
                <div><span className="text-[#64748b]">Engine:</span> ThreatLens SecTest v2.4</div>
                <div><span className="text-[#64748b]">Target:</span> github.com/ThreatLens/ThreatLens</div>
                <div><span className="text-[#64748b]">Commit:</span> 7f8a92b3c109d...</div>
                <div><span className="text-[#64748b]">Merkle Root:</span> 0x8a9012f4b931e9c91039820fa929bc91030e8a7199201948</div>
                <div><span className="text-[#64748b]">Block:</span> #48,192</div>
                <div><span className="text-[#64748b]">Status:</span> <span className="text-[#4ade80]">ANCHORED &amp; VERIFIED</span></div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAttestationModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("0x8a9012f4b931e9c91039820fa929bc91030e8a7199201948");
                    setCopiedDigest(true);
                    setTimeout(() => setCopiedDigest(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2546ff] hover:bg-[#1d3bef] text-white font-semibold"
                >
                  {copiedDigest ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedDigest ? "Copied" : "Copy Merkle Digest"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
