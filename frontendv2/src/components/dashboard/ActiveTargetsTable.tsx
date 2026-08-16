import React from 'react';
import { TargetEndpoint } from '../../lib/mockData';
import { useSecurity, SecurityModuleType } from '../../contexts/SecurityContext';
import { Shield, ShieldAlert, Play, ExternalLink, Activity, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const ActiveTargetsTable: React.FC = () => {
  const { targets, activeTarget, setActiveTarget, startSimulation, setActiveModule } = useSecurity();

  const handleQuickScan = (target: TargetEndpoint) => {
    setActiveTarget(target);
    startSimulation({
      module: 'sqli',
      moduleName: 'Rapid Vulnerability Assessment',
      target: target.url,
      options: { categories: ['Error-based', 'Union-based'] },
    });
  };

  return (
    <div className="rounded-3xl bg-[#090d1c]/90 border border-white/[0.08] p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Active Target Repositories & Gateways</h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            4 Registered Endpoints · Dynamic Handshakes & Telemetry Stream
          </p>
        </div>

        <button
          onClick={() => toast.info('Target Endpoint Discovery modal')}
          className="cyber-btn-primary text-xs py-2 px-4 shrink-0"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>+ Add New Target</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="pb-3 px-3 font-semibold">Endpoint & Asset Name</th>
              <th className="pb-3 px-3 font-semibold">Security State</th>
              <th className="pb-3 px-3 font-semibold">Risk Score</th>
              <th className="pb-3 px-3 font-semibold">Vulnerabilities</th>
              <th className="pb-3 px-3 font-semibold">Active Modules</th>
              <th className="pb-3 px-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-xs">
            {targets.map((t) => {
              const isSelected = t.id === activeTarget.id;
              return (
                <tr
                  key={t.id}
                  onClick={() => setActiveTarget(t)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-600/15' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Name & URL */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          t.status === 'protected'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {t.status === 'protected' ? (
                          <Shield className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{t.name}</span>
                          {isSelected && (
                            <span className="text-[9px] font-mono px-1 rounded bg-blue-500/20 text-blue-300">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs">{t.url}</div>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                        t.status === 'protected'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : t.status === 'vulnerable'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'protected'
                            ? 'bg-emerald-400'
                            : t.status === 'vulnerable'
                            ? 'bg-rose-400'
                            : 'bg-blue-400 animate-ping'
                        }`}
                      />
                      {t.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Risk Score */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            t.riskScore > 60
                              ? 'bg-rose-500'
                              : t.riskScore > 30
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${t.riskScore}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-white">{t.riskScore}/100</span>
                    </div>
                  </td>

                  {/* Vulnerability Counts */}
                  <td className="py-3.5 px-3 font-mono">
                    <div className="flex items-center gap-1.5">
                      {t.vulnCount.critical > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                          {t.vulnCount.critical} Crit
                        </span>
                      )}
                      {t.vulnCount.high > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          {t.vulnCount.high} High
                        </span>
                      )}
                      {t.vulnCount.critical === 0 && t.vulnCount.high === 0 && (
                        <span className="text-slate-400 text-[11px]">0 Critical</span>
                      )}
                    </div>
                  </td>

                  {/* Active Modules */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {t.activeModules.map((m) => (
                        <span
                          key={m}
                          className="px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 text-[10px] font-mono border border-white/[0.06]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickScan(t);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-semibold shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all"
                    >
                      <Play className="w-3 h-3 fill-blue-300" />
                      <span>Audit</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
