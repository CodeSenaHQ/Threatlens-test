import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useNavigation } from '../../state/navigation.js';
import { useSecuritySession } from '../../state/securitySession.js';
import { TerminalLayout } from '../../components/TerminalLayout.js';
import { Select } from '../../components/Select.js';

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
    <TerminalLayout
      title="DDoS Traffic Simulation"
      subtitle="Configure distributed traffic load patterns and stress test endpoint limits"
      breadcrumb="SECURITY > DDOS"
      step={step}
      totalSteps={4}
      accentColor="yellow"
      statusText={capturedMessage ? 'SIMULATION DISPATCHED' : `STEP ${step} OF 4`}
      statusType={capturedMessage ? 'success' : 'ready'}
      keyHints={`↑↓ navigate · enter select · esc ${step === 1 ? 'exit' : 'back'}`}
    >
      {/* Step 1: Pattern */}
      {step === 1 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Select Attack Pattern:
          </Text>
          <Box marginTop={1}>
            <Select
              items={[
                { label: '1. Flood (High volume continuous HTTP/TCP flood traffic)', value: 'Flood' as AttackPattern },
                { label: '2. Slowloris-style (Low-and-slow socket and thread pool exhaustion)', value: 'Slowloris-style' as AttackPattern },
                { label: '3. Burst-spike (Intermittent high-amplitude traffic spikes)', value: 'Burst-spike' as AttackPattern },
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
            <Select
              items={[
                { label: '1. Light (Low concurrency probe to gauge baseline latencies)', value: 'Light' as Intensity },
                { label: '2. Medium (Standard baseline threshold stress testing)', value: 'Medium' as Intensity },
                { label: '3. Heavy (Maximal concurrency rate to identify crash thresholds)', value: 'Heavy' as Intensity },
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
            Select Attack Duration:
          </Text>
          {!isEnteringCustom ? (
            <Box marginTop={1}>
              <Select
                items={[
                  { label: '1. 10s (Quick benchmark probe)', value: '10s' as DurationOption },
                  { label: '2. 30s (Standard evaluation window)', value: '30s' as DurationOption },
                  { label: '3. 60s (Extended endurance run)', value: '60s' as DurationOption },
                  { label: '4. Custom (Enter custom duration string)...', value: 'Custom' as DurationOption },
                ]}
                onSelect={handleDurationSelect}
                isFocused={isInteractive}
              />
            </Box>
          ) : (
            <Box flexDirection="column" marginTop={1}>
              <Box flexDirection="row">
                <Box width={24}>
                  <Text color="yellow">› Custom Duration:</Text>
                </Box>
                <Box flexGrow={1}>
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
              </Box>
              {customError ? (
                <Box marginTop={1} paddingLeft={2}>
                  <Text color="red" bold>✗ {customError}</Text>
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
            Review Configuration Summary:
          </Text>
          <Box flexDirection="column" marginY={1} paddingLeft={2}>
            <Text color="gray">
              • Target Base URL: <Text color="cyan" bold>{targetUrl}</Text>
            </Text>
            <Text color="gray">
              • Attack Pattern: <Text color="yellow" bold>{pattern}</Text>
            </Text>
            <Text color="gray">
              • Traffic Intensity: <Text color="yellow" bold>{intensity}</Text>
            </Text>
            <Text color="gray">
              • Duration: <Text color="yellow" bold>{effectiveDuration}</Text>
            </Text>
          </Box>
          <Box marginTop={1}>
            <Select
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
        <Box marginTop={1} paddingLeft={2}>
          <Text color="green" bold>
            ✓ {capturedMessage}
          </Text>
        </Box>
      ) : null}
    </TerminalLayout>
  );
};

export default DdosScreen;
