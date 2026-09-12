import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Archive, CheckCircle2, ClipboardCheck, FileDown, FileText, RefreshCw, RotateCcw, Send, ShieldCheck, XCircle } from 'lucide-react';
import AppButton from '@/components/ui/AppButton';
import { DraggablePanel } from '@/components/DraggablePanel/DraggablePanel';
import { ReviewConfirmationOverlay, type ReviewConfirmationOverlayState } from './ReviewConfirmationOverlay';
import { ReviewOperationOverlay, type ReviewOperationOverlayState } from './ReviewOperationOverlay';
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

export type ReviewStatusBoardPanelProps = {
  auth: ReviewAuthPort;
  submissionAdapter: ReviewSubmissionAdapter & ReviewStatusBoardAdapter;
  releaseControl: ReviewReleaseControlPort;
  onLoadRevision(
    input: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision },
    reportProgress?: (progress: ReviewWorkspaceLoadProgress) => void,
  ): Promise<void> | void;
  onClose: () => void;
  subscribeToStatusDraft?: (listener: (signal: ReviewStatusDraftSignal) => void) => () => void;
  subscribeToSubmissionUpload?: (listener: (submissionId?: string) => void) => () => void;
};

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

function stateLabel(state: string) {
  return ({ pending: '待审核', approved: '已通过', rejected: '已打回', archived: '已归档', queued: '已排队', running: '发布中', 'mirror-pending': '镜像等待中', mirrored: '已镜像', 'archive-pending': '等待归档', archiving: '归档中', completed: '发布完成', 'rebase-required': '需要重新检查', 'mirror-recovery-required': '镜像需恢复', 'archive-recovery-required': '归档需恢复', failed: '失败' } as Record<string, string>)[state] ?? state;
}

function stateTone(state: string) {
  return ({ pending: 'bg-amber-100 text-amber-800', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', archived: 'bg-gray-200 text-gray-700', completed: 'bg-green-100 text-green-700', failed: 'bg-red-100 text-red-700', 'mirror-recovery-required': 'bg-red-100 text-red-700', 'archive-recovery-required': 'bg-red-100 text-red-700' } as Record<string, string>)[state] ?? 'bg-blue-100 text-blue-700';
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
export function ReviewStatusBoardPanel({ auth, submissionAdapter, releaseControl, onLoadRevision, onClose, subscribeToStatusDraft, subscribeToSubmissionUpload }: ReviewStatusBoardPanelProps) {
  const [actor, setActor] = useState<ReviewAuthorizationContext>({ principalId: 'anonymous', roles: [] });
  const [submissions, setSubmissions] = useState<ReviewSubmissionSnapshot[]>([]);
  const [board, setBoard] = useState<ReviewStatusBoardSnapshot | null>(null);
  const [draft, setDraft] = useState<ReviewStatusBoardEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [revisionId, setRevisionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [packageReport, setPackageReport] = useState<ReviewPackagePrecheckReport | null>(null);
  const [releaseReport, setReleaseReport] = useState<ReviewReleaseControlReport | null>(null);
  const [releaseGate, setReleaseGate] = useState<ReviewReleaseGateSnapshot | null>(null);
  const [releaseFeed, setReleaseFeed] = useState<Awaited<ReturnType<NonNullable<ReviewSubmissionAdapter['getReleaseFeed']>>> | null>(null);
  const [operation, setOperation] = useState<ReviewOperationOverlayState | null>(null);
  const [confirmation, setConfirmation] = useState<ReviewConfirmationOverlayState | null>(null);
  const confirmationResolver = useRef<((confirmed: boolean) => void) | null>(null);

  const requestConfirmation = useCallback((next: ReviewConfirmationOverlayState) => new Promise<boolean>((resolve) => {
    confirmationResolver.current?.(false);
    confirmationResolver.current = resolve;
    setConfirmation(next);
  }), []);
  const settleConfirmation = useCallback((confirmed: boolean) => {
    const resolve = confirmationResolver.current;
    confirmationResolver.current = null;
    setConfirmation(null);
    resolve?.(confirmed);
  }, []);
  useEffect(() => () => { confirmationResolver.current?.(false); confirmationResolver.current = null; }, []);

  const detail = submissions.find((submission) => submission.submissionId === detailId) ?? null;
  const revision = detail?.revisions.find((candidate) => candidate.revisionId === revisionId)
    ?? detail?.revisions.find((candidate) => candidate.revisionId === detail.currentRevisionId)
    ?? null;
  const canEditDetailLamp = Boolean(detail && revision);
  const selectedEntries = useMemo(() => draft.filter((entry) => selectedIds.has(entry.submissionId)), [draft, selectedIds]);
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
      setSelectedIds((previous) => new Set([...previous].filter((id) => items.some((item) => item.submissionId === id))));
      setDetailId((previous) => previous && items.some((item) => item.submissionId === previous) ? previous : null);
    } catch (error) {
      setMessage(describeError(error));
    } finally {
      setBusy(null);
    }
  }, [auth, submissionAdapter]);

  const updateDraft = useCallback(async (submissionId: string, state: ReviewStatusBoardEntry['state'], decisionAction?: ReviewStatusDecisionAction, reason?: string) => {
    const current = draft.find((entry) => entry.submissionId === submissionId);
    const selected = submissions.find((item) => item.submissionId === submissionId);
    if (!current || !selected) return;
    if (!decisionAction) {
      setMessage('审核状态灯操作缺少决定类型。');
      return;
    }
    const actionLabel = ({ approve: '通过', reject: '打回', 'request-changes': '要求修改', archive: '归档', reopen: '恢复待审' } as Record<string, string>)[decisionAction ?? ''] ?? stateLabel(state);
    if (!await requestConfirmation({ title: '确认修改审核状态', message: `确认将此审核包的状态灯设为“${actionLabel}”？`, detail: '此操作仅修改本地草稿；不会创建新版本、重新发布或回滚数据。点击“保存状态”后才会提交。', confirmLabel: '确认修改' })) return;
    const selectedRevision = selected.revisions.find((item) => item.revisionId === revisionId) ?? selected.revisions.find((item) => item.revisionId === selected.currentRevisionId);
    setDraft((entries) => entries.map((entry) => entry.submissionId !== submissionId ? entry : {
      ...entry,
      state,
      decisionRevisionId: selectedRevision?.revisionId ?? entry.decisionRevisionId,
      ...(decisionAction ? { decisionAction } : {}),
      ...(reason ? { reason } : {}),
      updatedAt: new Date().toISOString(),
      updatedBy: actor,
    }));
    setSelectedIds((previous) => new Set(previous).add(submissionId));
  }, [actor, draft, requestConfirmation, revisionId, submissions]);

  const saveStatus = useCallback(async () => {
    if (!board || !selectedEntries.length) return;
    setBusy('save-status');
    setOperation({ title: '正在保存审核状态', message: '正在读取云端状态灯并校验版本。', phase: 'running' });
    try {
      const remote = await submissionAdapter.getStatusBoard(actor);
      const differences = compareReviewStatusBoards(draft, remote.entries).filter((difference) => difference.kind !== 'unchanged');
      const revisionChanges = differences.filter((difference) => difference.kind === 'revision-changed');
      if (revisionChanges.length) {
        setMessage(`保存状态已阻断：${revisionChanges.map((difference) => difference.submissionId).join('、')} 的云端决策版本已变化。请刷新并检查对应审核包。`);
        setOperation({ title: '审核状态保存已阻断', message: '云端的决策版本已经变化，未写入任何状态灯。', phase: 'error' });
        return;
      }
      const expectedBoardVersion = remote.boardVersion;
      if (differences.length && !await requestConfirmation({ title: '确认覆盖云端状态灯', message: '检测到云端状态灯变化。是否以当前已选择的本地状态覆盖？', detail: differences.map((difference) => `${difference.submissionId}（${difference.kind}）`).join('；'), confirmLabel: '确认覆盖' })) {
        setMessage('保存状态已取消；本地状态灯保持不变。');
        setOperation({ title: '审核状态保存已取消', message: '未向云端写入状态灯。', phase: 'success' });
        return;
      }
      if (!await requestConfirmation({ title: '确认保存审核状态', message: `确认保存 ${selectedEntries.length} 个审核包的状态灯？`, detail: '服务端会按当前审核包和决策版本执行一致性校验。', confirmLabel: '保存状态' })) {
        setOperation({ title: '审核状态保存已取消', message: '未向云端写入状态灯。', phase: 'success' });
        return;
      }
      await submissionAdapter.saveStatusBoard({
        requestId: createId('status-save'), correlationId: createId('status-correlation'), idempotencyKey: createId('status-idempotency'),
        expectedBoardVersion, entries: selectedEntries, actor, occurredAt: new Date().toISOString(),
      });
      setReleaseReport(null);
      await refreshList({ preserveMessage: true });
      setMessage('审核状态已保存。');
      setOperation({ title: '审核状态已保存', message: `已安全保存 ${selectedEntries.length} 个审核包的状态灯。`, phase: 'success' });
    } catch (error) {
      setMessage(describeError(error));
      setOperation({ title: '审核状态保存失败', message: '云端没有接受本次状态灯保存。', detail: describeError(error), phase: 'error' });
    } finally {
      setBusy(null);
    }
  }, [actor, board, draft, refreshList, requestConfirmation, selectedEntries, submissionAdapter]);

  const loadWorkspace = useCallback(async () => {
    if (!detail || !revision) return;
    setBusy('load');
    setOperation({ title: '正在加载审核包', message: '正在申请受限下载并准备审核工作区。', phase: 'running' });
    try {
      await onLoadRevision({ submission: detail, revision }, (progress) => {
        setOperation({ title: '正在加载审核包', message: progress.message, phase: 'running', completedBytes: progress.completedBytes, totalBytes: progress.totalBytes });
      });
      setMessage('审核包已下载并加载到审核工作区。');
      setOperation({ title: '审核包已加载', message: '审核图层已注入独立的审核工作区。', phase: 'success' });
    } catch (error) {
      setMessage(describeError(error));
      setOperation({ title: '审核包加载失败', message: '审核包未能加载到工作区。', detail: describeError(error), phase: 'error' });
    } finally {
      setBusy(null);
    }
  }, [detail, onLoadRevision, revision]);

  const packagePrecheck = useCallback(async () => {
    if (!detail || !revision || !submissionAdapter.precheckSubmission) return;
    if (!detail.allowedActions.includes('precheck')) {
      setMessage('当前审核包状态不允许预检；请改选待审核包，或先执行“恢复待审”。');
      return;
    }
    setBusy('package-precheck');
    setPackageReport(null);
    setOperation({ title: '正在审核包预检', message: '正在校验当前版本与正式数据快照。', phase: 'running' });
    try {
      const result = await submissionAdapter.precheckSubmission({
        requestId: createId('precheck'), correlationId: createId('precheck-correlation'), idempotencyKey: createId('precheck-idempotency'),
        submissionId: detail.submissionId, targetRevisionId: revision.revisionId, expectedStateVersion: detail.stateVersion,
        action: 'precheck', occurredAt: new Date().toISOString(), actor,
      });
      setPackageReport(result);
      setOperation({ title: '审核包预检完成', message: `预检结论：${reviewDecisionLabel(result.decision)}。`, phase: result.decision === 'blocked' ? 'error' : 'success', detail: result.findings.map((finding) => reviewFindingLabel(finding.code, finding.message)).join('\n') || '未发现需要展示的阻断或警告项。' });
    } catch (error) {
      setMessage(describeError(error));
      setOperation({ title: '审核包预检失败', message: '预检请求未完成。', detail: describeError(error), phase: 'error' });
    } finally {
      setBusy(null);
    }
  }, [actor, detail, revision, submissionAdapter]);

  const refreshGate = useCallback(async () => {
    if (!await requestConfirmation({ title: '刷新 Release Gate', message: '确认读取当前发布锁与执行状态？', confirmLabel: '刷新' })) return;
    setBusy('gate');
    try {
      setReleaseGate(normalizeGate(await releaseControl.getReleaseGate(actor)));
    } catch (error) {
      setMessage(describeError(error));
    } finally {
      setBusy(null);
    }
  }, [actor, releaseControl, requestConfirmation]);

  const refreshFeed = useCallback(async () => {
    setBusy('feed');
    try {
      setReleaseFeed(await submissionAdapter.getReleaseFeed?.(actor, 10) ?? []);
    } catch (error) {
      setMessage(describeError(error));
    } finally {
      setBusy(null);
    }
  }, [actor, submissionAdapter]);

  const downloadRelease = useCallback(async (releaseId: string) => {
    if (!submissionAdapter.requestReleaseDownload) return;
    setBusy('release-download');
    setOperation({ title: '正在准备发布归档', message: '正在申请该发布审核包的短期下载链接。', phase: 'running' });
    try {
      const grant = await submissionAdapter.requestReleaseDownload(releaseId, actor);
      const link = document.createElement('a');
      link.href = grant.download.url;
      link.download = `ReviewRelease_${releaseId}.zip`;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setOperation({ title: '发布归档下载已开始', message: '浏览器正在下载该发布包含的所有审核包。', detail: `发布 ID：${releaseId}\n大小：${grant.download.byteLength.toLocaleString()} 字节`, phase: 'success' });
    } catch (error) {
      setOperation({ title: '发布归档下载失败', message: '无法获取该发布的下载链接。', detail: describeError(error), phase: 'error' });
    } finally {
      setBusy(null);
    }
  }, [actor, submissionAdapter]);

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
    setOperation({ title: '正在发布前检查', message: '正在核对保存的状态灯、Release Gate 与正式数据版本。', phase: 'running' });
    try {
      const gate = normalizeGate(await releaseControl.getReleaseGate(actor));
      setReleaseGate(gate);
      if (isReviewReleaseGateLeaseActive(gate)) {
        setMessage('当前已有发布进行中，请稍后刷新 Release Gate。');
        setOperation({ title: '发布前检查已阻断', message: '当前已有发布正在执行，未发起新的检查。', phase: 'error' });
        return;
      }
      if (isReviewReleaseGateLeaseExpired(gate)) setMessage(null);
      const remote = await submissionAdapter.getStatusBoard(actor);
      const differences = compareReviewStatusBoards(draft, remote.entries).filter((difference) => difference.kind !== 'unchanged');
      if (remote.boardVersion !== board.boardVersion || differences.length) {
        const revisionChanges = differences.filter((difference) => difference.kind === 'revision-changed');
        if (revisionChanges.length) {
          setMessage(`发布前检查已阻断：${revisionChanges.map((difference) => difference.submissionId).join('、')} 的云端决策版本已变化。请刷新对应审核包并重新保存状态。`);
          setOperation({ title: '发布前检查已阻断', message: '云端的决策版本已经变化。', phase: 'error' });
        } else {
          setMessage(`发布前检查已阻断：云端状态灯已更新（${differences.map((difference) => `${difference.submissionId}:${difference.kind}`).join('；') || '版本号变化'}）。请确认后先保存状态，再重新检查。`);
          setOperation({ title: '发布前检查已阻断', message: '云端状态灯已更新，请先刷新并保存。', phase: 'error' });
        }
        return;
      }
      const result = await releaseControl.runReleasePrecheck({
        selectedSubmissionIds: selectedEntries.map((entry) => entry.submissionId), expectedBoardVersion: board.boardVersion,
        request: { requestId: createId('release-precheck'), correlationId: createId('release-correlation'), idempotencyKey: createId('release-idempotency'), submissionId: owner.submissionId, targetRevisionId: approved.decisionRevisionId!, expectedStateVersion: owner.stateVersion, action: 'publish', occurredAt: new Date().toISOString(), actor },
      }, actor);
      setReleaseReport(result);
      setReleaseGate(normalizeGate(result.gate));
      setOperation({ title: '发布前检查完成', message: `检查结论：${reviewDecisionLabel(result.decision)}。`, phase: result.decision === 'blocked' || result.decision === 'stale' ? 'error' : 'success', detail: result.report?.findings?.map((finding) => finding.message ?? '未提供详情。').join('\n') || '可以继续确认发布。' });
    } catch (error) {
      setMessage(describeError(error));
      setOperation({ title: '发布前检查失败', message: '发布前检查请求未完成。', detail: describeError(error), phase: 'error' });
    } finally {
      setBusy(null);
    }
  }, [actor, board, dirty, draft, releaseControl, selectedEntries, submissionAdapter, submissions]);

  const waitForReleaseCompletion = useCallback(async (releaseId: string) => {
    if (!submissionAdapter.getReleaseProgress) {
      setOperation({ title: '发布已排队', message: '发布已进入服务端队列；请稍后刷新发布记录。', phase: 'success', detail: `发布 ID：${releaseId}` });
      return;
    }
    for (let attempt = 0; attempt < 360; attempt += 1) {
      const progress = await submissionAdapter.getReleaseProgress(releaseId, actor);
      const lifecycle = progress.lifecycle;
      const detail = [
        progress.formalVersion ? `正式版本：${progress.formalVersion}` : null,
        lifecycle?.dataPublishedAt ? '正式数据已发布' : null,
        lifecycle?.mirroredAt ? 'GitHub Data 已镜像' : null,
        progress.archive?.state ? `归档：${progress.archive.state}` : null,
      ].filter(Boolean).join(' · ');
      if (progress.state === 'completed') {
        setOperation({ title: '发布完成', message: '正式数据、GitHub 镜像与审核包归档均已完成。', detail: `${detail}\n发布 ID：${releaseId}`, phase: 'success' });
        await refreshList({ preserveMessage: true });
        return;
      }
      if (['failed', 'rebase-required', 'mirror-recovery-required', 'archive-recovery-required'].includes(progress.state)) {
        setOperation({ title: '发布需要处理', message: `发布停在“${stateLabel(progress.state)}”。`, detail: progress.error ?? progress.archive?.error ?? detail, phase: 'error' });
        await refreshList({ preserveMessage: true });
        return;
      }
      setOperation({ title: '正在发布', message: `服务端正在执行：${stateLabel(progress.state)}。关闭页面不会取消发布。`, detail, phase: 'running' });
      await new Promise<void>((resolve) => window.setTimeout(resolve, 2_000));
    }
    setOperation({ title: '发布仍在执行', message: '浏览器停止等待，但服务端发布不会中断。请稍后刷新发布记录。', detail: `发布 ID：${releaseId}`, phase: 'success' });
  }, [actor, refreshList, submissionAdapter]);

  const publish = useCallback(async () => {
    if (!releaseReport?.gate?.attemptId || !releaseReport.report?.reportSha256 || !publishReady) return;
    const approved = selectedEntries.find((entry) => entry.state === 'approved' && entry.decisionRevisionId);
    const owner = approved && submissions.find((item) => item.submissionId === approved.submissionId);
    if (!approved || !owner) return;
    if (!await requestConfirmation({ title: '确认发布', message: '确认将当前通过的审核包提交发布？', detail: '服务端会再次校验 Release Gate、当前正式数据和已保存状态。关闭此页面不会取消已经受理的发布。', confirmLabel: '确认发布' })) return;
    setBusy('publish');
    setOperation({ title: '正在提交发布', message: '正在创建不可变发布任务；之后将由服务端持续执行。', phase: 'running' });
    try {
      const result = await releaseControl.confirmRelease({
        attemptId: releaseReport.gate.attemptId, expectedGateVersion: releaseReport.gate.gateVersion,
        precheckReportSha256: releaseReport.report.reportSha256,
        request: { requestId: createId('publish'), correlationId: createId('publish-correlation'), idempotencyKey: createId('publish-idempotency'), submissionId: owner.submissionId, targetRevisionId: approved.decisionRevisionId!, expectedStateVersion: owner.stateVersion, action: 'publish', occurredAt: new Date().toISOString(), actor },
      }, actor);
      setReleaseReport(result);
      setReleaseGate(normalizeGate(result.gate));
      setMessage('发布已进入受控执行队列。');
      await refreshList({ preserveMessage: true });
      const releaseId = result.release?.releaseId;
      if (releaseId) await waitForReleaseCompletion(releaseId);
      else setOperation({ title: '发布已排队', message: '发布已进入服务端队列；请稍后刷新发布记录。', phase: 'success' });
    } catch (error) {
      setMessage(describeError(error));
      setOperation({ title: '发布提交失败', message: '服务端没有接受本次发布。', detail: describeError(error), phase: 'error' });
    } finally {
      setBusy(null);
    }
  }, [actor, publishReady, refreshList, releaseControl, releaseReport, requestConfirmation, selectedEntries, submissions, waitForReleaseCompletion]);

  useEffect(() => { void refreshList(); }, [refreshList]);
  useEffect(() => subscribeToStatusDraft?.((signal) => { void updateDraft(signal.submissionId, signal.state, signal.decisionAction, signal.reason); }), [subscribeToStatusDraft, updateDraft]);
  useEffect(() => subscribeToSubmissionUpload?.(() => { void refreshList(); }), [refreshList, subscribeToSubmissionUpload]);

  return <>
    <DraggablePanel id="review-status-board" defaultPosition={{ x: 28, y: 132 }} zIndex={1760} constrainExpandedToViewport>
      <div className="w-[430px] max-h-[74vh] overflow-auto rounded-2xl border border-gray-200 bg-white shadow-xl" data-draggable-proxy-close="true">
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4"><div><h2 className="text-xl font-bold text-gray-900" data-draggable-title>审核序列</h2><p className="mt-1 text-sm text-gray-500">状态灯先本地编辑；仅“保存状态”会提交至审核服务。</p></div><button type="button" data-draggable-close className="sr-only" aria-label="关闭" onClick={onClose} /></div>
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-2 gap-2"><AppButton onClick={() => void refreshGate()} disabled={busy !== null} className="justify-center rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"><ShieldCheck className="h-4 w-4" />刷新 Release Gate</AppButton><AppButton onClick={() => void refreshFeed()} disabled={busy !== null} className="justify-center rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"><FileText className="h-4 w-4" />刷新发布记录</AppButton><AppButton onClick={() => void refreshList()} disabled={busy !== null} className="justify-center rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100"><RefreshCw className="h-4 w-4" />刷新列表</AppButton><div className="rounded-xl bg-gray-50 px-3 py-2 text-center text-sm text-gray-600">Gate：{releaseGate ? (isReviewReleaseGateLeaseExpired(releaseGate) ? '已过期' : stateLabel(releaseGate.state)) : '未读取'} · 已选 {selectedIds.size}</div></div>
          {message ? <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</div> : null}
          <div className="flex items-center justify-between"><h3 className="font-semibold text-gray-900">待审核包</h3><div className="flex gap-3 text-sm"><button type="button" className="text-blue-600 hover:underline" onClick={() => setSelectedIds(new Set(submissions.map((item) => item.submissionId)))}>全选</button><button type="button" className="text-gray-500 hover:underline" onClick={() => setSelectedIds(new Set())}>清空选择</button></div></div>
          <div className="space-y-2">{submissions.map((submission) => { const entry = draft.find((item) => item.submissionId === submission.submissionId); const shownState = displayState(submission, entry); return <button key={submission.submissionId} type="button" onClick={() => { setDetailId(submission.submissionId); setRevisionId(submission.currentRevisionId); setPackageReport(null); }} className="w-full rounded-2xl border border-blue-200 bg-blue-50 p-3 text-left hover:border-blue-400"><div className="flex gap-3"><input aria-label={`选择 ${submission.packageName}`} type="checkbox" checked={selectedIds.has(submission.submissionId)} onClick={(event) => event.stopPropagation()} onChange={() => setSelectedIds((previous) => { const next = new Set(previous); if (next.has(submission.submissionId)) next.delete(submission.submissionId); else next.add(submission.submissionId); return next; })} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="truncate font-semibold text-gray-900">{submission.packageName}</span><span className={`shrink-0 rounded-full px-2 py-1 text-xs ${stateTone(shownState)}`}>{stateLabel(shownState)}</span></div><div className="mt-1 text-xs text-gray-500">{submission.submissionId}</div><div className="mt-2 text-xs text-gray-600">决策版本：{entry?.decisionRevisionId ?? '未选择'} · 共 {submission.revisions.length} 个版本</div>{isPublicationLifecycleState(submission.state) ? <div className="mt-2 text-xs text-amber-700">发布生命周期：{stateLabel(submission.state)}。状态灯仍可记录，但不会重新发布、回滚数据或创建新版本。</div> : null}</div></div></button>; })}</div>
          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3"><AppButton disabled={!selectedEntries.length || busy !== null} onClick={() => void saveStatus()} className="justify-center rounded-xl bg-orange-600 px-2 py-2 text-xs text-white hover:bg-orange-700 disabled:bg-orange-300"><CheckCircle2 className="h-3.5 w-3.5" />保存状态</AppButton><AppButton disabled={!selectedEntries.length || dirty || busy !== null} onClick={() => void releasePrecheck()} className="justify-center rounded-xl bg-blue-600 px-2 py-2 text-xs text-white hover:bg-blue-700 disabled:bg-blue-300"><ClipboardCheck className="h-3.5 w-3.5" />发布前检查</AppButton><AppButton disabled={!publishReady || busy !== null} onClick={() => void publish()} className="justify-center rounded-xl bg-green-600 px-2 py-2 text-xs text-white hover:bg-green-700 disabled:bg-green-300"><Send className="h-3.5 w-3.5" />发布</AppButton></div>
          {dirty ? <p className="text-xs text-amber-700">状态灯有未保存的本地修改；请先保存状态。</p> : null}
          {reportView(releaseReport, '发布前检查报告')}
        </div>
      </div>
    </DraggablePanel>
    {detail ? (
      <DraggablePanel id="review-package-detail" defaultPosition={{ x: 900, y: 132 }} zIndex={1761} constrainExpandedToViewport>
        <div className="w-[390px] max-h-[74vh] overflow-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-xl" data-draggable-proxy-close="true">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900" data-draggable-title>审核包详情</h3>
              <p className="mt-1 text-sm text-gray-500">{detail.submissionId}</p>
            </div>
            <button type="button" data-draggable-close className="sr-only" aria-label="关闭" onClick={() => setDetailId(null)} />
          </div>
          <div className="mt-4 flex gap-2">
            <select className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm" value={revision?.revisionId ?? ''} onChange={(event) => { setRevisionId(event.target.value); setPackageReport(null); }}>
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
          <div className="mt-3 space-y-2">
            <AppButton onClick={() => void loadWorkspace()} disabled={!revision || busy !== null} className="w-full justify-center rounded-xl bg-orange-600 px-3 py-2 font-semibold text-white hover:bg-orange-700 disabled:bg-orange-300">
              <FileDown className="h-4 w-4" />加载到审核工作区
            </AppButton>
            <AppButton onClick={() => void packagePrecheck()} disabled={!revision || !detail.allowedActions.includes('precheck') || busy !== null} className="w-full justify-center rounded-xl bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300">
              <ClipboardCheck className="h-4 w-4" />预检
            </AppButton>
            {reportView(packageReport, '审核包预检报告')}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
            <AppButton onClick={() => void updateDraft(detail.submissionId, 'archived', 'archive')} disabled={!canEditDetailLamp || busy !== null} className="justify-center rounded-xl bg-gray-100 px-2 py-2 text-xs text-gray-700 hover:bg-gray-200">
              <Archive className="h-3.5 w-3.5" />归档
            </AppButton>
            <AppButton onClick={() => { const reason = window.prompt('请填写要求修改的原因：'); if (reason?.trim()) void updateDraft(detail.submissionId, 'rejected', 'request-changes', reason.trim()); }} disabled={!canEditDetailLamp || busy !== null} className="justify-center rounded-xl bg-red-50 px-2 py-2 text-xs text-red-700 hover:bg-red-100">
              <XCircle className="h-3.5 w-3.5" />要求修改
            </AppButton>
            <AppButton onClick={() => void updateDraft(detail.submissionId, 'pending', 'reopen')} disabled={!canEditDetailLamp || busy !== null} className="justify-center rounded-xl bg-amber-50 px-2 py-2 text-xs text-amber-800 hover:bg-amber-100">
              <RotateCcw className="h-3.5 w-3.5" />恢复待审
            </AppButton>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <AppButton onClick={() => void updateDraft(detail.submissionId, 'approved', 'approve')} disabled={!canEditDetailLamp || busy !== null} className="justify-center rounded-xl bg-green-600 px-2 py-2 text-xs text-white hover:bg-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" />通过
            </AppButton>
            <AppButton onClick={() => { const reason = window.prompt('请填写打回原因：'); if (reason?.trim()) void updateDraft(detail.submissionId, 'rejected', 'reject', reason.trim()); }} disabled={!canEditDetailLamp || busy !== null} className="justify-center rounded-xl bg-rose-600 px-2 py-2 text-xs text-white hover:bg-rose-700">
              <XCircle className="h-3.5 w-3.5" />打回
            </AppButton>
          </div>
        </div>
      </DraggablePanel>
    ) : null}
    {releaseFeed ? <DraggablePanel id="review-release-feed" defaultPosition={{ x: 870, y: 180 }} zIndex={1762} constrainExpandedToViewport>
      <div className="w-[440px] max-h-[72vh] overflow-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-xl" data-draggable-proxy-close="true">
        <h3 className="text-base font-bold text-gray-900" data-draggable-title>发布记录</h3>
        <button type="button" data-draggable-close className="sr-only" aria-label="关闭" onClick={() => setReleaseFeed(null)} />
        {releaseFeed.length ? <div className="mt-3 space-y-3">{releaseFeed.map((item) => {
          const packages = item.packages ?? [];
          const lifecycle = item.lifecycle;
          const occurredAt = lifecycle?.completedAt ?? lifecycle?.archivedAt ?? lifecycle?.mirroredAt ?? item.publishedAt ?? item.occurredAt ?? '时间未记录';
          const canDownload = item.state === 'completed' && Boolean(item.download);
          return <div key={item.releaseId} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <div className="flex items-start justify-between gap-2"><div className="font-semibold text-slate-900">{item.releaseId}</div><span className={`rounded-full px-2 py-1 ${stateTone(item.state)}`}>{stateLabel(item.state)}</span></div>
            <div className="mt-2 text-slate-600">发布生命周期：{stateLabel(item.state)} · {occurredAt}</div>
            {item.formalVersion ? <div className="mt-1 text-slate-600">正式版本：{item.formalVersion}</div> : null}
            {packages.length ? <div className="mt-3 space-y-2">{packages.map((pkg) => <div key={`${pkg.submissionId}-${pkg.decisionRevisionId}`} className="rounded-lg border border-slate-200 bg-white p-2"><div className="truncate font-medium text-slate-800">{pkg.packageName}</div><div className="mt-1 text-slate-500">版本：{pkg.decisionRevisionId} · {pkg.decisionState === 'approved' ? '已发布' : '仅归档'} · 共 {pkg.revisionCount} 个版本</div><div className="mt-1 grid grid-cols-3 gap-1 text-center"><span className="rounded bg-blue-50 py-1 text-blue-700">{pkg.counts.featureCount} 要素</span><span className="rounded bg-amber-50 py-1 text-amber-700">{pkg.counts.deleteCount} 删除</span><span className="rounded bg-purple-50 py-1 text-purple-700">{pkg.counts.pictureCount} 图片</span></div></div>)}</div> : null}
            {canDownload ? <AppButton disabled={busy !== null} onClick={() => void downloadRelease(item.releaseId)} className="mt-3 w-full justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs text-white hover:bg-blue-700 disabled:bg-blue-300"><FileDown className="h-3.5 w-3.5" />下载本次发布的全部审核包</AppButton> : null}
          </div>;
        })}</div> : <p className="mt-3 text-sm text-gray-500">暂无发布记录。</p>}
      </div>
    </DraggablePanel> : null}
    <ReviewOperationOverlay operation={operation} onClose={() => setOperation(null)} />
    <ReviewConfirmationOverlay confirmation={confirmation} onConfirm={() => settleConfirmation(true)} onCancel={() => settleConfirmation(false)} />
  </>;
}
