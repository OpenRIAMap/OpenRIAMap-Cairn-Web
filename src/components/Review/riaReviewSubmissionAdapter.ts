import type { ReviewAuthorizationContext, ReviewPackageRevision, ReviewReleaseFeedItem, ReviewStatusBoardAdapter, ReviewSubmissionAdapter, ReviewSubmissionRequest, ReviewSubmissionResult, ReviewSubmissionSnapshot } from './contracts';
import type { ReviewStatusBoardSaveRequest, ReviewStatusBoardSaveResult, ReviewStatusBoardSnapshot } from './statusBoard';
import type { ReviewWorkflowFetch } from './riaReviewWorkflowAdapter';

async function requestControl<T>(fetcher: ReviewWorkflowFetch, body: Record<string, unknown>): Promise<T> {
  const response = await fetcher('/api/review-control', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json() as T | { error?: string };
  if (!response.ok) {
    const error = typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'string' ? payload.error : 'Review submission request failed.';
    throw new Error(error);
  }
  return payload as T;
}

type RiaStoredRevision = {
  revisionId: string;
  relayObject?: {
    packageId?: string;
    sha256?: string;
    byteLength?: number;
    packageReceipt?: { manifest?: { featureCount?: number; deleteCount?: number; pictureCount?: number } };
  };
  createdAt?: string;
  createdBy?: { principalId?: string };
  basedOnRevisionId?: string | null;
  tags?: string[];
  summary?: string | null;
};

type RiaStoredSnapshot = Omit<ReviewSubmissionSnapshot, 'revisions'> & { revisions?: RiaStoredRevision[] };

/** Maps the downstream persisted revision record to the generic Review display contract. */
function normalizeSnapshot(value: RiaStoredSnapshot): ReviewSubmissionSnapshot {
  const revisions: ReviewPackageRevision[] = (value.revisions ?? []).map((revision) => {
    const manifest = revision.relayObject?.packageReceipt?.manifest;
    return {
      revisionId: revision.revisionId,
      package: {
        packageId: revision.relayObject?.packageId ?? value.submissionId,
        worldId: 'multiple',
        source: 'inbox-adapter',
        featureCount: manifest?.featureCount ?? 0,
        deleteCount: manifest?.deleteCount ?? 0,
        pictureCount: manifest?.pictureCount ?? 0,
      },
      contentHash: revision.relayObject?.sha256 ?? '',
      byteLength: revision.relayObject?.byteLength ?? 0,
      createdAt: revision.createdAt ?? '',
      createdBy: revision.createdBy?.principalId ?? 'unknown',
      ...(revision.basedOnRevisionId ? { basedOnRevisionId: revision.basedOnRevisionId } : {}),
      tags: (revision.tags ?? []) as ReviewPackageRevision['tags'],
      ...(revision.summary ? { summary: revision.summary } : {}),
    };
  });
  return { ...value, revisions } as ReviewSubmissionSnapshot;
}

/** Downstream-only same-origin transport. It deliberately contains no provider credentials. */
export function createRiaReviewSubmissionAdapter(fetcher: ReviewWorkflowFetch = fetch): ReviewSubmissionAdapter & ReviewStatusBoardAdapter {
  return {
    getSubmission: async (submissionId: string, _actor: ReviewAuthorizationContext) => normalizeSnapshot(await requestControl<RiaStoredSnapshot>(fetcher, { operation: 'detail', submissionId })),
    listSubmissions: async (_actor: ReviewAuthorizationContext) => {
      const result = await requestControl<{ items: RiaStoredSnapshot[] }>(fetcher, { operation: 'list', limit: 50 });
      return result.items.map(normalizeSnapshot);
    },
    dispatchSubmission: (request: ReviewSubmissionRequest) => requestControl<ReviewSubmissionResult>(fetcher, { operation: request.action, request }),
    getReleaseFeed: async (_actor: ReviewAuthorizationContext, limit = 10) => {
      const result = await requestControl<{ items: ReviewReleaseFeedItem[] }>(fetcher, { operation: 'release-feed', limit });
      return result.items;
    },
    getStatusBoard: (_actor: ReviewAuthorizationContext) => requestControl<ReviewStatusBoardSnapshot>(fetcher, { operation: 'status-board' }),
    saveStatusBoard: (request: ReviewStatusBoardSaveRequest) => requestControl<ReviewStatusBoardSaveResult>(fetcher, {
      operation: 'status-save',
      request: {
        requestId: request.requestId,
        correlationId: request.correlationId,
        idempotencyKey: request.idempotencyKey,
        expectedBoardVersion: request.expectedBoardVersion,
        entries: request.entries.map(({ submissionId, state, decisionRevisionId, decisionAction, reason }) => ({ submissionId, state, decisionRevisionId, ...(decisionAction ? { decisionAction } : {}), ...(reason ? { reason } : {}) })),
      },
    }),
  };
}

/** Downstream-only short-lived archive reader used by the Review workbench. */
export async function requestRiaReviewRevisionDownload(submissionId: string, revisionId: string, fetcher: ReviewWorkflowFetch = fetch): Promise<{ download: { url: string; sha256: string; byteLength: number } }> {
  return requestControl(fetcher, { operation: 'revision-download-request', submissionId, revisionId });
}
