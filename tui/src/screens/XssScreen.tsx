import React from 'react';
import { Box, Text } from 'ink';

export const XssScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
      <Text bold color="yellow">Cross-Site Scripting (XSS) Testing</Text>
      <Text color="gray">Test reflection points and payloads for XSS vulnerabilities</Text>
    </Box>
  );
};
