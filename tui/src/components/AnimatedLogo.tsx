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

// Compact 3-line ANSI block art for "THREATLENSGO" (52 cols) for narrower terminals
const COMPACT_LOGO = [
  '▀█▀ █ █ █▀▄ █▀▀ █▀█ ▀█▀ █   █▀▀ █▄ █ █▀▀  █▀▀ █▀█',
  ' █  █▀█ █▀▄ █▀▀ █▀█  █  █   █▀▀ █ ▀█ ▄██  █ █ █ █',
  ' ▀  ▀ ▀ ▀ ▀ ▀▀▀ ▀ ▀  ▀  ▀▀▀ ▀▀▀ ▀  ▀ ▀▀▀  ▀▀▀ ▀▀▀',
];

const GRADIENT_COLORS = [
  '#FFFFFF',
  '#F0FDF4',
  '#CCFBF1',
  '#99F6E4',
  '#5EEAD4',
  '#2DD4BF',
  '#14B8A6',
  '#0D9488',
  '#38BDF8',
  '#60A5FA',
  '#818CF8',
  '#A78BFA',
  '#C084FC',
  '#E879F9',
  '#F472B6',
  '#FB7185',
];

export const AnimatedLogo: React.FC<{ subtitle?: string }> = ({
  subtitle = 'OFFENSIVE SECURITY & VULNERABILITY ASSESSMENT',
}) => {
  const { columns } = useTerminalSize();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 1000);
    }, 120);

    return () => clearInterval(timer);
  }, []);

  const logoLines = columns >= 114 ? LARGE_LOGO : COMPACT_LOGO;

  return (
    <Box flexDirection="column" alignItems="center" marginY={1}>
      <Box flexDirection="row" alignItems="flex-end">
        <Box flexDirection="column">
          {logoLines.map((line, lineIndex) => {
            return (
              <Box key={lineIndex} flexDirection="row">
                {line.split('').map((char, charIndex) => {
                  if (char === ' ') {
                    return <Text key={charIndex}> </Text>;
                  }
                  const colorIndex = (charIndex + lineIndex * 2 + frame) % GRADIENT_COLORS.length;
                  const color = GRADIENT_COLORS[colorIndex] || '#38BDF8';

                  return (
                    <Text key={charIndex} color={color} bold>
                      {char}
                    </Text>
                  );
                })}
              </Box>
            );
          })}
        </Box>

        {/* Small by CodeSena on right side */}
        <Box paddingBottom={columns >= 114 ? 1 : 0} marginLeft={2}>
          <Text color="cyan" bold>
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
