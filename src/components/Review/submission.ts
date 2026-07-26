import type { ReviewSubmissionActionKind, ReviewSubmissionState } from './contracts';

const transitions: Record<ReviewSubmissionState, readonly ReviewSubmissionState[]> = {
  pending: ['approved', 'rejected', 'archived'],
  approved: ['pending', 'queued', 'archived'],
  rejected: ['pending', 'archived'],
  queued: ['running', 'failed'],
  running: ['released', 'failed'],
  released: ['mirror-pending', 'mirrored', 'failed'],
  'mirror-pending': ['mirrored', 'failed'],
  mirrored: ['archived'],
  failed: ['pending', 'archived'],
  archived: [],
};

const actions: Record<ReviewSubmissionState, readonly ReviewSubmissionActionKind[]> = {
  pending: ['save', 'precheck', 'approve', 'reject', 'request-changes', 'archive', 'refresh'],
  approved: ['publish', 'reopen', 'archive', 'refresh'],
  rejected: ['reopen', 'archive', 'refresh'],
  queued: ['refresh'],
  running: ['refresh'],
  released: ['refresh'],
  'mirror-pending': ['refresh'],
  mirrored: ['archive', 'refresh'],
  failed: ['reopen', 'archive', 'refresh'],
  archived: ['refresh'],
};

export function canTransitionReviewSubmission(from: ReviewSubmissionState, to: ReviewSubmissionState): boolean {
  return transitions[from].includes(to);
}

/** A mutation must be rejected when another actor has advanced the submission. */
export function hasExpectedReviewSubmissionStateVersion(expected: number, actual: number): boolean {
  return Number.isSafeInteger(expected) && expected >= 0 && expected === actual;
}

export function isReviewSubmissionActionAllowed(state: ReviewSubmissionState, action: ReviewSubmissionActionKind): boolean {
  return actions[state].includes(action);
}

/**
 * The action target is part of the idempotency boundary. A retry of the same
 * action against the same submission revision is safe; a different revision is
 * a different request even when the visible package name is unchanged.
 */
export function createReviewSubmissionIdempotencyKey(input: {
  submissionId: string;
  targetRevisionId: string;
  action: ReviewSubmissionActionKind;
  correlationId: string;
}): string {
  return `${input.submissionId}:${input.targetRevisionId}:${input.action}:${input.correlationId}`;
}
