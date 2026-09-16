import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { materializeRiaReviewPackageForWorkspace } from '@/components/Mapping/core/relayPackageParser';
import { loadRuleItemsForWorld, normalizeRuleSourceWorldId } from '@/components/Rules/data/ruleDataSources';
import { pickIdFieldValue } from '@/components/Rules/rendering/renderRules';
import { createReviewItemFromParsedRelayPackage } from './reviewInboxReader';
import { openriamapGithubReviewAuth } from './openriamapReviewAuth';
import { createRiaReviewSubmissionAdapter, requestRiaReviewRevisionDownload } from './riaReviewSubmissionAdapter';
import { ReviewStatusBoardPanel, type ReviewStatusDraftSignal } from './ReviewStatusBoardPanel';
import type { ReviewPackagePrecheckReport, ReviewPackageRevision, ReviewSubmissionSnapshot, ReviewWorkspaceLoadProgress } from './contracts';
import type { ParsedRelayPackage } from '@/components/Mapping/core/relayPackageParser';
import type { ReviewInboxItem } from './reviewStatusTypes';

type ReviewModuleProps = {
  activeWorldId: string;
  onClose: () => void;
  /** Returns false when the active workspace teardown was cancelled. */
  onLoadPackage: (item: ReviewInboxItem) => Promise<boolean> | boolean;
};

async function sha256Hex(blob: Blob): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

type CachedRevision = {
  key: string;
  file: File;
  parsed: ParsedRelayPackage;
  downloadedAt: string;
};

function revisionCacheKey(submission: ReviewSubmissionSnapshot, revision: ReviewPackageRevision): string {
  return `${submission.submissionId}\u0000${revision.revisionId}\u0000${revision.contentHash.toLowerCase()}`;
}

function releasePreviewUrls(parsed: ParsedRelayPackage) {
  for (const pictures of Object.values(parsed.draft.picturesById)) {
    for (const picture of pictures) if (picture.previewUrl) URL.revokeObjectURL(picture.previewUrl);
  }
}

/**
 * This intentionally does not ask the review service. It confirms the
 * downloaded package and reads only the browser-visible formal-data snapshot;
 * it never writes a review state. The final server release precheck remains
 * authoritative, so two reviewers cannot race a CAS-mutating remote precheck.
 */
function itemId(value: unknown): string {
  const item = value && typeof value === 'object' ? value as Record<string, unknown> : null;
  if (!item) return '';
  const { idValue } = pickIdFieldValue(item, String(item.Class ?? item.Type ?? item.subType ?? ''));
  return String(idValue ?? item.ID ?? item.id ?? '').trim();
}

function itemWorld(value: unknown, fallbackWorldId: string): string {
  const item = value && typeof value === 'object' ? value as Record<string, unknown> : null;
  return normalizeRuleSourceWorldId(String(item?.World ?? item?.world ?? fallbackWorldId).trim() || fallbackWorldId);
}

async function localPrecheck(submission: ReviewSubmissionSnapshot, revision: ReviewPackageRevision, parsed: ParsedRelayPackage, activeWorldId: string): Promise<ReviewPackagePrecheckReport> {
  const findings: Array<ReviewPackagePrecheckReport['findings'][number]> = [];
  for (const issue of parsed.validation.errors) findings.push({ code: 'PACKAGE_INVALID', severity: 'blocker', message: issue.message });
  for (const issue of parsed.validation.warnings) findings.push({ code: 'PACKAGE_INVALID', severity: 'warning', message: issue.message });

  const featureIds = new Set<string>();
  for (const feature of parsed.jsonItems) {
    const id = itemId(feature);
    if (!id) continue;
    if (featureIds.has(id)) findings.push({ code: 'UPSERT_DUPLICATE', severity: 'blocker', message: `审核包内存在重复要素 ID：${id}` });
    featureIds.add(id);
  }
  const deleted = new Set<string>();
  for (const entry of parsed.draft.deleteMarks) {
    const id = itemId(entry);
    if (!id) continue;
    if (deleted.has(id)) findings.push({ code: 'UPSERT_DUPLICATE', severity: 'blocker', message: `审核包内存在重复删除目标：${id}` });
    if (featureIds.has(id)) findings.push({ code: 'PACKAGE_INVALID', severity: 'blocker', message: `同一要素同时被新增/修改和删除：${id}` });
    deleted.add(id);
  }
  // A local precheck has no authority to advance a state machine.  It may,
  // however, read the browser's formal-data source/cache and give the reviewer
  // actionable deletion/overwrite feedback before the workspace is opened.
  // The server-side release precheck remains the authoritative TOCTOU-safe
  // check against the exact release snapshot.
  const packageWorlds = new Set<string>([
    ...parsed.jsonItems.map((item) => itemWorld(item, activeWorldId)),
    ...parsed.draft.deleteMarks.map((item) => itemWorld(item, activeWorldId)),
  ]);
  const officialByWorld = new Map<string, Map<string, number>>();
  let snapshotReadable = true;
  for (const worldId of packageWorlds) {
    try {
      const records = await loadRuleItemsForWorld(worldId);
      if (!records.length) {
        snapshotReadable = false;
        continue;
      }
      const index = new Map<string, number>();
      for (const record of records) {
        const id = itemId(record);
        if (id) index.set(id, (index.get(id) ?? 0) + 1);
      }
      officialByWorld.set(worldId, index);
    } catch {
      snapshotReadable = false;
    }
  }
  if (!snapshotReadable || officialByWorld.size !== packageWorlds.size) {
    findings.push({
      code: 'SOURCE_SNAPSHOT_UNAVAILABLE',
      severity: 'warning',
      message: '本地正式数据快照缺失或读取失败；无法完整确认删除目标和当前要素冲突。发布前检查仍会使用服务端权威快照。',
    });
  }
  for (const feature of parsed.jsonItems) {
    const id = itemId(feature);
    const worldId = itemWorld(feature, activeWorldId);
    const count = officialByWorld.get(worldId)?.get(id) ?? 0;
    if (id && count > 0) findings.push({
      code: 'UPSERT_OVERWRITES_CURRENT', severity: count === 1 ? 'warning' : 'blocker',
      message: count === 1 ? `本地快照显示要素 ${id} 已存在；本次发布会覆盖当前要素。` : `本地快照显示要素 ${id} 存在 ${count} 个同 ID 目标，无法安全判断覆盖对象。`,
    });
  }
  for (const entry of parsed.draft.deleteMarks) {
    const id = itemId(entry);
    const worldId = itemWorld(entry, activeWorldId);
    const count = officialByWorld.get(worldId)?.get(id) ?? 0;
    if (!id || !officialByWorld.has(worldId)) continue;
    if (count === 0) findings.push({ code: 'DELETE_TARGET_MISSING', severity: 'blocker', message: `本地快照中不存在待删除要素 ${id}。` });
    if (count > 1) findings.push({ code: 'DELETE_TARGET_AMBIGUOUS', severity: 'blocker', message: `本地快照中有 ${count} 个要素使用待删除 ID ${id}。` });
  }
  const blockers = findings.filter((item) => item.severity === 'blocker').length;
  const warnings = findings.filter((item) => item.severity === 'warning').length;
  return {
    schemaVersion: 'cairn.review-package-precheck.v1',
    decision: blockers ? 'blocked' : 'warning-confirmation-required',
    submissionId: submission.submissionId,
    revisionId: revision.revisionId,
    stateVersion: submission.stateVersion,
    findings,
    summary: { blockers, warnings },
  };
}

/**
 * RIA application binding for the upstream generic status-board workbench.
 * This layer owns session use, broker-issued archive downloads, Relay parsing,
 * and map-workspace injection. It deliberately owns no queue UI or generic
 * review-state semantics.
 */
export default function ReviewModule({ activeWorldId, onClose, onLoadPackage }: ReviewModuleProps) {
  const adapter = useMemo(() => createRiaReviewSubmissionAdapter(), []);
  const cacheRef = useRef(new Map<string, CachedRevision>());
  const [cachedKeys, setCachedKeys] = useState<ReadonlySet<string>>(() => new Set());

  const clearRevisionCache = useCallback((input?: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision }) => {
    const keys = input ? [revisionCacheKey(input.submission, input.revision)] : [...cacheRef.current.keys()];
    for (const key of keys) {
      const cached = cacheRef.current.get(key);
      if (cached) releasePreviewUrls(cached.parsed);
      cacheRef.current.delete(key);
    }
    setCachedKeys(new Set(cacheRef.current.keys()));
  }, []);

  useEffect(() => () => {
    for (const cached of cacheRef.current.values()) releasePreviewUrls(cached.parsed);
    cacheRef.current.clear();
  }, []);

  const downloadRevision = useCallback(async (
    { submission, revision }: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision },
    reportProgress?: (progress: ReviewWorkspaceLoadProgress) => void,
  ) => {
    const key = revisionCacheKey(submission, revision);
    if (cacheRef.current.has(key)) {
      reportProgress?.({ stage: 'ready', message: '审核包已位于本次会话的本地缓存。' });
      return;
    }
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
    cacheRef.current.set(key, { key, file, parsed, downloadedAt: new Date().toISOString() });
    setCachedKeys(new Set(cacheRef.current.keys()));
    reportProgress?.({ stage: 'ready', message: '审核包已下载并缓存于本次浏览器会话。' });
  }, []);

  const onLoadRevision = useCallback(async (
    { submission, revision }: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision },
    reportProgress?: (progress: ReviewWorkspaceLoadProgress) => void,
  ) => {
    const cached = cacheRef.current.get(revisionCacheKey(submission, revision));
    if (!cached) throw new Error('请先下载并校验该审核包，再置入审核工作区。');
    const item = createReviewItemFromParsedRelayPackage(cached.file.name, cached.parsed, activeWorldId);
    reportProgress?.({ stage: 'injecting', message: '正在注入审核图层管理…' });
    const loaded = await onLoadPackage({
      ...item,
      packageId: submission.submissionId,
      status: submission.state,
      updatedAt: submission.lastEvent?.occurredAt,
      source: 'local-file',
      submissionContext: {
        submissionId: submission.submissionId,
        revisionId: revision.revisionId,
        revisionCount: submission.revisions.length,
        stateVersion: submission.stateVersion,
        packageName: submission.packageName || cached.file.name,
      },
    });
    if (!loaded) return;
    reportProgress?.({ stage: 'ready', message: '审核包已加载到审核工作区。' });
  }, [activeWorldId, onLoadPackage]);

  const runLocalPrecheck = useCallback(async (input: { submission: ReviewSubmissionSnapshot; revision: ReviewPackageRevision }) => {
    const cached = cacheRef.current.get(revisionCacheKey(input.submission, input.revision));
    if (!cached) throw new Error('请先下载并校验该审核包，再执行本地预检。');
    return localPrecheck(input.submission, input.revision, cached.parsed, activeWorldId);
  }, [activeWorldId]);

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

  return <>
    <ReviewStatusBoardPanel
    auth={openriamapGithubReviewAuth}
    submissionAdapter={adapter}
    releaseControl={adapter}
    onDownloadRevision={downloadRevision}
    onLoadRevision={onLoadRevision}
    onLocalPrecheck={runLocalPrecheck}
    isRevisionCached={(input) => cachedKeys.has(revisionCacheKey(input.submission, input.revision))}
    onClearRevisionCache={clearRevisionCache}
    onClose={() => { clearRevisionCache(); onClose(); }}
    subscribeToStatusDraft={subscribeToStatusDraft}
      subscribeToSubmissionUpload={subscribeToSubmissionUpload}
    />
  </>;
}
