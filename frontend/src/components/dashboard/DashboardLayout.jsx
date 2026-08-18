import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShieldAlert,
  GitBranch,
  Settings,
  Search,
  ArrowLeft,
  ShieldCheck,
  Download,
  Bell,
  HardDrive,
  FileCode,
  Check,
  Copy,
  ChevronRight,
  Activity,
  Users,
  Calendar,
  Layers,
  Sparkles,
  FolderGit2,
  ChevronDown,
  X,
  Plus
} from "lucide-react";
import { ThreatLensLogo } from "../ThreatLensLogo";
import { useAuth } from "@/contexts/AuthContext";
import { USER_REPOSITORIES } from "@/lib/repositories";
import { ProjectsOverviewView } from "./ProjectsOverviewView";
import OverviewView from "./OverviewView";
import SecurityView from "./SecurityView";
import GitAnalyzerView from "./GitAnalyzerView";
import SettingsView from "./SettingsView";
import { InspectorPanel } from "./InspectorPanel";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [activeRepo, setActiveRepo] = useState(null); // null = Projects Overview, or Repo Object
  const [currentNav, setCurrentNav] = useState("overview"); // sidebar tab
  const [topTab, setTopTab] = useState("files"); // top category tab
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(USER_REPOSITORIES[0]); // initially the first repo
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);
  const [copiedDigest, setCopiedDigest] = useState(false);
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);

  // When a user selects a repository from projects list or dropdown
  const handleOpenRepo = (repo) => {
    setActiveRepo(repo);
    setSelectedItem(repo.findings?.[0] || repo);
    setCurrentNav("overview");
    setIsRepoDropdownOpen(false);
  };

  // Return to All Projects view
  const handleBackToProjects = () => {
    setActiveRepo(null);
    setSelectedItem(USER_REPOSITORIES[0]);
    setIsRepoDropdownOpen(false);
  };

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
    { id: "overview", label: activeRepo ? "SOC Findings" : "All Projects", icon: LayoutDashboard, count: activeRepo ? `${activeRepo.findings?.length || 0}` : `${USER_REPOSITORIES.length}` },
    { id: "security", label: "Live Scanner", icon: ShieldAlert, count: "Active" },
    { id: "git", label: "Git Commits", icon: GitBranch, count: activeRepo ? `${activeRepo.commitCount}` : "3.1k" },
    { id: "settings", label: "Security Settings", icon: Settings },
  ];

  const topCategoryTabs = [
    { id: "files", label: "SOC Files", icon: Layers },
    { id: "activity", label: "Live Telemetry", icon: Activity },
    { id: "schedule", label: "Scheduled Audits", icon: Calendar },
    { id: "team", label: "SecOps Team", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#06080d] text-[#edf2f7] font-sans overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 z-0 opacity-15 pointer-events-none bg-[radial-gradient(#2546ff_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="fixed -top-40 left-1/4 w-[600px] h-[300px] bg-[#2546ff]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* LEFT SIDEBAR */}
      <aside className="relative z-20 w-60 border-r border-white/[0.07] bg-[#0a0d15]/95 backdrop-blur-xl flex flex-col shrink-0 justify-between">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand header */}
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <ThreatLensLogo className="h-6 w-auto" />
            </Link>
          </div>

          {/* Active Repo Switcher Card in Sidebar */}
          <div className="p-3 border-b border-white/[0.06]">
            <div className="relative">
              <button
                onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs transition-all text-left group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${activeRepo?.primaryColor || "#3b82f6"}20`,
                      color: activeRepo?.primaryColor || "#3b82f6",
                    }}
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate text-[11px]">
                      {activeRepo ? activeRepo.name : "All Repositories"}
                    </div>
                    <div className="text-[9px] text-[#64748b] font-mono truncate">
                      {activeRepo ? activeRepo.language : "5 Projects Active"}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748b] group-hover:text-white shrink-0 ml-1" />
              </button>

              {/* Repo dropdown menu */}
              <AnimatePresence>
                {isRepoDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 right-0 mt-1 z-50 p-1.5 rounded-xl bg-[#0e1320] border border-white/[0.12] shadow-2xl space-y-0.5 text-xs max-h-60 overflow-y-auto"
                  >
                    <button
                      onClick={handleBackToProjects}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                        activeRepo === null ? "bg-[#2546ff]/20 text-[#93c5fd]" : "text-[#8a99ad] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>📂 All Projects</span>
                      <span className="text-[10px] font-mono text-[#64748b]">5</span>
                    </button>

                    <div className="my-1 border-t border-white/[0.06]" />

                    {USER_REPOSITORIES.map((repo) => (
                      <button
                        key={repo.id}
                        onClick={() => handleOpenRepo(repo)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                          activeRepo?.id === repo.id ? "bg-[#2546ff]/20 text-[#93c5fd]" : "text-[#8a99ad] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className="truncate">{repo.name}</span>
                        <span
                          className={`text-[9px] font-mono px-1 rounded ${
                            repo.grade === "A+"
                              ? "text-[#4ade80] bg-[#22c55e]/10"
                              : repo.grade === "A"
                              ? "text-[#60a5fa] bg-[#3b82f6]/10"
                              : "text-[#fbbf24] bg-[#f59e0b]/10"
                          }`}
                        >
                          {repo.grade}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation group */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#475569] font-mono">
              {activeRepo ? `${activeRepo.name} SOC` : "Organization"}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#2546ff]/15 text-[#93c5fd] border border-[#2546ff]/30 shadow-[0_0_20px_rgba(37,70,255,0.15)] font-bold"
                      : "text-[#8a99ad] hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#4d8eff]" : "text-[#64748b]"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        isActive
                          ? "bg-[#2546ff]/20 text-[#93c5fd]"
                          : "bg-white/5 text-[#64748b]"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#475569] font-mono">
              Workspaces
            </div>

            <Link
              href="/commit-analysis"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#8a99ad] hover:text-white hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <FileCode className="w-4 h-4 text-[#4d8eff]" />
                <span>Diff Workspace</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* Storage / Engine Capacity gauge */}
        <div className="p-3 border-t border-white/[0.06] space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#06080d] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-white">
                <HardDrive className="w-3.5 h-3.5 text-[#4d8eff]" />
                <span>AST Index Tree</span>
              </div>
              <ChevronRight className="w-3 h-3 text-[#475569]" />
            </div>

            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2546ff] to-[#4d8eff]"
                style={{ width: activeRepo ? "68%" : "84%" }}
              />
            </div>

            <div className="text-[10px] text-[#64748b] font-mono">
              {activeRepo ? `${activeRepo.commitCount} Commits Indexed` : "3,170 Total Commits Indexed"}
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER WORKSPACE + TOPBAR */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 min-w-0">
        {/* TOPBAR */}
        <header className="h-16 border-b border-white/[0.07] bg-[#0a0d15]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 gap-4">
          {/* Breadcrumbs / Back Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={handleBackToProjects}
              className={`hover:text-white transition-colors ${
                activeRepo === null ? "text-white font-bold" : "text-[#8a99ad]"
              }`}
            >
              Projects
            </button>
            {activeRepo && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#475569]" />
                <span className="text-[#93c5fd] font-bold">{activeRepo.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#475569]" />
                <span className="text-[#64748b]">
                  {currentNav === "overview" && "Findings"}
                  {currentNav === "security" && "SecTest Scanner"}
                  {currentNav === "git" && "Commits"}
                  {currentNav === "settings" && "Settings"}
                </span>
              </>
            )}
          </div>

          {/* Right Top Header Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative w-56 hidden md:block">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#64748b]" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#06080d] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#4d8eff] transition-colors"
              />
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsAttestationModalOpen(true)}
              className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#8a99ad] hover:text-white transition-colors"
              title="Notifications & Attestation Ledger"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#22c55e] ring-2 ring-[#0a0d15]" />
            </button>

            {/* User Profile Avatar Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.07]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2546ff] to-[#4d8eff] p-0.5 shadow-sm">
                <div className="w-full h-full rounded-full bg-[#0a0d15] flex items-center justify-center text-xs font-bold text-white uppercase font-mono">
                  {user?.name ? user.name.slice(0, 2) : "TL"}
                </div>
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">
                  {user?.name || "Security Analyst"}
                </div>
                <div className="text-[9px] text-[#64748b] font-mono uppercase">
                  {user?.role || "SUPERADMIN"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Center Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {/* If no repo is active, show the All Projects Overview */}
            {activeRepo === null && currentNav === "overview" && (
              <motion.div
                key="projects-overview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectsOverviewView
                  selectedRepo={selectedItem}
                  onSelectRepo={(repo) => setSelectedItem(repo)}
                  onOpenRepo={(repo) => handleOpenRepo(repo)}
                />
              </motion.div>
            )}

            {/* If a repo is active, show the repo's specific SOC view */}
            {activeRepo !== null && currentNav === "overview" && (
              <motion.div
                key={`repo-overview-${activeRepo.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <OverviewView
                  activeRepo={activeRepo}
                  selectedItem={selectedItem}
                  onSelectItem={(item) => setSelectedItem(item)}
                  onRunAudit={handleRunAudit}
                  isAuditing={isAuditing}
                />
              </motion.div>
            )}

            {currentNav === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <SecurityView onSelectFinding={(f) => setSelectedItem(f)} />
              </motion.div>
            )}

            {currentNav === "git" && (
              <motion.div
                key="git"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <GitAnalyzerView activeRepo={activeRepo} onSelectFinding={(f) => setSelectedItem(f)} />
              </motion.div>
            )}

            {currentNav === "settings" && (
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

      {/* RIGHT PERSISTENT INSPECTOR PANEL */}
      <InspectorPanel
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onOpenRepo={(repo) => handleOpenRepo(repo)}
      />

      {/* Cryptographic Attestation Modal */}
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
                <div><span className="text-[#64748b]">Target:</span> {activeRepo?.fullName || "ThreatLens / ThreatLens-Core"}</div>
                <div><span className="text-[#64748b]">Commit:</span> 7f8a92b3c109d...</div>
                <div><span className="text-[#64748b]">Merkle Root:</span> 0x8a9012f4b931e9c91039820fa929bc91030e8a7199201948</div>
                <div><span className="text-[#64748b]">Block:</span> {activeRepo?.proofBlock || "#48,192"}</div>
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
