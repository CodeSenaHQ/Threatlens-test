import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useNavigation } from '../../state/navigation.js';
import { useSecuritySession } from '../../state/securitySession.js';

const URL_REGEX = /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+(:\d+)?(\/.*)?$/i;

export const TargetUrlScreen: React.FC = () => {
  const { push, pop, replace } = useNavigation();
  const { targetUrl: existingUrl, setTargetUrl } = useSecuritySession();
  const [urlInput, setUrlInput] = useState(existingUrl || '');
  const [error, setError] = useState('');

  const isInteractive = Boolean(process.stdin?.isTTY);

  const handleSubmit = useCallback(
    (value: string) => {
      const trimmed = value.trim();

      if (!trimmed) {
        setError('Target URL cannot be empty.');
        return;
      }

      if (!URL_REGEX.test(trimmed)) {
        setError('Invalid URL. Must include protocol (e.g. https://example.com or http://localhost:8080)');
        return;
      }

      setError('');
      setTargetUrl(trimmed);
      // Replace targetUrl screen with securityMenu so popping goes back to MainMenu
      replace({ type: 'securityMenu' });
    },
    [setTargetUrl, replace]
  );

  useInput(
    (_input, key) => {
      if (key.escape) {
        pop();
      }
    },
    { isActive: isInteractive }
  );

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} borderStyle="round" borderColor="magenta" width={70}>
      <Box marginBottom={1} flexDirection="column">
        <Text bold color="magenta">
          Security Testing — Target URL
        </Text>
        <Text color="gray">Specify the base target URL for security assessments</Text>
      </Box>

      <Box flexDirection="column" marginY={1}>
        <Box flexDirection="row">
          <Box width={16}>
            <Text bold color="magenta">
              Target URL:
            </Text>
          </Box>
          <TextInput
            value={urlInput}
            onChange={(val) => {
              setUrlInput(val);
              if (error) setError('');
            }}
            onSubmit={handleSubmit}
            focus={isInteractive}
            placeholder="https://staging.example.com"
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
          [Enter] Proceed to Security Menu  •  [Esc] Back to Main Menu
        </Text>
      </Box>
    </Box>
  );
};

export default TargetUrlScreen;
