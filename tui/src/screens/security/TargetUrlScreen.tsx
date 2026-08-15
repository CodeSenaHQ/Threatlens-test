import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useNavigation } from '../../state/navigation.js';
import { useSecuritySession } from '../../state/securitySession.js';
import { TerminalLayout } from '../../components/TerminalLayout.js';

const URL_REGEX = /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+(:\d+)?(\/.*)?$/i;

export const TargetUrlScreen: React.FC = () => {
  const { pop, replace } = useNavigation();
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
    <TerminalLayout
      title="TARGET ENDPOINT CONFIGURATION"
      subtitle="Define the root target base URL for this security assessment session"
      breadcrumb="SECURITY > TARGET CONFIG"
      borderColor="magenta"
      statusText={error ? 'INVALID TARGET URL' : 'AWAITING TARGET CONFIGURATION'}
      statusType={error ? 'error' : 'ready'}
      keyHints="[Enter] Proceed to Security Suite  •  [Esc] Back to Main Menu"
    >
      <Box flexDirection="column" marginY={1}>
        <Box flexDirection="row" marginY={1}>
          <Box width={20}>
            <Text bold color="magenta">
              Target Base URL:
            </Text>
          </Box>
          <Box flexGrow={1}>
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
      </Box>
    </TerminalLayout>
  );
};

export default TargetUrlScreen;
