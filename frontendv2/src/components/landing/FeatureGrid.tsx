import React from 'react';
import { Database, Code2, Zap, FolderGit2, ShieldAlert, Sliders, Globe, ArrowRight } from 'lucide-react';
import { SpotlightCard } from '../react-bits/SpotlightCard';
import { useSecurity, SecurityModuleType } from '../../contexts/SecurityContext';

interface FeatureGridProps {
  onSelectModule: (module: SecurityModuleType) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onSelectModule }) => {
  const features = [
    {
      key: 'sqli' as SecurityModuleType,
      title: 'SQL Injection Prober',
      badge: 'Database Exploitation',
      color: '#3b82f6',
      icon: Database,
      description: 'Multi-category fuzzing for Error-based, Union-based, and Blind (boolean/time) injection vulnerabilities with live payload diffing.',
    },
    {
      key: 'xss' as SecurityModuleType,
      title: 'Cross-Site Scripting (XSS)',
      badge: 'DOM & Sinks',
      color: '#8b5cf6',
      icon: Code2,
      description: 'Probes URL query parameters, form bodies, and headers against Reflected, Stored, and DOM-based script injection sinks.',
    },
    {
      key: 'ddos' as SecurityModuleType,
      title: 'DDoS Stress Simulator',
      badge: 'Traffic Exhaustion',
      color: '#06b6d4',
      icon: Zap,
      description: 'Emulates Flood surges, Slowloris-style socket exhaustion, and Burst-spike traffic loads with custom duration controls and RPS gauges.',
    },
    {
      key: 'git-audit' as SecurityModuleType,
      title: 'Git Repository Secret Scan',
      badge: 'Secret Discovery',
      color: '#10b981',
      icon: FolderGit2,
      description: 'Clones and audits public or private git repositories for exposed API tokens, private keys, environment secrets, and CVE dependencies.',
    },
    {
      key: 'exfil' as SecurityModuleType,
      title: 'Data Exfiltration Probes',
      badge: 'Sensitive Disclosure',
      color: '#f59e0b',
      icon: ShieldAlert,
      description: 'Scans for API response leakages, unhandled debug endpoints (/actuator, /env, /metrics), and verbose error stack traces.',
    },
    {
      key: 'ratelimit' as SecurityModuleType,
      title: 'Rate Limit (429) & Proxy',
      badge: 'Traffic Throttling',
      color: '#f43f5e',
      icon: Sliders,
      description: 'Validates HTTP 429 threshold enforcement, inspects headers, and tamper-repeats proxied HTTP requests in real-time.',
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="glow-pill mx-auto">
          <span className="beacon-dot" />
          <span>Complete Security Arsenal</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Bring every test, vector, and finding into one command interface.
        </h2>
        <p className="text-slate-400 text-sm">
          Run automated vulnerability modules against your endpoints with live telemetry and instant remediation patches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <SpotlightCard
              key={f.key}
              spotlightColor={`${f.color}22`}
              borderColor={`${f.color}55`}
              className="cursor-pointer group flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
              onClick={() => onSelectModule(f.key)}
            >
              <div>
                {/* Header with Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300"
                    style={{
                      backgroundColor: `${f.color}15`,
                      borderColor: `${f.color}40`,
                      boxShadow: `0 0 15px ${f.color}25`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <span
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${f.color}10`,
                      borderColor: `${f.color}30`,
                      color: f.color,
                    }}
                  >
                    {f.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {f.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-all">
                <span>Launch Studio Wizard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
};
