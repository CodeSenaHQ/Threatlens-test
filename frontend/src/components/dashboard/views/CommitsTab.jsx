import React, { useState } from "react";
import {
  GitCommit,
  ShieldAlert,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCode,
  ArrowUpRight,
  Download,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { CommitsAPI } from "@/lib/api";

export default function CommitsTab({ onInspectCommit }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [expandedCommitSha, setExpandedCommitSha] = useState("8b4f7a6");
  const [analyzingSha, setAnalyzingSha] = useState(null);
  const [aiAnalysisResults, setAiAnalysisResults] = useState({});
  const [copiedSha, setCopiedSha] = useState(null);

  const commits = [
    {
      sha: "8b4f7a6",
      fullSha: "8b4f7a668a7de34693bb25d6f66abfcb4f7b095e",
      message: "fix(auth): parameterize login query and remove direct string interpolation",
      author: "Alex Vance",
      email: "alex@threatlens.io",
      date: "10 mins ago",
      branch: "main",
      riskScore: 28,
      riskLevel: "medium",
      filesChanged: 2,
      findingsCount: 2,
      findings: [
        {
          severity: "high",
          title: "SQL Injection Vector Fixed",
          description: "Replaced raw string query execution with parameterized bind variables.",
          path: "backend/routes/auth.py",
        },
        {
          severity: "medium",
          title: "Lack of Constant-Time Token Comparison",
          description: "Password verification uses standard equality comparison instead of hmac.compare_digest.",
          path: "backend/routes/auth.py",
        },
      ],
      diff: `diff --git a/backend/routes/auth.py b/backend/routes/auth.py
--- a/backend/routes/auth.py
+++ b/backend/routes/auth.py
@@ -42,8 +42,14 @@ def login_handler(request: LoginRequest):
-    query = f"SELECT * FROM users WHERE email = '{request.email}' AND password = '{request.password}'"
-    user = db.execute(query).fetchone()
+    # ThreatLens Remediation: Use parameterized query binding to prevent SQL Injection
+    query = "SELECT id, email, password_hash, role FROM users WHERE email = :email LIMIT 1"
+    user = db.execute(text(query), {"email": request.email}).mappings().fetchone()
+    if not user or not verify_password(request.password, user["password_hash"]):
+        raise HTTPException(status_code=401, detail="Invalid credentials")`,
    },
    {
      sha: "f402a19",
      fullSha: "f402a19011f592cb1475e330a8901f443810c512",
      message: "feat(search): add raw filter passthrough for administrative reporting export",
      author: "Alex Vance",
      email: "alex@threatlens.io",
      date: "1 hour ago",
      branch: "main",
      riskScore: 84,
      riskLevel: "critical",
      filesChanged: 3,
      findingsCount: 3,
      findings: [
        {
          severity: "critical",
          title: "Direct SQL Injection Vulnerability",
          description: "Raw user input concatenated into db.execute() without parameterized validation.",
          path: "api/v1/users/search.py",
        },
      ],
      diff: `diff --git a/api/v1/users/search.py b/api/v1/users/search.py
--- a/api/v1/users/search.py
+++ b/api/v1/users/search.py
@@ -19,6 +19,10 @@ async def search_users(filter_expr: str):
+    # CRITICAL SECURITY RISK DETECTED BY THREATLENS AST
+    raw_query = f"SELECT * FROM users WHERE " + filter_expr
+    return db.execute(raw_query).fetchall()`,
    },
    {
      sha: "a7710bb",
      fullSha: "a7710bb3501a2ce08914efb900234acb7712aa90",
      message: "wip(middleware): skip auth session token check during staging test",
      author: "Marcus Lee",
      email: "marcus@threatlens.io",
      date: "3 hours ago",
      branch: "develop",
      riskScore: 62,
      riskLevel: "high",
      filesChanged: 1,
      findingsCount: 2,
      findings: [
        {
          severity: "high",
          title: "Authentication Bypass Logic",
          description: "Staging bypass allows unauthorized unauthenticated requests.",
          path: "middleware/session.py",
        },
      ],
      diff: `diff --git a/middleware/session.py b/middleware/session.py
--- a/middleware/session.py
+++ b/middleware/session.py
@@ -33,6 +33,8 @@ async def verify_session(request: Request):
+    if "staging" in request.headers.get("Host", ""):
+        return True # Bypass authentication check for staging
     token = request.headers.get("Authorization")`,
    },
    {
      sha: "c19e2fd",
      fullSha: "c19e2fd912830114092b19280194092830114092",
      message: "chore(ci): pin github actions to immutable sha hashes",
      author: "Priya Nair",
      email: "priya@threatlens.io",
      date: "Yesterday",
      branch: "main",
      riskScore: 8,
      riskLevel: "low",
      filesChanged: 2,
      findingsCount: 0,
      findings: [],
      diff: `diff --git a/.github/workflows/deploy.yml b/.github/workflows/deploy.yml
--- a/.github/workflows/deploy.yml
+++ b/.github/workflows/deploy.yml
@@ -14,3 +14,3 @@
-      - uses: actions/checkout@v4
+      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1`,
    },
    {
      sha: "031bd6e",
      fullSha: "031bd6e8bca711832049e21196e2a871b53c19d4",
      message: "docs: update security attestation and ASVS compliance status badges",
      author: "Priya Nair",
      email: "priya@threatlens.io",
      date: "2 days ago",
      branch: "main",
      riskScore: 0,
      riskLevel: "low",
      filesChanged: 1,
      findingsCount: 0,
      findings: [],
      diff: `diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -5,2 +5,3 @@
+![ASVS Level 2](https://img.shields.io/badge/ASVS-Level%202-38bdf8)`,
    },
  ];

  const filteredCommits = commits.filter((c) => {
    const matchesSearch =
      c.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sha.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || c.riskLevel.toLowerCase() === severityFilter.toLowerCase();
    return matchesSearch && matchesSeverity;
  });

  const handleCopySha = (sha, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    toast.success(`Commit SHA ${sha.slice(0, 7)} copied!`);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const handleRunAiReview = async (commit, e) => {
    e.stopPropagation();
    setAnalyzingSha(commit.sha);
    toast.info(`Running ThreatLens Neural Engine analysis on commit ${commit.sha}...`);
    try {
      const result = await CommitsAPI.analyzeCommit(commit.fullSha, commit.diff);
      setAiAnalysisResults((prev) => ({
        ...prev,
        [commit.sha]: result.analysis,
      }));
      toast.success(`AI Security Review generated for ${commit.sha}!`);
    } catch {
      toast.error("Failed to run AI analysis.");
    } finally {
      setAnalyzingSha(null);
    }
  };

  return (
    <div className="space-y-7">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-white">Analyzed Git Commits</h1>
          <p className="text-xs text-[#8a99ad] mt-1 font-mono">
            GET /repo/12/commits · AST AST code diff inspection, commit risk scoring (0–100) & AI security receipts
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => toast.success("Exported commit risk audit trail (CSV)")}
            className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Indexed Commits</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">1,428</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">24 in last 24 hours</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#ff4d4f] shadow-[0_0_10px_#ff4d4f]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Critical Commits</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#ff4d4f]">1 Detected</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">f402a19 (Direct SQLi)</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">AST Clean Rate</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">98.2%</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Passing security gates</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Avg Risk Score</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">24 / 100</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Weighted formula</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#8a99ad] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commit message, sha, author..."
              className="w-full pl-10 pr-4 py-2 bg-[#10151a] border border-[#283747] rounded-lg text-xs font-mono text-white placeholder-[#6f8390] focus:border-[#38bdf8] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Severity Filter Chips */}
        <div className="flex items-center gap-2">
          {["all", "critical", "high", "medium", "low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium uppercase transition-all ${
                severityFilter === sev
                  ? "bg-[#38bdf8] text-[#04140c] font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                  : "bg-[#10151a] border border-[#283747] text-[#8a99ad] hover:text-white"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Commits Stream List */}
      <div className="space-y-4">
        {filteredCommits.map((commit) => {
          const isExpanded = expandedCommitSha === commit.sha;
          const isCrit = commit.riskLevel === "critical";
          const isHigh = commit.riskLevel === "high";
          const isMed = commit.riskLevel === "medium";
          const color = isCrit ? "#ff4d4f" : isHigh ? "#ff9a3c" : isMed ? "#f2c94c" : "#38bdf8";

          return (
            <div
              key={commit.sha}
              className={`bg-[#10151a] border rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all ${
                isExpanded ? "border-[#38bdf8]/60 shadow-[0_0_15px_rgba(56,189,248,0.15)]" : "border-[#263544] hover:border-[#2f4255]"
              }`}
            >
              {/* Commit Summary Row */}
              <div
                onClick={() => setExpandedCommitSha(isExpanded ? null : commit.sha)}
                className="p-4.5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* SHA Badge with 1-click copy */}
                  <button
                    onClick={(e) => handleCopySha(commit.fullSha, e)}
                    className="font-mono text-[#38bdf8] bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 px-2 py-1 rounded text-xs border border-[#38bdf8]/30 font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <span>{commit.sha}</span>
                    {copiedSha === commit.fullSha ? (
                      <Check className="w-3 h-3 text-[#38bdf8]" />
                    ) : (
                      <Copy className="w-3 h-3 text-[#8a99ad]" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-white truncate">{commit.message}</h3>
                    <div className="flex items-center gap-2.5 text-[11px] font-mono text-[#8a99ad] mt-0.5">
                      <span>{commit.author}</span>
                      <span>·</span>
                      <span>{commit.date}</span>
                      <span>·</span>
                      <span>{commit.filesChanged} files changed</span>
                    </div>
                  </div>
                </div>

                {/* Right Badges & Controls */}
                <div className="flex items-center gap-3 font-mono">
                  {commit.findingsCount > 0 && (
                    <span className="text-[10px] bg-rose-500/15 border border-rose-500/30 text-rose-400 px-2 py-0.5 rounded">
                      {commit.findingsCount} findings
                    </span>
                  )}

                  <span
                    className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-bold"
                    style={{
                      color: color,
                      borderColor: color,
                      backgroundColor: `${color}14`,
                    }}
                  >
                    Risk {commit.riskScore} · {commit.riskLevel}
                  </span>

                  <button className="text-[#8a99ad] hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Diff & Analysis Tray */}
              {isExpanded && (
                <div className="p-5 border-t border-[#253240] bg-[#0c1016] space-y-4">
                  {/* Diff Viewer */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-semibold flex items-center gap-2">
                        <FileCode className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span>Unified Git Diff</span>
                      </span>
                      <button
                        onClick={(e) => handleRunAiReview(commit, e)}
                        disabled={analyzingSha === commit.sha}
                        className="px-3 py-1.5 rounded font-mono text-xs bg-[#38bdf8] text-[#04140c] font-bold hover:brightness-110 shadow-[0_0_12px_rgba(56,189,248,0.35)] flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{analyzingSha === commit.sha ? "Analyzing..." : "Run AI Review"}</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-lg bg-[#07090d] border border-[#222e3a] font-mono text-[11px] leading-relaxed overflow-x-auto text-[#d8e2e8]">
                      {commit.diff.split("\n").map((line, idx) => {
                        const isAdd = line.startsWith("+") && !line.startsWith("+++");
                        const isDel = line.startsWith("-") && !line.startsWith("---");
                        const isHeader = line.startsWith("@@") || line.startsWith("diff");

                        return (
                          <div
                            key={idx}
                            className={`px-1 rounded ${
                              isAdd
                                ? "bg-[#38bdf8]/10 text-[#38bdf8] font-semibold"
                                : isDel
                                ? "bg-rose-500/10 text-rose-400"
                                : isHeader
                                ? "text-[#8a99ad] font-bold"
                                : "text-[#cbd5e1]"
                            }`}
                          >
                            {line}
                          </div>
                        );
                      })}
                    </pre>
                  </div>

                  {/* AI Analysis Receipt if generated */}
                  {aiAnalysisResults[commit.sha] && (
                    <div className="p-4 rounded-lg bg-[#10151a] border border-[#38bdf8]/40 space-y-2 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#38bdf8]">
                        <Sparkles className="w-4 h-4" />
                        <span>ThreatLens Neural AST Review Receipt</span>
                      </div>
                      <div className="text-xs text-[#d8e2e8] leading-relaxed whitespace-pre-wrap font-mono">
                        {aiAnalysisResults[commit.sha]}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
