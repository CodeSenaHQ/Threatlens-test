import React from 'react';
import { Box, Text } from 'ink';

export const HomeScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
      <Text bold color="cyan">
        Security TUI
      </Text>
      <Text color="gray">
        Terminal UI for ThreatLens Security Monitoring & Assessment
      </Text>
    </Box>
  );
};
