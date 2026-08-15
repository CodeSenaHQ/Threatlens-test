import React from 'react';
import { Box, useApp, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useNavigation } from '../state/navigation.js';
import { TerminalLayout } from '../components/TerminalLayout.js';

type MenuAction = 'gitAnalysis' | 'securityMenu';

interface MenuItem {
  label: string;
  value: MenuAction;
}

const menuItems: MenuItem[] = [
  {
    label: '1. Git Repository Analysis (Public Repo Audits & Secret Detection)',
    value: 'gitAnalysis',
  },
  {
    label: '2. Security Testing Suite (DDoS, SQLi, XSS, Exfiltration, Rate Limiting)',
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
    <TerminalLayout
      title="MAIN NAVIGATION"
      subtitle="Select a security module to initialize testing operations"
      breadcrumb="MAIN MENU"
      borderColor="green"
      statusText="READY FOR SELECTION"
      statusType="ready"
      keyHints="[↑/↓] Navigate  •  [Enter] Select  •  [Esc] Quit"
    >
      <Box marginY={1} flexDirection="column">
        <SelectInput
          items={menuItems}
          onSelect={handleSelect}
          isFocused={isInteractive}
        />
      </Box>
    </TerminalLayout>
  );
};

export const MainMenuScreen = MainMenu;
export default MainMenu;
