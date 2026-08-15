import React from 'react';
import { Box, Text, useInput } from 'ink';
import { useNavigation } from '../state/navigation.js';
import { useSecuritySession } from '../state/securitySession.js';
import { TerminalLayout } from '../components/TerminalLayout.js';

export const RateLimitScreen: React.FC = () => {
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
      title="Rate Limiting Assessment"
      subtitle="Verify endpoint throttling thresholds, burst capacities, and 429 response enforcement"
      breadcrumb="SECURITY > RATE LIMIT"
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
            This module evaluates API threshold policies, token-bucket implementations, and HTTP 429 response rate limits.
          </Text>
        </Box>
      </Box>
    </TerminalLayout>
  );
};

export default RateLimitScreen;
