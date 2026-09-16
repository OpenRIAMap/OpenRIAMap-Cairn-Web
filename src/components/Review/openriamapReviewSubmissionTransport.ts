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

async function uploadProgress(request: ReviewRevisionUploadRequest): Promise<BrokerResponse> {
  const response = await fetch('/api/review-control', {
    method: 'POST', credentials: 'same-origin', cache: 'no-store', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ operation: 'revision-upload-progress', submissionId: request.submissionId, revisionId: request.revisionId }),
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
  const key = upload.key;
  const expiresInSeconds = upload.expiresInSeconds;
  if (typeof key !== 'string' || !key || typeof expiresInSeconds !== 'number' || !Number.isSafeInteger(expiresInSeconds) || expiresInSeconds < 1) {
    throw new Error('review-upload-grant-invalid');
  }
  if (upload.mode === 'multipart') {
    const artifact = requireObject(upload.artifact, 'review-upload-grant-invalid');
    if (artifact.kind !== 'openriamap.chunked-artifact.v1' || typeof artifact.artifactId !== 'string' || !artifact.artifactId || !Number.isSafeInteger(artifact.byteLength) || Number(artifact.byteLength) < 1 || typeof artifact.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(artifact.sha256) || !Array.isArray(artifact.chunks)) throw new Error('review-upload-grant-invalid');
    const chunks = artifact.chunks.map((entry, index) => {
      const item = requireObject(entry, 'review-upload-grant-invalid');
      if (item.index !== index || !Number.isSafeInteger(item.byteLength) || Number(item.byteLength) < 1 || typeof item.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(item.sha256)) throw new Error('review-upload-grant-invalid');
      return { index, byteLength: Number(item.byteLength), sha256: item.sha256 };
    });
    const session = requireObject(upload.session, 'review-upload-grant-invalid');
    const parts = Array.isArray(upload.parts) ? upload.parts.map((entry) => {
      const part = requireObject(entry, 'review-upload-grant-invalid');
      const index = Number(part.index);
      const chunk = chunks[index];
      if (!Number.isSafeInteger(part.partNumber) || Number(part.partNumber) !== index + 1 || !chunk || part.byteLength !== chunk.byteLength || part.sha256 !== chunk.sha256 || typeof part.url !== 'string' || !part.url || !part.headers || typeof part.headers !== 'object' || Array.isArray(part.headers)) throw new Error('review-upload-grant-invalid');
      return { partNumber: Number(part.partNumber), ...chunk, url: part.url, headers: Object.fromEntries(Object.entries(part.headers as Record<string, unknown>).filter((item): item is [string, string] => typeof item[1] === 'string')) };
    }) : null;
    const uploadedParts = upload.completedParts === undefined ? [] : Array.isArray(upload.completedParts) ? upload.completedParts.map((entry) => {
      const part = requireObject(entry, 'review-upload-grant-invalid');
      const index = Number(part.index); const chunk = chunks[index];
      if (!Number.isSafeInteger(part.partNumber) || Number(part.partNumber) !== index + 1 || !chunk || part.byteLength !== chunk.byteLength || part.sha256 !== chunk.sha256 || typeof part.eTag !== 'string' || !part.eTag.trim()) throw new Error('review-upload-grant-invalid');
      return { partNumber: Number(part.partNumber), ...chunk, eTag: part.eTag.trim() };
    }) : null;
    if (session.mode !== 'multipart' || typeof session.uploadId !== 'string' || !session.uploadId || session.artifactId !== artifact.artifactId || !Number.isSafeInteger(session.partSize) || Number(session.partSize) < 1 || !Number.isSafeInteger(session.partCount) || Number(session.partCount) < 1 || !parts || !uploadedParts || uploadedParts.length > parts.length || new Set(uploadedParts.map((entry) => entry.partNumber)).size !== uploadedParts.length || !Number.isSafeInteger(upload.byteLength) || Number(upload.byteLength) !== artifact.byteLength || parts.length !== Number(session.partCount) || chunks.length !== parts.length) throw new Error('review-upload-grant-invalid');
    return { mode: 'multipart', key, expiresInSeconds, byteLength: Number(upload.byteLength), artifact: { kind: 'openriamap.chunked-artifact.v1', artifactId: artifact.artifactId, byteLength: Number(artifact.byteLength), sha256: artifact.sha256, chunks }, session: { mode: 'multipart', uploadId: session.uploadId, artifactId: session.artifactId, partSize: Number(session.partSize), partCount: Number(session.partCount) }, parts, ...(uploadedParts.length ? { uploadedParts } : {}) };
  }
  const method = upload.method;
  const url = upload.url;
  const headers = upload.headers;
  // Older active Dispatcher deployments described a signed direct PUT without
  // an explicit mode.  Treat that exact shape as `single`; multipart grants
  // remain explicit and are never inferred from arbitrary fields.
  if ((upload.mode !== undefined && upload.mode !== 'single') || method !== 'PUT' || typeof url !== 'string' || !url || !headers || typeof headers !== 'object' || Array.isArray(headers)) throw new Error('review-upload-grant-invalid');
  const artifact = requireObject(upload.artifact, 'review-upload-grant-invalid');
  if (artifact.kind !== 'openriamap.chunked-artifact.v1' || typeof artifact.artifactId !== 'string' || !artifact.artifactId || !Number.isSafeInteger(artifact.byteLength) || typeof artifact.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(artifact.sha256) || !Array.isArray(artifact.chunks) || artifact.chunks.length !== 1) throw new Error('review-upload-grant-invalid');
  const only = requireObject(artifact.chunks[0], 'review-upload-grant-invalid');
  if (only.index !== 0 || only.byteLength !== artifact.byteLength || only.sha256 !== artifact.sha256) throw new Error('review-upload-grant-invalid');
  return {
    mode: 'single',
    method,
    url,
    key,
    expiresInSeconds,
    artifact: { kind: 'openriamap.chunked-artifact.v1', artifactId: artifact.artifactId, byteLength: Number(artifact.byteLength), sha256: artifact.sha256, chunks: [{ index: 0, byteLength: Number(only.byteLength), sha256: only.sha256 }] },
    headers: Object.fromEntries(Object.entries(headers as Record<string, unknown>).filter((entry): entry is [string, string] => typeof entry[1] === 'string')),
  };
}

async function waitForVerification(request: ReviewRevisionUploadRequest): Promise<ReviewRevisionUploadResult> {
  const deadline = Date.now() + 10 * 60 * 1000;
  while (Date.now() < deadline) {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 1_000));
    const { response, body } = await uploadProgress(request);
    if (!response.ok) throw new Error(errorMessage(body, `review-upload-progress-failed:${response.status}`));
    const progress = requireObject(body, 'review-upload-progress-invalid');
    if (progress.state === 'verification-failed') throw new Error(typeof progress.error === 'string' ? progress.error : 'review-upload-verification-failed');
    if (progress.state === 'submitted') {
      const result = requireObject(progress.result, 'review-upload-progress-invalid');
      if (typeof result.accepted !== 'boolean' || !('submission' in result)) throw new Error('review-upload-progress-invalid');
      return { accepted: result.accepted, ...(typeof result.alreadySubmitted === 'boolean' ? { alreadySubmitted: result.alreadySubmitted } : {}), submission: result.submission };
    }
  }
  throw new Error('review-upload-verification-timeout');
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
    if (grant.mode === 'multipart') {
      if (artifact.size !== grant.byteLength) throw new Error('review-upload-artifact-size-mismatch');
      const completed = new Map((grant.uploadedParts ?? []).map((part) => [part.partNumber, part]));
      for (const part of grant.parts) {
        if (completed.has(part.partNumber)) continue;
        const start = (part.partNumber - 1) * grant.session.partSize;
        const response = await fetch(part.url, { method: 'PUT', headers: part.headers, body: artifact.slice(start, Math.min(artifact.size, start + grant.session.partSize)) });
        if (!response.ok) throw new Error(`review-upload-part-failed:${part.partNumber}:${response.status}`);
        const eTag = response.headers.get('etag');
        if (!eTag) throw new Error('review-upload-part-etag-missing');
        completed.set(part.partNumber, { partNumber: part.partNumber, index: part.index, byteLength: part.byteLength, sha256: part.sha256, eTag: eTag.replace(/^"|"$/g, '') });
      }
      grant.completedParts = grant.parts.map((part) => completed.get(part.partNumber)).filter((part): part is NonNullable<typeof grant.completedParts>[number] => Boolean(part));
      return;
    }
    const response = await fetch(grant.url, { method: grant.method, headers: grant.headers, body: artifact });
    if (!response.ok) throw new Error(`review-upload-put-failed:${response.status}`);
  },
  async completeRevisionUpload(request): Promise<ReviewRevisionUploadResult> {
    const { response, body } = await broker('revision-upload-complete', request);
    if (!response.ok) throw new Error(errorMessage(body, `review-upload-complete-failed:${response.status}`));
    const result = requireObject(body, 'review-upload-completion-invalid');
    if (result.state === 'verification-queued') return waitForVerification(request);
    if (typeof result.accepted !== 'boolean' || !('submission' in result)) throw new Error('review-upload-completion-invalid');
    return { accepted: result.accepted, ...(typeof result.alreadySubmitted === 'boolean' ? { alreadySubmitted: result.alreadySubmitted } : {}), submission: result.submission };
  },
};

export default openriamapReviewSubmissionTransport;
