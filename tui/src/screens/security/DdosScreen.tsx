import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import { useNavigation } from '../../state/navigation.js';
import { useSecuritySession } from '../../state/securitySession.js';

type Step = 1 | 2 | 3 | 4;
type AttackPattern = 'Flood' | 'Slowloris-style' | 'Burst-spike';
type Intensity = 'Light' | 'Medium' | 'Heavy';
type DurationOption = '10s' | '30s' | '60s' | 'Custom';

export const DdosScreen: React.FC = () => {
  const { pop } = useNavigation();
  const { targetUrl } = useSecuritySession();

  const [step, setStep] = useState<Step>(1);
  const [pattern, setPattern] = useState<AttackPattern>('Flood');
  const [intensity, setIntensity] = useState<Intensity>('Medium');
  const [durationChoice, setDurationChoice] = useState<DurationOption>('30s');
  const [customDuration, setCustomDuration] = useState('');
  const [isEnteringCustom, setIsEnteringCustom] = useState(false);
  const [customError, setCustomError] = useState('');
  const [capturedMessage, setCapturedMessage] = useState<string | null>(null);

  const isInteractive = Boolean(process.stdin?.isTTY);

  const effectiveDuration = durationChoice === 'Custom' ? customDuration : durationChoice;

  const handlePatternSelect = (item: { value: AttackPattern }) => {
    setPattern(item.value);
    setStep(2);
  };

  const handleIntensitySelect = (item: { value: Intensity }) => {
    setIntensity(item.value);
    setStep(3);
  };

  const handleDurationSelect = (item: { value: DurationOption }) => {
    if (item.value === 'Custom') {
      setDurationChoice('Custom');
      setIsEnteringCustom(true);
    } else {
      setDurationChoice(item.value);
      setIsEnteringCustom(false);
      setStep(4);
    }
  };

  const handleCustomDurationSubmit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setCustomError('Custom duration cannot be empty.');
      return;
    }
    setCustomError('');
    setCustomDuration(trimmed);
    setIsEnteringCustom(false);
    setStep(4);
  };

  const handleConfirmSelect = (item: { value: 'confirm' | 'back' }) => {
    if (item.value === 'back') {
      setStep(3);
      return;
    }

    const payload = {
      target: targetUrl,
      category: 'ddos',
      params: {
        pattern,
        intensity,
        duration: effectiveDuration,
      },
    };

    // Log the collected payload without calling backend
    console.log(payload);
    setCapturedMessage('Request captured (backend not yet connected)');
    pop();
  };

  useInput(
    (_input, key) => {
      if (key.escape) {
        if (isEnteringCustom) {
          setIsEnteringCustom(false);
        } else if (step === 4) {
          setStep(3);
        } else if (step === 3) {
          setStep(2);
        } else if (step === 2) {
          setStep(1);
        } else {
          pop();
        }
      }
    },
    { isActive: isInteractive }
  );

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1} borderStyle="round" borderColor="red" width={70}>
      <Box marginBottom={1} flexDirection="column">
        <Text bold color="red">
          DDoS Simulation Configuration [Step {step}/4]
        </Text>
        <Text dimColor color="gray">
          Target: {targetUrl || 'Not configured'}
        </Text>
      </Box>

      {/* Step 1: Pattern */}
      {step === 1 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Select Attack Pattern:
          </Text>
          <Box marginTop={1}>
            <SelectInput
              items={[
                { label: '1. Flood (High volume continuous traffic)', value: 'Flood' as AttackPattern },
                { label: '2. Slowloris-style (Low-and-slow socket exhaustion)', value: 'Slowloris-style' as AttackPattern },
                { label: '3. Burst-spike (Intermittent high-amplitude spikes)', value: 'Burst-spike' as AttackPattern },
              ]}
              onSelect={handlePatternSelect}
              isFocused={isInteractive}
            />
          </Box>
        </Box>
      )}

      {/* Step 2: Intensity */}
      {step === 2 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Select Traffic Intensity:
          </Text>
          <Box marginTop={1}>
            <SelectInput
              items={[
                { label: '1. Light (Low concurrency probe)', value: 'Light' as Intensity },
                { label: '2. Medium (Standard baseline threshold testing)', value: 'Medium' as Intensity },
                { label: '3. Heavy (High volume stress load)', value: 'Heavy' as Intensity },
              ]}
              onSelect={handleIntensitySelect}
              isFocused={isInteractive}
            />
          </Box>
        </Box>
      )}

      {/* Step 3: Duration */}
      {step === 3 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Select Duration:
          </Text>
          {!isEnteringCustom ? (
            <Box marginTop={1}>
              <SelectInput
                items={[
                  { label: '1. 10s', value: '10s' as DurationOption },
                  { label: '2. 30s', value: '30s' as DurationOption },
                  { label: '3. 60s', value: '60s' as DurationOption },
                  { label: '4. Custom duration...', value: 'Custom' as DurationOption },
                ]}
                onSelect={handleDurationSelect}
                isFocused={isInteractive}
              />
            </Box>
          ) : (
            <Box flexDirection="column" marginTop={1}>
              <Box flexDirection="row">
                <Box width={20}>
                  <Text color="yellow">Enter duration:</Text>
                </Box>
                <TextInput
                  value={customDuration}
                  onChange={(val) => {
                    setCustomDuration(val);
                    if (customError) setCustomError('');
                  }}
                  onSubmit={handleCustomDurationSubmit}
                  focus={isInteractive}
                  placeholder="e.g. 45s, 2m, 120s"
                />
              </Box>
              {customError ? (
                <Box marginTop={1}>
                  <Text color="red">✗ {customError}</Text>
                </Box>
              ) : null}
            </Box>
          )}
        </Box>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Review Configuration:
          </Text>
          <Box flexDirection="column" marginY={1} paddingLeft={2}>
            <Text color="gray">
              • Target: <Text color="cyan">{targetUrl}</Text>
            </Text>
            <Text color="gray">
              • Attack Pattern: <Text color="yellow">{pattern}</Text>
            </Text>
            <Text color="gray">
              • Intensity: <Text color="yellow">{intensity}</Text>
            </Text>
            <Text color="gray">
              • Duration: <Text color="yellow">{effectiveDuration}</Text>
            </Text>
          </Box>
          <Box marginTop={1}>
            <SelectInput
              items={[
                { label: 'Confirm & Launch Simulation', value: 'confirm' as const },
                { label: 'Back to edit', value: 'back' as const },
              ]}
              onSelect={handleConfirmSelect}
              isFocused={isInteractive}
            />
          </Box>
        </Box>
      )}

      {capturedMessage ? (
        <Box marginTop={1}>
          <Text color="green" bold>
            ✓ {capturedMessage}
          </Text>
        </Box>
      ) : null}

      <Box marginTop={1}>
        <Text dimColor color="gray">
          [↑/↓] Navigate  •  [Enter] Select  •  [Esc] {step === 1 ? 'Exit to Security Menu' : 'Previous step'}
        </Text>
      </Box>
    </Box>
  );
};

export default DdosScreen;
