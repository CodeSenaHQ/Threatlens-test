import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import { useNavigation } from '../../state/navigation.js';
import { useSecuritySession } from '../../state/securitySession.js';
import { MultiSelect } from '../../components/MultiSelect.js';
import { TerminalLayout } from '../../components/TerminalLayout.js';

type Step = 1 | 2 | 3 | 4;
type HttpMethod = 'GET' | 'POST';
type ParamSource = 'Auto-discover' | 'Specify param name';
type InjectionCategory =
  | 'Error-based'
  | 'Union-based'
  | 'Blind (boolean)'
  | 'Blind (time-based)';

export const SqliScreen: React.FC = () => {
  const { pop } = useNavigation();
  const { targetUrl } = useSecuritySession();

  const [step, setStep] = useState<Step>(1);
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [paramSource, setParamSource] = useState<ParamSource>('Auto-discover');
  const [paramName, setParamName] = useState('');
  const [isEnteringParamName, setIsEnteringParamName] = useState(false);
  const [paramError, setParamError] = useState('');
  const [injectionCategories, setInjectionCategories] = useState<InjectionCategory[]>([
    'Error-based',
    'Union-based',
  ]);
  const [capturedMessage, setCapturedMessage] = useState<string | null>(null);

  const isInteractive = Boolean(process.stdin?.isTTY);

  const handleMethodSelect = (item: { value: HttpMethod }) => {
    setMethod(item.value);
    setStep(2);
  };

  const handleParamSourceSelect = (item: { value: ParamSource }) => {
    setParamSource(item.value);
    if (item.value === 'Specify param name') {
      setIsEnteringParamName(true);
    } else {
      setIsEnteringParamName(false);
      setParamName('');
      setStep(3);
    }
  };

  const handleParamNameSubmit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setParamError('Parameter name cannot be empty.');
      return;
    }
    setParamError('');
    setParamName(trimmed);
    setIsEnteringParamName(false);
    setStep(3);
  };

  const handleCategoriesSubmit = (selected: InjectionCategory[]) => {
    setInjectionCategories(selected);
    setStep(4);
  };

  const handleConfirmSelect = (item: { value: 'confirm' | 'back' }) => {
    if (item.value === 'back') {
      setStep(3);
      return;
    }

    const payload = {
      target: targetUrl,
      category: 'sqli',
      params: {
        method,
        paramSource,
        ...(paramSource === 'Specify param name' && paramName ? { paramName } : {}),
        injectionCategories,
      },
    };

    console.log(payload);
    setCapturedMessage('Request captured (backend not yet connected)');
    pop();
  };

  useInput(
    (_input, key) => {
      if (key.escape) {
        if (isEnteringParamName) {
          setIsEnteringParamName(false);
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
      title={`SQL INJECTION TESTING [STEP ${step}/4]`}
      subtitle="Fuzz query and body inputs to uncover syntax errors, union leakages, and blind execution delays"
      breadcrumb="SECURITY > SQLI"
      borderColor="red"
      statusText={capturedMessage ? 'INJECTION SUITE DISPATCHED' : `CONFIGURING STEP ${step} OF 4`}
      statusType={capturedMessage ? 'success' : 'ready'}
      keyHints={`[↑/↓] Navigate  •  [Enter] Select/Confirm  •  [Esc] ${step === 1 ? 'Exit to Security Menu' : 'Previous step'}`}
    >
      {/* Step 1: HTTP Method */}
      {step === 1 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Select HTTP Request Method:
          </Text>
          <Box marginTop={1}>
            <SelectInput
              items={[
                { label: '1. GET (Inspect query parameters & URL strings)', value: 'GET' as HttpMethod },
                { label: '2. POST (Inspect request bodies, form submissions & JSON payloads)', value: 'POST' as HttpMethod },
              ]}
              onSelect={handleMethodSelect}
              isFocused={isInteractive}
            />
          </Box>
        </Box>
      )}

      {/* Step 2: Parameter Source */}
      {step === 2 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Parameter Discovery Mode:
          </Text>
          {!isEnteringParamName ? (
            <Box marginTop={1}>
              <SelectInput
                items={[
                  { label: '1. Auto-discover parameters from target endpoint responses', value: 'Auto-discover' as ParamSource },
                  { label: '2. Specify custom target parameter name manually', value: 'Specify param name' as ParamSource },
                ]}
                onSelect={handleParamSourceSelect}
                isFocused={isInteractive}
              />
            </Box>
          ) : (
            <Box flexDirection="column" marginTop={1}>
              <Box flexDirection="row">
                <Box width={26}>
                  <Text color="yellow">Target Parameter Name:</Text>
                </Box>
                <Box flexGrow={1}>
                  <TextInput
                    value={paramName}
                    onChange={(val) => {
                      setParamName(val);
                      if (paramError) setParamError('');
                    }}
                    onSubmit={handleParamNameSubmit}
                    focus={isInteractive}
                    placeholder="e.g. id, search, user, query, token"
                  />
                </Box>
              </Box>
              {paramError ? (
                <Box marginTop={1}>
                  <Text color="red" bold>✗ {paramError}</Text>
                </Box>
              ) : null}
            </Box>
          )}
        </Box>
      )}

      {/* Step 3: Injection Categories Multi-Select */}
      {step === 3 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Select Injection Categories to Test (Space to toggle, Enter to confirm):
          </Text>
          <Box marginTop={1}>
            <MultiSelect<InjectionCategory>
              items={[
                { label: 'Error-based (Syntax error inspection & database fingerprinting)', value: 'Error-based' },
                { label: 'Union-based (UNION SELECT schema structure extraction)', value: 'Union-based' },
                { label: 'Blind (boolean) (True/False conditional diff queries)', value: 'Blind (boolean)' },
                { label: 'Blind (time-based) (Sleep / Benchmark latency evaluation probes)', value: 'Blind (time-based)' },
              ]}
              initialSelected={injectionCategories}
              onSubmit={handleCategoriesSubmit}
              isFocused={isInteractive}
              minSelected={1}
            />
          </Box>
        </Box>
      )}

      {/* Step 4: Confirmation Screen */}
      {step === 4 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Review Configuration Summary:
          </Text>
          <Box flexDirection="column" marginY={1} borderStyle="single" borderColor="gray" paddingX={2} paddingY={1}>
            <Text color="gray">
              • Target Base URL: <Text color="cyan" bold>{targetUrl}</Text>
            </Text>
            <Text color="gray">
              • HTTP Method: <Text color="yellow" bold>{method}</Text>
            </Text>
            <Text color="gray">
              • Parameter Source: <Text color="yellow" bold>{paramSource}</Text>
            </Text>
            {paramSource === 'Specify param name' && (
              <Text color="gray">
                • Target Parameter: <Text color="yellow" bold>{paramName}</Text>
              </Text>
            )}
            <Text color="gray">
              • Injection Categories: <Text color="yellow" bold>{injectionCategories.join(', ')}</Text>
            </Text>
          </Box>
          <Box marginTop={1}>
            <SelectInput
              items={[
                { label: 'Confirm & Run SQLi Tests', value: 'confirm' as const },
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
    </TerminalLayout>
  );
};

export default SqliScreen;
