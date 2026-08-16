import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/authApi";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function OAuthCallback() {
  const [, setLocation] = useLocation();
  const { setAuthSession } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Check search params & hash params
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      const token =
        searchParams.get("access_token") ||
        searchParams.get("token") ||
        hashParams.get("access_token") ||
        hashParams.get("token");

      const error = searchParams.get("error") || searchParams.get("error_description");

      if (error) {
        setStatus("error");
        setErrorMessage(error);
        toast.error(`OAuth authentication error: ${error}`);
        setTimeout(() => setLocation("/login"), 2500);
        return;
      }

      if (!token) {
        setStatus("error");
        setErrorMessage("No authorization token was returned from the OAuth provider.");
        toast.error("OAuth authentication failed: Missing token");
        setTimeout(() => setLocation("/login"), 2500);
        return;
      }

      try {
        const meData = await authApi.getMe(token);
        setAuthSession({
          access_token: token,
          token_type: "Bearer",
          account: meData.account,
        });
        setStatus("success");
        toast.success(`Welcome ${meData.account.name || meData.account.handle}! Account verified.`);
        setTimeout(() => setLocation("/"), 1000);
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "Failed to verify OAuth account session");
        toast.error(err.message || "Failed to verify OAuth session");
        setTimeout(() => setLocation("/login"), 2500);
      }
    };

    handleCallback();
  }, [setLocation, setAuthSession]);

  return (
    <div className="min-h-screen bg-[#07090d] flex items-center justify-center text-[#edf7ff] p-4">
      <div className="max-w-md w-full border border-[#233346] bg-[#09111c] p-8 shadow-2xl text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="w-10 h-10 text-[#d9824c] animate-spin mx-auto" />
            <h2 className="text-xl font-bold font-display text-white">Authenticating with OAuth</h2>
            <p className="text-xs font-mono text-[#89a7bb]">Establishing secure session &amp; fetching attestation keys...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-10 h-10 text-[#40c057] mx-auto animate-bounce" />
            <h2 className="text-xl font-bold font-display text-white">Authentication Successful!</h2>
            <p className="text-xs text-[#89a7bb]">Redirecting you to ThreatLens AI dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertTriangle className="w-10 h-10 text-[#ff6b6b] mx-auto" />
            <h2 className="text-xl font-bold font-display text-white">Authentication Failed</h2>
            <p className="text-xs text-[#ff8787] bg-red-950/40 p-3 border border-red-900/40 rounded">{errorMessage}</p>
            <p className="text-xs text-[#89a7bb]">Redirecting back to login screen...</p>
          </>
        )}
      </div>
    </div>
  );
}
