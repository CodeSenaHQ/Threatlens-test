import React, { useState } from "react";
import {
  User,
  Shield,
  Smartphone,
  Laptop,
  Globe,
  Trash2,
  Lock,
  Key,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function IdentityTab() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([
    {
      id: 12,
      ip: "127.0.0.1 (Localhost)",
      device: "Chrome 128 on Windows 10 x64",
      created: "Today, 12:00 UTC",
      expires: "in 7 days",
      current: true,
    },
    {
      id: 9,
      ip: "203.0.113.10 (Tokyo, JP)",
      device: "Safari 17.2 on macOS Sonoma",
      created: "Aug 17, 18:20 UTC",
      expires: "in 6 days",
      current: false,
    },
  ]);

  const handleTerminateSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success(`Session #${sessionId} terminated successfully.`);
  };

  const handleRevokeAll = () => {
    setSessions((prev) => prev.filter((s) => s.current));
    toast.success("All other active device sessions revoked.");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Account Profile Card */}
      <div className="p-6 rounded-2xl bg-[#0a0d15] border border-white/[0.08] shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2546ff] to-[#00F2FE] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{user?.name || "Jane Doe"}</h2>
                <span className="px-2 py-0.5 rounded-md bg-[#2546ff]/20 text-[#38bdf8] font-mono text-[10px] font-bold uppercase border border-[#38bdf8]/30">
                  {user?.role || "superadmin"}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#8a99ad] font-mono mt-1">
                @{user?.handle || "janedoe"} · {user?.email || "admin@threatlens.io"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info("Edit Profile modal opened")}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08] transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={() => toast.info("Change Password dialog opened")}
              className="px-4 py-2 rounded-xl bg-[#2546ff] hover:bg-[#0d27c7] text-xs font-bold text-white shadow-[0_0_12px_rgba(37,70,255,0.3)] transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] text-xs font-mono">
          <div>
            <span className="text-[#8a99ad] text-[10px] uppercase">Account UID</span>
            <p className="text-white font-medium truncate mt-0.5">3fa85f64-5717-4562-b3fc</p>
          </div>
          <div>
            <span className="text-[#8a99ad] text-[10px] uppercase">Phone Number</span>
            <p className="text-white font-medium mt-0.5">+1 (555) 555-0100</p>
          </div>
          <div>
            <span className="text-[#8a99ad] text-[10px] uppercase">Created Timestamp</span>
            <p className="text-white font-medium mt-0.5">2026-08-18 10:00 UTC</p>
          </div>
        </div>
      </div>

      {/* Active Device Sessions Table */}
      <div className="p-6 rounded-2xl bg-[#0a0d15] border border-white/[0.08] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#38bdf8]" />
              <span>Active Device Sessions</span>
            </h2>
            <p className="text-[11px] text-[#8a99ad] font-mono mt-0.5">
              Authorized client sessions with valid cryptographic JWT tokens
            </p>
          </div>

          <button
            onClick={handleRevokeAll}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Revoke All Other Devices</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-3.5 rounded-xl bg-[#07090e] border border-white/[0.06] flex items-center justify-between gap-4 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] text-[#38bdf8] flex items-center justify-center shrink-0">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold">{sess.device}</p>
                    {sess.current && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] uppercase font-bold">
                        Current Device
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8a99ad]">{sess.ip} · Created {sess.created}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#8a99ad] text-[11px]">Expires {sess.expires}</span>
                {!sess.current && (
                  <button
                    onClick={() => handleTerminateSession(sess.id)}
                    className="p-1.5 rounded-lg text-[#8a99ad] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Terminate Session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
