import { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, CheckCircle2, ClipboardCheck, FileDown, FileText, RefreshCw, RotateCcw, Send, ShieldCheck, XCircle } from 'lucide-react';
import AppButton from '@/components/ui/AppButton';
import { DraggablePanel } from '@/components/DraggablePanel/DraggablePanel';
import { parseRelayPackageZip } from '@/components/Mapping/core/relayPackageParser';
import { createReviewItemFromParsedRelayPackage } from './reviewInboxReader';
import ReviewLayerManagerPanel from './ReviewLayerManagerPanel';
import { openriamapGithubReviewAuth } from './openriamapReviewAuth';
import { createRiaReviewSubmissionAdapter, requestRiaReviewRevisionDownload } from './riaReviewSubmissionAdapter';
import type { ReviewAuthorizationContext, ReviewSubmissionSnapshot } from './contracts';
import { compareReviewStatusBoards, createReviewStatusBoardDraft, type ReviewStatusBoardEntry, type ReviewStatusBoardSnapshot, type ReviewStatusDecisionAction } from './statusBoard';
import type { ReviewInboxItem } from './reviewStatusTypes';
import type { ReviewPackageSession } from './reviewPackageSession';

type ReviewModuleProps = {
  activeWorldId: string;
  session: ReviewPackageSession | null;
  dirty: boolean;
  onClose: () => void;
  onLoadPackage: (item: ReviewInboxItem) => void;
};

type RemoteReport = { decision?: string; gate?: { attemptId?: string; gateVersion?: number; state?: string }; report?: { reportSha256?: string; findings?: Array<{ severity?: string; message?: string }> }; next?: { action?: string } };

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function stateLabel(state: string) {
  return ({ pending: '待审核', approved: '已通过', rejected: '已打回', archived: '已归档', queued: '已排队', running: '执行中', 'mirror-pending': '等待镜像', mirrored: '已镜像', failed: '失败' } as Record<string, string>)[state] ?? state;
}

function stateTone(state: string) {
  return ({ approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', archived: 'bg-gray-200 text-gray-700', pending: 'bg-amber-100 text-amber-800' } as Record<string, string>)[state] ?? 'bg-blue-100 text-blue-700';
}

function asBoardEntry(submission: ReviewSubmissionSnapshot, previous?: ReviewStatusBoardEntry): ReviewStatusBoardEntry {
  const state = ['pending', 'approved', 'rejected', 'archived'].includes(submission.state) ? submission.state as ReviewStatusBoardEntry['state'] : 'pending';
  return previous ?? {
    submissionId: submission.submissionId,
    state,
    decisionRevisionId: state === 'pending' ? submission.currentRevisionId : submission.displayRevisionId,
    ...(state === 'approved' ? { decisionAction: 'approve' as const } : state === 'rejected' ? { decisionAction: submission.lastEvent?.action === 'request-changes' ? 'request-changes' as const : 'reject' as const } : state === 'archived' ? { decisionAction: 'archive' as const } : {}),
    updatedAt: submission.lastEvent?.occurredAt ?? new Date().toISOString(),
    updatedBy: { principalId: submission.lastEvent?.actor?.principalId ?? 'system', roles: submission.lastEvent?.actor?.roles ?? [] },
    ...(submission.lastEvent?.reason ? { reason: submission.lastEvent.reason } : {}),
  };
}

function renderReport(report: RemoteReport | null) {
  if (!report) return null;
  const findings = report.report?.findings ?? [];
  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
      <div className="font-semibold">预检报告：{report.decision ?? '未知'}</div>
      {findings.length ? <div className="mt-2 space-y-1">{findings.map((finding, index) => <div key={`${finding.message}-${index}`} className={finding.severity === 'blocker' ? 'text-red-700' : finding.severity === 'warning' ? 'text-amber-700' : 'text-gray-600'}>• {finding.message ?? '未提供说明'}</div>)}</div> : <div className="mt-1 text-gray-500">未返回逐项问题。</div>}
    </div>
  );
}

/**
 * Downstream Review workbench. It renders only provider-neutral lifecycle
 * concepts; the broker resolves the authenticated GitHub identity and all
 * Cloud authority. Package status lamps remain draft-only until Save Status.
 */
export default function ReviewModule({ activeWorldId, session, dirty, onClose, onLoadPackage }: ReviewModuleProps) {
  const adapter = useMemo(() => createRiaReviewSubmissionAdapter(), []);
  const [actor, setActor] = useState<ReviewAuthorizationContext>({ principalId: 'anonymous', roles: [] });
  const [submissions, setSubmissions] = useState<ReviewSubmissionSnapshot[]>([]);
  const [board, setBoard] = useState<ReviewStatusBoardSnapshot | null>(null);
  const [draftEntries, setDraftEntries] = useState<ReviewStatusBoardEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailRevisionId, setDetailRevisionId] = useState<string | null>(null);
  const [releaseGate, setReleaseGate] = useState<{ state?: string; attemptId?: string; gateVersion?: number } | null>(null);
  const [releaseFeed, setReleaseFeed] = useState<Array<{ releaseId: string; occurredAt: string; state: string; datasets?: string[]; approvedBy?: string[] }> | null>(null);
  const [report, setReport] = useState<RemoteReport | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const selectedSubmission = submissions.find((item) => item.submissionId === detailId) ?? null;
  const selectedRevision = selectedSubmission?.revisions.find((item) => item.revisionId === detailRevisionId)
    ?? selectedSubmission?.revisions.find((item) => item.revisionId === selectedSubmission.currentRevisionId) ?? null;
  const selectedEntries = draftEntries.filter((entry) => selectedIds.has(entry.submissionId));
  const boardDirty = board ? JSON.stringify(draftEntries) !== JSON.stringify(createReviewStatusBoardDraft(board).entries) : false;
  const publishReady = report?.decision === 'ready' || report?.decision === 'warning-confirmation-required';

  const reload = useCallback(async () => {
    setBusy('refresh');
    setMessage(null);
    try {
      const sessionState = await openriamapGithubReviewAuth.getSession();
      if (sessionState.status !== 'authenticated' || !sessionState.principalId) throw new Error('请先在设置中的“登录状态”完成登录。');
      const currentActor = { principalId: sessionState.principalId, roles: sessionState.roles ?? [] };
      const [items, remoteBoard] = await Promise.all([
        adapter.listSubmissions?.(currentActor) ?? Promise.resolve([]),
        adapter.getStatusBoard(currentActor),
      ]);
      setActor(currentActor);
      setSubmissions(items);
      const entriesById = new Map(remoteBoard.entries.map((entry) => [entry.submissionId, entry]));
      const hydratedEntries = items.map((item) => asBoardEntry(item, entriesById.get(item.submissionId)));
      setBoard({ ...remoteBoard, entries: hydratedEntries });
      setDraftEntries(hydratedEntries);
      setSelectedIds((previous) => new Set([...previous].filter((item) => items.some((submission) => submission.submissionId === item))));
      // A detail panel opens only after the reviewer chooses a package.
      // Refreshing the sequence must not unexpectedly open the first package.
      setDetailId((previous) => previous && items.some((item) => item.submissionId === previous) ? previous : null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(null);
    }
  }, [adapter]);

  useEffect(() => { void reload(); }, [reload]);

  const refreshGate = useCallback(async () => {
    setBusy('gate');
    try {
      const response = await fetch('/api/review-control', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ operation: 'release-gate' }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? '无法读取 Release Gate。');
      setReleaseGate(payload);
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(null); }
  }, []);

  const refreshFeed = useCallback(async () => {
    setBusy('feed');
    try { setReleaseFeed(await adapter.getReleaseFeed?.(actor, 10) ?? []); }
    catch (error) { setMessage(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(null); }
  }, [actor, adapter]);

  const setDraftState = useCallback((submissionId: string, state: ReviewStatusBoardEntry['state'], reason?: string, decisionAction?: ReviewStatusDecisionAction) => {
    const submission = submissions.find((item) => item.submissionId === submissionId);
    if (!submission) return;
    const revisionId = detailId === submissionId && detailRevisionId ? detailRevisionId : submission.currentRevisionId;
    setDraftEntries((previous) => previous.map((entry) => entry.submissionId === submissionId ? {
      ...entry, state, decisionRevisionId: revisionId, updatedAt: new Date().toISOString(), updatedBy: actor, ...(decisionAction ? { decisionAction } : {}), ...(reason ? { reason } : {}),
    } : entry));
  }, [actor, detailId, detailRevisionId, submissions]);

  const saveStatus = useCallback(async () => {
    if (!board || !selectedEntries.length) return;
    if (!window.confirm(`将保存 ${selectedEntries.length} 个审核包的状态灯。保存前服务端会再次校验状态与版本，是否继续？`)) return;
    setBusy('status');
    try {
      let expectedBoardVersion = board.boardVersion;
      const remoteBoard = await adapter.getStatusBoard(actor);
      if (remoteBoard.boardVersion !== board.boardVersion) {
        const changed = compareReviewStatusBoards(draftEntries, remoteBoard.entries).filter((entry) => entry.kind !== 'unchanged');
        const revisionChanged = changed.filter((entry) => entry.kind === 'revision-changed');
        if (revisionChanged.length) {
          setMessage(`状态未保存：${revisionChanged.map((entry) => entry.submissionId).join('、')} 已在云端切换到其他版本。请在对应审核包详情中点击“刷新”，检查新版本后重新保存状态。`);
          return;
        }
        const summary = changed.length ? changed.map((entry) => `${entry.submissionId}:${entry.kind}`).join('；') : '云端状态板已更新';
        if (!window.confirm(`检测到其他审核员的状态灯变更（${summary}）。已确认的包版本没有变化；是否以当前本地选择覆盖这些状态灯？`)) {
          setMessage('状态保存已取消；本地草稿仍保留，必要时请刷新对应审核包。');
          return;
        }
        expectedBoardVersion = remoteBoard.boardVersion;
      }
      const result = await adapter.saveStatusBoard({ requestId: id('status-save'), correlationId: id('status-correlation'), idempotencyKey: id('status-idempotency'), expectedBoardVersion, entries: selectedEntries, actor, occurredAt: new Date().toISOString() });
      setBoard(result.board);
      setDraftEntries(result.board.entries.map((entry) => ({ ...entry })));
      setReport(null);
      setMessage('审核状态已保存；现在可进行发布前检查。');
      await reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally { setBusy(null); }
  }, [actor, adapter, board, draftEntries, reload, selectedEntries]);

  const runPackagePrecheck = useCallback(async () => {
    if (!selectedSubmission || !selectedRevision) return;
    setBusy('package-precheck');
    try {
      const result = await adapter.dispatchSubmission({ requestId: id('precheck'), correlationId: id('precheck-correlation'), idempotencyKey: id('precheck-idempotency'), submissionId: selectedSubmission.submissionId, targetRevisionId: selectedRevision.revisionId, expectedStateVersion: selectedSubmission.stateVersion, action: 'precheck', occurredAt: new Date().toISOString(), actor });
      setReport(result as unknown as RemoteReport);
      await reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(null); }
  }, [actor, adapter, reload, selectedRevision, selectedSubmission]);

  const loadIntoWorkspace = useCallback(async () => {
    if (!selectedSubmission || !selectedRevision) return;
    if (dirty && !window.confirm('当前审核工作区有未保存修改。加载其他审核包会清理该工作区，是否继续？')) return;
    setBusy('download');
    try {
      const grant = await requestRiaReviewRevisionDownload(selectedSubmission.submissionId, selectedRevision.revisionId);
      const response = await fetch(grant.download.url);
      if (!response.ok) throw new Error(`审核包下载失败：HTTP ${response.status}`);
      const blob = await response.blob();
      if (blob.size !== grant.download.byteLength) throw new Error('审核包下载长度校验失败。');
      const file = new File([blob], selectedSubmission.packageName || `${selectedSubmission.submissionId}.zip`, { type: 'application/zip' });
      const parsed = await parseRelayPackageZip(file);
      const item = createReviewItemFromParsedRelayPackage(file.name, parsed, activeWorldId);
      onLoadPackage({ ...item, packageId: selectedSubmission.submissionId, status: selectedSubmission.state, updatedAt: selectedSubmission.lastEvent?.occurredAt, source: 'local-file' });
      setMessage('审核包已下载并加载到审核工作区。');
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(null); }
  }, [activeWorldId, dirty, selectedRevision, selectedSubmission, onLoadPackage]);

  const runReleasePrecheck = useCallback(async () => {
    if (!board || boardDirty || !selectedEntries.length) return;
    const initiator = submissions.find((item) => item.submissionId === selectedEntries.find((entry) => entry.state === 'approved')?.submissionId);
    if (!initiator) { setMessage('所选包中至少需要一个已通过状态，才能进行发布前检查。'); return; }
    setBusy('release-precheck');
    try {
      const gateResponse = await fetch('/api/review-control', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ operation: 'release-gate' }) });
      const gatePayload = await gateResponse.json();
      if (!gateResponse.ok) throw new Error(gatePayload?.error ?? '无法读取 Release Gate。');
      setReleaseGate(gatePayload);
      if (['prechecking', 'awaiting-confirmation', 'queueing', 'running', 'mirroring'].includes(gatePayload?.state)) {
        setMessage('正有发布进行中。请刷新 Release Gate 并在其结束后重新检查。');
        return;
      }
      const remoteBoard = await adapter.getStatusBoard(actor);
      if (remoteBoard.boardVersion !== board.boardVersion) {
        const changed = compareReviewStatusBoards(draftEntries, remoteBoard.entries).filter((entry) => entry.kind !== 'unchanged');
        if (changed.some((entry) => entry.kind === 'revision-changed')) {
          setMessage('发布前检查已阻断：云端审核包版本已经变化。请刷新对应审核包、检查新版后保存状态。');
          return;
        }
        if (window.confirm('云端状态灯已有其他审核员的更新。要先以当前本地选择执行“保存状态”并完成版本核对吗？')) await saveStatus();
        else setMessage('发布前检查已取消；请先刷新或保存状态。');
        return;
      }
      const response = await fetch('/api/review-control', {
        method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ operation: 'publish-precheck', selectedSubmissionIds: selectedEntries.map((entry) => entry.submissionId), expectedBoardVersion: board.boardVersion, request: { requestId: id('release-precheck'), correlationId: id('release-correlation'), idempotencyKey: id('release-idempotency'), submissionId: initiator.submissionId, targetRevisionId: initiator.displayRevisionId, expectedStateVersion: initiator.stateVersion } }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? '发布前检查失败。');
      setReport(payload);
      setReleaseGate(payload.gate ?? null);
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(null); }
  }, [actor, adapter, board, boardDirty, draftEntries, saveStatus, selectedEntries, submissions]);

  const publish = useCallback(async () => {
    if (!report?.gate?.attemptId || !report?.gate?.gateVersion || !report?.report?.reportSha256 || !publishReady) return;
    if (!window.confirm('确认发布？服务端会再次验证 Release Gate、当前数据版本和选择状态。')) return;
    const initiator = submissions.find((item) => item.submissionId === selectedEntries.find((entry) => entry.state === 'approved')?.submissionId);
    if (!initiator) return;
    setBusy('publish');
    try {
      const response = await fetch('/api/review-control', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ operation: 'publish-confirm', attemptId: report.gate.attemptId, expectedGateVersion: report.gate.gateVersion, precheckReportSha256: report.report.reportSha256, request: { requestId: id('publish'), correlationId: id('publish-correlation'), idempotencyKey: id('publish-idempotency'), submissionId: initiator.submissionId, targetRevisionId: initiator.displayRevisionId, expectedStateVersion: initiator.stateVersion } }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? '发布请求失败。');
      setReport(payload);
      setReleaseGate(payload.gate ?? null);
      setMessage(`发布已进入 ${payload.decision ?? '队列'} 状态。`);
      await reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(null); }
  }, [publishReady, reload, report, selectedEntries, submissions]);

  const mutateLocal = (state: ReviewStatusBoardEntry['state'], reasonPrompt?: string, decisionAction?: ReviewStatusDecisionAction) => {
    for (const entry of selectedEntries) {
      const reason = reasonPrompt ? window.prompt(reasonPrompt, entry.reason ?? '') ?? undefined : undefined;
      if (reasonPrompt && !reason) continue;
      setDraftState(entry.submissionId, state, reason, decisionAction);
    }
  };

  useEffect(() => {
    const receiveDraft = (event: Event) => {
      const detail = (event as CustomEvent<{ submissionId?: string; state?: ReviewStatusBoardEntry['state']; reason?: string; decisionAction?: ReviewStatusDecisionAction }>).detail;
      if (!detail?.submissionId || !detail.state) return;
      const submissionId = detail.submissionId;
      setDraftState(submissionId, detail.state, detail.reason, detail.decisionAction);
      setSelectedIds((previous) => new Set(previous).add(submissionId));
      setDetailId(submissionId);
    };
    window.addEventListener('cairn-review-status-draft', receiveDraft);
    return () => window.removeEventListener('cairn-review-status-draft', receiveDraft);
  }, [setDraftState]);

  useEffect(() => {
    const receiveUpload = (event: Event) => {
      const detail = (event as CustomEvent<{ submissionId?: string }>).detail;
      setMessage(detail?.submissionId ? `审核包已上传：${detail.submissionId}。正在刷新审核列表。` : '审核包已上传。正在刷新审核列表。');
      void reload();
    };
    window.addEventListener('cairn-review-submission-uploaded', receiveUpload);
    return () => window.removeEventListener('cairn-review-submission-uploaded', receiveUpload);
  }, [reload]);

  return (
    <>
      <DraggablePanel id="review-queue-panel" defaultPosition={{ x: 18, y: 132 }} zIndex={1760} constrainExpandedToViewport>
        <div className="w-[430px] max-h-[76vh] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl" data-draggable-proxy-close="true">
          <div className="border-b border-gray-200 px-4 py-3 pr-24">
            <h3 className="text-base font-bold text-gray-900" data-draggable-title>审核序列</h3>
            <div className="mt-0.5 text-xs text-gray-500">状态灯先本地编辑；仅“保存状态”会提交到审核服务。</div>
            <button type="button" data-draggable-close className="sr-only" aria-label="关闭" onClick={onClose} />
          </div>
          <div className="max-h-[calc(76vh-56px)] space-y-3 overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-2">
              <AppButton type="button" onClick={() => void refreshGate()} disabled={busy !== null} className="justify-center rounded-xl bg-gray-100 px-2 py-2 text-xs text-gray-700 hover:bg-gray-200"><ShieldCheck className="h-3.5 w-3.5" />刷新 Release Gate</AppButton>
              <AppButton type="button" onClick={() => void refreshFeed()} disabled={busy !== null} className="justify-center rounded-xl bg-gray-100 px-2 py-2 text-xs text-gray-700 hover:bg-gray-200"><FileText className="h-3.5 w-3.5" />刷新发布记录</AppButton>
              <AppButton type="button" onClick={() => void reload()} disabled={busy !== null} className="justify-center rounded-xl bg-blue-50 px-2 py-2 text-xs text-blue-700 hover:bg-blue-100"><RefreshCw className={`h-3.5 w-3.5 ${busy === 'refresh' ? 'animate-spin' : ''}`} />刷新列表</AppButton>
              <div className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-600">Gate：{releaseGate?.state ?? '未读取'} · 已选 {selectedIds.size}</div>
            </div>
            {message ? <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{message}</div> : null}
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-gray-800">待审核包</span>
              <span className="flex gap-2"><button type="button" className="text-blue-600 hover:underline" onClick={() => setSelectedIds(new Set(submissions.map((item) => item.submissionId)))}>全选</button><button type="button" className="text-gray-500 hover:underline" onClick={() => setSelectedIds(new Set())}>清空选择</button></span>
            </div>
            <div className="space-y-2">
              {submissions.map((submission) => {
                const draft = draftEntries.find((entry) => entry.submissionId === submission.submissionId) ?? asBoardEntry(submission);
                const checked = selectedIds.has(submission.submissionId);
                return <div key={submission.submissionId} className={`rounded-2xl border p-3 ${detailId === submission.submissionId ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-start gap-2"><input aria-label={`选择 ${submission.packageName}`} type="checkbox" checked={checked} onChange={() => setSelectedIds((previous) => { const next = new Set(previous); if (next.has(submission.submissionId)) next.delete(submission.submissionId); else next.add(submission.submissionId); return next; })} />
                    <button type="button" onClick={() => { setDetailId(submission.submissionId); setDetailRevisionId(submission.currentRevisionId); }} className="min-w-0 flex-1 text-left"><div className="truncate text-sm font-semibold text-gray-900">{submission.packageName || submission.submissionId}</div><div className="mt-0.5 truncate text-[11px] text-gray-500">{submission.submissionId}</div></button>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${stateTone(draft.state)}`}>{stateLabel(draft.state)}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-gray-500">决策版本：{draft.decisionRevisionId ?? '—'} · 共 {submission.revisions.length} 个版本</div>
                </div>;
              })}
              {!submissions.length && !busy ? <div className="rounded-xl bg-gray-50 px-3 py-4 text-center text-xs text-gray-500">当前没有可读取的审核包。</div> : null}
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
              <AppButton type="button" disabled={!selectedEntries.length || busy !== null} onClick={() => void saveStatus()} className="justify-center rounded-xl bg-orange-600 px-2 py-2 text-xs text-white hover:bg-orange-700 disabled:bg-orange-300"><CheckCircle2 className="h-3.5 w-3.5" />保存状态</AppButton>
              <AppButton type="button" disabled={!selectedEntries.length || boardDirty || busy !== null} onClick={() => void runReleasePrecheck()} className="justify-center rounded-xl bg-blue-600 px-2 py-2 text-xs text-white hover:bg-blue-700 disabled:bg-blue-300"><ClipboardCheck className="h-3.5 w-3.5" />发布前检查</AppButton>
              <AppButton type="button" disabled={!publishReady || busy !== null} onClick={() => void publish()} className="justify-center rounded-xl bg-green-600 px-2 py-2 text-xs text-white hover:bg-green-700 disabled:bg-green-300"><Send className="h-3.5 w-3.5" />发布</AppButton>
            </div>
            {boardDirty ? <div className="text-[11px] text-amber-700">状态灯存在未保存修改；请先保存状态，才可进行发布前检查。</div> : null}
            {renderReport(report)}
          </div>
        </div>
      </DraggablePanel>

      {selectedSubmission ? <DraggablePanel id="review-package-detail-panel" defaultPosition={{ x: 468, y: 132 }} zIndex={1765} constrainExpandedToViewport>
        <div className="w-[390px] max-h-[76vh] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl" data-draggable-proxy-close="true">
          <div className="border-b border-gray-200 px-4 py-3 pr-24"><h3 className="text-base font-bold text-gray-900" data-draggable-title>审核包详情</h3><div className="mt-0.5 break-all text-xs text-gray-500">{selectedSubmission.submissionId}</div><button type="button" data-draggable-close className="sr-only" aria-label="关闭" onClick={() => setDetailId(null)} /></div>
          <div className="max-h-[calc(76vh-56px)] space-y-3 overflow-y-auto p-3">
            <div className="flex gap-2"><select className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800" value={selectedRevision?.revisionId ?? ''} onChange={(event) => setDetailRevisionId(event.target.value)}>{selectedSubmission.revisions.map((revision) => <option key={revision.revisionId} value={revision.revisionId}>{revision.revisionId}</option>)}</select><AppButton type="button" onClick={() => void reload()} disabled={busy !== null} className="rounded-xl bg-gray-100 px-3 text-xs text-gray-700 hover:bg-gray-200"><RefreshCw className="h-4 w-4" />刷新</AppButton></div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-blue-50 px-2 py-2 text-blue-700"><b>{selectedRevision?.package?.featureCount ?? '—'}</b><div>要素</div></div><div className="rounded-xl bg-amber-50 px-2 py-2 text-amber-700"><b>{selectedRevision?.package?.deleteCount ?? '—'}</b><div>删除</div></div><div className="rounded-xl bg-purple-50 px-2 py-2 text-purple-700"><b>{selectedRevision?.package?.pictureCount ?? '—'}</b><div>图片</div></div></div>
            <AppButton type="button" onClick={() => void loadIntoWorkspace()} disabled={!selectedRevision || busy !== null} className="w-full justify-center rounded-xl bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:bg-orange-300"><FileDown className="h-4 w-4" />加载到审核工作区</AppButton>
            <AppButton type="button" onClick={() => void runPackagePrecheck()} disabled={!selectedRevision || busy !== null} className="w-full justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"><ClipboardCheck className="h-4 w-4" />预检</AppButton>
            <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3"><AppButton type="button" onClick={() => mutateLocal('archived', undefined, 'archive')} className="justify-center rounded-xl bg-gray-100 px-2 py-2 text-xs text-gray-700 hover:bg-gray-200"><Archive className="h-3.5 w-3.5" />归档</AppButton><AppButton type="button" onClick={() => mutateLocal('rejected', '请填写要求修改的原因：', 'request-changes')} className="justify-center rounded-xl bg-red-50 px-2 py-2 text-xs text-red-700 hover:bg-red-100"><XCircle className="h-3.5 w-3.5" />要求修改</AppButton><AppButton type="button" onClick={() => mutateLocal('pending', undefined, 'reopen')} className="justify-center rounded-xl bg-amber-50 px-2 py-2 text-xs text-amber-800 hover:bg-amber-100"><RotateCcw className="h-3.5 w-3.5" />恢复待审</AppButton></div>
            {renderReport(report)}
          </div>
        </div>
      </DraggablePanel> : null}

      {releaseFeed ? <DraggablePanel id="review-release-feed-panel" defaultPosition={{ x: 874, y: 132 }} zIndex={1762} constrainExpandedToViewport><div className="w-[330px] max-h-[60vh] overflow-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-xl" data-draggable-proxy-close="true"><h3 className="text-base font-bold text-gray-900" data-draggable-title>发布记录</h3><button type="button" data-draggable-close className="sr-only" aria-label="关闭" onClick={() => setReleaseFeed(null)} />{releaseFeed.length ? <div className="mt-3 space-y-2">{releaseFeed.map((item) => <div key={item.releaseId} className="rounded-xl bg-gray-50 p-2 text-xs"><div className="font-semibold text-gray-800">{item.releaseId}</div><div className="mt-1 text-gray-500">{item.occurredAt} · {stateLabel(item.state)}</div></div>)}</div> : <div className="mt-3 text-sm text-gray-500">暂无发布记录。</div>}</div></DraggablePanel> : null}

      <DraggablePanel id="review-status-panel" defaultPosition={{ x: 424, y: 132 }} zIndex={1755} constrainExpandedToViewport><ReviewLayerManagerPanel session={session} dirty={dirty} /></DraggablePanel>
    </>
  );
}
