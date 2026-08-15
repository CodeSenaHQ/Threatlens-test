import React from 'react';
import { Box, Text } from 'ink';

export const SqliScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="red">
      <Text bold color="red">SQL Injection Testing</Text>
      <Text color="gray">Test input parameters for SQL vulnerability detection</Text>
    </Box>
  );
};
