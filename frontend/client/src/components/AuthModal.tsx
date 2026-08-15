import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, Bot, KeyRound, Lock, Mail, ShieldCheck, Sparkles, User } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "signin" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange, defaultTab = "signin" }) => {
  const { loginWithPassword, signupWithPassword, sendOtp, loginWithOtp, signupWithOtp } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [otp, setOtp] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setHandle("");
    setOtp("");
    setOtpSent(false);
  };

  const handleTabChange = (value: string) => {
    setTab(value as "signin" | "signup");
    resetForm();
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter email or handle");
      return;
    }
    setLoading(true);

    try {
      if (authMethod === "password") {
        if (!password) {
          toast.error("Please enter your password");
          setLoading(false);
          return;
        }
        await loginWithPassword(email, password);
      } else {
        if (!otp) {
          toast.error("Please enter the 6-digit OTP code");
          setLoading(false);
          return;
        }
        await loginWithOtp(email, otp);
      }
      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Please fill in name and email");
      return;
    }
    const derivedHandle = handle.trim() || email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");

    setLoading(true);
    try {
      if (authMethod === "password") {
        if (!password) {
          toast.error("Please enter a password");
          setLoading(false);
          return;
        }
        await signupWithPassword(name, email, derivedHandle, password);
      } else {
        if (!otp) {
          toast.error("Please enter the OTP code sent to your email");
          setLoading(false);
          return;
        }
        await signupWithOtp(name, email, password || "DefaultPass123!", otp, derivedHandle);
      }
      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] border-[#29384b] bg-[#09111c] text-[#edf7ff] shadow-2xl backdrop-blur-xl">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center border border-[#4cc9ff]/30 bg-[#4cc9ff]/10 text-[#4cc9ff] shadow-[0_0_15px_rgba(76,201,255,0.2)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <DialogTitle className="font-display text-2xl font-bold tracking-tight text-[#ffffff]">
            ThreatLens <span className="text-[#4cc9ff]">AI</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-[#8fa7be]">
            Security intelligence that leaves a receipt.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={handleTabChange} className="mt-1 w-full">
          <TabsList className="grid w-full grid-cols-2 border border-[#233346] bg-[#0c1827]">
            <TabsTrigger
              value="signin"
              className="data-[state=active]:bg-[#2588fa] data-[state=active]:text-white font-semibold text-xs"
            >
              Log In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-[#2588fa] data-[state=active]:text-white font-semibold text-xs"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin" className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#7d9ab8]">
              <span>Auth Method:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod("password")}
                  className={`px-2 py-1 transition-colors ${
                    authMethod === "password"
                      ? "bg-[#16273c] text-[#4cc9ff] font-semibold border border-[#3b5575]"
                      : "text-[#6b829a] hover:text-[#bcd4e8]"
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod("otp")}
                  className={`px-2 py-1 transition-colors ${
                    authMethod === "otp"
                      ? "bg-[#16273c] text-[#4cc9ff] font-semibold border border-[#3b5575]"
                      : "text-[#6b829a] hover:text-[#bcd4e8]"
                  }`}
                >
                  Email OTP
                </button>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="signin-email" className="text-xs text-[#9cb5cc]">
                  Email or Handle
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                  <Input
                    id="signin-email"
                    type="text"
                    placeholder="jane@example.com or @jane"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-[#233346] bg-[#070e17] pl-9 text-sm text-[#ffffff] focus:border-[#4cc9ff]"
                    required
                  />
                </div>
              </div>

              {authMethod === "password" ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password" className="text-xs text-[#9cb5cc]">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                    <Input
                      id="signin-password"
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
                <div className="space-y-1">
                  <Label htmlFor="signin-otp" className="text-xs text-[#9cb5cc]">
                    Verification OTP
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                      <Input
                        id="signin-otp"
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
                      onClick={() => handleSendOtp("login")}
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
                className="mt-2 w-full bg-[#2588fa] font-semibold text-white shadow-[0_0_20px_rgba(37,136,250,0.3)] hover:bg-[#4097ff]"
              >
                {loading ? "Signing in..." : "Sign In to ThreatLens"} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#7d9ab8]">
              <span>Sign Up Mode:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod("password")}
                  className={`px-2 py-1 transition-colors ${
                    authMethod === "password"
                      ? "bg-[#16273c] text-[#4cc9ff] font-semibold border border-[#3b5575]"
                      : "text-[#6b829a] hover:text-[#bcd4e8]"
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod("otp")}
                  className={`px-2 py-1 transition-colors ${
                    authMethod === "otp"
                      ? "bg-[#16273c] text-[#4cc9ff] font-semibold border border-[#3b5575]"
                      : "text-[#6b829a] hover:text-[#bcd4e8]"
                  }`}
                >
                  Email OTP
                </button>
              </div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="signup-name" className="text-xs text-[#9cb5cc]">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-[#233346] bg-[#070e17] pl-9 text-sm text-[#ffffff] focus:border-[#4cc9ff]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="signup-email" className="text-xs text-[#9cb5cc]">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-[#233346] bg-[#070e17] pl-9 text-sm text-[#ffffff] focus:border-[#4cc9ff]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-handle" className="text-xs text-[#9cb5cc]">
                    Username / Handle
                  </Label>
                  <div className="relative">
                    <Bot className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                    <Input
                      id="signup-handle"
                      type="text"
                      placeholder="jane"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="border-[#233346] bg-[#070e17] pl-9 text-sm text-[#ffffff] focus:border-[#4cc9ff]"
                    />
                  </div>
                </div>
              </div>

              {authMethod === "password" ? (
                <div className="space-y-1">
                  <Label htmlFor="signup-password" className="text-xs text-[#9cb5cc]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-[#233346] bg-[#070e17] pl-9 text-sm text-[#ffffff] focus:border-[#4cc9ff]"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Label htmlFor="signup-otp" className="text-xs text-[#9cb5cc]">
                    Email Verification OTP
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-[#5f7892]" />
                      <Input
                        id="signup-otp"
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
                      onClick={() => handleSendOtp("signup")}
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
                className="mt-2 w-full bg-[#2588fa] font-semibold text-white shadow-[0_0_20px_rgba(37,136,250,0.3)] hover:bg-[#4097ff]"
              >
                {loading ? "Creating Account..." : "Create ThreatLens Account"}{" "}
                <Sparkles className="ml-1.5 h-4 w-4" />
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-2 text-center text-[11px] text-[#637d97]">
          Protected by ThreatLens DevSecOps Engine &amp; SHA-256 Verification
        </div>
      </DialogContent>
    </Dialog>
  );
};
