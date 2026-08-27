import type { ReviewInboxItem, ReviewSubmissionLoadContext } from './reviewStatusTypes';

export type ReviewWorkbenchStatus =
  | 'idle'
  | 'loaded'
  | 'dirty'
  | 'saved_local'
  | 'saved_remote'
  | 'approved_local'
  | 'rejected_local'
  | 'changes_requested_local';

export type ReviewPackageSession = {
  packageId: string;
  source: ReviewInboxItem['source'];
  fileName?: string;
  worldId: string;
  loadedAt: string;
  updatedAt?: string;
  reviewerLabel?: string;
  status: ReviewWorkbenchStatus;
  dirty: boolean;
  featureCount: number;
  deleteCount: number;
  pictureCount: number;
  submissionContext?: ReviewSubmissionLoadContext;
};

export function createReviewPackageSession(item: ReviewInboxItem): ReviewPackageSession {
  const pictureCount = Object.values(item.picturesById ?? {}).reduce((sum, entries) => sum + entries.length, 0);
  return {
    packageId: item.packageId,
    source: item.source,
    fileName: item.packagePath,
    worldId: item.worldId,
    loadedAt: new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.createdAt,
    reviewerLabel: undefined,
    status: 'loaded',
    dirty: false,
    featureCount: item.features.length,
    deleteCount: item.deleteMarks.length,
    pictureCount,
    ...(item.submissionContext ? { submissionContext: item.submissionContext } : {}),
  };
}

export function describeReviewWorkbenchStatus(status: ReviewWorkbenchStatus): string {
  switch (status) {
    case 'loaded':
      return '已加载';
    case 'dirty':
      return '有未保存修改';
    case 'saved_local':
      return '已本地保存';
    case 'saved_remote':
      return '已保存新版本';
    case 'approved_local':
      return '已本地通过';
    case 'rejected_local':
      return '已本地打回';
    case 'changes_requested_local':
      return '已请求修改';
    case 'idle':
    default:
      return '未加载';
  }
}
