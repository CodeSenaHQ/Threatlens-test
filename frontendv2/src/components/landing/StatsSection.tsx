import React from 'react';
import { AnimatedCounter } from '../react-bits/AnimatedCounter';
import { EqualizerBars } from '../react-bits/EqualizerBars';

export const StatsSection: React.FC = () => {
  return (
    <section className="relative py-16 px-6 max-w-7xl mx-auto">
      {/* Syntra-Inspired Blue Equalizer Wave Light Background */}
      <div className="relative rounded-3xl bg-[#070b18]/80 border border-blue-500/20 p-8 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-75" />

        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="glow-pill mx-auto mb-3">
            <span className="beacon-dot" />
            <span>Autonomous Intelligence Layer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Built for enterprise offensive security. Designed for DevSecOps speed.
          </h2>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {/* Stat 1 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-colors">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-1">
              1 Console
            </div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
              Unified Platform
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              TUI, Web Console, Sectest Engine & AI Copilot in one framework.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-colors">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-1 flex items-center justify-center">
              <AnimatedCounter value={100} suffix="%" />
            </div>
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
              Secret Coverage
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audits commits, git trees, and config trees for leaked API tokens.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-colors">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-1">
              24/7
            </div>
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              Telemetry Signal
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects latency differentials, 429 thresholding, and socket exhaustion.
            </p>
          </div>

          {/* Stat 4 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-colors">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-1 flex items-center justify-center">
              <AnimatedCounter value={7} suffix=" Suites" />
            </div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Probing Engines
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fuzzes SQLi, XSS, DDoS, Exfil, Rate Limiting, Proxy, and Git Audits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
