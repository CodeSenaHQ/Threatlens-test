import React from 'react';
import { ShieldAlert, Github, Terminal, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { toast } from 'sonner';

export const Footer: React.FC = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Subscribed to ThreatLens Security Bulletins & 0-Day Advisories!');
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#05070e] pt-16 pb-12 overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white">ThreatLens AI</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Unified offensive security audit platform & autonomous threat simulation engine for modern cloud architectures and AI agents.
            </p>
            <div className="pt-2">
              <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter security operator email..."
                  className="bg-[#0b0f1e] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 flex-1"
                />
                <button type="submit" className="cyber-btn-primary text-xs py-2 px-4">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Security Suites
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">SQL Injection Fuzzing</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Cross-Site Scripting (XSS)</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">DDoS Stress Engine</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Git Secret Auditing</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Data Exfiltration Scanner</li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Platform & CLI
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">ThreatLensGo TUI</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">sectest Python Engine</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">FastAPI OAuth Core</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Live Simulation Telemetry</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">AI Remediation Diff Engine</li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Governance & Legal
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Responsible Disclosure</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">OWASP Top 10 Mapping</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">CWE Compliance Matrix</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Security Audits</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">CodeSena Hackathon Spec</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span>ALL DEFENSIVE SYSTEMS OPERATIONAL · TELEMETRY ACTIVE</span>
          </div>
          <div>
            © 2026 ThreatLensGo by <span className="text-slate-300 font-semibold">CodeSena</span>. Engineered for authorized penetration testing.
          </div>
        </div>
      </div>
    </footer>
  );
};
