import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { useNavigation } from '../../state/navigation.js';
import { useSecuritySession } from '../../state/securitySession.js';
import { MultiSelect } from '../../components/MultiSelect.js';
import { TerminalLayout } from '../../components/TerminalLayout.js';
import { Select } from '../../components/Select.js';

type Step = 1 | 2 | 3;
type ExfilVector =
  | 'API response leakage'
  | 'Error message leakage'
  | 'Debug endpoint exposure'
  | 'Header leakage';
type ScanDepth = 'Surface scan' | 'Deep scan';

export const ExfilScreen: React.FC = () => {
  const { pop } = useNavigation();
  const { targetUrl } = useSecuritySession();

  const [step, setStep] = useState<Step>(1);
  const [vectors, setVectors] = useState<ExfilVector[]>([
    'API response leakage',
    'Error message leakage',
  ]);
  const [depth, setDepth] = useState<ScanDepth>('Surface scan');
  const [capturedMessage, setCapturedMessage] = useState<string | null>(null);

  const isInteractive = Boolean(process.stdin?.isTTY);

  const handleVectorsSubmit = (selected: ExfilVector[]) => {
    setVectors(selected);
    setStep(2);
  };

  const handleDepthSelect = (item: { value: ScanDepth }) => {
    setDepth(item.value);
    setStep(3);
  };

  const handleConfirmSelect = (item: { value: 'confirm' | 'back' }) => {
    if (item.value === 'back') {
      setStep(2);
      return;
    }

    const payload = {
      target: targetUrl,
      category: 'exfil',
      params: {
        vectors,
        depth,
      },
    };

    console.log(payload);
    setCapturedMessage('Request captured (backend not yet connected)');
    pop();
  };

  useInput(
    (_input, key) => {
      if (key.escape) {
        if (step === 3) {
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
      title="Data Exfiltration & Leakage Assessment"
      subtitle="Detect inadvertent sensitive disclosures, stack traces, and debug interfaces"
      breadcrumb="SECURITY > EXFIL"
      step={step}
      totalSteps={3}
      accentColor="yellow"
      statusText={capturedMessage ? 'EXFILTRATION SUITE DISPATCHED' : `STEP ${step} OF 3`}
      statusType={capturedMessage ? 'success' : 'ready'}
      keyHints={`↑↓ navigate · space toggle · enter confirm · esc ${step === 1 ? 'exit' : 'back'}`}
    >
      {/* Step 1: Vectors MultiSelect */}
      {step === 1 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Select Exfiltration & Leakage Vectors:
          </Text>
          <Box marginTop={1}>
            <MultiSelect<ExfilVector>
              items={[
                { label: 'API response leakage (PII, tokens, and keys in JSON/XML payloads)', value: 'API response leakage' },
                { label: 'Error message leakage (Verbose stack traces & unhandled exceptions)', value: 'Error message leakage' },
                { label: 'Debug endpoint exposure (/actuator, /debug, /metrics, /env)', value: 'Debug endpoint exposure' },
                { label: 'Header leakage (Server, X-Powered-By, internal hostname headers)', value: 'Header leakage' },
              ]}
              initialSelected={vectors}
              onSubmit={handleVectorsSubmit}
              isFocused={isInteractive}
              minSelected={1}
            />
          </Box>
        </Box>
      )}

      {/* Step 2: Scan Depth Select */}
      {step === 2 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Select Scan Depth:
          </Text>
          <Box marginTop={1}>
            <Select
              items={[
                { label: '1. Surface scan (Fast reconnaissance across exposed public endpoints)', value: 'Surface scan' as ScanDepth },
                { label: '2. Deep scan (Recursive route discovery & active parameter testing)', value: 'Deep scan' as ScanDepth },
              ]}
              onSelect={handleDepthSelect}
              isFocused={isInteractive}
            />
          </Box>
        </Box>
      )}

      {/* Step 3: Confirmation Screen */}
      {step === 3 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Review Configuration Summary:
          </Text>
          <Box flexDirection="column" marginY={1} paddingLeft={2}>
            <Text color="gray">
              • Target Base URL: <Text color="cyan" bold>{targetUrl}</Text>
            </Text>
            <Text color="gray">
              • Exfiltration Vectors: <Text color="yellow" bold>{vectors.join(', ')}</Text>
            </Text>
            <Text color="gray">
              • Scan Depth: <Text color="yellow" bold>{depth}</Text>
            </Text>
          </Box>
          <Box marginTop={1}>
            <Select
              items={[
                { label: 'Confirm & Run Exfiltration Scan', value: 'confirm' as const },
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

export default ExfilScreen;
