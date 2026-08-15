import React, { useState, useEffect } from 'react';
import { Text } from 'ink';

const PROMPTS = [
  'Scan public repository for leaked secrets & CVEs',
  'Simulate Slowloris HTTP socket exhaustion test',
  'Probe endpoints for Union-based SQL injection',
  'Audit DOM script sinks for Cross-Site Scripting',
  'Inspect API responses for sensitive data leakage',
  'Stress test 429 rate limit enforcement thresholds',
  'Type / to explore all offensive security modules',
];

export const useLiveTypewriter = (active: boolean = true): string => {
  const [promptIdx, setPromptIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!active) return;

    const fullText = PROMPTS[promptIdx] || PROMPTS[0];
    const speed = isDeleting ? 30 : 60;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (displayedText.length < fullText.length) {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        } else {
          // Pause at full text for 2.5s before deleting
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        // Deleting backward
        if (displayedText.length > 0) {
          setDisplayedText(fullText.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setPromptIdx((prev) => (prev + 1) % PROMPTS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, promptIdx, active]);

  return displayedText;
};

export const LiveTypewriterPlaceholder: React.FC<{ prefix?: string }> = ({
  prefix = 'Ask anything or type / ... ',
}) => {
  const typedText = useLiveTypewriter(true);

  return (
    <Text color="gray" dimColor>
      {prefix}"{typedText}"
    </Text>
  );
};

export default LiveTypewriterPlaceholder;
