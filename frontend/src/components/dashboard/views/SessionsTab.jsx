import React, { useState } from "react";
import {
  Clock,
  Laptop,
  Smartphone,
  Terminal,
  ShieldAlert,
  LogOut,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function SessionsTab() {
  const [sessions, setSessions] = useState([
    {
      id: "sess_01J5K4M9QZ",
      device: "Chrome 128 (Windows 11)",
      ip: "127.0.0.1 (Localhost)",
      type: "desktop",
      issuedAt: "2026-08-18 19:40:12",
      lastActive: "Just now",
      isCurrent: true,
    },
    {
      id: "sess_01J5K389TA",
      device: "ThreatLens CLI Daemon (v2.4.0)",
      ip: "192.168.1.105 (LAN)",
      type: "cli",
      issuedAt: "2026-08-18 18:20:00",
      lastActive: "20 mins ago",
      isCurrent: false,
    },
    {
      id: "sess_01J5JZ78XB",
      device: "Firefox Developer Edition (macOS)",
      ip: "104.28.19.44 (US East)",
      type: "desktop",
      issuedAt: "2026-08-18 14:15:30",
      lastActive: "5 hours ago",
      isCurrent: false,
    },
    {
      id: "sess_01J5HX66MN",
      device: "Mobile Safari (iOS 18)",
      ip: "172.56.21.89 (Cellular)",
      type: "mobile",
      issuedAt: "2026-08-17 22:10:00",
      lastActive: "Yesterday",
      isCurrent: false,
    },
  ]);

  const handleRevoke = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success(`Session ${id.slice(0, 10)}... revoked!`);
  };

  const handleRevokeAllOthers = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast.success("Revoked all 3 secondary device sessions.");
  };

  return (
    <div className="space-y-7">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-white">Active Device Sessions</h1>
          <p className="text-xs text-[#8a99ad] mt-1 font-mono">
            GET /tc-auth/session · cryptographic session JWT tokens, client IPs & single-click token revocation
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleRevokeAllOthers}
            className="px-4 py-2 rounded-lg border border-rose-500/40 bg-rose-500/15 text-rose-400 font-bold hover:bg-rose-500/25 shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Revoke All Other Sessions</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Active Tokens</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">{sessions.length} Active</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">HS256 signed</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Current Session</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-emerald-400">Verified</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Chrome / Windows 11</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Daemon Sessions</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">1 CLI</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">ThreatLens CLI v2.4</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Security State</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#38bdf8]">Nominal</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">No hijack indicators</div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-[#10151a] border border-[#263544] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between p-3.5 px-4.5 border-b border-[#253240] bg-[#12181f]/60">
          <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Connected Devices & Client Tokens
          </h2>
          <div className="font-mono text-[10px] text-[#8a99ad]">GET /tc-auth/session</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#253240] text-[10px] font-mono uppercase tracking-wider text-[#8a99ad] bg-[#0c1015]">
                <th className="py-3 px-4.5">Device & Client</th>
                <th className="py-3 px-4.5">IP Address</th>
                <th className="py-3 px-4.5">Issued At</th>
                <th className="py-3 px-4.5">Last Active</th>
                <th className="py-3 px-4.5">Status</th>
                <th className="py-3 px-4.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222e3a]">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.03] transition-colors font-mono">
                  <td className="py-3 px-4.5 align-middle">
                    <div className="flex items-center gap-2.5">
                      {s.type === "desktop" ? (
                        <Laptop className="w-4 h-4 text-[#38bdf8]" />
                      ) : s.type === "mobile" ? (
                        <Smartphone className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Terminal className="w-4 h-4 text-emerald-400" />
                      )}
                      <div>
                        <div className="font-semibold text-white font-sans">{s.device}</div>
                        <div className="text-[10px] text-[#8a99ad]">{s.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4.5 align-middle text-[11px] text-[#d8e2e8]">
                    {s.ip}
                  </td>

                  <td className="py-3 px-4.5 align-middle text-[11px] text-[#8a99ad]">
                    {s.issuedAt}
                  </td>

                  <td className="py-3 px-4.5 align-middle text-[11px] text-white">
                    {s.lastActive}
                  </td>

                  <td className="py-3 px-4.5 align-middle">
                    {s.isCurrent ? (
                      <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                        Current Device
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded border border-[#2b3947] bg-white/[0.03] text-[#8a99ad] text-[10px]">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4.5 align-middle text-right">
                    {!s.isCurrent && (
                      <button
                        onClick={() => handleRevoke(s.id)}
                        className="px-3 py-1 rounded bg-[#141b21] hover:bg-rose-500/20 border border-[#2b3947] hover:border-rose-500/40 text-xs text-[#8a99ad] hover:text-rose-400 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
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
