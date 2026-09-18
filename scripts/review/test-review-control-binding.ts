import { createRiaReviewWorkflowAdapter, createRiaReviewWorkflowTransport } from '../../src/components/Review/riaReviewWorkflowAdapter';
import { createRiaReviewSubmissionAdapter } from '../../src/components/Review/riaReviewSubmissionAdapter';

const calls: Array<{ url: string; init?: RequestInit }> = [];
const transport = createRiaReviewWorkflowTransport(async (url, init) => {
  calls.push({ url: String(url), init });
  return new Response(JSON.stringify({ requestId: 'r-1', correlationId: 'c-1', state: 'submitted' }), { status: 200 });
});
const adapter = createRiaReviewWorkflowAdapter(transport);
await adapter.submitIntent?.({ requestId: 'r-1', correlationId: 'c-1', idempotencyKey: 'p:submit:c', intent: 'submit', packageId: 'p', occurredAt: '2026-07-19T00:00:00.000Z', actor: { principalId: 'future-ui', roles: [] } });
if (calls.length !== 1 || calls[0].url !== '/api/review-workflow' || !String(calls[0].init?.body).includes('"operation":"dispatch"')) throw new Error('same-origin workflow transport failed');
console.log('Review control binding test: PASS');

const submissionCalls: Array<{ url: string; init?: RequestInit }> = [];
const submissionAdapter = createRiaReviewSubmissionAdapter(async (url, init) => {
  submissionCalls.push({ url: String(url), init });
  const body = JSON.parse(String(init?.body));
  if (body.operation === 'detail') return new Response(JSON.stringify({ submissionId: body.submissionId, state: 'pending', stateVersion: 1, revisions: [] }), { status: 200 });
  if (body.operation === 'release-feed') return new Response(JSON.stringify({ items: [] }), { status: 200 });
  if (body.operation === 'release-gate') return new Response('null', { status: 200 });
  if (body.operation === 'archive-reconciliation-precheck') return new Response(JSON.stringify({
    decision: 'ready', plan: { reconciliationId: 'reconcile-aaaaaaaaaaaaaaaaaaaa', planSha256: 'a'.repeat(64), candidateCount: 1, candidates: [] }, blockers: [],
  }), { status: 200 });
  if (body.operation === 'archive-reconciliation-confirm') return new Response(JSON.stringify({ accepted: true, reconciliationId: body.reconciliationId, state: 'queued', jobId: 'job-001', candidateCount: 1 }), { status: 200 });
  if (body.operation === 'archive-reconciliation-progress') return new Response(JSON.stringify({ reconciliationId: body.reconciliationId, state: 'completed', candidateCount: 1 }), { status: 200 });
  if (body.operation === 'precheck') return new Response(JSON.stringify({
    requestId: body.request.requestId,
    correlationId: body.request.correlationId,
    submission: { submissionId: body.request.submissionId, state: 'pending', stateVersion: 2, revisions: [] },
    report: { decision: 'ready', findings: [], summary: { warnings: 0, blockers: 0 } },
  }), { status: 200 });
  return new Response(JSON.stringify({ requestId: body.request.requestId, correlationId: body.request.correlationId, submission: { submissionId: body.request.submissionId, state: 'approved', stateVersion: 2, revisions: [] } }), { status: 200 });
});
const actor = { principalId: 'future-ui', roles: [] };
await submissionAdapter.getSubmission('submission-1', actor);
await submissionAdapter.dispatchSubmission({ requestId: 'r-2', correlationId: 'c-2', idempotencyKey: 'submission-1:r2:approve:c-2', submissionId: 'submission-1', targetRevisionId: 'submission-1-r2', expectedStateVersion: 1, action: 'approve', occurredAt: '2026-07-27T00:00:00.000Z', actor });
await submissionAdapter.getReleaseFeed?.(actor, 20);
const precheck = await submissionAdapter.precheckSubmission?.({ requestId: 'r-3', correlationId: 'c-3', idempotencyKey: 'submission-1:r2:precheck:c-3', submissionId: 'submission-1', targetRevisionId: 'submission-1-r2', expectedStateVersion: 1, action: 'precheck', occurredAt: '2026-07-27T00:00:00.000Z', actor });
const idleGate = await submissionAdapter.getReleaseGate?.(actor);
const reconciliation = await submissionAdapter.runArchiveReconciliationPrecheck({ selectedSubmissionIds: ['submission-legacy-001'] }, actor);
const reconciliationQueued = reconciliation.plan ? await submissionAdapter.confirmArchiveReconciliation(reconciliation.plan, actor) : null;
const reconciliationProgress = await submissionAdapter.getArchiveReconciliationProgress('reconcile-aaaaaaaaaaaaaaaaaaaa', actor);
if (!precheck || precheck.decision !== 'ready' || precheck.stateVersion !== 2) throw new Error('package precheck normalization failed');
if (idleGate?.state !== 'idle' || idleGate.initialized !== false) throw new Error('null release gate normalization failed');
if (reconciliation.decision !== 'ready' || reconciliationQueued?.state !== 'queued' || reconciliationProgress.state !== 'completed') throw new Error('archive reconciliation control binding failed');
if (submissionCalls.length !== 8 || submissionCalls.some((call) => call.url !== '/api/review-control')) throw new Error('same-origin submission control transport failed');
if (!String(submissionCalls[1].init?.body).includes('"operation":"approve"')) throw new Error('submission action mapping failed');
if (!String(submissionCalls[2].init?.body).includes('"limit":10')) throw new Error('release feed limit must be clamped to Dispatcher range');
console.log('Review submission control binding test: PASS');
