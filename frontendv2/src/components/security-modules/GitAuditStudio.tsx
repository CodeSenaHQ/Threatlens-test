import React, { useState } from 'react';
import { FolderGit2, Play, GitBranch, Key, ShieldCheck, AlertTriangle, FileCode, Check } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { toast } from 'sonner';

export const GitAuditStudio: React.FC = () => {
  const { startSimulation } = useSecurity();
  const [repoUrl, setRepoUrl] = useState('https://github.com/dev47929/ThreatLens');
  const [branch, setBranch] = useState('main');
  const [scanDepth, setScanDepth] = useState<'All Commits' | 'Latest Commit'>('All Commits');
  const [includeCVEs, setIncludeCVEs] = useState(true);
  const [secretRules, setSecretRules] = useState<string[]>([
    'AWS Access Keys',
    'OpenAI & LLM API Keys',
    'Private RSA/SSH Keys',
    'Database Credentials & URIs',
    'Stripe & Payment Secrets',
  ]);

  const handleLaunch = () => {
    if (!repoUrl.trim()) {
      toast.error('Repository URL required');
      return;
    }
    startSimulation({
      module: 'git-audit',
      moduleName: 'Git Repository Secret & CVE Audit',
      target: repoUrl,
      options: { repoUrl, branch, scanDepth, includeCVEs, secretRules },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Git Repository Secret & CVE Audit Studio</h2>
            <p className="text-xs text-slate-400 font-mono">
              Deep scans commit trees, blobs, diffs, and package manifests for leaked credentials and vulnerabilities
            </p>
          </div>
        </div>

        <button
          onClick={handleLaunch}
          className="cyber-btn-primary py-2.5 px-6 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Audit Repository</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Repo URL & Branch */}
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-4">
            <div>
              <label className="text-xs font-mono font-semibold text-slate-300 uppercase block mb-2">
                Git Repository URL (Public or Private)
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/org/repo or git@github.com:org/repo.git"
                className="w-full bg-[#060913] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">Target Branch</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main / master"
                  className="w-full bg-[#060913] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">Commit History Scope</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['All Commits', 'Latest Commit'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setScanDepth(s)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium ${
                        scanDepth === s
                          ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/50'
                          : 'bg-white/[0.02] text-slate-400 border border-white/[0.06]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Secret Signatures Multi-select */}
          <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <div className="text-xs font-mono font-semibold text-emerald-400 uppercase">
              Secret Matcher Pattern Rules
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'AWS Access & Secret Keys',
                'OpenAI & Anthropic API Keys',
                'Private RSA & Ed25519 SSH Keys',
                'PostgreSQL / Mongo DB URIs',
                'Stripe & Payment Gateways',
                'GitHub / GitLab Personal Access Tokens',
              ].map((rule) => {
                const isChecked = secretRules.includes(rule);
                return (
                  <div
                    key={rule}
                    onClick={() => {
                      if (isChecked) {
                        setSecretRules(secretRules.filter((r) => r !== rule));
                      } else {
                        setSecretRules([...secretRules, rule]);
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer text-xs flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-emerald-600/20 border-emerald-500/50 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                    }`}
                  >
                    <span className="font-semibold">{rule}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center text-xs ${
                        isChecked ? 'bg-emerald-500 text-white' : 'border border-white/20'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="p-5 rounded-2xl bg-[#090d1c]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono font-bold text-white uppercase">Entropy Scanner</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Shannon Entropy Active
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04] space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Regex Pattern Matrix</span>
                  <span className="text-emerald-400 font-bold">142 Rules</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>CVE Vulnerability DB</span>
                  <span className="text-blue-400 font-bold">NVD & GitHub Advisories</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-slate-300">
            <strong>Git History Walking:</strong> ThreatLens decompresses packfiles and tree blobs to uncover secrets committed years ago and deleted in later commits.
          </div>
        </div>
      </div>
    </div>
  );
};
