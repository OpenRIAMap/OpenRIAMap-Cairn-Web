/**
 * Review workspace contracts are intentionally UI-neutral. They describe the
 * seam used by an application-owned Review module without prescribing panels,
 * labels, buttons, or a production approval implementation.
 */
export type ReviewWorkspaceMode = 'runtime' | 'mapping' | 'review';
export type ReviewIntentKind = 'save' | 'approve' | 'reject';

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

/** `approve` is an application intent, never a formal production approval. */
export interface ReviewWorkflowAdapter {
  loadInbox?(): Promise<ReviewPackageReference[]>;
  submitIntent?(intent: { kind: ReviewIntentKind; packageId: string; occurredAt: string }): Promise<void> | void;
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
