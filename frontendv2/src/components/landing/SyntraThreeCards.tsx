import React from 'react';
import { Link2, Cpu, Activity, ShieldAlert, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from '../react-bits/SpotlightCard';

export const SyntraThreeCards: React.FC = () => {
  const cards = [
    {
      id: 1,
      title: 'Connect your endpoints & repos',
      desc: 'Plug ThreatLens into public/private git repositories, REST/GraphQL APIs, OAuth portals, and Kubernetes ingress clusters.',
      icon: Link2,
      badge: 'Zero-Config Setup',
      color: '#3b82f6',
    },
    {
      id: 2,
      title: 'Build automated attack workflows',
      desc: 'Compose deep SQLi fuzzing, DOM script sinks, Slowloris load exhaustion, and entropy secret matchers into reusable assessment pipelines.',
      icon: Zap,
      badge: '7 Probing Suites',
      color: '#8b5cf6',
    },
    {
      id: 3,
      title: 'Monitor everything in real time',
      desc: 'Trace every probe response, evaluate latency differentials, identify secret leaks, and review AI-generated code fixes.',
      icon: Activity,
      badge: '24/7 Telemetry',
      color: '#06b6d4',
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="glow-pill mx-auto">
          <span className="beacon-dot" />
          <span>How ThreatLens Operates</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          From scattered targets to governed offensive security.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <SpotlightCard
              key={c.id}
              spotlightColor={`${c.color}20`}
              borderColor={`${c.color}45`}
              className="p-8 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Luminous Blue Radiant Cloud Header on top (matching ui-insp/a.webp) */}
              <div
                className="absolute -top-12 -left-12 -right-12 h-36 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none"
                style={{ backgroundColor: c.color }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{
                      backgroundColor: `${c.color}15`,
                      borderColor: `${c.color}40`,
                      boxShadow: `0 0 15px ${c.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: c.color }} />
                  </div>
                  <span
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${c.color}10`,
                      borderColor: `${c.color}30`,
                      color: c.color,
                    }}
                  >
                    {c.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Phase 0{c.id}</span>
                <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                  Explore Details →
                </span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
};
