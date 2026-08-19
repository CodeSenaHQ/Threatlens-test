import React, { useMemo } from 'react';
import { Box, Text } from 'ink';

const TIPS = [
  'Press 0 to launch the autonomous AI ThreatLens security agent',
  'Run /git to audit public repositories for leaked secrets & CVEs',
  'Run /target to configure the active endpoint for security assessments',
  'Run /ddos to simulate flood, slowloris, and burst-spike traffic loads',
  'Run /sqli to fuzz query strings & request bodies for SQL injection',
  'Run /xss to probe reflection points, storage sinks, and DOM sinks',
  'Run /exfil to inspect API responses and headers for sensitive data leakage',
  'Press Tab or 0-9 at any time for quick navigation',
];

export const AnimatedTip: React.FC = () => {
  // Stable tip per mount (no re-render timer causing input jitter)
  const currentTip = useMemo(() => {
    const idx = Math.floor(Math.random() * TIPS.length);
    return TIPS[idx];
  }, []);

  return (
    <Box flexDirection="row" alignItems="center" justifyContent="center" marginY={1}>
      <Text color="yellow" bold>
        ● Tip{' '}
      </Text>
      <Text color="gray">
        {currentTip}
      </Text>
    </Box>
  );
};

export default AnimatedTip;
