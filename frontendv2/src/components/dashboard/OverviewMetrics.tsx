import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Layers, Sliders, ChevronDown } from 'lucide-react';
import { MOCK_CHART_DATA } from '../../lib/mockData';
import { AnimatedCounter } from '../react-bits/AnimatedCounter';

export const OverviewMetrics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'Month' | 'Week' | '24h'>('Month');
  const [hoveredData, setHoveredData] = useState<any>(MOCK_CHART_DATA[4]); // default July

  // Dynamic values depending on active time range
  const afterHardeningValue = timeRange === 'Month' ? '$87,450' : timeRange === 'Week' ? '$21,860' : '$4,920';
  const beforeHardeningValue = timeRange === 'Month' ? '$52,310' : timeRange === 'Week' ? '$14,120' : '$3,180';
  const deltaValue = timeRange === 'Month' ? '+10.6%' : timeRange === 'Week' ? '+14.2%' : '+18.5%';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome Back, Michael
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Security Telemetry Cluster: <span className="text-emerald-400 font-bold">All 5 Nodes Active</span> · Last updated 30 sec ago
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            {(['Month', 'Week', '24h'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === t
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Cortex Labs Campaign Performance Chart Card */}
      <div className="rounded-3xl bg-[#090d1c]/90 border border-white/[0.08] p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        {/* Header with Dual Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              <span>Attack Surface Resiliency & Hardening</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-blue-400 font-semibold">Real-Time Telemetry</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-6">
              {/* After Hardening Metric */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold text-white font-heading">
                    {afterHardeningValue}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    {deltaValue}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                  <span className="text-xs text-slate-300 font-medium">After Threat Hardening</span>
                </div>
              </div>

              {/* Before Hardening Metric */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-400 font-heading">
                    {beforeHardeningValue}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                    <ArrowDownRight className="w-3 h-3 mr-0.5" />
                    -09.12%
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#8b5cf6]" />
                  <span className="text-xs text-slate-400 font-medium">Before Threat Hardening</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Tooltip Card Preview (Jul 27 from image.png) */}
          <div className="p-3.5 rounded-xl bg-[#0e1428] border border-blue-500/30 shadow-lg text-xs font-mono space-y-1.5 min-w-[200px]">
            <div className="text-slate-400 font-bold border-b border-white/[0.08] pb-1 flex items-center justify-between">
              <span>{hoveredData.month} Telemetry</span>
              <span className="text-[10px] text-emerald-400">● LIVE</span>
            </div>
            <div className="flex items-center justify-between text-blue-300">
              <span>■ After Hardening:</span>
              <span className="font-bold text-emerald-400">+14.06%</span>
            </div>
            <div className="flex items-center justify-between text-purple-300">
              <span>■ Before Hardening:</span>
              <span className="font-bold text-rose-400">-0.42%</span>
            </div>
            <div className="text-[10px] text-slate-500 pt-0.5 border-t border-white/[0.04]">
              Latency: {hoveredData.latency}ms · {hoveredData.threatsBlocked} Blocked
            </div>
          </div>
        </div>

        {/* SVG Gradient Wave Area Chart */}
        <div className="relative h-64 w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            <line x1="0" y1="40" x2="700" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="700" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1="0" y1="140" x2="700" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1="0" y1="190" x2="700" y2="190" stroke="rgba(255,255,255,0.08)" />

            {/* Before AI Area (Purple) */}
            <path
              d="M 0,110 Q 116,90 233,120 T 466,80 T 700,130 L 700,190 L 0,190 Z"
              fill="url(#purpleAreaGrad)"
            />
            <path
              d="M 0,110 Q 116,90 233,120 T 466,80 T 700,130"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2.5"
            />

            {/* After AI Area (Blue) */}
            <path
              d="M 0,150 Q 116,110 233,70 T 466,45 T 700,25 L 700,190 L 0,190 Z"
              fill="url(#blueAreaGrad)"
            />
            <path
              d="M 0,150 Q 116,110 233,70 T 466,45 T 700,25"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
            />

            {/* Glowing Peak Points */}
            <circle cx="466" cy="45" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" className="animate-ping" />
            <circle cx="466" cy="45" r="4" fill="#60a5fa" />
            <circle cx="466" cy="80" r="4" fill="#a855f7" />
          </svg>

          {/* Month Axis Labels */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-white/[0.06]">
            {MOCK_CHART_DATA.map((d) => (
              <span
                key={d.month}
                onMouseEnter={() => setHoveredData(d)}
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors ${
                  hoveredData.month === d.month
                    ? 'text-blue-300 font-bold bg-blue-500/20'
                    : 'hover:text-slate-300'
                }`}
              >
                {d.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
