import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Terminal, Sparkles, User, ExternalLink, Cpu, ChevronRight, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ShinyText } from '../react-bits/ShinyText';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'modules' | 'telemetry';
  setCurrentView: (view: 'landing' | 'dashboard' | 'modules' | 'telemetry') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#05070e]/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 p-0.5 shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all">
            <div className="w-full h-full bg-[#070b18] rounded-[10px] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-blue-200 transition-colors">
                ThreatLens
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                2.0
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider hidden sm:block">
              DEFENSIVE & OFFENSIVE INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentView === 'landing'
                ? 'bg-blue-600/30 text-white border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentView === 'dashboard'
                ? 'bg-blue-600/30 text-white border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Command Center
          </button>
          <button
            onClick={() => setCurrentView('modules')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentView === 'modules'
                ? 'bg-blue-600/30 text-white border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Security Studios
          </button>
          <button
            onClick={() => setCurrentView('telemetry')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'telemetry'
                ? 'bg-blue-600/30 text-white border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Terminal
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div
                onClick={() => setCurrentView('dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-blue-500/40 cursor-pointer transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-[11px] font-bold text-white shadow-inner">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-white leading-none">{user.name}</div>
                  <div className="text-[10px] text-blue-400 font-mono leading-none mt-0.5">{user.role}</div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="cyber-btn-primary text-xs py-2 px-4 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              >
                <span>Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openAuthModal}
                className="cyber-btn-secondary text-xs py-2 px-4"
              >
                Operator Sign In
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="cyber-btn-primary text-xs py-2 px-4"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                Launch Console
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 px-6 py-4 bg-[#070a14] border-b border-white/10 flex flex-col gap-3">
          <button
            onClick={() => {
              setCurrentView('landing');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-sm text-slate-300 hover:text-white"
          >
            Overview
          </button>
          <button
            onClick={() => {
              setCurrentView('dashboard');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-sm text-slate-300 hover:text-white"
          >
            Command Center
          </button>
          <button
            onClick={() => {
              setCurrentView('modules');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-sm text-slate-300 hover:text-white"
          >
            Security Studios
          </button>
          <button
            onClick={() => {
              setCurrentView('telemetry');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-sm text-slate-300 hover:text-white"
          >
            Live Terminal
          </button>
        </div>
      )}
    </header>
  );
};
