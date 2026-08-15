import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import { useNavigation } from '../state/navigation.js';
import { TerminalLayout } from '../components/TerminalLayout.js';
import { Select } from '../components/Select.js';

type AuthMethod = 'github' | 'google' | 'credentials' | 'token';

interface MethodOption {
  label: string;
  value: AuthMethod;
}

const AUTH_METHODS: MethodOption[] = [
  {
    label: '1. Continue with GitHub OAuth (Fast device-code authentication)',
    value: 'github',
  },
  {
    label: '2. Continue with Google OAuth (Browser SSO login)',
    value: 'google',
  },
  {
    label: '3. Operator Credentials (Sign in with Username & Password)',
    value: 'credentials',
  },
  {
    label: '4. API Access Token (Sign in with ThreatLens Token)',
    value: 'token',
  },
];

export const LoginScreen: React.FC = () => {
  const { push } = useNavigation();
  const [method, setMethod] = useState<AuthMethod | null>(null);

  // Credentials state
  const [activeField, setActiveField] = useState<'username' | 'password'>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  // OAuth Device Flow state
  const [oauthCode, setOauthCode] = useState('THRT-8492-GO');
  const [oauthStatus, setOauthStatus] = useState<'waiting' | 'success'>('waiting');
  const [oauthUser, setOauthUser] = useState('dev-operator');

  const isInteractive = Boolean(process.stdin?.isTTY);

  // Handle OAuth selection & simulated authorization
  const handleSelectMethod = (item: MethodOption) => {
    setError('');
    setMethod(item.value);

    if (item.value === 'github' || item.value === 'google') {
      const randomCode = `THRT-${Math.floor(1000 + Math.random() * 9000)}-${item.value === 'github' ? 'GH' : 'GGL'}`;
      setOauthCode(randomCode);
      setOauthStatus('waiting');
      setOauthUser(item.value === 'github' ? 'github_operator' : 'google_operator');
    }
  };

  // Simulate OAuth callback success after 3.2 seconds
  useEffect(() => {
    if (method === 'github' || method === 'google') {
      const timer = setTimeout(() => {
        setOauthStatus('success');
      }, 3200);

      return () => clearTimeout(timer);
    }
  }, [method]);

  // Handle Credentials Login
  const handleCredentialsLogin = useCallback(() => {
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

  // Handle Token Login
  const handleTokenLogin = useCallback(() => {
    const trimmedToken = token.trim();
    if (!trimmedToken) {
      setError('Access Token cannot be empty.');
      return;
    }
    setError('');
    push({ type: 'mainMenu' });
  }, [token, push]);

  useInput(
    (_input, key) => {
      if (key.escape) {
        if (method !== null) {
          setMethod(null);
          setError('');
          setOauthStatus('waiting');
        }
      } else if (key.tab && method === 'credentials') {
        setActiveField((prev) => (prev === 'username' ? 'password' : 'username'));
        setError('');
      } else if (key.return && (method === 'github' || method === 'google')) {
        if (oauthStatus === 'success') {
          push({ type: 'mainMenu' });
        }
      }
    },
    { isActive: isInteractive }
  );

  return (
    <TerminalLayout
      title="ThreatLensGo Authentication"
      subtitle="Sign in via OAuth provider or operator credentials to access test suites"
      breadcrumb="AUTHENTICATION"
      accentColor="yellow"
      statusText={
        oauthStatus === 'success'
          ? 'OAUTH VERIFIED'
          : error
          ? 'AUTH FAILED'
          : method === 'github' || method === 'google'
          ? 'AWAITING OAUTH AUTHORIZATION'
          : 'SELECT AUTH METHOD'
      }
      statusType={oauthStatus === 'success' ? 'success' : error ? 'error' : 'ready'}
      keyHints={
        method === null
          ? '↑↓ navigate · enter select'
          : method === 'credentials'
          ? 'tab switch field · enter submit · esc back'
          : (method === 'github' || method === 'google') && oauthStatus === 'success'
          ? 'enter proceed to main menu'
          : 'esc back to methods'
      }
    >
      {/* 1. Method Selection */}
      {method === null && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Choose Authentication Provider:
          </Text>
          <Box marginTop={1}>
            <Select
              items={AUTH_METHODS}
              onSelect={handleSelectMethod}
              isFocused={isInteractive}
            />
          </Box>
        </Box>
      )}

      {/* 2. OAuth Device Flow (GitHub / Google) */}
      {(method === 'github' || method === 'google') && (
        <Box flexDirection="column" marginY={1}>
          <Box flexDirection="row" alignItems="center" marginBottom={1}>
            <Text bold color={method === 'github' ? 'cyan' : 'yellow'}>
              {method === 'github' ? '◆ GitHub OAuth' : '◆ Google OAuth'} Device Verification
            </Text>
          </Box>

          <Box
            flexDirection="column"
            borderStyle="single"
            borderColor="gray"
            paddingX={2}
            paddingY={1}
            marginBottom={1}
          >
            <Text color="gray">
              1. Open URL in your browser:{' '}
              <Text bold color="cyan">
                {method === 'github' ? 'https://github.com/login/device' : 'https://threatlens.io/auth/google'}
              </Text>
            </Text>

            <Box flexDirection="row" alignItems="center" marginY={1}>
              <Text color="gray">2. Enter One-Time Code: </Text>
              <Box borderStyle="round" borderColor="yellow" paddingX={1}>
                <Text bold color="yellow">
                  {oauthCode}
                </Text>
              </Box>
            </Box>

            <Box flexDirection="row" alignItems="center" marginTop={1}>
              {oauthStatus === 'waiting' ? (
                <>
                  <Box marginRight={1}>
                    <Text color="yellow">
                      <Spinner type="dots" />
                    </Text>
                  </Box>
                  <Text color="gray">
                    Polling OAuth token callback...
                  </Text>
                </>
              ) : (
                <>
                  <Text color="green" bold>
                    ✔ Successfully authorized as @{oauthUser}!
                  </Text>
                </>
              )}
            </Box>
          </Box>

          {oauthStatus === 'success' ? (
            <Box marginTop={1}>
              <Text bold color="cyan">
                › Press [Enter] to continue to Main Menu
              </Text>
            </Box>
          ) : (
            <Text dimColor color="gray">
              Press [Esc] to cancel and switch auth method
            </Text>
          )}
        </Box>
      )}

      {/* 3. Username & Password Credentials */}
      {method === 'credentials' && (
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
              onSubmit={handleCredentialsLogin}
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
      )}

      {/* 4. API Token Login */}
      {method === 'token' && (
        <Box flexDirection="column" marginY={1}>
          <Box flexDirection="row" marginY={1}>
            <Box width={16}>
              <Text bold color="yellow">
                › Access Token:
              </Text>
            </Box>
            <TextInput
              value={token}
              onChange={(val) => {
                setToken(val);
                if (error) setError('');
              }}
              onSubmit={handleTokenLogin}
              focus={isInteractive}
              placeholder="thrt_pat_xxxxxxxxxxxxxxxxxxxx"
              mask="*"
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
      )}
    </TerminalLayout>
  );
};

export default LoginScreen;
