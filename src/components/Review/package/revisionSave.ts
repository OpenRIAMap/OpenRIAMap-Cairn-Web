import type {
  ReviewPackageArtifact,
  ReviewRevisionUploadResult,
  ReviewSubmissionTransport,
} from './contracts';
import {
  createReviewRevisionUploadRequest,
  createReviewSubmissionIdentity,
} from './submissionTransport';

/** Provider-neutral progress checkpoints for an immutable review revision. */
export type ReviewRevisionSaveStage =
  | 'building-request'
  | 'requesting-upload'
  | 'uploading'
  | 'finalizing'
  | 'completed';

export type ReviewRevisionSaveInput<TSubmission = unknown> = {
  artifact: Pick<ReviewPackageArtifact, 'blob' | 'packageName'>;
  /** Logical package identity. A review edit must not create a new submission. */
  submissionId: string;
  /** Count of revisions already present in the current submission snapshot. */
  revisionCount: number;
  /** Conditional-write version read with that snapshot. */
  expectedStateVersion: number;
  summary?: string;
  transport: ReviewSubmissionTransport<TSubmission>;
  onProgress?: (stage: ReviewRevisionSaveStage) => void;
};

export type ReviewRevisionSaveResult<TSubmission = unknown> = {
  submissionId: string;
  revisionId: string;
  requestId: string;
  correlationId: string;
  expectedStateVersion: number;
  result: ReviewRevisionUploadResult<TSubmission>;
};

function requiredText(value: unknown, error: string): string {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) throw new Error(error);
  return text;
}

/**
 * Saves a new immutable ZIP revision through an application-supplied transport.
 * It deliberately never clears workspace state; a UI may do so only after the
 * final conditional completion request succeeds.
 */
export async function saveReviewPackageRevision<TSubmission = unknown>(input: ReviewRevisionSaveInput<TSubmission>): Promise<ReviewRevisionSaveResult<TSubmission>> {
  const submissionId = requiredText(input.submissionId, 'review-revision-submission-id-required');
  if (!Number.isSafeInteger(input.revisionCount) || input.revisionCount < 1) throw new Error('review-revision-count-invalid');
  if (!Number.isSafeInteger(input.expectedStateVersion) || input.expectedStateVersion < 0) throw new Error('review-submission-state-version-invalid');

  input.onProgress?.('building-request');
  const identity = createReviewSubmissionIdentity({ submissionId, revisionNumber: input.revisionCount + 1 });
  const request = await createReviewRevisionUploadRequest({
    artifact: input.artifact,
    identity,
    expectedStateVersion: input.expectedStateVersion,
    summary: input.summary,
  });

  input.onProgress?.('requesting-upload');
  const grant = await input.transport.requestRevisionUpload(request);
  input.onProgress?.('uploading');
  await input.transport.uploadRevision(grant, input.artifact.blob);
  input.onProgress?.('finalizing');
  const result = await input.transport.completeRevisionUpload(request);
  input.onProgress?.('completed');

  return {
    submissionId,
    revisionId: identity.revisionId,
    requestId: identity.requestId,
    correlationId: identity.correlationId,
    expectedStateVersion: input.expectedStateVersion,
    result,
  };
}
