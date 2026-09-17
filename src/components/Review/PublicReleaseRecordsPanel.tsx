import { useCallback, useEffect, useState } from 'react';
import { Download, LoaderCircle, LogIn, RefreshCw, X } from 'lucide-react';

import AppButton from '@/components/ui/AppButton';
import AppCard from '@/components/ui/AppCard';
import { openriamapGithubReviewAuth } from './openriamapReviewAuth';
import {
  requestRiaPublicReviewReleaseDetail,
  requestRiaPublicReviewReleaseFeed,
  requestRiaPublicReviewReleasePackageDownload,
  type PublicReviewReleaseDetail,
  type PublicReviewReleaseFeedItem,
} from './riaReviewSubmissionAdapter';

type PublicReleaseRecordsPanelProps = {
  onClose: () => void;
  /** DraggablePanel owns desktop window controls; mobile owns its close key. */
  showNativeClose?: boolean;
  /** Desktop outer window owns its header refresh action; mobile retains one. */
  showInlineRefresh?: boolean;
  refreshSignal?: number;
};

const PERMITTED_ROLES = new Set(['contributor', 'contributer', 'reviewer', 'maintainer', 'admin']);

function hasReadRole(roles: string[] | undefined): boolean {
  return Boolean(roles?.some((role) => PERMITTED_ROLES.has(role.trim().toLowerCase())));
}

function textError(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function count(value: unknown): number {
  return Number.isSafeInteger(value) && Number(value) >= 0 ? Number(value) : 0;
}

function time(value: string | null | undefined): string {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function stateText(value: string | undefined): string {
  const labels: Record<string, string> = {
    approved: '通过',
    archived: '归档',
    rejected: '打回',
    'changes-requested': '要求修改',
  };
  return labels[value ?? ''] ?? (value || '已归档');
}

function decisionClass(value: string | undefined): string {
  if (value === 'rejected') return 'bg-rose-100 text-rose-700';
  if (value === 'changes-requested') return 'bg-amber-100 text-amber-800';
  if (value === 'approved') return 'bg-emerald-100 text-emerald-700';
  return 'bg-slate-100 text-slate-700';
}

function CompactPackageCard({
  entry,
  onDownload,
  downloading,
}: {
  entry: NonNullable<PublicReviewReleaseDetail['packages']>[number];
  onDownload: () => void;
  downloading: boolean;
}) {
  const counts = entry.counts ?? {};
  const displayState = entry.decisionState ?? entry.decisionAction;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="truncate text-sm font-semibold text-slate-900" title={entry.packageName ?? entry.submissionId}>
        {entry.packageName ?? entry.submissionId}
      </div>
      <div className="mt-1 break-all text-xs text-slate-500">版本：{entry.decisionRevisionId}</div>
      <div className="mt-2 grid grid-cols-3 overflow-hidden rounded-lg text-center text-xs">
        <div className="bg-blue-50 px-1.5 py-1.5 text-blue-700">{count(counts.featureCount)} 要素</div>
        <div className="bg-amber-50 px-1.5 py-1.5 text-amber-700">{count(counts.deleteCount)} 删除</div>
        <div className="bg-fuchsia-50 px-1.5 py-1.5 text-fuchsia-700">{count(counts.pictureCount)} 图片</div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${decisionClass(displayState)}`}>
          {stateText(displayState)}
        </span>
        <AppButton
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!entry.download?.ready || downloading}
          onClick={onDownload}
          title={entry.download?.ready ? `下载 ${entry.packageName ?? entry.submissionId}` : '该归档包暂不可下载'}
        >
          {downloading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          下载
        </AppButton>
      </div>
      {(displayState === 'rejected' || displayState === 'changes-requested') && entry.reason ? (
        <div className="mt-2 whitespace-pre-wrap rounded-lg bg-amber-50 px-2.5 py-2 text-xs leading-5 text-amber-900">
          {entry.reason}
        </div>
      ) : null}
    </div>
  );
}

export default function PublicReleaseRecordsPanel({ onClose, showNativeClose = false, showInlineRefresh = showNativeClose, refreshSignal }: PublicReleaseRecordsPanelProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [feed, setFeed] = useState<PublicReviewReleaseFeedItem[]>([]);
  const [details, setDetails] = useState<Record<string, PublicReviewReleaseDetail>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await openriamapGithubReviewAuth.getSession();
      const canRead = session.status === 'authenticated' && hasReadRole(session.roles);
      setAuthorized(canRead);
      if (!canRead) {
        setFeed([]);
        setDetails({});
        return;
      }
      const nextFeed = await requestRiaPublicReviewReleaseFeed(20);
      setFeed(nextFeed);
      const loaded = await Promise.all(nextFeed.map(async (entry) => [entry.releaseId, await requestRiaPublicReviewReleaseDetail(entry.releaseId)] as const));
      setDetails(Object.fromEntries(loaded));
    } catch (requestError) {
      setError(textError(requestError, '无法读取发布记录。'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh, refreshSignal]);

  const download = useCallback(async (releaseId: string, submissionId: string, revisionId: string) => {
    const key = `${releaseId}:${submissionId}:${revisionId}`;
    setDownloadingKey(key);
    setError(null);
    try {
      const grant = await requestRiaPublicReviewReleasePackageDownload(releaseId, submissionId, revisionId);
      const anchor = document.createElement('a');
      anchor.href = grant.download.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.click();
    } catch (requestError) {
      setError(textError(requestError, '无法创建该审核包的下载链接。'));
    } finally {
      setDownloadingKey(null);
    }
  }, []);

  return (
    <AppCard className="relative w-[min(94vw,620px)] max-h-[76vh] overflow-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" data-draggable-proxy-close="true">
      <button type="button" data-draggable-close className={showNativeClose ? 'absolute right-4 top-4 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100' : 'sr-only'} aria-label="关闭" onClick={onClose}>
        <X className="h-5 w-5" />
      </button>
      <div className={`flex min-h-8 items-start gap-3 ${showInlineRefresh || showNativeClose ? 'pr-24' : ''}`}>
        <div>
          <h2 className="text-xl font-bold text-slate-950" data-draggable-title>发布记录</h2>
          <p className="mt-1 text-sm text-slate-500">登录且具备 Contributor 及以上权限后可读取和下载。</p>
        </div>
      </div>
      {showInlineRefresh ? <div className={showNativeClose ? 'absolute right-14 top-4' : 'absolute right-4 top-4'}>
        <AppButton
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:text-slate-300"
          onClick={() => void refresh()}
          disabled={loading}
          title="刷新发布记录"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </AppButton>
      </div> : null}

      {authorized === false ? (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold">未登录</div>
          <p className="mt-1">发布记录与归档包下载需要登录，并验证 Contributor 或更高权限。</p>
          <AppButton className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 font-semibold text-white hover:bg-amber-700" onClick={() => openriamapGithubReviewAuth.beginLogin()}>
            <LogIn className="h-4 w-4" /> 登录
          </AppButton>
        </div>
      ) : null}
      {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</div> : null}
      {authorized === true && loading && !feed.length ? <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-7 text-center text-sm text-slate-500">正在读取发布记录…</div> : null}
      {authorized === true && !loading && !error && !feed.length ? <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-7 text-center text-sm text-slate-500">暂无已完成归档的发布记录。</div> : null}
      {authorized === true && feed.length ? (
        <div className="mt-5 space-y-3">
          {feed.map((item) => {
            const detail = details[item.releaseId];
            return (
              <section key={item.releaseId} className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900">{item.releaseId}</div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">发布完成</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">发布时间：{time(item.publishedAt ?? item.lifecycle?.completedAt)} · 正式版本：{item.formalVersion ?? '—'} · {item.packageCount ?? detail?.packages.length ?? 0} 个审核包</div>
                {detail ? <div className="mt-3 space-y-2">{detail.packages.map((entry) => {
                  const key = `${item.releaseId}:${entry.submissionId}:${entry.decisionRevisionId}`;
                  return <CompactPackageCard key={key} entry={entry} downloading={downloadingKey === key} onDownload={() => void download(item.releaseId, entry.submissionId, entry.decisionRevisionId)} />;
                })}</div> : <div className="mt-3 text-xs text-slate-500">正在读取本次发布的审核包…</div>}
              </section>
            );
          })}
        </div>
      ) : null}
    </AppCard>
  );
}
