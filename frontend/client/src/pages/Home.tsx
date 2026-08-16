/**
 * Proof Engine design: technical editorial futurism using proof-blue signals,
 * trace rails, frosted attestation surfaces, and concise operational language.
 */
import { AuthModal } from "../components/AuthModal";
import AcidSquares from "../components/ui/acid-squares";
import { useAuth } from "../contexts/AuthContext";
import { motion, useInView } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Database,
  FileCheck2,
  Fingerprint,
  Github,
  GitBranch,
  Link2,
  LockKeyhole,
  LogOut,
  Menu,
  Network,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const heroImage = "/manus-storage/reposhield-hero-field_105155b3.png";
const blockchainImage = "/manus-storage/reposhield-blockchain-field_7b6d001c.png";
const logoMark = "/threatlens-logo.png";

const appear = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-eyebrow">
      <span className="eyebrow-pulse" />
      {children}
    </div>
  );
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={appear}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.62, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a className="brand" href="#top" aria-label="ThreatLens AI home">
      <img
        src="/threatlens-icon.png"
        alt="ThreatLens Shield Lock"
        className={compact ? "brand-icon w-6 h-6" : "brand-icon"}
      />
      <span className={compact ? "brand-name compact" : "brand-name"}>
        ThreatLens <em>AI</em>
      </span>
    </a>
  );
}

import { Link } from "wouter";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-shell">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#terminal">Terminal &amp; CLI</a>
          <a href="#product">Product</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#trust">Trust</a>
        </nav>
        <div className="nav-actions">
          <a className="github-link" href="https://github.com" target="_blank" rel="noreferrer" aria-label="Open GitHub">
            <Github size={18} />
            <span>GitHub</span>
          </a>

          {user ? (
            <div className="user-profile-badge">
              <div className="user-avatar">
                {user.name ? user.name[0].toUpperCase() : user.handle ? user.handle[0].toUpperCase() : "U"}
              </div>
              <div className="user-info">
                <span className="user-name">{user.name || user.handle}</span>
                <span className="user-role">@{user.handle || "user"}</span>
              </div>
              <button onClick={() => logout()} className="button button-ghost logout-button" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/signup" className="button button-primary nav-cta">
              Sign Up <ArrowRight size={16} />
            </Link>
          )}

          <button className="mobile-menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <div className={`mobile-nav ${open ? "open" : ""}`}>
        <a onClick={closeMenu} href="#terminal">Terminal &amp; CLI</a>
        <a onClick={closeMenu} href="#product">Product</a>
        <a onClick={closeMenu} href="#how-it-works">How It Works</a>
        <a onClick={closeMenu} href="#trust">Trust</a>
        {user ? (
          <button onClick={() => { logout(); closeMenu(); }} className="button button-ghost text-red-400">
            Sign Out (@{user.handle})
          </button>
        ) : (
          <Link onClick={closeMenu} href="/signup" className="button button-primary">Sign Up <ArrowRight size={16} /></Link>
        )}
      </div>
    </header>
  );
}

function ScoreCounter() {
  const [score, setScore] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let frame = 0;
    const tick = (time: number) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / 1050, 1);
      setScore(Math.round(78 * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return (
    <div ref={ref} className="score-orbit">
      <div className="score-orbit-ring ring-one" />
      <div className="score-orbit-ring ring-two" />
      <div className="score-shield">
        <ShieldCheck size={26} strokeWidth={1.5} />
        <strong>{score}</strong>
        <span>Security score</span>
      </div>
    </div>
  );
}

const pipelineSteps = [
  { label: "GitHub Repository", icon: GitBranch },
  { label: "AI Analysis", icon: Bot },
  { label: "Security Scan", icon: ScanSearch },
  { label: "Vulnerability Found", icon: ShieldAlert, danger: true },
  { label: "AI Report", icon: FileCheck2 },
  { label: "SHA-256 Hash", icon: Fingerprint },
  { label: "Blockchain", icon: Link2 },
];

function PipelineVisual() {
  return (
    <div className="pipeline-visual" aria-label="Security pipeline illustration">
      <div className="visual-topline"><span>LIVE ATTESTATION</span><Activity size={13} /></div>
      <div className="pipeline-core">
        <div className="pipeline-list">
          {pipelineSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className={`pipeline-step ${step.danger ? "danger" : ""}`} key={step.label}>
                <div className="pipeline-icon"><Icon size={13} /></div>
                <span>{step.label}</span>
                {index < pipelineSteps.length - 1 && <i className="pipeline-connector"><b /></i>}
              </div>
            );
          })}
          <div className="pipeline-verified"><CheckCircle2 size={13} /> VERIFIED</div>
        </div>
        <ScoreCounter />
      </div>
      <div className="scan-card scan-card-one"><Check size={13} /><span>Secrets scan</span></div>
      <div className="scan-card scan-card-two danger-card"><TriangleAlert size={13} /><span>2 critical findings</span></div>
      <div className="scan-card scan-card-three"><Check size={13} /><span>AI analysis</span></div>
      <div className="scan-card scan-card-four"><Check size={13} /><span>Polygon verified</span></div>
      <div className="data-particle particle-one" /><div className="data-particle particle-two" /><div className="data-particle particle-three" />
    </div>
  );
}

function HeroTypewriter() {
  const line1Text = "Secure every commit";
  const line2Text = "Prove every result";

  const [displayedLine1, setDisplayedLine1] = useState("");
  const [displayedLine2, setDisplayedLine2] = useState("");
  const [activeLine, setActiveLine] = useState<1 | 2>(1);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let i1 = 0;
    let i2 = 0;

    const timer1 = setInterval(() => {
      if (i1 <= line1Text.length) {
        setDisplayedLine1(line1Text.slice(0, i1));
        i1++;
      } else {
        clearInterval(timer1);
        setActiveLine(2);
        const timer2 = setInterval(() => {
          if (i2 <= line2Text.length) {
            setDisplayedLine2(line2Text.slice(0, i2));
            i2++;
          } else {
            clearInterval(timer2);
            setIsDone(true);
          }
        }, 50);
      }
    }, 60);

    return () => {
      clearInterval(timer1);
    };
  }, []);

  return (
    <h1 className="hero-typewriter-h1">
      <span className="typewriter-line line-1">
        {displayedLine1}
        {activeLine === 1 && <span className="typewriter-cursor line-1-cursor" />}
      </span>
      <br />
      <span className="typewriter-line line-2">
        <span className="line-2-text">{displayedLine2}</span>
        {activeLine === 2 && !isDone && <span className="typewriter-cursor line-2-cursor" />}
      </span>
    </h1>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-art" style={{ backgroundImage: `url(${heroImage})` }} />
      <div className="hero-grid" />
      <div className="hero-acid" aria-hidden="true">
        <AcidSquares
          color1="#371803"
          color2="#632f2f"
          color3="#730f0f"
          detail="medium"
          speed={0.7}
          waveDepth={1}
          zoom={1.3}
          density={10}
          glow={1}
          exposure={2700}
          spread={0.3}
          stepSize={0.002}
          colorShift={0}
          contrast={1}
          brightness={1}
          blur={0}
          opacity={1}
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseRadius={0.35}
          mouseStrength={0.1}
        />
      </div>
      <div className="container hero-layout">
        <motion.div className="hero-copy" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.11 } } }}>
          <motion.div variants={appear}>
            <HeroTypewriter />
          </motion.div>
          <motion.p variants={appear}>AI-powered security testing that detects threats, finds real vulnerabilities, and turns every security result into verifiable proof.</motion.p>
          <motion.div variants={appear} className="hero-actions">
            <Link className="button button-primary button-large" href="/signup">Get Started <ArrowRight size={18} /></Link>
            <a className="button button-ghost button-large" href="#terminal">Explore Terminal CLI <ChevronRight size={17} /></a>
          </motion.div>
          <motion.div variants={appear} className="hero-capabilities">
            <span>AI Analysis</span><i /> <span>Active Security Testing</span><i /> <span>Blockchain Verification</span>
          </motion.div>
        </motion.div>
      </div>
      <div className="hero-trace"><span>01</span><div /><span>REPOSITORY TO PROOF</span></div>
    </section>
  );
}

function TerminalShowcase() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"tui" | "cli">("tui");

  const cmdTui = "cd tui && npm start";
  const cmdCli = "python sectest/cli.py scan -t http://localhost:8000 --html --serve";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="terminal-section proof-section" id="terminal">
      <div className="container">
        <div className="terminal-layout">
          {/* Left Column: Description & Features */}
          <FadeIn className="terminal-copy">
            <h2>
              Offensive Security.<br />
              <em>Right in your shell.</em>
            </h2>
            <p>
              Execute deep repository secret scans, live SQLi and XSS injection audits, DDoS concurrency stress profiles, and receive instant cryptographic attestation without leaving your developer workflow.
            </p>

            <div className="terminal-features-grid">
              <div className="terminal-feat-item">
                <div className="terminal-feat-icon">
                  <Terminal size={18} />
                </div>
                <div className="terminal-feat-text">
                  <h4>ThreatLensGo Interactive TUI</h4>
                  <p>Cyberpunk animated terminal interface built with React 18 &amp; Ink. Features hotkey navigation (<code className="text-[#cbd5e1] bg-white/5 px-1 py-0.5 rounded">/git</code>, <code className="text-[#cbd5e1] bg-white/5 px-1 py-0.5 rounded">/sqli</code>, <code className="text-[#cbd5e1] bg-white/5 px-1 py-0.5 rounded">/ddos</code>, <code className="text-[#cbd5e1] bg-white/5 px-1 py-0.5 rounded">/exfil</code>) and real-time probe meters.</p>
                </div>
              </div>

              <div className="terminal-feat-item">
                <div className="terminal-feat-icon">
                  <ScanSearch size={18} />
                </div>
                <div className="terminal-feat-text">
                  <h4>SecTest Autonomous Scanner</h4>
                  <p>Modular Python security fuzzing pipeline with safety guards, dynamic response latency analysis, and locally hosted animated HTML audit reports.</p>
                </div>
              </div>

              <div className="terminal-feat-item">
                <div className="terminal-feat-icon">
                  <Zap size={18} />
                </div>
                <div className="terminal-feat-text">
                  <h4>Instant OAuth Device-Code Bridge</h4>
                  <p>Authenticate CLI sessions via GitHub or Google SSO in seconds with local session tokens and cryptographic evidence generation.</p>
                </div>
              </div>
            </div>

            {/* Quick Command Box */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("tui")}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    activeTab === "tui"
                      ? "bg-[#8b4513] text-white border border-white/10"
                      : "bg-[#0b0e14] text-[#8a99ad] border border-white/5 hover:text-white"
                  }`}
                >
                  ThreatLensGo TUI
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("cli")}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    activeTab === "cli"
                      ? "bg-[#8b4513] text-white border border-white/10"
                      : "bg-[#0b0e14] text-[#8a99ad] border border-white/5 hover:text-white"
                  }`}
                >
                  SecTest Scanner
                </button>
              </div>

              <div className="terminal-cmd-bar">
                <code>{activeTab === "tui" ? cmdTui : cmdCli}</code>
                <button
                  type="button"
                  onClick={() => handleCopy(activeTab === "tui" ? cmdTui : cmdCli)}
                  className="flex items-center gap-1.5 text-xs text-[#8a99ad] hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-1"
                  title="Copy command"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Right Column: Terminal Photo & Frame */}
          <FadeIn className="terminal-photo-container" delay={0.15}>
            <div className="terminal-photo-wrap">
              <img
                src="/terminal_cli_preview.jpg"
                alt="ThreatLensGo Terminal and CLI Interface Preview"
                className="terminal-photo-img"
                loading="lazy"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

const valueCards = [
  { icon: Bot, title: "AI code analysis", text: "Analyze commits and pull requests for malicious code, backdoors, secrets, privilege escalation and supply-chain attack patterns.", metric: "Commit-aware intelligence", route: "COMMIT / DIFF", hash: "ANL-96E2" },
  { icon: ScanSearch, title: "Active security testing", text: "Safely test authorized applications for SQL injection, XSS and authentication vulnerabilities instead of relying only on static patterns.", metric: "Authorized, real-world validation", route: "AUTH / APP", hash: "TST-41A8" },
  { icon: Link2, title: "Verified security", text: "Hash security results using SHA-256 and anchor the fingerprint on Polygon so the resulting artifact can be independently verified.", metric: "Independent evidence trail", route: "REPORT / HASH", hash: "VFY-8F4C" },
];

function ValueProposition() {
  return (
    <section className="section values-section proof-section" id="product">
      <div className="container">
        <FadeIn className="section-heading split-heading">
          <div><h2>One security record.<br /><em>Complete visibility.</em></h2></div>
          <p>Cut across fragmented point tools with a single, traceable path from code risk to independently verifiable result.</p>
        </FadeIn>
        <div className="value-cards">
          {valueCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <FadeIn key={card.title} className="value-card" delay={index * 0.08}>
                <div className="receipt-top"><span className="receipt-route">{card.route}</span><span className="card-index">RECORD 0{index + 1}</span></div>
                <div className="value-card-top"><span className="value-icon"><Icon size={22} /></span><span className="receipt-hash">{card.hash}</span></div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <div className="value-metric"><span className="metric-dot" />{card.metric}<CheckCircle2 size={13} /></div>
                <div className="card-corner" />
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const processSteps = [
  { number: "01", title: "Connect", body: "Connect your repository.", icon: GitBranch },
  { number: "02", title: "Analyze", body: "AI analyzes code, commits, dependencies and secrets.", icon: Bot },
  { number: "03", title: "Test", body: "Authorized applications are actively tested for real vulnerabilities.", icon: ScanSearch },
  { number: "04", title: "Verify", body: "Security results are hashed and anchored on-chain.", icon: CheckCircle2 },
];

function HowItWorks() {
  return (
    <section className="section process-section proof-section" id="how-it-works">
      <div className="container">
        <FadeIn className="section-heading centered-heading">
          <h2>From code to <em>verified proof.</em></h2>
        </FadeIn>
        <div className="process-rail" aria-label="Four-step security process">
          <div className="rail-line"><span /></div>
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <FadeIn className="process-step" delay={index * 0.1} key={step.number}>
                <div className="process-number">{step.number}</div>
                <div className="process-icon"><Icon size={21} /></div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const scoreRows = [
  ["Code Security", 82, "blue"], ["Dependencies", 71, "blue"], ["Secrets", 64, "coral"], ["Auth / API", 81, "blue"], ["Performance", 87, "blue"], ["Health", 94, "cyan"],
];

function SecurityReport() {
  return (
    <section className="section report-section proof-section">
      <div className="container report-layout">
        <FadeIn className="report-intro">
          <h2>An evidence trail for <em>every stakeholder.</em></h2>
          <p>Developers get actionable fixes. Security teams get deep telemetry. Compliance officers get cryptographically signed proof.</p>
          <div className="report-intro-list">
            <span><FileCheck2 size={15} /> Automated SBOM</span>
            <span><ShieldAlert size={15} /> Exploit validation</span>
            <span><Fingerprint size={15} /> Polygon anchoring</span>
          </div>
        </FadeIn>
        <FadeIn className="report-shell" delay={0.12}>
          <div className="report-topbar">
            <div className="flex items-center gap-2">
              <img src="/threatlens-icon.png" alt="" className="w-5 h-5 object-contain" />
              <span className="brand-name text-sm">ThreatLens <em>AI</em></span>
            </div>
            <div className="report-live"><i /> LIVE TELEMETRY</div>
          </div>
          <div className="report-main">
            <div className="report-score-area">
              <div><span className="mono-label">Composite Security Index</span><div className="report-score">84<span>/100</span></div></div>
              <div className="report-circle"><span>A+</span><i /></div>
            </div>
            <div className="report-rule" />
            <div className="score-list">
              {scoreRows.map(([name, score, tone]) => (
                <div className="score-row" key={name as string}>
                  <span>{name}</span>
                  <div className="score-bar"><span className={`score-fill ${tone}`} style={{ width: `${score}%` }} /></div>
                  <strong>{score}</strong>
                </div>
              ))}
            </div>
            <div className="finding-card">
              <div className="finding-head">
                <span className="severity"><TriangleAlert size={12} /> Critical finding</span>
                <span className="route">api/v1/auth</span>
              </div>
              <h3>SQL Injection (Blind Boolean-based)</h3>
              <div className="finding-copy">
                <span>Vulnerability</span>
                <p>Parameter &apos;user_id&apos; vulnerable to time-delayed SQL payloads.</p>
              </div>
              <div className="finding-rec">
                <span>Remediation</span>
                <p>Use parameterized query bindings in ORM layer.</p>
                <CheckCircle2 size={16} />
              </div>
            </div>
          </div>
          <div className="report-footer"><span><Link2 size={13} /> Blockchain Anchor</span><code>0x7f9a...3b21</code></div>
        </FadeIn>
      </div>
    </section>
  );
}

function BlockchainTrust() {
  return (
    <section className="section trust-section proof-section" id="trust">
      <div className="trust-art" style={{ backgroundImage: `url(${blockchainImage})` }} />
      <div className="trust-grid" />
      <div className="container trust-layout">
        <FadeIn className="trust-copy">
          <h2>Independent evidence.<br /><em>Immutable trust.</em></h2>
          <p>Security scan results are signed with ECDSA keys and published to the Polygon ledger as tamper-proof state attestations.</p>
        </FadeIn>
        <FadeIn className="verification-stage" delay={0.15}>
          <div className="verification-path">
            <div><GitBranch size={16} /><span>Commit</span></div>
            <i /><b />
            <div><Bot size={16} /><span>AI Scan</span></div>
            <i /><b />
            <div><Fingerprint size={16} /><span>SHA-256</span></div>
            <i /><b />
            <div className="path-verified"><CheckCircle2 size={16} /><span>On-Chain</span></div>
          </div>
          <div className="verification-card">
            <div className="verification-title">
              <div>
                <span className="mono-label">Smart Contract</span>
                <p className="font-mono text-xs text-white">0x38a...9F21</p>
              </div>
              <span className="verified-check"><CheckCircle2 size={13} /> Live</span>
            </div>
            <div className="verification-data">
              <span>Status</span><strong className="integrity">ANCHORED</strong>
              <span>Block</span><code>#58,291,042</code>
              <span>Tx Hash</span><code>0xa91c...44e8</code>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="final-cta" id="get-started">
      <div className="cta-orbit orbit-left" /><div className="cta-orbit orbit-right" />
      <FadeIn className="container final-cta-content">
        <div className="cta-seal"><ShieldCheck size={20} /></div>
        <h2>Secure your code.<br /><em>Trust your proof.</em></h2>
        <p>AI-powered security detection with verifiable evidence.</p>
        <a href="mailto:hello@threatlens.ai?subject=ThreatLens%20AI%20Demo" className="button button-primary button-large">Get Started <ArrowRight size={18} /></a>
      </FadeIn>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <Brand />
          <p>Security that leaves a receipt.</p>
        </div>
        <div className="footer-links">
          <a href="#terminal">Terminal &amp; CLI</a>
          <a href="#product">Product</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#trust">Trust</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
      <div className="container footer-bottom"><span>© 2026 ThreatLens AI</span><span>Security that leaves a receipt.</span></div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="proof-journey">
        <Hero />
        <TerminalShowcase />
        <ValueProposition />
        <HowItWorks />
        <SecurityReport />
        <BlockchainTrust />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
