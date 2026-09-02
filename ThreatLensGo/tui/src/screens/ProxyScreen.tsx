import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { useNavigation } from '../state/navigation.js';
import { useSecuritySession } from '../state/securitySession.js';
import { MultiSelect, MultiSelectItem } from '../components/MultiSelect.js';
import { TerminalLayout } from '../components/TerminalLayout.js';
import { Select } from '../components/Select.js';
import { Spinner } from '../components/Spinner.js';
import { AttackRunner } from '../components/AttackRunner.js';
import { backendClient } from '../api/backendClient.js';
import { formatBackendError } from '../api/errorHandler.js';

type Step = 1 | 2;
type HttpMethod = 'GET' | 'POST';

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

export const ProxyScreen: React.FC = () => {
  const { pop } = useNavigation();
  const { targetUrl } = useSecuritySession();

  const [step, setStep] = useState<Step>(1);
  const [method, setMethod] = useState<HttpMethod>('GET');

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
      const data = await backendClient.getAttackCases('origin-proxy');
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

  useEffect(() => {
    if (step === 2) {
      loadCases();
    }
  }, [step, loadCases]);

  const handleMethodSelect = (item: { value: HttpMethod }) => {
    setMethod(item.value);
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
      await backendClient.patchAttackCases('origin-proxy', patchPayload);
    } catch (err: any) {
      console.warn('Non-blocking: Failed to update Origin Proxy cases on backend:', err.message);
    }

    setIsAttacking(true);
  };

  useInput(
    (_input, key) => {
      if (isAttacking) return;
      if (key.escape) {
        if (step === 2) {
          setStep(1);
        } else {
          pop();
        }
      }
    },
    { isActive: isInteractive }
  );

  const { base_url, endpoint } = parseTargetUrl(targetUrl);
  const proxyConfig = {
    target: {
      base_url,
      endpoint,
      method,
      path_params: null,
      query_params: null,
    },
    request: {
      headers: {},
      auth: null,
      body: null,
    },
    attack: {
      requests_per_case: 1,
      delay: 0.2,
      timeout: 5,
      on_failure: 'continue',
    },
  };

  return (
    <TerminalLayout
      title="Origin & Proxy Interception Assessment"
      subtitle="Evaluate reverse proxy bypasses, IP header spoofing, and CORS preflight heuristics"
      breadcrumb="SECURITY > ORIGIN-PROXY"
      step={step}
      totalSteps={2}
      accentColor="yellow"
      statusText={isAttacking ? 'PROXY ATTACK RUNNING' : `STEP ${step} OF 2`}
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
          {/* Step 1: HTTP Method Selection */}
          {step === 1 && (
            <Box flexDirection="column" marginY={1}>
              <Text bold color="white">
                1. Select Target HTTP Method:
              </Text>
              <Box marginY={1}>
                <Select
                  items={[
                    { label: '1. GET (Standard proxy gateway & CORS probe)', value: 'GET' as HttpMethod },
                    { label: '2. POST (Payload forwarding & header tampering)', value: 'POST' as HttpMethod },
                  ]}
                  onSelect={handleMethodSelect}
                  isFocused={isInteractive}
                />
              </Box>
            </Box>
          )}

          {/* Step 2: Test Cases Selection */}
          {step === 2 && (
            <Box flexDirection="column" marginY={1}>
              <Text bold color="white">
                2. Select Origin Proxy Test Cases:
              </Text>

              {casesLoading ? (
                <Box flexDirection="row" alignItems="center" marginY={1}>
                  <Box marginRight={1}>
                    <Spinner type="dots" color="#38BDF8" />
                  </Box>
                  <Text color="gray">Loading test cases from backend...</Text>
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
          attackType="origin-proxy"
          config={proxyConfig}
          onDone={() => pop()}
        />
      )}
    </TerminalLayout>
  );
};

export default ProxyScreen;
