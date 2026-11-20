/* ==========================================================================
   SECOPS TERMINAL EMULATOR
   Interactive Bash-like Shell for Anis Boulfoul Portfolio
   ========================================================================== */

(function () {
  'use strict';

  // Sound Synthesizer via Web Audio API (Zero external assets needed)
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playKeyClick() {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400 + Math.random() * 200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio not permitted or failed
    }
  }

  function playAlertSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1760, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  }

  const ASCII_BANNER = `
  █████╗ ███╗   ██╗██╗███████╗   ███████╗███████╗ ██████╗ ██████╗ ███████╗
 ██╔══██╗████╗  ██║██║██╔════╝   ██╔════╝██╔════╝██╔════╝██╔═══██╗██╔════╝
 ███████║██╔██╗ ██║██║███████╗   ███████╗█████╗  ██║     ██║   ██║███████╗
 ██╔══██║██║╚██╗██║██║╚════██║   ╚════██║██╔══╝  ██║     ██║   ██║╚════██║
 ██║  ██║██║ ╚████║██║███████║   ███████║███████╗╚██████╗╚██████╔╝███████║
 ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚══════╝   ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝
      [ SYSTEM: SEC-OPS WORKSTATION v2.6.4 ] // [ OPERATOR: ANIS BOULFOUL ]
`;

  const COMMAND_LIST = [
    'help',
    'whoami',
    'about',
    'skills',
    'projects',
    'exp',
    'education',
    'cv',
    'download',
    'contact',
    'siem',
    'scan',
    'matrix',
    'banner',
    'uptime',
    'clear',
    'date',
    'exit'
  ];

  const CV_DATA = {
    name: "Anis Boulfoul",
    role: "Cybersecurity Engineering Student | SOC Analyst Candidate",
    location: "Skikda / Sidi Bel Abbès, Algeria",
    education: "École Supérieure en Informatique (ESI-SBA), 2020 – 2027 (Expected)",
    internship: "SONATRACH, Skikda Complex (Information Systems Dept) - Sep 2025",
    email: "anisboulfoul2@gmail.com",
    github: "https://github.com/anisblf02",
    linkedin: "https://www.linkedin.com/in/anisboulfoul"
  };

  // State
  let history = [];
  let historyIndex = -1;
  let isMatrixRunning = false;

  // DOM Elements
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const soundToggleBtn = document.getElementById('btn-sound-toggle');

  if (!terminalBody || !terminalInput) return;

  // Sound toggle button setup
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundToggleBtn.textContent = soundEnabled ? '🔊 Audio: ON' : '🔇 Audio: OFF';
      soundToggleBtn.title = soundEnabled ? 'Audio feedback enabled' : 'Audio muted';
    });
  }

  // Focus input when clicking anywhere on the terminal window
  terminalBody.addEventListener('click', () => {
    initAudio();
    terminalInput.focus();
  });

  // Print helper
  function printLine(html, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = html;
    terminalBody.insertBefore(line, terminalInput.closest('.terminal-input-row'));
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function printBanner() {
    printLine(`<pre class="terminal-banner">${ASCII_BANNER}</pre>`);
    printLine(`Type <span class="term-cyan">help</span> to view available security commands or click the quick command pills below.`);
    printLine(`--------------------------------------------------------------------------------`);
  }

  // Initial welcome message
  printBanner();

  // Command Implementations
  const COMMANDS = {
    help: () => {
      printLine(`<span class="term-cyan font-bold">AVAILABLE COMMANDS:</span>`);
      printLine(`  <span class="term-green">whoami</span>        - Display operator profile & SOC analyst mission`);
      printLine(`  <span class="term-green">skills</span>        - Technical skills matrix (SIEM, Forensics, DevSecOps)`);
      printLine(`  <span class="term-green">projects</span>      - Practical defensive labs & security research`);
      printLine(`  <span class="term-green">exp</span>           - Industrial cybersecurity internship at SONATRACH`);
      printLine(`  <span class="term-green">education</span>     - ESI-SBA degree, academic track & languages`);
      printLine(`  <span class="term-green">cv</span>            - Summary of curriculum vitae & qualifications`);
      printLine(`  <span class="term-green">download</span>      - Trigger direct download of Anis_Boulfoul_CV.pdf`);
      printLine(`  <span class="term-green">contact</span>       - Communication channels (Email, LinkedIn, GitHub)`);
      printLine(`  <span class="term-cyan">siem</span>          - [SIMULATION] Trigger Zeek + Elastic SIEM alert inspection`);
      printLine(`  <span class="term-cyan">scan</span>          - [AUDIT] Run simulated perimeter vulnerability scan`);
      printLine(`  <span class="term-cyan">matrix</span>        - [EFFECT] Launch green matrix stream`);
      printLine(`  <span class="term-dim">banner</span>        - Reprint the cybersecurity workstation banner`);
      printLine(`  <span class="term-dim">uptime</span>        - Print current node uptime & system load`);
      printLine(`  <span class="term-dim">clear</span>         - Clear the terminal console output`);
    },

    whoami: () => {
      printLine(`<span class="term-cyan font-bold">OPERATOR IDENTITY:</span>`);
      printLine(`  Operator:      ${CV_DATA.name}`);
      printLine(`  Target Role:   ${CV_DATA.role}`);
      printLine(`  Location:      ${CV_DATA.location}`);
      printLine(`  Institution:   ${CV_DATA.education}`);
      printLine(`  Status:        <span class="term-green font-bold">AVAILABLE FOR SOC ANALYST / DEFENSIVE ROLES</span>`);
      printLine(`  Focus:         Hands-on SIEM deployment, Zeek detection, WAF rule tuning, malware triage, automation.`);
    },

    about: () => {
      COMMANDS.whoami();
    },

    skills: () => {
      printLine(`<span class="term-cyan font-bold">TECHNICAL SKILLS RADAR:</span>`);
      printLine(`  <span class="term-green">[Security Operations]</span>  SIEM, Log Analysis, Detection Rules, Network Traffic Analysis, Vulnerability Assessment, Incident Response, Malware Analysis (PE/ELF), Memory Forensics, WAF Tuning`);
      printLine(`  <span class="term-green">[Defensive Tools]</span>      Elastic Stack (Elasticsearch, Kibana, Elastic Agent), Zeek, Wireshark, Nmap, ModSecurity, Burp Suite, YARA, Volatility 3, Ghidra, GDB`);
      printLine(`  <span class="term-green">[Monitoring & Telemetry]</span> Grafana, Prometheus, InfluxDB, Telegraf, NetBox, Ansible, Cron, SNMP`);
      printLine(`  <span class="term-green">[DevSecOps & Cloud]</span>    Docker, Kubernetes, Git, Jenkins, GitLab CI, ArgoCD, Gitleaks, Semgrep`);
      printLine(`  <span class="term-green">[Systems & Infra]</span>      Linux (Debian/Ubuntu/Arch/Alpine), GNS3, OpenStack, ZeroTier, Keycloak, OpenLDAP`);
      printLine(`  <span class="term-green">[Languages]</span>            Python, Bash, SQL, Java, JavaScript`);
    },

    projects: () => {
      printLine(`<span class="term-cyan font-bold">FEATURED DEFENSIVE LABS & SECURITY PROJECTS:</span>`);
      printLine(`  <span class="term-cyan">1. SIEM and Network Detection Lab</span> (Elastic Stack, Kibana, Zeek, KQL)`);
      printLine(`     - Ingested conn, dns, http, and ssl logs via Elastic Agent & Zeek.`);
      printLine(`     - Built KQL dashboards and detection rules to detect malicious network patterns.`);
      printLine(`     - Authored 5 custom Zeek detection scripts for network threats.`);
      printLine(``);
      printLine(`  <span class="term-cyan">2. Network Digital Twin: Monitoring & Automation</span> (Grafana, Prometheus, NetBox, Ansible)`);
      printLine(`     - Team project presented to jury: modeled 18-device GNS3 topology in NetBox.`);
      printLine(`     - Telegraf polling Cisco L3 devices over SNMP every 60s into InfluxDB + Grafana panels.`);
      printLine(`     - 5 Ansible playbooks scheduled via cron for automated backups across 6 targets.`);
      printLine(``);
      printLine(`  <span class="term-cyan">3. Malware Analysis Lab</span> (YARA, GDB, Volatility 3, eBPF)`);
      printLine(`     - Static & dynamic triage of Windows PE and Linux ELF samples.`);
      printLine(`     - Memory dump forensics with Volatility 3 and runtime kernel behavior tracing with eBPF.`);
      printLine(``);
      printLine(`  <span class="term-cyan">4. WAF Rule Engineering</span> (ModSecurity, DVWA, OWASP)`);
      printLine(`     - Custom ModSecurity anomaly rules with false-positive tuning on JWT-authenticated traffic.`);
      printLine(``);
      printLine(`  <span class="term-cyan">5. DevSecOps CI/CD Pipeline</span> (GitLab CI, Gitleaks, Semgrep, Safety)`);
      printLine(`     - Automated pipeline security gates for secret scanning, SAST, and vulnerable dependencies.`);
      printLine(``);
      printLine(`  Type <span class="term-green">download</span> or browse the UI cards above for complete details.`);
    },

    exp: () => {
      printLine(`<span class="term-cyan font-bold">INDUSTRIAL CYBERSECURITY EXPERIENCE:</span>`);
      printLine(`  <span class="term-green">Company:</span>      SONATRACH, Skikda Complex (Information Systems Dept)`);
      printLine(`  <span class="term-green">Role:</span>         Cybersecurity Intern`);
      printLine(`  <span class="term-green">Period:</span>       September 2025 | Skikda, Algeria`);
      printLine(`  <span class="term-green">Environment:</span>  Critical Oil, Gas & Petrochemical Infrastructure (IT & Industrial Control Networks)`);
      printLine(`  <span class="term-cyan">Key Contributions:</span>`);
      printLine(`    * Participated in enterprise vulnerability scanning: planning, execution, false-positive filtering, CVSS ranking.`);
      printLine(`    * Assisted in security configuration audits: firewall rule sets, router/switch ACLs, and secure mgmt access.`);
      printLine(`    * Captured and analyzed network traffic with Wireshark; verified VLAN assignments and network isolation.`);
      printLine(`    * Studied SIEM-based monitoring and SOC incident response workflow (Detection -> Containment -> Eradication -> Recovery).`);
    },

    education: () => {
      printLine(`<span class="term-cyan font-bold">ACADEMIC BACKGROUND & TRAINING:</span>`);
      printLine(`  <span class="term-green">Institution:</span> École Supérieure en Informatique (ESI-SBA)`);
      printLine(`  <span class="term-green">Degree:</span>      State Engineering Degree in Computer Science (Cybersecurity Track)`);
      printLine(`  <span class="term-green">Graduation:</span>  2020 – 2027 (Expected)`);
      printLine(`  <span class="term-green">Languages:</span>   Arabic (Native) | English (C1 Proficient) | French (B2 Professional) | German (A1)`);
      printLine(`  <span class="term-green">Practice:</span>    TryHackMe, HackTheBox, PicoCTF, PortSwigger Web Security Academy`);
    },

    cv: () => {
      printLine(`<span class="term-cyan font-bold">CURRICULUM VITAE SUMMARY:</span>`);
      printLine(`  Name:        Anis Boulfoul`);
      printLine(`  Education:   ESI-SBA Cybersecurity Track (2020 - 2027)`);
      printLine(`  Experience:  SONATRACH Skikda Complex Internship (Sep 2025)`);
      printLine(`  Core Focus:  SOC Operations, SIEM (Elastic), Zeek, Forensics, DevSecOps`);
      printLine(`  PDF File:    <a href="Anis_Boulfoul_CV.pdf" target="_blank" class="term-green underline">Anis_Boulfoul_CV.pdf</a>`);
      printLine(`  Type <span class="term-green">download</span> to save the PDF directly.`);
    },

    download: () => {
      printLine(`<span class="term-cyan">[INITIATING DOWNLOAD]</span> Requesting Anis_Boulfoul_CV.pdf ...`);
      const link = document.createElement('a');
      link.href = 'Anis_Boulfoul_CV.pdf';
      link.download = 'Anis_Boulfoul_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      printLine(`<span class="term-green">[SUCCESS]</span> Download dispatched.`);
    },

    contact: () => {
      printLine(`<span class="term-cyan font-bold">CONTACT & SOCIAL NODES:</span>`);
      printLine(`  Email:    <a href="mailto:anisboulfoul2@gmail.com" class="term-green">anisboulfoul2@gmail.com</a>`);
      printLine(`  LinkedIn: <a href="https://www.linkedin.com/in/anisboulfoul" target="_blank" class="term-green">linkedin.com/in/anisboulfoul</a>`);
      printLine(`  GitHub:   <a href="https://github.com/anisblf02" target="_blank" class="term-green">github.com/anisblf02</a>`);
      printLine(`  Location: Skikda / Sidi Bel Abbès, Algeria`);
    },

    siem: () => {
      playAlertSound();
      printLine(`<span class="term-amber font-bold">[SOC SIEM TELEMETRY INGESTION ACTIVE]</span>`);
      printLine(`<span class="term-dim">Ingesting Zeek conn.log & dns.log from 192.168.10.45 ...</span>`);

      setTimeout(() => {
        printLine(`<span class="term-dim">Parsed: timestamp="2026-11-20T03:14:02Z" proto=udp service=dns id.orig_h=192.168.10.45 id.resp_h=8.8.8.8</span>`);
      }, 300);

      setTimeout(() => {
        printLine(`<span class="term-cyan">Evaluating Detection Rule: [RULE-ID: ELASTIC-SEC-921] DNS Tunneling / DGA Pattern Detected</span>`);
      }, 700);

      setTimeout(() => {
        playAlertSound();
        printLine(`<span class="term-red font-bold">🚨 HIGH SEVERITY ALERT TRIGGERED:</span>`);
        printLine(`   <span class="term-red">Alert:</span> Anomalous entropy in TXT queries to dynamic domain`);
        printLine(`   <span class="term-red">Target:</span> 192.168.10.45 (Workstation-Fin02)`);
        printLine(`   <span class="term-red">Action:</span> Automated IOC quarantine sent to Elastic Agent. Case #SOC-2026-884 opened.`);
        printLine(`   <span class="term-green">[STATUS: CONTAINED BY SOC ANALYST ANIS BOULFOUL]</span>`);
      }, 1200);
    },

    scan: () => {
      printLine(`<span class="term-cyan font-bold">[NMAP PORT AUDIT]</span> Initializing SYN Stealth Scan on target host ...`);
      const ports = [
        { port: '22/tcp', state: 'open', service: 'ssh', version: 'OpenSSH 9.6p1' },
        { port: '80/tcp', state: 'open', service: 'http', version: 'ModSecurity WAF / nginx' },
        { port: '443/tcp', state: 'open', service: 'ssl/https', version: 'TLS 1.3 Strict-Transport' },
        { port: '5601/tcp', state: 'filtered', service: 'kibana', version: 'Elastic SOC Dashboard' },
        { port: '9200/tcp', state: 'filtered', service: 'elasticsearch', version: 'Encrypted Cluster' }
      ];

      ports.forEach((p, idx) => {
        setTimeout(() => {
          printLine(`  <span class="term-green">${p.port.padEnd(10)}</span> <span class="term-bright">${p.state.padEnd(10)}</span> <span class="term-dim">${p.service.padEnd(14)}</span> ${p.version}`);
        }, (idx + 1) * 220);
      });

      setTimeout(() => {
        printLine(`<span class="term-green">[SCAN COMPLETE]</span> 5 services recognized. Defense perimeter hardened.`);
      }, ports.length * 220 + 200);
    },

    matrix: () => {
      if (isMatrixRunning) return;
      isMatrixRunning = true;
      printLine(`<span class="term-green">ENTERING THE MATRIX (Press any key or wait 4s to return)...</span>`);
      
      const matrixChars = "01010110010110101010100101001101010101010101010101010101010101010101010101010101010101010101010101010101";
      const interval = setInterval(() => {
        let str = "";
        for (let i = 0; i < 70; i++) {
          str += matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }
        printLine(`<span style="color: #00ff88; font-family: monospace; letter-spacing: 2px;">${str}</span>`);
      }, 80);

      setTimeout(() => {
        clearInterval(interval);
        isMatrixRunning = false;
        printLine(`<span class="term-cyan">[MATRIX DISCONNECTED] Shell ready.</span>`);
      }, 4000);
    },

    banner: () => {
      printBanner();
    },

    uptime: () => {
      const now = new Date();
      printLine(`secops-host up 142 days, 16:42, 1 user, load average: 0.12, 0.08, 0.05`);
    },

    date: () => {
      printLine(new Date().toUTCString());
    },

    clear: () => {
      const lines = terminalBody.querySelectorAll('.terminal-line');
      lines.forEach(l => l.remove());
    },

    exit: () => {
      printLine(`Session terminated. Restarting interactive shell...`);
      setTimeout(() => {
        COMMANDS.clear();
        printBanner();
      }, 600);
    }
  };

  // Execute command string
  function executeCommand(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Save to history
    history.push(trimmed);
    historyIndex = history.length;

    // Echo input prompt
    printLine(`<span class="terminal-input-prompt">secops@anisblf02:~$</span> <span class="term-bright">${trimmed}</span>`);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Compound command "download cv"
    if (cmd === 'download' && args[0] === 'cv') {
      COMMANDS.download();
      return;
    }

    if (COMMANDS[cmd]) {
      COMMANDS[cmd](args);
    } else {
      printLine(`bash: <span class="term-red">${cmd}</span>: command not found. Type <span class="term-cyan">help</span> for available commands.`);
    }
  }

  // Handle Input Keydown
  terminalInput.addEventListener('keydown', (e) => {
    initAudio();
    playKeyClick();

    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = terminalInput.value.trim().toLowerCase();
      if (current) {
        const matches = COMMAND_LIST.filter(c => c.startsWith(current));
        if (matches.length === 1) {
          terminalInput.value = matches[0];
        } else if (matches.length > 1) {
          printLine(`<span class="term-dim">Possible commands:</span> ${matches.join('  ')}`);
        }
      }
    }
  });

  // Attach quick pill buttons
  document.querySelectorAll('.quick-cmd-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      playKeyClick();
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        terminalInput.focus();
      }
    });
  });

  // Global window terminal command trigger
  window.runTerminalCommand = function (cmdStr) {
    const termSection = document.getElementById('terminal');
    if (termSection) {
      termSection.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      initAudio();
      executeCommand(cmdStr);
      terminalInput.focus();
    }, 400);
  };

})();
