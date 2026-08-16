import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account, authApi, AuthResponse } from '../lib/authApi';
import { toast } from 'sonner';

interface AuthContextType {
  user: Account | null;
  token: string | null;
  isLoading: boolean;
  loginWithPassword: (identifier: string, password: string) => Promise<AuthResponse>;
  signupWithPassword: (name: string, email: string, handle: string, password: string) => Promise<AuthResponse>;
  loginWithOAuth: (provider: 'github' | 'google') => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const TOKEN_KEY = 'threatlens_token';
const USER_KEY = 'threatlens_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<Account | null>(() => {
    const cached = localStorage.getItem(USER_KEY);
    return cached
      ? JSON.parse(cached)
      : {
          id: 1,
          uid: 'usr_sec_demo',
          name: 'Michael Chen',
          handle: 'michael_sec',
          email: 'michael.chen@threatlens.io',
          role: 'Lead Security Auditor',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        };
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const setAuthSession = (session: AuthResponse) => {
    setToken(session.access_token);
    setUser(session.account);
    localStorage.setItem(TOKEN_KEY, session.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.account));
  };

  const loginWithPassword = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.loginWithPassword({ identifier, password });
      setAuthSession(res);
      toast.success(`Welcome back, ${res.account.name}!`);
      setIsAuthModalOpen(false);
      return res;
    } catch (e: any) {
      toast.error(e.message || 'Login failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithPassword = async (name: string, email: string, handle: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.signupWithPassword({ name, email, handle, password });
      setAuthSession(res);
      toast.success(`Account provisioned successfully for ${name}!`);
      setIsAuthModalOpen(false);
      return res;
    } catch (e: any) {
      toast.error(e.message || 'Signup failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOAuth = (provider: 'github' | 'google') => {
    toast.info(`Connecting to ${provider.toUpperCase()} OAuth 2.0 Gateway...`);
    setTimeout(() => {
      const mockOAuthUser: Account = {
        id: provider === 'github' ? 42 : 43,
        uid: `oauth_${provider}_99`,
        name: provider === 'github' ? 'GitHub Operator' : 'Google SSO User',
        handle: `${provider}_auditor`,
        email: `${provider}.operator@threatlens.io`,
        role: 'Verified Operator',
      };
      setAuthSession({
        access_token: `token_${provider}_oauth_ok`,
        token_type: 'bearer',
        account: mockOAuthUser,
      });
      toast.success(`Authenticated with ${provider.toUpperCase()}!`);
      setIsAuthModalOpen(false);
    }, 1200);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    toast.info('Signed out of Security Console');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loginWithPassword,
        signupWithPassword,
        loginWithOAuth,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
