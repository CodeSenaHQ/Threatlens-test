import React from 'react';
import { Box, Text } from 'ink';

export const DdosScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="red">
      <Text bold color="red">DDoS Simulation</Text>
      <Text color="gray">Test endpoint resiliency against distributed traffic</Text>
    </Box>
  );
};
