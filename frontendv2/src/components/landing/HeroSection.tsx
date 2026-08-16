import React from 'react';
import { Shield, Sparkles, Terminal, ArrowRight, Play, CheckCircle2, Lock, Cpu, Activity, Zap, Layers, Globe, ShieldAlert } from 'lucide-react';
import { DecryptedText } from '../react-bits/DecryptedText';
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
    <section className="syntra-hero-container">
      {/* Syntra Ambient Top Glow & Horizontal Light Streak */}
      <div className="syntra-ambient-glow" />
      <div className="syntra-light-bar" />

      {/* 4 Floating Badges in Background (Monitor, Personalized, Performance, Control from ui-insp/a.webp) */}
      <div className="hidden lg:block absolute top-40 left-8 syntra-badge opacity-75">
        <Terminal className="w-3.5 h-3.5 text-blue-400" />
        <span>Monitor</span>
      </div>
      <div className="hidden lg:block absolute top-40 right-8 syntra-badge opacity-75">
        <Lock className="w-3.5 h-3.5 text-purple-400" />
        <span>Personalized</span>
      </div>
      <div className="hidden lg:block absolute top-72 left-16 syntra-badge opacity-75">
        <Activity className="w-3.5 h-3.5 text-cyan-400" />
        <span>Performance</span>
      </div>
      <div className="hidden lg:block absolute top-72 right-16 syntra-badge opacity-75">
        <Cpu className="w-3.5 h-3.5 text-emerald-400" />
        <span>Control</span>
      </div>

      <div className="relative z-10 space-y-6 max-w-3xl mx-auto mt-4">
        {/* Luminous Live Beacon Pill Badge */}
        <div className="syntra-badge mx-auto">
          <span className="beacon-dot" />
          <span>New — Autonomous Offensive Security Layer 2.0 is Live</span>
        </div>

        {/* Hero Headline (matching ui-insp/a.webp) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Run Your Security Probes From One Command Center.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          ThreatLens helps teams audit, fuzz, simulate, and defend APIs, repositories, and cloud workloads — without losing control.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onLaunchConsole}
            className="btn-primary py-2.5 px-6"
          >
            Launch Console
          </button>

          <button
            onClick={onExploreModules}
            className="btn-secondary py-2.5 px-6"
          >
            Explore Platform
          </button>
        </div>

        {/* Syntra Center Connected Command Card (Directly from ui-insp/a.webp) */}
        <div className="pt-10 max-w-xl mx-auto w-full">
          <div className="relative rounded-2xl bg-[#0c0e18]/90 border border-blue-500/30 p-5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.2)] text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-sm text-white">threatlens</span>
                <span className="text-blue-400 font-extrabold text-xs">*</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>

            {/* Connected Services list */}
            <div className="space-y-2 pt-3">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Target Gateways · 4 Active</div>
              {[
                { name: 'FastAPI Backend Core', status: 'Protected', ping: '18ms' },
                { name: 'PostgreSQL Database URI', status: 'SQLi Monitored', ping: '32ms' },
                { name: 'OAuth 2.0 Auth Portal', status: 'Inspected', ping: '24ms' },
                { name: 'Kubernetes Ingress Cluster', status: 'Rate-Limited', ping: '45ms' },
              ].map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.04] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-slate-200 font-medium">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-slate-400">{s.ping}</span>
                    <span className="text-emerald-400">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
