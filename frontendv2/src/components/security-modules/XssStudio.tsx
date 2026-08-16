import React, { useState } from 'react';
import { Code2, Play, Check, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { toast } from 'sonner';

export const XssStudio: React.FC = () => {
  const { targetUrl, setTargetUrl, startSimulation } = useSecurity();
  const [categories, setCategories] = useState<string[]>(['Reflected', 'Stored', 'DOM-based']);
  const [vectors, setVectors] = useState<string[]>(['Query Parameters', 'Form Bodies', 'HTTP Headers']);
  const [encodingBypass, setEncodingBypass] = useState<boolean>(true);

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      if (categories.length === 1) {
        toast.error('Select at least one XSS category');
        return;
      }
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const toggleVector = (vec: string) => {
    if (vectors.includes(vec)) {
      if (vectors.length === 1) {
        toast.error('Select at least one injection vector');
        return;
      }
      setVectors(vectors.filter((v) => v !== vec));
    } else {
      setVectors([...vectors, vec]);
    }
  };

  const handleLaunch = () => {
    if (!targetUrl) {
      toast.error('Target URL required');
      return;
    }
    startSimulation({
      module: 'xss',
      moduleName: 'Cross-Site Scripting (XSS) Assessment',
      target: targetUrl,
      options: { categories, vectors, encodingBypass },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Cross-Site Scripting (XSS) Studio</h2>
            <p className="text-xs text-slate-400 font-mono">
              Audits input reflection, DOM execution sinks, script context sanitization & CSP policies
            </p>
          </div>
        </div>

        <button
          onClick={handleLaunch}
          className="cyber-btn-glow py-2.5 px-6 text-xs font-bold"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Launch XSS Scanner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wizard Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target URL */}
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <label className="text-xs font-mono font-semibold text-slate-300 uppercase">
              Target Web Application Endpoint
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://staging.threatlens.io"
              className="w-full bg-[#060913] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Categories */}
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <div className="text-xs font-mono font-semibold text-purple-400 uppercase">
              01. XSS Vulnerability Categories
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Reflected', desc: 'Direct reflection in response body' },
                { name: 'Stored', desc: 'Persistent DB script injection sinks' },
                { name: 'DOM-based', desc: 'Client JavaScript eval/innerHTML sinks' },
              ].map((c) => {
                const isChecked = categories.includes(c.name);
                return (
                  <div
                    key={c.name}
                    onClick={() => toggleCategory(c.name)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isChecked
                        ? 'bg-purple-600/20 border-purple-500/50 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-white">{c.name}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-xs ${
                          isChecked ? 'bg-purple-500 text-white' : 'border border-white/20'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vectors */}
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <div className="text-xs font-mono font-semibold text-purple-400 uppercase">
              02. Primary Injection Vectors
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Query Parameters', 'Form Bodies', 'HTTP Headers', 'Cookie Sinks'].map((v) => {
                const isChecked = vectors.includes(v);
                return (
                  <button
                    key={v}
                    onClick={() => toggleVector(v)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-center transition-all ${
                      isChecked
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                        : 'bg-white/[0.02] text-slate-400 border border-white/[0.06]'
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payload Preview */}
        <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono font-bold text-white uppercase">XSS Payload Sinks</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                WAF Bypass Active
              </span>
            </div>

            <div className="space-y-2 mt-4 font-mono text-[11px]">
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-purple-300">
                &lt;script&gt;alert(document.domain)&lt;/script&gt;
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-blue-300">
                &lt;img src=x onerror=alert(1)&gt;
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-cyan-300">
                &lt;svg onload=eval(atob(&apos;...&apos;))&gt;
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-amber-300">
                javascript:/*--&gt;&lt;/title&gt;&lt;/style&gt;&lt;/textarea&gt;&lt;script&gt;
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-purple-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Context-Aware Reflection</span>
            </div>
            ThreatLens tests DOM contexts including inline scripts, event attributes, SVG tags, and JSON payloads.
          </div>
        </div>
      </div>
    </div>
  );
};
