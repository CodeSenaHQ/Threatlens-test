import React, { useState } from 'react';
import { ShieldAlert, Play, Check, AlertTriangle, Search, Lock } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { toast } from 'sonner';

export const ExfilStudio: React.FC = () => {
  const { targetUrl, setTargetUrl, startSimulation } = useSecurity();
  const [probeActuators, setProbeActuators] = useState(true);
  const [probeStackTrace, setProbeStackTrace] = useState(true);
  const [probeHeaderLeaks, setProbeHeaderLeaks] = useState(true);
  const [probeGitExposure, setProbeGitExposure] = useState(true);

  const handleLaunch = () => {
    if (!targetUrl) {
      toast.error('Target URL required');
      return;
    }
    startSimulation({
      module: 'exfil',
      moduleName: 'Data Exfiltration & Exposure Audit',
      target: targetUrl,
      options: { probeActuators, probeStackTrace, probeHeaderLeaks, probeGitExposure },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Data Exfiltration & Sensitive Disclosure Studio</h2>
            <p className="text-xs text-slate-400 font-mono">
              Crawls endpoints for debug dumps, unauthenticated actuator routes, environment variables & headers
            </p>
          </div>
        </div>

        <button
          onClick={handleLaunch}
          className="cyber-btn-primary py-2.5 px-6 text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Launch Exposure Scan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <label className="text-xs font-mono font-semibold text-slate-300 uppercase">
              Target API Base URL
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://api.threatlens.io"
              className="w-full bg-[#060913] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Sinks */}
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <div className="text-xs font-mono font-semibold text-amber-400 uppercase">
              Exposure Discovery Modules
            </div>

            <div className="space-y-2.5">
              {[
                {
                  state: probeActuators,
                  setter: setProbeActuators,
                  title: 'Spring Actuator & Debug Endpoints (/actuator, /env, /metrics, /heapdump)',
                  desc: 'Probes 64 commonly unauthenticated management and profiling routes.',
                },
                {
                  state: probeStackTrace,
                  setter: setProbeStackTrace,
                  title: 'Unhandled Exception & Stack Trace Extraction',
                  desc: 'Sends malformed JSON and headers to trigger verbose error pages with database schema names.',
                },
                {
                  state: probeHeaderLeaks,
                  setter: setProbeHeaderLeaks,
                  title: 'Server Banner & Internal IP Response Disclosure',
                  desc: 'Inspects Server, X-Powered-By, and X-Backend-Server response headers.',
                },
                {
                  state: probeGitExposure,
                  setter: setProbeGitExposure,
                  title: 'Public /.git/HEAD & Configuration File Crawler',
                  desc: 'Checks for accidentally exposed .git directory, .env, and docker-compose.yml on web roots.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => item.setter(!item.state)}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    item.state
                      ? 'bg-amber-600/20 border-amber-500/50 text-white'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                  }`}
                >
                  <div className="pr-4">
                    <div className="font-semibold text-xs text-white">{item.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded shrink-0 flex items-center justify-center text-xs ${
                      item.state ? 'bg-amber-500 text-white' : 'border border-white/20'
                    }`}
                  >
                    {item.state && <Check className="w-3 h-3" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono font-bold text-white uppercase">Sensitive Endpoints</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                64 Paths
              </span>
            </div>

            <div className="space-y-2 mt-4 font-mono text-[11px]">
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-amber-300">
                GET /actuator/env
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-orange-300">
                GET /.git/config
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-yellow-300">
                GET /swagger-ui/index.html
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-amber-200">
                POST /api/graphql (Introspection)
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/20 text-xs text-slate-300">
            <strong>Disclosure Severity:</strong> Unhandled debug endpoints can reveal live database passwords and cloud credentials without any authentication.
          </div>
        </div>
      </div>
    </div>
  );
};
