import { Account, authApi, AuthResponse } from "../lib/authApi";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: Account | null;
  token: string | null;
  isLoading: boolean;
  loginWithPassword: (identifier: string, password: string) => Promise<AuthResponse>;
  signupWithPassword: (name: string, email: string, handle: string, password: string) => Promise<AuthResponse>;
  sendOtp: (email: string, purpose?: "signup" | "login" | "reset" | "verify") => Promise<number>;
  signupWithOtp: (name: string, email: string, password: string, otp: string, handle: string) => Promise<AuthResponse>;
  loginWithOtp: (email: string, otp: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  setAuthSession: (session: AuthResponse) => void;
}

const TOKEN_KEY = "threatlens_token";
const USER_KEY = "threatlens_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<Account | null>(() => {
    const cached = localStorage.getItem(USER_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auto-verify token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await authApi.getMe(storedToken);
        setUser(data.account);
        localStorage.setItem(USER_KEY, JSON.stringify(data.account));
      } catch (err) {
        console.warn("Session restore check:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const setAuthSession = (session: AuthResponse) => {
    setToken(session.access_token);
    setUser(session.account);
    localStorage.setItem(TOKEN_KEY, session.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.account));
  };

  const loginWithPassword = async (identifier: string, password: string) => {
    const res = await authApi.loginWithPassword({ identifier, password });
    setAuthSession(res);
    toast.success(`Welcome back, ${res.account.name || res.account.handle}!`);
    return res;
  };

  const signupWithPassword = async (name: string, email: string, handle: string, password: string) => {
    const res = await authApi.signupWithPassword({ name, email, handle, password });
    setAuthSession(res);
    toast.success(`Account created successfully! Welcome ${res.account.name}!`);
    return res;
  };

  const sendOtp = async (email: string, purpose: "signup" | "login" | "reset" | "verify" = "signup") => {
    const res = await authApi.sendOtp(email, purpose);
    toast.success(`OTP code sent to ${email}`);
    return res.expires_at;
  };

  const signupWithOtp = async (name: string, email: string, password: string, otp: string, handle: string) => {
    const res = await authApi.signupWithOtp({ name, email, password, otp, handle });
    setAuthSession(res);
    toast.success(`Account created and verified! Welcome ${res.account.name}!`);
    return res;
  };

  const loginWithOtp = async (email: string, otp: string) => {
    const res = await authApi.loginWithOtp({ email, otp });
    setAuthSession(res);
    toast.success(`Logged in successfully! Welcome ${res.account.name}!`);
    return res;
  };

  const logout = async () => {
    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        /* ignore logout network errors */
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loginWithPassword,
        signupWithPassword,
        sendOtp,
        signupWithOtp,
        loginWithOtp,
        logout,
        setAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
