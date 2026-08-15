import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

const TIPS = [
  'Run /git to audit public repositories for leaked secrets & CVEs',
  'Run /target to configure the active endpoint for security assessments',
  'Run /ddos to simulate flood, slowloris, and burst-spike traffic loads',
  'Run /sqli to fuzz query strings & request bodies for SQL injection',
  'Run /xss to probe reflection points, storage sinks, and DOM sinks',
  'Run /exfil to inspect API responses and headers for sensitive data leakage',
  'Press Tab or type / at any time to open the quick command palette',
];

export const AnimatedTip: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);

  // Cycle tips gently every 5 seconds (clean, zero flickering)
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 5000);

    return () => clearInterval(tipTimer);
  }, []);

  const currentTip = TIPS[tipIndex] || TIPS[0];

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
