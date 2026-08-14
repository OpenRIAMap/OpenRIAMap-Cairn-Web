import type {
  ReviewRevisionUploadGrant,
  ReviewRevisionUploadRequest,
  ReviewRevisionUploadResult,
  ReviewSubmissionTransport,
} from '@/components/Review/package';

type BrokerResponse = { response: Response; body: unknown };

async function broker(operation: 'revision-upload-request' | 'revision-upload-complete', request: ReviewRevisionUploadRequest): Promise<BrokerResponse> {
  const response = await fetch('/api/review-control', {
    method: 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ operation, request }),
  });
  let body: unknown = null;
  try { body = await response.json(); } catch {}
  return { response, body };
}

function errorMessage(body: unknown, fallback: string): string {
  return body && typeof body === 'object' && typeof (body as Record<string, unknown>).error === 'string'
    ? String((body as Record<string, unknown>).error)
    : fallback;
}

function requireObject(value: unknown, error: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(error);
  return value as Record<string, unknown>;
}

function normalizeGrant(value: unknown): ReviewRevisionUploadGrant {
  const source = requireObject(value, 'review-upload-grant-invalid');
  const candidate = source.upload && typeof source.upload === 'object' ? source.upload : source;
  const upload = requireObject(candidate, 'review-upload-grant-invalid');
  const method = upload.method;
  const url = upload.url;
  const key = upload.key;
  const expiresInSeconds = upload.expiresInSeconds;
  const headers = upload.headers;
  if (method !== 'PUT' || typeof url !== 'string' || !url || typeof key !== 'string' || !key || typeof expiresInSeconds !== 'number' || !Number.isSafeInteger(expiresInSeconds) || expiresInSeconds < 1 || !headers || typeof headers !== 'object' || Array.isArray(headers)) {
    throw new Error('review-upload-grant-invalid');
  }
  return {
    method,
    url,
    key,
    expiresInSeconds,
    headers: Object.fromEntries(Object.entries(headers as Record<string, unknown>).filter((entry): entry is [string, string] => typeof entry[1] === 'string')),
  };
}

/**
 * Concrete RIA broker mapping. The browser sees only Vercel's same-origin
 * route and a short-lived signed PUT; it never receives cloud credentials.
 */
export const openriamapReviewSubmissionTransport: ReviewSubmissionTransport = {
  async requestRevisionUpload(request): Promise<ReviewRevisionUploadGrant> {
    const { response, body } = await broker('revision-upload-request', request);
    if (!response.ok) throw new Error(errorMessage(body, `review-upload-request-failed:${response.status}`));
    return normalizeGrant(body);
  },
  async uploadRevision(grant, artifact): Promise<void> {
    const response = await fetch(grant.url, { method: grant.method, headers: grant.headers, body: artifact });
    if (!response.ok) throw new Error(`review-upload-put-failed:${response.status}`);
  },
  async completeRevisionUpload(request): Promise<ReviewRevisionUploadResult> {
    const { response, body } = await broker('revision-upload-complete', request);
    if (!response.ok) throw new Error(errorMessage(body, `review-upload-complete-failed:${response.status}`));
    const result = requireObject(body, 'review-upload-completion-invalid');
    if (typeof result.accepted !== 'boolean' || !('submission' in result)) throw new Error('review-upload-completion-invalid');
    return { accepted: result.accepted, ...(typeof result.alreadySubmitted === 'boolean' ? { alreadySubmitted: result.alreadySubmitted } : {}), submission: result.submission };
  },
};

export default openriamapReviewSubmissionTransport;
