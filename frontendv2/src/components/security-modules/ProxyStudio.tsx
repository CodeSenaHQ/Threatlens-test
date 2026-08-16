import React, { useState } from 'react';
import { Globe, Play, Send, Repeat, ArrowRight, Check, Code2 } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { toast } from 'sonner';

export const ProxyStudio: React.FC = () => {
  const { targetUrl, setTargetUrl, startSimulation } = useSecurity();
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [headers, setHeaders] = useState<string>(
    JSON.stringify(
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        'X-Client-Version': '2.4.0',
      },
      null,
      2
    )
  );
  const [requestBody, setRequestBody] = useState<string>(
    JSON.stringify(
      {
        action: 'transfer_funds',
        amount: 1000,
        recipient_account: 'ACC-982103',
        admin_override: false,
      },
      null,
      2
    )
  );

  const handleTamperDispatch = () => {
    if (!targetUrl) {
      toast.error('Target URL required');
      return;
    }
    startSimulation({
      module: 'proxy',
      moduleName: 'Proxy Interception & Tamper Repeat',
      target: targetUrl,
      options: { method, headers, requestBody },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Proxy Interception & Tamper Repeater Studio</h2>
            <p className="text-xs text-slate-400 font-mono">
              Intercepts raw HTTP payloads, modifies headers/tokens, and replays requests against target endpoints
            </p>
          </div>
        </div>

        <button
          onClick={handleTamperDispatch}
          className="cyber-btn-primary py-2.5 px-6 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Replay Tampered Payload</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Config */}
        <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Intercepted Request</span>
            <div className="flex gap-1.5">
              {(['GET', 'POST', 'PUT', 'DELETE'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold ${
                    method === m
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Target Endpoint</label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full bg-[#060913] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Custom HTTP Headers (JSON)</label>
            <textarea
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              rows={4}
              className="w-full bg-[#060913] border border-white/10 rounded-lg p-3 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Tampered Payload Body</label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              rows={5}
              className="w-full bg-[#060913] border border-white/10 rounded-lg p-3 text-xs text-purple-200 font-mono focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        {/* Live Interception Console */}
        <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono font-bold text-white uppercase">Proxy Inspection Log</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Listening on 127.0.0.1:8080
              </span>
            </div>

            <div className="space-y-2 mt-4 font-mono text-xs text-slate-400">
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.04] text-emerald-300">
                ✓ HTTP Handshake Intercepted: /api/v1/auth
              </div>
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.04] text-blue-300">
                › Authorization JWT Token Extracted & Decoded
              </div>
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.04] text-purple-300">
                › Replaying with admin_override = true to test IDOR vulnerability
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300">
            <strong>IDOR & Privilege Escalation:</strong> Modify user IDs, role claims, and state parameters in flight to test Broken Object Level Authorization (BOLA).
          </div>
        </div>
      </div>
    </div>
  );
};
