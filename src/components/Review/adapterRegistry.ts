import type { ReviewWorkflowAdapter, TemporaryLayerPort } from './contracts';

export type ReviewWorkspaceAdapterSet = { workflow?: ReviewWorkflowAdapter; temporaryLayers: TemporaryLayerPort };

/** Application composition registers named local adapters; config never carries connection details. */
export function createReviewWorkspaceAdapterRegistry() {
  const entries = new Map<string, ReviewWorkspaceAdapterSet>();
  return {
    register(id: string, adapters: ReviewWorkspaceAdapterSet) {
      if (!/^[a-z][a-z0-9-]{1,63}$/.test(id)) throw new Error('Review adapter id must be a local identifier.');
      if (entries.has(id)) throw new Error(`Review adapter is already registered: ${id}`);
      entries.set(id, adapters);
    },
    resolve(id: string) { return entries.get(id) ?? null; },
  };
}
