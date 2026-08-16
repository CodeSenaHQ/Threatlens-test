import React, { useState } from 'react';
import { ShieldAlert, X, Github, Mail, Lock, User, Sparkles, Key, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithPassword, signupWithPassword, loginWithOAuth, isLoading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'otp'>('signin');
  const [identifier, setIdentifier] = useState('operator@threatlens.io');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('Michael Operator');
  const [handle, setHandle] = useState('lead_auditor');
  const [otp, setOtp] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      await loginWithPassword(identifier, password);
    } else if (mode === 'signup') {
      await signupWithPassword(name, identifier, handle, password);
    } else {
      toast.success('OTP code verified successfully!');
      closeAuthModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[#090d1c] border border-blue-500/30 p-8 shadow-[0_0_50px_rgba(59,130,246,0.25)] relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-extrabold text-white font-heading">
            {mode === 'signin'
              ? 'Operator Authentication'
              : mode === 'signup'
              ? 'Provision SecOps Account'
              : 'One-Time Passcode'}
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            FastAPI Auth Module & OAuth 2.0 Security Gateway
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-6">
          <button
            onClick={() => setMode('signin')}
            className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'signin'
                ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'signup'
                ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Social OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => loginWithOAuth('github')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-200 transition-all"
          >
            <Github className="w-4 h-4" />
            <span>GitHub SSO</span>
          </button>

          <button
            onClick={() => loginWithOAuth('google')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-200 transition-all"
          >
            <span className="font-bold text-blue-400">G</span>
            <span>Google SSO</span>
          </button>
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">OR CREDENTIALS</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-300 font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Michael Operator"
                  className="w-full bg-[#060913] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 font-medium block mb-1">Operator Handle</label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="sec_michael"
                  className="w-full bg-[#060913] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] text-slate-300 font-medium block mb-1">
              Email Address / Operator ID
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="operator@threatlens.io"
              className="w-full bg-[#060913] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-medium block mb-1">Security Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#060913] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cyber-btn-primary py-2.5 text-xs font-bold mt-2"
          >
            {isLoading ? 'Verifying...' : mode === 'signin' ? 'Sign In to Console' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};
