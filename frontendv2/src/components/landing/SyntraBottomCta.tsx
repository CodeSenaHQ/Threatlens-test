import React from 'react';
import { Shield, Sparkles, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SyntraBottomCtaProps {
  onLaunchConsole: () => void;
}

export const SyntraBottomCta: React.FC<SyntraBottomCtaProps> = ({ onLaunchConsole }) => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-950/80 via-[#0a112c] to-[#070b1a] border border-blue-500/40 p-8 sm:p-14 backdrop-blur-2xl overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.25)]">
        {/* Split Radiant Blue Ambient Glow on Left */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Text & CTA */}
          <div className="space-y-6">
            <div className="glow-pill">
              <span className="beacon-dot" />
              <span>Next-Gen Security Command Center</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              Make autonomous security part of how your team ships.
            </h2>

            <p className="text-slate-300 text-sm max-w-md leading-relaxed">
              Fuzz, simulate, and defend your APIs and repositories from one intelligent command center. No complex configuration required.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchConsole}
                className="cyber-btn-primary py-3 px-6 text-sm font-bold shadow-[0_0_25px_rgba(59,130,246,0.6)]"
              >
                <Terminal className="w-4 h-4 text-blue-200" />
                <span>Launch Security Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLaunchConsole}
                className="cyber-btn-secondary py-3 px-5 text-sm font-semibold"
              >
                Start Free Trial
              </button>
            </div>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Client-Side Safe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Day Protection</span>
              </div>
            </div>
          </div>

          {/* Right Preview Card graphic */}
          <div className="relative rounded-2xl bg-[#060914] border border-white/10 p-5 shadow-2xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-blue-300 font-bold">ThreatLens Security Operations</span>
              <span className="text-[10px] text-emerald-400 font-bold">● SYSTEM HEALTHY</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block">ACTIVE TARGETS</span>
                <span className="text-lg font-bold text-white">24</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block">PROBES / SEC</span>
                <span className="text-lg font-bold text-cyan-300">1,420</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block">RESILIENCY</span>
                <span className="text-lg font-bold text-emerald-400">98.6%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04] space-y-1 text-[11px]">
              <div className="text-emerald-400">✔ SQLi Parameter Handshake: 18 Payloads Evaluated</div>
              <div className="text-blue-300">› Rate Limiting Enforced: 429 Throttle Active</div>
              <div className="text-purple-300">› AI Threat Copilot: 3 Auto-Remediations Staged</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
