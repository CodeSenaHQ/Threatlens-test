import React, { useState } from 'react';
import { Activity, ArrowUpRight, ChevronDown } from 'lucide-react';
import { MOCK_EQUALIZER_WEEK } from '../../lib/mockData';

export const EqualizerTrafficChart: React.FC = () => {
  const [hoveredDay, setHoveredDay] = useState<any>(MOCK_EQUALIZER_WEEK[4]); // default Wed
  const [filter, setFilter] = useState<'Week' | 'Month'>('Week');

  return (
    <div className="rounded-3xl bg-[#090d1c]/90 border border-white/[0.08] p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Live Threat Payload & Token Consumption
            </h3>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl font-extrabold text-white font-heading">
              2.19m
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +08.13%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 font-mono">
          <span>Week</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* Interactive Tooltip Card Preview (Wed 38k from image.png) */}
      <div className="relative pt-6 pb-2">
        {/* Equalizer Soundwave Columns for 7 Days */}
        <div className="grid grid-cols-7 gap-3 items-end h-36 border-b border-white/[0.06] pb-2">
          {MOCK_EQUALIZER_WEEK.map((item, index) => {
            const isHovered = hoveredDay.day === item.day;
            // Generate multiple small vertical segments like an audio equalizer
            const segmentCount = 14;
            const filledSegments = Math.round((item.height / 100) * segmentCount);

            return (
              <div
                key={item.day}
                onMouseEnter={() => setHoveredDay(item)}
                className="flex flex-col items-center gap-1 cursor-pointer group relative"
              >
                {/* Floating Tooltip when hovered */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 px-2.5 py-1 rounded-lg bg-[#0d142b] border border-blue-500/50 shadow-xl text-[10px] font-mono text-white whitespace-nowrap animate-in fade-in">
                    <span className="text-slate-400">Tokens: </span>
                    <strong className="text-blue-300">{item.usage}</strong>
                    <div className="text-[9px] text-emerald-400">{item.attackSpikes} Attack Spikes</div>
                  </div>
                )}

                {/* Vertical Equalizer Segment Stack */}
                <div className="flex flex-col-reverse gap-[2px] w-full max-w-[28px]">
                  {Array.from({ length: segmentCount }).map((_, sIdx) => {
                    const isFilled = sIdx < filledSegments;
                    return (
                      <div
                        key={sIdx}
                        className={`h-[4px] w-full rounded-sm transition-all duration-300 ${
                          isFilled
                            ? isHovered
                              ? 'bg-gradient-to-r from-purple-500 to-blue-400 shadow-[0_0_6px_#60a5fa]'
                              : 'bg-gradient-to-r from-purple-600/70 to-blue-600/70'
                            : 'bg-white/[0.04]'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Day label */}
                <span
                  className={`text-[11px] font-mono mt-2 transition-colors ${
                    isHovered ? 'text-blue-300 font-bold' : 'text-slate-500'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
