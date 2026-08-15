import React from 'react';
import { Box, Text } from 'ink';

export const RateLimitScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="blue">
      <Text bold color="blue">Rate Limiting Assessment</Text>
      <Text color="gray">Test API rate limit enforcement and threshold behavior</Text>
    </Box>
  );
};
