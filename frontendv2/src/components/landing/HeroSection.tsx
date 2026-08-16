import React from 'react';
import { Shield, Sparkles, Terminal, ArrowRight, Play, CheckCircle2, Lock, Cpu, Activity, Zap } from 'lucide-react';
import { DecryptedText } from '../react-bits/DecryptedText';
import { ShinyText } from '../react-bits/ShinyText';
import { EqualizerBars } from '../react-bits/EqualizerBars';
import { useSecurity } from '../../contexts/SecurityContext';

interface HeroSectionProps {
  onLaunchConsole: () => void;
  onExploreModules: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchConsole,
  onExploreModules,
}) => {
  const { startSimulation } = useSecurity();

  const handleQuickDemo = () => {
    startSimulation({
      module: 'sqli',
      moduleName: 'Autonomous Threat Audit',
      target: 'https://staging.threatlens.io',
      options: { method: 'GET', categories: ['Error-based', 'Union-based', 'Blind'] },
    });
    onLaunchConsole();
  };

  return (
    <section className="relative pt-36 pb-20 overflow-hidden flex flex-col items-center justify-center text-center px-6">
      {/* Syntra-Inspired Luminous Overhead Light Beam */}
      <div className="hero-beam" />
      <div className="light-streak" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        {/* Luminous Live Beacon Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.25)] animate-pulse-glow">
          <span className="beacon-dot" />
          <span className="text-xs font-mono text-blue-200">
            ThreatLens 2.0 Autonomous Offensive Intelligence is Live
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-400/30">
            NEW
          </span>
        </div>

        {/* Hero Title with Cyber Scramble Decryption */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
          Probe, Audit & Harden Your Infrastructure From{' '}
          <span className="gradient-text-blue">One Command Center.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          ThreatLens equips DevSecOps teams and penetration testers to discover leaked secrets, simulate DDoS surges, fuzz SQLi/XSS vectors, and generate AI-powered remediation patches.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onLaunchConsole}
            className="cyber-btn-primary py-3.5 px-7 text-sm font-bold shadow-[0_0_25px_rgba(59,130,246,0.5)] group"
          >
            <Terminal className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
            <span>Launch Security Console</span>
            <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleQuickDemo}
            className="cyber-btn-secondary py-3.5 px-6 text-sm font-semibold hover:border-blue-500/50"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Run Live Simulation</span>
          </button>
        </div>

        {/* Syntra-Inspired Connected Handshake Interactive Console Card */}
        <div className="pt-10 max-w-3xl mx-auto w-full">
          <div className="relative rounded-2xl bg-[#090d1c]/90 border border-blue-500/30 p-5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.2)] text-left">
            {/* Top Card Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">threatlens-handshake://staging-cluster</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                <span className="text-[11px] font-mono font-semibold text-emerald-400">Connected & Intercepting</span>
              </div>
            </div>

            {/* Handshake Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Target Endpoint</div>
                <div className="text-xs font-mono font-semibold text-blue-300 mt-1 truncate">
                  https://api.threatlens.io/v1
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">✓ TLS 1.3 · HTTP/2</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Active Vectors</div>
                <div className="text-xs font-mono font-semibold text-purple-300 mt-1">
                  SQLi · XSS · Slowloris
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">42 Fuzzing Sinks</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Signal Activity</div>
                  <div className="text-xs font-mono font-semibold text-cyan-300 mt-1">98.6% Resiliency</div>
                </div>
                <EqualizerBars barCount={8} height={24} color="#06b6d4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
