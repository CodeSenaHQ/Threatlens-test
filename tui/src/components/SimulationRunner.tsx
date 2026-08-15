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

const TRAFFIC_WAVE = [
  ' ▃▅▇█▇▅▃ ',
  '▃▅▇█▇▅▃  ',
  '▅▇█▇▅▃  ▃',
  '▇█▇▅▃  ▃▅',
  '█▇▅▃  ▃▅▇',
  '▇▅▃  ▃▅▇█',
  '▅▃  ▃▅▇█▇',
  '▃  ▃▅▇█▇▅',
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
  const [waveFrame, setWaveFrame] = useState(0);
  const [packetCount, setPacketCount] = useState(120);

  // Smooth wave animation
  useEffect(() => {
    if (isDone) return;
    const waveTimer = setInterval(() => {
      setWaveFrame((prev) => (prev + 1) % TRAFFIC_WAVE.length);
      setPacketCount((prev) => prev + Math.floor(Math.random() * 85 + 40));
    }, 120);

    return () => clearInterval(waveTimer);
  }, [isDone]);

  // Stepping progress
  useEffect(() => {
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += 7;
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
    }, 160);

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

  const wave = TRAFFIC_WAVE[waveFrame] || ' ▃▅▇█▇▅▃ ';

  return (
    <Box flexDirection="column" marginY={1}>
      {/* Simulation Header */}
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={1}>
        <Box flexDirection="row" alignItems="center">
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

        {/* Live Attack Throughput Indicator */}
        {!isDone ? (
          <Box flexDirection="row" alignItems="center">
            <Text color="cyan">FLOW: </Text>
            <Text color="magenta" bold>{wave}</Text>
            <Text color="yellow" bold> {packetCount} pkts/s</Text>
          </Box>
        ) : (
          <Box flexDirection="row" alignItems="center">
            <Text color="green" bold>STATUS: 200 OK (0 CRITICAL)</Text>
          </Box>
        )}
      </Box>

      {/* Target and Animated Progress Bar */}
      <Box flexDirection="column" marginBottom={1} paddingLeft={2}>
        <Text color="gray">
          Target: <Text color="cyan" bold>{target || 'N/A'}</Text>
        </Text>
        <Box marginY={1}>
          <ProgressBar percent={progress} width={38} color={isDone ? 'green' : 'cyan'} />
        </Box>
        {!isDone ? (
          <Text dimColor color="gray">
            › {currentStage}
          </Text>
        ) : (
          <Text color="green" bold>
            ✓ Security assessment matrix executed & telemetry captured successfully
          </Text>
        )}
      </Box>

      {/* Live Probe Stream */}
      {completedLogs.length > 0 ? (
        <Box
          flexDirection="column"
          marginY={1}
          borderStyle="single"
          borderColor="gray"
          paddingX={2}
          paddingY={1}
        >
          <Box flexDirection="row" justifyContent="space-between" marginBottom={0}>
            <Text bold color="white">
              Live Telemetry Probes:
            </Text>
            {!isDone && (
              <Text color="cyan" dimColor>
                <Spinner type="dots" /> STREAMING
              </Text>
            )}
          </Box>
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
        <Box marginTop={1} paddingLeft={2} flexDirection="row" alignItems="center">
          <Text bold color="cyan">
            [Enter / Esc] Return to Security Menu
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};

export default SimulationRunner;
