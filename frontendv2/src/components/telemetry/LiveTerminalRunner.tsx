import React, { useState, useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, Play, Square, Download, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, Copy } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { toast } from 'sonner';

export const LiveTerminalRunner: React.FC = () => {
  const { simulationParams, isSimulating, stopSimulation, openCopilot } = useSecurity();
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<{ id: string; time: string; text: string; type: 'info' | 'success' | 'warn' | 'crit' }[]>([]);
  const [isDone, setIsDone] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const moduleTitle = simulationParams?.moduleName || 'Autonomous Offensive Threat Audit';
  const target = simulationParams?.target || 'https://staging.threatlens.io';

  const STAGES = [
    { text: 'Resolving target endpoint DNS and TLS 1.3 telemetry handshake...', type: 'info' as const },
    { text: 'Target HTTP/2 socket verified with 42ms baseline latency (200 OK)', type: 'success' as const },
    { text: 'Generating comprehensive security assessment test vectors...', type: 'info' as const },
    { text: 'Dispatching payload matrix against query parameters & headers...', type: 'info' as const },
    { text: 'Testing SQL syntax error reflection: 18 payloads dispatched', type: 'warn' as const },
    { text: 'Evaluating latency differentials and error boundary responses...', type: 'info' as const },
    { text: 'CRITICAL: Detected Blind time-based anomaly on parameter: user_id', type: 'crit' as const },
    { text: 'Verifying rate limiting threshold (HTTP 429 backoff)', type: 'info' as const },
    { text: 'Finalizing vulnerability intelligence telemetry and report manifest...', type: 'success' as const },
    { text: 'Assessment complete: 1 Critical, 2 Medium findings registered in session', type: 'success' as const },
  ];

  useEffect(() => {
    setProgress(0);
    setLogs([]);
    setIsDone(false);

    let current = 0;
    let stepIndex = 0;

    const interval = setInterval(() => {
      current += 6;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setIsDone(true);
        clearInterval(interval);
      } else {
        setProgress(current);
        const stageToPush = STAGES[stepIndex];
        if (stageToPush && current > stepIndex * 10) {
          const now = new Date().toLocaleTimeString();
          setLogs((prev) => [
            ...prev,
            { id: Math.random().toString(), time: now, text: stageToPush.text, type: stageToPush.type },
          ]);
          stepIndex++;
        }
      }
    }, 180);

    return () => clearInterval(interval);
  }, [simulationParams]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleExport = () => {
    toast.success('Downloaded ThreatLens Telemetry Report (JSON)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isDone ? 'bg-emerald-400' : 'bg-blue-400 animate-ping'}`} />
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isDone ? `${moduleTitle.toUpperCase()} COMPLETE` : `LIVE EXECUTION: ${moduleTitle.toUpperCase()}`}
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Target Endpoint: <span className="text-blue-300 font-bold">{target}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDone ? (
            <button
              onClick={handleExport}
              className="cyber-btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          ) : (
            <button
              onClick={stopSimulation}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-rose-300" />
              <span>Abort Execution</span>
            </button>
          )}

          <button
            onClick={() => openCopilot(`Explain the telemetry findings for ${moduleTitle} and provide code patches`)}
            className="cyber-btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot Fix</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Stage Indicator */}
      <div className="p-6 rounded-3xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3 shadow-2xl">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 uppercase">Assessment Progress</span>
          <span className="text-blue-300 font-bold">{progress}% Completed</span>
        </div>

        {/* Stepping Progress Bar */}
        <div className="h-3 w-full bg-white/[0.05] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isDone
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_#10b981]'
                : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 shadow-[0_0_15px_#3b82f6]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Live ANSI Cyber Terminal */}
      <div className="rounded-3xl bg-[#050711] border border-white/10 shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="px-5 py-3 bg-[#080b18] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-slate-400 ml-2">threatlens-engine@secops:~/{simulationParams?.module || 'audit'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <span>TLS 1.3 · UTF-8</span>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="p-6 h-80 overflow-y-auto space-y-2 select-text">
          <div className="text-blue-400">
            [ThreatLensGo 2.0 Telemetry Stream Initialized]
          </div>
          <div className="text-slate-500">
            Scanning node: cluster-us-east-1 // Protocol: HTTP/2 // Encryption: TLS_AES_256_GCM_SHA384
          </div>

          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2.5 animate-in fade-in">
              <span className="text-slate-600 shrink-0">[{log.time}]</span>
              {log.type === 'success' && (
                <span className="text-emerald-400 shrink-0 font-bold">✔</span>
              )}
              {log.type === 'warn' && (
                <span className="text-amber-400 shrink-0 font-bold">▲</span>
              )}
              {log.type === 'crit' && (
                <span className="text-rose-400 shrink-0 font-bold">✖</span>
              )}
              {log.type === 'info' && (
                <span className="text-blue-400 shrink-0">›</span>
              )}
              <span
                className={
                  log.type === 'success'
                    ? 'text-emerald-300'
                    : log.type === 'crit'
                    ? 'text-rose-300 font-bold bg-rose-500/10 px-1 rounded'
                    : log.type === 'warn'
                    ? 'text-amber-300'
                    : 'text-slate-300'
                }
              >
                {log.text}
              </span>
            </div>
          ))}

          {!isDone && (
            <div className="flex items-center gap-2 text-blue-400 animate-pulse pt-2">
              <span className="w-2 h-4 bg-blue-400 inline-block" />
              <span>Inspecting response buffers...</span>
            </div>
          )}

          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};
