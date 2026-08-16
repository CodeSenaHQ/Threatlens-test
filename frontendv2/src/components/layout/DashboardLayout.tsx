import React, { useState } from 'react';
import {
  LayoutDashboard,
  Shield,
  Terminal,
  Cpu,
  Bot,
  Zap,
  Key,
  Globe,
  Sliders,
  Bell,
  Search,
  Download,
  Calendar,
  ChevronDown,
  Layers,
  Sparkles,
  LogOut,
  AlertTriangle,
  FolderGit2,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSecurity, SecurityModuleType } from '../../contexts/SecurityContext';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenLanding: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeSection,
  setActiveSection,
  onOpenLanding,
}) => {
  const { user, logout } = useAuth();
  const { targets, activeTarget, setActiveTarget, openCopilot, setActiveModule } = useSecurity();
  const [searchQuery, setSearchQuery] = useState('');
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleModuleClick = (moduleKey: SecurityModuleType) => {
    setActiveModule(moduleKey);
    setActiveSection('modules');
  };

  const handleExportCSV = () => {
    toast.success('Generated ThreatLens Telemetry Report (CSV). Download started.');
  };

  return (
    <div className="flex min-h-screen bg-[#05070e] text-slate-100 font-sans selection:bg-blue-600/30">
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR (Cortex Labs Aesthetic) */}
      {/* ========================================================================= */}
      <aside className="w-64 border-r border-white/[0.08] bg-[#070a14] flex flex-col justify-between p-4 shrink-0 z-20">
        <div className="space-y-6">
          {/* Workspace Header */}
          <div
            onClick={onOpenLanding}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <Shield className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-white truncate">ThreatLens AI</span>
                <span className="text-[9px] font-mono px-1 rounded bg-blue-500/20 text-blue-300">PRO</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">SecOps Workspace</p>
            </div>
          </div>

          {/* Main Navigation Section */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
              Main Menu
            </div>

            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'overview'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>Dashboard</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#3b82f6]" />
            </button>

            <button
              onClick={() => setActiveSection('modules')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'modules'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Security Studios</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                7
              </span>
            </button>

            <button
              onClick={() => setActiveSection('telemetry')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'telemetry'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Live Terminal</span>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <button
              onClick={() => openCopilot('Conduct full threat matrix analysis on active target')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>AI Threat Copilot</span>
              </div>
              <span className="text-[9px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-300">
                AI
              </span>
            </button>
          </div>

          {/* Security Testing Suites Breakdown */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
              Attack Probing Suites
            </div>

            <button
              onClick={() => handleModuleClick('sqli')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>SQL Injection Fuzzer</span>
            </button>

            <button
              onClick={() => handleModuleClick('xss')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>XSS Script Analyzer</span>
            </button>

            <button
              onClick={() => handleModuleClick('ddos')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>DDoS Load Simulator</span>
            </button>

            <button
              onClick={() => handleModuleClick('git-audit')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Git Repo Secret Scan</span>
            </button>

            <button
              onClick={() => handleModuleClick('exfil')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Data Exfiltration Probe</span>
            </button>

            <button
              onClick={() => handleModuleClick('ratelimit')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Rate Limit (429) Guard</span>
            </button>
          </div>
        </div>

        {/* Bottom Pro Upgrade & Account */}
        <div className="space-y-3 pt-4 border-t border-white/[0.06]">
          {/* Pro Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-blue-900/30 to-indigo-950/40 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 text-white font-semibold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>ThreatLens Enterprise</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Continuous 24/7 autonomous zero-day discovery & compliance reports.
            </p>
            <button
              onClick={() => toast.info('ThreatLens Enterprise Cluster is active.')}
              className="w-full py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(59,130,246,0.3)]"
            >
              Manage License
            </button>
          </div>

          {/* User Profile Footer */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-inner shrink-0">
                {user?.name.charAt(0) || 'O'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user?.name || 'Operator'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.role || 'Lead Auditor'}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operations Bar */}
        <header className="h-16 border-b border-white/[0.08] bg-[#070a14]/90 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30">
          {/* Search bar with / keyboard hint */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search targets, CVE signatures, payloads..."
                className="w-full bg-[#0d1224] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 border border-white/10">
                /
              </span>
            </div>
          </div>

          {/* Center Target URL Selector */}
          <div className="relative mx-4 hidden lg:block">
            <div
              onClick={() => setTargetDropdownOpen(!targetDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 cursor-pointer transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <div className="text-left">
                <span className="text-[10px] text-slate-500 font-mono block leading-none">TARGET ENDPOINT</span>
                <span className="text-xs font-mono font-semibold text-slate-200 truncate max-w-[200px] block">
                  {activeTarget.url}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {targetDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-72 rounded-xl bg-[#090d1a] border border-white/10 shadow-2xl p-2 z-50">
                <div className="text-[10px] font-mono text-slate-500 px-2 py-1 uppercase">Switch Testing Target</div>
                {targets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActiveTarget(t);
                      setTargetDropdownOpen(false);
                      toast.info(`Active target switched to ${t.url}`);
                    }}
                    className={`p-2 rounded-lg cursor-pointer text-xs flex items-center justify-between transition-colors ${
                      t.id === activeTarget.id
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                        : 'hover:bg-white/[0.04] text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{t.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{t.url}</div>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        t.status === 'protected'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons & Dates */}
          <div className="flex items-center gap-3">
            {/* Live Date Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-400 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>August 16, 2026</span>
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={() => openCopilot('Provide overall vulnerability assessment for current endpoint')}
              className="relative p-2 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
              title="ThreatLens AI Copilot"
            >
              <Bot className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 relative transition-all"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0b0f1e] border border-white/10 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-xs text-white">Security Alerts (3)</span>
                    <span className="text-[10px] font-mono text-blue-400 cursor-pointer">Mark read</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200">
                      <div className="font-semibold">Critical SQLi Injection</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Parameter &apos;auth_token&apos; vulnerable to Blind boolean injection.</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200">
                      <div className="font-semibold">Sensitive Key Leaked</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Commit 4f29a matched OpenAI API key format in repo audit.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
};
