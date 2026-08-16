import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Bot, Terminal, Play, Lock, Sparkles, Check, ChevronRight } from 'lucide-react';
import { SpotlightCard } from '../react-bits/SpotlightCard';

export const PipelineVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: 'Target Discovery & Handshake',
      desc: 'Resolves DNS, verifies TLS 1.3 handshake, inspects response headers and security cookies.',
      status: 'Endpoint Verified',
    },
    {
      id: 2,
      title: 'Autonomous Attack Matrix',
      desc: 'Simulates SQLi payloads, DOM script injections, socket floods, and secret exposure sweeps.',
      status: 'Probing 128 Sinks',
    },
    {
      id: 3,
      title: 'AI Remediation & Patch Diff',
      desc: 'ThreatLens AI maps findings to OWASP Top 10, identifies root causes, and generates code fixes.',
      status: 'Patch Ready',
    },
    {
      id: 4,
      title: 'Compliance & Telemetry Report',
      desc: 'Generates signed PDF/JSON compliance audits, CVE ratings, and historical latency metrics.',
      status: 'Audit Certified',
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-[#080c1a]/90 border border-white/10 p-8 sm:p-12 backdrop-blur-2xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.12)]">
        {/* Background glow radial */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <div className="glow-pill mx-auto">
            <span className="beacon-dot" />
            <span>End-to-End Orchestration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            From target endpoint to certified defensive posture.
          </h2>
        </div>

        {/* 4 Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const isCurrent = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.3)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/15">
                      0{step.id}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {step.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Phase {step.id}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isCurrent ? 'text-blue-400' : 'text-slate-600'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
