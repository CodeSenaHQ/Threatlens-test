import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { ProgressBar } from './ProgressBar.js';

export interface SimulationRunnerProps {
  moduleName: string;
  target: string;
  params: Record<string, unknown>;
  onDone: () => void;
}

const STAGES = [
  'Resolving target endpoint telemetry & handshake...',
  'Generating security assessment test vectors...',
  'Dispatching payload matrix & inspecting responses...',
  'Evaluating latency differentials & error boundaries...',
  'Finalizing vulnerability intelligence telemetry...',
];

export const SimulationRunner: React.FC<SimulationRunnerProps> = ({
  moduleName,
  target,
  params,
  onDone,
}) => {
  const [progress, setProgress] = useState(0);
  const [completedLogs, setCompletedLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += 8;
      if (currentPercent >= 100) {
        currentPercent = 100;
        setProgress(100);
        setIsDone(true);
        clearInterval(interval);
      } else {
        setProgress(currentPercent);
        const stageIdx = Math.min(
          STAGES.length - 1,
          Math.floor((currentPercent / 100) * STAGES.length)
        );
        const stageText = STAGES[stageIdx];
        if (stageText && !completedLogs.includes(stageText)) {
          setCompletedLogs((prev) => [...prev.slice(-3), stageText]);
        }
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  useInput((_input, key) => {
    if (isDone && (key.return || key.escape)) {
      onDone();
    }
  });

  const currentStage =
    STAGES[Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length))] ||
    'Processing...';

  return (
    <Box flexDirection="column" marginY={1}>
      {/* Simulation Header */}
      <Box flexDirection="row" alignItems="center" marginBottom={1}>
        {!isDone ? (
          <Box marginRight={1}>
            <Text color="yellow">
              <Spinner type="dots" />
            </Text>
          </Box>
        ) : (
          <Box marginRight={1}>
            <Text color="green" bold>
              ✓
            </Text>
          </Box>
        )}
        <Text bold color={isDone ? 'green' : 'yellow'}>
          {isDone ? `${moduleName.toUpperCase()} COMPLETE` : `EXECUTING ${moduleName.toUpperCase()}`}
        </Text>
      </Box>

      {/* Target and Progress Bar */}
      <Box flexDirection="column" marginBottom={1} paddingLeft={2}>
        <Text color="gray">
          Target: <Text color="cyan" bold>{target || 'N/A'}</Text>
        </Text>
        <Box marginY={1}>
          <ProgressBar percent={progress} width={36} color={isDone ? 'green' : 'yellow'} />
        </Box>
        {!isDone ? (
          <Text dimColor color="gray">
            › {currentStage}
          </Text>
        ) : (
          <Text color="green" bold>
            ✓ Assessment request and payload telemetry captured successfully
          </Text>
        )}
      </Box>

      {/* Live Probe Logs */}
      {completedLogs.length > 0 ? (
        <Box flexDirection="column" marginY={1} borderStyle="single" borderColor="gray" paddingX={2} paddingY={1}>
          <Text bold color="white">
            Live Telemetry Probes:
          </Text>
          {completedLogs.map((log, index) => (
            <Box key={index} flexDirection="row" marginTop={0}>
              <Text color="green">✔ </Text>
              <Text color="gray">{log}</Text>
            </Box>
          ))}
        </Box>
      ) : null}

      {/* Action Prompt when done */}
      {isDone ? (
        <Box marginTop={1} paddingLeft={2}>
          <Text bold color="cyan">
            [Enter / Esc] Return to Security Menu
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};

export default SimulationRunner;
