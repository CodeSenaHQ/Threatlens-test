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
  | 'agentChat'
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
  shortcut?: string;
}

const COMMANDS: CommandItem[] = [
  {
    label: '0. 🤖 ThreatLens Agent (Interactive Codebase Intelligence & Auto-Patching)',
    value: 'agentChat',
    shortcut: '0',
  },
  {
    label: '1. Git Repository Analysis (Audit public repos for leaked secrets & CVEs)',
    value: 'gitAnalysis',
    shortcut: '1',
  },
  {
    label: '2. Security Testing Suite (DDoS, SQLi, XSS, Exfiltration, Rate Limiting)',
    value: 'securityMenu',
    shortcut: '2',
  },
  {
    label: '3. DDoS Simulation (Flood, Slowloris, and Burst traffic load tests)',
    value: 'ddos',
    shortcut: '3',
  },
  {
    label: '4. SQL Injection (Error-based, Union-based, and Blind delay probes)',
    value: 'sqli',
    shortcut: '4',
  },
  {
    label: '5. Cross-Site Scripting (XSS) (Reflected, Stored, and DOM script audits)',
    value: 'xss',
    shortcut: '5',
  },
  {
    label: '6. Data Exfiltration (API response & error message leakage scans)',
    value: 'exfil',
    shortcut: '6',
  },
  {
    label: '7. Rate Limiting Assessment (Verify 429 threshold enforcement)',
    value: 'rateLimit',
    shortcut: '7',
  },
  {
    label: '8. Proxy Interception & Tampering (Inspect and repeat HTTP requests)',
    value: 'proxy',
    shortcut: '8',
  },
  {
    label: '9. Configure Target URL (Set active target endpoint for this session)',
    value: 'targetUrl',
    shortcut: '9',
  },
  {
    label: '10. Exit ThreatLensGo (Quit terminal application)',
    value: 'exit',
    shortcut: 'q',
  },
];

export const MainMenu: React.FC = () => {
  const { push } = useNavigation();
  const { exit } = useApp();
  const { targetUrl } = useSecuritySession();
  const { columns } = useTerminalSize();

  const [inputQuery, setInputQuery] = useState('');
  const [focusMode, setFocusMode] = useState<'menu' | 'input'>('menu');

  const width = Math.max(60, columns > 2 ? columns - 2 : 78);

  const handleSelect = (item: CommandItem) => {
    if (item.value === 'exit') {
      exit();
      return;
    }
    if (item.value === 'agentChat') {
      push({ type: 'agentChat' });
    } else if (item.value === 'gitAnalysis') {
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
      setFocusMode('menu');
      return;
    }

    if (trimmed.includes('agent') || trimmed === '/agent' || trimmed.startsWith('fix') || trimmed.startsWith('audit') || trimmed.startsWith('search')) {
      push({ type: 'agentChat', initialPrompt: value.trim() });
    } else if (trimmed.includes('git') || trimmed === '/git') {
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
      push({ type: 'agentChat', initialPrompt: value.trim() });
    }
  };

  useInput(
    (input, key) => {
      if (key.escape) {
        if (focusMode === 'input') {
          setFocusMode('menu');
        } else {
          exit();
        }
      } else if (key.tab) {
        setFocusMode((prev) => (prev === 'menu' ? 'input' : 'menu'));
      } else if (focusMode === 'menu') {
        // Direct single-key shortcuts when menu is active
        if (input === '0') {
          handleSelect(COMMANDS[0]);
        } else if (input === '1') {
          handleSelect(COMMANDS[1]);
        } else if (input === '2') {
          handleSelect(COMMANDS[2]);
        } else if (input === '3') {
          handleSelect(COMMANDS[3]);
        } else if (input === '4') {
          handleSelect(COMMANDS[4]);
        } else if (input === '5') {
          handleSelect(COMMANDS[5]);
        } else if (input === '6') {
          handleSelect(COMMANDS[6]);
        } else if (input === '7') {
          handleSelect(COMMANDS[7]);
        } else if (input === '8') {
          handleSelect(COMMANDS[8]);
        } else if (input === '9') {
          handleSelect(COMMANDS[9]);
        } else if (input === 'q') {
          exit();
        } else if (input === '/' || input === ':') {
          setFocusMode('input');
        }
      }
    },
    { isActive: true }
  );

  return (
    <Box
      flexDirection="column"
      width={width}
      paddingX={2}
      marginY={1}
    >
      {/* Top Section with Animated Logo */}
      <Box flexDirection="column" alignItems="center">
        <AnimatedLogo subtitle="OFFENSIVE SECURITY & VULNERABILITY ASSESSMENT" />
      </Box>

      {/* Center Interactive OpenCode-style Prompt & Menu */}
      <Box flexDirection="column" alignItems="center" marginY={1}>
        {/* OpenCode Prompt Card Box */}
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor={focusMode === 'input' ? 'cyan' : 'gray'}
          paddingX={2}
          paddingY={1}
          width={Math.min(width - 4, 88)}
        >
          {/* Upper Search/Ask line */}
          <Box flexDirection="row" alignItems="center">
            <Box width={3}>
              <Text color={focusMode === 'input' ? 'cyan' : 'gray'} bold>
                ›
              </Text>
            </Box>
            <Box flexGrow={1}>
              <TextInput
                value={inputQuery}
                onChange={(val) => {
                  setInputQuery(val);
                  setFocusMode('input');
                }}
                onSubmit={handleInputSubmit}
                focus={focusMode === 'input'}
                placeholder={focusMode === 'input' ? "Type query & press enter (e.g. 'audit /api/search')..." : "Press Tab or / to type custom agent query, or press 0-9 to select"}
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
          <Text bold color="yellow">
            0-9
          </Text>
          <Text color="gray"> instant pick · </Text>
          <Text bold color="white">
            tab
          </Text>
          <Text color="gray"> switch mode · </Text>
          <Text bold color="white">
            ↑↓/enter
          </Text>
          <Text color="gray"> select · </Text>
          <Text bold color="white">
            esc
          </Text>
          <Text color="gray"> exit</Text>
        </Box>

        {/* Select Menu Dropdown */}
        <Box
          flexDirection="column"
          marginTop={1}
          width={Math.min(width - 4, 88)}
          borderStyle="single"
          borderColor={focusMode === 'menu' ? 'yellow' : 'gray'}
          paddingX={1}
        >
          <Select
            items={COMMANDS}
            onSelect={handleSelect}
            isFocused={focusMode === 'menu'}
          />
        </Box>

        {/* Animated Tip Carousel */}
        <Box marginTop={1}>
          <AnimatedTip />
        </Box>
      </Box>

      {/* Bottom Statusline */}
      <Box flexDirection="row" justifyContent="space-between" marginTop={1}>
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

