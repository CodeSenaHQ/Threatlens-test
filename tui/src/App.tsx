import React from 'react';
import { Box } from 'ink';
import { NavigationProvider, useNavigation } from './state/navigation.js';
import { SecuritySessionProvider } from './state/securitySession.js';
import {
  LoginScreen,
  MainMenuScreen,
  GitAnalysisScreen,
  TargetUrlScreen,
  SecurityMenuScreen,
  DdosScreen,
  SqliScreen,
  XssScreen,
  ExfilScreen,
  RateLimitScreen,
  ProxyScreen,
} from './screens/index.js';

export const ScreenRenderer: React.FC = () => {
  const { current } = useNavigation();

  switch (current.type) {
    case 'login':
      return <LoginScreen />;
    case 'mainMenu':
      return <MainMenuScreen />;
    case 'gitAnalysis':
      return <GitAnalysisScreen />;
    case 'targetUrl':
      return <TargetUrlScreen />;
    case 'securityMenu':
      return <SecurityMenuScreen />;
    case 'ddos':
      return <DdosScreen />;
    case 'sqli':
      return <SqliScreen />;
    case 'xss':
      return <XssScreen />;
    case 'exfil':
      return <ExfilScreen />;
    case 'rateLimit':
      return <RateLimitScreen />;
    case 'proxy':
      return <ProxyScreen />;
    default: {
      const _exhaustiveCheck: never = current;
      return <LoginScreen />;
    }
  }
};

export const App: React.FC = () => {
  return (
    <NavigationProvider initialScreen={{ type: 'login' }}>
      <SecuritySessionProvider>
        <Box flexDirection="column">
          <ScreenRenderer />
        </Box>
      </SecuritySessionProvider>
    </NavigationProvider>
  );
};

export default App;
