/**
 * Proof Engine design: technical editorial futurism using proof-blue signals,
 * trace rails, frosted attestation surfaces, and concise operational language.
 */
import { AuthModal } from "../components/AuthModal";
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
  TriangleAlert,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const heroImage = "/manus-storage/reposhield-hero-field_105155b3.png";
const blockchainImage = "/manus-storage/reposhield-blockchain-field_7b6d001c.png";
const logoMark = "/manus-storage/reposhield-mark_2f0e7be5.png";

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
      <span className="brand-mark-wrap">
        <img src={logoMark} alt="" className="brand-mark" />
      </span>
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
      <div className="container hero-layout">
        <motion.div className="hero-copy" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.11 } } }}>
          <motion.div variants={appear}>
            <HeroTypewriter />
          </motion.div>
          <motion.p variants={appear}>AI-powered security testing that detects threats, finds real vulnerabilities, and turns every security result into verifiable proof.</motion.p>
          <motion.div variants={appear} className="hero-actions">
            <Link className="button button-primary button-large" href="/signup">Get Started <ArrowRight size={18} /></Link>
            <a className="button button-ghost button-large" href="#how-it-works">See How It Works <ChevronRight size={17} /></a>
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
          <div><SectionEyebrow>Complete signal coverage</SectionEyebrow><h2>One security record.<br /><em>Complete visibility.</em></h2></div>
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
          <SectionEyebrow>Designed for a clear audit trail</SectionEyebrow>
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
          <SectionEyebrow>Security intelligence, distilled</SectionEyebrow>
          <h2>Security posture.<br /><em>Verified at a glance.</em></h2>
          <p>Every ThreatLens report turns activity across your stack into a concise, explainable security narrative with recommended next actions.</p>
          <div className="report-intro-list">
            <span><CheckCircle2 size={17} /> Severity breakdown</span>
            <span><CheckCircle2 size={17} /> Affected files and CVEs</span>
            <span><CheckCircle2 size={17} /> AI explanations and fixes</span>
          </div>
        </FadeIn>
        <FadeIn className="report-shell" delay={0.12}>
          <div className="report-topbar"><Brand compact /><span className="report-live"><i /> LIVE ANALYSIS</span></div>
          <div className="report-main">
            <div className="report-score-area">
              <div><span className="mono-label">Security score</span><div className="report-score">78<span>/100</span></div></div>
              <div className="report-circle"><span>78</span><i /></div>
            </div>
            <div className="report-rule" />
            <div className="score-list">
              {scoreRows.map(([name, score, accent]) => <div className="score-row" key={name as string}><span>{name as string}</span><div className="score-bar"><b className={`score-fill ${accent}`} style={{ width: `${score}%` }} /></div><strong>{score as number}</strong></div>)}
            </div>
            <div className="finding-card">
              <div className="finding-head"><span className="severity"><TriangleAlert size={13} /> Critical</span><span className="route">/api/search</span></div>
              <h3>SQL Injection Risk</h3>
              <div className="finding-copy"><span>AI Analysis</span><p>Unsanitized user input detected.</p></div>
              <div className="finding-rec"><span>Recommendation</span><p>Use parameterized queries.</p><ArrowRight size={15} /></div>
            </div>
          </div>
          <div className="report-footer"><span><Check size={14} /> VERIFIED ON POLYGON</span><code>0x8f4c...91ab</code></div>
        </FadeIn>
      </div>
    </section>
  );
}

function BlockchainTrust() {
  return (
    <section className="trust-section proof-section" id="trust">
      <div className="trust-art" style={{ backgroundImage: `url(${blockchainImage})` }} />
      <div className="trust-grid" />
      <div className="container trust-layout">
        <FadeIn className="trust-copy">
          <SectionEyebrow>Independent verification</SectionEyebrow>
          <h2>Don't just report<br />security. <em>Prove it.</em></h2>
          <p>Every report and scan result receives a cryptographic fingerprint that can be independently verified without exposing source code or raw findings.</p>
          <a href="#get-started" className="button button-primary">Verify a Report <ArrowRight size={17} /></a>
        </FadeIn>
        <FadeIn className="verification-stage" delay={0.1}>
          <div className="verification-path">
            <div><FileCheck2 size={19} /><span>Security<br />report</span></div><i><b /></i>
            <div><Fingerprint size={19} /><span>SHA-256</span></div><i><b /></i>
            <div><Network size={19} /><span>Polygon</span></div><i><b /></i>
            <div className="path-verified"><CheckCircle2 size={19} /><span>Verified</span></div>
          </div>
          <div className="verification-card">
            <div className="verification-title"><span className="mono-label">Verification status</span><span className="verified-check"><CheckCircle2 size={15} /> Authentic</span></div>
            <div className="verification-data"><span>Network</span><strong>Polygon</strong></div>
            <div className="verification-data"><span>Hash</span><code>8f4c...91ab</code></div>
            <div className="verification-data"><span>Integrity</span><strong className="integrity">100% MATCH</strong></div>
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
      <main className="proof-journey"><Hero /><ValueProposition /><HowItWorks /><SecurityReport /><BlockchainTrust /><FinalCTA /></main>
      <Footer />
    </div>
  );
}
