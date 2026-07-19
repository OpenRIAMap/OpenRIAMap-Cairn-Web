import type { ReviewAuthorizationContext, ReviewPackageReference, ReviewWorkflowAdapter, ReviewWorkflowRequest, ReviewWorkflowResult, ReviewWorkflowTransport } from './contracts';
import type { ReviewInboxItem } from './reviewStatusTypes';

export type ReviewWorkflowFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

function packageReference(item: ReviewInboxItem): ReviewPackageReference {
  return {
    packageId: item.packageId,
    worldId: item.worldId,
    source: item.source === 'local-file' ? 'local-file' : 'inbox-adapter',
    featureCount: item.features.length,
    deleteCount: item.deleteMarks.length,
    pictureCount: Object.values(item.picturesById).reduce((count, pictures) => count + pictures.length, 0),
  };
}

async function requestWorkflow(fetcher: ReviewWorkflowFetch, operation: 'dispatch' | 'status' | 'report', body: Record<string, unknown>): Promise<ReviewWorkflowResult> {
  const response = await fetcher('/api/review-workflow', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ operation, ...body }),
  });
  const payload = await response.json() as ReviewWorkflowResult | { error?: string };
  if (!response.ok || !('state' in payload)) throw new Error('error' in payload ? payload.error ?? 'Review workflow request failed.' : 'Review workflow request failed.');
  return payload;
}

/** Binds the generic workflow port to the downstream's same-origin broker only. */
export function createRiaReviewWorkflowTransport(fetcher: ReviewWorkflowFetch = fetch): ReviewWorkflowTransport {
  return {
    dispatch: (workflowRequest) => requestWorkflow(fetcher, 'dispatch', { request: workflowRequest }),
    getStatus: (packageId: string, actor: ReviewAuthorizationContext) => requestWorkflow(fetcher, 'status', { packageId, actor }),
    getReport: (packageId: string, actor: ReviewAuthorizationContext) => requestWorkflow(fetcher, 'report', { packageId, actor }),
  };
}

export function createRiaReviewWorkflowAdapter(transport: ReviewWorkflowTransport, loadInbox?: () => Promise<ReviewInboxItem[]>): ReviewWorkflowAdapter {
  return {
    loadInbox: async () => (await (loadInbox?.() ?? Promise.resolve([]))).map(packageReference),
    submitIntent: (request: ReviewWorkflowRequest) => transport.dispatch(request),
  };
}
