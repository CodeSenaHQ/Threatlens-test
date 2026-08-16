import React, { useState } from 'react';
import { Layers, ShieldCheck, Terminal, Bot, Sparkles, ChevronLeft, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from '../react-bits/SpotlightCard';

export const SyntraWorkflowTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      title: 'Workflow & Attack Control',
      desc: 'Compose, branch, and gate pentest steps with human-in-the-loop approvals and safe abort bounds.',
      features: ['Automated Payload Sequencing', 'Real-Time Abort Triggers', 'Multi-Vector Branching'],
    },
    {
      id: 1,
      title: 'Monitoring & Telemetry Logs',
      desc: 'Full execution traces, probe replay, latency differential tracking, and structured event telemetry.',
      features: ['HTTP/2 TLS Trace Stream', '429 Throttle Profiling', 'Database Anomaly Flagging'],
    },
    {
      id: 2,
      title: 'Governance & Policy Layer',
      desc: 'OWASP Top 10 mapping, CWE compliance matrices, signed attestation reports, and role-based access.',
      features: ['Automated Audit Manifests', 'CWE-89 & CWE-79 Compliance', 'Exportable PDF/JSON Reports'],
    },
    {
      id: 3,
      title: 'Threat Registry & CVE Catalog',
      desc: 'One unified catalog for every API gateway, secret entropy rule, and known CVE dependency signature.',
      features: ['Shannon Entropy Secret Rules', 'NVD Advisories Synchronizer', 'Dynamic DBMS Dialect Prober'],
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="glow-pill mx-auto">
          <span className="beacon-dot" />
          <span>Unified Governance & Orchestration</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Bring every vector, workflow, and finding into one system.
        </h2>
      </div>

      {/* Tabs Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="text-xs font-bold mb-1">{tab.title}</div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{tab.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Syntra-Inspired Workflow Stage Visualizer with Center Star & Glow Cards */}
      <div className="relative rounded-3xl bg-[#080c1a]/90 border border-white/10 p-8 sm:p-12 backdrop-blur-2xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.15)]">
        {/* Center Blue Ambient Light Flare */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          {/* Left Cards */}
          <div className="md:col-span-2 space-y-3">
            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08] space-y-1">
              <div className="text-[10px] font-mono text-blue-400 uppercase">ACTIVE POLICY</div>
              <div className="text-xs font-bold text-white">{tabs[activeTab].title}</div>
              <div className="text-[11px] text-slate-400">{tabs[activeTab].desc}</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase">CAPABILITIES</div>
              {tabs[activeTab].features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center Glowing Cyber Star Emblem */}
          <div className="flex flex-col items-center justify-center p-6">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-[0_0_40px_rgba(59,130,246,0.6)] animate-pulse-glow">
              <div className="w-full h-full bg-[#060914] rounded-[22px] flex items-center justify-center">
                <Sparkles className="w-9 h-9 text-blue-300 animate-spin" style={{ animationDuration: '12s' }} />
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-300 mt-3 tracking-widest uppercase">
              ORCHESTRATION ENGINE
            </span>
          </div>

          {/* Right Cards */}
          <div className="md:col-span-2 space-y-3">
            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>STAGE LOGS</span>
                <span className="text-emerald-400">STATUS: ACTIVE</span>
              </div>
              <div className="text-blue-300">› Telemetry Stream: 18 Payloads Evaluated</div>
              <div className="text-purple-300">› Response Diff Latency: 48ms</div>
              <div className="text-cyan-300">› Zero-Day Protection Enforced</div>
            </div>

            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
              <strong>Autonomous Execution:</strong> Policies automatically gate deployments if high-severity SQLi, unhashed secrets, or unthrottled endpoints are detected.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
