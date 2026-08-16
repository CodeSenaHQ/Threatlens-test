import React, { useState } from 'react';
import { Sliders, Play, Check, ShieldCheck, Activity, Gauge } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { toast } from 'sonner';

export const RateLimitStudio: React.FC = () => {
  const { targetUrl, setTargetUrl, startSimulation } = useSecurity();
  const [requestCount, setRequestCount] = useState(100);
  const [concurrency, setConcurrency] = useState(10);
  const [ipRotation, setIpRotation] = useState(false);
  const [expectedStatus, setExpectedStatus] = useState('429');

  const handleLaunch = () => {
    if (!targetUrl) {
      toast.error('Target URL required');
      return;
    }
    startSimulation({
      module: 'ratelimit',
      moduleName: 'Rate Limit Threshold & Concurrency Assessment',
      target: targetUrl,
      options: { requestCount, concurrency, ipRotation, expectedStatus },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Rate Limiting & Throttle Boundary Studio</h2>
            <p className="text-xs text-slate-400 font-mono">
              Stress tests HTTP 429 &apos;Too Many Requests&apos; thresholds, sliding window limits & recovery backoff
            </p>
          </div>
        </div>

        <button
          onClick={handleLaunch}
          className="cyber-btn-primary py-2.5 px-6 text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Execute Throttle Probe</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <label className="text-xs font-mono font-semibold text-slate-300 uppercase">
              Target API Rate-Limited Endpoint
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://api.threatlens.io/v1/login"
              className="w-full bg-[#060913] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-rose-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
              <label className="text-xs font-mono font-semibold text-rose-400 uppercase">
                Total Request Batch
              </label>
              <input
                type="number"
                value={requestCount}
                onChange={(e) => setRequestCount(Number(e.target.value))}
                className="w-full bg-[#060913] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">Total requests dispatched in the test window</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
              <label className="text-xs font-mono font-semibold text-rose-400 uppercase">
                Concurrency Threads
              </label>
              <input
                type="number"
                value={concurrency}
                onChange={(e) => setConcurrency(Number(e.target.value))}
                className="w-full bg-[#060913] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">Simultaneous parallel worker sockets</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono font-bold text-white uppercase">429 Compliance</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                Threshold Monitor
              </span>
            </div>
            <div className="space-y-3 mt-4 text-xs font-mono text-slate-400">
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.04] text-slate-300">
                Header: Retry-After check
              </div>
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.04] text-slate-300">
                Header: X-RateLimit-Remaining check
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/20 text-xs text-slate-300">
            <strong>DDoS Prevention:</strong> Endpoints without strict 429 throttling are vulnerable to brute-force credential stuffing and resource starvation.
          </div>
        </div>
      </div>
    </div>
  );
};
