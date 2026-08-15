import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useNavigation } from '../state/navigation.js';

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
    // Simulate successful authentication and navigate to mainMenu
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
    <Box flexDirection="column" paddingX={2} paddingY={1} borderStyle="round" borderColor="cyan" width={60}>
      <Box marginBottom={1} flexDirection="column">
        <Text bold color="cyan">
          Security TUI — Login
        </Text>
        <Text color="gray">ThreatLens Security Terminal</Text>
      </Box>

      <Box flexDirection="column">
        <Box flexDirection="row">
          <Box width={12}>
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

        <Box flexDirection="row" marginTop={1}>
          <Box width={12}>
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
      </Box>

      {error ? (
        <Box marginTop={1}>
          <Text color="red" bold>
            ✗ {error}
          </Text>
        </Box>
      ) : null}

      <Box marginTop={1}>
        <Text dimColor color="gray">
          [Tab] Switch field  •  [Enter] Next / Submit
        </Text>
      </Box>
    </Box>
  );
};
