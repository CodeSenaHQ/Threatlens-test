import React, { useState, useEffect } from 'react';
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
  X,
  Play,
  CreditCard,
  Settings,
  HelpCircle,
  ShieldAlert,
  SlidersHorizontal,
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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Keyboard shortcut listener for '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setTargetDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleModuleClick = (moduleKey: SecurityModuleType) => {
    setActiveModule(moduleKey);
    setActiveSection('modules');
  };

  const handleExportCSV = () => {
    toast.success('Generated ThreatLens Telemetry Report (CSV). Download started.');
  };

  const commands = [
    { title: 'Launch SQL Injection Assessment', module: 'sqli' as SecurityModuleType, tag: 'Studio' },
    { title: 'Simulate Cross-Site Scripting (XSS)', module: 'xss' as SecurityModuleType, tag: 'Studio' },
    { title: 'Execute DDoS Traffic Stress Test', module: 'ddos' as SecurityModuleType, tag: 'Simulator' },
    { title: 'Audit Git Repository for Leaked Secrets', module: 'git-audit' as SecurityModuleType, tag: 'Audit' },
    { title: 'Data Exfiltration & Actuator Crawler', module: 'exfil' as SecurityModuleType, tag: 'Discovery' },
    { title: 'Rate Limit (429) & Proxy Interceptor', module: 'ratelimit' as SecurityModuleType, tag: 'Throttle' },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="cortex-container">
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR (Cortex Labs Exact Aesthetic from ui-insp/image.png) */}
      {/* ========================================================================= */}
      <aside className="cortex-sidebar">
        <div className="space-y-6">
          {/* Top Workspace (Cortex Labs / Workspace dropdown) */}
          <div
            onClick={onOpenLanding}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-white truncate">ThreatLens AI</div>
                <div className="text-[10px] text-slate-400 truncate">Workspace</div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          </div>

          {/* Section: Main Menu */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
              Main Menu
            </div>

            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'overview'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-purple-400" />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('modules')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'modules'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Security Studios</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                7
              </span>
            </button>

            <button
              onClick={() => setActiveSection('telemetry')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'telemetry'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Live Terminal</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => openCopilot('Analyze system vulnerability surface')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>AI Threat Copilot</span>
              </div>
              <span className="text-[9px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                AI
              </span>
            </button>
          </div>

          {/* Section: Attack Probing Suites */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
              Probing Suites
            </div>

            <button
              onClick={() => handleModuleClick('sqli')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>SQL Injection Fuzzer</span>
            </button>

            <button
              onClick={() => handleModuleClick('xss')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>XSS Script Analyzer</span>
            </button>

            <button
              onClick={() => handleModuleClick('ddos')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>DDoS Load Simulator</span>
            </button>

            <button
              onClick={() => handleModuleClick('git-audit')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Git Repo Secret Scan</span>
            </button>

            <button
              onClick={() => handleModuleClick('exfil')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Data Exfil Crawler</span>
            </button>

            <button
              onClick={() => handleModuleClick('ratelimit')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Rate Limit (429) Guard</span>
            </button>

            <button
              onClick={() => handleModuleClick('proxy')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Proxy Tamper Repeater</span>
            </button>
          </div>
        </div>

        {/* Bottom Card: Upgrade to Pro Plan (Directly from Cortex Labs image.png) */}
        <div className="space-y-3 pt-4 border-t border-white/[0.06]">
          <div className="p-3 rounded-2xl bg-gradient-to-b from-purple-900/30 to-indigo-950/40 border border-purple-500/20 relative overflow-hidden">
            <div className="flex items-center gap-2 text-white font-semibold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Upgrade to Pro Plan</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Unlock multi-cloud autonomous scanning & signed PDF audits.
            </p>
            <button
              onClick={() => toast.info('Pro Plan is active for this workspace.')}
              className="w-full py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all"
            >
              Upgrade Now
            </button>
          </div>

          {/* User Account */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user?.name.charAt(0) || 'M'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user?.name || 'Michael Chen'}</div>
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
      <div className="cortex-main-viewport">
        {/* Top Operations Bar (Exact layout from Cortex Labs image.png) */}
        <header className="cortex-topbar">
          {/* Search bar: "Search here ..." */}
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <div
              onClick={() => setIsCommandPaletteOpen(true)}
              className="relative w-full cursor-pointer group"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-purple-400 transition-colors" />
              <div className="w-full bg-[#10121c] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 text-xs text-slate-400 group-hover:border-purple-500/40 transition-all flex items-center justify-between">
                <span>Search here ...</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 border border-white/10">
                  /
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Icons & Dates (Filter, Date, Export CSV, Bell, Avatar) */}
          <div className="flex items-center gap-3">
            {/* Filter icon */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white transition-colors"
              title="Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Date Range: July 16, 2026 */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-300 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>July 16, 2026</span>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-slate-300 relative transition-all"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0e101a] border border-white/10 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-xs text-white">Alerts (3)</span>
                    <span className="text-[10px] font-mono text-purple-400 cursor-pointer">Clear</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200">
                      <div className="font-semibold">SQL Injection Alert</div>
                      <div className="text-[10px] text-slate-400">Parameter &apos;auth_token&apos; vulnerable.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
              {user?.name.charAt(0) || 'M'}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="cortex-content">{children}</main>
      </div>

      {/* Global Command Palette Modal */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-[#0e101b] border border-purple-500/40 p-4 shadow-[0_0_60px_rgba(139,92,246,0.3)] space-y-3">
            <div className="flex items-center gap-3 px-3 py-2 border-b border-white/[0.08]">
              <Search className="w-4 h-4 text-purple-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a command or jump to studio..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => setIsCommandPaletteOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1 p-1 text-xs font-medium">
              {filteredCommands.map((cmd) => (
                <div
                  key={cmd.title}
                  onClick={() => {
                    handleModuleClick(cmd.module);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="p-3 rounded-xl hover:bg-purple-600/20 hover:border-purple-500/40 border border-transparent cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Play className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-white">{cmd.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400">
                    {cmd.tag}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono px-3">
              <span>Navigate with [↑↓] · Press [Esc] to exit</span>
              <span className="text-purple-400">ThreatLens Command Studio</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
