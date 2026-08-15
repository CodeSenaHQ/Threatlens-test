import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput, { ItemProps, IndicatorProps } from 'ink-select-input';

export interface SelectOption<V extends string = string> {
  label: string;
  value: V;
  description?: string;
  key?: string;
}

const INDICATOR_GLYPHS = ['❯', '›', '▶', '❯'];

const CustomIndicator: React.FC<IndicatorProps> = ({ isSelected }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isSelected) return;
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % INDICATOR_GLYPHS.length);
    }, 280);

    return () => clearInterval(timer);
  }, [isSelected]);

  const glyph = isSelected ? INDICATOR_GLYPHS[frame] || '❯' : ' ';

  return (
    <Box width={3}>
      <Text color={isSelected ? 'yellow' : 'gray'} bold={isSelected}>
        {glyph}{' '}
      </Text>
    </Box>
  );
};

const CustomItem: React.FC<ItemProps> = ({ isSelected, label }) => {
  // Check if label contains description in parentheses e.g. "Option Title (Description)"
  const match = label.match(/^(.*?)\s*\((.*?)\)$/);

  if (match && match[1] && match[2]) {
    const title = match[1];
    const desc = match[2];

    return (
      <Box flexDirection="row" flexWrap="wrap">
        <Text color={isSelected ? 'yellow' : 'white'} bold={isSelected}>
          {title}
        </Text>
        <Text dimColor color="gray">
          {' '}─ {desc}
        </Text>
      </Box>
    );
  }

  // Check if label contains " ── "
  if (label.includes(' ── ')) {
    const [title, desc] = label.split(' ── ');
    return (
      <Box flexDirection="row" flexWrap="wrap">
        <Text color={isSelected ? 'yellow' : 'white'} bold={isSelected}>
          {title}
        </Text>
        <Text dimColor color="gray">
          {' '}─ {desc}
        </Text>
      </Box>
    );
  }

  return (
    <Text color={isSelected ? 'yellow' : 'white'} bold={isSelected}>
      {label}
    </Text>
  );
};

export interface SelectProps<V extends string = string> {
  items: Array<{ label: string; value: V; key?: string }>;
  onSelect: (item: { label: string; value: V }) => void;
  isFocused?: boolean;
  initialIndex?: number;
}

export function Select<V extends string = string>({
  items,
  onSelect,
  isFocused = true,
  initialIndex = 0,
}: SelectProps<V>): React.JSX.Element {
  return (
    <SelectInput
      items={items}
      onSelect={onSelect}
      isFocused={isFocused && Boolean(process.stdin?.isTTY)}
      initialIndex={initialIndex}
      indicatorComponent={CustomIndicator}
      itemComponent={CustomItem}
    />
  );
}

export default Select;
