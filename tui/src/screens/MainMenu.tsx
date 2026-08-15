import React from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useNavigation } from '../state/navigation.js';

type MenuAction = 'gitAnalysis' | 'securityMenu';

interface MenuItem {
  label: string;
  value: MenuAction;
}

const menuItems: MenuItem[] = [
  {
    label: '1. Git Repository Analysis',
    value: 'gitAnalysis',
  },
  {
    label: '2. Security Testing',
    value: 'securityMenu',
  },
];

export const MainMenu: React.FC = () => {
  const { push } = useNavigation();
  const { exit } = useApp();

  const isInteractive = Boolean(process.stdin?.isTTY);

  const handleSelect = (item: MenuItem) => {
    if (item.value === 'gitAnalysis') {
      push({ type: 'gitAnalysis' });
    } else if (item.value === 'securityMenu') {
      push({ type: 'securityMenu' });
    }
  };

  useInput(
    (_input, key) => {
      if (key.escape) {
        exit();
      }
    },
    { isActive: isInteractive }
  );

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} borderStyle="round" borderColor="cyan" width={60}>
      <Box marginBottom={1} flexDirection="column">
        <Text bold color="cyan">
          Security TUI
        </Text>
        <Text color="gray">Main Menu — ThreatLens Security Suite</Text>
      </Box>

      <Box marginY={1} flexDirection="column">
        <SelectInput
          items={menuItems}
          onSelect={handleSelect}
          isFocused={isInteractive}
        />
      </Box>

      <Box marginTop={1}>
        <Text dimColor color="gray">
          ↑/↓ to navigate, Enter to select, Esc to quit
        </Text>
      </Box>
    </Box>
  );
};

export const MainMenuScreen = MainMenu;
export default MainMenu;
