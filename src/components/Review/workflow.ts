import type { ReviewIntentKind, ReviewWorkflowRequest, ReviewWorkflowState } from './contracts';

const transitions: Record<ReviewWorkflowState, readonly ReviewWorkflowState[]> = {
  draft: ['submitted', 'archived'],
  submitted: ['precheck-running', 'rejected', 'changes-requested', 'archived'],
  'precheck-running': ['precheck-passed', 'precheck-failed'],
  'precheck-passed': ['awaiting-approval', 'changes-requested', 'rejected', 'archived'],
  'precheck-failed': ['submitted', 'changes-requested', 'rejected', 'archived'],
  'awaiting-approval': ['approved', 'changes-requested', 'rejected', 'archived'],
  approved: ['dispatch-queued', 'archived'],
  'dispatch-queued': ['dispatch-running', 'failed'],
  'dispatch-running': ['completed', 'failed'],
  completed: ['archived'],
  failed: ['submitted', 'archived'],
  rejected: ['submitted', 'archived'],
  'changes-requested': ['submitted', 'archived'],
  archived: [],
};

const intentTargets: Partial<Record<ReviewIntentKind, ReviewWorkflowState>> = {
  submit: 'submitted',
  precheck: 'precheck-running',
  approve: 'awaiting-approval',
  reject: 'rejected',
  'request-changes': 'changes-requested',
  archive: 'archived',
};

export function canTransitionReviewWorkflow(from: ReviewWorkflowState, to: ReviewWorkflowState): boolean {
  return transitions[from].includes(to);
}

export function targetStateForReviewIntent(intent: ReviewIntentKind): ReviewWorkflowState | null {
  return intentTargets[intent] ?? null;
}

export function createReviewWorkflowIdempotencyKey(request: Pick<ReviewWorkflowRequest, 'packageId' | 'intent' | 'correlationId'>): string {
  return `${request.packageId}:${request.intent}:${request.correlationId}`;
}
