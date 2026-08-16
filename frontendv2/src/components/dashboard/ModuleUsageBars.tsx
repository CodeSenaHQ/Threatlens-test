import React from 'react';
import { Layers, Database, Code2, Zap, FolderGit2, ShieldAlert, ChevronDown } from 'lucide-react';
import { MOCK_MODULE_USAGE } from '../../lib/mockData';

export const ModuleUsageBars: React.FC = () => {
  return (
    <div className="rounded-3xl bg-[#090d1c]/90 border border-white/[0.08] p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">Usage by Scanner Suite</h3>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 font-mono">
            <span>Top</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Multi-Scanner Neon Progress Bars */}
        <div className="space-y-4">
          {MOCK_MODULE_USAGE.map((item, idx) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
                  />
                  <span className="font-semibold text-slate-200">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[11px] text-slate-400">{item.badge}</span>
                  <span className="font-bold text-white">{item.count}</span>
                </div>
              </div>

              {/* Glowing Progress Bar Track */}
              <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden p-0.5 border border-white/[0.04]">
                <div
                  className="h-full rounded-full transition-all duration-700 relative"
                  style={{
                    width: `${item.percent}%`,
                    background: `linear-gradient(90deg, ${item.color}99, ${item.color})`,
                    boxShadow: `0 0 10px ${item.color}66`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Footer Status */}
      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Automated Probing Schedule</span>
        </div>
        <span className="text-blue-400">Continuous 24/7</span>
      </div>
    </div>
  );
};
