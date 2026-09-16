import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Archive, CheckCircle2, ClipboardCheck, FileDown, FileText, RefreshCw, RotateCcw, Send, ShieldCheck, XCircle } from 'lucide-react';
import AppButton from '@/components/ui/AppButton';
import { DraggablePanel } from '@/components/DraggablePanel/DraggablePanel';
import { REVIEW_LAYER } from './reviewLayering';
import type { ReviewAuthPort } from './auth';
import {
  createIdleReviewReleaseGate,
  ReviewOperationError,
  type ReviewAuthorizationContext,
  type ReviewPackagePrecheckReport,
  type ReviewPackageRevision,
  type ReviewReleaseControlPort,
  type ReviewReleaseControlReport,
  type ReviewReleaseGateSnapshot,
  type ReviewReleaseProgress,
  type ReviewStatusBoardAdapter,
  type ReviewSubmissionAdapter,
  type ReviewSubmissionSnapshot,
  type ReviewWorkspaceLoadProgress,
} from './contracts';
import {
  compareReviewStatusBoards,
  isReviewReleaseGateLeaseActive,
  isReviewReleaseGateLeaseExpired,
  isReviewStatusBoardDirty,
  type ReviewStatusBoardEntry,
  type ReviewStatusBoardSnapshot,
  type ReviewStatusDecisionAction,
} from './statusBoard';

export type ReviewStatusDraftSignal = {
  submissionId: string;
  state: ReviewStatusBoardEntry['state'];
  reason?: string;
  decisionAction?: ReviewStatusDecisionAction;
};

type PendingReviewConfirmation = {
  title: string;
  message: string;
  confirmLabel: string;
  tone?: 'blue' | 'green' | 'orange' | 'rose';
  reasonLabel?: string;
  onConfirm: (reason: string) => Promise<void> | void;
};

export type ReviewStatusBoardPanelProps = {
  auth: ReviewAuthPort;
  submissionAdapter: ReviewSubmissionAdapter & ReviewStatusBoardAdapter;
  releaseControl: ReviewReleaseControlPort;
  onDownloadRevision(
    input: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision },
    reportProgress?: (progress: ReviewWorkspaceLoadProgress) => void,
  ): Promise<void> | void;
  onLoadRevision(
    input: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision },
    reportProgress?: (progress: ReviewWorkspaceLoadProgress) => void,
  ): Promise<void> | void;
  onLocalPrecheck(input: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision }): Promise<ReviewPackagePrecheckReport> | ReviewPackagePrecheckReport;
  isRevisionCached(input: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision }): boolean;
  onClearRevisionCache?(input?: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision }): void;
  onClose: () => void;
  subscribeToStatusDraft?: (listener: (signal: ReviewStatusDraftSignal) => void) => () => void;
  subscribeToSubmissionUpload?: (listener: (submissionId?: string) => void) => () => void;
};

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

function stateLabel(state: string) {
  return ({ pending: '待审核', approved: '已通过', rejected: '已打回', archived: '已归档', queued: '已排队', running: '发布中', 'mirror-pending': '镜像等待中', mirrored: '已镜像', 'archive-pending': '等待归档', archiving: '正在归档', completed: '发布完成', 'rebase-required': '需要重新检查', 'mirror-recovery-required': '镜像需恢复', 'archive-recovery-required': '归档需恢复', failed: '失败' } as Record<string, string>)[state] ?? state;
}

function stateTone(state: string) {
  return ({ pending: 'bg-amber-100 text-amber-800', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', archived: 'bg-gray-200 text-gray-700' } as Record<string, string>)[state] ?? 'bg-blue-100 text-blue-700';
}

function isStatusLampState(state: string): state is ReviewStatusBoardEntry['state'] {
  return ['pending', 'approved', 'rejected', 'archived'].includes(state);
}

function displayState(submission: ReviewSubmissionSnapshot, entry?: ReviewStatusBoardEntry): string {
  // A review lamp is an independent reviewer decision. Publication lifecycle
  // is displayed separately and must never overwrite the saved lamp.
  return entry?.state ?? (isStatusLampState(submission.state) ? submission.state : 'pending');
}

function isPublicationLifecycleState(state: string): boolean {
  return !isStatusLampState(state);
}

/** Historical archive lamps must not be selected for normal release. */
function isHistoricalArchiveCandidate(submission: ReviewSubmissionSnapshot, entry?: ReviewStatusBoardEntry): boolean {
  return submission.archive?.state !== 'completed'
    && (submission.state === 'archived'
      || (submission.state === 'mirrored' && entry?.state === 'archived' && entry.decisionRevisionId === submission.displayRevisionId));
}

function describeError(error: unknown) {
  if (error instanceof ReviewOperationError) {
    const correlation = error.correlationId ? `（关联 ID：${error.correlationId}）` : '';
    const details = error.details.length ? ` ${error.details.join('；')}` : '';
    return `${error.code}：${error.message}${correlation}${details}`;
  }
  return error instanceof Error ? error.message : String(error);
}

function normalizeGate(value: ReviewReleaseGateSnapshot | null | undefined) {
  return value && typeof value.state === 'string' ? value : createIdleReviewReleaseGate();
}

function reviewDecisionLabel(decision: string | undefined): string {
  return ({
    ready: '可继续',
    'warning-confirmation-required': '需要人工确认',
    blocked: '已阻断',
    stale: '状态已过期',
  } as Record<string, string>)[decision ?? ''] ?? '无结论';
}

function reviewFindingLabel(code: string, fallback?: string): string {
  return ({
    PACKAGE_INVALID: '审核包包含无效的要素或删除标识。',
    UPSERT_DUPLICATE: '审核包中存在重复的要素更新或删除目标。',
    DELETE_TARGET_MISSING: '删除目标不存在于当前正式数据中。',
    DELETE_TARGET_AMBIGUOUS: '删除目标匹配多个要素；请补充世界和分类。',
    SOURCE_SNAPSHOT_UNAVAILABLE: '当前正式数据快照不可用或不完整。',
    SUBMISSION_STATE_CHANGED: '审核包状态已被其他操作更新。',
    RELEASE_IN_PROGRESS: '当前已有发布正在进行。',
    BASE_RELEASE_CHANGED: '该包基于较早的正式版本，将按当前正式数据继续核验。',
    UPSERT_OVERWRITES_CURRENT: '该要素会覆盖当前同世界、同分类、同 ID 的要素。',
    DELETE_EXISTING_TARGET: '删除目标存在；确认后将从正式数据中移除。',
    SOURCE_FINGERPRINT_UNAVAILABLE: '当前或待更新要素缺少内容指纹，无法精确比较覆盖差异。',
    BATCH_TARGET_OVERLAP: '另一已选审核包更新同一要素；请确认发布顺序。',
    BATCH_DELETE_TARGET_OVERLAP: '另一已选审核包删除同一目标；请仅保留一个版本。',
    PRECHECK_STALE: '预检结果已过期，请重新执行预检。',
  } as Record<string, string>)[code] ?? fallback ?? '未提供阻断或警告说明。';
}

function createEntry(submission: ReviewSubmissionSnapshot, existing?: ReviewStatusBoardEntry): ReviewStatusBoardEntry {
  if (existing) return existing;
  const state = ['pending', 'approved', 'rejected', 'archived'].includes(submission.state)
    ? submission.state as ReviewStatusBoardEntry['state']
    : 'pending';
  return {
    submissionId: submission.submissionId,
    state,
    decisionRevisionId: state === 'pending' ? submission.currentRevisionId : submission.displayRevisionId,
    updatedAt: submission.lastEvent?.occurredAt ?? new Date().toISOString(),
    updatedBy: submission.lastEvent?.actor ?? { principalId: 'system', roles: [] },
    ...(submission.lastEvent?.reason ? { reason: submission.lastEvent.reason } : {}),
  };
}

function reportView(report: ReviewReleaseControlReport | ReviewPackagePrecheckReport | null, title: string) {
  if (!report) return null;
  const rawFindings = 'findings' in report ? report.findings : report.report?.findings ?? [];
  const localizedFindings = rawFindings.map((finding) => {
    const code = 'code' in finding ? finding.code : undefined;
    return {
      ...finding,
      key: code ?? finding.message ?? 'finding',
      message: code ? reviewFindingLabel(code, finding.message) : finding.message ?? '未提供阻断或警告说明。',
    };
  });
  return <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
    <div className="font-semibold">{title}：{reviewDecisionLabel(report.decision)}</div>
    {localizedFindings.length ? <div className="mt-2 space-y-1">{localizedFindings.map((finding, index) => <div key={`${finding.key}-${index}`} className={finding.severity === 'blocker' ? 'text-red-700' : finding.severity === 'warning' ? 'text-amber-700' : 'text-gray-600'}>• {finding.message}</div>)}</div> : <div className="mt-1 text-gray-500">未返回阻断或警告项。</div>}
  </div>;
}
function progressText(progress: ReviewWorkspaceLoadProgress) {
  if (!progress.totalBytes || progress.completedBytes === undefined) return progress.message;
  return `${progress.message} ${Math.min(100, Math.round((progress.completedBytes / progress.totalBytes) * 100))}%`;
}

export function ReviewStatusBoardPanel({ auth, submissionAdapter, releaseControl, onDownloadRevision, onLoadRevision, onLocalPrecheck, isRevisionCached, onClearRevisionCache, onClose, subscribeToStatusDraft, subscribeToSubmissionUpload }: ReviewStatusBoardPanelProps) {
  const [actor, setActor] = useState<ReviewAuthorizationContext>({ principalId: 'anonymous', roles: [] });
  const [submissions, setSubmissions] = useState<ReviewSubmissionSnapshot[]>([]);
  const [board, setBoard] = useState<ReviewStatusBoardSnapshot | null>(null);
  const [draft, setDraft] = useState<ReviewStatusBoardEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [historicalArchiveSelectedIds, setHistoricalArchiveSelectedIds] = useState<Set<string>>(() => new Set());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [revisionId, setRevisionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [packageReport, setPackageReport] = useState<ReviewPackagePrecheckReport | null>(null);
  const [releaseReport, setReleaseReport] = useState<ReviewReleaseControlReport | null>(null);
  const [releaseGate, setReleaseGate] = useState<ReviewReleaseGateSnapshot | null>(null);
  const [activeReleaseId, setActiveReleaseId] = useState<string | null>(null);
  const [releaseProgress, setReleaseProgress] = useState<ReviewReleaseProgress | null>(null);
  const [loadProgress, setLoadProgress] = useState<ReviewWorkspaceLoadProgress | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingReviewConfirmation | null>(null);
  const [confirmationReason, setConfirmationReason] = useState('');
  const recoveredReleaseActorRef = useRef<string | null>(null);

  const detail = submissions.find((submission) => submission.submissionId === detailId) ?? null;
  const detailEntry = detail ? draft.find((entry) => entry.submissionId === detail.submissionId) : undefined;
  const revision = detail?.revisions.find((candidate) => candidate.revisionId === revisionId)
    ?? detail?.revisions.find((candidate) => candidate.revisionId === detail.currentRevisionId)
    ?? null;
  const canEditDetailLamp = Boolean(detail && revision && !isHistoricalArchiveCandidate(detail, detailEntry));
  const revisionCached = Boolean(detail && revision && isRevisionCached({ submission: detail, revision }));
  const selectedEntries = useMemo(() => draft.filter((entry) => selectedIds.has(entry.submissionId) && !submissions.some((item) => item.submissionId === entry.submissionId && isHistoricalArchiveCandidate(item, entry))), [draft, selectedIds, submissions]);
  const historicalArchiveCandidates = useMemo(() => submissions.filter((submission) => isHistoricalArchiveCandidate(submission, draft.find((entry) => entry.submissionId === submission.submissionId))), [draft, submissions]);
  const dirty = board ? isReviewStatusBoardDirty({ baseBoardVersion: board.boardVersion, entries: draft }, board) : false;
  const publishReady = releaseReport?.decision === 'ready' || releaseReport?.decision === 'warning-confirmation-required';

  const refreshList = useCallback(async ({ preserveMessage = false }: { preserveMessage?: boolean } = {}) => {
    setBusy('refresh');
    if (!preserveMessage) setMessage(null);
    try {
      const session = await auth.getSession();
      if (session.status !== 'authenticated' || !session.principalId) throw new ReviewOperationError({ code: 'authentication-required', message: session.message ?? '请先登录 GitHub 组织身份。' });
      const currentActor = { principalId: session.principalId, roles: session.roles ?? [] };
      const [items, remoteBoard] = await Promise.all([
        submissionAdapter.listSubmissions?.(currentActor) ?? Promise.resolve([]),
        submissionAdapter.getStatusBoard(currentActor),
      ]);
      const remoteById = new Map(remoteBoard.entries.map((entry) => [entry.submissionId, entry]));
      const hydrated = items.map((item) => createEntry(item, remoteById.get(item.submissionId)));
      setActor(currentActor);
      setSubmissions(items);
      setBoard({ ...remoteBoard, entries: hydrated });
      setDraft(hydrated);
      setSelectedIds((previous) => new Set([...previous].filter((id) => items.some((item) => item.submissionId === id && !isHistoricalArchiveCandidate(item, hydrated.find((entry) => entry.submissionId === id))))));
      setHistoricalArchiveSelectedIds((previous) => new Set([...previous].filter((id) => items.some((item) => item.submissionId === id && isHistoricalArchiveCandidate(item, hydrated.find((entry) => entry.submissionId === id))))));
      setDetailId((previous) => previous && items.some((item) => item.submissionId === previous) ? previous : null);
    } catch (error) {
      setMessage(describeError(error));
    } finally {
      setBusy(null);
    }
  }, [auth, submissionAdapter]);

  const updateDraft = useCallback((submissionId: string, state: ReviewStatusBoardEntry['state'], decisionAction?: ReviewStatusDecisionAction, reason?: string) => {
    const current = draft.find((entry) => entry.submissionId === submissionId);
    const selected = submissions.find((item) => item.submissionId === submissionId);
    if (!current || !selected) return;
    if (!decisionAction) {
      setMessage('审核状态灯操作缺少决定类型。');
      return;
    }
    const actionLabel = ({ approve: '通过', reject: '打回', 'request-changes': '要求修改', archive: '归档', reopen: '恢复待审' } as Record<string, string>)[decisionAction ?? ''] ?? stateLabel(state);
    const selectedRevision = selected.revisions.find((item) => item.revisionId === revisionId) ?? selected.revisions.find((item) => item.revisionId === selected.currentRevisionId);
    setConfirmationReason(reason ?? '');
    setPendingConfirmation({
      title: `设置状态灯：${actionLabel}`,
      message: `确认将此审核包的状态灯设为“${actionLabel}”？此操作只会修改本地草稿；不会创建新版本、重新发布或回滚数据。点击“保存状态”后才会提交至审核服务。`,
      confirmLabel: `确认${actionLabel}`,
      tone: decisionAction === 'reject' || decisionAction === 'request-changes' ? 'rose' : decisionAction === 'approve' ? 'green' : 'orange',
      ...(decisionAction === 'reject' || decisionAction === 'request-changes' ? { reasonLabel: decisionAction === 'reject' ? '打回原因' : '要求修改的原因' } : {}),
      onConfirm: (confirmedReason) => {
        const finalReason = confirmedReason.trim() || reason?.trim();
        if ((decisionAction === 'reject' || decisionAction === 'request-changes') && !finalReason) {
          setMessage('请填写该状态灯的原因。');
          return;
        }
        setDraft((entries) => entries.map((entry) => entry.submissionId !== submissionId ? entry : {
          ...entry,
          state,
          decisionRevisionId: selectedRevision?.revisionId ?? entry.decisionRevisionId,
          ...(decisionAction ? { decisionAction } : {}),
          ...(finalReason ? { reason: finalReason } : {}),
          updatedAt: new Date().toISOString(),
          updatedBy: actor,
        }));
        if (!isHistoricalArchiveCandidate(selected, current)) setSelectedIds((previous) => new Set(previous).add(submissionId));
      },
    });
  }, [actor, draft, revisionId, submissions]);

  const saveStatus = useCallback(async () => {
    if (!board || !selectedEntries.length) return;
    setBusy('save-status');
    try {
      const remote = await submissionAdapter.getStatusBoard(actor);
      const differences = compareReviewStatusBoards(draft, remote.entries).filter((difference) => difference.kind !== 'unchanged');
      const revisionChanges = differences.filter((difference) => difference.kind === 'revision-changed');
      if (revisionChanges.length) {
        setMessage(`保存状态已阻断：${revisionChanges.map((difference) => difference.submissionId).join('、')} 的云端决策版本已变化。请刷新并检查对应审核包。`);
        return;
      }
      const expectedBoardVersion = remote.boardVersion;
      setConfirmationReason('');
      setPendingConfirmation({
        title: '保存审核状态',
        message: differences.length
          ? `检测到云端状态灯变化：${differences.map((difference) => `${difference.submissionId}（${difference.kind}）`).join('；')}。确认以本地已选择状态覆盖这些变化，并保存 ${selectedEntries.length} 个审核包的状态灯？`
          : `确认保存 ${selectedEntries.length} 个审核包的状态灯？`,
        confirmLabel: '保存状态',
        tone: 'orange',
        onConfirm: async () => {
          setBusy('save-status');
          try {
            await submissionAdapter.saveStatusBoard({
              requestId: createId('status-save'), correlationId: createId('status-correlation'), idempotencyKey: createId('status-idempotency'),
              expectedBoardVersion, entries: selectedEntries, actor, occurredAt: new Date().toISOString(),
            });
            setReleaseReport(null);
            await refreshList({ preserveMessage: true });
            setMessage('审核状态已保存。');
          } catch (error) {
            setMessage(describeError(error));
          } finally {
            setBusy(null);
          }
        },
      });
    } catch (error) {
      setMessage(describeError(error));
    } finally {
      setBusy(null);
    }
  }, [actor, board, draft, refreshList, selectedEntries, submissionAdapter]);

  const loadWorkspace = useCallback(async () => {
    if (!detail || !revision) return;
    if (!isRevisionCached({ submission: detail, revision })) {
      setMessage('请先下载并校验该审核包，再置入审核工作区。');
      return;
    }
    setBusy('load');
    setLoadProgress({ stage: 'requesting-download', message: '正在申请审核包下载…' });
    try {
      await onLoadRevision({ submission: detail, revision }, setLoadProgress);
      setMessage('审核包已下载并加载到审核工作区。');
    } catch (error) {
      setMessage(describeError(error));
    } finally {
      setLoadProgress(null);
      setBusy(null);
    }
  }, [detail, isRevisionCached, onLoadRevision, revision]);

  const downloadRevision = useCallback(async () => {
    if (!detail || !revision) return;
    setBusy('download');
    setLoadProgress({ stage: 'requesting-download', message: '正在申请审核包下载…' });
    try {
      await onDownloadRevision({ submission: detail, revision }, setLoadProgress);
      setMessage('审核包已下载、校验并保存在本次浏览器会话中。');
    } catch (error) {
      setMessage(describeError(error));
    } finally {
      setLoadProgress(null);
      setBusy(null);
    }
  }, [detail, onDownloadRevision, revision]);

  const packagePrecheck = useCallback(async () => {
    if (!detail || !revision) return;
    if (!isRevisionCached({ submission: detail, revision })) {
      setMessage('请先下载并校验该审核包，再执行本地预检。');
      return;
    }
    setBusy('package-precheck');
    setPackageReport(null);
    try {
      setPackageReport(await onLocalPrecheck({ submission: detail, revision }));
    } catch (error) {
      setMessage(describeError(error));
    } finally {
      setBusy(null);
    }
  }, [detail, isRevisionCached, onLocalPrecheck, revision]);

  const refreshGate = useCallback(async () => {
    setConfirmationReason('');
    setPendingConfirmation({
      title: '刷新 Release Gate',
      message: '确认刷新 Release Gate？这会读取当前发布锁与执行状态，不会修改任何审核包。',
      confirmLabel: '刷新 Gate',
      tone: 'blue',
      onConfirm: async () => {
        setBusy('gate');
        try {
          const gate = normalizeGate(await releaseControl.getReleaseGate(actor));
          setReleaseGate(gate);
          if (gate.releaseId && ['queueing', 'running', 'mirroring'].includes(gate.state)) {
            setActiveReleaseId(gate.releaseId);
            setReleaseProgress({ releaseId: gate.releaseId, state: gate.state });
          }
        } catch (error) {
          setMessage(describeError(error));
        } finally {
          setBusy(null);
        }
      },
    });
  }, [actor, releaseControl]);

  const releasePrecheck = useCallback(async () => {
    if (!board || !selectedEntries.length) return;
    if (dirty) {
      setMessage('发布前检查已阻断：状态灯存在未保存的本地修改，请先保存状态。');
      return;
    }
    const approved = selectedEntries.find((entry) => entry.state === 'approved' && entry.decisionRevisionId);
    const owner = approved && submissions.find((item) => item.submissionId === approved.submissionId);
    if (!approved || !owner) { setMessage('至少选择一个已通过且已指定版本的审核包。'); return; }
    setBusy('release-precheck');
    try {
      const gate = normalizeGate(await releaseControl.getReleaseGate(actor));
      setReleaseGate(gate);
      if (isReviewReleaseGateLeaseActive(gate)) { setMessage('当前已有发布进行中，请稍后刷新 Release Gate。'); return; }
      if (isReviewReleaseGateLeaseExpired(gate)) setMessage(null);
      const remote = await submissionAdapter.getStatusBoard(actor);
      const differences = compareReviewStatusBoards(draft, remote.entries).filter((difference) => difference.kind !== 'unchanged');
      if (remote.boardVersion !== board.boardVersion || differences.length) {
        const revisionChanges = differences.filter((difference) => difference.kind === 'revision-changed');
        if (revisionChanges.length) {
          setMessage(`发布前检查已阻断：${revisionChanges.map((difference) => difference.submissionId).join('、')} 的云端决策版本已变化。请刷新对应审核包并重新保存状态。`);
        } else {
          setMessage(`发布前检查已阻断：云端状态灯已更新（${differences.map((difference) => `${difference.submissionId}:${difference.kind}`).join('；') || '版本号变化'}）。请确认后先保存状态，再重新检查。`);
        }
        return;
      }
      const result = await releaseControl.runReleasePrecheck({
        selectedSubmissionIds: selectedEntries.map((entry) => entry.submissionId), expectedBoardVersion: board.boardVersion,
        request: { requestId: createId('release-precheck'), correlationId: createId('release-correlation'), idempotencyKey: createId('release-idempotency'), submissionId: owner.submissionId, targetRevisionId: approved.decisionRevisionId!, expectedStateVersion: owner.stateVersion, action: 'publish', occurredAt: new Date().toISOString(), actor },
      }, actor);
      setReleaseReport(result);
      setReleaseGate(normalizeGate(result.gate));
    } catch (error) {
      setMessage(describeError(error));
    } finally {
      setBusy(null);
    }
  }, [actor, board, dirty, draft, releaseControl, selectedEntries, submissionAdapter, submissions]);

  const publish = useCallback(async () => {
    if (!releaseReport?.gate?.attemptId || !releaseReport.report?.reportSha256 || !publishReady) return;
    const approved = selectedEntries.find((entry) => entry.state === 'approved' && entry.decisionRevisionId);
    const owner = approved && submissions.find((item) => item.submissionId === approved.submissionId);
    if (!approved || !owner) return;
    setConfirmationReason('');
    setPendingConfirmation({
      title: '确认发布结果',
      message: '确认发布？服务端会再次校验 Release Gate、当前正式数据和已保存的审核状态。发布进入队列后页面将不再锁定，但发布不会因关闭页面而取消。',
      confirmLabel: '确认发布',
      tone: 'green',
      onConfirm: async () => {
        setBusy('publish');
        try {
          const result = await releaseControl.confirmRelease({
            attemptId: releaseReport.gate!.attemptId!, expectedGateVersion: releaseReport.gate!.gateVersion,
            precheckReportSha256: releaseReport.report!.reportSha256!,
            request: { requestId: createId('publish'), correlationId: createId('publish-correlation'), idempotencyKey: createId('publish-idempotency'), submissionId: owner.submissionId, targetRevisionId: approved.decisionRevisionId!, expectedStateVersion: owner.stateVersion, action: 'publish', occurredAt: new Date().toISOString(), actor },
          }, actor);
          setReleaseReport(result);
          setReleaseGate(normalizeGate(result.gate));
          if (result.release?.releaseId) {
            setActiveReleaseId(result.release.releaseId);
            setReleaseProgress({ releaseId: result.release.releaseId, state: result.release.state ?? 'queueing' });
          }
          setMessage('发布已进入受控执行队列。');
          await refreshList({ preserveMessage: true });
        } catch (error) {
          setMessage(describeError(error));
        } finally {
          setBusy(null);
        }
      },
    });
  }, [actor, publishReady, refreshList, releaseControl, releaseReport, selectedEntries, submissions]);

  const openPublicReleaseRecord = useCallback(() => {
    window.dispatchEvent(new CustomEvent('ria:open-public-release-record'));
  }, []);

  const waitForArchiveReconciliation = useCallback(async (reconciliationId: string) => {
    for (let attempt = 0; attempt < 180; attempt += 1) {
      const progress = await releaseControl.getArchiveReconciliationProgress(reconciliationId, actor);
      const detail = [
        progress.candidateCount ? `审核包：${progress.candidateCount}` : null,
        progress.jobId ? `任务：${progress.jobId}` : null,
      ].filter(Boolean).join(' · ');
      if (progress.state === 'completed') {
        setMessage(`历史归档整理完成。已验证归档副本并移除对应待审核包。${detail ? ` ${detail}` : ''}`);
        await refreshList({ preserveMessage: true });
        openPublicReleaseRecord();
        return;
      }
      if (progress.state === 'recovery-required') {
        setMessage(`历史归档整理需要人工恢复：${progress.error ?? detail}`);
        await refreshList({ preserveMessage: true });
        return;
      }
      setMessage(`正在整理历史归档：${progress.state === 'queued' ? '等待归档 Worker' : '复制并校验归档副本'}。${detail ? ` ${detail}` : ''}`);
      await new Promise<void>((resolve) => window.setTimeout(resolve, 2_000));
    }
    setMessage(`历史归档整理仍在服务端执行。整理 ID：${reconciliationId}`);
  }, [actor, openPublicReleaseRecord, refreshList, releaseControl]);

  const reconcileHistoricalArchives = useCallback(() => {
    const selectedSubmissionIds = [...historicalArchiveSelectedIds];
    if (!selectedSubmissionIds.length) return;
    setConfirmationReason('');
    setPendingConfirmation({
      title: '整理历史归档',
      message: `确认检查并整理 ${selectedSubmissionIds.length} 个历史归档包？服务端会先复制和校验所有版本与归档清单；只有验证成功才会移除待审核源对象。该操作不会发布正式地图数据。`,
      confirmLabel: '检查并整理',
      tone: 'orange',
      onConfirm: async () => {
        setBusy('archive-reconciliation');
        try {
          const precheck = await releaseControl.runArchiveReconciliationPrecheck({ selectedSubmissionIds }, actor);
          if (precheck.decision !== 'ready' || !precheck.plan) {
            const details = precheck.blockers?.map((blocker) => `${blocker.submissionId}：${blocker.code}`).join('；') ?? '未生成可确认的迁移计划。';
            setMessage(`历史归档整理已阻断：${details}`);
            return;
          }
          setConfirmationReason('');
          setPendingConfirmation({
            title: '确认执行历史归档整理',
            message: `核验通过，确认将 ${precheck.plan.candidateCount} 个历史包交给归档 Worker 吗？`,
            confirmLabel: '确认整理',
            tone: 'orange',
            onConfirm: async () => {
              setBusy('archive-reconciliation');
              try {
                const queued = await releaseControl.confirmArchiveReconciliation(precheck.plan!, actor);
                setMessage('历史归档整理已进入受控执行队列。');
                await waitForArchiveReconciliation(queued.reconciliationId);
              } catch (error) {
                setMessage(describeError(error));
              } finally {
                setBusy(null);
              }
            },
          });
        } catch (error) {
          setMessage(describeError(error));
        } finally {
          setBusy(null);
        }
      },
    });
  }, [actor, historicalArchiveSelectedIds, releaseControl, waitForArchiveReconciliation]);

  useEffect(() => { void refreshList(); }, [refreshList]);
  // A release is server-owned.  Recover a non-terminal release from the
  // authorized feed after refresh/re-entry instead of trusting prior React
  // state or a browser-storage key.
  useEffect(() => {
    let cancelled = false;
    if (actor.principalId === 'anonymous' || recoveredReleaseActorRef.current === actor.principalId || !submissionAdapter.getReleaseFeed) return undefined;
    recoveredReleaseActorRef.current = actor.principalId;
    void Promise.all([
      submissionAdapter.getReleaseFeed(actor, 20),
      releaseControl.getReleaseGate(actor),
    ]).then(([items, gateValue]) => {
      if (cancelled) return;
      const gate = normalizeGate(gateValue);
      setReleaseGate(gate);
      const activeFromGate = gate.releaseId && ['queueing', 'running', 'mirroring'].includes(gate.state)
        ? { releaseId: gate.releaseId, state: gate.state } : null;
      const pending = items.find((item) => item.state === 'mirror-pending');
      const recovered = activeFromGate ?? pending;
      if (recovered) {
        setActiveReleaseId(recovered.releaseId);
        setReleaseProgress({ releaseId: recovered.releaseId, state: recovered.state });
      }
    }).catch((error) => { if (!cancelled) setMessage(describeError(error)); });
    return () => { cancelled = true; };
  }, [actor, releaseControl, submissionAdapter]);
  useEffect(() => subscribeToStatusDraft?.((signal) => updateDraft(signal.submissionId, signal.state, signal.decisionAction, signal.reason)), [subscribeToStatusDraft, updateDraft]);
  useEffect(() => subscribeToSubmissionUpload?.(() => { void refreshList(); }), [refreshList, subscribeToSubmissionUpload]);
  useEffect(() => {
    if (!activeReleaseId || !releaseControl.getReleaseProgress) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const progress = await releaseControl.getReleaseProgress!(activeReleaseId, actor);
        if (cancelled) return;
        setReleaseProgress(progress);
      } catch (error) {
        if (!cancelled) setReleaseProgress((previous) => previous ? { ...previous, error: describeError(error) } : { releaseId: activeReleaseId, state: 'unknown', error: describeError(error) });
      }
    };
    void poll();
    const interval = window.setInterval(() => void poll(), 5000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, [activeReleaseId, actor, releaseControl]);

  return <>
    <DraggablePanel id="review-status-board" defaultPosition={{ x: 28, y: 132 }} zIndex={REVIEW_LAYER.panel} constrainExpandedToViewport>
      <div className="w-[430px] max-h-[74vh] overflow-auto rounded-2xl border border-gray-200 bg-white shadow-xl" data-draggable-proxy-close="true">
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4"><div><h2 className="text-xl font-bold text-gray-900" data-draggable-title>审核序列</h2><p className="mt-1 text-sm text-gray-500">状态灯先本地编辑；仅“保存状态”会提交至审核服务。</p></div><button type="button" data-draggable-close className="sr-only" aria-label="关闭" onClick={onClose} /></div>
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-2 gap-2"><AppButton onClick={() => void refreshGate()} disabled={busy !== null} className="justify-center rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"><ShieldCheck className="h-4 w-4" />刷新 Release Gate</AppButton><AppButton onClick={openPublicReleaseRecord} disabled={busy !== null} className="justify-center rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"><FileText className="h-4 w-4" />打开发布记录</AppButton><AppButton onClick={() => void refreshList()} disabled={busy !== null} className="justify-center rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100"><RefreshCw className="h-4 w-4" />刷新列表</AppButton><div className="rounded-xl bg-gray-50 px-3 py-2 text-center text-sm text-gray-600">Gate：{releaseGate ? (isReviewReleaseGateLeaseExpired(releaseGate) ? '已过期' : stateLabel(releaseGate.state)) : '未读取'} · 发布已选 {selectedEntries.length}{historicalArchiveSelectedIds.size ? ` · 历史整理已选 ${historicalArchiveSelectedIds.size}` : ''}</div></div>
          {message ? <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</div> : null}
          <div className="flex items-center justify-between"><h3 className="font-semibold text-gray-900">待审核包</h3><div className="flex gap-3 text-sm"><button type="button" className="text-blue-600 hover:underline" onClick={() => setSelectedIds(new Set(submissions.filter((item) => !isHistoricalArchiveCandidate(item, draft.find((entry) => entry.submissionId === item.submissionId))).map((item) => item.submissionId)))}>全选可发布包</button><button type="button" className="text-gray-500 hover:underline" onClick={() => { setSelectedIds(new Set()); setHistoricalArchiveSelectedIds(new Set()); }}>清空选择</button></div></div>
          <div className="space-y-2">{submissions.map((submission) => {
            const entry = draft.find((item) => item.submissionId === submission.submissionId);
            const shownState = displayState(submission, entry);
            const historical = isHistoricalArchiveCandidate(submission, entry);
            const checked = historical ? historicalArchiveSelectedIds.has(submission.submissionId) : selectedIds.has(submission.submissionId);
            return <button key={submission.submissionId} type="button" onClick={() => { onClearRevisionCache?.(); setDetailId(submission.submissionId); setRevisionId(submission.currentRevisionId); setPackageReport(null); }} className={`w-full rounded-2xl border p-3 text-left ${historical ? 'border-amber-300 bg-amber-50 hover:border-amber-500' : 'border-blue-200 bg-blue-50 hover:border-blue-400'}`}><div className="flex gap-3"><input aria-label={`${historical ? '选择历史归档整理' : '选择发布'} ${submission.packageName}`} type="checkbox" checked={checked} onClick={(event) => event.stopPropagation()} onChange={() => {
              if (historical) setHistoricalArchiveSelectedIds((previous) => { const next = new Set(previous); if (next.has(submission.submissionId)) next.delete(submission.submissionId); else next.add(submission.submissionId); return next; });
              else setSelectedIds((previous) => { const next = new Set(previous); if (next.has(submission.submissionId)) next.delete(submission.submissionId); else next.add(submission.submissionId); return next; });
            }} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="truncate font-semibold text-gray-900">{submission.packageName}</span><span className={`shrink-0 rounded-full px-2 py-1 text-xs ${historical ? 'bg-amber-100 text-amber-800' : stateTone(shownState)}`}>{historical ? '历史归档待整理' : stateLabel(shownState)}</span></div><div className="mt-1 text-xs text-gray-500">{submission.submissionId}</div><div className="mt-2 text-xs text-gray-600">决策版本：{entry?.decisionRevisionId ?? '未选择'} · 共 {submission.revisions.length} 个版本</div>{historical ? <div className="mt-2 text-xs text-amber-800">该旧包已有“归档”状态灯但缺少归档完成回执，不能参与普通发布；请使用下方“历史归档整理”。</div> : isPublicationLifecycleState(submission.state) ? <div className="mt-2 text-xs text-amber-700">发布生命周期：{stateLabel(submission.state)}。状态灯仍可记录，但不会重新发布、回滚数据或创建新版本。</div> : null}</div></div></button>;
          })}</div>
          {historicalArchiveCandidates.length ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3"><div className="flex items-center justify-between gap-2"><div><div className="font-semibold text-amber-900">历史归档整理</div><p className="mt-1 text-xs text-amber-800">仅维护者可为明确选中的旧包创建迁移计划；不发布正式地图数据。</p></div><span className="text-xs text-amber-800">候选 {historicalArchiveCandidates.length}</span></div><div className="mt-2 flex items-center justify-between"><button type="button" className="text-xs text-amber-900 underline" onClick={() => setHistoricalArchiveSelectedIds(new Set(historicalArchiveCandidates.map((item) => item.submissionId)))}>全选历史包</button><AppButton disabled={!historicalArchiveSelectedIds.size || busy !== null || !actor.roles.includes('maintainer')} onClick={reconcileHistoricalArchives} className="justify-center rounded-xl bg-amber-600 px-3 py-2 text-xs text-white hover:bg-amber-700 disabled:bg-amber-300"><Archive className="h-3.5 w-3.5" />整理已选历史归档</AppButton></div>{!actor.roles.includes('maintainer') ? <p className="mt-2 text-xs text-amber-800">当前身份不是维护者，不能创建归档整理任务。</p> : null}</div> : null}
          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3"><AppButton disabled={!selectedEntries.length || busy !== null} onClick={() => void saveStatus()} className="justify-center rounded-xl bg-orange-600 px-2 py-2 text-xs text-white hover:bg-orange-700 disabled:bg-orange-300"><CheckCircle2 className="h-3.5 w-3.5" />保存状态</AppButton><AppButton disabled={!selectedEntries.length || dirty || busy !== null} onClick={() => void releasePrecheck()} className="justify-center rounded-xl bg-blue-600 px-2 py-2 text-xs text-white hover:bg-blue-700 disabled:bg-blue-300"><ClipboardCheck className="h-3.5 w-3.5" />发布前检查</AppButton><AppButton disabled={!publishReady || busy !== null} onClick={() => void publish()} className="justify-center rounded-xl bg-green-600 px-2 py-2 text-xs text-white hover:bg-green-700 disabled:bg-green-300"><Send className="h-3.5 w-3.5" />发布</AppButton></div>
          {dirty ? <p className="text-xs text-amber-700">状态灯有未保存的本地修改；请先保存状态。</p> : null}
          {reportView(releaseReport, '发布前检查报告')}
        </div>
      </div>
    </DraggablePanel>
    {detail ? (
      <DraggablePanel id="review-package-detail" defaultPosition={{ x: 900, y: 132 }} zIndex={REVIEW_LAYER.packageDetail} constrainExpandedToViewport>
        <div className="w-[390px] max-h-[74vh] overflow-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-xl" data-draggable-proxy-close="true">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900" data-draggable-title>审核包详情</h3>
              <p className="mt-1 text-sm text-gray-500">{detail.submissionId}</p>
            </div>
            <button type="button" data-draggable-close className="sr-only" aria-label="关闭" onClick={() => { onClearRevisionCache?.(); setDetailId(null); setRevisionId(null); setPackageReport(null); }} />
          </div>
          <div className="mt-4 flex gap-2">
            <select className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm" value={revision?.revisionId ?? ''} onChange={(event) => { onClearRevisionCache?.(); setRevisionId(event.target.value); setPackageReport(null); }}>
              {detail.revisions.map((item) => <option key={item.revisionId} value={item.revisionId}>{item.revisionId}</option>)}
            </select>
            <AppButton onClick={() => void refreshList()} disabled={busy !== null} className="rounded-xl bg-gray-100 px-3 text-gray-700 hover:bg-gray-200">
              <RefreshCw className="h-4 w-4" />刷新
            </AppButton>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-xl bg-blue-50 p-2 text-blue-700"><b>{revision?.package.featureCount ?? 0}</b><div>要素</div></div>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-700"><b>{revision?.package.deleteCount ?? 0}</b><div>删除</div></div>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-700"><b>{revision?.package.pictureCount ?? 0}</b><div>图片</div></div>
          </div>
          {isHistoricalArchiveCandidate(detail, detailEntry) ? <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">这是缺少归档完成回执的历史包。状态灯编辑和普通发布均已锁定；请在审核序列选择它并运行“历史归档整理”。</div> : null}
          <div className="mt-3 space-y-2">
            <AppButton onClick={() => void downloadRevision()} disabled={!revision || busy !== null} className="w-full justify-center rounded-xl bg-slate-700 px-3 py-2 font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300">
              <FileDown className="h-4 w-4" />{revisionCached ? '已下载到本地缓存' : '下载到本地缓存'}
            </AppButton>
            <AppButton onClick={() => void loadWorkspace()} disabled={!revision || !revisionCached || busy !== null} className="w-full justify-center rounded-xl bg-orange-600 px-3 py-2 font-semibold text-white hover:bg-orange-700 disabled:bg-orange-300">
              <FileDown className="h-4 w-4" />加载到审核工作区
            </AppButton>
            <AppButton onClick={() => void packagePrecheck()} disabled={!revision || !revisionCached || busy !== null} className="w-full justify-center rounded-xl bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300">
              <ClipboardCheck className="h-4 w-4" />本地预检
            </AppButton>
            {reportView(packageReport, '审核包本地预检报告')}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
            <AppButton onClick={() => updateDraft(detail.submissionId, 'archived', 'archive')} disabled={!canEditDetailLamp || busy !== null} className="justify-center rounded-xl bg-gray-100 px-2 py-2 text-xs text-gray-700 hover:bg-gray-200">
              <Archive className="h-3.5 w-3.5" />归档
            </AppButton>
            <AppButton onClick={() => updateDraft(detail.submissionId, 'rejected', 'request-changes')} disabled={!canEditDetailLamp || busy !== null} className="justify-center rounded-xl bg-red-50 px-2 py-2 text-xs text-red-700 hover:bg-red-100">
              <XCircle className="h-3.5 w-3.5" />要求修改
            </AppButton>
            <AppButton onClick={() => updateDraft(detail.submissionId, 'pending', 'reopen')} disabled={!canEditDetailLamp || busy !== null} className="justify-center rounded-xl bg-amber-50 px-2 py-2 text-xs text-amber-800 hover:bg-amber-100">
              <RotateCcw className="h-3.5 w-3.5" />恢复待审
            </AppButton>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <AppButton onClick={() => updateDraft(detail.submissionId, 'approved', 'approve')} disabled={!canEditDetailLamp || busy !== null} className="justify-center rounded-xl bg-green-600 px-2 py-2 text-xs text-white hover:bg-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" />通过
            </AppButton>
            <AppButton onClick={() => updateDraft(detail.submissionId, 'rejected', 'reject')} disabled={!canEditDetailLamp || busy !== null} className="justify-center rounded-xl bg-rose-600 px-2 py-2 text-xs text-white hover:bg-rose-700">
              <XCircle className="h-3.5 w-3.5" />打回
            </AppButton>
          </div>
        </div>
      </DraggablePanel>
    ) : null}
    {activeReleaseId ? <DraggablePanel id="review-release-progress" defaultPosition={{ x: 660, y: 430 }} zIndex={REVIEW_LAYER.releaseProgress} constrainExpandedToViewport><div className="w-[390px] overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-xl" data-draggable-proxy-close="true"><div className="border-b border-slate-200 px-4 py-3"><h3 className="text-lg font-bold text-slate-900" data-draggable-title>发布进度</h3><button type="button" data-draggable-close className="sr-only" aria-label="关闭" onClick={() => setActiveReleaseId(null)} /></div><div className="space-y-3 p-4"><div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900"><div className="font-semibold">{releaseProgress ? stateLabel(releaseProgress.state) : '正在读取发布状态'}</div><div className="mt-1 break-all text-xs text-blue-800">发布 ID：{activeReleaseId}</div></div><div className="h-2 overflow-hidden rounded bg-slate-100"><div className={`h-full rounded bg-blue-500 ${releaseProgress?.state === 'completed' ? 'w-full' : 'w-3/5 animate-pulse'}`} /></div><div className="grid grid-cols-2 gap-2 text-xs text-slate-600"><div>正式版本：{releaseProgress?.formalVersion ?? '等待发布'}</div><div>归档：{releaseProgress?.archive?.state ?? '等待归档'}</div></div>{releaseProgress?.error ? <div className="whitespace-pre-wrap rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">{releaseProgress.error}</div> : <p className="text-xs leading-5 text-slate-500">进入队列后页面可以继续操作；关闭页面不会取消发布；刷新或重新进入后会从服务端恢复该发布。</p>}</div></div></DraggablePanel> : null}
    {loadProgress ? <div className="fixed inset-0 flex items-center justify-center bg-black/40" style={{ zIndex: REVIEW_LAYER.confirmation }} role="dialog" aria-live="polite"><div className="w-[420px] max-w-[90vw] rounded-2xl border border-gray-200 bg-white shadow-xl"><div className="border-b border-gray-200 px-4 py-3 text-sm font-bold text-gray-900">正在加载审核包</div><div className="px-4 py-4 text-sm text-gray-700">{progressText(loadProgress)}</div><div className="px-4 pb-4"><div className="h-2 overflow-hidden rounded bg-gray-100"><div className="h-full w-3/5 animate-pulse rounded bg-blue-600" /></div></div></div></div> : null}
    {pendingConfirmation && typeof document !== 'undefined' ? createPortal(<div className="fixed inset-0 flex items-center justify-center bg-slate-950/45 p-4" style={{ zIndex: REVIEW_LAYER.confirmation }} role="dialog" aria-modal="true" aria-labelledby="review-confirmation-title"><div className="w-full max-w-[510px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><h3 id="review-confirmation-title" className="text-lg font-bold text-slate-900">{pendingConfirmation.title}</h3><button type="button" className="text-sm text-slate-500 hover:text-slate-800" onClick={() => { setPendingConfirmation(null); setConfirmationReason(''); }}>取消</button></div><div className="space-y-4 px-5 py-5"><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{pendingConfirmation.message}</p>{pendingConfirmation.reasonLabel ? <label className="block text-sm font-medium text-slate-700">{pendingConfirmation.reasonLabel}<textarea autoFocus value={confirmationReason} onChange={(event) => setConfirmationReason(event.target.value)} rows={4} className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="请填写原因；该文字会随发布记录保留。" /></label> : null}</div><div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4"><AppButton onClick={() => { setPendingConfirmation(null); setConfirmationReason(''); }} className="rounded-xl bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100">取消</AppButton><AppButton onClick={() => { const action = pendingConfirmation; const reason = confirmationReason; setPendingConfirmation(null); setConfirmationReason(''); void Promise.resolve(action.onConfirm(reason)); }} className={`rounded-xl px-4 py-2 text-sm text-white ${pendingConfirmation.tone === 'rose' ? 'bg-rose-600 hover:bg-rose-700' : pendingConfirmation.tone === 'green' ? 'bg-green-600 hover:bg-green-700' : pendingConfirmation.tone === 'orange' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}>{pendingConfirmation.confirmLabel}</AppButton></div></div></div>, document.body) : null}
  </>;
}
