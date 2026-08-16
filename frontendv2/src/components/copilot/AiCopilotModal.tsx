import React, { useState, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Copy, Check, ShieldCheck, Code2, AlertTriangle, Layers } from 'lucide-react';
import { useSecurity } from '../../contexts/SecurityContext';
import { toast } from 'sonner';

export const AiCopilotModal: React.FC = () => {
  const { isCopilotOpen, closeCopilot, copilotInitialPrompt } = useSecurity();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { id: string; sender: 'user' | 'ai'; text: string; codeDiff?: string }[]
  >([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'ThreatLens AI Copilot ready. I have analyzed your target active sessions and detected 1 Critical Blind SQLi boundary and 2 Medium XSS reflections. How can I assist with your offensive audit or defensive patching?',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (copilotInitialPrompt) {
      sendMessage(copilotInitialPrompt);
    }
  }, [copilotInitialPrompt]);

  const sendMessage = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg = { id: Math.random().toString(), sender: 'user' as const, text: promptText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = '';
      let diff = '';

      if (promptText.toLowerCase().includes('sqli') || promptText.toLowerCase().includes('sql')) {
        aiReply =
          'Identified parameter vulnerability on target endpoint `/v1/auth`. Raw input is concatenated into the SQL query string without parameterized binding. Here is the recommended secure mitigation using SQLAlchemy prepared statements:';
        diff = `// Vulnerable Code (Raw Concatenation):
- query = f"SELECT * FROM accounts WHERE user_id = '{user_id}' AND status = 'active'"
- result = db.execute(text(query))

// Hardened Remediation (Parameterized Binding):
+ query = "SELECT * FROM accounts WHERE user_id = :user_id AND status = 'active'"
+ result = db.execute(text(query), {"user_id": user_id})`;
      } else if (promptText.toLowerCase().includes('xss')) {
        aiReply =
          'Identified unescaped reflection in DOM attribute sink. Enforce contextual HTML entity encoding and Content-Security-Policy (CSP) headers:';
        diff = `// Vulnerable HTML Sink:
- document.getElementById("profile-header").innerHTML = userInput;

// Hardened DOM textContent:
+ document.getElementById("profile-header").textContent = userInput;
+ // Added CSP Response Header:
+ Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-xyz';`;
      } else {
        aiReply =
          'I have cross-referenced your telemetry logs against the CWE-89 & OWASP Top 10 knowledge base. All critical injection boundaries have been tagged and automated regression test vectors generated.';
      }

      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender: 'ai', text: aiReply, codeDiff: diff },
      ]);
      setIsTyping(false);
    }, 900);
  };

  if (!isCopilotOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg h-full bg-[#080c1b] border-l border-white/10 flex flex-col justify-between shadow-2xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-white">ThreatLens AI Copilot</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Autonomous Security & Patch Assistant</p>
            </div>
          </div>

          <button
            onClick={closeCopilot}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-[#0f152b] border border-white/[0.08] text-slate-200 rounded-tl-none space-y-3'
                }`}
              >
                <div>{m.text}</div>

                {m.codeDiff && (
                  <div className="mt-2 rounded-xl bg-[#050711] border border-white/10 p-3 font-mono text-[11px] overflow-x-auto">
                    <pre className="text-slate-300">{m.codeDiff}</pre>
                    <button
                      onClick={() => toast.success('Copied hardened patch to clipboard!')}
                      className="mt-2 text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Hardened Patch</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-3 bg-white/[0.02] rounded-xl animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyzing CVE matrix & generating diff...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="py-2 flex flex-wrap gap-1.5">
          {[
            'Explain SQLi remediation',
            'Generate CSP Header Policy',
            'DDoS Rate-Limit Backoff code',
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="pt-2 relative flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Copilot to fix vulnerabilities..."
            className="w-full bg-[#0e1428] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 transition-all shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
