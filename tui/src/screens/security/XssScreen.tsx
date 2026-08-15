import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useNavigation } from '../../state/navigation.js';
import { useSecuritySession } from '../../state/securitySession.js';
import { MultiSelect } from '../../components/MultiSelect.js';
import { TerminalLayout } from '../../components/TerminalLayout.js';

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
      title={`CROSS-SITE SCRIPTING (XSS) TESTING [STEP ${step}/3]`}
      subtitle="Analyze sanitization routines across reflected inputs, persistent sinks, and DOM scripts"
      breadcrumb="SECURITY > XSS"
      borderColor="yellow"
      statusText={capturedMessage ? 'XSS SUITE DISPATCHED' : `CONFIGURING STEP ${step} OF 3`}
      statusType={capturedMessage ? 'success' : 'ready'}
      keyHints={`[↑/↓] Navigate  •  [Enter] Select/Confirm  •  [Esc] ${step === 1 ? 'Exit to Security Menu' : 'Previous step'}`}
    >
      {/* Step 1: XSS Types MultiSelect */}
      {step === 1 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="white">
            Select XSS Types to Test (Space to toggle, Enter to confirm):
          </Text>
          <Box marginTop={1}>
            <MultiSelect<XssType>
              items={[
                { label: 'Reflected (Non-persistent immediate server-side reflection)', value: 'Reflected' },
                { label: 'Stored (Persistent payload execution rendered from backend storage)', value: 'Stored' },
                { label: 'DOM-based (Client-side execution inside browser script sinks)', value: 'DOM-based' },
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
            Select Primary Injection Point:
          </Text>
          <Box marginTop={1}>
            <SelectInput
              items={[
                { label: '1. Query param (URL parameters & search query inputs)', value: 'Query param' as InjectionPoint },
                { label: '2. Form field (Request body inputs & multipart form values)', value: 'Form field' as InjectionPoint },
                { label: '3. Header (Custom HTTP request headers, User-Agent, Referer)', value: 'Header' as InjectionPoint },
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
            Review Configuration Summary:
          </Text>
          <Box flexDirection="column" marginY={1} borderStyle="single" borderColor="gray" paddingX={2} paddingY={1}>
            <Text color="gray">
              • Target Base URL: <Text color="cyan" bold>{targetUrl}</Text>
            </Text>
            <Text color="gray">
              • XSS Categories: <Text color="yellow" bold>{types.join(', ')}</Text>
            </Text>
            <Text color="gray">
              • Injection Point: <Text color="yellow" bold>{injectionPoint}</Text>
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
    </TerminalLayout>
  );
};

export default XssScreen;
