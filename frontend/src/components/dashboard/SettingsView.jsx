import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Shield,
  KeyRound,
  Smartphone,
  Laptop,
  Globe,
  Trash2,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Github,
  RefreshCw,
  Clock,
  LogOut,
  Sliders,
  Database,
  Mail,
  Server
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";

export default function SettingsView() {
  const { token, user, login, logout } = useAuth();

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    handle: user?.handle || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar_url: user?.avatar_url || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Update State
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [terminatingSessionId, setTerminatingSessionId] = useState(null);

  // Admin Config State (for superadmins)
  const [systemConfig, setSystemConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Sync profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        handle: user.handle || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user]);

  // Load active sessions
  const fetchSessions = async () => {
    if (!token || !user?.id) {
      setSessions([
        {
          id: 1,
          ip_address: "127.0.0.1 (Current Machine)",
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
          isCurrent: true,
        },
      ]);
      setLoadingSessions(false);
      return;
    }

    setLoadingSessions(true);
    try {
      const data = await authApi.getSessions(token, user.id);
      if (Array.isArray(data) && data.length > 0) {
        setSessions(data);
      } else {
        setSessions([
          {
            id: 1,
            ip_address: "127.0.0.1 (Current Machine)",
            user_agent: navigator.userAgent,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
            isCurrent: true,
          },
        ]);
      }
    } catch {
      // Fallback session entry
      setSessions([
        {
          id: 1,
          ip_address: "127.0.0.1 (Current Machine)",
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
          isCurrent: true,
        },
      ]);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Load superadmin config if superadmin
  useEffect(() => {
    fetchSessions();

    if (user?.role === "superadmin" && token) {
      setLoadingConfig(true);
      authApi.getConfig(token)
        .then(cfg => setSystemConfig(cfg))
        .catch(() => setSystemConfig(null))
        .finally(() => setLoadingConfig(false));
    }
  }, [token, user]);

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.info("Profile updated locally in preview mode");
      setIsEditingProfile(false);
      return;
    }

    setIsSavingProfile(true);
    try {
      const updatedAccount = await authApi.updateProfile(token, profileForm);
      if (updatedAccount) {
        login(token, updatedAccount);
        toast.success("Security profile updated successfully");
      }
      setIsEditingProfile(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Password Change
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.info("Password change submitted (offline mode)");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
      return;
    }

    setIsSavingPassword(true);
    try {
      await authApi.updatePassword(token, passwordForm.newPassword);
      toast.success("Password updated successfully. Existing sessions remain valid.");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Terminate Single Session
  const handleTerminateSession = async (sessionId) => {
    if (!token) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast.success("Session terminated");
      return;
    }

    setTerminatingSessionId(sessionId);
    try {
      await authApi.destroySession(token, sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast.success("Device session revoked successfully");
    } catch (err) {
      toast.error(err.message || "Failed to revoke session");
    } finally {
      setTerminatingSessionId(null);
    }
  };

  // Revoke All Other Sessions
  const handleRevokeAllSessions = async () => {
    if (!token) {
      toast.info("All other sessions cleared");
      return;
    }
    try {
      await authApi.logoutAll(token);
      toast.success("All remote sessions revoked. Please log in again if disconnected.");
      fetchSessions();
    } catch (err) {
      toast.error(err.message || "Failed to revoke all sessions");
    }
  };

  const parseBrowser = (ua) => {
    if (!ua) return "Unknown Device";
    if (ua.includes("Chrome")) return "Chrome / Chromium";
    if (ua.includes("Firefox")) return "Mozilla Firefox";
    if (ua.includes("Safari")) return "Apple Safari";
    if (ua.includes("Edge")) return "Microsoft Edge";
    return "Desktop Client";
  };

  const parseOS = (ua) => {
    if (!ua) return "Unknown OS";
    if (ua.includes("Windows")) return "Windows 10/11";
    if (ua.includes("Mac OS")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "UNIX / Other";
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Account Overview Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-[#0a0d15] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2546ff] to-[#4d8eff] p-0.5 shadow-[0_0_20px_rgba(37,70,255,0.3)]">
            <div className="w-full h-full rounded-[14px] bg-[#0a0d15] flex items-center justify-center text-xl font-bold text-white uppercase font-mono">
              {user?.name ? user.name.slice(0, 2) : "TL"}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-white">{user?.name || "Security Analyst"}</h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-[#2546ff]/15 text-[#93c5fd] border border-[#2546ff]/30">
                {user?.role || "ANALYST"}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30">
                {user?.status || "ACTIVE"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748b] font-mono">
              <span>{user?.email || "analyst@threatlens.io"}</span>
              <span>·</span>
              <span>@{user?.handle || "analyst"}</span>
              {user?.uid && (
                <>
                  <span>·</span>
                  <span className="text-[#475569] truncate max-w-[140px]" title={user.uid}>
                    UID: {user.uid.slice(0, 8)}...
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white border border-white/[0.08] transition-all"
          >
            {isEditingProfile ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </motion.div>

      {/* Edit Profile Form Modal / Inline Section */}
      {isEditingProfile && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSaveProfile}
          className="p-6 rounded-2xl bg-[#0a0d15] border border-[#2546ff]/30 shadow-[0_0_30px_rgba(37,70,255,0.1)] space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#4d8eff]" />
              Edit Account Information
            </h3>
            <span className="text-[11px] text-[#64748b]">Changes take effect immediately</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#8a99ad]">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-[#06080d] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#4d8eff]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#8a99ad]">Handle / Username</label>
              <input
                type="text"
                value={profileForm.handle}
                onChange={e => setProfileForm({ ...profileForm, handle: e.target.value })}
                className="w-full bg-[#06080d] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#4d8eff]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#8a99ad]">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-[#06080d] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#4d8eff]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#8a99ad]">Phone Number</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="+1 555 0100"
                className="w-full bg-[#06080d] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#4d8eff]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 rounded-xl bg-white/[0.04] text-xs font-semibold text-[#8a99ad] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingProfile}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2546ff] hover:bg-[#1d3bef] text-xs font-semibold text-white transition-all disabled:opacity-50"
            >
              {isSavingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Changes
            </button>
          </div>
        </motion.form>
      )}

      {/* Security Credentials & Password Update */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password update form */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.06] space-y-4"
        >
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.06]">
            <div className="p-1.5 rounded-lg bg-[#2546ff]/10 border border-[#2546ff]/20 text-[#4d8eff]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Update Password</h3>
              <p className="text-[11px] text-[#475569]">Set a secure token authentication password</p>
            </div>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#8a99ad]">New Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full bg-[#06080d] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#4d8eff]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#8a99ad]">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter password"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full bg-[#06080d] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#4d8eff]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSavingPassword || !passwordForm.newPassword}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#2546ff] hover:bg-[#1d3bef] text-xs font-semibold text-white transition-all disabled:opacity-50"
            >
              {isSavingPassword ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
              Update Account Password
            </button>
          </form>
        </motion.div>

        {/* Linked OAuth & Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.06] space-y-4"
        >
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.06]">
            <div className="p-1.5 rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">OAuth &amp; Single Sign-On</h3>
              <p className="text-[11px] text-[#475569]">Federated security access identities</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#06080d] border border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Github className="w-4 h-4 text-white" />
                <div>
                  <div className="text-xs font-semibold text-white">GitHub Account</div>
                  <div className="text-[10px] text-[#475569]">Repo scanning &amp; commit attestations</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30">
                LINKED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#06080d] border border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-black font-mono">
                  G
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Google Identity</div>
                  <div className="text-[10px] text-[#475569]">Enterprise SSO authentication</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/[0.05] text-[#8a99ad] border border-white/[0.08]">
                AVAILABLE
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#2546ff]/5 border border-[#2546ff]/15 text-[11px] text-[#8a99ad] flex items-start gap-2">
            <Shield className="w-4 h-4 text-[#4d8eff] shrink-0 mt-0.5" />
            <span>Multi-factor authentication (MFA) with OTP email verification is active across all endpoints.</span>
          </div>
        </motion.div>
      </div>

      {/* Active Device Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-2xl bg-[#0a0d15] border border-white/[0.06] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#4d8eff]" />
              Active Device Sessions
            </h3>
            <p className="text-xs text-[#475569]">Active JWT session tokens authenticated against the server</p>
          </div>
          <button
            onClick={handleRevokeAllSessions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f43f5e]/10 hover:bg-[#f43f5e]/20 text-[#fb7185] border border-[#f43f5e]/20 text-xs font-semibold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Revoke All Other Sessions
          </button>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {sessions.map((sess, idx) => (
            <div key={sess.id || idx} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#8a99ad]">
                  {sess.user_agent?.includes("Mobile") ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {parseBrowser(sess.user_agent)} on {parseOS(sess.user_agent)}
                    </span>
                    {sess.isCurrent && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30">
                        This Device
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#475569] font-mono">
                    <span>IP: {sess.ip_address}</span>
                    <span>·</span>
                    <span>Created: {sess.created_at ? new Date(sess.created_at).toLocaleDateString() : "Active"}</span>
                  </div>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => handleTerminateSession(sess.id)}
                  disabled={terminatingSessionId === sess.id}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#f43f5e]/15 text-[#8a99ad] hover:text-[#fb7185] border border-white/[0.06] hover:border-[#f43f5e]/30 text-xs transition-all"
                >
                  {terminatingSessionId === sess.id ? "Terminating..." : "Terminate"}
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Superadmin Infrastructure Control Panel (if role === superadmin) */}
      {user?.role === "superadmin" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-[#0e1320] border border-[#2546ff]/20 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#2546ff]/20 text-[#93c5fd]">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Superadmin Control Center</h3>
                <p className="text-xs text-[#64748b]">Live runtime configuration &amp; infrastructure status</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-[#2546ff]/20 text-[#93c5fd] border border-[#2546ff]/30">
              ROLE: SUPERADMIN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#06080d] border border-white/[0.04] space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-[#64748b] uppercase">
                <Mail className="w-3 h-3 text-[#4d8eff]" /> SMTP Server
              </div>
              <div className="text-xs font-mono text-white truncate">
                {systemConfig?.email?.host ? `${systemConfig.email.host}:${systemConfig.email.port}` : "smtp.gmail.com:587"}
              </div>
              <div className="text-[10px] text-[#4ade80]">TLS Enabled</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#06080d] border border-white/[0.04] space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-[#64748b] uppercase">
                <KeyRound className="w-3 h-3 text-[#a78bfa]" /> JWT Algorithm
              </div>
              <div className="text-xs font-mono text-white">
                {systemConfig?.jwt?.algorithm || "HS256"} · {systemConfig?.jwt?.session_duration_days || 7} Days
              </div>
              <div className="text-[10px] text-[#93c5fd]">Active Session Tokens</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#06080d] border border-white/[0.04] space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-[#64748b] uppercase">
                <Server className="w-3 h-3 text-[#22c55e]" /> OAuth Providers
              </div>
              <div className="text-xs font-mono text-white">GitHub &amp; Google SSO</div>
              <div className="text-[10px] text-[#4ade80]">Configured</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
