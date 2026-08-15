import React from 'react';
import { Box, Text, useInput } from 'ink';
import { useNavigation } from '../state/navigation.js';
import { useSecuritySession } from '../state/securitySession.js';
import { TerminalLayout } from '../components/TerminalLayout.js';

export const ProxyScreen: React.FC = () => {
  const { pop } = useNavigation();
  const { targetUrl } = useSecuritySession();

  const isInteractive = Boolean(process.stdin?.isTTY);

  useInput(
    (_input, key) => {
      if (key.escape) {
        pop();
      }
    },
    { isActive: isInteractive }
  );

  return (
    <TerminalLayout
      title="Proxy Interception & Tampering"
      subtitle="Inspect live HTTP/S traffic flows, modify headers, and repeat requests"
      breadcrumb="SECURITY > PROXY"
      accentColor="yellow"
      statusText="MODULE UNDER DEVELOPMENT"
      statusType="warning"
      keyHints="esc return to security menu"
    >
      <Box flexDirection="column" marginY={1} paddingLeft={1}>
        <Text color="gray">
          • Active Target: <Text color="cyan" bold>{targetUrl || 'Not configured'}</Text>
        </Text>
        <Box marginTop={1}>
          <Text color="gray">
            This module provides live request interception, header rewriting, and traffic replay mechanisms.
          </Text>
        </Box>
      </Box>
    </TerminalLayout>
  );
};

export default ProxyScreen;
