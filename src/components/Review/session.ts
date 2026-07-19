import type { ReviewIntentKind, ReviewPackageReference, ReviewWorkspaceSession } from './contracts';

export const emptyReviewWorkspaceSession = (): ReviewWorkspaceSession => ({ package: null, dirty: false, lastIntent: null });

export function loadReviewWorkspaceSession(item: ReviewPackageReference): ReviewWorkspaceSession {
  return { package: item, dirty: false, lastIntent: null };
}

export function markReviewWorkspaceDirty(session: ReviewWorkspaceSession): ReviewWorkspaceSession {
  return session.package ? { ...session, dirty: true } : session;
}

export function recordReviewWorkspaceIntent(session: ReviewWorkspaceSession, kind: ReviewIntentKind, occurredAt = new Date().toISOString()): ReviewWorkspaceSession {
  return session.package ? { ...session, dirty: false, lastIntent: { kind, occurredAt } } : session;
}
