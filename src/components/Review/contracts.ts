/**
 * Review workspace contracts are intentionally UI-neutral. They describe the
 * seam used by an application-owned Review module without prescribing panels,
 * labels, buttons, or a production approval implementation.
 */
export type ReviewWorkspaceMode = 'runtime' | 'mapping' | 'review';
/**
 * A user-facing intent.  These names deliberately describe a workflow action,
 * not a provider, deployment target, or production-side effect.
 */
export type ReviewIntentKind =
  | 'save'
  | 'submit'
  | 'precheck'
  | 'approve'
  | 'reject'
  | 'request-changes'
  | 'archive'
  | 'status-refresh'
  | 'report-refresh';

/**
 * Submission actions are provider-neutral formal-review semantics. They do not
 * grant deployment authority and do not prescribe a UI or transport.
 */
export type ReviewSubmissionActionKind =
  | 'save'
  | 'precheck'
  | 'approve'
  | 'reject'
  | 'request-changes'
  | 'reopen'
  | 'publish'
  | 'archive'
  | 'refresh';

/**
 * State belongs to a logical submission, while every mutation records the
 * exact revision that it targeted. This prevents a newer edited revision from
 * inheriting a decision made for an older revision.
 */
export type ReviewSubmissionState =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'queued'
  | 'running'
  | 'released'
  | 'mirror-pending'
  | 'mirrored'
  | 'failed'
  | 'archived';

export type ReviewRevisionTag =
  | 'submitted'
  | 'reviewer-modified'
  | 'selected'
  | 'approved-target'
  | 'rejected-target'
  | 'superseded';

export type ReviewPackageRevision = {
  revisionId: string;
  package: ReviewPackageReference;
  contentHash: string;
  byteLength: number;
  createdAt: string;
  createdBy: string;
  basedOnRevisionId?: string;
  tags: ReviewRevisionTag[];
  summary?: string;
};

export type ReviewSubmissionEvent = {
  eventId: string;
  action: ReviewSubmissionActionKind;
  targetRevisionId: string;
  from: ReviewSubmissionState;
  to: ReviewSubmissionState;
  occurredAt: string;
  actor: ReviewAuthorizationContext;
  reason?: string;
};

export type ReviewSubmissionSnapshot = {
  submissionId: string;
  packageName: string;
  state: ReviewSubmissionState;
  /** Incremented by every package-level event and required by mutations. */
  stateVersion: number;
  currentRevisionId: string;
  displayRevisionId: string;
  revisions: ReviewPackageRevision[];
  lastEvent: ReviewSubmissionEvent | null;
  allowedActions: ReviewSubmissionActionKind[];
};

export type ReviewSubmissionRequest = {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  submissionId: string;
  targetRevisionId: string;
  expectedStateVersion: number;
  action: ReviewSubmissionActionKind;
  occurredAt: string;
  actor: ReviewAuthorizationContext;
  reason?: string;
};

export type ReviewSubmissionResult = {
  requestId: string;
  correlationId: string;
  submission: ReviewSubmissionSnapshot;
  auditEvent?: ReviewSubmissionEvent;
  reportReference?: string;
};

export type ReviewReleaseFeedItem = {
  releaseId: string;
  occurredAt: string;
  datasets: string[];
  approvedBy: string[];
  state: Extract<ReviewSubmissionState, 'released' | 'mirror-pending' | 'mirrored' | 'failed'>;
  rejectedSincePreviousRelease: Array<Pick<ReviewSubmissionEvent, 'targetRevisionId' | 'occurredAt' | 'actor' | 'reason'>>;
};

export type ReviewWorkflowState =
  | 'draft'
  | 'submitted'
  | 'precheck-running'
  | 'precheck-passed'
  | 'precheck-failed'
  | 'awaiting-approval'
  | 'approved'
  | 'dispatch-queued'
  | 'dispatch-running'
  | 'completed'
  | 'failed'
  | 'rejected'
  | 'changes-requested'
  | 'archived';

export type ReviewAuthorizationContext = {
  /** Application-defined opaque identity; it is never a secret. */
  principalId: string;
  roles: string[];
};

export type ReviewWorkflowRequest = {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  intent: ReviewIntentKind;
  packageId: string;
  occurredAt: string;
  actor: ReviewAuthorizationContext;
  /** Adapter-owned metadata.  Core code must not interpret provider details. */
  metadata?: Record<string, string>;
};

export type ReviewAuditEvent = {
  eventId: string;
  requestId: string;
  correlationId: string;
  intent: ReviewIntentKind;
  from: ReviewWorkflowState | null;
  to: ReviewWorkflowState;
  occurredAt: string;
};

export type ReviewWorkflowResult = {
  requestId: string;
  correlationId: string;
  state: ReviewWorkflowState;
  auditEvent?: ReviewAuditEvent;
  reportReference?: string;
};

export type ReviewWorkflowErrorCode =
  | 'invalid-transition'
  | 'unauthorized'
  | 'conflict'
  | 'unavailable'
  | 'invalid-request';

export type ReviewWorkflowError = {
  code: ReviewWorkflowErrorCode;
  message: string;
  retryable: boolean;
};

export type ReviewPackageReference = {
  packageId: string;
  worldId: string;
  source: 'local-file' | 'inbox-adapter';
  featureCount: number;
  deleteCount: number;
  pictureCount: number;
};

export type ReviewWorkspaceSession = {
  package: ReviewPackageReference | null;
  dirty: boolean;
  lastIntent: { kind: ReviewIntentKind; occurredAt: string } | null;
};

export type ReviewTemporaryLayers = {
  create: unknown[];
  update: unknown[];
  delete: unknown[];
  picture: unknown[];
};

export interface TemporaryLayerPort {
  mount(packageId: string, layers: ReviewTemporaryLayers): void;
  clear(packageId?: string): void;
}

export interface ReviewWorkflowTransport {
  dispatch(request: ReviewWorkflowRequest): Promise<ReviewWorkflowResult>;
  getStatus?(packageId: string, actor: ReviewAuthorizationContext): Promise<ReviewWorkflowResult>;
  getReport?(packageId: string, actor: ReviewAuthorizationContext): Promise<ReviewWorkflowResult>;
}

/** `approve` is an application intent, never a formal production approval. */
export interface ReviewWorkflowAdapter {
  loadInbox?(): Promise<ReviewPackageReference[]>;
  submitIntent?(request: ReviewWorkflowRequest): Promise<ReviewWorkflowResult>;
}

/** Application-owned implementation of the submission review seam. */
export interface ReviewSubmissionAdapter {
  getSubmission(submissionId: string, actor: ReviewAuthorizationContext): Promise<ReviewSubmissionSnapshot>;
  listSubmissions?(actor: ReviewAuthorizationContext): Promise<ReviewSubmissionSnapshot[]>;
  dispatchSubmission(request: ReviewSubmissionRequest): Promise<ReviewSubmissionResult>;
  getReleaseFeed?(actor: ReviewAuthorizationContext, limit?: number): Promise<ReviewReleaseFeedItem[]>;
}

export interface ReviewWorkspaceHostPort {
  requestMode(mode: ReviewWorkspaceMode, reason: string): boolean;
  requestReviewExit(reason: string): boolean;
}

export type ReviewWorkspaceExtensionConfig = {
  schemaVersion: 'cairnmap.review-workspace-extension.v1';
  adapterId: string;
  allowedIntents: ReviewIntentKind[];
  capabilities: { temporaryLayers: boolean; localRelayPackage: boolean };
};
