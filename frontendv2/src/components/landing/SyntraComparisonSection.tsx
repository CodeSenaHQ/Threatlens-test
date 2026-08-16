import React from 'react';
import { TrendingDown, ArrowUpRight, AlertOctagon, CheckCircle2, Shield, Activity, Lock, Cpu } from 'lucide-react';
import { SpotlightCard } from '../react-bits/SpotlightCard';

export const SyntraComparisonSection: React.FC = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="glow-pill mx-auto">
          <span className="beacon-dot" />
          <span>The Security Problem & Solution</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cloud & AI systems are moving fast. Your security needs structure.
        </h2>
        <p className="text-slate-400 text-sm">
          Fragmented pentest scripts and manual audit checklists leave blind spots across microservices and API gateways.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Card: Scattered Experiments & Disconnected Tools (from ui-insp/a.webp) */}
        <SpotlightCard
          spotlightColor="rgba(244, 63, 94, 0.15)"
          borderColor="rgba(244, 63, 94, 0.35)"
          className="p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                Uncoordinated Security
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30">
                HIGH RISK
              </span>
            </div>

            {/* Matrix of tool badges with error/crash tags */}
            <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-black/40 border border-white/[0.06] mb-6">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                <div className="text-xs font-bold text-slate-300">FastAPI Core</div>
                <span className="text-[9px] font-mono text-rose-400 font-bold block mt-0.5">Defect Found</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
                <div className="text-xs font-bold text-rose-200">OAuth Portal</div>
                <span className="text-[9px] font-mono text-rose-400 font-bold block mt-0.5">Token Leaked</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                <div className="text-xs font-bold text-slate-300">PostgreSQL</div>
                <span className="text-[9px] font-mono text-amber-400 font-bold block mt-0.5">SQLi Vulnerable</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-center">
                <div className="text-xs font-bold text-rose-200">K8s Ingress</div>
                <span className="text-[9px] font-mono text-rose-400 font-bold block mt-0.5">No 429 Throttle</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                <div className="text-xs font-bold text-slate-300">GitHub CI/CD</div>
                <span className="text-[9px] font-mono text-rose-400 font-bold block mt-0.5">Key in History</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                <div className="text-xs font-bold text-slate-300">Actuator Sinks</div>
                <span className="text-[9px] font-mono text-amber-400 font-bold block mt-0.5">/env Exposed</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">Scattered pentest scripts & blind spots</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Security testing spread across ad-hoc terminal scripts, slack threads, and fragmented manual spreadsheets with no single source of truth.
            </p>
          </div>
        </SpotlightCard>

        {/* Right Card: Unmeasured Performance Drop vs ThreatLens Hardening (from ui-insp/a.webp) */}
        <SpotlightCard
          spotlightColor="rgba(59, 130, 246, 0.2)"
          borderColor="rgba(59, 130, 246, 0.4)"
          className="p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                ThreatLens 2.0 Command Center
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                100% VISIBILITY
              </span>
            </div>

            {/* Chart Graphic (Red drop to Blue recovery) */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-mono">Zero-Day Vulnerability Surface</span>
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +94% Hardened
                </span>
              </div>

              {/* Mini SVG comparison curve */}
              <div className="h-24 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="secGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="40%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,65 Q 60,75 120,45 T 240,20 T 300,10"
                    fill="none"
                    stroke="url(#secGrad)"
                    strokeWidth="3"
                  />
                  <circle cx="300" cy="10" r="4" fill="#10b981" />
                </svg>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">Continuous autonomous intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every endpoint, secret pattern, and HTTP probe is continuously monitored and benchmarked with live telemetry, real-time alerts, and instant AI patches.
            </p>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
