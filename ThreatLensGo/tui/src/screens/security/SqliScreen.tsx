import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useNavigation } from '../../state/navigation.js';
import { useSecuritySession } from '../../state/securitySession.js';
import { MultiSelect, MultiSelectItem } from '../../components/MultiSelect.js';
import { TerminalLayout } from '../../components/TerminalLayout.js';
import { Select } from '../../components/Select.js';
import { Spinner } from '../../components/Spinner.js';
import { AttackRunner } from '../../components/AttackRunner.js';
import { backendClient } from '../../api/backendClient.js';
import { formatBackendError } from '../../api/errorHandler.js';

type Step = 1 | 2 | 3;
type HttpMethod = 'GET' | 'POST';
type ParamSource = 'Auto-discover' | 'Specify param name';

function parseTargetUrl(raw: string): { base_url: string; endpoint: string } {
  try {
    const u = new URL(raw.startsWith('http') ? raw : `http://${raw}`);
    return {
      base_url: `${u.protocol}//${u.host}`,
      endpoint: u.pathname && u.pathname !== '' ? u.pathname : '/',
    };
  } catch {
    return {
      base_url: raw,
      endpoint: '/',
    };
  }
}

export const SqliScreen: React.FC = () => {
  const { pop } = useNavigation();
  const { targetUrl } = useSecuritySession();

  const [step, setStep] = useState<Step>(1);
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [paramSource, setParamSource] = useState<ParamSource>('Auto-discover');
  const [paramName, setParamName] = useState('');
  const [isEnteringParamName, setIsEnteringParamName] = useState(false);
  const [paramError, setParamError] = useState('');

  // Case Management State
  const [casesLoading, setCasesLoading] = useState(false);
  const [casesError, setCasesError] = useState('');
  const [casesDict, setCasesDict] = useState<Record<string, any>>({});
  const [caseItems, setCaseItems] = useState<MultiSelectItem[]>([]);
  const [selectedCaseNames, setSelectedCaseNames] = useState<string[]>([]);

  // Execution State
  const [isAttacking, setIsAttacking] = useState(false);

  const isInteractive = Boolean(process.stdin?.isTTY);

  const loadCases = useCallback(async () => {
    setCasesLoading(true);
    setCasesError('');
    try {
      const data = await backendClient.getAttackCases('sqli');
      if (data && typeof data === 'object') {
        setCasesDict(data);
        const keys = Object.keys(data);
        const items = keys.map((k) => ({
          label: `${k} ${data[k]?.description ? `(${data[k].description})` : ''}`,
          value: k,
        }));
        setCaseItems(items);
        const initial = keys.filter((k) => data[k]?.enabled !== false);
        setSelectedCaseNames(initial.length > 0 ? initial : keys);
      } else {
        throw new Error('Invalid test cases structure received from backend.');
      }
    } catch (err: any) {
      setCasesError(formatBackendError(err));
    } finally {
      setCasesLoading(false);
    }
  }, []);

  // Fetch cases when advancing to Step 2
  useEffect(() => {
    if (step === 2) {
      loadCases();
    }
  }, [step, loadCases]);

  const handleMethodSelect = (item: { value: HttpMethod }) => {
    setMethod(item.value);
    setStep(2); // Step 2 is now parameter / case configuration
  };

  const handleParamSourceSelect = (item: { value: ParamSource }) => {
    setParamSource(item.value);
    if (item.value === 'Specify param name') {
      setIsEnteringParamName(true);
    } else {
      setIsEnteringParamName(false);
      setParamName('');
      setStep(2);
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
    setStep(2);
  };

  const handleCasesSubmit = async (selected: string[]) => {
    if (selected.length === 0) {
      setCasesError('No test cases selected — select at least one test case.');
      return;
    }
    setCasesError('');
    setSelectedCaseNames(selected);

    // Prepare PATCH array
    const patchPayload = Object.keys(casesDict).map((caseName) => ({
      case: caseName,
      enabled: selected.includes(caseName),
    }));

    try {
      await backendClient.patchAttackCases('sqli', patchPayload);
    } catch (err: any) {
      // PATCH failure: non-blocking per spec
      console.warn('Non-blocking: Failed to update SQLi cases on backend:', err.message);
    }

    setIsAttacking(true);
  };

  useInput(
    (_input, key) => {
      if (isAttacking) return;
      if (key.escape) {
        if (isEnteringParamName) {
          setIsEnteringParamName(false);
        } else if (step === 2) {
          setStep(1);
        } else {
          pop();
        }
      }
    },
    { isActive: isInteractive }
  );

  const { base_url, endpoint } = parseTargetUrl(targetUrl);
  const sqliConfig = {
    target: {
      base_url,
      endpoint,
      method,
      query_params: paramSource === 'Specify param name' && paramName ? { [paramName]: 'test' } : {},
      path_params: {},
    },
    request: {
      headers: {},
      body: method === 'POST' && paramSource === 'Specify param name' && paramName ? { [paramName]: 'test' } : {},
      auth: null,
    },
    attack: {
      requests_per_case: 1,
      delay: 0.1,
      timeout: 5,
      on_failure: 'continue',
    },
  };

  return (
    <TerminalLayout
      title="SQL Injection Assessment"
      subtitle="Probe database boundaries, error heuristics, and query structure vulnerabilities"
      breadcrumb="SECURITY > SQLI"
      step={step}
      totalSteps={2}
      accentColor="yellow"
      statusText={isAttacking ? 'SQLI ATTACK RUNNING' : `STEP ${step} OF 2`}
      statusType={isAttacking ? 'warning' : 'ready'}
      keyHints={
        isAttacking
          ? 's / esc halt attack'
          : step === 2
          ? 'space toggle · enter confirm · esc back'
          : `↑↓ navigate · enter select · esc ${step === 1 ? 'exit' : 'back'}`
      }
    >
      {!isAttacking ? (
        <>
          {/* Step 1: Target Method & Parameter Configuration */}
          {step === 1 && (
            <Box flexDirection="column" marginY={1}>
              <Text bold color="white">
                1. Select HTTP Method:
              </Text>
              <Box marginY={1}>
                <Select
                  items={[
                    { label: '1. GET (Inspect query parameters & URL heuristics)', value: 'GET' as HttpMethod },
                    { label: '2. POST (Inspect request bodies, form submissions, & JSON payloads)', value: 'POST' as HttpMethod },
                  ]}
                  onSelect={handleMethodSelect}
                  isFocused={isInteractive}
                />
              </Box>
            </Box>
          )}

          {/* Step 2: Test Case Selection (Loaded from Backend) */}
          {step === 2 && (
            <Box flexDirection="column" marginY={1}>
              <Text bold color="white">
                2. Select SQLi Attack Vectors & Test Cases:
              </Text>

              {casesLoading ? (
                <Box flexDirection="row" alignItems="center" marginY={1}>
                  <Box marginRight={1}>
                    <Spinner type="dots" color="#38BDF8" />
                  </Box>
                  <Text color="gray">Loading attack test cases from backend...</Text>
                </Box>
              ) : casesError ? (
                <Box flexDirection="column" marginY={1}>
                  <Text color="red" bold>
                    ✗ {casesError}
                  </Text>
                  <Box marginTop={1}>
                    <Select
                      items={[
                        { label: '1. Run with default cases', value: 'default' as const },
                        { label: '2. Go back to config', value: 'back' as const },
                      ]}
                      onSelect={(item) => {
                        if (item.value === 'default') {
                          setIsAttacking(true);
                        } else {
                          setStep(1);
                        }
                      }}
                      isFocused={isInteractive}
                    />
                  </Box>
                </Box>
              ) : caseItems.length > 0 ? (
                <Box flexDirection="column" marginTop={1}>
                  <MultiSelect
                    items={caseItems}
                    initialSelected={selectedCaseNames}
                    minSelected={1}
                    onSubmit={handleCasesSubmit}
                    isFocused={isInteractive}
                  />
                </Box>
              ) : (
                <Box marginY={1}>
                  <Text color="yellow">No cases returned by backend.</Text>
                </Box>
              )}
            </Box>
          )}
        </>
      ) : (
        <AttackRunner
          attackType="sqli"
          config={sqliConfig}
          onDone={() => pop()}
        />
      )}
    </TerminalLayout>
  );
};

export default SqliScreen;
