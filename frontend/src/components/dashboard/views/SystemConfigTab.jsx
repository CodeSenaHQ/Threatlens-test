import React, { useState } from "react";
import {
  Settings,
  Mail,
  Key,
  Shield,
  Clock,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function SystemConfigTab() {
  const [smtpHost, setSmtpHost] = useState("smtp.resend.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("resend");
  const [jwtSecret, setJwtSecret] = useState("••••••••••••••••••••••••••••••••");
  const [jwtTtl, setJwtTtl] = useState("15");
  const [githubClientId, setGithubClientId] = useState("Iv1.8a2b3c4d5e6f7a8b");
  const [rateLimit, setRateLimit] = useState("100");

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Security & runtime configuration saved successfully!");
  };

  const handleTestSmtp = () => {
    toast.info("Sending test SMTP pulse email to admin...");
    setTimeout(() => toast.success("Test email delivered successfully!"), 1500);
  };

  return (
    <div className="space-y-7">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-white">System & Security Configuration</h1>
          <p className="text-xs text-[#8a99ad] mt-1 font-mono">
            GET /tc-auth/config/load · SMTP mailer settings, OAuth federation providers, JWT signing keys & rate limits
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleTestSmtp}
            className="px-4 py-2 rounded-lg border border-[#2b3947] bg-[#10151a] text-[#d8e2e8] hover:border-white/[0.2] hover:bg-[#141b21] shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Test SMTP Relay</span>
          </button>
        </div>
      </div>

      {/* Config Grid (2 Columns) */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-5.5">
        {/* Panel 1: SMTP Mailer Config */}
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#253240]">
            <Mail className="w-4 h-4 text-[#38bdf8]" />
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              SMTP Relay Settings
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[10px] text-[#8a99ad] uppercase block mb-1">SMTP Host</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-white focus:border-[#38bdf8] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#8a99ad] uppercase block mb-1">Port</label>
                <input
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-white focus:border-[#38bdf8] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#8a99ad] uppercase block mb-1">Username</label>
                <input
                  type="text"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-white focus:border-[#38bdf8] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: JWT & Cryptographic Keys */}
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#253240]">
            <Key className="w-4 h-4 text-[#38bdf8]" />
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              JWT & Session Keys
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[10px] text-[#8a99ad] uppercase block mb-1">JWT Secret Signing Key</label>
              <input
                type="password"
                value={jwtSecret}
                onChange={(e) => setJwtSecret(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-white focus:border-[#38bdf8] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#8a99ad] uppercase block mb-1">Algorithm</label>
                <select className="w-full px-3 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-white focus:border-[#38bdf8] focus:outline-none">
                  <option value="HS256">HS256 (HMAC SHA-256)</option>
                  <option value="RS256">RS256 (RSA Signature)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#8a99ad] uppercase block mb-1">Access TTL (Minutes)</label>
                <input
                  type="number"
                  value={jwtTtl}
                  onChange={(e) => setJwtTtl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-white focus:border-[#38bdf8] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: OAuth Federation */}
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#253240]">
            <Lock className="w-4 h-4 text-[#38bdf8]" />
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              OAuth 2.0 Federation
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[10px] text-[#8a99ad] uppercase block mb-1">GitHub Client ID</label>
              <input
                type="text"
                value={githubClientId}
                onChange={(e) => setGithubClientId(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-white focus:border-[#38bdf8] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8a99ad] uppercase block mb-1">Callback URL</label>
              <input
                type="text"
                readOnly
                value="http://localhost:8000/tc-auth/oauth/github/callback"
                className="w-full px-3.5 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-[#8a99ad] focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Panel 4: Rate Limiting & Firewall */}
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#253240]">
            <Shield className="w-4 h-4 text-[#38bdf8]" />
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Rate Limit & Anti-Abuse
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[10px] text-[#8a99ad] uppercase block mb-1">Max Requests per Minute (IP)</label>
              <input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-white focus:border-[#38bdf8] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8a99ad] uppercase block mb-1">Sliding Window Throttle</label>
              <input
                type="text"
                readOnly
                value="60 Seconds (Redis sliding window counter)"
                className="w-full px-3.5 py-2 bg-[#0a0d10] border border-[#283747] rounded-lg text-[#8a99ad] focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="lg:col-span-2 pt-2 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg border border-[#38bdf8] bg-[#38bdf8] text-[#04140c] font-bold text-xs font-mono hover:brightness-110 shadow-[0_0_16px_rgba(56,189,248,0.4)] transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Runtime Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
