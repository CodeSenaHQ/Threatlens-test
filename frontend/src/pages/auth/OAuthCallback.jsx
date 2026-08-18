import { useAuth } from "@/contexts/AuthContext";
import { parseJwt } from "@/lib/api";
import { ShieldAlert, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function OAuthCallback() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token") || urlParams.get("access_token");

      if (!token) {
        throw new Error("No authentication token received from OAuth provider.");
      }

      const payload = parseJwt(token);
      const account = {
        id: payload?.account_id || 1,
        uid: payload?.sub || "user",
        name: payload?.name || payload?.sub || "Developer",
        handle: payload?.handle || payload?.sub || "user",
        email: payload?.email || "developer@threatlens.io",
        role: payload?.role || "admin",
      };

      login(token, account);
      setLocation("/");
    } catch (err) {
      setError(err.message || "Failed to complete authentication.");
    }
  }, [login, setLocation]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#07090d] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 border border-white/10 bg-[#0b0e14] text-center space-y-4">
          <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold">Authentication Error</h2>
          <p className="text-xs text-[#8a99ad]">{error}</p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090d] text-white flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <Sparkles className="w-8 h-8 text-[#4d8eff] animate-spin mx-auto" />
        <p className="text-sm font-mono text-[#8a99ad]">Verifying authentication receipt...</p>
      </div>
    </div>
  );
}
