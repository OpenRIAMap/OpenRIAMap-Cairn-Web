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
  /** Application-defined opaque identity; it is never a credential. */
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
