import React from 'react';
import { Box, Text } from 'ink';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { useSecuritySession } from '../state/securitySession.js';

export interface TerminalLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  statusText?: string;
  statusType?: 'ready' | 'success' | 'warning' | 'error';
  keyHints?: string;
  borderColor?: string;
  children: React.ReactNode;
}

export const TerminalLayout: React.FC<TerminalLayoutProps> = ({
  title,
  subtitle,
  breadcrumb = 'THREATLENS',
  statusText = 'READY',
  statusType = 'ready',
  keyHints = '[Enter] Select  •  [Esc] Back',
  borderColor = 'cyan',
  children,
}) => {
  const { columns, rows } = useTerminalSize();
  const { targetUrl } = useSecuritySession();

  const width = Math.max(70, columns > 4 ? columns - 2 : 78);
  const minBodyHeight = Math.max(10, rows - 9);

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

  return (
    <Box flexDirection="column" width={width}>
      {/* Top Header Bar */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        borderStyle="single"
        borderColor="gray"
        paddingX={1}
      >
        <Box flexDirection="row">
          <Text bold color="cyan">
            ◈ THREATLENS ◈{' '}
          </Text>
          <Text color="gray">|</Text>
          <Text color="white" bold>
            {' '}{breadcrumb.toUpperCase()}
          </Text>
        </Box>
        <Box flexDirection="row">
          {targetUrl ? (
            <Text color="yellow">
              TARGET: <Text color="white" bold>{targetUrl}</Text>
            </Text>
          ) : (
            <Text dimColor color="gray">
              SESSION: STANDALONE
            </Text>
          )}
        </Box>
      </Box>

      {/* Main Content Card Container */}
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={borderColor}
        paddingX={2}
        paddingY={1}
        minHeight={minBodyHeight}
      >
        {/* Screen Title & Subtitle */}
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color={borderColor}>
            {title}
          </Text>
          {subtitle ? (
            <Text color="gray">{subtitle}</Text>
          ) : null}
        </Box>

        {/* Child Screen Content */}
        <Box flexDirection="column" flexGrow={1}>
          {children}
        </Box>
      </Box>

      {/* Bottom Status & Keymap Bar */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        borderStyle="single"
        borderColor="gray"
        paddingX={1}
      >
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
