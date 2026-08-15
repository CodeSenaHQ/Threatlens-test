import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { useSecuritySession } from '../state/securitySession.js';

const SPARKLINE_FRAMES = [
  ' ▃▅▇█▇▅▃ ',
  '▃▅▇█▇▅▃  ',
  '▅▇█▇▅▃  ▃',
  '▇█▇▅▃  ▃▅',
  '█▇▅▃  ▃▅▇',
  '▇▅▃  ▃▅▇█',
  '▅▃  ▃▅▇█▇',
  '▃  ▃▅▇█▇▅',
];

export const CyberRadar: React.FC = () => {
  const { targetUrl } = useSecuritySession();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % SPARKLINE_FRAMES.length);
    }, 180);

    return () => clearInterval(timer);
  }, []);

  const sparkline = SPARKLINE_FRAMES[frame] || ' ▃▅▇█▇▅▃ ';

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      borderStyle="single"
      borderColor="gray"
      paddingX={2}
      paddingY={0}
      marginY={1}
      width={88}
    >
      <Box flexDirection="row" alignItems="center">
        <Text color="cyan">
          <Spinner type="dots" />
        </Text>
        <Text color="cyan" bold>
          {' '}THREAT RADAR
        </Text>
        <Text color="gray"> │ </Text>
        <Text color="green" bold>
          LIVE
        </Text>
      </Box>

      <Box flexDirection="row" alignItems="center">
        <Text color="gray">TARGET: </Text>
        <Text color="yellow" bold>
          {targetUrl ? targetUrl.replace(/^https?:\/\//, '') : 'NONE'}
        </Text>
      </Box>

      <Box flexDirection="row" alignItems="center">
        <Text color="gray">SIGNAL: </Text>
        <Text color="magenta" bold>
          {sparkline}
        </Text>
        <Text color="gray"> 100%</Text>
      </Box>
    </Box>
  );
};

export default CyberRadar;
