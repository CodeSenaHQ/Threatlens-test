import React from 'react';
import { Layers, Bot, Sparkles, ChevronDown, Clock } from 'lucide-react';

export const ModuleUsageBars: React.FC = () => {
  const models = [
    {
      name: 'GPT- 4.0',
      count: '82k',
      percent: 82,
      gradient: 'from-[#8b5cf6] to-[#6366f1]',
      glowColor: '#8b5cf6',
      icon: '🧠',
    },
    {
      name: 'Gemini 2.5 Flash',
      count: '78k',
      percent: 78,
      gradient: 'from-[#d946ef] to-[#a855f7]',
      glowColor: '#d946ef',
      icon: '✨',
    },
    {
      name: 'Claude 4 Sonnet',
      count: '86k',
      percent: 86,
      gradient: 'from-[#ec4899] to-[#d946ef]',
      glowColor: '#ec4899',
      icon: '✴️',
    },
  ];

  return (
    <div className="rounded-3xl bg-[#090d1c]/90 border border-white/[0.08] p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl flex flex-col justify-between h-full">
      <div>
        {/* Header (Exact from Cortex Labs) */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">Usage by Type</h3>
            <span className="text-slate-500 text-xs">ⓘ</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 font-mono">
            <span>Top</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* 3 Model Usage Progress Bars */}
        <div className="space-y-5 my-2">
          {models.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{item.icon}</span>
                  <span className="font-bold text-slate-200 text-xs">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-300">{item.count}</span>
              </div>

              {/* Glowing Neon Bar Track */}
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-700`}
                  style={{
                    width: `${item.percent}%`,
                    boxShadow: `0 0 10px ${item.glowColor}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Footer (Direct from Cortex Labs design: Subscription renews 29 Jul) */}
      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-mono text-slate-400">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-transparent flex-shrink-0" />
        <span>
          Subscription renews <strong className="text-slate-200">29 Jul</strong>
        </span>
      </div>
    </div>
  );
};
