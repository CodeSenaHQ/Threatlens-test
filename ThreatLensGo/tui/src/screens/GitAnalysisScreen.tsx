import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useNavigation } from '../state/navigation.js';
import { TerminalLayout } from '../components/TerminalLayout.js';
import { SimulationRunner } from '../components/SimulationRunner.js';

const GIT_URL_REGEX = /^(https?:\/\/[^\s]+|git@[^\s:]+:[^\s]+)$/i;

export const GitAnalysisScreen: React.FC = () => {
  const { pop } = useNavigation();
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  const isInteractive = Boolean(process.stdin?.isTTY);

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setError('Repository URL cannot be empty.');
      return;
    }

    if (!GIT_URL_REGEX.test(trimmed)) {
      setError('Invalid Git URL. Example: https://github.com/org/repo or git@github.com:org/repo.git');
      return;
    }

    setError('');
    console.log({ repoUrl: trimmed });
    setSubmittedUrl(trimmed);
    setIsSimulating(true);
  }, []);

  useInput(
    (_input, key) => {
      if (key.escape && !isSimulating) {
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
      statusText={isSimulating ? 'AUDIT IN PROGRESS' : error ? 'INPUT ERROR' : 'AWAITING REPOSITORY URL'}
      statusType={isSimulating ? 'success' : error ? 'error' : 'ready'}
      keyHints={isSimulating ? '[Enter / Esc] Done' : 'enter submit · esc back to main menu'}
    >
      {!isSimulating ? (
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
        </Box>
      ) : (
        <SimulationRunner
          moduleName="Git Repository Audit"
          target={submittedUrl || repoUrl}
          params={{ repoUrl: submittedUrl || repoUrl }}
          onDone={pop}
        />
      )}
    </TerminalLayout>
  );
};

export default GitAnalysisScreen;
