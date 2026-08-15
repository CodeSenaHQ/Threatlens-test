/**
 * ThreatLens AI - Auth API Service
 * Connects frontend to Python FastAPI Auth Module (/tc-auth)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface Account {
  id: number;
  uid: string;
  name: string;
  handle: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  role: string;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  account: Account;
}

export interface MeResponse {
  account: Account;
  session?: {
    id: number;
    account_id: number;
    expires_at: string;
    created_at: string;
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}/tc-auth${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.detail || data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error: any) {
    if (error.message?.includes("Failed to fetch") || error.name === "TypeError") {
      throw new Error("Cannot connect to Auth Backend server (http://localhost:8000). Please ensure backend is running.");
    }
    throw error;
  }
}

export const authApi = {
  // Login with Password
  loginWithPassword: (data: { identifier: string; password: string }) =>
    request<AuthResponse>("/login/password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Sign Up with Password
  signupWithPassword: (data: { name: string; email: string; handle: string; password: string }) =>
    request<AuthResponse>("/signup/password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Send Email OTP
  sendOtp: (email: string, purpose: "signup" | "login" | "reset" | "verify" = "signup") =>
    request<{ expires_at: number }>(`/send/email/otp/${purpose}`, {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  // Sign Up with OTP
  signupWithOtp: (data: { name: string; email: string; password: string; otp: string; handle: string }) =>
    request<AuthResponse>("/signup/otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Login with OTP
  loginWithOtp: (data: { email: string; otp: string }) =>
    request<AuthResponse>("/login/otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Forgot Password
  forgotPassword: (data: { email: string; otp: string; password: string }) =>
    request<AuthResponse>("/forgot/password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get Current Profile
  getMe: (token: string) =>
    request<MeResponse>("/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Logout
  logout: (token: string) =>
    request<null>("/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
