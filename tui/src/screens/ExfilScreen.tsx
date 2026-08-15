import React from 'react';
import { Box, Text } from 'ink';

export const ExfilScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="magenta">
      <Text bold color="magenta">Data Exfiltration Testing</Text>
      <Text color="gray">Simulate and detect sensitive data exfiltration vectors</Text>
    </Box>
  );
};
