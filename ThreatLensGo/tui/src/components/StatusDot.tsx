import React from 'react';
import { Text } from 'ink';
import { useSpinnerFrame } from '../hooks/useSpinnerFrame.js';

export type StatusType = 'ready' | 'success' | 'warning' | 'error';

interface StatusDotProps {
  statusType: StatusType;
  statusText: string;
}

/**
 * Isolated status dot — only this re-renders on animation ticks.
 * TerminalLayout (and all its children) stay completely still.
 */
export const StatusDot: React.FC<StatusDotProps> = ({ statusType, statusText }) => {
  // Only animate when actively processing — use slower interval for ready
  const isProcessing = statusText.toUpperCase().includes('PROCESS');
  const dotsFrame = useSpinnerFrame('dots', 80);
  const pulseFrame = useSpinnerFrame('pulse', 600);

  const getColor = () => {
    switch (statusType) {
      case 'success': return 'green';
      case 'error':   return 'red';
      case 'warning': return 'yellow';
      default:        return 'cyan';
    }
  };

  const getIndicator = () => {
    switch (statusType) {
      case 'success': return '✓';
      case 'error':   return '✗';
      case 'warning': return '⚠';
      default:        return isProcessing ? dotsFrame : pulseFrame;
    }
  };

  const color = getColor();
  return (
    <>
      <Text color={color} bold>{getIndicator()}{' '}</Text>
      <Text color={color} bold>{statusText.toUpperCase()}</Text>
    </>
  );
};

export default StatusDot;
