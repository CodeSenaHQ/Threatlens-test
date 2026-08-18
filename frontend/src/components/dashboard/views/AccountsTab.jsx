import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  UserCheck,
  UserX,
  Key,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export default function AccountsTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const accounts = [
    {
      id: 1,
      name: "Dev",
      handle: "dev47929",
      email: "dev@threatlens.io",
      role: "superadmin",
      status: "active",
      createdAt: "2026-08-18",
      avatarInitials: "DV",
    },
    {
      id: 2,
      name: "Alex Vance",
      handle: "avance",
      email: "alex@threatlens.io",
      role: "analyst",
      status: "active",
      createdAt: "2026-08-15",
      avatarInitials: "AV",
    },
    {
      id: 3,
      name: "Elena Rostov",
      handle: "erostov",
      email: "elena@threatlens.io",
      role: "analyst",
      status: "active",
      createdAt: "2026-08-10",
      avatarInitials: "ER",
    },
    {
      id: 4,
      name: "Marcus Brody",
      handle: "mbrody",
      email: "marcus@threatlens.io",
      role: "auditor",
      status: "active",
      createdAt: "2026-08-01",
      avatarInitials: "MB",
    },
    {
      id: 5,
      name: "Sarah Chen",
      handle: "schen",
      email: "sarah@threatlens.io",
      role: "superadmin",
      status: "active",
      createdAt: "2026-07-28",
      avatarInitials: "SC",
    },
  ];

  const filteredAccounts = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-7">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#253240]/60">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-white">Accounts & User Directory</h1>
          <p className="text-xs text-[#8a99ad] mt-1 font-mono">
            GET /tc-auth/account · role-based access control (RBAC), analyst provisioning & permission directory
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => toast.info("Creating new user account dialog...")}
            className="px-4 py-2 rounded-lg border border-[#38bdf8] bg-[#38bdf8] text-[#04140c] font-bold hover:brightness-110 shadow-[0_0_16px_rgba(56,189,248,0.4)] transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New User</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Total Accounts</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">18 Users</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">100% active standing</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Superadmins</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">2 Roles</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Dev & Sarah Chen</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Security Analysts</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-white">14 Analysts</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Full audit permissions</div>
        </div>

        <div className="bg-[#10151a] border border-[#263544] rounded-xl p-4.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <div className="text-[10.5px] uppercase tracking-wider text-[#8a99ad] font-mono font-semibold">Active Sessions</div>
          <div className="font-mono text-xl font-bold mt-1.5 text-[#38bdf8]">6 Live</div>
          <div className="text-[11px] text-[#8a99ad] mt-1 font-mono">Verified JWT tokens</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#8a99ad] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search accounts by name, email, handle..."
          className="w-full pl-10 pr-4 py-2 bg-[#10151a] border border-[#283747] rounded-lg text-xs font-mono text-white placeholder-[#6f8390] focus:border-[#38bdf8] focus:outline-none"
        />
      </div>

      {/* Accounts Table */}
      <div className="bg-[#10151a] border border-[#263544] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between p-3.5 px-4.5 border-b border-[#253240] bg-[#12181f]/60">
          <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            User Accounts & Permissions
          </h2>
          <div className="font-mono text-[10px] text-[#8a99ad]">GET /tc-auth/account</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#253240] text-[10px] font-mono uppercase tracking-wider text-[#8a99ad] bg-[#0c1015]">
                <th className="py-3 px-4.5">User</th>
                <th className="py-3 px-4.5">Email & Handle</th>
                <th className="py-3 px-4.5">Role</th>
                <th className="py-3 px-4.5">Status</th>
                <th className="py-3 px-4.5">Created</th>
                <th className="py-3 px-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222e3a]">
              {filteredAccounts.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-4.5 align-middle">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2546ff] to-[#38bdf8] text-[#03110c] font-bold text-[10px] font-mono flex items-center justify-center shadow-sm">
                        {a.avatarInitials}
                      </div>
                      <span className="font-semibold text-white">{a.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4.5 align-middle font-mono text-[11px]">
                    <div className="text-[#d8e2e8]">{a.email}</div>
                    <div className="text-[#8a99ad] text-[10px]">@{a.handle}</div>
                  </td>

                  <td className="py-3 px-4.5 align-middle font-mono text-[10px] uppercase">
                    <span
                      className={`px-2 py-0.5 rounded border font-semibold ${
                        a.role === "superadmin"
                          ? "bg-purple-500/15 border-purple-500/30 text-purple-400"
                          : "bg-[#38bdf8]/10 border-[#38bdf8]/30 text-[#38bdf8]"
                      }`}
                    >
                      {a.role}
                    </span>
                  </td>

                  <td className="py-3 px-4.5 align-middle font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{a.status}</span>
                  </td>

                  <td className="py-3 px-4.5 align-middle font-mono text-[11px] text-[#8a99ad]">
                    {a.createdAt}
                  </td>

                  <td className="py-3 px-4.5 align-middle text-right font-mono">
                    <button
                      onClick={() => toast.info(`Managing permissions for ${a.name}...`)}
                      className="px-3 py-1 rounded bg-[#141b21] hover:bg-[#1a232b] border border-[#2b3947] text-xs text-[#38bdf8] hover:text-white transition-colors"
                    >
                      Edit Role
                    </button>
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
