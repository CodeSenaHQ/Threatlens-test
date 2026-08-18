import React, { useState } from "react";
import {
  Settings,
  Mail,
  Key,
  Shield,
  Users,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminTab() {
  const [emailConfig, setEmailConfig] = useState({
    host: "smtp.gmail.com",
    port: 587,
    username: "mailer@threatlens.io",
    sender: "no-reply@threatlens.io",
    use_tls: true,
  });

  const [jwtConfig, setJwtConfig] = useState({
    algorithm: "HS256",
    session_duration_days: 7,
    secret_key: "********************************",
  });

  const users = [
    { id: 1, uid: "3fa85f64", name: "Jane Doe", handle: "janedoe", email: "jane@example.com", role: "superadmin", status: "active" },
    { id: 2, uid: "7f8a92bc", name: "Alex Vance", handle: "avance", email: "alex@threatlens.io", role: "analyst", status: "active" },
    { id: 3, uid: "4e21a8d0", name: "Elena Rostov", handle: "erostov", email: "elena@threatlens.io", role: "user", status: "active" },
  ];

  const handleSaveEmail = () => {
    toast.success("SMTP Configuration saved successfully via POST /tc-auth/config/email");
  };

  const handleSaveJWT = () => {
    toast.success("JWT Signing Configuration saved successfully via POST /tc-auth/config/jwt");
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Split: Runtime Config Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: SMTP Mailer Config */}
        <div className="p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.08] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#38bdf8]" />
              <span>SMTP Mailer Configuration</span>
            </h2>
            <button
              onClick={handleSaveEmail}
              className="px-3 py-1 rounded-xl bg-[#2546ff] hover:bg-[#0d27c7] text-white text-[11px] font-bold shadow-[0_0_10px_rgba(37,70,255,0.3)] transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-[10px] text-[#8a99ad] uppercase">SMTP Host</label>
              <input
                type="text"
                value={emailConfig.host}
                onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#07090e] border border-white/[0.1] text-white text-xs outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#8a99ad] uppercase">Port</label>
                <input
                  type="number"
                  value={emailConfig.port}
                  onChange={(e) => setEmailConfig({ ...emailConfig, port: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#07090e] border border-white/[0.1] text-white text-xs outline-none focus:border-[#38bdf8]"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#8a99ad] uppercase">Sender Name</label>
                <input
                  type="text"
                  value="ThreatLens Security"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#07090e] border border-white/[0.1] text-white text-xs outline-none focus:border-[#38bdf8]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: JWT & Session Lifetime */}
        <div className="p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.08] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
              <Key className="w-4 h-4 text-[#38bdf8]" />
              <span>JWT & Session Settings</span>
            </h2>
            <button
              onClick={handleSaveJWT}
              className="px-3 py-1 rounded-xl bg-[#2546ff] hover:bg-[#0d27c7] text-white text-[11px] font-bold shadow-[0_0_10px_rgba(37,70,255,0.3)] transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#8a99ad] uppercase">Algorithm</label>
                <select
                  value={jwtConfig.algorithm}
                  onChange={(e) => setJwtConfig({ ...jwtConfig, algorithm: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#07090e] border border-white/[0.1] text-white text-xs outline-none focus:border-[#38bdf8]"
                >
                  <option value="HS256">HS256</option>
                  <option value="RS256">RS256</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#8a99ad] uppercase">Session Lifetime (Days)</label>
                <input
                  type="number"
                  value={jwtConfig.session_duration_days}
                  onChange={(e) => setJwtConfig({ ...jwtConfig, session_duration_days: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#07090e] border border-white/[0.1] text-white text-xs outline-none focus:border-[#38bdf8]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#8a99ad] uppercase">JWT Secret Key</label>
              <input
                type="password"
                value={jwtConfig.secret_key}
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#07090e] border border-white/[0.1] text-white text-xs outline-none focus:border-[#38bdf8]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.08] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-[#38bdf8]" />
              <span>User Accounts Directory (`GET /tc-auth/account/`)</span>
            </h2>
            <p className="text-[11px] text-[#8a99ad] font-mono mt-0.5">
              Superadmin account administration and RBAC role assignment
            </p>
          </div>

          <button
            onClick={() => toast.info("Create User modal opened")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2546ff] hover:bg-[#0d27c7] text-white text-xs font-bold shadow-[0_0_12px_rgba(37,70,255,0.3)] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create User</span>
          </button>
        </div>

        <div className="rounded-xl border border-white/[0.06] overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase text-[#8a99ad] bg-white/[0.02]">
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Handle</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono text-[11px]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] text-[#cbd5e1]">
                  <td className="py-2.5 px-3">{u.id}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white">{u.name}</td>
                  <td className="py-2.5 px-3">@{u.handle}</td>
                  <td className="py-2.5 px-3">{u.email}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-[#2546ff]/20 text-[#38bdf8] uppercase text-[9px] font-bold">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase text-[9px] font-bold">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="p-1 rounded text-[#8a99ad] hover:text-white transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 rounded text-[#8a99ad] hover:text-rose-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
