import React, { useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useNavigation } from '../state/navigation.js';
import { useSecuritySession } from '../state/securitySession.js';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { AnimatedLogo } from '../components/AnimatedLogo.js';
import { AnimatedTip } from '../components/AnimatedTip.js';
import { Select } from '../components/Select.js';

type CommandAction =
  | 'gitAnalysis'
  | 'securityMenu'
  | 'ddos'
  | 'sqli'
  | 'xss'
  | 'exfil'
  | 'rateLimit'
  | 'proxy'
  | 'targetUrl'
  | 'exit';

interface CommandItem {
  label: string;
  value: CommandAction;
}

const COMMANDS: CommandItem[] = [
  {
    label: '1. Git Repository Analysis (Audit public repos for leaked secrets & CVEs)',
    value: 'gitAnalysis',
  },
  {
    label: '2. Security Testing Suite (DDoS, SQLi, XSS, Exfiltration, Rate Limiting)',
    value: 'securityMenu',
  },
  {
    label: '3. DDoS Simulation (Flood, Slowloris, and Burst traffic load tests)',
    value: 'ddos',
  },
  {
    label: '4. SQL Injection (Error-based, Union-based, and Blind delay probes)',
    value: 'sqli',
  },
  {
    label: '5. Cross-Site Scripting (XSS) (Reflected, Stored, and DOM script audits)',
    value: 'xss',
  },
  {
    label: '6. Data Exfiltration (API response & error message leakage scans)',
    value: 'exfil',
  },
  {
    label: '7. Rate Limiting Assessment (Verify 429 threshold enforcement)',
    value: 'rateLimit',
  },
  {
    label: '8. Proxy Interception & Tampering (Inspect and repeat HTTP requests)',
    value: 'proxy',
  },
  {
    label: '9. Configure Target URL (Set active target endpoint for this session)',
    value: 'targetUrl',
  },
  {
    label: '10. Exit ThreatLensGo (Quit terminal application)',
    value: 'exit',
  },
];

export const MainMenu: React.FC = () => {
  const { push } = useNavigation();
  const { exit } = useApp();
  const { targetUrl } = useSecuritySession();
  const { columns, rows } = useTerminalSize();

  const [inputQuery, setInputQuery] = useState('');
  const [showMenu, setShowMenu] = useState(true);

  const isInteractive = Boolean(process.stdin?.isTTY);
  const width = Math.max(60, columns > 2 ? columns - 2 : 78);
  const height = Math.max(18, rows > 2 ? rows - 1 : 24);

  const handleSelect = (item: CommandItem) => {
    if (item.value === 'exit') {
      exit();
      return;
    }
    if (item.value === 'gitAnalysis') {
      push({ type: 'gitAnalysis' });
    } else if (item.value === 'securityMenu') {
      push({ type: 'securityMenu' });
    } else if (item.value === 'ddos') {
      push({ type: 'ddos' });
    } else if (item.value === 'sqli') {
      push({ type: 'sqli' });
    } else if (item.value === 'xss') {
      push({ type: 'xss' });
    } else if (item.value === 'exfil') {
      push({ type: 'exfil' });
    } else if (item.value === 'rateLimit') {
      push({ type: 'rateLimit' });
    } else if (item.value === 'proxy') {
      push({ type: 'proxy' });
    } else if (item.value === 'targetUrl') {
      push({ type: 'targetUrl' });
    }
  };

  const handleInputSubmit = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      setShowMenu(true);
      return;
    }

    if (trimmed.includes('git') || trimmed === '/git') {
      push({ type: 'gitAnalysis' });
    } else if (trimmed.includes('ddos') || trimmed === '/ddos') {
      push({ type: 'ddos' });
    } else if (trimmed.includes('sqli') || trimmed.includes('sql') || trimmed === '/sqli') {
      push({ type: 'sqli' });
    } else if (trimmed.includes('xss') || trimmed === '/xss') {
      push({ type: 'xss' });
    } else if (trimmed.includes('exfil') || trimmed.includes('leak') || trimmed === '/exfil') {
      push({ type: 'exfil' });
    } else if (trimmed.includes('rate') || trimmed === '/ratelimit') {
      push({ type: 'rateLimit' });
    } else if (trimmed.includes('proxy') || trimmed === '/proxy') {
      push({ type: 'proxy' });
    } else if (trimmed.includes('target') || trimmed === '/target') {
      push({ type: 'targetUrl' });
    } else if (trimmed.includes('exit') || trimmed === '/exit' || trimmed === 'quit' || trimmed === ':q') {
      exit();
    } else {
      push({ type: 'securityMenu' });
    }
  };

  useInput(
    (input, key) => {
      if (key.escape) {
        exit();
      } else if (key.tab) {
        setShowMenu((prev) => !prev);
      } else if (input === '/') {
        setShowMenu(true);
      }
    },
    { isActive: isInteractive }
  );

  return (
    <Box
      flexDirection="column"
      width={width}
      height={height}
      paddingX={2}
      justifyContent="space-between"
    >
      {/* Top Section with Animated Logo */}
      <Box flexDirection="column" alignItems="center">
        <AnimatedLogo subtitle="OFFENSIVE SECURITY & VULNERABILITY ASSESSMENT" />
      </Box>

      {/* Center Interactive OpenCode-style Prompt & Menu */}
      <Box flexDirection="column" alignItems="center" flexGrow={1} justifyContent="center">
        {/* OpenCode Prompt Card Box */}
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor="gray"
          paddingX={2}
          paddingY={1}
          width={Math.min(width - 4, 88)}
        >
          {/* Upper Search/Ask line */}
          <Box flexDirection="row" alignItems="center">
            <Box width={3}>
              <Text color="cyan" bold>
                ›
              </Text>
            </Box>
            <Box flexGrow={1}>
              <TextInput
                value={inputQuery}
                onChange={(val) => {
                  setInputQuery(val);
                  if (val.startsWith('/')) setShowMenu(true);
                }}
                onSubmit={handleInputSubmit}
                focus={isInteractive}
                placeholder="Ask anything or type / for commands... &quot;Scan repo or run DDoS attack&quot;"
              />
            </Box>
          </Box>

          {/* Lower Engine & Mode tags */}
          <Box flexDirection="row" marginTop={1} paddingLeft={3}>
            <Text color="cyan" bold>
              Security
            </Text>
            <Text color="gray"> · </Text>
            <Text color="white">ThreatLensGo Engine</Text>
            <Text color="gray"> · </Text>
            <Text color="cyan" bold>by CodeSena</Text>
            <Text color="gray"> </Text>
            <Text dimColor color="gray">
              {targetUrl ? `Target: ${targetUrl}` : 'OpenAudit Zen'}
            </Text>
          </Box>
        </Box>

        {/* Hotkey Pills Bar */}
        <Box flexDirection="row" marginTop={1} justifyContent="center">
          <Text bold color="white">
            tab
          </Text>
          <Text color="gray"> modules  </Text>
          <Text bold color="white">
            /
          </Text>
          <Text color="gray"> commands  </Text>
          <Text bold color="white">
            esc
          </Text>
          <Text color="gray"> exit</Text>
        </Box>

        {/* Select Menu Dropdown (when menu is visible) */}
        {showMenu ? (
          <Box
            flexDirection="column"
            marginTop={1}
            width={Math.min(width - 4, 88)}
            borderStyle="single"
            borderColor="gray"
            paddingX={1}
          >
            <Select
              items={COMMANDS}
              onSelect={handleSelect}
              isFocused={isInteractive}
            />
          </Box>
        ) : null}

        {/* Animated Tip Carousel */}
        <Box marginTop={1}>
          <AnimatedTip />
        </Box>
      </Box>

      {/* Bottom Statusline */}
      <Box flexDirection="row" justifyContent="space-between">
        <Box flexDirection="row">
          <Text dimColor color="gray">
            ThreatLensGo:main
          </Text>
        </Box>
        <Box flexDirection="row">
          <Text dimColor color="gray">
            0.1.0
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export const MainMenuScreen = MainMenu;
export default MainMenu;
