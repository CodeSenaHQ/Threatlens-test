import React from 'react';
import { Box, Text } from 'ink';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { useSecuritySession } from '../state/securitySession.js';

export interface TerminalLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  step?: number;
  totalSteps?: number;
  statusText?: string;
  statusType?: 'ready' | 'success' | 'warning' | 'error';
  keyHints?: string;
  accentColor?: string;
  children: React.ReactNode;
}

export const TerminalLayout: React.FC<TerminalLayoutProps> = ({
  title,
  subtitle,
  breadcrumb = 'THREATLENS',
  step,
  totalSteps,
  statusText = 'READY',
  statusType = 'ready',
  keyHints = '↑↓ navigate · enter select · esc back',
  accentColor = 'cyan',
  children,
}) => {
  const { columns } = useTerminalSize();
  const { targetUrl } = useSecuritySession();

  // Keep width well-proportioned: between 72 and 100 columns for maximum readability
  const width = Math.min(Math.max(72, columns > 4 ? columns - 2 : 78), 104);

  const getStatusColor = () => {
    switch (statusType) {
      case 'success':
        return 'green';
      case 'error':
        return 'red';
      case 'warning':
        return 'yellow';
      case 'ready':
      default:
        return 'cyan';
    }
  };

  // Render step progress dots e.g. [● ● ○]
  const renderStepDots = () => {
    if (!step || !totalSteps) return null;
    const dots: string[] = [];
    for (let i = 1; i <= totalSteps; i++) {
      dots.push(i <= step ? '●' : '○');
    }
    return `[ ${dots.join(' ')} ]`;
  };

  return (
    <Box flexDirection="column" width={width} borderStyle="round" borderColor="gray" paddingX={2} paddingY={1}>
      {/* Top Header Bar */}
      <Box flexDirection="row" justifyContent="space-between" marginBottom={1}>
        <Box flexDirection="row">
          <Text bold color="yellow">
            ◈ THREATLENS
          </Text>
          <Text color="gray"> │ </Text>
          <Text color="gray" bold>
            {breadcrumb.toUpperCase()}
          </Text>
        </Box>
        <Box flexDirection="row">
          {targetUrl ? (
            <Text color="gray">
              TARGET › <Text color="cyan" bold>{targetUrl}</Text>
            </Text>
          ) : (
            <Text dimColor color="gray">
              SECURITY AUDIT TUI
            </Text>
          )}
        </Box>
      </Box>

      {/* Screen Title & Subtitle Area */}
      <Box flexDirection="column" marginBottom={1}>
        {step && totalSteps ? (
          <Box flexDirection="row" marginBottom={0}>
            <Text color="yellow" bold>
              ● STEP {step} OF {totalSteps}
            </Text>
            <Text color="gray">  {renderStepDots()}</Text>
          </Box>
        ) : null}

        <Text bold color={accentColor}>
          {title}
        </Text>
        {subtitle ? (
          <Text color="gray">{subtitle}</Text>
        ) : null}
      </Box>

      {/* Divider */}
      <Box marginBottom={1}>
        <Text dimColor color="gray">
          {'─'.repeat(Math.max(10, width - 6))}
        </Text>
      </Box>

      {/* Main Content Area */}
      <Box flexDirection="column" marginY={0}>
        {children}
      </Box>

      {/* Bottom Divider */}
      <Box marginTop={1}>
        <Text dimColor color="gray">
          {'─'.repeat(Math.max(10, width - 6))}
        </Text>
      </Box>

      {/* Footer Status & Keymap */}
      <Box flexDirection="row" justifyContent="space-between" marginTop={1}>
        <Box flexDirection="row">
          <Text color={getStatusColor()} bold>
            ● {statusText.toUpperCase()}
          </Text>
        </Box>
        <Box flexDirection="row">
          <Text dimColor color="gray">
            {keyHints}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default TerminalLayout;
