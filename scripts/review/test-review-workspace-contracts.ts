import { createReviewWorkspaceAdapterRegistry, emptyReviewWorkspaceSession, loadReviewWorkspaceSession, markReviewWorkspaceDirty, recordReviewWorkspaceIntent, type TemporaryLayerPort } from '../../src/components/Review';

const layers: TemporaryLayerPort = { mount() {}, clear() {} };
const registry = createReviewWorkspaceAdapterRegistry();
registry.register('local-adapter', { temporaryLayers: layers });
if (!registry.resolve('local-adapter') || registry.resolve('missing')) throw new Error('adapter registry resolution failed');
const loaded = loadReviewWorkspaceSession({ packageId: 'relay-1', worldId: 'demo', source: 'local-file', featureCount: 1, deleteCount: 0, pictureCount: 0 });
if (!markReviewWorkspaceDirty(loaded).dirty) throw new Error('dirty session state failed');
const intent = recordReviewWorkspaceIntent(markReviewWorkspaceDirty(loaded), 'approve', '2026-01-01T00:00:00.000Z');
if (intent.dirty || intent.lastIntent?.kind !== 'approve') throw new Error('intent state failed');
if (emptyReviewWorkspaceSession().package !== null) throw new Error('empty session failed');
console.log('Review workspace contract test: PASS');
