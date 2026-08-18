import { useCallback, useMemo } from 'react';
import { materializeRiaReviewPackageForWorkspace } from '@/components/Mapping/core/relayPackageParser';
import { createReviewItemFromParsedRelayPackage } from './reviewInboxReader';
import { openriamapGithubReviewAuth } from './openriamapReviewAuth';
import { createRiaReviewSubmissionAdapter, requestRiaReviewRevisionDownload } from './riaReviewSubmissionAdapter';
import { ReviewStatusBoardPanel, type ReviewStatusDraftSignal } from './ReviewStatusBoardPanel';
import type { ReviewPackageRevision, ReviewSubmissionSnapshot, ReviewWorkspaceLoadProgress } from './contracts';
import type { ReviewInboxItem } from './reviewStatusTypes';

type ReviewModuleProps = {
  activeWorldId: string;
  dirty: boolean;
  onClose: () => void;
  onLoadPackage: (item: ReviewInboxItem) => void;
};

async function sha256Hex(blob: Blob): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * RIA application binding for the upstream generic status-board workbench.
 * This layer owns session use, broker-issued archive downloads, Relay parsing,
 * and map-workspace injection. It deliberately owns no queue UI or generic
 * review-state semantics.
 */
export default function ReviewModule({ activeWorldId, dirty, onClose, onLoadPackage }: ReviewModuleProps) {
  const adapter = useMemo(() => createRiaReviewSubmissionAdapter(), []);

  const onLoadRevision = useCallback(async (
    { submission, revision }: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision },
    reportProgress?: (progress: ReviewWorkspaceLoadProgress) => void,
  ) => {
    if (dirty && !window.confirm('当前审核工作区有未保存修改。加载其他审核包会清理该工作区，是否继续？')) return;
    reportProgress?.({ stage: 'requesting-download', message: '正在申请审核包下载…' });
    const grant = await requestRiaReviewRevisionDownload(submission.submissionId, revision.revisionId);
    reportProgress?.({ stage: 'downloading', message: '正在下载审核包…', completedBytes: 0, totalBytes: grant.download.byteLength });
    const response = await fetch(grant.download.url);
    if (!response.ok) throw new Error(`审核包下载失败：HTTP ${response.status}`);
    const blob = await response.blob();
    reportProgress?.({ stage: 'verifying', message: '正在校验审核包…', completedBytes: blob.size, totalBytes: grant.download.byteLength });
    if (blob.size !== grant.download.byteLength) throw new Error('审核包下载长度校验失败。');
    if (await sha256Hex(blob) !== grant.download.sha256.toLowerCase()) throw new Error('审核包下载哈希校验失败。');
    const file = new File([blob], submission.packageName || `${submission.submissionId}.zip`, { type: 'application/zip' });
    reportProgress?.({ stage: 'parsing', message: '正在解析标准 RelayPackage…' });
    const parsed = await materializeRiaReviewPackageForWorkspace(file);
    const item = createReviewItemFromParsedRelayPackage(file.name, parsed, activeWorldId);
    reportProgress?.({ stage: 'injecting', message: '正在注入审核图层管理…' });
    onLoadPackage({
      ...item,
      packageId: submission.submissionId,
      status: submission.state,
      updatedAt: submission.lastEvent?.occurredAt,
      source: 'local-file',
    });
    reportProgress?.({ stage: 'ready', message: '审核包已加载到审核工作区。' });
  }, [activeWorldId, dirty, onLoadPackage]);

  const subscribeToStatusDraft = useCallback((listener: (signal: ReviewStatusDraftSignal) => void) => {
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<Partial<ReviewStatusDraftSignal>>).detail;
      if (!detail?.submissionId || !detail.state) return;
      listener({ submissionId: detail.submissionId, state: detail.state, ...(detail.reason ? { reason: detail.reason } : {}), ...(detail.decisionAction ? { decisionAction: detail.decisionAction } : {}) });
    };
    window.addEventListener('cairn-review-status-draft', receive);
    return () => window.removeEventListener('cairn-review-status-draft', receive);
  }, []);

  const subscribeToSubmissionUpload = useCallback((listener: (submissionId?: string) => void) => {
    const receive = (event: Event) => listener((event as CustomEvent<{ submissionId?: string }>).detail?.submissionId);
    window.addEventListener('cairn-review-submission-uploaded', receive);
    return () => window.removeEventListener('cairn-review-submission-uploaded', receive);
  }, []);

  return <ReviewStatusBoardPanel
    auth={openriamapGithubReviewAuth}
    submissionAdapter={adapter}
    releaseControl={adapter}
    onLoadRevision={onLoadRevision}
    onClose={onClose}
    subscribeToStatusDraft={subscribeToStatusDraft}
    subscribeToSubmissionUpload={subscribeToSubmissionUpload}
  />;
}
