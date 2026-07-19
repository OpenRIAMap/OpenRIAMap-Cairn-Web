import { createRiaReviewWorkflowAdapter, createRiaReviewWorkflowTransport } from '../../src/components/Review/riaReviewWorkflowAdapter';

const calls: Array<{ url: string; init?: RequestInit }> = [];
const transport = createRiaReviewWorkflowTransport(async (url, init) => {
  calls.push({ url: String(url), init });
  return new Response(JSON.stringify({ requestId: 'r-1', correlationId: 'c-1', state: 'submitted' }), { status: 200 });
});
const adapter = createRiaReviewWorkflowAdapter(transport);
await adapter.submitIntent?.({ requestId: 'r-1', correlationId: 'c-1', idempotencyKey: 'p:submit:c', intent: 'submit', packageId: 'p', occurredAt: '2026-07-19T00:00:00.000Z', actor: { principalId: 'future-ui', roles: [] } });
if (calls.length !== 1 || calls[0].url !== '/api/review-workflow' || !String(calls[0].init?.body).includes('"operation":"dispatch"')) throw new Error('same-origin workflow transport failed');
console.log('Review control binding test: PASS');
