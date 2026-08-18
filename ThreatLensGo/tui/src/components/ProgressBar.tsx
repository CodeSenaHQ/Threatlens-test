import React from 'react';
import { Box, Text } from 'ink';

export interface ProgressBarProps {
  percent: number; // 0 to 100
  width?: number;
  color?: string;
  emptyColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  width = 30,
  color = 'cyan',
  emptyColor = 'gray',
}) => {
  const clampedPercent = Math.max(0, Math.min(100, Math.round(percent)));
  const filledCount = Math.round((clampedPercent / 100) * width);
  const emptyCount = Math.max(0, width - filledCount);

  const filledBar = '█'.repeat(filledCount);
  const emptyBar = '░'.repeat(emptyCount);

  return (
    <Box flexDirection="row" alignItems="center">
      <Box marginRight={1}>
        <Text color={color}>{filledBar}</Text>
        <Text color={emptyColor} dimColor>
          {emptyBar}
        </Text>
      </Box>
      <Text bold color="white">
        {clampedPercent}%
      </Text>
    </Box>
  );
};

export default ProgressBar;
