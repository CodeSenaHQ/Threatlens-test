import React, { useState, useMemo } from "react";
import {
  Calendar,
  RotateCcw,
  Download,
  ChevronDown,
  Sparkles,
  Terminal,
  Bot,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Info,
  CheckCircle2,
  DollarSign,
  Activity,
  Filter
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from "recharts";
import { toast } from "sonner";

// Model Pricing Reference (OpenRouter Low-Cost Benchmarks)
export const OPENROUTER_PRICING = {
  chatbot: {
    model: "DeepSeek V3 (deepseek/deepseek-chat)",
    inputPricePerM: 0.14, // $0.14 / 1M input tokens
    outputPricePerM: 0.28, // $0.28 / 1M output tokens
    reasoningPricePerM: 2.19, // DeepSeek R1 reasoning
  },
  terminal: {
    model: "Llama 3.3 70B & Gemini Flash (meta-llama / gemini-2.0-flash)",
    inputPricePerM: 0.12, // $0.12 / 1M input tokens
    outputPricePerM: 0.30, // $0.30 / 1M output tokens
  }
};

// 16-Day Historical Usage Data
const INITIAL_DAILY_DATA = [
  { date: "Aug 08", fullDate: "Aug 08, 2026 UTC", chatIn: 12400, chatOut: 3600, termIn: 8200, termOut: 1100, requests: 4 },
  { date: "Aug 09", fullDate: "Aug 09, 2026 UTC", chatIn: 8900, chatOut: 2400, termIn: 4500, termOut: 900, requests: 3 },
  { date: "Aug 10", fullDate: "Aug 10, 2026 UTC", chatIn: 16500, chatOut: 5100, termIn: 12100, termOut: 1800, requests: 6 },
  { date: "Aug 11", fullDate: "Aug 11, 2026 UTC", chatIn: 5400, chatOut: 1800, termIn: 3200, termOut: 600, requests: 2 },
  { date: "Aug 12", fullDate: "Aug 12, 2026 UTC", chatIn: 9800, chatOut: 3200, termIn: 7600, termOut: 1200, requests: 4 },
  { date: "Aug 13", fullDate: "Aug 13, 2026 UTC", chatIn: 14200, chatOut: 4800, termIn: 11400, termOut: 1900, requests: 5 },
  { date: "Aug 14", fullDate: "Aug 14, 2026 UTC", chatIn: 22100, chatOut: 7400, termIn: 18300, termOut: 3100, requests: 8 },
  { date: "Aug 15", fullDate: "Aug 15, 2026 UTC", chatIn: 18600, chatOut: 6200, termIn: 14200, termOut: 2400, requests: 7 },
  { date: "Aug 16", fullDate: "Aug 16, 2026 UTC", chatIn: 11200, chatOut: 3800, termIn: 9100, termOut: 1500, requests: 4 },
  { date: "Aug 17", fullDate: "Aug 17, 2026 UTC", chatIn: 38500, chatOut: 14200, termIn: 32400, termOut: 6800, requests: 15 },
  { date: "Aug 18", fullDate: "Aug 18, 2026 UTC", chatIn: 24100, chatOut: 8100, termIn: 19800, termOut: 3400, requests: 9 },
  { date: "Aug 19", fullDate: "Aug 19, 2026 UTC", chatIn: 19400, chatOut: 6500, termIn: 16100, termOut: 2900, requests: 7 },
  { date: "Aug 20", fullDate: "Aug 20, 2026 UTC", chatIn: 27800, chatOut: 9300, termIn: 22500, termOut: 4100, requests: 11 },
  { date: "Aug 21", fullDate: "Aug 21, 2026 UTC", chatIn: 31200, chatOut: 10800, termIn: 26400, termOut: 5200, requests: 13 },
  { date: "Aug 22", fullDate: "Aug 22, 2026 UTC", chatIn: 28900, chatOut: 9900, termIn: 24100, termOut: 4600, requests: 12 },
  { date: "Aug 23", fullDate: "Aug 23, 2026 UTC", chatIn: 34500, chatOut: 12100, termIn: 29800, termOut: 5900, requests: 14 },
];

export default function TokenUsageTab({ user }) {
  const [activeCategory, setActiveCategory] = useState("chatbot"); // 'chatbot' | 'terminal'
  const [selectedProject, setSelectedProject] = useState("Default project");
  const [dateRange, setDateRange] = useState("08/08/26 - 08/23/26");
  const [groupBy, setGroupBy] = useState("1d"); // '1d' | '1h' | '7d'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeHoverBar, setActiveHoverBar] = useState(null);

  // Compute calculated metrics with OpenRouter low-cost rate formulas
  const calculatedData = useMemo(() => {
    return INITIAL_DAILY_DATA.map((day) => {
      // Cost formula: (Tokens_in / 1M * Pin) + (Tokens_out / 1M * Pout)
      const chatCost =
        (day.chatIn / 1_000_000) * OPENROUTER_PRICING.chatbot.inputPricePerM +
        (day.chatOut / 1_000_000) * OPENROUTER_PRICING.chatbot.outputPricePerM;

      const termCost =
        (day.termIn / 1_000_000) * OPENROUTER_PRICING.terminal.inputPricePerM +
        (day.termOut / 1_000_000) * OPENROUTER_PRICING.terminal.outputPricePerM;

      const totalSpend = chatCost + termCost;
      const totalTokens = day.chatIn + day.chatOut + day.termIn + day.termOut;

      return {
        ...day,
        chatCost,
        termCost,
        spend: totalSpend,
        totalTokens,
        activeCategorySpend: activeCategory === "chatbot" ? chatCost : termCost,
      };
    });
  }, [activeCategory]);

  const summary = useMemo(() => {
    let totalSpend = 0;
    let totalTokens = 0;
    let totalRequests = 0;
    let chatSpend = 0;
    let termSpend = 0;
    let chatTokens = 0;
    let termTokens = 0;

    calculatedData.forEach((d) => {
      totalSpend += d.spend;
      totalTokens += d.totalTokens;
      totalRequests += d.requests;
      chatSpend += d.chatCost;
      termSpend += d.termCost;
      chatTokens += d.chatIn + d.chatOut;
      termTokens += d.termIn + d.termOut;
    });

    return {
      totalSpend,
      totalTokens,
      totalRequests,
      chatSpend,
      termSpend,
      chatTokens,
      termTokens,
    };
  }, [calculatedData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Usage metrics synchronized with OpenRouter telemetry");
    }, 600);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Chatbot_Input_Tokens,Chatbot_Output_Tokens,Terminal_Input_Tokens,Terminal_Output_Tokens,Total_Spend_USD\n" +
      calculatedData
        .map(
          (d) =>
            `${d.fullDate},${d.chatIn},${d.chatOut},${d.termIn},${d.termOut},${d.spend.toFixed(6)}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `threatlens_token_usage_${activeCategory}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Usage telemetry exported as CSV");
  };

  // Custom Chart Tooltip matching OpenAI / OpenRouter dark theme
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 shadow-2xl text-xs space-y-1 z-50">
          <div className="text-white font-medium">{data.fullDate}</div>
          <div className="text-[#A1A1AA] flex items-center justify-between gap-4">
            <span>Total Spend:</span>
            <span className="font-semibold text-white">${data.spend.toFixed(5)}</span>
          </div>
          <div className="text-[#38BDF8] flex items-center justify-between gap-4">
            <span>Chatbot Spend:</span>
            <span>${data.chatCost.toFixed(5)}</span>
          </div>
          <div className="text-[#F59E0B] flex items-center justify-between gap-4">
            <span>Terminal Spend:</span>
            <span>${data.termCost.toFixed(5)}</span>
          </div>
          <div className="text-[#A1A1AA] flex items-center justify-between gap-4 pt-1 border-t border-[#27272a]">
            <span>Tokens:</span>
            <span>{data.totalTokens.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 bg-[#121214] text-[#EDEDED] font-sans antialiased min-h-[calc(100vh-3.5rem)] flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 select-none overflow-y-auto">
      
      {/* ---------- TOP HEADER & TOOLBAR ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222226]">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">Usage</h1>
          {/* Default Project Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1c1f] border border-[#2e2e33] text-xs text-[#d1d5db]">
            <span>{selectedProject}</span>
            <button
              onClick={() => toast.info("Project: Default Workspace")}
              className="text-[#9ca3af] hover:text-white transition-colors cursor-pointer ml-0.5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Right Controls: Date Range, Refresh, Export */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Date Picker Button */}
          <button
            onClick={() => toast.info("Date range: Aug 08, 2026 - Aug 23, 2026")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1c1c1f] hover:bg-[#25252a] border border-[#2e2e33] text-xs text-[#E5E7EB] transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#9ca3af]" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af] ml-1" />
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg bg-[#1c1c1f] hover:bg-[#25252a] border border-[#2e2e33] text-[#9ca3af] hover:text-white transition-all cursor-pointer ${
              isRefreshing ? "animate-spin text-[#38BDF8]" : ""
            }`}
            title="Refresh usage data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="p-2 rounded-lg bg-[#1c1c1f] hover:bg-[#25252a] border border-[#2e2e33] text-[#9ca3af] hover:text-white transition-all cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ---------- MAIN HERO USAGE GRID ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Total Spend Interactive Graph */}
        <div className="lg:col-span-2 bg-[#18181b] border border-[#27272a] rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-[#9ca3af]">Total Spend</div>
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
                ${summary.totalSpend.toFixed(2)}
              </div>
            </div>

            {/* Group By Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9ca3af] flex items-center gap-1">
                Group by <ChevronDown className="w-3 h-3" />
              </span>
              <div className="px-2 py-1 rounded-md bg-[#27272a] text-xs font-semibold text-white">
                {groupBy}
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calculatedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.4} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717A", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  tickFormatter={(val) => `$${val.toFixed(2)}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar
                  dataKey="spend"
                  radius={[4, 4, 0, 0]}
                  onMouseEnter={(_, index) => setActiveHoverBar(index)}
                  onMouseLeave={() => setActiveHoverBar(null)}
                >
                  {calculatedData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === activeHoverBar
                          ? "#38BDF8"
                          : index === calculatedData.length - 1
                          ? "#2962FF"
                          : "#2C2C32"
                      }
                      className="transition-colors duration-200"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-[#71717A] pt-2 border-t border-[#222226]">
            <span>Aug 08</span>
            <span>Aug 23</span>
          </div>
        </div>

        {/* Right 1 Col: Spend & Tokens Summary Panel */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 flex flex-col justify-between space-y-6">
          
          {/* August Spend Item */}
          <div className="space-y-1">
            <div className="text-xs text-[#9ca3af]">August spend</div>
            <div className="text-sm font-semibold text-white">Personal</div>
            <div className="text-2xl font-bold text-white tracking-tight">
              ${summary.totalSpend.toFixed(2)}
            </div>
          </div>

          {/* Total Tokens Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9ca3af]">
              <span>Total tokens</span>
              <span className="text-[#38BDF8] font-mono font-medium">
                {summary.totalTokens.toLocaleString()}
              </span>
            </div>
            {/* Progress Bar styled like reference */}
            <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#F43F5E] rounded-full"
                style={{ width: "42%" }}
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-[#F43F5E] bg-[#18181b]" />
            </div>
          </div>

          {/* Total Requests Count */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9ca3af]">
              <span>Total requests</span>
              <span className="font-mono text-white font-medium">{summary.totalRequests}</span>
            </div>
            {/* Dashed baseline track */}
            <div className="w-full border-b border-dashed border-[#3f3f46] pt-1" />
          </div>

          {/* Quick Channel Breakdown */}
          <div className="pt-3 border-t border-[#222226] space-y-2">
            <div className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider">
              Channel Breakdown
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#d1d5db]">
                <Bot className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Chatbot Assistant</span>
              </span>
              <span className="font-mono font-medium text-white">
                ${summary.chatSpend.toFixed(3)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#d1d5db]">
                <Terminal className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Terminal Scanner</span>
              </span>
              <span className="font-mono font-medium text-white">
                ${summary.termSpend.toFixed(3)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- BOTTOM CHANNEL SELECTION (Exclusively Chatbot & Terminal) ---------- */}
      <div className="space-y-4 pt-2">
        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-8 border-b border-[#222226] pb-1">
          <button
            onClick={() => setActiveCategory("chatbot")}
            className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 ${
              activeCategory === "chatbot"
                ? "text-white"
                : "text-[#71717A] hover:text-white"
            }`}
          >
            <Bot className="w-4 h-4 text-[#38BDF8]" />
            <span>Chatbot Usage</span>
            {activeCategory === "chatbot" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-white rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveCategory("terminal")}
            className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 ${
              activeCategory === "terminal"
                ? "text-white"
                : "text-[#71717A] hover:text-white"
            }`}
          >
            <Terminal className="w-4 h-4 text-[#F59E0B]" />
            <span>Terminal Usage</span>
            {activeCategory === "terminal" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-white rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Detail Contents */}
        {activeCategory === "chatbot" ? (
          /* ---------- CHATBOT USAGE VIEW ---------- */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Model & Pricing Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 space-y-1">
                <div className="text-[11px] text-[#71717A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Referenced Model</span>
                </div>
                <div className="text-sm font-semibold text-white">DeepSeek V3 / R1</div>
                <div className="text-xs text-[#9ca3af]">OpenRouter low-cost benchmark</div>
              </div>

              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 space-y-1">
                <div className="text-[11px] text-[#71717A] uppercase font-bold tracking-wider">
                  Input Tokens Rate
                </div>
                <div className="text-sm font-bold text-[#38BDF8]">$0.14 / 1M Tokens</div>
                <div className="text-xs text-[#9ca3af]">$0.00000014 per prompt token</div>
              </div>

              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 space-y-1">
                <div className="text-[11px] text-[#71717A] uppercase font-bold tracking-wider">
                  Output Tokens Rate
                </div>
                <div className="text-sm font-bold text-[#38BDF8]">$0.28 / 1M Tokens</div>
                <div className="text-xs text-[#9ca3af]">$0.00000028 per response token</div>
              </div>
            </div>

            {/* Granular Logs Table */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-3.5 border-b border-[#222226] flex items-center justify-between">
                <div className="text-sm font-semibold text-white">Chatbot Activity & Spend Breakdown</div>
                <div className="text-xs text-[#9ca3af]">Total Chatbot Cost: <span className="text-white font-bold">${summary.chatSpend.toFixed(4)}</span></div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1c1c1f] text-[#71717A] uppercase text-[10px] tracking-wider border-b border-[#27272a]">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Time (UTC)</th>
                      <th className="px-4 py-2.5 font-semibold">Service</th>
                      <th className="px-4 py-2.5 font-semibold">Input Tokens</th>
                      <th className="px-4 py-2.5 font-semibold">Output Tokens</th>
                      <th className="px-4 py-2.5 font-semibold">Total Tokens</th>
                      <th className="px-4 py-2.5 font-semibold">Cost (USD)</th>
                      <th className="px-4 py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222226] text-[#D1D5DB]">
                    {calculatedData.slice(-6).reverse().map((d, i) => (
                      <tr key={i} className="hover:bg-[#202024] transition-colors">
                        <td className="px-4 py-2.5 font-mono text-[#9ca3af]">{d.fullDate}</td>
                        <td className="px-4 py-2.5 font-medium text-white flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-[#38BDF8]" />
                          <span>ThreatLens AI Chat</span>
                        </td>
                        <td className="px-4 py-2.5 font-mono">{d.chatIn.toLocaleString()}</td>
                        <td className="px-4 py-2.5 font-mono">{d.chatOut.toLocaleString()}</td>
                        <td className="px-4 py-2.5 font-mono text-white">{(d.chatIn + d.chatOut).toLocaleString()}</td>
                        <td className="px-4 py-2.5 font-mono text-[#38BDF8] font-semibold">${d.chatCost.toFixed(5)}</td>
                        <td className="px-4 py-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                            200 OK
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* ---------- TERMINAL USAGE VIEW ---------- */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Model & Pricing Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 space-y-1">
                <div className="text-[11px] text-[#71717A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Scanner Engine</span>
                </div>
                <div className="text-sm font-semibold text-white">Llama 3.3 / Gemini Flash</div>
                <div className="text-xs text-[#9ca3af]">Diff & vulnerability tokenization</div>
              </div>

              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 space-y-1">
                <div className="text-[11px] text-[#71717A] uppercase font-bold tracking-wider">
                  AST & Diff Ingest Rate
                </div>
                <div className="text-sm font-bold text-[#F59E0B]">$0.12 / 1M Tokens</div>
                <div className="text-xs text-[#9ca3af]">$0.00000012 per ingested token</div>
              </div>

              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 space-y-1">
                <div className="text-[11px] text-[#71717A] uppercase font-bold tracking-wider">
                  Security Findings Rate
                </div>
                <div className="text-sm font-bold text-[#F59E0B]">$0.30 / 1M Tokens</div>
                <div className="text-xs text-[#9ca3af]">$0.00000030 per report token</div>
              </div>
            </div>

            {/* Granular Logs Table */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-3.5 border-b border-[#222226] flex items-center justify-between">
                <div className="text-sm font-semibold text-white">Terminal & CLI Automated Scan Logs</div>
                <div className="text-xs text-[#9ca3af]">Total Terminal Cost: <span className="text-white font-bold">${summary.termSpend.toFixed(4)}</span></div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1c1c1f] text-[#71717A] uppercase text-[10px] tracking-wider border-b border-[#27272a]">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Time (UTC)</th>
                      <th className="px-4 py-2.5 font-semibold">Scan Target</th>
                      <th className="px-4 py-2.5 font-semibold">Ingested Diff Tokens</th>
                      <th className="px-4 py-2.5 font-semibold">Finding Tokens</th>
                      <th className="px-4 py-2.5 font-semibold">Total Tokens</th>
                      <th className="px-4 py-2.5 font-semibold">Cost (USD)</th>
                      <th className="px-4 py-2.5 font-semibold">Scanner Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222226] text-[#D1D5DB]">
                    {calculatedData.slice(-6).reverse().map((d, i) => (
                      <tr key={i} className="hover:bg-[#202024] transition-colors">
                        <td className="px-4 py-2.5 font-mono text-[#9ca3af]">{d.fullDate}</td>
                        <td className="px-4 py-2.5 font-medium text-white flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>CLI Commit Scan #{i + 104}</span>
                        </td>
                        <td className="px-4 py-2.5 font-mono">{d.termIn.toLocaleString()}</td>
                        <td className="px-4 py-2.5 font-mono">{d.termOut.toLocaleString()}</td>
                        <td className="px-4 py-2.5 font-mono text-white">{(d.termIn + d.termOut).toLocaleString()}</td>
                        <td className="px-4 py-2.5 font-mono text-[#F59E0B] font-semibold">${d.termCost.toFixed(5)}</td>
                        <td className="px-4 py-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-medium">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
