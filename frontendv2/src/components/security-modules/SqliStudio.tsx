import React, { useState } from 'react';
import { Database, Play, Check, ChevronRight, AlertCircle, ShieldAlert, Code2, Sparkles } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { toast } from 'sonner';

export const SqliStudio: React.FC = () => {
  const { targetUrl, setTargetUrl, startSimulation } = useSecurity();
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [paramMode, setParamMode] = useState<'auto' | 'custom'>('auto');
  const [paramName, setParamName] = useState('user_id');
  const [categories, setCategories] = useState<string[]>([
    'Error-based',
    'Union-based',
    'Blind (boolean)',
    'Blind (time-based)',
  ]);
  const [fuzzDepth, setFuzzDepth] = useState<number>(32);

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      if (categories.length === 1) {
        toast.error('Select at least one injection category');
        return;
      }
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleLaunch = () => {
    if (!targetUrl) {
      toast.error('Target URL required');
      return;
    }
    startSimulation({
      module: 'sqli',
      moduleName: 'SQL Injection Assessment',
      target: targetUrl,
      options: {
        method,
        paramMode,
        paramName: paramMode === 'custom' ? paramName : 'Auto-discovered parameters',
        categories,
        fuzzDepth,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">SQL Injection Assessment Studio</h2>
            <p className="text-xs text-slate-400 font-mono">
              Fuzzes SQL database query boundaries, sanitization filters & syntax anomalies
            </p>
          </div>
        </div>

        <button
          onClick={handleLaunch}
          className="cyber-btn-primary py-2.5 px-6 text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)]"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Execute SQLi Matrix</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Wizard Parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target URL input */}
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <label className="text-xs font-mono font-semibold text-slate-300 uppercase">
              Target HTTP/HTTPS Endpoint
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://api.threatlens.io/v1/auth"
                className="w-full bg-[#060913] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Step 1: HTTP Method */}
            <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
              <div className="text-xs font-mono font-semibold text-blue-400 uppercase">
                01. HTTP Protocol Method
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['GET', 'POST'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                      method === m
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                        : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {m} Request
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Parameter Source */}
            <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
              <div className="text-xs font-mono font-semibold text-blue-400 uppercase">
                02. Parameter Target
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setParamMode('auto')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    paramMode === 'auto'
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                      : 'bg-white/[0.03] text-slate-400 border border-white/[0.06]'
                  }`}
                >
                  Auto-Discover
                </button>
                <button
                  onClick={() => setParamMode('custom')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    paramMode === 'custom'
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                      : 'bg-white/[0.03] text-slate-400 border border-white/[0.06]'
                  }`}
                >
                  Specific Field
                </button>
              </div>

              {paramMode === 'custom' && (
                <input
                  type="text"
                  value={paramName}
                  onChange={(e) => setParamName(e.target.value)}
                  placeholder="e.g. user_id, auth_token, query"
                  className="w-full bg-[#060913] border border-blue-500/30 rounded-lg px-3 py-1.5 text-xs text-blue-200 font-mono focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Step 3: Injection Categories Multi-Select */}
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <div className="text-xs font-mono font-semibold text-blue-400 uppercase">
              03. Injection Vector Categories
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'Error-based', desc: 'Syntactical error triggers (Syntax, Type conversions)' },
                { name: 'Union-based', desc: 'Data extraction via UNION SELECT structures' },
                { name: 'Blind (boolean)', desc: 'Response length & boolean true/false inferencing' },
                { name: 'Blind (time-based)', desc: 'Database sleep & benchmark latency pauses' },
              ].map((item) => {
                const isChecked = categories.includes(item.name);
                return (
                  <div
                    key={item.name}
                    onClick={() => toggleCategory(item.name)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-blue-600/20 border-blue-500/50 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center text-xs transition-colors ${
                        isChecked ? 'bg-blue-500 text-white' : 'border border-white/20'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Payload Matrix Preview */}
        <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono font-bold text-white uppercase">Payload Matrix Preview</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                18 Payloads
              </span>
            </div>

            <div className="space-y-2 mt-4 font-mono text-[11px]">
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-blue-300">
                &apos; OR 1=1 --
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-purple-300">
                &apos; UNION SELECT null, username, password FROM users--
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-cyan-300">
                &apos; AND (SELECT 1 FROM (SELECT(SLEEP(5)))a)--
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-amber-300">
                &apos; AND ASCII(SUBSTRING((SELECT database()),1,1)) &gt; 64--
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-blue-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Payload Engine</span>
            </div>
            ThreatLens adapts fuzz payloads dynamically based on DBMS dialect detection (PostgreSQL, MySQL, SQLite, Oracle).
          </div>
        </div>
      </div>
    </div>
  );
};
