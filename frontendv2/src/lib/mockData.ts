export interface TargetEndpoint {
  id: string;
  url: string;
  name: string;
  status: 'protected' | 'vulnerable' | 'scanning' | 'offline';
  riskScore: number; // 0 - 100
  lastScanned: string;
  vulnCount: { critical: number; high: number; medium: number; low: number };
  activeModules: string[];
}

export const MOCK_TARGETS: TargetEndpoint[] = [
  {
    id: 'target-1',
    url: 'https://api.threatlens.io/v1/auth',
    name: 'Production Auth Gateway',
    status: 'protected',
    riskScore: 12,
    lastScanned: '2 mins ago',
    vulnCount: { critical: 0, high: 0, medium: 1, low: 3 },
    activeModules: ['RateLimit', 'SQLi', 'Headers'],
  },
  {
    id: 'target-2',
    url: 'https://staging-cluster.internal.net',
    name: 'Staging Kubernetes API',
    status: 'vulnerable',
    riskScore: 78,
    lastScanned: '14 mins ago',
    vulnCount: { critical: 2, high: 4, medium: 7, low: 12 },
    activeModules: ['GitAudit', 'Exfil', 'XSS', 'SQLi'],
  },
  {
    id: 'target-3',
    url: 'https://checkout.retail-cloud.app',
    name: 'E-Commerce Checkout Core',
    status: 'protected',
    riskScore: 24,
    lastScanned: '1 hour ago',
    vulnCount: { critical: 0, high: 1, medium: 2, low: 5 },
    activeModules: ['DDoS', 'RateLimit', 'Proxy'],
  },
  {
    id: 'target-4',
    url: 'https://analytics-collector.threatlens.dev',
    name: 'Telemetry Ingestion Node',
    status: 'scanning',
    riskScore: 45,
    lastScanned: 'Scanning now...',
    vulnCount: { critical: 1, high: 2, medium: 3, low: 4 },
    activeModules: ['DDoS', 'Exfil', 'SQLi'],
  },
];

export const MOCK_CHART_DATA = [
  { month: 'Mar', afterAI: 32000, beforeAI: 68000, latency: 142, threatsBlocked: 1240 },
  { month: 'Apr', afterAI: 48000, beforeAI: 72000, latency: 128, threatsBlocked: 1850 },
  { month: 'May', afterAI: 41000, beforeAI: 79000, latency: 110, threatsBlocked: 2100 },
  { month: 'Jun', afterAI: 65000, beforeAI: 84000, latency: 94, threatsBlocked: 3420 },
  { month: 'Jul', afterAI: 87450, beforeAI: 52310, latency: 76, threatsBlocked: 4980 },
  { month: 'Aug', afterAI: 92100, beforeAI: 48900, latency: 68, threatsBlocked: 5610 },
  { month: 'Sep', afterAI: 98400, beforeAI: 43200, latency: 62, threatsBlocked: 6230 },
];

export const MOCK_EQUALIZER_WEEK = [
  { day: 'Sat', usage: '28k', height: 45, attackSpikes: 12, tokens: '1.4M' },
  { day: 'Sun', usage: '32k', height: 55, attackSpikes: 18, tokens: '1.6M' },
  { day: 'Mon', usage: '64k', height: 85, attackSpikes: 42, tokens: '3.1M' },
  { day: 'Tue', usage: '52k', height: 70, attackSpikes: 31, tokens: '2.7M' },
  { day: 'Wed', usage: '78k', height: 95, attackSpikes: 64, tokens: '3.8M' },
  { day: 'Thu', usage: '61k', height: 75, attackSpikes: 39, tokens: '2.9M' },
  { day: 'Fri', usage: '86k', height: 100, attackSpikes: 71, tokens: '4.2M' },
];

export const MOCK_MODULE_USAGE = [
  { name: 'SQL Injection Fuzzer', count: '82k scans', percent: 85, color: '#3b82f6', badge: 'Active Matrix' },
  { name: 'XSS Script Prober', count: '78k scans', percent: 76, color: '#8b5cf6', badge: 'DOM & Stored' },
  { name: 'DDoS Stress Generator', count: '86k req/s', percent: 92, color: '#06b6d4', badge: 'Socket Exhaustion' },
  { name: 'Git Repo Secret Scanner', count: '45k commits', percent: 64, color: '#10b981', badge: 'CVE Matcher' },
  { name: 'Data Exfil Crawler', count: '39k paths', percent: 58, color: '#f59e0b', badge: 'Debug Endpoints' },
];

export const MOCK_AI_INSIGHTS = [
  {
    id: 'insight-1',
    title: 'Cost & Latency Optimization',
    category: 'Optimization',
    impact: 'High',
    description: 'Smart model routing and caching reduced API audit overhead by 16%, saving an estimated $1,240 this month.',
    badge: 'Cost -16%',
  },
  {
    id: 'insight-2',
    title: 'SQLi Boundary Hardening',
    category: 'Vulnerability',
    impact: 'Critical',
    description: 'Target endpoint `/v1/auth/verify` detected 3 error-based SQL syntax anomalies. Auto-generated parameter binding patch ready.',
    badge: 'Patch Ready',
  },
  {
    id: 'insight-3',
    title: 'DDoS Socket Resiliency Boost',
    category: 'Performance',
    impact: 'Medium',
    description: 'Response latency improved by 24% after enforcing dynamic connection throttling on Slowloris profile patterns.',
    badge: 'Latency -24%',
  },
];

export const MOCK_ATTACK_LOCATIONS = [
  { id: '1', city: 'Frankfurt', country: 'DE', lat: 50.1109, lng: 8.6821, count: '1.2M', threat: 'High' },
  { id: '2', city: 'Singapore', country: 'SG', lat: 1.3521, lng: 103.8198, count: '840K', threat: 'Critical' },
  { id: '3', city: 'San Jose', country: 'US', lat: 37.3382, lng: -121.8863, count: '2.1M', threat: 'Low' },
  { id: '4', city: 'Tokyo', country: 'JP', lat: 35.6762, lng: 139.6503, count: '650K', threat: 'Medium' },
  { id: '5', city: 'São Paulo', country: 'BR', lat: -23.5505, lng: -46.6333, count: '410K', threat: 'High' },
];
