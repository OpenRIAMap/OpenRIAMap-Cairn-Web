import { canTransitionReviewWorkflow, createReviewWorkflowIdempotencyKey, createReviewWorkspaceAdapterRegistry, emptyReviewWorkspaceSession, loadReviewWorkspaceSession, markReviewWorkspaceDirty, recordReviewWorkspaceIntent, targetStateForReviewIntent, type TemporaryLayerPort } from '../../src/components/Review';

const layers: TemporaryLayerPort = { mount() {}, clear() {} };
const registry = createReviewWorkspaceAdapterRegistry();
registry.register('local-adapter', { temporaryLayers: layers });
if (!registry.resolve('local-adapter') || registry.resolve('missing')) throw new Error('adapter registry resolution failed');
const loaded = loadReviewWorkspaceSession({ packageId: 'relay-1', worldId: 'demo', source: 'local-file', featureCount: 1, deleteCount: 0, pictureCount: 0 });
if (!markReviewWorkspaceDirty(loaded).dirty) throw new Error('dirty session state failed');
const intent = recordReviewWorkspaceIntent(markReviewWorkspaceDirty(loaded), 'approve', '2026-01-01T00:00:00.000Z');
if (intent.dirty || intent.lastIntent?.kind !== 'approve') throw new Error('intent state failed');
if (emptyReviewWorkspaceSession().package !== null) throw new Error('empty session failed');
if (!canTransitionReviewWorkflow('precheck-passed', 'awaiting-approval') || canTransitionReviewWorkflow('draft', 'completed')) throw new Error('workflow transition guard failed');
if (targetStateForReviewIntent('approve') !== 'awaiting-approval') throw new Error('intent target failed');
if (createReviewWorkflowIdempotencyKey({ packageId: 'relay-1', intent: 'submit', correlationId: 'c-1' }) !== 'relay-1:submit:c-1') throw new Error('idempotency key failed');
console.log('Review workspace contract test: PASS');
