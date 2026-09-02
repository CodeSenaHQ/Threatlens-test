import type { LLMMessage, LLMStreamCallbacks, LLMUsage } from './llmClient.js';

export async function parseOpenAISSEStream(
  body: ReadableStream<Uint8Array>,
  callbacks?: LLMStreamCallbacks
): Promise<LLMMessage> {
  const reader = body.getReader();
  const decoder = new TextDecoder('utf-8');
  let fullContent = '';
  let usage: LLMUsage | undefined;
  const toolCallsMap: Map<number, { id: string; name: string; arguments: string }> = new Map();

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const dataStr = trimmed.replace(/^data:\s*/, '');
      if (dataStr === '[DONE]') continue;

      try {
        const chunk = JSON.parse(dataStr);
        if (chunk.usage) {
          usage = {
            prompt_tokens: chunk.usage.prompt_tokens ?? 0,
            completion_tokens: chunk.usage.completion_tokens ?? 0,
            total_tokens: chunk.usage.total_tokens ?? 0,
          };
          if (callbacks?.onUsage) {
            callbacks.onUsage(usage);
          }
        }
        const delta = chunk.choices && chunk.choices[0] && chunk.choices[0].delta;
        if (!delta) continue;

        if (delta.content) {
          fullContent += delta.content;
          if (callbacks?.onToken) {
            callbacks.onToken(delta.content);
          }
        }

        if (delta.tool_calls) {
          for (const tc of delta.tool_calls) {
            const index = tc.index ?? 0;
            let existing = toolCallsMap.get(index);
            if (!existing) {
              existing = { id: tc.id || `call_${index}`, name: tc.function?.name || '', arguments: '' };
              toolCallsMap.set(index, existing);
              if (callbacks?.onToolCallStart && tc.function?.name) {
                callbacks.onToolCallStart(tc.function.name, existing.id);
              }
            }
            if (tc.function?.arguments) {
              existing.arguments += tc.function.arguments;
            }
          }
        }
      } catch {
        // Ignore SSE parse errors
      }
    }
  }

  const tool_calls = Array.from(toolCallsMap.values()).map((tc) => ({
    id: tc.id,
    type: 'function' as const,
    function: {
      name: tc.name,
      arguments: tc.arguments,
    },
  }));

  return {
    role: 'assistant',
    content: fullContent || null,
    tool_calls: tool_calls.length > 0 ? tool_calls : undefined,
    usage,
  };
}
