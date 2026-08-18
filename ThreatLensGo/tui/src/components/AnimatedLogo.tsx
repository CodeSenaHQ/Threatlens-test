import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useTerminalSize } from '../hooks/useTerminalSize.js';

// Ultra-clean, crystal-clear 6-line block art for "THREATLENSGO" (104 cols)
const LARGE_LOGO = [
  '████████╗██╗  ██╗██████╗ ███████╗ █████╗ ████████╗██╗     ███████╗███╗   ██╗███████╗  ██████╗  ██████╗ ',
  '╚══██╔══╝██║  ██║██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║     ██╔════╝████╗  ██║██╔════╝ ██╔════╝ ██╔═══██╗',
  '   ██║   ███████║██████╔╝█████╗  ███████║   ██║   ██║     █████╗  ██╔██╗ ██║███████╗ ██║  ███╗██║   ██║',
  '   ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══██║   ██║   ██║     ██╔══╝  ██║╚██╗██║╚════██║ ██║   ██║██║   ██║',
  '   ██║   ██║  ██║██║  ██║███████╗██║  ██║   ██║   ███████╗███████╗██║ ╚████║███████║ ╚██████╔╝╚██████╔╝',
  '   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝  ╚═════╝  ╚═════╝ ',
];

// Compact 3-line ANSI block art for "THREATLENSGO" (52 cols) for standard terminals
const COMPACT_LOGO = [
  '▀█▀ █ █ █▀▄ █▀▀ █▀█ ▀█▀ █   █▀▀ █▄ █ █▀▀  █▀▀ █▀█',
  ' █  █▀█ █▀▄ █▀▀ █▀█  █  █   █▀▀ █ ▀█ ▄██  █ █ █ █',
  ' ▀  ▀ ▀ ▀ ▀ ▀▀▀ ▀ ▀  ▀  ▀▀▀ ▀▀▀ ▀  ▀ ▀▀▀  ▀▀▀ ▀▀▀',
];

// Vibrant cyberpunk neon wave gradient palette
const NEON_PALETTE = [
  '#38BDF8', // Electric Sky
  '#2DD4BF', // Mint Teal
  '#34D399', // Emerald
  '#A3E635', // Neon Lime
  '#FBBF24', // Amber Glow
  '#FB923C', // Warm Orange
  '#F472B6', // Rose Pink
  '#E879F9', // Electric Fuchsia
  '#C084FC', // Purple
  '#818CF8', // Indigo
  '#60A5FA', // Blue
  '#22D3EE', // Bright Cyan
];

function splitIntoChunks(str: string, size: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
}

export const AnimatedLogo: React.FC<{ subtitle?: string }> = ({
  subtitle = 'OFFENSIVE SECURITY & VULNERABILITY ASSESSMENT',
}) => {
  const { columns } = useTerminalSize();
  const [frame, setFrame] = useState(0);

  // Smooth color wave interval (160ms for silky-smooth wave glide)
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % NEON_PALETTE.length);
    }, 160);

    return () => clearInterval(timer);
  }, []);

  const isWide = columns >= 114;
  const logoLines = isWide ? LARGE_LOGO : COMPACT_LOGO;
  const chunkSize = isWide ? 8 : 4;

  return (
    <Box flexDirection="column" alignItems="center" marginY={1}>
      <Box flexDirection="row" alignItems="flex-end">
        <Box flexDirection="column">
          {logoLines.map((line, lineIndex) => {
            const chunks = splitIntoChunks(line, chunkSize);

            return (
              <Box key={lineIndex} flexDirection="row">
                {chunks.map((chunk, chunkIndex) => {
                  const colorIndex = (chunkIndex + frame) % NEON_PALETTE.length;
                  const color = NEON_PALETTE[colorIndex] || '#38BDF8';

                  return (
                    <Text key={chunkIndex} color={color} bold>
                      {chunk}
                    </Text>
                  );
                })}
              </Box>
            );
          })}
        </Box>

        {/* Small by CodeSena with pulsing cyan accent */}
        <Box paddingBottom={isWide ? 1 : 0} marginLeft={2}>
          <Text color={NEON_PALETTE[(frame + 3) % NEON_PALETTE.length] || 'cyan'} bold>
            by CodeSena
          </Text>
        </Box>
      </Box>

      {subtitle ? (
        <Box marginTop={1} flexDirection="row" alignItems="center">
          <Text dimColor color="gray" bold>
            {subtitle}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};

export default AnimatedLogo;
