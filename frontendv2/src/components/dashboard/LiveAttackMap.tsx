import React from 'react';
import { Globe, Shield, Activity, Radio, AlertTriangle } from 'lucide-react';
import { MOCK_ATTACK_LOCATIONS } from '../../lib/mockData';

export const LiveAttackMap: React.FC = () => {
  return (
    <div className="rounded-3xl bg-[#090d1c]/90 border border-white/[0.08] p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Global Cyber Attack Vector Trajectories
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-[11px] font-mono text-cyan-300">5 Edge Nodes Active</span>
        </div>
      </div>

      {/* Cyber Map Visualization with Pulsing Defensive Nodes */}
      <div className="relative h-60 w-full rounded-2xl bg-[#050713] border border-white/[0.06] p-4 flex flex-col justify-between overflow-hidden">
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* SVG Arcs */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="arcGrad1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d="M 120,80 Q 250,20 400,100" fill="none" stroke="url(#arcGrad1)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
          <path d="M 220,160 Q 350,70 520,110" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 400,100 Q 480,40 580,80" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.7" />
        </svg>

        {/* Attack Origin Nodes */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {MOCK_ATTACK_LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/40 transition-all text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">{loc.city}</span>
                <span className="text-[10px] font-mono text-slate-400">{loc.country}</span>
              </div>
              <div className="text-[11px] font-mono text-cyan-300 font-semibold">{loc.count} Probes</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    loc.threat === 'Critical'
                      ? 'bg-rose-400 shadow-[0_0_6px_#f43f5e]'
                      : loc.threat === 'High'
                      ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
                      : 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                  }`}
                />
                <span className="text-[9px] font-mono text-slate-400">{loc.threat} Severity</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Map Stats */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Telemetry handshakes synchronized with AWS US-East, Frankfurt & Tokyo</span>
          </div>
          <span className="text-white font-bold">4.8M Total Vectors Blocked</span>
        </div>
      </div>
    </div>
  );
};
