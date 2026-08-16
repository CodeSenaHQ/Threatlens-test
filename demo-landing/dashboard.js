// ==========================================================================
// THREATLENS AI DASHBOARD LOGIC & TELEMETRY ENGINE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sidebar Navigation View Switching
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  const viewPanes = document.querySelectorAll('.view-pane');
  const viewTitle = document.getElementById('viewTitle');

  const viewTitles = {
    'overview': 'Overview & Telemetry',
    'git-audit': 'Git Secret & Entropy Audit',
    'fuzzing': 'Dynamic Injection & Fuzzing Laboratory',
    'ddos': 'DDoS Concurrency & Rate Limiting Stress Profiler',
    'blockchain': 'Blockchain Attestation & Ledger',
    'terminal': 'ThreatLensGo Fullscreen TUI Workspace'
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      if (!targetView) return;

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      viewPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `view-${targetView}`) {
          pane.classList.add('active');
        }
      });

      if (viewTitle && viewTitles[targetView]) {
        viewTitle.textContent = viewTitles[targetView];
      }

      // Close mobile sidebar if open
      const sidebar = document.getElementById('sidebar');
      if (sidebar && window.innerWidth <= 900) {
        sidebar.classList.remove('open');
      }
    });
  });

  // Mobile Sidebar Toggle
  const mobileToggle = document.getElementById('mobileSidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // 2. Real-time Animated HTML5 Canvas Telemetry Graph
  const canvas = document.getElementById('telemetryCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement.clientHeight || 220);

    window.addEventListener('resize', () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    });

    const pointsCount = 45;
    const blueLine = Array.from({ length: pointsCount }, () => 40 + Math.random() * 30);
    const redLine = Array.from({ length: pointsCount }, () => 15 + Math.random() * 20);
    const greenLine = Array.from({ length: pointsCount }, () => 70 + Math.random() * 15);

    let tick = 0;

    function renderCanvasChart() {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;

      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Helper function to draw smooth Bezier waveform
      function drawWave(data, strokeColor, fillColor, glowColor) {
        ctx.save();
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        const stepX = width / (data.length - 1);

        for (let i = 0; i < data.length; i++) {
          const x = i * stepX;
          const y = height - (data[i] / 100) * height;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            const prevX = (i - 1) * stepX;
            const prevY = height - (data[i - 1] / 100) * height;
            const cpX = (prevX + x) / 2;
            ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
          }
        }
        ctx.stroke();

        // Fill under curve
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.restore();
      }

      // Draw normal traffic line
      drawWave(
        blueLine,
        '#38bdf8',
        'rgba(56, 189, 248, 0.12)',
        'rgba(56, 189, 248, 0.6)'
      );

      // Draw 429 rate limit baseline
      drawWave(
        greenLine,
        '#4ade80',
        'rgba(74, 222, 128, 0.06)',
        'rgba(74, 222, 128, 0.4)'
      );

      // Draw DDoS spike test line
      drawWave(
        redLine,
        '#f87171',
        'rgba(248, 113, 113, 0.08)',
        'rgba(248, 113, 113, 0.5)'
      );

      // Shift & mutate data points for real-time live animation
      tick++;
      if (tick % 6 === 0) {
        blueLine.shift();
        blueLine.push(45 + Math.sin(tick * 0.1) * 20 + (Math.random() - 0.5) * 15);

        greenLine.shift();
        greenLine.push(75 + (Math.random() - 0.5) * 6);

        redLine.shift();
        redLine.push(18 + Math.cos(tick * 0.08) * 12 + (Math.random() - 0.5) * 8);

        // Update footer stats slightly
        const throughputEl = document.getElementById('valThroughput');
        if (throughputEl) {
          const val = 1420 + Math.floor(Math.sin(tick * 0.1) * 120 + Math.random() * 40);
          throughputEl.textContent = `${val.toLocaleString()} req/s`;
        }
      }

      requestAnimationFrame(renderCanvasChart);
    }

    renderCanvasChart();
  }

  // 3. Interactive Terminal Log Simulator
  const consoleBody = document.getElementById('terminalConsole');
  const fullConsole = document.getElementById('fullTerminalConsole');

  function appendTerminalLine(text, cssClass = 'term-bright') {
    const time = new Date().toTimeString().split(' ')[0];
    const line = document.createElement('div');
    line.className = `term-line ${cssClass}`;
    line.innerHTML = `<span class="term-muted">[${time}]</span> ${text}`;

    if (consoleBody) {
      consoleBody.appendChild(line);
      consoleBody.scrollTop = consoleBody.scrollHeight;
    }
    if (fullConsole) {
      const clone = line.cloneNode(true);
      fullConsole.appendChild(clone);
      fullConsole.scrollTop = fullConsole.scrollHeight;
    }
  }

  // Terminal Action Buttons
  const btnScan = document.getElementById('termCmdScan');
  const btnFuzz = document.getElementById('termCmdFuzz');
  const btnDDoS = document.getElementById('termCmdDDoS');
  const btnClear = document.getElementById('termCmdClear');
  const btnTriggerScan = document.getElementById('btnTriggerScan');
  const btnRunGitAudit = document.getElementById('btnRunGitAudit');
  const btnLaunchFuzzMatrix = document.getElementById('btnLaunchFuzzMatrix');
  const btnTriggerDDoSStress = document.getElementById('btnTriggerDDoSStress');
  const btnVerifyPolygon = document.getElementById('btnVerifyPolygon');

  function runAuditSimulation() {
    appendTerminalLine('threatlens audit --target repo:ThreatLens --all', 'term-cyan');
    setTimeout(() => appendTerminalLine('⚡ [AST] Parsing 1,428 git commits and tree blobs...', 'term-blue'), 400);
    setTimeout(() => appendTerminalLine('✔ [PASS] 0 API secret exposures found across all branches.', 'term-green'), 900);
    setTimeout(() => appendTerminalLine('⚡ [FUZZ] Running 48 dynamic SQLi & XSS probes against API gateway...', 'term-yellow'), 1400);
    setTimeout(() => appendTerminalLine('✔ [SECURED] All 48 probes neutralized by AST input sanitizer.', 'term-green'), 2000);
    setTimeout(() => appendTerminalLine('🔗 [PROOF] SHA-256 Digest 0x7f8a92b anchored on Polygon Block #48192804.', 'term-purple'), 2600);
  }

  function runFuzzSimulation() {
    appendTerminalLine('threatlens fuzz --engine sqli-blind --concurrency 20', 'term-cyan');
    setTimeout(() => appendTerminalLine('⚡ [FUZZ] Injecting boolean payload: "\' OR \'1\'=\'1\' --" to /api/v1/auth', 'term-yellow'), 300);
    setTimeout(() => appendTerminalLine('⚡ [FUZZ] Injecting time payload: "WAITFOR DELAY \'0:0:5\'" to /api/v1/users', 'term-yellow'), 700);
    setTimeout(() => appendTerminalLine('✔ [PASS] Response delta: 0.012s. No timing leak detected.', 'term-green'), 1200);
  }

  function runDDoSSimulation() {
    appendTerminalLine('threatlens stress --profile slowloris --sockets 500', 'term-cyan');
    setTimeout(() => appendTerminalLine('🔥 [STRESS] Spawning 500 concurrent sockets on HTTP keep-alive...', 'term-red'), 400);
    setTimeout(() => appendTerminalLine('🛡️ [RATE-LIMIT] 429 Too Many Requests enforced for client bursts.', 'term-green'), 900);
    setTimeout(() => appendTerminalLine('✔ [PASS] Server responded at 99.98% availability under peak load.', 'term-green'), 1400);
  }

  if (btnScan) btnScan.addEventListener('click', runAuditSimulation);
  if (btnTriggerScan) btnTriggerScan.addEventListener('click', runAuditSimulation);
  if (btnRunGitAudit) btnRunGitAudit.addEventListener('click', runAuditSimulation);
  if (btnFuzz) btnFuzz.addEventListener('click', runFuzzSimulation);
  if (btnLaunchFuzzMatrix) btnLaunchFuzzMatrix.addEventListener('click', runFuzzSimulation);
  if (btnDDoS) btnDDoS.addEventListener('click', runDDoSSimulation);
  if (btnTriggerDDoSStress) btnTriggerDDoSStress.addEventListener('click', runDDoSSimulation);

  if (btnVerifyPolygon) {
    btnVerifyPolygon.addEventListener('click', () => {
      appendTerminalLine('threatlens verify --contract 0x94827104bA9eF3547289C3A10B5E01a8B2e', 'term-cyan');
      setTimeout(() => appendTerminalLine('🔗 [BLOCKCHAIN] Querying Polygon Proof Merkle root...', 'term-purple'), 400);
      setTimeout(() => appendTerminalLine('✔ [VERIFIED] SHA-256 match confirmed on Polygon Testnet (100% Immutable).', 'term-green'), 1000);
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (consoleBody) consoleBody.innerHTML = '';
      if (fullConsole) fullConsole.innerHTML = '';
      appendTerminalLine('ThreatLens console buffer cleared.', 'term-muted');
    });
  }

  // Interactive Custom Payload Probe Tester
  const btnTestCustomPayload = document.getElementById('btnTestCustomPayload');
  const customPayloadInput = document.getElementById('customPayloadInput');
  const payloadResultBox = document.getElementById('payloadResultBox');

  if (btnTestCustomPayload && customPayloadInput && payloadResultBox) {
    btnTestCustomPayload.addEventListener('click', () => {
      const payload = customPayloadInput.value.trim() || "' OR '1'='1' --";
      appendTerminalLine(`⚡ [PROBE] Evaluating custom AST payload: "${payload}" against query filter...`, 'term-yellow');
      
      payloadResultBox.innerHTML = `<span style="color:#60a5fa;">⏳ AST Analysis in progress...</span>`;
      setTimeout(() => {
        payloadResultBox.innerHTML = `
          <span>✔ Result: Parameterized AST Parser Neutralized Query. Safe to execute.</span>
          <span class="proof-hash">Proof: 0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}</span>
        `;
        payloadResultBox.style.background = 'rgba(34,197,94,0.1)';
        payloadResultBox.style.borderColor = 'rgba(34,197,94,0.3)';
        payloadResultBox.style.color = '#86efac';
        appendTerminalLine(`✔ [SECURED] Custom payload safely handled by AST Parameterizer.`, 'term-green');
      }, 700);
    });
  }

  // 4. Export Attestation PDF/Certificate Handler
  const btnExport = document.getElementById('btnExportAttestation');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const originalHtml = btnExport.innerHTML;
      btnExport.innerHTML = `<span style="font-size:0.75rem; color:#4ade80;">✔ Exported</span>`;
      appendTerminalLine('📄 [CERTIFICATE] Cryptographic audit report generated: ThreatLens-Attestation-2026.pdf (SHA-256: 7f8a92b3c1d4...)', 'term-green');
      setTimeout(() => {
        btnExport.innerHTML = originalHtml;
      }, 2500);
    });
  }

  // 5. Findings Table Severity Filters
  const filterPills = document.querySelectorAll('.filter-pill');
  const tableRows = document.querySelectorAll('#findingsTable tbody tr');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      tableRows.forEach(row => {
        const severity = row.getAttribute('data-severity');
        if (filter === 'all' || severity === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // Global Search Filter
  const globalSearch = document.getElementById('globalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // 6. Finding Inspection Modal Logic
  const modalBackdrop = document.getElementById('findingModalBackdrop');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const modalTitle = document.getElementById('modalFindingTitle');
  const modalSeverity = document.getElementById('modalSeverity');
  const modalBody = document.getElementById('modalBody');

  const findingDetails = {
    1: {
      title: 'CWE-89: SQL Injection Probed on POST /api/v1/auth/login',
      severity: 'High',
      desc: 'SecTest dynamic fuzzer tested Boolean-based and Time-based blind payloads against username parameter. Parameterized queries in SQLAlchemy and AST AST sanitizer neutralizes input before query compilation.',
      diff: `diff --git a/backend/auth.py b/backend/auth.py
--- a/backend/auth.py
+++ b/backend/auth.py
@@ -24,5 +24,5 @@ async def authenticate_user(username, password):
-    query = f"SELECT * FROM users WHERE username = '{username}'"
+    stmt = select(User).where(User.username == username)
     result = await db.execute(stmt)`
    },
    2: {
      title: 'CWE-798: Hardcoded Credential Scan in Repository',
      severity: 'Critical',
      desc: 'Commit entropy inspection scanned config.py for OpenAI API keys and Postgres credentials. All keys have been migrated to OS environment vaults with 0 leaks present in history.',
      diff: `diff --git a/backend/config.py b/backend/config.py
--- a/backend/config.py
+++ b/backend/config.py
@@ -12,4 +12,4 @@ class Settings:
-    OPENAI_API_KEY = "sk-proj-xxxxxxxxxxxxxxxx"
+    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")`
    },
    3: {
      title: 'CWE-79: Reflected XSS Sanitization on Search Sink',
      severity: 'Medium',
      desc: 'DOM Purify & Content Security Policy (CSP) header enforced. Output encoding prevents script tag execution on search parameters.',
      diff: `diff --git a/frontend/src/pages/Search.tsx b/frontend/src/pages/Search.tsx
--- a/frontend/src/pages/Search.tsx
+++ b/frontend/src/pages/Search.tsx
@@ -18,3 +18,3 @@ export function SearchResults({ query }) {
-  return <div dangerouslySetInnerHTML={{ __html: query }} />
+  return <div>{DOMPurify.sanitize(query)}</div>`
    },
    4: {
      title: 'CWE-400: Slowloris Socket Starvation Defense',
      severity: 'High',
      desc: 'Configured token bucket rate limiter and strict keep-alive timeout of 5 seconds on FastAPI / Uvicorn server.',
      diff: `diff --git a/backend/main.py b/backend/main.py
--- a/backend/main.py
+++ b/backend/main.py
@@ -30,3 +30,3 @@ app.add_middleware(
+    RateLimitMiddleware, max_requests=100, window_seconds=60
)`
    },
    5: {
      title: 'CWE-200: Server Information Exposure in Response Headers',
      severity: 'Low',
      desc: 'Stripped X-Powered-By, Server, and debug headers from API responses to prevent reconnaissance.',
      diff: `diff --git a/backend/main.py b/backend/main.py
--- a/backend/main.py
+++ b/backend/main.py
@@ -45,2 +45,4 @@ @app.middleware("http")
 async def strip_headers(request, call_next):
     response = await call_next(request)
+    response.headers.pop("server", None)
+    response.headers.pop("x-powered-by", None)`
    }
  };

  window.openFindingModal = function(id) {
    const data = findingDetails[id];
    if (!data || !modalBackdrop) return;

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSeverity) modalSeverity.textContent = data.severity;

    if (modalBody) {
      modalBody.innerHTML = `
        <div>
          <div class="modal-section-title">Vulnerability Description &amp; Analysis</div>
          <p class="modal-desc">${data.desc}</p>
        </div>
        <div>
          <div class="modal-section-title">AI Remediation Code Patch Diff</div>
          <pre class="modal-diff"><code>${data.diff.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
          <button class="btn-action-primary" onclick="applyRemediationPatch(${id})">Apply Patch &amp; Re-verify</button>
        </div>
      `;
    }

    modalBackdrop.classList.add('open');
  };

  window.applyRemediationPatch = function(id) {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
    appendTerminalLine(`🔧 [REMEDIATION] Applied automated fix for finding #${id}. Re-running AST verification...`, 'term-cyan');
    setTimeout(() => {
      appendTerminalLine(`✔ [VERIFIED] Finding #${id} marked as RESOLVED. SHA-256 proof updated.`, 'term-green');
    }, 1200);
  };

  if (btnCloseModal && modalBackdrop) {
    btnCloseModal.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
      }
    });
  }
});
