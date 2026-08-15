import React from 'react';
import { Box, Text } from 'ink';

export const SecurityMenuScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="magenta">
      <Text bold color="magenta">Security Tools Menu</Text>
      <Text color="gray">Select a security assessment tool</Text>
    </Box>
  );
};
