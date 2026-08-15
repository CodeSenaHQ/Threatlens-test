import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useNavigation } from '../state/navigation.js';
import { TerminalLayout } from '../components/TerminalLayout.js';

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
    <TerminalLayout
      title="Git Repository Analysis"
      subtitle="Deep-scan source code repositories for secrets, keys, and CVEs"
      breadcrumb="GIT SCAN"
      accentColor="yellow"
      statusText={confirmation ? 'REQUEST CAPTURED' : error ? 'INPUT ERROR' : 'AWAITING REPOSITORY URL'}
      statusType={confirmation ? 'success' : error ? 'error' : 'ready'}
      keyHints="enter submit · esc back to main menu"
    >
      <Box flexDirection="column" marginY={1}>
        <Box flexDirection="row" marginY={1}>
          <Box width={28}>
            <Text bold color="yellow">
              › Public Git URL:
            </Text>
          </Box>
          <Box flexGrow={1}>
            <TextInput
              value={repoUrl}
              onChange={(val) => {
                setRepoUrl(val);
                if (error) setError('');
              }}
              onSubmit={handleSubmit}
              focus={isInteractive}
              placeholder="https://github.com/dev47929/ThreatLens"
            />
          </Box>
        </Box>

        {error ? (
          <Box marginTop={1} paddingLeft={2}>
            <Text color="red" bold>
              ✗ {error}
            </Text>
          </Box>
        ) : null}

        {confirmation ? (
          <Box marginTop={1} flexDirection="column" borderStyle="single" borderColor="green" paddingX={2} paddingY={1}>
            <Text color="green" bold>
              ✓ {confirmation}
            </Text>
            {submittedUrl ? (
              <Box marginTop={0}>
                <Text color="gray">Captured Target: </Text>
                <Text color="cyan" bold>{submittedUrl}</Text>
              </Box>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </TerminalLayout>
  );
};

export default GitAnalysisScreen;
