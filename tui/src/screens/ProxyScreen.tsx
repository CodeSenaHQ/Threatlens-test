import React from 'react';
import { Box, Text } from 'ink';

export const ProxyScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
      <Text bold color="cyan">Proxy Interception</Text>
      <Text color="gray">Inspect and tamper with live HTTP requests and responses</Text>
    </Box>
  );
};
