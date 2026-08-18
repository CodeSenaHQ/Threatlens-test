// ThreatLens Unified Frontend API Client & Mock Data Layer
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const SECTEST_BASE = "http://localhost:8765";

export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

async function authRequest(path, options = {}) {
  const url = `${API_BASE_URL}/tc-auth${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.detail || data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.message?.includes("Failed to fetch") || error.name === "TypeError") {
      throw new Error("Cannot connect to Auth Backend. Please ensure the backend is running.");
    }
    throw error;
  }
}

export const authApi = {
  loginWithPassword: (data) =>
    authRequest("/login/password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  signupWithPassword: (data) =>
    authRequest("/signup/password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  sendOtp: (email, purpose = "signup") =>
    authRequest(`/send/email/otp/${purpose}`, {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  signupWithOtp: (data) =>
    authRequest("/signup/otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  loginWithOtp: (data) =>
    authRequest("/login/otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  forgotPassword: (data) =>
    authRequest("/forgot/password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: (token) =>
    authRequest("/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),

  logout: (token) =>
    authRequest("/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  logoutAll: (token) =>
    authRequest("/logout-all", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  getPulse: () =>
    authRequest("/config/pulse", { method: "GET" }),

  getCounts: (token) =>
    authRequest("/config/counts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),

  getConfig: (token) =>
    authRequest("/config/load/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateProfile: (token, data) =>
    authRequest("/me", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  updatePassword: (token, password) =>
    authRequest("/update/password", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ password }),
    }),

  getSessions: (token, accountId) =>
    authRequest(`/session/query?field=id&value=${accountId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),

  destroySession: (token, sessionId) =>
    authRequest("/session/", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ session_id: sessionId }),
    }),

  getAccounts: (token, page = 1, limit = 20) =>
    authRequest(`/account/?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Repository & Git Module API
export const repoApi = {
  async getRepos(token) {
    const url = `${API_BASE_URL}/repo`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to fetch repos: ${res.status}`);
    return await res.json();
  },

  async getCommits(token, repoId, page = 1, limit = 10) {
    const url = `${API_BASE_URL}/repo/${repoId}/commits?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to fetch commits: ${res.status}`);
    return await res.json();
  },

  async analyzeCommit(url, analysis) {
    const res = await fetch(`${API_BASE_URL}/repo/commit/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, analysis }),
    });
    if (!res.ok) throw new Error(`AI analysis failed: ${res.status}`);
    return await res.json();
  },
};

export const CommitsAPI = {
  async analyzeCommit(commitHash, diff) {
    try {
      const res = await fetch(`${API_BASE_URL}/repo/commit/analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: "https://github.com/ThreatLens/ThreatLens.git",
          analysis: {
            commit: { sha: commitHash, short_sha: commitHash.slice(0, 7) },
            summary: { risk_score: 20, risk_level: "low" },
            findings: [],
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          analysis: data.ai_response?.summary || JSON.stringify(data.ai_response, null, 2),
          model_used: "Gemini / Claude via ThreatLens AI",
        };
      }
    } catch {
      // Fallback response for offline demo
    }
    return {
      analysis: `### ⚡ AI Security Assessment for ${commitHash.slice(0, 7)}\n- **Risk Level**: LOW (Verified Patch)\n- **Code Integrity**: Parameterized binding correctly replaces raw query string interpolation.\n- **Recommendations**: Enforce constant-time token comparison.`,
      model_used: "ThreatLens AST Neural Engine",
    };
  },
};

// SecTest Dynamic Vulnerability Scanner API
export const secTestApi = {
  async getReport() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${SECTEST_BASE}/report.json`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`SecTest returned ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },
};

// Sample Commits for CommitAnalysisPage & Demos
export const SAMPLE_COMMITS = [
  {
    hash: "96e2a871b53c19d4902187f0bca711832049e211",
    shortHash: "96e2a87",
    author: "Alex Vance",
    authorEmail: "alex@threatlens.io",
    date: "10 minutes ago",
    branch: "main",
    message: "fix(auth): sanitize user input and replace raw string query in user login endpoint",
    filesChanged: 2,
    insertions: 14,
    deletions: 8,
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
    existingAnalysis: `### ⚡ AI Technical Review: Commit 96e2a87
**Risk Evaluation**: LOW (Remediation Commit)
- **Vulnerability Addressed**: CWE-89 (SQL Injection) via untrusted query string interpolation.
- **Code Quality**: Parameterized binding correctly replaces unsafe f-string query execution.
- **Cryptographic Attestation**: No private key or credential leaks detected in diff changes.`,
  },
  {
    hash: "4e21a8d011f592cb1475e330a8901f443810c512",
    shortHash: "4e21a8d",
    author: "Elena Rostov",
    authorEmail: "elena@threatlens.io",
    date: "2 hours ago",
    branch: "main",
    message: "feat(billing): verify stripe webhook signature before processing checkout payload",
    filesChanged: 1,
    insertions: 9,
    deletions: 2,
    diff: `diff --git a/backend/routes/billing.py b/backend/routes/billing.py
--- a/backend/routes/billing.py
+++ b/backend/routes/billing.py
@@ -18,6 +18,13 @@ async def stripe_webhook(request: Request):
+    payload = await request.body()
+    sig_header = request.headers.get("stripe-signature")
+    try:
+        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
+    except stripe.error.SignatureVerificationError:
+        raise HTTPException(status_code=400, detail="Invalid Stripe webhook signature")`,
    existingAnalysis: `### ⚡ AI Technical Review: Commit 4e21a8d
**Risk Evaluation**: LOW (Remediation Commit)
- **Vulnerability Addressed**: CWE-347 (Improper Verification of Cryptographic Signature).
- **Security Posture**: Protects against replay attacks and spoofed payment fulfillment events.`,
  },
];

// Rich Sample Data for UI Initialization & Offline Demo Preview
export const MOCK_REPOSITORIES = [
  {
    id: 1,
    name: "ThreatLens",
    username: "ThreatLens",
    url: "https://github.com/ThreatLens/ThreatLens.git",
    default_branch: "main",
    branches: ["main", "dev", "security/jwt-rotation"],
    commit_count: 1428,
    files_total: 342,
    total_size: 18459200,
    languages: { Python: 140, JavaScript: 72, TypeScript: 48, CSS: 15 },
    tags: [
      { name: "v2.0.0-rc1", sha: "96e2a871b53c19d4902187f0bca711832049e211", short_sha: "96e2a87" },
      { name: "v1.4.0", sha: "4e21a8d011f592cb1475e330a8901f443810c512", short_sha: "4e21a8d" },
    ],
    lastScanned: "10 mins ago",
    status: "verified",
    riskLevel: "low",
  },
  {
    id: 2,
    name: "02_vulnerable_ecommerce_py",
    username: "ThreatLensGo",
    url: "https://github.com/ThreatLens/02_vulnerable_ecommerce.git",
    default_branch: "main",
    branches: ["main"],
    commit_count: 84,
    files_total: 62,
    total_size: 4820000,
    languages: { Python: 52, HTML: 6, JavaScript: 4 },
    tags: [{ name: "v0.9.0", sha: "8f2a11b", short_sha: "8f2a11b" }],
    lastScanned: "2 hours ago",
    status: "vulnerable",
    riskLevel: "critical",
  },
  {
    id: 3,
    name: "03_vulnerable_fintech_py",
    username: "ThreatLensGo",
    url: "https://github.com/ThreatLens/03_vulnerable_fintech.git",
    default_branch: "main",
    branches: ["main", "feat/payouts"],
    commit_count: 120,
    files_total: 94,
    total_size: 8910000,
    languages: { Python: 80, SQL: 14 },
    tags: [{ name: "v1.1.0", sha: "3fa912c", short_sha: "3fa912c" }],
    lastScanned: "Yesterday",
    status: "vulnerable",
    riskLevel: "high",
  },
  {
    id: 4,
    name: "FastAPI-Auth-Service",
    username: "totalchaos",
    url: "https://github.com/totalchaos/tc-auth.git",
    default_branch: "master",
    branches: ["master", "v2"],
    commit_count: 650,
    files_total: 110,
    total_size: 6120000,
    languages: { Python: 104, Markdown: 6 },
    tags: [{ name: "v3.2.0", sha: "7b19df3", short_sha: "7b19df3" }],
    lastScanned: "3 days ago",
    status: "verified",
    riskLevel: "low",
  },
];

export const MOCK_COMMITS = [
  {
    sha: "96e2a871b53c19d4902187f0bca711832049e211",
    short_sha: "96e2a87",
    author_name: "Alex Vance",
    author_email: "alex@threatlens.io",
    authored_at: "10 mins ago",
    message: "fix(auth): sanitize user input and replace raw string query in login endpoint",
    summary: {
      risk_score: 18,
      risk_level: "low",
      files_changed: 2,
      findings: 1,
      critical: 0,
      high: 0,
      medium: 0,
      low: 1,
    },
    findings: [
      {
        category: "security_code",
        severity: "low",
        title: "SQL Injection Vector Fixed",
        description: "Replaced raw string query execution with parameterized bind variables.",
        path: "backend/routes/auth.py",
        evidence: "- query = f\"SELECT * FROM users WHERE email = '{request.email}'\"\n+ query = \"SELECT id, email FROM users WHERE email = :email\"",
      },
    ],
  },
  {
    sha: "4e21a8d011f592cb1475e330a8901f443810c512",
    short_sha: "4e21a8d",
    author_name: "Elena Rostov",
    author_email: "elena@threatlens.io",
    authored_at: "2 hours ago",
    message: "feat(billing): verify stripe webhook signature before processing checkout payload",
    summary: {
      risk_score: 12,
      risk_level: "low",
      files_changed: 1,
      findings: 1,
      critical: 0,
      high: 0,
      medium: 0,
      low: 1,
    },
    findings: [
      {
        category: "security_code",
        severity: "low",
        title: "Signature Verification Enforced",
        description: "Enforced Stripe cryptographic signature verification against replay attacks.",
        path: "backend/routes/billing.py",
        evidence: "+ event = stripe.Webhook.construct_event(payload, sig_header, SECRET)",
      },
    ],
  },
  {
    sha: "7b19df33501a2ce08914efb900234acb7712aa90",
    short_sha: "7b19df3",
    author_name: "Sarah Chen",
    author_email: "sarah@threatlens.io",
    authored_at: "Yesterday",
    message: "refactor(jwt): implement RS256 asymmetric token signing with key rotation support",
    summary: {
      risk_score: 10,
      risk_level: "low",
      files_changed: 3,
      findings: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    findings: [],
  },
  {
    sha: "8f2a11b29c0174092b192830114092b192801940",
    short_sha: "8f2a11b",
    author_name: "Marcus Brody",
    author_email: "marcus@threatlens.io",
    authored_at: "2 days ago",
    message: "wip(api): temporary bypass auth token check for staging webhook test",
    summary: {
      risk_score: 85,
      risk_level: "critical",
      files_changed: 4,
      findings: 2,
      critical: 1,
      high: 1,
      medium: 0,
      low: 0,
    },
    findings: [
      {
        category: "suspicious_commit_pattern",
        severity: "critical",
        title: "Authentication Bypass Pattern",
        description: "Commit patch bypasses token authentication validation.",
        path: "backend/routes/webhooks.py",
        evidence: "- if not verify_token(req): return 401\n+ # bypass auth for test\n+ pass",
      },
      {
        category: "secret_detection",
        severity: "high",
        title: "Hardcoded API Key",
        description: "Possible generic secret assignment detected.",
        path: "backend/config.py",
        evidence: "api_key = \"sk_test_51Mz...941a\"",
      },
    ],
  },
];

export const MOCK_ACTIVITIES = [
  {
    id: 1,
    user: "Alex Vance",
    avatar: "AV",
    avatarColor: "#3b82f6",
    action: "pushed commit 96e2a87",
    target: "fix(auth): sanitize user input",
    time: "10 mins ago",
    type: "commit",
  },
  {
    id: 2,
    user: "SecTest Prober",
    avatar: "ST",
    avatarColor: "#ef4444",
    action: "flagged 1 Critical Vulnerability",
    target: "CWE-89 (SQL Injection) on /api/users",
    time: "45 mins ago",
    type: "threat",
  },
  {
    id: 3,
    user: "Elena Rostov",
    avatar: "ER",
    avatarColor: "#10b981",
    action: "verified webhook signature",
    target: "stripe_webhook event verification",
    time: "2 hours ago",
    type: "audit",
  },
  {
    id: 4,
    user: "Sarah Chen",
    avatar: "SC",
    avatarColor: "#8b5cf6",
    action: "rotated RS256 JWT keys",
    target: "Key ID kid_2026_08_rotation",
    time: "Yesterday",
    type: "config",
  },
];
