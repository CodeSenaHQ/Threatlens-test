import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Layers, Sliders, ChevronDown, Info } from 'lucide-react';
import { MOCK_CHART_DATA } from '../../lib/mockData';

export const OverviewMetrics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'Month' | 'Week' | '24h'>('Month');
  const [hoveredData, setHoveredData] = useState<any>(MOCK_CHART_DATA[4]); // default July

  // Dynamic values depending on active time range
  const afterValue = timeRange === 'Month' ? '$87,450' : timeRange === 'Week' ? '$21,860' : '$4,920';
  const beforeValue = timeRange === 'Month' ? '$52,310' : timeRange === 'Week' ? '$14,120' : '$3,180';
  const deltaValue = timeRange === 'Month' ? '+10.6%' : timeRange === 'Week' ? '+14.2%' : '+18.5%';

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Welcome Back, Michael
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Last updated 30 sec ago
        </p>
      </div>

      {/* Main Campaign Performance Card (Directly from Cortex Labs image.png) */}
      <div className="rounded-3xl bg-[#090d1c]/90 border border-white/[0.08] p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">Campaign Performance</h3>
            <span className="text-slate-500 text-xs">ⓘ</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 font-mono cursor-pointer">
              <span>{timeRange}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <button className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white transition-colors">
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dual Value Row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 mb-6">
          <div className="flex flex-wrap items-baseline gap-8">
            {/* After AI Value */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-white font-heading">
                  {afterValue}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {deltaValue}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#8b5cf6]" />
                <span className="text-xs text-slate-300 font-medium">After AI Implementation</span>
              </div>
            </div>

            {/* Before AI Value */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-400 font-heading">
                  {beforeValue}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  -09.12%
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#ec4899]" />
                <span className="text-xs text-slate-400 font-medium">Before AI Implementation</span>
              </div>
            </div>
          </div>

          {/* Interactive Jul 27 Telemetry Tooltip Card (Exact from image.png) */}
          <div className="p-3 rounded-xl bg-[#0e1428] border border-blue-500/30 shadow-lg text-xs font-mono space-y-1 min-w-[170px]">
            <div className="text-slate-300 font-bold border-b border-white/[0.08] pb-1">
              Jul 27
            </div>
            <div className="flex items-center justify-between text-blue-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#8b5cf6]" />
                After AI:
              </span>
              <span className="font-bold text-emerald-400">+14.06%</span>
            </div>
            <div className="flex items-center justify-between text-pink-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#ec4899]" />
                Before AI:
              </span>
              <span className="font-bold text-rose-400">-0.42%</span>
            </div>
          </div>
        </div>

        {/* SVG Dual Wave Graph */}
        <div className="relative h-48 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="purpleWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="pinkWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            <line x1="0" y1="35" x2="700" y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="700" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="125" x2="700" y2="125" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="170" x2="700" y2="170" stroke="rgba(255,255,255,0.08)" />

            {/* Pink Wave (Before AI) */}
            <path
              d="M 0,100 Q 116,70 233,110 T 466,60 T 700,110 L 700,170 L 0,170 Z"
              fill="url(#pinkWave)"
            />
            <path
              d="M 0,100 Q 116,70 233,110 T 466,60 T 700,110"
              fill="none"
              stroke="#ec4899"
              strokeWidth="2.5"
            />

            {/* Purple Wave (After AI) */}
            <path
              d="M 0,140 Q 116,90 233,50 T 466,35 T 700,20 L 700,170 L 0,170 Z"
              fill="url(#purpleWave)"
            />
            <path
              d="M 0,140 Q 116,90 233,50 T 466,35 T 700,20"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="3"
            />

            {/* Glowing Peak Points on Jul 27 (x=466) */}
            <circle cx="466" cy="35" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
            <circle cx="466" cy="60" r="5" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
          </svg>

          {/* Month Labels Axis */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-white/[0.06]">
            {MOCK_CHART_DATA.map((d) => (
              <span
                key={d.month}
                onMouseEnter={() => setHoveredData(d)}
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors ${
                  hoveredData.month === d.month
                    ? 'text-purple-300 font-bold bg-purple-500/20'
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
