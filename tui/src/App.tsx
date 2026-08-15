import React from 'react';
import { Box, Text } from 'ink';
import { NavigationProvider, useNavigation } from './state/navigation.js';
import { HomeScreen } from './screens/index.js';

const ScreenRenderer: React.FC = () => {
  const { currentScreen } = useNavigation();

  switch (currentScreen) {
    case 'home':
    default:
      return <HomeScreen />;
  }
};

export const App: React.FC = () => {
  return (
    <NavigationProvider initialScreen="home">
      <Box flexDirection="column">
        <ScreenRenderer />
      </Box>
    </NavigationProvider>
  );
};

export default App;
