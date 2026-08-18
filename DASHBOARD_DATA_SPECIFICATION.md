# 🛡️ ThreatLens — Frontend Dashboard Data Specification & Backend Integration Guide

This document provides an exhaustive, field-by-field specification of all backend APIs, data models, request payloads, response payloads, and all visual and interactive components that can be rendered on the **ThreatLens Frontend Dashboard**.

---

## 📑 Table of Contents

1. [Executive Overview & Backend Architecture](#1-executive-overview--backend-architecture)
2. [Complete API Endpoints, Request & Response Bodies](#2-complete-api-endpoints-request--response-bodies)
   - [2.1 User Authentication & Profile Routes (`/tc-auth/*`)](#21-user-authentication--profile-routes-tc-auth)
   - [2.2 Admin & Infrastructure Config Routes (`/tc-auth/config/*`)](#22-admin--infrastructure-config-routes-tc-authconfig)
   - [2.3 Admin Account Management Routes (`/tc-auth/account/*`)](#23-admin-account-management-routes-tc-authaccount)
   - [2.4 Admin OAuth Management Routes (`/tc-auth/oauth/*`)](#24-admin-oauth-management-routes-tc-authoauth)
   - [2.5 Admin OTP Management Routes (`/tc-auth/otp/*`)](#25-admin-otp-management-routes-tc-authotp)
   - [2.6 Admin Session Management Routes (`/tc-auth/session/*`)](#26-admin-session-management-routes-tc-authsession)
   - [2.7 Git & Commit Security Engine (`GIT_MODULE` / `cli-backend`)](#27-git--commit-security-engine-git_module--cli-backend)
   - [2.8 SecTest Dynamic Vulnerability Scanner & Report Server (`sectest/`)](#28-sectest-dynamic-vulnerability-scanner--report-server-sectest)
3. [Frontend Dashboard Feature & UI Component Blueprint](#3-frontend-dashboard-feature--ui-component-blueprint)
   - [3.1 View 1: ThreatLens SOC Overview (Executive Telemetry)](#31-view-1-threatlens-soc-overview-executive-telemetry)
   - [3.2 View 2: Git Repository & Commit Risk Analyzer](#32-view-2-git-repository--commit-risk-analyzer)
   - [3.3 View 3: SecTest Dynamic Vulnerability Scanner & Prober](#33-view-3-sectest-dynamic-vulnerability-scanner--prober)
   - [3.4 View 4: User Profile, Security & Session Management](#34-view-4-user-profile-security--session-management)
   - [3.5 View 5: Superadmin Control Center & Infrastructure Config](#35-view-5-superadmin-control-center--infrastructure-config)
   - [3.6 View 6: Vulnerability Deep-Dive & Remediation Drawer](#36-view-6-vulnerability-deep-dive--remediation-drawer)
4. [Master Backend Parameter to Frontend UI Mapping Matrix](#4-master-backend-parameter-to-frontend-ui-mapping-matrix)
5. [Backend Gotchas, Bug Fallbacks & Resilience Guidelines](#5-backend-gotchas-bug-fallbacks--resilience-guidelines)

---

## 1. Executive Overview & Backend Architecture

ThreatLens is powered by three primary backend systems:
1. **Core Auth & Administration Backend** (`backend/` & `backend/AUTH_MODULE/tc_auth`): FastAPI + SQLAlchemy (PostgreSQL / SQLite) service on port `8000`. Manages multi-factor auth, social OAuth, RBAC permissions, user accounts, active tokenized sessions, and runtime config.
2. **Git & Commit Security Engine** (`backend/GIT_MODULE` & `cli-backend`): Clones remote repositories, analyzes file structures, language distributions, git commit histories, diffs, and executes AST/regex security scans (detecting secrets, sensitive files, command/SQL injections, permission changes, CI/CD flaws).
3. **SecTest Dynamic Scanner & Report Server** (`sectest/`): HTTPX/Socket vulnerability probing engine and standalone HTTP server on port `8765` (`http://localhost:8765/report.json`). Delivers enriched security findings across Headers, Exposure, Auth, Injection, and Rate Limiting.

```mermaid
graph TD
    UI[ThreatLens Frontend Dashboard] -->|JWT Auth & Admin APIs| AuthAPI[FastAPI Auth Backend :8000]
    UI -->|Git & Commit Scanning| GitAPI[Git & Commit Analyzer Engine]
    UI -->|Vulnerability Telemetry| SecTestAPI[SecTest Report Server :8765]
    
    AuthAPI --> AuthDB[(PostgreSQL / SQLite DB)]
    GitAPI --> GitCloner[Git Temp Workspace & AST Regex Scanners]
    SecTestAPI --> TargetApp[Target Server Probing Suite]
```

---

## 2. Complete API Endpoints, Request & Response Bodies

### 2.1 User Authentication & Profile Routes (`/tc-auth/*`)

#### 1. Public Pulse / Health Check
- **Endpoint**: `GET /tc-auth/config/pulse`
- **Auth**: Public
- **Request Body**: None
- **Response Body**:
```json
{
  "system_time": "2026-08-18T12:00:00.000000",
  "response": "Hello",
  "status": "healthy",
  "state": "active"
}
```

---

#### 2. Signup with Password
- **Endpoint**: `POST /tc-auth/signup/password`
- **Auth**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "handle": "janedoe"
}
```
- **Response Body**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "account": {
    "id": 1,
    "uid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Jane Doe",
    "handle": "janedoe",
    "email": "jane@example.com",
    "phone": null,
    "avatar_url": null,
    "role": "user",
    "status": null,
    "created_at": "2026-08-18T12:00:00",
    "updated_at": "2026-08-18T12:00:00"
  }
}
```

---

#### 3. Send Email OTP
- **Endpoint**: `POST /tc-auth/send/email/otp/{purpose}`
- **Path Parameter**: `purpose` (`signup` | `login` | `reset` | `verify`)
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "jane@example.com"
}
```
- **Response Body**:
```json
{
  "expires_at": 1787054400
}
```

---

#### 4. Signup with OTP
- **Endpoint**: `POST /tc-auth/signup/otp`
- **Auth**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "otp": "123456",
  "handle": "janedoe"
}
```
- **Response Body**: Same format as `POST /tc-auth/signup/password` (returns `access_token`, `token_type`, `account`).

---

#### 5. Login with Password
- **Endpoint**: `POST /tc-auth/login/password`
- **Auth**: Public
- **Request Body**:
```json
{
  "identifier": "jane@example.com",
  "password": "password123"
}
```
*(Note: `identifier` can be user email or username handle)*
- **Response Body**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "account": {
    "id": 1,
    "uid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Jane Doe",
    "handle": "janedoe",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "avatar_url": "https://avatar.url/jane.png",
    "role": "user",
    "status": "active",
    "created_at": "2026-08-18T12:00:00",
    "updated_at": "2026-08-18T12:00:00"
  }
}
```

---

#### 6. Login with OTP
- **Endpoint**: `POST /tc-auth/login/otp`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "otp": "123456"
}
```
- **Response Body**: Same format as `POST /tc-auth/login/password`.

---

#### 7. Forgot Password / Password Reset
- **Endpoint**: `POST /tc-auth/forgot/password`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "otp": "123456",
  "password": "new-strong-password-123"
}
```
- **Response Body**: Returns fresh `access_token`, `token_type`, and `account` object.

---

#### 8. OAuth Social Login (Google & GitHub)
- **Initiate Flow**:
  - `GET /tc-auth/google/login?frontend_url=http://localhost:3000`
  - `GET /tc-auth/github/login?frontend_url=http://localhost:3000`
- **Callback Endpoints**:
  - `GET /tc-auth/google/callback`
  - `GET /tc-auth/github/callback`
- **Callback Browser Redirect**:
  - Redirects to `${frontend_url}/oauth/callback?access_token=${jwt_token}`

---

#### 9. Current User & Session Info (`/tc-auth/me`)
- **Endpoint**: `GET /tc-auth/me`
- **Auth**: Required (`Authorization: Bearer <access_token>`)
- **Response Body**:
```json
{
  "account": {
    "id": 1,
    "uid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Jane Doe",
    "handle": "janedoe",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "avatar_url": "https://avatars.githubusercontent.com/u/1",
    "role": "superadmin",
    "status": "active",
    "created_at": "2026-08-18T10:00:00",
    "updated_at": "2026-08-18T12:00:00"
  },
  "session": {
    "id": 12,
    "account_id": 1,
    "token_hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    "ip_address": "127.0.0.1",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0",
    "expires_at": "2026-08-25T12:00:00",
    "created_at": "2026-08-18T12:00:00"
  },
  "payload": {
    "aid": 1,
    "sid": 12,
    "token": "dG9rZW4tc2VjcmV0...",
    "exp": 1787659200
  }
}
```

---

#### 10. Update Profile (`PATCH /tc-auth/me`)
- **Endpoint**: `PATCH /tc-auth/me`
- **Auth**: Required (`Authorization: Bearer <access_token>`)
- **Request Body**:
```json
{
  "name": "Jane Doe Updated",
  "email": "jane.new@example.com",
  "handle": "janedoe_pro",
  "avatar_url": "https://avatar.url/new.png",
  "phone": "+1987654321"
}
```
- **Response Body**: Returns the updated `account` object.

---

#### 11. Update Password (`PUT /tc-auth/update/password`)
- **Endpoint**: `PUT /tc-auth/update/password`
- **Auth**: Required (`Authorization: Bearer <access_token>`)
- **Request Body**:
```json
{
  "password": "brand-new-password-123"
}
```
- **Response Body**: `null` (HTTP 200 OK)

---

#### 12. Logout (Active Session) & Logout All (All Devices)
- **Endpoint**: `POST /tc-auth/logout` -> Destroys active session (`Response: null`)
- **Endpoint**: `POST /tc-auth/logout-all` -> Destroys all sessions for account (`Response: null`)

---

### 2.2 Admin & Infrastructure Config Routes (`/tc-auth/config/*`)
*All endpoints below require `Authorization: Bearer <access_token>` with role `superadmin`.*

#### 1. Resource Counts Summary (`GET /tc-auth/config/counts`)
- **Response Body**:
```json
{
  "accounts": 48,
  "oauth": 19,
  "sessions": 104,
  "otp": 6
}
```

---

#### 2. Load Runtime Configuration (`GET /tc-auth/config/load/`)
- **Response Body**:
```json
{
  "email": {
    "host": "smtp.gmail.com",
    "port": 587,
    "username": "mailer@threatlens.io",
    "password": "app-password-masked",
    "sender": "no-reply@threatlens.io",
    "sender_name": "ThreatLens Security",
    "use_tls": true
  },
  "github": {
    "client_id": "Iv1.8749129841298",
    "client_secret": "github-secret-masked",
    "redirect_uri": "http://localhost:8000/tc-auth/github/callback"
  },
  "google": {
    "client_id": "129837198237-apps.googleusercontent.com",
    "client_secret": "google-secret-masked",
    "redirect_uri": "http://localhost:8000/tc-auth/google/callback"
  },
  "jwt": {
    "secret_key": "jwt-signing-secret",
    "algorithm": "HS256",
    "session_duration_days": 7
  }
}
```

---

#### 3. Update Email SMTP Config (`POST /tc-auth/config/email`)
- **Request Body**:
```json
{
  "host": "smtp.sendgrid.net",
  "port": 587,
  "username": "apikey",
  "password": "SG.secret_key",
  "sender": "alerts@threatlens.io",
  "sender_name": "ThreatLens SOC",
  "use_tls": true
}
```
- **Response Body**: `null`

---

#### 4. Update GitHub OAuth Config (`POST /tc-auth/config/github`)
- **Request Body**:
```json
{
  "client_id": "Iv1.new_client_id",
  "client_secret": "new_secret_key",
  "redirect_uri": "http://localhost:8000/tc-auth/github/callback"
}
```
- **Response Body**: `null`

---

#### 5. Update Google OAuth Config (`POST /tc-auth/config/google`)
- **Request Body**:
```json
{
  "client_id": "new_google_id.apps.googleusercontent.com",
  "client_secret": "new_google_secret",
  "redirect_uri": "http://localhost:8000/tc-auth/google/callback"
}
```
- **Response Body**: `null`

---

#### 6. Update JWT Signing Config (`POST /tc-auth/config/jwt`)
- **Request Body**:
```json
{
  "secret_key": "new-256-bit-entropy-jwt-key",
  "algorithm": "HS256",
  "session_duration_days": 14
}
```
- **Response Body**: `null`

---

### 2.3 Admin Account Management Routes (`/tc-auth/account/*`)
*Requires `superadmin` role.*

#### 1. Paginated Accounts List (`GET /tc-auth/account/?page=1&limit=10`)
- **Query Params**: `page` (int, default 1), `limit` (int, default 10, max 100)
- **Response Body**:
```json
[
  {
    "id": 1,
    "uid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Jane Doe",
    "handle": "janedoe",
    "email": "jane@example.com",
    "phone": "+15555550100",
    "avatar_url": "https://avatar.url/jane.png",
    "role": "superadmin",
    "status": "active",
    "created_at": "2026-08-18T10:00:00",
    "updated_at": "2026-08-18T12:00:00"
  }
]
```

---

#### 2. Query Account by Specific Field (`GET /tc-auth/account/query?field=email&value=jane`)
- **Query Params**: `field` (`id` | `uid` | `email` | `handle` | `phone` | `name`), `value` (string)
- **Response Body**: Array of matching account objects.

---

#### 3. Superadmin Create User (`POST /tc-auth/account/`)
- **Request Body**:
```json
{
  "name": "Alice Security",
  "email": "alice@threatlens.io",
  "handle": "alicesec",
  "avatar_url": "https://avatar.url/alice.png",
  "phone": "+15550001122",
  "role": "analyst",
  "status": "active",
  "password": "InitialTempPassword123!"
}
```
- **Response Body**: Created `account` object.

---

#### 4. Superadmin Update User (`PATCH /tc-auth/account/`)
- **Request Body**:
```json
{
  "account_id": 1,
  "name": "Jane Doe Admin",
  "email": "jane.admin@threatlens.io",
  "handle": "jane_admin",
  "avatar_url": null,
  "phone": "+15550009988",
  "role": "superadmin",
  "status": "active",
  "password": "UpdatedPassword123!"
}
```
- **Response Body**: `null` (or updated user).

---

#### 5. Superadmin Delete User (`DELETE /tc-auth/account/`)
- **Request Body**:
```json
{
  "account_id": 4
}
```
- **Response Body**: `null` (Cascades to linked sessions and OAuth identities).

---

### 2.4 Admin OAuth Management Routes (`/tc-auth/oauth/*`)
*Requires `superadmin` role.*

- **List Links**: `GET /tc-auth/oauth/?page=1&limit=10`
- **Query Links**: `GET /tc-auth/oauth/query?field=account_id&value=1` (supported fields: `id`, `provider_id`, `account_id`)
- **Response Format**:
```json
[
  {
    "id": 1,
    "account_id": 1,
    "provider": "github",
    "provider_user_id": "7821948",
    "created_at": "2026-08-18T10:00:00"
  },
  {
    "id": 2,
    "account_id": 1,
    "provider": "google",
    "provider_user_id": "109283019283019283",
    "created_at": "2026-08-18T11:00:00"
  }
]
```
- **Manually Link OAuth**: `POST /tc-auth/oauth/` with body `{ "account_id": 1, "provider": "github", "provider_user_id": "12345" }`
- **Unlink OAuth**: `DELETE /tc-auth/oauth/` with body `{ "account_id": 1, "provider": "github" }`

---

### 2.5 Admin OTP Management Routes (`/tc-auth/otp/*`)
*Requires `superadmin` role.*

- **List OTPs**: `GET /tc-auth/otp/?page=1&limit=10`
- **Query OTP**: `GET /tc-auth/otp/query?identifier=jane@example.com`
- **Response Format**:
```json
[
  {
    "id": 1,
    "identifier": "jane@example.com",
    "purpose": "login",
    "code_hash": "2c6a4e0...hash",
    "attempts": 0,
    "expires_at": "2026-08-18T12:05:00",
    "created_at": "2026-08-18T12:00:00"
  }
]
```
- **Create Admin OTP**: `POST /tc-auth/otp/` with body `{ "identifier": "jane@example.com", "purpose": "reset", "expiry": 300 }` -> Returns `{ "otp": "948210", "expires_at": 1787054700 }`
- **Revoke Single OTP**: `DELETE /tc-auth/otp/` with body `{ "identifier": "jane@example.com", "purpose": "login" }`
- **Purge Expired OTPs**: `DELETE /tc-auth/otp/cleanup`
- **Purge All OTPs**: `DELETE /tc-auth/otp/clear`

---

### 2.6 Admin Session Management Routes (`/tc-auth/session/*`)
*Requires `superadmin` role.*

- **List All Sessions**: `GET /tc-auth/session/?page=1&limit=10`
- **Query Sessions**: `GET /tc-auth/session/query?field=id&value=1` (supported fields: `id` (account_id), `sid` (session_id), `token`, `ip`)
- **Response Format**:
```json
[
  {
    "id": 12,
    "account_id": 1,
    "token_hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    "expires_at": "2026-08-25T12:00:00",
    "created_at": "2026-08-18T12:00:00"
  }
]
```
- **Destroy Single Session**: `DELETE /tc-auth/session/` with body `{ "session_id": 12 }`
- **Destroy All User Sessions**: `DELETE /tc-auth/session/all` with body `{ "account_id": 1 }`
- **Cleanup Expired Sessions**: `DELETE /tc-auth/session/cleanup`
- **Clear All Database Sessions**: `DELETE /tc-auth/session/clear`

---

### 2.7 Git & Commit Security Engine (`GIT_MODULE` / `cli-backend`)

#### 1. Repository Metadata (`Repository.info_repo()`)
```json
{
  "url": "https://github.com/ThreatLens/ThreatLens.git",
  "username": "ThreatLens",
  "name": "ThreatLens",
  "default_branch": "main",
  "branches": ["main", "security/jwt-rotation", "feat/ratelimit"],
  "remote_branches": ["origin/main", "origin/feat/auth-v2"],
  "commit_count": 1428
}
```

---

#### 2. Repository Structure & Language Analytics (`RepositoryAnalyzer.analyze()`)
```json
{
  "repository": {
    "url": "https://github.com/ThreatLens/ThreatLens.git",
    "username": "ThreatLens",
    "name": "ThreatLens",
    "default_branch": "main",
    "branches": ["main", "dev"],
    "remote_branches": ["origin/main"],
    "commit_count": 1428
  },
  "files": {
    "total": 342,
    "by_extension": {
      ".py": 140,
      ".jsx": 72,
      ".ts": 48,
      ".json": 35,
      ".md": 22,
      ".css": 15,
      ".yaml": 10
    },
    "total_size": 18459200,
    "largest_files": [
      { "path": "frontend/src/components/DashboardPage.jsx", "size": 60482 },
      { "path": "sectest/report/html.py", "size": 52342 },
      { "path": "frontend/src/index.css", "size": 40739 },
      { "path": "cli-backend/analysis/commit.py", "size": 36250 }
    ]
  },
  "languages": {
    "files": 275,
    "extensions": {
      "Python": 140,
      "JavaScript": 72,
      "TypeScript": 48,
      "CSS": 15
    }
  },
  "tags": [
    { "name": "v1.0.0", "commit": "7f8a92b..." },
    { "name": "v2.0.0-rc1", "commit": "96e2a87..." }
  ]
}
```

---

#### 3. Commit List & Details (`Repository.list_commits()`)
```json
[
  {
    "sha": "96e2a871b53c19d4902187f0bca711832049e211",
    "short_sha": "96e2a87",
    "author_name": "Alex Vance",
    "author_email": "alex@threatlens.io",
    "committer_name": "Alex Vance",
    "committer_email": "alex@threatlens.io",
    "authored_at": "2026-08-18T11:45:00",
    "committed_at": "2026-08-18T11:45:00",
    "message": "fix(auth): sanitize user input and replace raw string query in user login endpoint",
    "parents": ["4e21a8d011f592cb1475e330a8901f443810c512"]
  }
]
```

---

#### 4. File-Level Commit Diff (`Repository.diff(sha)`)
```json
[
  {
    "change_type": "M",
    "old_path": "backend/routes/auth.py",
    "new_path": "backend/routes/auth.py",
    "old_mode": "100644",
    "new_mode": "100644",
    "diff": "@@ -42,8 +42,14 @@ def login_handler(request: LoginRequest):\n-    query = f\"SELECT * FROM users WHERE email = '{request.email}' AND password = '{request.password}'\"\n-    user = db.execute(query).fetchone()\n+    # ThreatLens Remediation: Use parameterized query binding\n+    query = \"SELECT id, email, password_hash, role FROM users WHERE email = :email LIMIT 1\"\n+    user = db.execute(text(query), {\"email\": request.email}).mappings().fetchone()"
  }
]
```

---

#### 5. Commit Risk, Secrets & AST Security Scan (`CommitAnalyzer.analyze(sha)`)
```json
{
  "commit": {
    "sha": "96e2a871b53c19d4902187f0bca711832049e211",
    "short_sha": "96e2a87",
    "author_name": "Alex Vance",
    "author_email": "alex@threatlens.io",
    "committer_name": "Alex Vance",
    "committer_email": "alex@threatlens.io",
    "authored_at": "2026-08-18T11:45:00",
    "committed_at": "2026-08-18T11:45:00",
    "message": "fix(auth): sanitize user input and replace raw string query in user login endpoint",
    "parents": ["4e21a8d011f592cb1475e330a8901f443810c512"]
  },
  "summary": {
    "risk_score": 18,
    "risk_level": "low",
    "files_changed": 1,
    "findings": 1,
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 1
  },
  "findings": [
    {
      "category": "security_code_pattern",
      "severity": "low",
      "title": "SQL Injection Vector Fixed",
      "description": "Commit removes unsafe string interpolation in SQL query execution and adds parameterized bind variables.",
      "path": "backend/routes/auth.py",
      "evidence": "- query = f\"SELECT * FROM users WHERE email = '{request.email}'\"\n+ query = \"SELECT id FROM users WHERE email = :email\""
    }
  ]
}
```

*Finding Categories supported by `CommitAnalyzer`:*
- `author_committer_mismatch` (Medium severity: Author != Committer)
- `merge_analysis` (Low / Info: Multi-parent merge commits)
- `sensitive_file` (High severity: Changes to `.env`, `id_rsa`, `.pem`, `secrets.yaml`, `credentials.json`)
- `permission_change` (Medium / High: File mode changed to executable `0777` / `0755`)
- `secret_detected` (Critical severity: AWS keys `AKIA...`, GitHub tokens `ghp_...`, RSA/OpenSSH private keys, Bearer tokens, Generic passwords)
- `security_code_pattern` (High / Critical: SQLi f-strings, OS command injection `os.system` / `subprocess.Popen(input)`, Unsafe deserialization `pickle.loads` / `yaml.load`, Dynamic execution `eval`/`exec`, Weak hashes `md5`/`sha1`, `verify=False` TLS bypass, `DEBUG=True`, Wildcard CORS `*`)
- `dependency_change` (Medium severity: Alterations to `requirements.txt`, `package.json`, `go.mod`, `pom.xml`, `cargo.toml`)
- `cicd_security` (High severity: Workflow modifications in `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`)
- `docker_k8s_security` (High severity: Root user execution in `Dockerfile`, privileged containers in `k8s/*.yaml`, open ports in `docker-compose.yml`)
- `suspicious_pattern` (Medium severity: Giant commit diffs, WIP commits, forced commits)

---

### 2.8 SecTest Dynamic Vulnerability Scanner & Report Server (`sectest/`)

- **Report Server Base URL**: `http://localhost:8765`
- **JSON Endpoint**: `GET /report.json` or `GET /api/findings`
- **HTML Interactive Report**: `GET /` or `GET /index.html`

#### JSON Findings Schema (`/report.json`):
```json
{
  "scanned_at": "2026-08-18T12:30:00.000000+00:00",
  "summary": {
    "total": 5,
    "by_severity": {
      "critical": 1,
      "high": 2,
      "medium": 1,
      "low": 1,
      "info": 0
    }
  },
  "findings": [
    {
      "module": "injection",
      "title": "SQL Injection Vector in User Query Filter",
      "severity": "critical",
      "explanation": "Unsanitized user input string was concatenated directly into PostgreSQL query builder clause allowing arbitrary database dump.",
      "remediation": "Replace raw string template with parameterized Prisma / pg-promise prepared statement binding.",
      "evidence": "Payload: ' OR '1'='1 returned HTTP 200 with 150 rows instead of 1.",
      "meta": {
        "endpoint": "POST /api/v1/users/search",
        "cwe": "CWE-89",
        "proof_hash": "0x9f4a7c2e88b13904a0ef1982bca48192a0e"
      }
    },
    {
      "module": "headers",
      "title": "Missing Strict-Transport-Security (HSTS) Header",
      "severity": "medium",
      "explanation": "The HTTP response does not enforce HTTPS connections via HSTS, making clients vulnerable to SSL stripping attacks.",
      "remediation": "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' to response headers.",
      "evidence": "Strict-Transport-Security header missing from response.",
      "meta": {
        "endpoint": "GET /tc-auth/config/pulse",
        "cwe": "CWE-319"
      }
    },
    {
      "module": "exposure",
      "title": "Exposed Sensitive Route: /openapi.json",
      "severity": "low",
      "explanation": "Publicly accessible OpenAPI schema exposes internal endpoint schemas and parameter data types.",
      "remediation": "Restrict OpenAPI and Swagger UI access to authenticated administrators in production.",
      "evidence": "HTTP 200 OK received at /openapi.json.",
      "meta": {
        "endpoint": "GET /openapi.json",
        "cwe": "CWE-200"
      }
    },
    {
      "module": "ratelimit",
      "title": "Lack of Rate Limiting on Login Endpoint",
      "severity": "high",
      "explanation": "Endpoint allowed 100 consecutive requests in 3 seconds without returning HTTP 429 Too Many Requests.",
      "remediation": "Implement sliding window IP rate limiter (e.g. 5 attempts / 60 seconds) with Redis or memory store.",
      "evidence": "100/100 requests returned status 401 instead of 429.",
      "meta": {
        "endpoint": "POST /tc-auth/login/password",
        "cwe": "CWE-307"
      }
    },
    {
      "module": "auth",
      "title": "Unauthenticated Access to Debug Status Endpoint",
      "severity": "high",
      "explanation": "Endpoint returned system metrics and environment details without validating Bearer token.",
      "remediation": "Wrap route handler with AuthDeps dependency to require valid session token.",
      "evidence": "HTTP 200 OK received without Authorization header.",
      "meta": {
        "endpoint": "GET /api/internal/debug",
        "cwe": "CWE-306"
      }
    }
  ],
  "errors": []
}
```

---

## 3. Frontend Dashboard Feature & UI Component Blueprint

Based on all backend APIs and schema outputs, here is the complete blueprint of everything that can be rendered on the ThreatLens Dashboard:

### 3.1 View 1: ThreatLens SOC Overview (Executive Telemetry)

```
+----------------------------------------------------------------------------------------------------+
|  🛡️ ThreatLens AI — Security Operations Center                               [Live Status: HEALTHY] |
+----------------------------------------------------------------------------------------------------+
|  [ STATS CARDS ]                                                                                   |
|  +------------------+  +------------------+  +------------------+  +------------------+            |
|  | TOTAL ACCOUNTS   |  | ACTIVE SESSIONS  |  | VULNERABILITIES  |  | CRITICAL ISSUES  |            |
|  | 48               |  | 104              |  | 5 Findings       |  | 1 Critical       |            |
|  | +12% this week   |  | Across 32 IPs    |  | SecTest Engine   |  | Needs Immediate  |            |
|  +------------------+  +------------------+  +------------------+  +------------------+            |
+----------------------------------------------------------------------------------------------------+
|  [ SYSTEM HEALTH & PROBE PULSE ]                                                                   |
|  • Backend State: ACTIVE  |  Pulse Response: "Hello"  |  System Time: 2026-08-18T12:00:00          |
|  • SMTP Mailer: ONLINE (smtp.gmail.com:587)  |  OAuth Handlers: GitHub (Active), Google (Active)   |
|  • JWT Duration: 7 Days  |  Algorithm: HS256  |  Database Engine: PostgreSQL                       |
+----------------------------------------------------------------------------------------------------+
|  [ RECENT SECURITY FINDINGS STREAM ]                                                               |
|  [!] CRITICAL - SQL Injection Vector in User Query Filter (CWE-89) -> POST /api/v1/users/search    |
|  [!] HIGH     - Lack of Rate Limiting on Login Endpoint (CWE-307) -> POST /tc-auth/login/password  |
|  [!] HIGH     - Unauthenticated Access to Debug Endpoint (CWE-306) -> GET /api/internal/debug     |
|  [i] MEDIUM   - Missing Strict-Transport-Security Header (CWE-319) -> GET /tc-auth/config/pulse    |
|  [i] LOW      - Exposed OpenAPI Specification (CWE-200) -> GET /openapi.json                       |
+----------------------------------------------------------------------------------------------------+
```

#### Visual UI Elements:
- **System Health Pill**: Shows `/tc-auth/config/pulse` real-time state (`status`, `state`, `system_time`).
- **Resource Count KPI Cards**:
  - `accounts`: Total registered user accounts.
  - `sessions`: Active device tokens.
  - `oauth`: Linked social accounts (Google/GitHub).
  - `otp`: Outstanding / active verification codes.
- **Vulnerability Summary Badges**:
  - `Critical` (Red), `High` (Orange), `Medium` (Yellow), `Low` (Blue), `Info` (Cyan).
- **Interactive Security Operations Terminal**: Integrated CLI terminal emulator for running on-demand `sectest` scans and inspecting raw probe streams.

---

### 3.2 View 2: Git Repository & Commit Risk Analyzer

```
+----------------------------------------------------------------------------------------------------+
|  🔍 Git Repository Security Analyzer                                  [Repo: ThreatLens/ThreatLens] |
+----------------------------------------------------------------------------------------------------+
|  [ REPOSITORY HEADER & CODEBASE ARCHITECTURE ]                                                     |
|  • Owner: ThreatLens  |  Repo: ThreatLens  |  Default Branch: main  |  Total Commits: 1,428        |
|  • Total Tracked Files: 342  |  Repository Size: 18.45 MB  |  Languages: Python (51%), JS (26%)    |
|                                                                                                    |
|  Language Distribution Breakdown Bar:                                                              |
|  [████████████████████ Python 51% | ██████████ JavaScript 26% | ██████ TypeScript 17% | ██ CSS 6%] |
+----------------------------------------------------------------------------------------------------+
|  [ TOP 5 LARGEST FILES ]                                                                           |
|  1. frontend/src/components/DashboardPage.jsx (60.4 KB)   4. cli-backend/analysis/commit.py (36.2 KB)|
|  2. sectest/report/html.py (52.3 KB)                   5. frontend/src/components/AuthPage.jsx    |
|  3. frontend/src/index.css (40.7 KB)                                                               |
+----------------------------------------------------------------------------------------------------+
|  [ COMMIT STREAM & RISK TIMELINE ]                                                                 |
|  Search Commit SHA / Message: [ ___________________________ ]  Filter Severity: [ All / High+ ]    |
|                                                                                                    |
|  • [96e2a87] - fix(auth): sanitize user input and replace raw string query in user login endpoint  |
|    Author: Alex Vance <alex@threatlens.io> | 10 mins ago | Risk Score: 18 (LOW) | 1 File Changed   |
|    Findings: 0 Critical, 0 High, 0 Medium, 1 Low (SQLi Vector Remediated)                          |
|                                                                                                    |
|  • [4e21a8d] - feat(billing): verify stripe webhook signature before processing checkout payload  |
|    Author: Elena Rostov <elena@threatlens.io> | 2 hrs ago | Risk Score: 12 (LOW) | 1 File Changed   |
|                                                                                                    |
|  • [7b19df3] - refactor(jwt): implement RS256 asymmetric token signing with key rotation support   |
|    Author: Sarah Chen <sarah@threatlens.io> | Yesterday | Risk Score: 10 (LOW) | 3 Files Changed   |
+----------------------------------------------------------------------------------------------------+
|  [ COMMIT DIFF INSPECTION & SECURITY RECEIPT ]                                                     |
|  Selected Commit: 96e2a871b53c19d4902187f0bca711832049e211                                        |
|  File Changed: backend/routes/auth.py (Mode: 100644 -> 100644)                                     |
|                                                                                                    |
|  - query = f"SELECT * FROM users WHERE email = '{request.email}' AND password = '{request.password}'"
|  - user = db.execute(query).fetchone()                                                             |
|  + # ThreatLens Remediation: Use parameterized query binding to prevent SQL Injection              |
|  + query = "SELECT id, email, password_hash, role FROM users WHERE email = :email LIMIT 1"        |
|  + user = db.execute(text(query), {"email": request.email}).mappings().fetchone()                 |
+----------------------------------------------------------------------------------------------------+
```

#### Visual UI Elements:
- **Repository Metadata Banner**: Cloned repo URL, owner, repo name, default branch, total commits, total files, total size.
- **Language Composition Progress Bar**: Color-coded proportional breakdown of codebase languages (`Python`, `JavaScript`, `TypeScript`, `HTML`, `CSS`, `Go`, `Rust`, `Shell`).
- **File System Explorer & Largest Files Table**: Shows file size rankings.
- **Commit History Feed**:
  - Short SHA badge (`96e2a87`) with copy-to-clipboard button.
  - Commit message, author name, author email, authored timestamp.
  - Risk Level Badge (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `NONE`).
  - Risk Score numerical dial (0 - 100).
  - Parent commit links.
- **Syntax-Highlighted Unified Diff Viewer**: Side-by-side or inline red/green line diff highlighting modified code lines.
- **AST Finding Alerts Card**: Displays specific flagged lines for:
  - Hardcoded API Keys / AWS Tokens / Private Keys (`-----BEGIN RSA PRIVATE KEY-----`).
  - Sensitive files added (`.env`, `credentials.json`, `id_rsa`).
  - Security code risks (SQL Injection interpolation, `eval()`, `os.system()`, `md5()`, `verify=False`, `DEBUG=True`, Wildcard CORS `*`).
  - Author vs. Committer metadata mismatch warning.

---

### 3.3 View 3: SecTest Dynamic Vulnerability Scanner & Prober

```
+----------------------------------------------------------------------------------------------------+
|  ⚡ SecTest Live Security Scanner & Penetration Prober                                              |
+----------------------------------------------------------------------------------------------------+
|  Target URL: [ http://localhost:8000               ]   Auth Header: [ Bearer eyJhbGci... ]         |
|  Modules:    [X] Headers   [X] Exposure   [X] Auth   [X] Injection   [X] Rate Limiting             |
|  [ ▶ START AUDIT ]   [ 🔄 RE-SCAN ]   [ 📥 EXPORT JSON ]   [ 🌐 OPEN STANDALONE HTML REPORT ]      |
+----------------------------------------------------------------------------------------------------+
|  [ SCAN RESULTS SUMMARY ]                                                                          |
|  Total Findings: 5  |  Critical: 1  |  High: 2  |  Medium: 1  |  Low: 1  |  Info: 0                |
+----------------------------------------------------------------------------------------------------+
|  FILTER BY CATEGORY:  [ All (5) ]  [ Injection (1) ]  [ Headers (1) ]  [ Exposure (1) ]  [ Auth (2) ]|
|                                                                                                    |
|  +-----------------------------------------------------------------------------------------------+ |
|  | [CRITICAL] SQL Injection Vector in User Query Filter                             CWE-89       | |
|  | Endpoint: POST /api/v1/users/search  |  Module: injection  |  Proof: 0x9f4a7c2e...88b1         | |
|  | Evidence: Payload ' OR '1'='1 returned full database dump of 150 accounts                     | |
|  | Remediation: Use parameterized query binding with prepared statements                          | |
|  +-----------------------------------------------------------------------------------------------+ |
|  | [HIGH] Lack of Rate Limiting on Login Endpoint                                   CWE-307      | |
|  | Endpoint: POST /tc-auth/login/password  |  Module: ratelimit                                  | |
|  | Evidence: 100 requests in 3.1s allowed without HTTP 429 status response                       | |
|  | Remediation: Configure sliding token bucket rate limiter (5 req/min per IP)                    | |
|  +-----------------------------------------------------------------------------------------------+ |
|  | [HIGH] Unauthenticated Access to Debug Endpoint                                  CWE-306      | |
|  | Endpoint: GET /api/internal/debug  |  Module: auth                                            | |
|  | Evidence: Status 200 OK returned system metrics without Bearer token                           | |
|  +-----------------------------------------------------------------------------------------------+ |
|  | [MEDIUM] Missing Strict-Transport-Security (HSTS) Header                         CWE-319      | |
|  | Endpoint: GET /tc-auth/config/pulse  |  Module: headers                                        | |
|  +-----------------------------------------------------------------------------------------------+ |
|  | [LOW] Exposed OpenAPI Schema Definition                                          CWE-200      | |
|  | Endpoint: GET /openapi.json  |  Module: exposure                                               | |
|  +-----------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

#### Visual UI Elements:
- **Scan Configuration Bar**:
  - Target Base URL input.
  - Authorization Header input (supports JWT Bearer tokens).
  - Module selector checkboxes (`headers`, `exposure`, `auth`, `injection`, `ratelimit`).
  - Scan trigger button with live spinning progress bar and terminal log drawer.
- **Category Filter Tabs**: Filter findings by module (`Headers`, `Exposure`, `Auth`, `Injection`, `Rate Limit`).
- **Severity Badges**:
  - `CRITICAL` (Pulsing Red)
  - `HIGH` (Amber/Orange)
  - `MEDIUM` (Yellow)
  - `LOW` (Sky Blue)
  - `INFO` (Slate/Gray)
- **Proof-of-Exploit Receipt**: Clickable cryptographic proof hash (`0x9f4a...88b1`) with copy button.
- **Export Action Buttons**:
  - Download JSON Report (`report.json`).
  - Launch Interactive Standalone Report (hosted on port `8765`).

---

### 3.4 View 4: User Profile, Security & Session Management

```
+----------------------------------------------------------------------------------------------------+
|  👤 User Profile & Active Device Sessions                                                          |
+----------------------------------------------------------------------------------------------------+
|  [ USER ACCOUNT CARD ]                                                                             |
|  Avatar: [ (👤) ]   Name: Jane Doe               Role: SUPERADMIN           Status: ACTIVE         |
|  Handle: @janedoe   Email: jane@example.com      Phone: +1 (555) 555-0100   UID: 3fa85f64-...      |
|  Account Created: 2026-08-18 10:00 UTC          Last Updated: 2026-08-18 12:00 UTC                 |
|                                                                                                    |
|  [ EDIT PROFILE ]   [ CHANGE PASSWORD ]   [ LINK GITHUB ]   [ LINK GOOGLE ]   [ LOGOUT ]           |
+----------------------------------------------------------------------------------------------------+
|  [ ACTIVE SESSIONS & DEVICE AUDIT ]                                      [ REVOKE ALL SESSIONS ]   |
|                                                                                                    |
|  • Session #12 (CURRENT DEVICE)                                                                    |
|    IP Address: 127.0.0.1 (Localhost)  |  Created: Today, 12:00 UTC  |  Expires: in 7 days          |
|    Browser: Chrome 128.0 on Windows 10 x64                                                         |
|    Token Hash: a591a6d40bf4...  [ This Device - Active ]                                           |
|                                                                                                    |
|  • Session #9                                                            [ 🗑️ TERMINATE SESSION ]   |
|    IP Address: 203.0.113.10 (Tokyo, JP)  |  Created: Aug 17, 18:20 UTC  |  Expires: in 6 days      |
|    Browser: Safari 17.2 on macOS Sonoma                                                            |
|    Token Hash: 7b19df33501a...                                                                     |
+----------------------------------------------------------------------------------------------------+
```

#### Visual UI Elements:
- **User Account Card**: Displays `name`, `handle`, `email`, `phone`, `role`, `status`, `avatar_url`, `uid`, and `created_at`.
- **Edit Profile Modal**: Form updating `name`, `email`, `handle`, `phone`, `avatar_url` via `PATCH /tc-auth/me`.
- **Change Password Modal**: Form verifying new password via `PUT /tc-auth/update/password`.
- **Linked OAuth Providers Section**: Visual badges for Google and GitHub accounts with link/unlink buttons.
- **Active Devices / Sessions Table**:
  - List of sessions from `SessionService.by_account()` or `GET /tc-auth/session/query?field=id&value={account_id}`.
  - Columns: Session ID, IP Address, Device / User-Agent, Created Timestamp, Expiration Countdown, Action (`Terminate Session`).
  - Global "Revoke All Other Sessions" button calling `POST /tc-auth/logout-all`.

---

### 3.5 View 5: Superadmin Control Center & Infrastructure Config
*(Visible only to users where `account.role === 'superadmin'`)*

```
+----------------------------------------------------------------------------------------------------+
|  ⚙️ Superadmin Infrastructure & Identity Management Control Center                                 |
+----------------------------------------------------------------------------------------------------+
|  [ RUNTIME CONFIGURATION EDITORS ]                                                                 |
|                                                                                                    |
|  1. EMAIL SMTP SERVER CONFIG (`POST /tc-auth/config/email`)                                        |
|     Host: [ smtp.gmail.com ]  Port: [ 587 ]  Sender: [ no-reply@threatlens.io ]  TLS: [X] Active   |
|     Username: [ mailer@threatlens.io ]  Password: [ ****************** ]     [ SAVE EMAIL CONFIG ] |
|                                                                                                    |
|  2. GITHUB OAUTH CREDENTIALS (`POST /tc-auth/config/github`)                                       |
|     Client ID: [ Iv1.8749129841298 ]  Redirect URI: [ http://localhost:8000/tc-auth/github/callback]
|     Client Secret: [ ****************** ]                                   [ SAVE GITHUB CONFIG ] |
|                                                                                                    |
|  3. GOOGLE OAUTH CREDENTIALS (`POST /tc-auth/config/google`)                                       |
|     Client ID: [ 129837198237.apps.googleusercontent.com ]  Redirect URI: [ .../google/callback ]  |
|     Client Secret: [ ****************** ]                                   [ SAVE GOOGLE CONFIG ] |
|                                                                                                    |
|  4. JWT TOKEN & SESSION LIFETIME (`POST /tc-auth/config/jwt`)                                      |
|     Signing Algorithm: [ HS256 (v) ]  Session Lifetime: [ 7 ] Days                                 |
|     JWT Secret Key: [ **************************************** ]            [ SAVE JWT CONFIG ]    |
+----------------------------------------------------------------------------------------------------+
|  [ USER ACCOUNTS DIRECTORY TABLE (`GET /tc-auth/account/`) ]                  [ + CREATE NEW USER ] |
|  Search Users: [ _____________________ ] Filter Role: [ All Roles (v) ] Page: [< 1 / 5 >]          |
|                                                                                                    |
|  ID | UID      | Name        | Handle   | Email            | Role       | Status | Actions         |
|  ---+----------+-------------+----------+------------------+------------+--------+-----------------|
|  1  | 3fa85f64 | Jane Doe    | janedoe  | jane@example.com | superadmin | active | [Edit] [Delete] |
|  2  | 7f8a92bc | Alex Vance  | avance   | alex@threat.io   | analyst    | active | [Edit] [Delete] |
|  3  | 4e21a8d0 | Elena R     | erostov  | elena@threat.io  | user       | active | [Edit] [Delete] |
+----------------------------------------------------------------------------------------------------+
|  [ OTP AUDITING & PURGE PANEL (`/tc-auth/otp/*`) ]                                                 |
|  • Active OTPs in Database: 6 records                                                              |
|  [ 🗑️ PURGE EXPIRED OTPS (`DELETE /cleanup`) ]   [ ⚠️ CLEAR ALL OTPS (`DELETE /clear`) ]           |
|                                                                                                    |
|  Identifier           | Purpose | Attempts | Expires At          | Created At          | Action    |
|  ---------------------+---------+----------+---------------------+---------------------+-----------|
|  jane@example.com     | login   | 0        | 2026-08-18 12:05:00 | 2026-08-18 12:00:00 | [Revoke]  |
|  alex@threatlens.io   | reset   | 1        | 2026-08-18 12:10:00 | 2026-08-18 12:05:00 | [Revoke]  |
+----------------------------------------------------------------------------------------------------+
|  [ GLOBAL SESSION AUDIT & PURGE PANEL (`/tc-auth/session/*`) ]                                     |
|  • Total Active Sessions: 104 records                                                              |
|  [ 🗑️ CLEANUP EXPIRED SESSIONS (`DELETE /cleanup`) ]   [ ⚠️ CLEAR ALL SESSIONS (`DELETE /clear`) ] |
+----------------------------------------------------------------------------------------------------+
```

#### Visual UI Elements:
- **Runtime Service Configuration Cards**: Form inputs mapped directly to `GET /tc-auth/config/load/` and updated dynamically via `POST /tc-auth/config/{email|github|google|jwt}` without server restarts.
- **Admin User Table**:
  - Full CRUD operations: Create User modal (`POST /tc-auth/account/`), Edit User modal (`PATCH /tc-auth/account/`), and Delete User dialog (`DELETE /tc-auth/account/`).
  - Search input filtering by `email`, `handle`, `name`, `id`, `uid`, or `phone`.
- **OTP Audit & Purge Panel**:
  - Live table of pending OTP tokens with attempt counters and expiration countdowns.
  - Buttons for `Revoke OTP`, `Cleanup Expired`, and `Clear All`.
- **Global Session Revocation Panel**:
  - Table of all database sessions with IP, User-Agent, and Expiration.
  - Buttons for `Revoke Session`, `Purge Expired`, and `Emergency Clear All`.

---

### 3.6 View 6: Vulnerability Deep-Dive & Remediation Drawer

When a user clicks on any security finding from either the **SecTest Live Scanner** or the **Git Commit Security Analyzer**, a slide-over modal drawer opens:

```
+----------------------------------------------------------------------------------------------------+
|  [ ✕ CLOSE ]                     VULNERABILITY FINDING DETAILS                     [SEC-8041]       |
+----------------------------------------------------------------------------------------------------+
|  TITLE: SQL Injection Vector in User Query Filter                                                  |
|  SEVERITY: [ 🔴 CRITICAL ]   |   CATEGORY: SQL Injection (SQLi)   |   CWE: CWE-89                  |
|  TARGET ENDPOINT: POST /api/v1/users/search                                                        |
|  CRYPTOGRAPHIC ATTESTATION RECEIPT: 0x9f4a7c2e88b13904a0ef1982bca48192a0e [ 📋 COPY PROOF ]       |
+----------------------------------------------------------------------------------------------------+
|  📖 ROOT CAUSE & TECHNICAL EXPLANATION                                                             |
|  Unsanitized user input supplied via the 'org_id' JSON parameter was concatenated directly into a  |
|  raw SQL query string without escaping or parameter binding. An attacker can supply payload        |
|  "' OR '1'='1" to bypass tenant isolation and dump the entire users table.                        |
+----------------------------------------------------------------------------------------------------+
|  🔬 PROBE EVIDENCE & EXPLOIT PAYLOAD TRACE                                                         |
|  POST /api/v1/users/search HTTP/1.1                                                                |
|  Host: localhost:8000                                                                              |
|  Content-Type: application/json                                                                    |
|  { "orgId": "' OR '1'='1 --" }                                                                     |
|                                                                                                    |
|  HTTP/1.1 200 OK                                                                                   |
|  Content-Type: application/json                                                                    |
|  [ { "id": 1, "email": "admin@threatlens.io", "role": "superadmin" }, ... 149 more items ]         |
+----------------------------------------------------------------------------------------------------+
|  🛠️ ACTIONABLE REMEDIATION & CODE FIX                                                               |
|  Replace raw string concatenation with parameterized SQL bindings:                                 |
|                                                                                                    |
|  ```diff                                                                                           |
|  - const query = `SELECT * FROM users WHERE org_id = '${req.body.orgId}'`;                         |
|  + const query = `SELECT * FROM users WHERE org_id = $1`;                                           |
|  + const result = await db.query(query, [req.body.orgId]);                                         |
|  ```                                                                                               |
+----------------------------------------------------------------------------------------------------+
|  [ 📄 EXPORT PDF RECEIPT ]     [ 🌐 VERIFY ON-CHAIN ATTESTATION ]     [ 🛡️ MARK AS RESOLVED ]      |
+----------------------------------------------------------------------------------------------------+
```

---

## 4. Master Backend Parameter to Frontend UI Mapping Matrix

| Backend Parameter | Source Endpoint / Module | Data Type | Frontend Dashboard UI Component | Display Format & Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `status`, `state` | `GET /tc-auth/config/pulse` | `string` | Top Nav System Health Indicator | Green glowing badge: `Healthy • Active` |
| `system_time` | `GET /tc-auth/config/pulse` | `ISO string` | System Clock & Telemetry Card | Formatted localized time (e.g. `12:00:00 UTC`) |
| `accounts` count | `GET /tc-auth/config/counts` | `integer` | Metric KPI Card | Large numeric counter (e.g. `48`) |
| `oauth` count | `GET /tc-auth/config/counts` | `integer` | Metric KPI Card | Large numeric counter (e.g. `19`) |
| `sessions` count | `GET /tc-auth/config/counts` | `integer` | Metric KPI Card | Large numeric counter (e.g. `104`) |
| `otp` count | `GET /tc-auth/config/counts` | `integer` | Metric KPI Card | Large numeric counter (e.g. `6`) |
| `account.id` | `GET /tc-auth/me` | `integer` | Profile Header & Table | Numeric ID `#1` |
| `account.uid` | `GET /tc-auth/me` | `UUID string` | Profile Detail & Copy Button | Truncated UUID with copy tooltip |
| `account.name` | `GET /tc-auth/me` | `string` | Avatar & Header Greeting | `Jane Doe` |
| `account.handle` | `GET /tc-auth/me` | `string` | User Handle Badge | `@janedoe` |
| `account.email` | `GET /tc-auth/me` | `string` | User Email Field | Clickable `mailto:` link |
| `account.phone` | `GET /tc-auth/me` | `string \| null` | Profile Contact Info | International phone format (e.g. `+1 555...`) |
| `account.avatar_url` | `GET /tc-auth/me` | `string \| null` | Topbar & Profile Image | Rounded image with fallback initial letter |
| `account.role` | `GET /tc-auth/me` | `string` | RBAC Role Pill | `SUPERADMIN` (Purple), `USER` (Slate) |
| `account.status` | `GET /tc-auth/me` | `string \| null` | Account Status Pill | `ACTIVE` (Green), `SUSPENDED` (Red) |
| `account.created_at` | `GET /tc-auth/me` | `ISO string` | Account Metadata | Formatted date (e.g. `Aug 18, 2026`) |
| `session.ip_address` | `GET /tc-auth/me` | `string` | Session Table Item | IPv4/IPv6 address with Geo-IP flag |
| `session.user_agent` | `GET /tc-auth/me` | `string` | Device Audit Item | Parsed browser & OS icons (Chrome / Windows) |
| `session.expires_at` | `GET /tc-auth/me` | `ISO string` | Session Expiration Pill | Relative countdown (e.g. `Expires in 6 days`) |
| `email.host`, `port` | `GET /tc-auth/config/load/` | `string, int` | Admin SMTP Server Form | Text inputs & Port selector |
| `github.client_id` | `GET /tc-auth/config/load/` | `string` | Admin OAuth Settings Form | Masked input field |
| `google.client_id` | `GET /tc-auth/config/load/` | `string` | Admin OAuth Settings Form | Masked input field |
| `jwt.algorithm` | `GET /tc-auth/config/load/` | `string` | Admin JWT Settings Form | Dropdown (`HS256`, `RS256`) |
| `jwt.session_duration` | `GET /tc-auth/config/load/` | `integer` | Admin JWT Settings Form | Number input (e.g. `7` days) |
| `repo.username`, `name`| `Repository.info_repo()` | `string` | Git Scanner Header | `ThreatLens / ThreatLens` |
| `repo.default_branch` | `Repository.info_repo()` | `string` | Git Branch Selector | Branch pill with git branch icon |
| `repo.branches` | `Repository.info_repo()` | `list[str]` | Branch Dropdown Filter | Selectable branches list |
| `repo.commit_count` | `Repository.info_repo()` | `integer` | Git Header Stats | Total commits badge (`1,428 commits`) |
| `files.total` | `RepositoryAnalyzer` | `integer` | Codebase Stats Card | File counter (`342 files`) |
| `files.total_size` | `RepositoryAnalyzer` | `integer (bytes)`| Codebase Stats Card | Formatted size (`18.45 MB`) |
| `files.largest_files` | `RepositoryAnalyzer` | `list[{path, size}]`| Largest Files Table | Ranked table with progress meter |
| `languages.extensions`| `RepositoryAnalyzer` | `dict[str, int]` | Language Distribution Bar | Multi-colored proportion bar |
| `commit.sha` | `Repository.list_commits()` | `string (40 hex)`| Commit Feed & Diff Header | Truncated `96e2a87` with Copy SHA |
| `commit.message` | `Repository.list_commits()` | `string` | Commit Feed Title | Multi-line git commit message |
| `commit.author_name` | `Repository.list_commits()` | `string` | Commit Author Info | Author name with gravatar |
| `commit.authored_at` | `Repository.list_commits()` | `ISO string` | Commit Timestamp | Relative time (e.g. `10 mins ago`) |
| `summary.risk_score` | `CommitAnalyzer.analyze()` | `integer (0-100)` | Commit Risk Score Dial | Circular progress ring (0-100) |
| `summary.risk_level` | `CommitAnalyzer.analyze()` | `string` | Risk Level Badge | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `finding.category` | `CommitAnalyzer.analyze()` | `string` | Finding Category Tag | `secret_detected`, `sensitive_file`, etc. |
| `finding.severity` | `CommitAnalyzer / SecTest` | `string` | Severity Badge | `critical`, `high`, `medium`, `low`, `info` |
| `finding.title` | `CommitAnalyzer / SecTest` | `string` | Finding Card Title | Bold descriptive headline |
| `finding.description` | `CommitAnalyzer / SecTest` | `string` | Finding Detail Drawer | Formatted explanation paragraph |
| `finding.evidence` | `CommitAnalyzer / SecTest` | `string` | Code / Payload Drawer | Monospace terminal code block |
| `finding.remediation` | `SecTest EnrichedFinding` | `string` | Remediation Drawer | Markdown diff block / step-by-step fix |
| `finding.meta.endpoint`| `SecTest EnrichedFinding` | `string` | Target Endpoint Tag | `POST /api/v1/users/search` |
| `finding.meta.cwe` | `SecTest EnrichedFinding` | `string` | Compliance Pill | `CWE-89`, `CWE-79`, `CWE-307` |
| `finding.meta.proof_hash`| `SecTest EnrichedFinding`| `string` | Polygon Proof Receipt | Hex hash with copy button |

---

## 5. Backend State, Known Gotchas, and Frontend Resilience Guidelines

When integrating the frontend dashboard with the live backend, the frontend should implement the following resilient behaviors:

1. **Forgot Password Payload Fallback**:
   - The backend handler for `POST /tc-auth/forgot/password` expects `body.password` alongside `email` and `otp`. If the backend throws a schema validation error, the frontend should support both OTP validation and direct password reset flows.
2. **Password Update Error Protection**:
   - `PUT /tc-auth/update/password` requires a JSON body `{ "password": "new-password" }`.
3. **Session Query Field Convention**:
   - When searching sessions for a specific user ID via `GET /tc-auth/session/query`, pass query param `field=id` (which maps to `account_id`) or `field=sid` (which maps to `session_id`).
4. **OAuth Link Query Field Convention**:
   - When searching OAuth links via `GET /tc-auth/oauth/query`, pass `field=account_id` or `field=id`.
5. **Standalone Report Server Connection**:
   - When SecTest is executed, the report is served on `http://localhost:8765/report.json`. If this port is inactive, the frontend should gracefully fallback to the cached sample findings or prompt the user to trigger a scan via the terminal.
6. **Token Expiration & Auto-Refresh Handling**:
   - Tokens decode to `{ aid, sid, token, exp }`. The frontend should monitor the `exp` claim and redirect to `/login` or prompt for OTP re-authentication when expired.

---

*Generated by Antigravity IDE for ThreatLens Security Architecture.*
