import React from 'react';
import { Box, Text } from 'ink';

export const GitAnalysisScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
      <Text bold color="yellow">Git Repository Analysis</Text>
      <Text color="gray">Scan repositories for vulnerabilities and secrets</Text>
    </Box>
  );
};
