import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

export interface ToolBadgeProps {
  toolName: string;
  args?: Record<string, any>;
  status: 'running' | 'completed' | 'error';
  result?: any;
}

export const ToolBadge: React.FC<ToolBadgeProps> = ({
  toolName,
  args,
  status,
  result,
}) => {
  const getToolIcon = () => {
    switch (toolName) {
      case 'search_code':
        return '🔍';
      case 'find_symbol':
        return '🌲';
      case 'read_file':
        return '📄';
      case 'edit_file':
        return '✏️';
      case 'run_sectest':
        return '🛡️';
      default:
        return '⚡';
    }
  };

  const getArgsSummary = () => {
    if (!args) return '';
    if (args.query) return `"${args.query}"`;
    if (args.path) return `${args.path}`;
    if (args.suite) return `suite: ${args.suite}`;
    if (args.name) return `${args.name}()`;
    return JSON.stringify(args).slice(0, 30);
  };

  return (
    <Box
      flexDirection="column"
      marginY={1}
      paddingX={1}
      borderStyle="round"
      borderColor={status === 'running' ? 'yellow' : status === 'error' ? 'red' : 'green'}
    >
      <Box flexDirection="row" alignItems="center">
        {status === 'running' ? (
          <Text color="yellow">
            <Spinner type="dots" />{' '}
          </Text>
        ) : status === 'completed' ? (
          <Text color="green">✓ </Text>
        ) : (
          <Text color="red">✗ </Text>
        )}
        <Text color="cyan" bold>
          {getToolIcon()} [{toolName}]
        </Text>
        {args ? (
          <Text color="gray">
            {' '}{getArgsSummary()}
          </Text>
        ) : null}
      </Box>

      {status === 'completed' && result ? (
        <Box marginTop={0} paddingLeft={2}>
          <Text color="gray" dimColor>
            {typeof result === 'string'
              ? result.slice(0, 80)
              : typeof result === 'object'
              ? (result.details || result.snippet || result.status || 'Executed successfully')
              : 'Done'}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};
