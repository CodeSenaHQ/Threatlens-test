import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/authApi";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Github,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

const logoMark = "/manus-storage/reposhield-mark_2f0e7be5.png";

interface AuthPageProps {
  initialMode?: "signin" | "signup";
}

export default function AuthPage({ initialMode = "signup" }: AuthPageProps) {
  const [, setLocation] = useLocation();
  const { user, loginWithPassword, signupWithPassword, sendOtp, loginWithOtp, signupWithOtp, setAuthSession } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [method, setMethod] = useState<"social" | "password" | "otp">("social");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [otp, setOtp] = useState("");

  // If already logged in, redirect to homepage
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const handleOAuthLogin = (provider: "github" | "google") => {
    const frontendUrl = window.location.origin;
    const backendBase = import.meta.env.VITE_API_BASE_URL || "";
    window.location.href = `${backendBase}/tc-auth/${provider}/login?frontend_url=${encodeURIComponent(frontendUrl)}`;
  };

  const handleSendOtp = async (purpose: "signup" | "login") => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      await sendOtp(email, purpose);
      setOtpSent(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP code");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signin") {
        if (method === "otp") {
          if (!email || !otp) {
            toast.error("Please enter email and 6-digit OTP code");
            setLoading(false);
            return;
          }
          await loginWithOtp(email, otp);
        } else {
          if (!email || !password) {
            toast.error("Please enter email/handle and password");
            setLoading(false);
            return;
          }
          await loginWithPassword(email, password);
        }
      } else {
        // Sign Up
        if (!email || !name) {
          toast.error("Please enter your name and email address");
          setLoading(false);
          return;
        }
        const derivedHandle = handle.trim() || email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");

        if (method === "otp") {
          if (!otp) {
            toast.error("Please enter the OTP code sent to your email");
            setLoading(false);
            return;
          }
          await signupWithOtp(name, email, password || "Pass@12345", otp, derivedHandle);
        } else {
          if (!password) {
            toast.error("Please choose a password");
            setLoading(false);
            return;
          }
          await signupWithPassword(name, email, derivedHandle, password);
        }
      }
      setLocation("/");
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-[#edf7ff] selection:bg-[#2588fa] selection:text-white">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-[linear-gradient(rgba(64,74,89,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(64,74,89,0.35)_1px,transparent_1px)] bg-[size:86px_86px]" />

      {/* Header Bar */}
      <header className="relative z-10 border-b border-white/10 bg-[#040e18]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="grid place-items-center w-7 h-7 border border-[#73dcff]/30 bg-[#4ab3ff]/10 rotate-45">
              <img src={logoMark} alt="" className="w-10 h-10 -rotate-45 scale-75 object-contain" />
            </span>
            <span className="font-display font-semibold text-lg text-[#eff8ff] tracking-tight">
              ThreatLens <em className="text-[#4cc9ff] not-italic">AI</em>
            </span>
          </Link>

          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#8cb2d3] hover:text-[#4cc9ff] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-[#fbfcff]">
            {mode === "signup" ? "Join the ThreatLens Community" : "Welcome back to ThreatLens AI"}
          </h1>
          <p className="mt-3 text-sm text-[#9ab4ce] max-w-md mx-auto">
            {mode === "signup"
              ? "ThreatLens AI actively detects security threats, validates vulnerabilities, and generates independently verifiable proof."
              : "Sign in to access your security attestation records, active scans, and verified commit reports."}
          </p>
        </div>

        {/* Auth Card Container */}
        <div className="border border-[#26374a] bg-[#09111c]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#4cc9ff]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 mb-6 border border-[#213247] bg-[#0c1827]">
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setMethod("social");
              }}
              className={`py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                mode === "signup"
                  ? "bg-[#2588fa] text-white shadow-[0_0_15px_rgba(37,136,250,0.4)]"
                  : "text-[#829bb5] hover:text-[#e1f1ff]"
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setMethod("social");
              }}
              className={`py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                mode === "signin"
                  ? "bg-[#2588fa] text-white shadow-[0_0_15px_rgba(37,136,250,0.4)]"
                  : "text-[#829bb5] hover:text-[#e1f1ff]"
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Social / Direct Login Options Stack */}
          {method === "social" ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleOAuthLogin("github")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#2e4056] bg-[#0e1927] hover:bg-[#152538] hover:border-[#4cc9ff]/40 text-[#edf7ff] font-medium text-sm transition-all group"
              >
                <Github className="w-5 h-5 text-[#ffffff] group-hover:scale-110 transition-transform" />
                <span>{mode === "signup" ? "Sign up with GitHub" : "Sign in with GitHub"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin("google")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#2e4056] bg-[#0e1927] hover:bg-[#152538] hover:border-[#4cc9ff]/40 text-[#edf7ff] font-medium text-sm transition-all group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
                  />
                </svg>
                <span>{mode === "signup" ? "Sign up with Google" : "Sign in with Google"}</span>
              </button>

              <div className="relative my-5 flex items-center">
                <div className="flex-grow border-t border-[#233346]" />
                <span className="flex-shrink mx-3 text-[11px] font-mono text-[#66829d] uppercase tracking-wider">
                  OR CONTINUE WITH
                </span>
                <div className="flex-grow border-t border-[#233346]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod("password")}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#2d4057] bg-[#0c1726] hover:bg-[#142337] text-xs font-semibold text-[#4cc9ff] transition-all"
                >
                  <Lock className="w-3.5 h-3.5" /> Email &amp; Password
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("otp")}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#2d4057] bg-[#0c1726] hover:bg-[#142337] text-xs font-semibold text-[#4cc9ff] transition-all"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Email OTP Code
                </button>
              </div>
            </div>
          ) : (
            /* Email Password / OTP Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e2f44]">
                <span className="text-xs font-mono text-[#4cc9ff] uppercase tracking-wider">
                  {method === "password" ? "Email & Password Method" : "Email OTP Verification"}
                </span>
                <button
                  type="button"
                  onClick={() => setMethod("social")}
                  className="text-xs text-[#7d9ab8] hover:text-white underline"
                >
                  &larr; Switch method
                </button>
              </div>

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="auth-name" className="text-xs text-[#9cb5cc]">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                    <Input
                      id="auth-name"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-[#233346] bg-[#070e17] pl-9 text-sm text-[#ffffff] focus:border-[#4cc9ff]"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="auth-email" className="text-xs text-[#9cb5cc]">
                  {mode === "signin" && method === "password" ? "Email or Username" : "Email Address"}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                  <Input
                    id="auth-email"
                    type="text"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-[#233346] bg-[#070e17] pl-9 text-sm text-[#ffffff] focus:border-[#4cc9ff]"
                    required
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="auth-handle" className="text-xs text-[#9cb5cc]">
                    Username / Handle (optional)
                  </Label>
                  <div className="relative">
                    <Bot className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                    <Input
                      id="auth-handle"
                      type="text"
                      placeholder="jane"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="border-[#233346] bg-[#070e17] pl-9 text-sm text-[#ffffff] focus:border-[#4cc9ff]"
                    />
                  </div>
                </div>
              )}

              {method === "password" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="auth-password" className="text-xs text-[#9cb5cc]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                    <Input
                      id="auth-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-[#233346] bg-[#070e17] pl-9 text-sm text-[#ffffff] focus:border-[#4cc9ff]"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="auth-otp" className="text-xs text-[#9cb5cc]">
                    6-Digit Verification Code
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                      <Input
                        id="auth-otp"
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="border-[#233346] bg-[#070e17] pl-9 text-sm text-[#ffffff] focus:border-[#4cc9ff]"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={() => handleSendOtp(mode === "signup" ? "signup" : "login")}
                      className="border-[#2d4057] bg-[#111f31] text-xs text-[#4cc9ff] hover:bg-[#1a2d46]"
                    >
                      {otpSent ? "Resend" : "Send OTP"}
                    </Button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-[#2588fa] py-3 font-semibold text-white shadow-[0_0_20px_rgba(37,136,250,0.35)] hover:bg-[#4097ff] transition-all"
              >
                {loading
                  ? "Processing..."
                  : mode === "signup"
                  ? "Create ThreatLens Account"
                  : "Sign In to ThreatLens"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-[#1c2c3e] text-center text-xs text-[#7e99b5]">
            {mode === "signup" ? (
              <span>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("signin");
                    setMethod("social");
                  }}
                  className="text-[#4cc9ff] font-semibold hover:underline"
                >
                  Log in
                </button>
              </span>
            ) : (
              <span>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setMethod("social");
                  }}
                  className="text-[#4cc9ff] font-semibold hover:underline"
                >
                  Create one now
                </button>
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[#5e7790] space-y-1">
          <p className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4cc9ff]" /> Protected by ThreatLens AI Engine &amp; Polygon Verification
          </p>
        </div>
      </main>
    </div>
  );
}
