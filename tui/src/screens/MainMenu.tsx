import React from 'react';
import { Box, useApp, useInput } from 'ink';
import { useNavigation } from '../state/navigation.js';
import { TerminalLayout } from '../components/TerminalLayout.js';
import { Select } from '../components/Select.js';

type MenuAction = 'gitAnalysis' | 'securityMenu';

interface MenuItem {
  label: string;
  value: MenuAction;
}

const menuItems: MenuItem[] = [
  {
    label: '1. Git Repository Analysis (Public Repo Audits & Leaked Secrets)',
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
      title="Main Navigation"
      subtitle="Select an operational workflow to begin analysis"
      breadcrumb="MAIN MENU"
      accentColor="yellow"
      statusText="READY FOR SELECTION"
      statusType="ready"
      keyHints="↑↓ navigate · enter select · esc quit"
    >
      <Box marginY={1} flexDirection="column">
        <Select
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
