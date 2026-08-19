import 'dotenv/config';
import { OpenAILLMClient } from '../src/agent/llm/llmClient.js';

async function testLiveOpenRouter() {
  console.log('🌐 Testing Live OpenRouter Connection with Claude 3.5 Sonnet...\n');

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not found in environment!');
  }

  const client = new OpenAILLMClient({
    apiKey,
    baseUrl: process.env.LLM_BASE_URL || 'https://openrouter.ai/api/v1',
    model: process.env.LLM_MODEL || 'anthropic/claude-3.5-sonnet',
  });

  console.log(`▶️ Sending test prompt to OpenRouter model: ${process.env.LLM_MODEL || 'anthropic/claude-3.5-sonnet'}...`);
  const startTime = performance.now();

  const response = await client.chat(
    [
      {
        role: 'user',
        content: 'Hello ThreatLens! In 1 short sentence, state what your security agent role is.',
      },
    ],
    [],
    {
      onToken: (token) => process.stdout.write(token),
    }
  );

  const duration = performance.now() - startTime;
  console.log(`\n\n  ⏱️ Total Response Time: ${duration.toFixed(0)}ms`);
  console.log(`  ✅ Successfully received live response from OpenRouter!`);
}

testLiveOpenRouter().catch((err) => {
  console.error('❌ OpenRouter test failed:', err);
  process.exit(1);
});
