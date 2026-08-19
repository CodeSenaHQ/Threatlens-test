import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { TerminalLayout } from '../components/TerminalLayout.js';
import { ToolBadge } from '../components/ToolBadge.js';
import { DiffApprovalModal } from '../components/DiffApprovalModal.js';
import { useNavigation } from '../state/navigation.js';
import { AgentController, AgentEvent, DiffApprovalPayload } from '../agent/types.js';
import { ThreatLensAgentManager, AgentManagerStats } from '../agent/agentManager.js';
import { MockAgentController } from '../agent/MockAgentController.js';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}

interface ToolExecution {
  callId: string;
  toolName: string;
  args?: Record<string, any>;
  status: 'running' | 'completed' | 'error';
  result?: any;
}

export interface AgentChatScreenProps {
  controller?: AgentController;
  initialPrompt?: string;
}

export const AgentChatScreen: React.FC<AgentChatScreenProps> = ({
  controller: customController,
  initialPrompt,
}) => {
  const { pop } = useNavigation();

  const [controller, setController] = useState<AgentController | null>(customController || null);
  const [managerStats, setManagerStats] = useState<AgentManagerStats | null>(null);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAgentText, setCurrentAgentText] = useState('');
  const [tools, setTools] = useState<ToolExecution[]>([]);
  const [activeApproval, setActiveApproval] = useState<DiffApprovalPayload | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Initializing codebase index and agent engine...');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const managerRef = useRef<ThreatLensAgentManager | null>(null);
  const textBufferRef = useRef<string>('');
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);

  const flushTextBuffer = () => {
    if (textBufferRef.current) {
      const textToAppend = textBufferRef.current;
      textBufferRef.current = '';
      setCurrentAgentText((prev) => prev + textToAppend);
    }
  };

  // Initialize Agent Manager if controller not provided
  useEffect(() => {
    let isMounted = true;

    if (!customController) {
      const manager = new ThreatLensAgentManager();
      managerRef.current = manager;

      manager
        .init()
        .then((ctrl) => {
          if (isMounted) {
            setController(ctrl);
            const stats = manager.getStats();
            setManagerStats(stats);
            setStatusMessage(
              `Ready · ${stats.totalFiles} files · ${stats.totalSymbols} symbols · ${stats.totalDependencies} deps`
            );
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.error('Failed to init agent manager:', err);
            const fallback = new MockAgentController();
            setController(fallback);
            setStatusMessage('Ready (Fallback Mock Mode)');
          }
        });
    }

    return () => {
      isMounted = false;
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
      }
      if (managerRef.current) {
        managerRef.current.shutdown().catch(() => {});
      }
    };
  }, [customController]);

  // Subscribe to controller events
  useEffect(() => {
    if (!controller) return;

    const unsubscribe = controller.onEvent((event: AgentEvent) => {
      switch (event.type) {
        case 'token':
          setIsRunning(true);
          textBufferRef.current += event.delta;
          if (!flushTimerRef.current) {
            flushTimerRef.current = setTimeout(() => {
              flushTimerRef.current = null;
              flushTextBuffer();
            }, 75); // 75ms calm buffer flush (zero screen jump)
          }
          break;

        case 'status':
          setStatusMessage(event.message);
          break;

        case 'tool_start':
          if (flushTimerRef.current) {
            clearTimeout(flushTimerRef.current);
            flushTimerRef.current = null;
          }
          flushTextBuffer();
          setIsRunning(true);
          setTools((prev) => [
            ...prev.filter((t) => t.callId !== event.callId),
            {
              callId: event.callId,
              toolName: event.toolName,
              args: event.args,
              status: 'running',
            },
          ]);
          break;

        case 'tool_result':
          setTools((prev) =>
            prev.map((t) =>
              t.callId === event.callId
                ? { ...t, status: event.isError ? 'error' : 'completed', result: event.result }
                : t
            )
          );
          break;

        case 'require_approval':
          if (flushTimerRef.current) {
            clearTimeout(flushTimerRef.current);
            flushTimerRef.current = null;
          }
          flushTextBuffer();
          setActiveApproval(event.payload);
          setStatusMessage('Waiting for user code modification approval');
          break;

        case 'done':
          if (flushTimerRef.current) {
            clearTimeout(flushTimerRef.current);
            flushTimerRef.current = null;
          }
          flushTextBuffer();
          setIsRunning(false);
          setActiveApproval(null);
          setStatusMessage(`Finished: ${event.summary}`);
          setCurrentAgentText((prev) => {
            if (prev) {
              setMessages((m) => [...m, { id: Date.now().toString(), sender: 'agent', text: prev }]);
            }
            return '';
          });
          break;

        case 'error':
          if (flushTimerRef.current) {
            clearTimeout(flushTimerRef.current);
            flushTimerRef.current = null;
          }
          flushTextBuffer();
          setIsRunning(false);
          setActiveApproval(null);
          setStatusMessage(`Error: ${event.error}`);
          break;
      }
    });

    // Handle initial prompt if provided
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
    }

    return () => {
      unsubscribe();
      controller.cancel();
    };
  }, [controller, initialPrompt]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend ?? inputQuery).trim();
    if (!q || isRunning || activeApproval || !controller) return;

    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: q }]);
    setInputQuery('');
    setCurrentAgentText('');
    setTools([]);
    setActiveApproval(null);
    setIsRunning(true);

    controller.submitQuery(q);
  };

  const handleApproveDiff = (id: string) => {
    if (!controller) return;
    setActiveApproval(null);
    controller.approveDiff(id);
  };

  const handleRejectDiff = (id: string, reason?: string) => {
    if (!controller) return;
    setActiveApproval(null);
    controller.rejectDiff(id, reason);
  };

  const handleCancel = () => {
    if (!controller) return;
    if (activeApproval) {
      setActiveApproval(null);
      controller.rejectDiff(activeApproval.id, 'Approval cancelled');
    } else if (isRunning) {
      controller.cancel();
    } else {
      pop();
    }
  };

  // Keyboard navigation when not typing
  useInput((input, key) => {
    if (key.escape && !activeApproval) {
      if (isRunning && controller) {
        controller.cancel();
      } else {
        pop();
      }
    }
  });

  const subtitle = managerStats
    ? `${managerStats.totalFiles} Files · ${managerStats.totalSymbols} AST Symbols · Model: ${managerStats.modelName}`
    : 'Deterministic Codebase Intelligence, AST Analysis & Automated Patching';

  // Keep last 4 messages to preserve stable terminal height
  const visibleMessages = messages.slice(-4);

  return (
    <TerminalLayout
      title="ThreatLens Autonomous Codebase Agent"
      subtitle={subtitle}
      breadcrumb="AGENT"
      statusText={isRunning ? 'PROCESSING' : activeApproval ? 'APPROVAL REQ' : 'IDLE'}
      statusType={activeApproval ? 'warning' : isRunning ? 'ready' : 'success'}
      keyHints={
        activeApproval
          ? 'a approve · r reject · c cancel'
          : isRunning
          ? 'esc cancel run'
          : 'enter send · esc back'
      }
    >
      <Box flexDirection="column" paddingY={0}>
        {/* Status Bar */}
        <Box flexDirection="row" alignItems="center" marginBottom={1}>
          {isRunning ? (
            <Text color="yellow" bold>
              ⚡{' '}
            </Text>
          ) : (
            <Text color="green" bold>
              ●{' '}
            </Text>
          )}
          <Text color="gray" italic>
            {statusMessage}
          </Text>
        </Box>

        {/* Message History */}
        <Box flexDirection="column" marginBottom={0}>
          {visibleMessages.map((msg) => (
            <Box
              key={msg.id}
              flexDirection="column"
              marginY={0}
              paddingX={1}
              borderStyle="single"
              borderColor={msg.sender === 'user' ? 'cyan' : 'gray'}
            >
              <Text bold color={msg.sender === 'user' ? 'cyan' : 'green'}>
                {msg.sender === 'user' ? '👤 User:' : '🛡️ Agent:'}
              </Text>
              <Text color="white">{msg.text}</Text>
            </Box>
          ))}
        </Box>

        {/* 1. Live Tool Invocations (Rendered first) */}
        {tools.length > 0 ? (
          <Box flexDirection="column" marginY={1}>
            <Text color="gray" dimColor>
              Active Tool Invocations:
            </Text>
            {tools.map((t) => (
              <ToolBadge
                key={t.callId}
                toolName={t.toolName}
                args={t.args}
                status={t.status}
                result={t.result}
              />
            ))}
          </Box>
        ) : null}

        {/* 2. Diff Approval Modal (If approval requested by edit_file) */}
        {activeApproval ? (
          <Box marginY={1}>
            <DiffApprovalModal
              payload={activeApproval}
              onApprove={() => handleApproveDiff(activeApproval.id)}
              onReject={() => handleRejectDiff(activeApproval.id, 'User rejected in TUI')}
              onCancel={handleCancel}
            />
          </Box>
        ) : null}

        {/* 3. Agent's Response (Rendered after all tool calls) */}
        {currentAgentText ? (
          <Box
            flexDirection="column"
            marginY={1}
            paddingX={1}
            borderStyle="single"
            borderColor="green"
          >
            <Text bold color="green">
              🛡️ Agent:
            </Text>
            <Text color="white">{currentAgentText}</Text>
          </Box>
        ) : null}

        {/* 4. Interactive Input Prompt */}
        {!activeApproval && (
          <Box flexDirection="column" marginTop={1}>
            <Box
              borderStyle="round"
              borderColor={isRunning ? 'gray' : 'cyan'}
              paddingX={1}
              flexDirection="row"
            >
              <Text bold color="cyan">
                {'> '}
              </Text>
              <TextInput
                value={inputQuery}
                onChange={setInputQuery}
                onSubmit={() => handleSend()}
                placeholder={isRunning ? 'Agent is executing tools...' : 'Ask agent to inspect code, run sectests, or fix vulnerabilities...'}
              />
            </Box>
            <Box marginTop={0} paddingX={1} flexDirection="row" justifyContent="space-between">
              <Text color="gray" dimColor>
                Commands: &apos;audit /api/search&apos; · &apos;fix sql injection&apos; · &apos;find symbols&apos;
              </Text>
              <Text color="gray" dimColor>
                esc cancel / back
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </TerminalLayout>
  );
};

export default AgentChatScreen;
