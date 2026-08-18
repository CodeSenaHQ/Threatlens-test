import React, { useState } from "react";
import {
  FolderGit2,
  GitBranch,
  GitCommit,
  FileCode,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Search,
  Plus,
  ExternalLink,
  ChevronRight,
  Download,
  Terminal,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_REPOSITORIES } from "@/lib/api";

export default function RepositoriesTab({ onSelectRepo, onInspectCommit }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [activeRepoId, setActiveRepoId] = useState(MOCK_REPOSITORIES[0]?.id || 1);

  const repos = MOCK_REPOSITORIES.map((r) => ({
    ...r,
    healthScore: r.riskLevel === "low" ? 98 : r.riskLevel === "high" ? 64 : 32,
  }));

  const filteredRepos = repos.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang =
      selectedLanguage === "all" ||
      (r.languages && Object.keys(r.languages).includes(selectedLanguage));
    return matchesSearch && matchesLang;
  });

  const activeRepo = repos.find((r) => r.id === activeRepoId) || repos[0];

  const handleScanRepo = (repoName) => {
    toast.info(`Initiating AST security audit on ${repoName}...`);
  };

  const handleExportRepoSummary = () => {
    toast.success("Exported repository architecture & security manifest (JSON)");
  };

  return (
    <div className="space-y-7">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-white">Monitored Repositories</h1>
          <p className="text-xs text-[#8a99ad] mt-1 font-mono">
            GET /repo · 4 codebases monitored · automated AST static analysis & branch tracking
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleExportRepoSummary}
            className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Manifest</span>
          </button>
          <button
            onClick={() => toast.info("Importing repository from GitHub/GitLab...")}
            className="px-4 py-2 rounded-lg border border-[#38bdf8] bg-[#38bdf8] text-[#04140c] font-bold hover:brightness-110 shadow-[0_0_16px_rgba(56,189,248,0.4)] transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Repository</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Active Codebases</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">4 Monitored</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">100% git remote synced</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Indexed Commits</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">2,282 Total</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">FastAPI: 13,250 upstream</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#ff4d4f] shadow-[0_0_10px_#ff4d4f]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Vulnerable Targets</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#ff4d4f]">2 Detected</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">02_vulnerable_ecommerce, fintech</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Total Footprint</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">38.4 MB</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">936 files indexed</div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#8a99ad] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repository by name or git URL..."
              className="w-full pl-10 pr-4 py-2 bg-[#10151a] border border-[#283747] rounded-lg text-xs font-mono text-white placeholder-[#6f8390] focus:border-[#38bdf8] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Language Filter Chips */}
        <div className="flex items-center gap-2">
          {["all", "Python", "JavaScript", "TypeScript", "SQL"].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedLanguage === lang
                  ? "bg-[#38bdf8] text-[#04140c] font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                  : "bg-[#10151a] border border-[#283747] text-[#8a99ad] hover:text-white"
              }`}
            >
              {lang === "all" ? "All Languages" : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Main Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
        {filteredRepos.map((repo) => {
          const isVulnerable = repo.riskLevel === "critical" || repo.riskLevel === "high";
          const isSelected = activeRepoId === repo.id;

          return (
            <div
              key={repo.id}
              onClick={() => setActiveRepoId(repo.id)}
              className={`bg-[#10151a] border rounded-xl p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer transition-all ${
                isSelected
                  ? "border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.2)] bg-[#121820]"
                  : "border-[#263544] hover:border-[#2f4255]"
              }`}
            >
              {/* Header: Name + URL + Risk Status */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-bold text-sm text-white">{repo.name}</h3>
                    <span className="font-mono text-[10px] text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/30 px-1.5 py-0.5 rounded">
                      {repo.default_branch || "main"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8a99ad] font-mono mt-1 truncate max-w-sm">{repo.url}</p>
                </div>

                <span
                  className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap font-medium"
                  style={{
                    color: isVulnerable ? "#ff4d4f" : "#38bdf8",
                    borderColor: isVulnerable ? "#ff4d4f" : "#38bdf8",
                    backgroundColor: isVulnerable ? "rgba(255,77,79,.10)" : "rgba(56,189,248,.10)",
                  }}
                >
                  {repo.riskLevel} risk
                </span>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-[#0a0d10] border border-[#222e3a] text-center font-mono">
                <div>
                  <span className="text-[9px] text-[#8a99ad] uppercase block">Commits</span>
                  <b className="text-sm text-white">{repo.commit_count?.toLocaleString() || "1,428"}</b>
                </div>
                <div>
                  <span className="text-[9px] text-[#8a99ad] uppercase block">Files</span>
                  <b className="text-sm text-white">{repo.files_total || "342"}</b>
                </div>
                <div>
                  <span className="text-[9px] text-[#8a99ad] uppercase block">Total Size</span>
                  <b className="text-sm text-white">
                    {repo.total_size ? (repo.total_size / (1024 * 1024)).toFixed(1) + " MB" : "18.5 MB"}
                  </b>
                </div>
              </div>

              {/* Languages Bar */}
              <div className="space-y-1.5">
                <div className="flex h-1.5 rounded overflow-hidden bg-[#222e3a]">
                  <div style={{ width: "55%" }} className="bg-[#4d9cff]" title="Python 55%" />
                  <div style={{ width: "25%" }} className="bg-[#f2c94c]" title="JavaScript 25%" />
                  <div style={{ width: "15%" }} className="bg-[#38bdf8]" title="TypeScript 15%" />
                  <div style={{ width: "5%" }} className="bg-[#222e3a]" />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8a99ad]">
                  <span>● Python (55%) · JS (25%) · TS (15%)</span>
                  <span>{repo.lastScanned || "Scanned 10m ago"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#253240] flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScanRepo(repo.name);
                  }}
                  className="px-3 py-1.5 rounded font-mono text-xs bg-[#141b21] border border-[#2b3947] text-[#d8e2e8] hover:border-[#38bdf8]/40 hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Run AST Scan</span>
                </button>

                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-[#38bdf8] hover:underline font-mono flex items-center gap-1"
                >
                  <span>Git Remote</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
