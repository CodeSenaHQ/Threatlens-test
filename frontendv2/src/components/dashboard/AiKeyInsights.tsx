import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Send, Bot, ShieldCheck, Zap, Layers } from 'lucide-react';
import { GlowingOrb } from '../react-bits/GlowingOrb';
import { useSecurity } from '../../contexts/SecurityContext';
import { toast } from 'sonner';

export const AiKeyInsights: React.FC = () => {
  const { openCopilot } = useSecurity();
  const [promptText, setPromptText] = useState('');

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    openCopilot(promptText);
    setPromptText('');
  };

  return (
    <div className="rounded-3xl bg-[#090d1c]/90 border border-white/[0.08] p-6 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Key Insights</h3>
        </div>
        <button
          onClick={() => openCopilot('Generate full telemetry intelligence report')}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Glowing AI Radiant Orb (Direct from Cortex Labs design) */}
      <div className="relative py-3 flex items-center justify-center">
        <div className="absolute inset-0 bg-radial-gradient from-blue-600/20 to-transparent blur-2xl pointer-events-none" />
        <GlowingOrb size={130} hue={235} />
      </div>

      {/* Insight Bullet 1: Cost Optimization */}
      <div className="space-y-3 my-4">
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">Cost Optimization</span>
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Smart model routing reduced API costs by <strong className="text-purple-300">16%</strong>, saving an estimated <strong className="text-white">$1,240</strong> this month.
          </p>
        </div>

        {/* Insight Bullet 2: Performance Boost */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">Performance Boost</span>
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa]" />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Response latency improved by <strong className="text-emerald-400">24%</strong> after enabling intelligent request caching.
          </p>
        </div>
      </div>

      {/* "Ask AI..." Interactive Input Bar (Direct from Cortex Labs design) */}
      <form onSubmit={handleAskAI} className="relative mt-2">
        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Ask AI ..."
          className="w-full bg-[#0d1326] border border-white/[0.1] rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)] transition-all"
        >
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
