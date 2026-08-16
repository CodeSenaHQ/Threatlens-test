// ==========================================================================
// THREATLENS AI INTERACTIVE BEHAVIORS & MICRO-INTERACTIONS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Blur on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Security Feature Pillar Tabs Interactive Switcher
  const pillarCards = document.querySelectorAll('.pillar-card');
  const wfDiagram = document.querySelector('.workflow-diagram');

  const tabDiagrams = {
    workflow: `
      <div class="wf-column">
        <div class="wf-node"><span class="wf-tag">Target Setup</span><span class="wf-title">Git Commit / URL</span></div>
        <div class="wf-node"><span class="wf-tag">Auth Bridge</span><span class="wf-title">OAuth SSO Device</span></div>
      </div>
      <div class="wf-connector"><div class="wf-line"></div></div>
      <div class="wf-center-core">
        <div class="core-halo"></div>
        <div class="core-symbol">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <span class="core-label">ThreatLens Orchestrator</span>
      </div>
      <div class="wf-connector"><div class="wf-line"></div></div>
      <div class="wf-column">
        <div class="wf-node"><span class="wf-tag tag-shield">Fuzz Matrix</span><span class="wf-title">SecTest Scanner</span></div>
        <div class="wf-node"><span class="wf-tag tag-success">Proof Output</span><span class="wf-title">Attestation Certificate</span></div>
      </div>
    `,
    monitoring: `
      <div class="wf-column">
        <div class="wf-node"><span class="wf-tag">Payload Pool</span><span class="wf-title">SQLi / XSS Matrix</span></div>
        <div class="wf-node"><span class="wf-tag">Blind Probes</span><span class="wf-title">Timing Differentials</span></div>
      </div>
      <div class="wf-connector"><div class="wf-line"></div></div>
      <div class="wf-center-core">
        <div class="core-halo" style="background: radial-gradient(circle, rgba(56, 189, 248, 0.6) 0%, transparent 70%);"></div>
        <div class="core-symbol" style="background: linear-gradient(135deg, #0284c7, #0369a1);">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <ellipse cx="12" cy="5" rx="9" ry="3"/>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
          </svg>
        </div>
        <span class="core-label">Dynamic Fuzzing Engine</span>
      </div>
      <div class="wf-connector"><div class="wf-line"></div></div>
      <div class="wf-column">
        <div class="wf-node"><span class="wf-tag tag-shield">DOM Sink Trace</span><span class="wf-title">Reflected &amp; Stored</span></div>
        <div class="wf-node"><span class="wf-tag tag-success">Sanitization</span><span class="wf-title">Remediation Snippet</span></div>
      </div>
    `,
    governance: `
      <div class="wf-column">
        <div class="wf-node"><span class="wf-tag">Traffic Burst</span><span class="wf-title">Flood Simulation</span></div>
        <div class="wf-node"><span class="wf-tag">Socket Exhaust</span><span class="wf-title">Slowloris Profile</span></div>
      </div>
      <div class="wf-connector"><div class="wf-line"></div></div>
      <div class="wf-center-core">
        <div class="core-halo" style="background: radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, transparent 70%);"></div>
        <div class="core-symbol" style="background: linear-gradient(135deg, #dc2626, #b91c1c);">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <span class="core-label">Stress Testing Suite</span>
      </div>
      <div class="wf-connector"><div class="wf-line"></div></div>
      <div class="wf-column">
        <div class="wf-node"><span class="wf-tag tag-shield">Rate Limiting</span><span class="wf-title">429 HTTP Enforce</span></div>
        <div class="wf-node"><span class="wf-tag tag-success">Resilience</span><span class="wf-title">99.9% Uptime Verified</span></div>
      </div>
    `,
    registry: `
      <div class="wf-column">
        <div class="wf-node"><span class="wf-tag">Raw Findings</span><span class="wf-title">CVE &amp; CWE Reports</span></div>
        <div class="wf-node"><span class="wf-tag">Digest Hash</span><span class="wf-title">SHA-256 Checksum</span></div>
      </div>
      <div class="wf-connector"><div class="wf-line"></div></div>
      <div class="wf-center-core">
        <div class="core-halo" style="background: radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, transparent 70%);"></div>
        <div class="core-symbol" style="background: linear-gradient(135deg, #16a34a, #15803d);">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <span class="core-label">Blockchain Attestation</span>
      </div>
      <div class="wf-connector"><div class="wf-line"></div></div>
      <div class="wf-column">
        <div class="wf-node"><span class="wf-tag tag-success">On-Chain Anchor</span><span class="wf-title">Polygon Proof</span></div>
        <div class="wf-node"><span class="wf-tag">Audit Certificate</span><span class="wf-title">Tamper-Proof Report</span></div>
      </div>
    `
  };

  pillarCards.forEach(card => {
    card.addEventListener('click', () => {
      pillarCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const tabKey = card.getAttribute('data-tab');
      if (tabDiagrams[tabKey] && wfDiagram) {
        wfDiagram.style.opacity = '0';
        setTimeout(() => {
          wfDiagram.innerHTML = tabDiagrams[tabKey];
          wfDiagram.style.opacity = '1';
        }, 150);
      }
    });
  });

  // 3. Smooth scrolling for internal anchor tags
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 4. Subtle mouse parallax for ambient glow & command card
  const heroCard = document.querySelector('.command-card');
  const ambientGlow = document.querySelector('.glow-center');
  
  if (window.innerWidth > 768 && heroCard) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      
      heroCard.style.transform = `perspective(1000px) rotateY(${x * 0.4}deg) rotateX(${-y * 0.4}deg) translateY(-2px)`;
      if (ambientGlow) {
        ambientGlow.style.transform = `translateX(calc(-50% + ${x * 1.5}px)) translateY(${y * 1.5}px)`;
      }
    });

    document.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // 5. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(5, 8, 16, 0.95)';
        navLinks.style.padding = '24px';
        navLinks.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        navLinks.style.backdropFilter = 'blur(20px)';
      }
    });
  }
});
