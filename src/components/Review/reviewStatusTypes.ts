import type { RelayDeleteMarkItem } from '@/components/Mapping/core/relayPackageDraft';

export type ReviewStatus =
  | 'pending'
  | 'precheck_passed'
  | 'precheck_failed'
  | 'accepted'
  | 'rejected'
  | 'changes_requested'
  | 'archived'
  | string;

export type ReviewActionStatus = {
  status?: string | null;
  runId?: string | null;
  reportPath?: string | null;
  finalStatus?: string | null;
  updatedAt?: string | null;
};

export type ReviewHistoryItem = {
  at?: string | null;
  from?: string | null;
  to?: string | null;
  stage?: string | null;
  reason?: string | null;
};

export type ReviewPackageMeta = {
  operator?: string;
  note?: string;
  version?: string;
  packageVersion?: string | number;
  exportedAt?: string;
  featureCount?: number;
  pictureCount?: number;
  deleteCount?: number;
};

export type ReviewPackageDecision = {
  schemaVersion?: string;
  status?: string | null;
  reviewer?: string | null;
  reviewedAt?: string | null;
  decision?: string | null;
  notes?: unknown[];
  precheck?: {
    status?: string | null;
    warnings?: string[];
    errors?: string[];
  };
  history?: ReviewHistoryItem[];
};

export type ReviewPictureEntry = {
  source: 'dat' | 'pub';
  url: string;
  filename?: string;
  relativePath?: string;
};

export type ReviewInboxItem = {
  packageId: string;
  projectId?: string;
  worldId: string;
  status: ReviewStatus;
  currentStage?: string;
  createdAt?: string;
  updatedAt?: string;
  packagePath?: string;
  packageType?: string;
  meta?: ReviewPackageMeta;
  review?: ReviewPackageDecision;
  precheck?: ReviewActionStatus;
  accept?: ReviewActionStatus;
  history: ReviewHistoryItem[];
  warnings: string[];
  errors: string[];
  features: any[];
  deleteMarks: RelayDeleteMarkItem[];
  picturesById: Record<string, ReviewPictureEntry[]>;
  source: 'sample' | 'local-file';
};

export type ReviewInboxPayloadItem = Omit<ReviewInboxItem, 'source'> & { source?: ReviewInboxItem['source'] };

export type ReviewInboxPayload = {
  schemaVersion?: string;
  generatedFrom?: string[];
  items?: ReviewInboxPayloadItem[];
};

export type ReviewLayerVisibility = {
  create: boolean;
  update: boolean;
  delete: boolean;
  pictures: boolean;
};

export type ReviewLayerMountSummary = {
  createCount: number;
  updateCount: number;
  deleteCount: number;
  pictureCount: number;
};

export const DEFAULT_REVIEW_LAYER_VISIBILITY: ReviewLayerVisibility = {
  create: true,
  update: true,
  delete: true,
  pictures: true,
};
