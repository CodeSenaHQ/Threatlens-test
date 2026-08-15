import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useNavigation } from '../state/navigation.js';
import { TerminalLayout } from '../components/TerminalLayout.js';

type ActiveField = 'username' | 'password';

export const LoginScreen: React.FC = () => {
  const { push } = useNavigation();
  const [activeField, setActiveField] = useState<ActiveField>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isInteractive = Boolean(process.stdin?.isTTY);

  const handleLogin = useCallback(() => {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser && !trimmedPass) {
      setError('Username and password cannot be empty.');
      setActiveField('username');
      return;
    }

    if (!trimmedUser) {
      setError('Username is required.');
      setActiveField('username');
      return;
    }

    if (!trimmedPass) {
      setError('Password is required.');
      setActiveField('password');
      return;
    }

    setError('');
    push({ type: 'mainMenu' });
  }, [username, password, push]);

  useInput(
    (_input, key) => {
      if (key.tab) {
        setActiveField((prev) => (prev === 'username' ? 'password' : 'username'));
        setError('');
      }
    },
    { isActive: isInteractive }
  );

  return (
    <TerminalLayout
      title="AUTHENTICATION"
      subtitle="Enter security operator credentials to access ThreatLens"
      breadcrumb="AUTH"
      borderColor="cyan"
      statusText={error ? 'AUTHENTICATION FAILED' : 'AWAITING CREDENTIALS'}
      statusType={error ? 'error' : 'ready'}
      keyHints="[Tab] Switch field  •  [Enter] Next/Submit"
    >
      <Box flexDirection="column" marginY={1}>
        <Box flexDirection="row" marginY={1}>
          <Box width={16}>
            <Text bold color={activeField === 'username' ? 'cyan' : 'white'}>
              Username:
            </Text>
          </Box>
          <TextInput
            value={username}
            onChange={(val) => {
              setUsername(val);
              if (error) setError('');
            }}
            onSubmit={() => {
              setActiveField('password');
            }}
            focus={isInteractive && activeField === 'username'}
            placeholder="admin"
          />
        </Box>

        <Box flexDirection="row" marginY={1}>
          <Box width={16}>
            <Text bold color={activeField === 'password' ? 'cyan' : 'white'}>
              Password:
            </Text>
          </Box>
          <TextInput
            value={password}
            onChange={(val) => {
              setPassword(val);
              if (error) setError('');
            }}
            onSubmit={handleLogin}
            focus={isInteractive && activeField === 'password'}
            mask="*"
            placeholder="••••••••"
          />
        </Box>

        {error ? (
          <Box marginTop={1}>
            <Text color="red" bold>
              ✗ {error}
            </Text>
          </Box>
        ) : null}
      </Box>
    </TerminalLayout>
  );
};

export default LoginScreen;
