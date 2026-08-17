import {
  createIdleReviewReleaseGate,
  ReviewOperationError,
  type ReviewAuthorizationContext,
  type ReviewPackagePrecheckReport,
  type ReviewPackageRevision,
  type ReviewReleaseConfirmationRequest,
  type ReviewReleaseControlPort,
  type ReviewReleaseControlReport,
  type ReviewReleaseControlRequest,
  type ReviewReleaseFeedItem,
  type ReviewReleaseGateSnapshot,
  type ReviewStatusBoardAdapter,
  type ReviewSubmissionAdapter,
  type ReviewSubmissionRequest,
  type ReviewSubmissionResult,
  type ReviewSubmissionSnapshot,
} from './contracts';
import type { ReviewStatusBoardSaveRequest, ReviewStatusBoardSaveResult, ReviewStatusBoardSnapshot } from './statusBoard';
import type { ReviewWorkflowFetch } from './riaReviewWorkflowAdapter';

type ControlErrorPayload = { error?: unknown; code?: unknown; message?: unknown; correlationId?: unknown; requestId?: unknown; details?: unknown };

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function asDetails(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())) : [];
}

function operationError(payload: unknown, status: number): ReviewOperationError {
  const object = payload && typeof payload === 'object' ? payload as ControlErrorPayload : {};
  const code = asString(object.code) ?? asString(object.error) ?? `review-control-http-${status}`;
  const message = asString(object.message) ?? asString(object.error) ?? `审核服务请求失败（HTTP ${status}）。`;
  return new ReviewOperationError({
    code,
    message,
    retryable: status >= 500 || status === 429,
    correlationId: asString(object.correlationId) ?? asString(object.requestId),
    details: asDetails(object.details),
  });
}

async function requestControl<T>(fetcher: ReviewWorkflowFetch, body: Record<string, unknown>): Promise<T> {
  const response = await fetcher('/api/review-control', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ReviewOperationError({
      code: 'review-control-invalid-response',
      message: '审核服务返回了无法解析的响应。',
      retryable: response.status >= 500,
    });
  }
  if (!response.ok) throw operationError(payload, response.status);
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
type RiaPrecheckResponse = ReviewSubmissionResult & { report?: { decision?: unknown; findings?: unknown; summary?: { warnings?: unknown; blockers?: unknown } } };

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

function normalizePackagePrecheck(value: RiaPrecheckResponse, request: ReviewSubmissionRequest): ReviewPackagePrecheckReport {
  const report = value.report;
  const decision = report?.decision;
  if (!report || (decision !== 'ready' && decision !== 'warning-confirmation-required' && decision !== 'blocked')) {
    throw new ReviewOperationError({
      code: 'review-precheck-invalid-response',
      message: '审核预检未返回可用的报告。',
      correlationId: value.correlationId,
    });
  }
  const summary = report.summary;
  return {
    schemaVersion: 'cairn.review-package-precheck.v1',
    decision,
    submissionId: request.submissionId,
    revisionId: request.targetRevisionId,
    stateVersion: value.submission?.stateVersion ?? request.expectedStateVersion,
    findings: Array.isArray(report.findings) ? report.findings as ReviewPackagePrecheckReport['findings'] : [],
    ...(summary && Number.isSafeInteger(summary.warnings) && Number.isSafeInteger(summary.blockers)
      ? { summary: { warnings: Number(summary.warnings), blockers: Number(summary.blockers) } }
      : {}),
    correlationId: value.correlationId,
  };
}

function normalizeGate(value: ReviewReleaseGateSnapshot | null | undefined): ReviewReleaseGateSnapshot {
  return value && typeof value === 'object' && typeof value.state === 'string' ? value : createIdleReviewReleaseGate();
}

/** Downstream-only same-origin transport. It deliberately contains no provider credentials. */
export function createRiaReviewSubmissionAdapter(fetcher: ReviewWorkflowFetch = fetch): ReviewSubmissionAdapter & ReviewStatusBoardAdapter & ReviewReleaseControlPort {
  return {
    getSubmission: async (submissionId: string, _actor: ReviewAuthorizationContext) => normalizeSnapshot(await requestControl<RiaStoredSnapshot>(fetcher, { operation: 'detail', submissionId })),
    listSubmissions: async (_actor: ReviewAuthorizationContext) => {
      const result = await requestControl<{ items: RiaStoredSnapshot[] }>(fetcher, { operation: 'list', limit: 50 });
      return result.items.map(normalizeSnapshot);
    },
    dispatchSubmission: (request: ReviewSubmissionRequest) => requestControl<ReviewSubmissionResult>(fetcher, { operation: request.action, request }),
    precheckSubmission: async (request: ReviewSubmissionRequest) => normalizePackagePrecheck(await requestControl<RiaPrecheckResponse>(fetcher, { operation: 'precheck', request }), request),
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
    getReleaseGate: async (_actor: ReviewAuthorizationContext) => normalizeGate(await requestControl<ReviewReleaseGateSnapshot | null>(fetcher, { operation: 'release-gate' })),
    runReleasePrecheck: (request: ReviewReleaseControlRequest, _actor: ReviewAuthorizationContext) => requestControl<ReviewReleaseControlReport>(fetcher, {
      operation: 'publish-precheck',
      selectedSubmissionIds: request.selectedSubmissionIds,
      expectedBoardVersion: request.expectedBoardVersion,
      request: request.request,
    }),
    confirmRelease: (request: ReviewReleaseConfirmationRequest, _actor: ReviewAuthorizationContext) => requestControl<ReviewReleaseControlReport>(fetcher, {
      operation: 'publish-confirm',
      attemptId: request.attemptId,
      expectedGateVersion: request.expectedGateVersion,
      precheckReportSha256: request.precheckReportSha256,
      request: request.request,
    }),
  };
}

/** Downstream-only short-lived archive reader used by the Review workbench. */
export async function requestRiaReviewRevisionDownload(submissionId: string, revisionId: string, fetcher: ReviewWorkflowFetch = fetch): Promise<{ download: { url: string; sha256: string; byteLength: number } }> {
  return requestControl(fetcher, { operation: 'revision-download-request', submissionId, revisionId });
}
