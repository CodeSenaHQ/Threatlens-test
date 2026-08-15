import React from 'react';
import { Box, Text } from 'ink';

export const LoginScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
      <Text bold color="cyan">
        ThreatLens Login
      </Text>
      <Text color="gray">
        Please authenticate to access security assessments and tools.
      </Text>
    </Box>
  );
};
