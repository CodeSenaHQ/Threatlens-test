import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useNavigation } from '../../state/navigation.js';
import { useSecuritySession } from '../../state/securitySession.js';
import { MultiSelect } from '../../components/MultiSelect.js';

type Step = 1 | 2 | 3;
type XssType = 'Reflected' | 'Stored' | 'DOM-based';
type InjectionPoint = 'Query param' | 'Form field' | 'Header';

export const XssScreen: React.FC = () => {
  const { pop } = useNavigation();
  const { targetUrl } = useSecuritySession();

  const [step, setStep] = useState<Step>(1);
  const [types, setTypes] = useState<XssType[]>(['Reflected']);
  const [injectionPoint, setInjectionPoint] = useState<InjectionPoint>('Query param');
  const [capturedMessage, setCapturedMessage] = useState<string | null>(null);

  const isInteractive = Boolean(process.stdin?.isTTY);

  const handleTypesSubmit = (selected: XssType[]) => {
    setTypes(selected);
    setStep(2);
  };

  const handleInjectionPointSelect = (item: { value: InjectionPoint }) => {
    setInjectionPoint(item.value);
    setStep(3);
  };

  const handleConfirmSelect = (item: { value: 'confirm' | 'back' }) => {
    if (item.value === 'back') {
      setStep(2);
      return;
    }

    const payload = {
      target: targetUrl,
      category: 'xss',
      params: {
        types,
        injectionPoint,
      },
    };

    // Log payload without backend invocation
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
    <Box flexDirection="column" paddingX={2} paddingY={1} borderStyle="round" borderColor="yellow" width={72}>
      <Box marginBottom={1} flexDirection="column">
        <Text bold color="yellow">
          Cross-Site Scripting (XSS) Testing [Step {step}/3]
        </Text>
        <Text dimColor color="gray">
          Target: {targetUrl || 'Not configured'}
        </Text>
      </Box>

      {/* Step 1: XSS Types MultiSelect */}
      {step === 1 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Select XSS Types to Test:
          </Text>
          <Box marginTop={1}>
            <MultiSelect<XssType>
              items={[
                { label: 'Reflected (Non-persistent server-side reflection)', value: 'Reflected' },
                { label: 'Stored (Persistent payload execution in storage)', value: 'Stored' },
                { label: 'DOM-based (Client-side script sink execution)', value: 'DOM-based' },
              ]}
              initialSelected={types}
              onSubmit={handleTypesSubmit}
              isFocused={isInteractive}
              minSelected={1}
            />
          </Box>
        </Box>
      )}

      {/* Step 2: Injection Point Select */}
      {step === 2 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Select Injection Point:
          </Text>
          <Box marginTop={1}>
            <SelectInput
              items={[
                { label: '1. Query param (URL parameters)', value: 'Query param' as InjectionPoint },
                { label: '2. Form field (Request body inputs)', value: 'Form field' as InjectionPoint },
                { label: '3. Header (Custom HTTP headers & User-Agent)', value: 'Header' as InjectionPoint },
              ]}
              onSelect={handleInjectionPointSelect}
              isFocused={isInteractive}
            />
          </Box>
        </Box>
      )}

      {/* Step 3: Confirmation Screen */}
      {step === 3 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Review Configuration:
          </Text>
          <Box flexDirection="column" marginY={1} paddingLeft={2}>
            <Text color="gray">
              • Target: <Text color="cyan">{targetUrl}</Text>
            </Text>
            <Text color="gray">
              • XSS Types: <Text color="yellow">{types.join(', ')}</Text>
            </Text>
            <Text color="gray">
              • Injection Point: <Text color="yellow">{injectionPoint}</Text>
            </Text>
          </Box>
          <Box marginTop={1}>
            <SelectInput
              items={[
                { label: 'Confirm & Run XSS Tests', value: 'confirm' as const },
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
          [↑/↓] Navigate  •  [Enter] Select/Confirm  •  [Esc] {step === 1 ? 'Exit to Security Menu' : 'Previous step'}
        </Text>
      </Box>
    </Box>
  );
};

export default XssScreen;
