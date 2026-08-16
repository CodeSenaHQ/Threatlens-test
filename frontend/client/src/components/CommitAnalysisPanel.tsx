import React, { useState } from 'react';
import { CommitsAPI } from '../services/api';

export interface CommitAnalysisPanelProps {
  commitHash: string;
  existingAnalysis?: string;
  onAnalysisComplete?: (analysis: string) => void;
}

export const CommitAnalysisPanel: React.FC<CommitAnalysisPanelProps> = ({
  commitHash,
  existingAnalysis,
  onAnalysisComplete,
}) => {
  const [analysis, setAnalysis] = useState<string | null>(existingAnalysis?.trim() ? existingAnalysis : null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [modelName, setModelName] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await CommitsAPI.analyzeCommit(commitHash);
      setAnalysis(res.analysis);
      setIsCached(res.cached);
      setModelName(res.model);
      if (onAnalysisComplete) {
        onAnalysisComplete(res.analysis);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze commit.';
      setError(msg);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="mt-3 p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-3 text-sm text-[#cbd5e1]">
        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0" />
        <span className="text-[#cbd5e1] font-medium">Analyzing commit diff &amp; project context with AI...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 p-3.5 rounded-xl bg-rose-500/[0.06] border border-rose-500/20 text-xs sm:text-sm flex items-center justify-between gap-3 text-[#fca5a5]">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">⚠️ Analysis Error:</span>
          <span>{error}</span>
        </div>
        <button
          onClick={handleAnalyze}
          className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors font-medium text-xs shrink-0 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (analysis) {
    return (
      <div className="mt-3 p-5 rounded-xl bg-[#0b0e14] border border-white/10 text-slate-200 relative group shadow-none">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-white text-sm sm:text-base flex items-center gap-1.5 font-display">
              <span>⚡ AI Technical Review</span>
            </span>
            {modelName && modelName !== 'fallback' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/5 text-[#cbd5e1] border border-white/10">
                {modelName}
              </span>
            )}
            {isCached && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/5 text-[#cbd5e1] border border-white/10 font-normal">
                cached
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-[#8a99ad] hover:text-white px-3 py-1.5 rounded-md bg-white/5 border border-white/10 transition-colors cursor-pointer font-medium"
          >
            {copied ? 'Copied ✓' : 'Copy Analysis'}
          </button>
        </div>
        <div className="whitespace-pre-wrap leading-relaxed text-[#cbd5e1] font-sans text-sm sm:text-[15px] pt-1 tracking-normal font-normal">
          {analysis}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center">
      <button
        onClick={handleAnalyze}
        className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 group cursor-pointer shadow-none"
      >
        <span className="group-hover:scale-110 transition-transform text-base">⚡</span>
        <span>Analyze Commit with AI</span>
      </button>
    </div>
  );
};
