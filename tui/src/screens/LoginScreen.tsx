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
      title="Operator Authentication"
      subtitle="Sign in to access security test suites and vulnerability scanning"
      breadcrumb="AUTHENTICATION"
      accentColor="yellow"
      statusText={error ? 'AUTHENTICATION FAILED' : 'AWAITING OPERATOR INPUT'}
      statusType={error ? 'error' : 'ready'}
      keyHints="tab switch field · enter next/submit"
    >
      <Box flexDirection="column" marginY={1}>
        <Box flexDirection="row" marginY={1}>
          <Box width={14}>
            <Text bold color={activeField === 'username' ? 'yellow' : 'gray'}>
              {activeField === 'username' ? '› ' : '  '}Username:
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
          <Box width={14}>
            <Text bold color={activeField === 'password' ? 'yellow' : 'gray'}>
              {activeField === 'password' ? '› ' : '  '}Password:
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
          <Box marginTop={1} paddingLeft={2}>
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
