import React from 'react';
import { Box, Text } from 'ink';

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
      case 'verify_remediation':
        return '✅';
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
      marginY={0}
      paddingX={1}
      borderStyle="single"
      borderColor={status === 'running' ? 'yellow' : status === 'error' ? 'red' : 'green'}
    >
      <Box flexDirection="row" alignItems="center">
        {status === 'running' ? (
          <Text color="yellow" bold>
            ▶{' '}
          </Text>
        ) : status === 'completed' ? (
          <Text color="green" bold>
            ✓{' '}
          </Text>
        ) : (
          <Text color="red" bold>
            ✗{' '}
          </Text>
        )}
        <Text color="white" bold>
          {getToolIcon()} {toolName}
        </Text>
        {args ? (
          <Text color="gray" dimColor>
            {' '}
            {getArgsSummary()}
          </Text>
        ) : null}
      </Box>

      {status === 'running' ? (
        <Box marginTop={0} paddingLeft={2}>
          <Text color="yellow" dimColor>
            Executing...
          </Text>
        </Box>
      ) : result ? (
        <Box marginTop={0} paddingLeft={2}>
          <Text color="gray" dimColor>
            ↳ {typeof result === 'object' ? JSON.stringify(result).slice(0, 70) + '...' : String(result).slice(0, 70)}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};

export default ToolBadge;
