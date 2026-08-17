import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  KeyRound,
  Lock,
  Mail,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { ThreatLensLogo } from "@/components/ThreatLensLogo";

export default function AuthPage({ initialMode = "signup" }) {
  const [mode, setMode] = useState(initialMode);
  const [method, setMethod] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.sendOtp(email, mode === "signup" ? "signup" : "login");
      setOtpSent(true);
      toast.success("Verification code sent to your email!");
    } catch (err) {
      setError(err.message || "Failed to send OTP code");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res;
      if (mode === "signin") {
        if (method === "password") {
          res = await authApi.loginWithPassword({ identifier: email, password });
        } else {
          res = await authApi.loginWithOtp({ email, otp });
        }
      } else {
        if (method === "password") {
          res = await authApi.signupWithPassword({
            name,
            email,
            handle: handle || email.split("@")[0],
            password,
          });
        } else {
          res = await authApi.signupWithOtp({
            name,
            email,
            handle: handle || email.split("@")[0],
            password: password || "threatlens_auth",
            otp,
          });
        }
      }

      login(res.access_token, res.account);
      toast.success(mode === "signup" ? "Account created successfully!" : "Signed in successfully!");
      setLocation("/");
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-[#edf7ff] selection:bg-[#2546ff] selection:text-white">
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-[linear-gradient(rgba(64,74,89,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(64,74,89,0.35)_1px,transparent_1px)] bg-[size:86px_86px]" />

      <header className="relative z-10 border-b border-white/10 bg-[#0b0e14]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="brand group flex items-center">
            <ThreatLensLogo className="h-7 w-auto" />
          </Link>

          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#8a99ad] hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-xl mx-auto px-4 py-12">
        <div className="border border-white/10 rounded-2xl bg-[#0b0e14]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-2 p-1 mb-6 border border-white/10 rounded-xl bg-[#06080d]">
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-[#2546ff] text-white shadow-[0_0_15px_rgba(37,70,255,0.3)]"
                  : "text-[#8a99ad] hover:text-white"
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
              className={`py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                mode === "signin"
                  ? "bg-[#2546ff] text-white shadow-[0_0_15px_rgba(37,70,255,0.3)]"
                  : "text-[#8a99ad] hover:text-white"
              }`}
            >
              Sign In
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold text-white tracking-tight">
              {mode === "signup" ? "Create your ThreatLens account" : "Welcome back to ThreatLens"}
            </h1>
            <p className="text-xs text-[#8a99ad] mt-1">
              {mode === "signup"
                ? "Autonomous security testing with immutable cryptographic attestation."
                : "Enter your credentials to access your verified security posture."}
            </p>
          </div>

          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs text-[#8a99ad]">
            <span>Authentication Mode:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMethod("password")}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  method === "password"
                    ? "bg-white/10 text-white font-semibold border border-white/10"
                    : "text-[#718096] hover:text-white"
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setMethod("otp")}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  method === "otp"
                    ? "bg-white/10 text-white font-semibold border border-white/10"
                    : "text-[#718096] hover:text-white"
                }`}
              >
                Email OTP
              </button>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#8a99ad]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                  <input
                    type="text"
                    placeholder="Alex Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#07090d] pl-9 pr-3 py-2 text-sm text-[#ffffff] focus:border-white/25 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#8a99ad]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                <input
                  type="email"
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#07090d] pl-9 pr-3 py-2 text-sm text-[#ffffff] focus:border-white/25 focus:outline-none"
                  required
                />
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#8a99ad]">
                  Username / Handle
                </label>
                <div className="relative">
                  <Bot className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                  <input
                    type="text"
                    placeholder="alex_sec"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#07090d] pl-9 pr-3 py-2 text-sm text-[#ffffff] focus:border-white/25 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {method === "password" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#8a99ad]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#07090d] pl-9 pr-3 py-2 text-sm text-[#ffffff] focus:border-white/25 focus:outline-none"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#8a99ad]">
                  Email Verification Code (OTP)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                    <input
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#07090d] pl-9 pr-3 py-2 text-sm text-[#ffffff] focus:border-white/25 focus:outline-none font-mono text-center tracking-widest"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSendOtp}
                    className="rounded-lg border border-white/10 bg-[#07090d] px-3 py-2 text-xs text-[#cbd5e1] hover:bg-[#111622] transition-colors cursor-pointer"
                  >
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-[#2546ff] hover:bg-[#0d27c7] py-3 text-sm font-semibold text-white transition-all shadow-[0_0_20px_rgba(37,70,255,0.25)] border border-white/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : mode === "signup"
                ? "Create ThreatLens Account"
                : "Sign In to ThreatLens"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
