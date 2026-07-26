import type { ReviewAuthorizationContext, ReviewReleaseFeedItem, ReviewSubmissionAdapter, ReviewSubmissionRequest, ReviewSubmissionResult, ReviewSubmissionSnapshot } from './contracts';
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

/** Downstream-only same-origin transport. It deliberately contains no provider credentials. */
export function createRiaReviewSubmissionAdapter(fetcher: ReviewWorkflowFetch = fetch): ReviewSubmissionAdapter {
  return {
    getSubmission: (submissionId: string, _actor: ReviewAuthorizationContext) => requestControl<ReviewSubmissionSnapshot>(fetcher, { operation: 'detail', submissionId }),
    listSubmissions: async (_actor: ReviewAuthorizationContext) => {
      const result = await requestControl<{ items: ReviewSubmissionSnapshot[] }>(fetcher, { operation: 'list', limit: 50 });
      return result.items;
    },
    dispatchSubmission: (request: ReviewSubmissionRequest) => requestControl<ReviewSubmissionResult>(fetcher, { operation: request.action, request }),
    getReleaseFeed: async (_actor: ReviewAuthorizationContext, limit = 10) => {
      const result = await requestControl<{ items: ReviewReleaseFeedItem[] }>(fetcher, { operation: 'release-feed', limit });
      return result.items;
    },
  };
}
