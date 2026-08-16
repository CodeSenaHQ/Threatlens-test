import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Sparkles, ChevronRight, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="syntra-header-nav">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo (matching syntra* logo in ui-insp/a.webp) */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-heading font-extrabold text-lg text-white tracking-tight">
              threatlens
            </span>
            <span className="text-blue-400 font-extrabold text-base">*</span>
          </div>
        </div>

        {/* Center Links (About, Product, Pricing, Contact) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
          <button
            onClick={() => setCurrentView('landing')}
            className="hover:text-white transition-colors"
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="hover:text-white transition-colors"
          >
            Command Center
          </button>
          <button
            onClick={() => setCurrentView('modules')}
            className="hover:text-white transition-colors"
          >
            Security Studios
          </button>
          <button
            onClick={() => setCurrentView('telemetry')}
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Telemetry
          </button>
        </nav>

        {/* Right CTA Buttons (Sign in / Launch Console) */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="btn-primary"
              >
                <span>Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openAuthModal}
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="btn-primary"
              >
                Launch Console
              </button>
            </div>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 px-6 py-4 bg-[#0c0e17] border-b border-white/[0.08] flex flex-col gap-3 text-xs">
          <button onClick={() => { setCurrentView('landing'); setMobileMenuOpen(false); }} className="text-left text-slate-300">Overview</button>
          <button onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }} className="text-left text-slate-300">Command Center</button>
          <button onClick={() => { setCurrentView('modules'); setMobileMenuOpen(false); }} className="text-left text-slate-300">Security Studios</button>
          <button onClick={() => { setCurrentView('telemetry'); setMobileMenuOpen(false); }} className="text-left text-slate-300">Live Telemetry</button>
        </div>
      )}
    </header>
  );
};
