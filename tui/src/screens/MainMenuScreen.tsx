import React from 'react';
import { Box, Text } from 'ink';

export const MainMenuScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="green">
      <Text bold color="green">Main Menu</Text>
      <Text color="gray">Select an option to proceed</Text>
    </Box>
  );
};
