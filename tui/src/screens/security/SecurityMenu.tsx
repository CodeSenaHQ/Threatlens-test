import React from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useNavigation, Screen } from '../../state/navigation.js';
import { useSecuritySession } from '../../state/securitySession.js';
import { TargetUrlScreen } from './TargetUrlScreen.js';

type SecurityOptionValue = 'ddos' | 'sqli' | 'xss' | 'exfil' | 'rateLimit' | 'proxy';

interface SecurityMenuItem {
  label: string;
  value: SecurityOptionValue;
}

const securityOptions: SecurityMenuItem[] = [
  {
    label: '1. DDoS Testing',
    value: 'ddos',
  },
  {
    label: '2. SQL Injection',
    value: 'sqli',
  },
  {
    label: '3. Cross-Site Scripting (XSS)',
    value: 'xss',
  },
  {
    label: '4. Data Exfiltration',
    value: 'exfil',
  },
  {
    label: '5. Rate Limiting',
    value: 'rateLimit',
  },
  {
    label: '6. Proxy Analysis',
    value: 'proxy',
  },
];

export const SecurityMenu: React.FC = () => {
  const { push, pop } = useNavigation();
  const { targetUrl, clearTargetUrl } = useSecuritySession();

  const isInteractive = Boolean(process.stdin?.isTTY);

  // If no target URL has been specified for this session, prompt for it first
  if (!targetUrl) {
    return <TargetUrlScreen />;
  }

  const handleSelect = (item: SecurityMenuItem) => {
    switch (item.value) {
      case 'ddos':
        push({ type: 'ddos' });
        break;
      case 'sqli':
        push({ type: 'sqli' });
        break;
      case 'xss':
        push({ type: 'xss' });
        break;
      case 'exfil':
        push({ type: 'exfil' });
        break;
      case 'rateLimit':
        push({ type: 'rateLimit' });
        break;
      case 'proxy':
        push({ type: 'proxy' });
        break;
    }
  };

  useInput(
    (_input, key) => {
      if (key.escape) {
        clearTargetUrl();
        pop();
      }
    },
    { isActive: isInteractive }
  );

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} borderStyle="round" borderColor="magenta" width={68}>
      <Box marginBottom={1} flexDirection="column">
        <Text bold color="magenta">
          Security Testing Suite
        </Text>
        <Box flexDirection="row" marginTop={0}>
          <Text dimColor color="gray">
            Target URL: {targetUrl}
          </Text>
        </Box>
      </Box>

      <Box marginY={1} flexDirection="column">
        <SelectInput
          items={securityOptions}
          onSelect={handleSelect}
          isFocused={isInteractive}
        />
      </Box>

      <Box marginTop={1}>
        <Text dimColor color="gray">
          ↑/↓ to navigate, Enter to select, Esc to return to Main Menu
        </Text>
      </Box>
    </Box>
  );
};

export const SecurityMenuScreen = SecurityMenu;
export default SecurityMenu;
