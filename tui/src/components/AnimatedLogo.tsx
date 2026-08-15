import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

// Chunky modern lowercase block letters for "threatlens" inspired by OpenCode
const LOGO_LINES = [
  '  █   █                         █     █                       ',
  ' ████ █                         █     █                       ',
  '  █   ████  █ █  ███  ███  ████ █     ███  █ █  ███   ███     ',
  '  █   █  █  ██  █  █  █ █  █  █ █     █ █  ██  █  █  █       ',
  '  ██  █  █  █   ████  ███  ████ ████  ███  █   ████  ███     ',
  '                                                          ',
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
  subtitle = 'OFFENSIVE SECURITY & VULNERABILITY INTELLIGENCE',
}) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 1000);
    }, 120);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box flexDirection="column" alignItems="center" marginY={1}>
      {LOGO_LINES.map((line, lineIndex) => {
        return (
          <Box key={lineIndex} flexDirection="row">
            {line.split('').map((char, charIndex) => {
              if (char === ' ') {
                return <Text key={charIndex}> </Text>;
              }
              // Calculate wave color shift based on char position and frame
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

      {subtitle ? (
        <Box marginTop={1}>
          <Text dimColor color="gray" bold>
            {subtitle}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};

export default AnimatedLogo;
