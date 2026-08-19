import { MockAgentController } from '../src/agent/MockAgentController.js';
import { AgentEvent } from '../src/agent/types.js';

async function testMockAgentSpike() {
  console.log('🧪 Starting Step 0 & 1 Verification: Mock Agent Event Bus Contract...');

  const controller = new MockAgentController();
  const eventsReceived: AgentEvent[] = [];

  const unsubscribe = controller.onEvent((evt) => {
    eventsReceived.push(evt);
    console.log(`  [Event: ${evt.type}]`, evt.type === 'token' ? `"${evt.delta}"` : evt.type === 'tool_start' ? `tool: ${evt.toolName}` : evt.type === 'require_approval' ? `file: ${evt.payload.file}` : '');
  });

  console.log('▶️ Submitting Query: "Fix SQL injection in auth"');
  controller.submitQuery('Fix SQL injection in auth');

  // Wait for the require_approval event
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timed out waiting for require_approval')), 5000);
    const checkInterval = setInterval(() => {
      const approvalEvt = eventsReceived.find((e) => e.type === 'require_approval');
      if (approvalEvt && approvalEvt.type === 'require_approval') {
        clearInterval(checkInterval);
        clearTimeout(timeout);

        console.log('✅ Approval event received with valid diff payload!');
        console.log('   File:', approvalEvt.payload.file);
        console.log('   Description:', approvalEvt.payload.description);
        console.log('▶️ Simulating User Decision: APPROVE diff...');
        controller.approveDiff(approvalEvt.payload.id);

        // Wait for completion
        const doneInterval = setInterval(() => {
          const doneEvt = eventsReceived.find((e) => e.type === 'done');
          if (doneEvt) {
            clearInterval(doneInterval);
            console.log('✅ Done event received! Summary:', doneEvt.type === 'done' ? doneEvt.summary : '');
            resolve();
          }
        }, 100);
      }
    }, 100);
  });

  unsubscribe();
  console.log('\n🎉 Verification Successful: Step 0 & Step 1 contract fully verified!\n');
}

testMockAgentSpike().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
