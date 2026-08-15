import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useNavigation } from '../state/navigation.js';

const GIT_URL_REGEX = /^(https?:\/\/[^\s]+|git@[^\s:]+:[^\s]+)$/i;

export const GitAnalysisScreen: React.FC = () => {
  const { pop } = useNavigation();
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const isInteractive = Boolean(process.stdin?.isTTY);

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setError('Repository URL cannot be empty.');
      setConfirmation(null);
      return;
    }

    if (!GIT_URL_REGEX.test(trimmed)) {
      setError('Invalid Git URL. Example: https://github.com/org/repo or git@github.com:org/repo.git');
      setConfirmation(null);
      return;
    }

    setError('');
    // Log collected value as { repoUrl: string } without calling backend
    console.log({ repoUrl: trimmed });
    setSubmittedUrl(trimmed);
    setConfirmation('Analysis request captured (backend not yet connected)');
  }, []);

  useInput(
    (_input, key) => {
      if (key.escape) {
        pop();
      }
    },
    { isActive: isInteractive }
  );

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} borderStyle="round" borderColor="yellow" width={68}>
      <Box marginBottom={1} flexDirection="column">
        <Text bold color="yellow">
          Security TUI — Git Repository Analysis
        </Text>
        <Text color="gray">Scan public repositories for vulnerabilities and secrets</Text>
      </Box>

      <Box flexDirection="column" marginY={1}>
        <Box flexDirection="row">
          <Box width={28}>
            <Text bold color="yellow">
              Public Git Repository URL:
            </Text>
          </Box>
          <TextInput
            value={repoUrl}
            onChange={(val) => {
              setRepoUrl(val);
              if (error) setError('');
            }}
            onSubmit={handleSubmit}
            focus={isInteractive}
            placeholder="https://github.com/org/repo.git"
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

      {confirmation ? (
        <Box marginTop={1} flexDirection="column">
          <Text color="green" bold>
            ✓ {confirmation}
          </Text>
          {submittedUrl ? (
            <Text color="gray">Target: {submittedUrl}</Text>
          ) : null}
        </Box>
      ) : null}

      <Box marginTop={1}>
        <Text dimColor color="gray">
          [Enter] Submit  •  [Esc] Back to Main Menu
        </Text>
      </Box>
    </Box>
  );
};

export default GitAnalysisScreen;
