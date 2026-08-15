import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/authApi";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function OAuthCallback() {
  const [, setLocation] = useLocation();
  const { setAuthSession } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("access_token");

      if (!token) {
        toast.error("OAuth login failed: Missing access token");
        setLocation("/login");
        return;
      }

      try {
        const meData = await authApi.getMe(token);
        setAuthSession({
          access_token: token,
          token_type: "Bearer",
          account: meData.account,
        });
        toast.success(`Authenticated with OAuth! Welcome ${meData.account.name || meData.account.handle}`);
        setLocation("/");
      } catch (err: any) {
        toast.error(err.message || "Failed to verify OAuth session");
        setLocation("/login");
      }
    };

    handleCallback();
  }, [setLocation, setAuthSession]);

  return (
    <div className="min-h-screen bg-[#07090d] flex items-center justify-center text-[#edf7ff]">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#4cc9ff] animate-spin mx-auto" />
        <p className="text-sm font-mono text-[#89a7bb]">Authenticating with ThreatLens AI OAuth...</p>
      </div>
    </div>
  );
}
