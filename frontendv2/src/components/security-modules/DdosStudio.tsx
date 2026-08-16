import React, { useState } from 'react';
import { Zap, Play, Radio, Activity, ShieldAlert, Sliders } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { toast } from 'sonner';

export const DdosStudio: React.FC = () => {
  const { targetUrl, setTargetUrl, startSimulation } = useSecurity();
  const [pattern, setPattern] = useState<'Flood' | 'Slowloris-style' | 'Burst-spike'>('Flood');
  const [intensity, setIntensity] = useState<'Light' | 'Medium' | 'Heavy'>('Medium');
  const [duration, setDuration] = useState<'10s' | '30s' | '60s' | 'Custom'>('30s');
  const [customSec, setCustomSec] = useState('45');
  const [connections, setConnections] = useState(250);

  const handleLaunch = () => {
    if (!targetUrl) {
      toast.error('Target URL required');
      return;
    }
    startSimulation({
      module: 'ddos',
      moduleName: 'DDoS Concurrency Stress Test',
      target: targetUrl,
      options: {
        pattern,
        intensity,
        duration: duration === 'Custom' ? `${customSec}s` : duration,
        connections,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">DDoS Concurrency & Load Stress Studio</h2>
            <p className="text-xs text-slate-400 font-mono">
              Simulates high-throughput socket exhaustion, HTTP floods, and burst concurrency traffic
            </p>
          </div>
        </div>

        <button
          onClick={handleLaunch}
          className="cyber-btn-primary py-2.5 px-6 text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Launch Stress Simulation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wizard Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target */}
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <label className="text-xs font-mono font-semibold text-slate-300 uppercase">
              Target Infrastructure Endpoint
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://staging.threatlens.io"
              className="w-full bg-[#060913] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Step 1: Attack Pattern */}
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <div className="text-xs font-mono font-semibold text-cyan-400 uppercase">
              01. Attack Load Profile
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Flood' as const, desc: 'Maximum RPS throughput flood to test rate limits' },
                { name: 'Slowloris-style' as const, desc: 'Slow HTTP headers to hold sockets open until exhaustion' },
                { name: 'Burst-spike' as const, desc: 'Microsecond traffic spikes simulating sudden viral surges' },
              ].map((p) => (
                <div
                  key={p.name}
                  onClick={() => setPattern(p.name)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    pattern === p.name
                      ? 'bg-cyan-600/20 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                  }`}
                >
                  <span className="font-bold text-xs text-white mb-1">{p.name}</span>
                  <p className="text-[10px] text-slate-400">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 & 3: Intensity & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Intensity */}
            <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
              <div className="text-xs font-mono font-semibold text-cyan-400 uppercase">
                02. Concurrency Intensity
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['Light', 'Medium', 'Heavy'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setIntensity(lvl);
                      setConnections(lvl === 'Light' ? 50 : lvl === 'Medium' ? 250 : 1000);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all ${
                      intensity === lvl
                        ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/50'
                        : 'bg-white/[0.02] text-slate-400 border border-white/[0.06]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
              <div className="text-xs font-mono font-semibold text-cyan-400 uppercase">
                03. Test Duration
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['10s', '30s', '60s', 'Custom'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all ${
                      duration === d
                        ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/50'
                        : 'bg-white/[0.02] text-slate-400 border border-white/[0.06]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Gauges Preview */}
        <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono font-bold text-white uppercase">Traffic Telemetry Gauge</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                {connections} Sockets
              </span>
            </div>

            <div className="space-y-4 mt-6 text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32">
                  <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="8"
                    strokeDasharray="340"
                    strokeDashoffset={intensity === 'Light' ? 240 : intensity === 'Medium' ? 140 : 40}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold text-white font-heading">
                    {intensity === 'Light' ? '120' : intensity === 'Medium' ? '540' : '2,400'}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 block">REQ / SEC</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                  <span className="text-slate-500 block text-[10px]">PATTERN</span>
                  <span className="font-bold text-cyan-300">{pattern}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                  <span className="text-slate-500 block text-[10px]">TIME WINDOW</span>
                  <span className="font-bold text-white">{duration}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-slate-300">
            <strong>Safe Stress Testing:</strong> ThreatLens implements real-time abort triggers if target latency exceeds 5000ms.
          </div>
        </div>
      </div>
    </div>
  );
};
