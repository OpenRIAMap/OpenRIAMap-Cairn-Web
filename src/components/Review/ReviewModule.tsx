import { useCallback, useMemo } from 'react';
import { DraggablePanel } from '@/components/DraggablePanel/DraggablePanel';
import { parseRelayPackageZip } from '@/components/Mapping/core/relayPackageParser';
import { createReviewItemFromParsedRelayPackage } from './reviewInboxReader';
import ReviewLayerManagerPanel from './ReviewLayerManagerPanel';
import { openriamapGithubReviewAuth } from './openriamapReviewAuth';
import { createRiaReviewSubmissionAdapter, requestRiaReviewRevisionDownload } from './riaReviewSubmissionAdapter';
import { ReviewStatusBoardPanel, type ReviewStatusDraftSignal } from './ReviewStatusBoardPanel';
import type { ReviewPackageRevision, ReviewSubmissionSnapshot } from './contracts';
import type { ReviewInboxItem } from './reviewStatusTypes';
import type { ReviewPackageSession } from './reviewPackageSession';

type ReviewModuleProps = {
  activeWorldId: string;
  session: ReviewPackageSession | null;
  dirty: boolean;
  onClose: () => void;
  onLoadPackage: (item: ReviewInboxItem) => void;
};

/**
 * RIA application binding for the upstream generic status-board workbench.
 * This layer owns GitHub session use, broker-issued archive downloads, Relay
 * parsing, and map-workspace injection. It deliberately owns no queue UI,
 * state-board semantics, or release-control orchestration.
 */
export default function ReviewModule({ activeWorldId, session, dirty, onClose, onLoadPackage }: ReviewModuleProps) {
  const adapter = useMemo(() => createRiaReviewSubmissionAdapter(), []);

  const onLoadRevision = useCallback(async ({ submission, revision }: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision }) => {
    if (dirty && !window.confirm('当前审核工作区有未保存修改。加载其他审核包会清理该工作区，是否继续？')) return;
    const grant = await requestRiaReviewRevisionDownload(submission.submissionId, revision.revisionId);
    const response = await fetch(grant.download.url);
    if (!response.ok) throw new Error(`审核包下载失败：HTTP ${response.status}`);
    const blob = await response.blob();
    if (blob.size !== grant.download.byteLength) throw new Error('审核包下载长度校验失败。');
    const file = new File([blob], submission.packageName || `${submission.submissionId}.zip`, { type: 'application/zip' });
    const parsed = await parseRelayPackageZip(file);
    const item = createReviewItemFromParsedRelayPackage(file.name, parsed, activeWorldId);
    onLoadPackage({
      ...item,
      packageId: submission.submissionId,
      status: submission.state,
      updatedAt: submission.lastEvent?.occurredAt,
      source: 'local-file',
    });
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
    workspacePanel={<DraggablePanel id="review-status-panel" defaultPosition={{ x: 424, y: 132 }} zIndex={1755} constrainExpandedToViewport><ReviewLayerManagerPanel session={session} dirty={dirty} /></DraggablePanel>}
  />;
}
