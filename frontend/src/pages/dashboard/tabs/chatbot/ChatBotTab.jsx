import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  SquarePen,
  Image as ImageIcon,
  Library,
  Folder,
  Code2,
  MoreHorizontal,
  Brain,
  Mic,
  AudioWaveform,
  Globe,
  PenLine,
  Plus,
  Gift,
  RotateCcw,
  Send,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronRight,
  PanelLeft,
  Trash2,
  Sparkles,
  Paperclip,
  ShieldCheck,
  Terminal,
  ArrowUp,
  AtSign,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";
import GradientWaves from "@/animations/GradientWaves";

const INITIAL_CHATS = [
  {
    id: "chat-1",
    title: "JWT Authentication Audit",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "How should I securely validate RSA-signed JWTs in FastAPI?",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "To securely validate RS256 JWT tokens in FastAPI, always enforce the algorithm explicitly to prevent `none` algorithm or HMAC confusion attacks:\n\n```python\nimport jwt\nfrom fastapi import HTTPException, Security, status\nfrom fastapi.security import HTTPBearer, HTTPAuthorizationCredentials\n\nsecurity = HTTPBearer()\nPUBLIC_KEY = open(\"public_key.pem\").read()\n\ndef verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):\n    token = credentials.credentials\n    try:\n        payload = jwt.decode(\n            token,\n            PUBLIC_KEY,\n            algorithms=[\"RS256\"],\n            options={\"require\": [\"exp\", \"sub\", \"iss\"]}\n        )\n        return payload\n    except jwt.ExpiredSignatureError:\n        raise HTTPException(status_code=401, detail=\"Token expired\")\n    except jwt.InvalidTokenError:\n        raise HTTPException(status_code=401, detail=\"Invalid credentials\")\n```\n\nKey security measures:\n- Explicitly whitelist `algorithms=[\"RS256\"]`.\n- Ensure `iss` (issuer) and `aud` (audience) verification is activated.",
      },
    ],
  },
  {
    id: "chat-2",
    title: "Docker Compose Hardening",
    messages: [],
  },
  {
    id: "chat-3",
    title: "SQL Injection Prevention",
    messages: [],
  },
];

export default function ChatBotTab({ user }) {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputQuery, setInputQuery] = useState("");
  const [isThinkingActive, setIsThinkingActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeThinkingBlock, setActiveThinkingBlock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isGenerating]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputQuery]);

  const handleCreateNewChat = () => {
    setActiveChatId(null);
    setInputQuery("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setInputQuery("");
  };

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isGenerating) return;

    setInputQuery("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    let targetChatId = activeChatId;

    if (!targetChatId) {
      // Create new chat
      const newChat = {
        id: `chat-${Date.now()}`,
        title: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
        pinned: false,
        messages: [userMessage],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      targetChatId = newChat.id;
    } else {
      setChats((prev) =>
        prev.map((c) =>
          c.id === targetChatId ? { ...c, messages: [...c.messages, userMessage] } : c
        )
      );
    }

    // Simulate AI streaming response
    setIsGenerating(true);
    const assistantMsgId = `a-${Date.now()}`;

    setTimeout(() => {
      const isSecurityRelated =
        /cve|vulnerability|audit|security|token|jwt|docker|sql|xss|secret|api|auth/i.test(text);

      let responseContent = "";
      if (isSecurityRelated) {
        responseContent = `I have analyzed your request regarding security & engineering best practices.\n\n### 🛡️ ThreatLens Intelligence Evaluation\n- **Analysis Score**: 98.4% Confidence\n- **Classification**: Code Security & Attestation\n\n\`\`\`bash\n# Verified security verification test\nthreatlens scan --target ./src --depth deep --enforce-policy\n\`\`\`\n\n**Recommendations:**\n1. Enforce strict parameter validation on all incoming inputs.\n2. Ensure least-privilege permissions on container secrets and environment keys.\n3. Validate all cryptographic signatures against a secured KMS endpoint.\n\nLet me know if you would like me to generate a complete remediation patch or test harness!`;
      } else {
        responseContent = `Here is what I've prepared based on **"${text}"**:\n\n1. **Core Concept**: Efficiently structuring your requirements with clean modular patterns.\n2. **Action Items**:\n   - Review data flows and boundary isolation.\n   - Ensure automated unit test coverage.\n   - Optimize response latency.\n\nLet me know if you need any follow-up adjustments or deep dive analysis!`;
      }

      setChats((prev) =>
        prev.map((c) =>
          c.id === targetChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: assistantMsgId,
                    role: "assistant",
                    content: responseContent,
                    thought: isThinkingActive
                      ? "Examining security posture... validating policy boundaries... verifying cryptographic primitives... synthesizing concise response."
                      : null,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ],
              }
            : c
        )
      );
      setIsGenerating(false);
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteChat = (e, id) => {
    e.stopPropagation();
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
    toast.info("Conversation deleted");
  };

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full bg-[#000000] text-[#ECECEC] font-sans antialiased overflow-hidden select-none">
      {/* ---------- LEFT CHATBOT SIDEBAR ---------- */}
      {isSidebarOpen && (
        <aside className="w-[260px] shrink-0 bg-[#0d0d0d] border-r border-[#1e1e1e] flex flex-col justify-between h-full transition-all duration-200 z-20">
          {/* Top Sidebar Header */}
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between px-2 pt-1 pb-1">
              <span className="font-semibold text-[15px] tracking-tight text-[#FFFFFF] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#6EA8DA]" />
                <span>ThreatLens AI</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-1.5 text-[#9E9E9E] hover:text-white hover:bg-[#212121] rounded-lg transition-colors cursor-pointer"
                  title="Search chats"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 text-[#9E9E9E] hover:text-white hover:bg-[#212121] rounded-lg transition-colors cursor-pointer"
                  title="Close sidebar"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Input if toggled */}
            {isSearchOpen && (
              <div className="px-2">
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#212121] text-white rounded-lg border border-[#333] focus:outline-none focus:border-[#6EA8DA]"
                  autoFocus
                />
              </div>
            )}

            {/* New Chat Button */}
            <button
              onClick={handleCreateNewChat}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#212121] hover:bg-[#2f2f2f] text-white text-xs font-medium transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <SquarePen className="w-4 h-4 text-[#D1D1D1]" />
                <span className="font-semibold">New chat</span>
              </div>
            </button>
          </div>

          {/* Middle: Chat History (Recents) */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-3">

            {/* Recents Section */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#808080] px-3 uppercase tracking-wider">
                <span>Recents</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              {filteredChats
                .filter((c) => !c.pinned)
                .map((c) => {
                  const isActive = activeChatId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectChat(c.id)}
                      className={`group flex items-center justify-between px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isActive
                          ? "bg-[#212121] text-white font-medium"
                          : "text-[#B4B4B4] hover:bg-[#1a1a1a] hover:text-white"
                      }`}
                    >
                      <span className="truncate flex-1">{c.title}</span>
                      <button
                        onClick={(e) => handleDeleteChat(e, c.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </aside>
      )}

      {/* ---------- MAIN CHAT AREA ---------- */}
      <div className="flex-1 flex flex-col h-full bg-[#000000] relative overflow-hidden">
        {/* Background Gradient Waves Animation */}
        <GradientWaves
          horizonColor="#010114"
          waveColor="#6f6e9d"
          crestColor="#292596"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1}
          opacity={1}
          grain
          grainIntensity={0.05}
          mouseInteraction
          parallaxStrength={0.5}
          className="z-0"
        />

        {/* Top Floating Bar when Sidebar is closed */}
        <div className="h-11 px-4 flex items-center justify-between border-b border-[#141414] bg-[#000000]/60 backdrop-blur-md shrink-0 z-10 relative">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 text-[#9E9E9E] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer"
                title="Open sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}
            <span className="text-xs font-semibold text-[#808080]">
              {activeChat ? activeChat.title : "ThreatLens AI"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.success("Special Offer: Security Scanner credits active")}
              className="flex items-center gap-1.5 text-xs text-[#38BDF8] hover:text-[#60a5fa] font-medium cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Offer</span>
            </button>
            <button
              onClick={() => handleCreateNewChat()}
              className="p-1.5 text-[#9E9E9E] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer"
              title="Refresh / New Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Box (Messages or Empty State) */}
        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center z-10 relative">
          {(!activeChat || activeChat.messages.length === 0) ? (
            /* ---------- EMPTY STATE (Beware of the threats) ---------- */
            <div className="my-auto -translate-y-6 sm:-translate-y-8 w-full max-w-2xl flex flex-col items-center text-center space-y-10 sm:space-y-12 px-4">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Beware of the threats
              </h1>

              {/* Main Input Box Pill */}
              <div className="w-full bg-[#212121] border border-[#2f2f2f] hover:border-[#444] focus-within:border-[#555] rounded-3xl p-3 px-4 shadow-2xl transition-all flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toast.info("Attach code diff, file or repository")}
                    className="w-8 h-8 rounded-full bg-[#1a2333] hover:bg-[#2563EB] text-[#6EA8DA] hover:text-white border border-[#2563EB]/40 hover:border-[#6EA8DA] flex items-center justify-center shrink-0 transition-all shadow-[0_0_12px_rgba(37,99,235,0.25)] cursor-pointer"
                    title="Attach file / repo"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <textarea
                    ref={textareaRef}
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Ask anything"
                    className="flex-1 bg-transparent text-white text-[15px] placeholder-[#8E8E8E] focus:outline-none resize-none max-h-40 leading-relaxed font-sans"
                    autoFocus
                  />

                  {/* Right Tools in Pill */}
                  <div className="flex items-center gap-2 shrink-0">

                    <button
                      onClick={() => toast.info("Voice input listening...")}
                      className="w-8 h-8 rounded-full hover:bg-[#2f2f2f] text-[#A0A0A0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Voice input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputQuery.trim()}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        inputQuery.trim()
                          ? "bg-[#2563EB] text-white shadow-md hover:bg-[#1d4ed8]"
                          : "bg-[#2f2f2f] text-[#808080] opacity-60"
                      }`}
                      title="Send message"
                    >
                      <AudioWaveform className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ---------- ACTIVE CONVERSATION THREAD ---------- */
            <div className="w-full max-w-3xl space-y-6 pb-24">
              {activeChat.messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                        <Sparkles className="w-4 h-4 text-[#38bdf8]" />
                      </div>
                    )}

                    <div className={`space-y-2 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                      {/* Optional Thought Block if thinking was used */}
                      {msg.thought && (
                        <div className="p-3 rounded-xl bg-[#141a24] border border-[#233148] text-xs text-[#8a99ad] font-mono mb-2">
                          <div className="flex items-center gap-2 font-bold text-[#6EA8DA] mb-1">
                            <Brain className="w-3.5 h-3.5" />
                            <span>Reasoning Process</span>
                          </div>
                          <p className="leading-relaxed">{msg.thought}</p>
                        </div>
                      )}

                      {/* Main Message Bubble */}
                      <div
                        className={`p-4 rounded-2xl text-[14.5px] leading-relaxed shadow-sm ${
                          isUser
                            ? "bg-[#262626] text-white rounded-br-sm"
                            : "bg-[#121212] border border-[#222] text-[#E0E0E0] rounded-bl-sm"
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                      </div>

                      {/* Action buttons for assistant message */}
                      {!isUser && (
                        <div className="flex items-center gap-2 pt-1 text-[#808080] text-xs pl-1">
                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="p-1 hover:text-white transition-colors cursor-pointer"
                            title="Copy text"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => toast.success("Feedback recorded")}
                            className="p-1 hover:text-white transition-colors cursor-pointer"
                            title="Good response"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toast.info("Feedback recorded")}
                            className="p-1 hover:text-white transition-colors cursor-pointer"
                            title="Needs improvement"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-[#EC4899] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        {user?.name ? user.name.slice(0, 2).toUpperCase() : "TM"}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Generating Loading Animation */}
              {isGenerating && (
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#38bdf8] animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-[#121212] border border-[#222] text-[#808080] text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#6EA8DA] animate-pulse" />
                    <span>Thinking and auditing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Area when in active conversation */}
        {activeChat && activeChat.messages.length > 0 && (
          <div className="p-4 pt-2 pb-6 bg-[#000000]/70 backdrop-blur-md border-t border-[#181818] flex justify-center z-10 relative">
            <div className="w-full max-w-3xl bg-[#212121] border border-[#2f2f2f] hover:border-[#444] focus-within:border-[#555] rounded-3xl p-3 px-4 shadow-xl transition-all flex items-center gap-3">
              <button
                onClick={() => toast.info("Attach code snippet, file or log")}
                className="w-8 h-8 rounded-full bg-[#1a2333] hover:bg-[#2563EB] text-[#6EA8DA] hover:text-white border border-[#2563EB]/40 hover:border-[#6EA8DA] flex items-center justify-center shrink-0 transition-all shadow-[0_0_12px_rgba(37,99,235,0.25)] cursor-pointer"
                title="Attach"
              >
                <Plus className="w-4 h-4" />
              </button>

              <textarea
                ref={textareaRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-white text-[14.5px] placeholder-[#8E8E8E] focus:outline-none resize-none max-h-36 leading-relaxed font-sans"
              />

              <div className="flex items-center gap-2 shrink-0">

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputQuery.trim() || isGenerating}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    inputQuery.trim()
                      ? "bg-[#2563EB] text-white shadow-md hover:bg-[#1d4ed8]"
                      : "bg-[#2f2f2f] text-[#808080] opacity-60"
                  }`}
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
