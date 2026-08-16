import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useSecurity, SecurityModuleType } from '../contexts/SecurityContext';
import { SqliStudio } from '../components/security-modules/SqliStudio';
import { XssStudio } from '../components/security-modules/XssStudio';
import { DdosStudio } from '../components/security-modules/DdosStudio';
import { GitAuditStudio } from '../components/security-modules/GitAuditStudio';
import { ExfilStudio } from '../components/security-modules/ExfilStudio';
import { RateLimitStudio } from '../components/security-modules/RateLimitStudio';
import { ProxyStudio } from '../components/security-modules/ProxyStudio';
import { Database, Code2, Zap, FolderGit2, ShieldAlert, Sliders, Globe } from 'lucide-react';

interface ModulesPageProps {
  onOpenLanding: () => void;
  setActiveSection: (section: string) => void;
}

export const ModulesPage: React.FC<ModulesPageProps> = ({
  onOpenLanding,
  setActiveSection,
}) => {
  const { activeModule, setActiveModule } = useSecurity();

  const moduleTabs = [
    { key: 'sqli' as SecurityModuleType, name: 'SQL Injection', icon: Database, color: '#3b82f6' },
    { key: 'xss' as SecurityModuleType, name: 'Cross-Site Scripting', icon: Code2, color: '#8b5cf6' },
    { key: 'ddos' as SecurityModuleType, name: 'DDoS Stress', icon: Zap, color: '#06b6d4' },
    { key: 'git-audit' as SecurityModuleType, name: 'Git Repo Secrets', icon: FolderGit2, color: '#10b981' },
    { key: 'exfil' as SecurityModuleType, name: 'Data Exfil & Actuators', icon: ShieldAlert, color: '#f59e0b' },
    { key: 'ratelimit' as SecurityModuleType, name: 'Rate Limit (429)', icon: Sliders, color: '#f43f5e' },
    { key: 'proxy' as SecurityModuleType, name: 'Proxy & Tamper', icon: Globe, color: '#6366f1' },
  ];

  return (
    <DashboardLayout
      activeSection="modules"
      setActiveSection={setActiveSection}
      onOpenLanding={onOpenLanding}
    >
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
        {/* Module Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.08]">
          {moduleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModule === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveModule(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600/30 text-white border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'bg-white/[0.02] text-slate-400 border border-white/[0.06] hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: isActive ? '#93c5fd' : tab.color }}
                />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Studio Body */}
        <div className="pt-2">
          {activeModule === 'sqli' && <SqliStudio />}
          {activeModule === 'xss' && <XssStudio />}
          {activeModule === 'ddos' && <DdosStudio />}
          {activeModule === 'git-audit' && <GitAuditStudio />}
          {activeModule === 'exfil' && <ExfilStudio />}
          {activeModule === 'ratelimit' && <RateLimitStudio />}
          {activeModule === 'proxy' && <ProxyStudio />}
        </div>
      </div>
    </DashboardLayout>
  );
};
