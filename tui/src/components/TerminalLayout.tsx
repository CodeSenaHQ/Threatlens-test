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
  breadcrumb = 'THREATLENSGO',
  step,
  totalSteps,
  statusText = 'READY',
  statusType = 'ready',
  keyHints = '↑↓ navigate · enter select · esc back',
  accentColor = 'cyan',
  children,
}) => {
  const { columns, rows } = useTerminalSize();
  const { targetUrl } = useSecuritySession();

  const width = Math.max(60, columns > 2 ? columns - 2 : 78);
  const height = Math.max(18, rows > 2 ? rows - 1 : 24);

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

  const renderStepDots = () => {
    if (!step || !totalSteps) return null;
    const dots: string[] = [];
    for (let i = 1; i <= totalSteps; i++) {
      dots.push(i <= step ? '●' : '○');
    }
    return `[ ${dots.join(' ')} ]`;
  };

  const dividerLength = Math.max(10, width - 4);

  return (
    <Box
      flexDirection="column"
      width={width}
      height={height}
      paddingX={1}
      justifyContent="space-between"
    >
      {/* Top Header & Content Card */}
      <Box flexDirection="column">
        {/* Top Minimalist Header */}
        <Box flexDirection="row" justifyContent="space-between" marginBottom={1}>
          <Box flexDirection="row">
            <Text bold color="yellow">
              threatlensgo
            </Text>
            <Text color="gray"> › </Text>
            <Text color="white" bold>
              {breadcrumb.toLowerCase()}
            </Text>
          </Box>
          <Box flexDirection="row">
            {targetUrl ? (
              <Text color="gray">
                target › <Text color="cyan" bold>{targetUrl}</Text>
              </Text>
            ) : (
              <Text dimColor color="gray">
                standalone mode
              </Text>
            )}
          </Box>
        </Box>

        {/* Card Box with Content */}
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor="gray"
          paddingX={2}
          paddingY={1}
        >
          {/* Step Counter & Title */}
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
              {'─'.repeat(dividerLength - 4)}
            </Text>
          </Box>

          {/* Child Content */}
          <Box flexDirection="column">
            {children}
          </Box>

          {/* Card Footer Key Hints */}
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
      </Box>

      {/* Bottom OpenCode-Style Statusline */}
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

export default TerminalLayout;
