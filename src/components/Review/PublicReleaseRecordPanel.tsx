import { useCallback, useEffect, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import AppButton from '@/components/ui/AppButton';

type PublicPackage = {
  submissionId: string;
  packageName: string;
  decisionRevisionId: string;
  decisionState: 'approved' | 'archived' | 'rejected';
  decisionAction: 'approve' | 'archive' | 'reject' | 'request-changes';
  reason?: string;
  revisionCount: number;
  counts: { featureCount: number; deleteCount: number; pictureCount: number };
  download?: { ready?: boolean; sha256?: string; byteLength?: number };
};

type PublicRelease = {
  releaseId: string;
  state: 'completed';
  publishedAt?: string | null;
  formalVersion?: number | null;
  lifecycle?: { dataPublishedAt?: string | null; mirroredAt?: string | null; archivedAt?: string | null; completedAt?: string | null };
  packages: PublicPackage[];
};

type Feed = { items?: Array<{ releaseId: string }> };

const statusLabel: Record<PublicPackage['decisionAction'], string> = {
  approve: '通过（已发布数据）',
  archive: '归档',
  reject: '打回',
  'request-changes': '要求修改',
};

const statusTone: Record<PublicPackage['decisionAction'], string> = {
  approve: 'bg-emerald-100 text-emerald-700',
  archive: 'bg-slate-200 text-slate-700',
  reject: 'bg-rose-100 text-rose-700',
  'request-changes': 'bg-amber-100 text-amber-800',
};

async function json<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(payload.error ?? `发布记录请求失败（HTTP ${response.status}）。`);
  return payload;
}

export function PublicReleaseRecordPanel({ onClose }: { onClose?: () => void }) {
  const [records, setRecords] = useState<PublicRelease[]>([]);
  const [busy, setBusy] = useState<'refresh' | string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setBusy('refresh');
    setMessage(null);
    try {
      const feed = await json<Feed>('/api/public-review-releases?limit=20');
      const details = await Promise.all((feed.items ?? []).map((item) => json<PublicRelease>(`/api/public-review-releases?releaseId=${encodeURIComponent(item.releaseId)}`)));
      setRecords(details);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(null);
    }
  }, []);

  const download = useCallback(async (release: PublicRelease, pkg: PublicPackage) => {
    if (!pkg.download?.ready) return;
    const key = `${release.releaseId}:${pkg.submissionId}:${pkg.decisionRevisionId}`;
    setBusy(key);
    setMessage(null);
    try {
      const grant = await json<{ download: { url: string } }>('/api/public-review-releases', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ operation: 'package-download', releaseId: release.releaseId, submissionId: pkg.submissionId, revisionId: pkg.decisionRevisionId }),
      });
      const link = document.createElement('a');
      link.href = grant.download.url;
      link.download = pkg.packageName || `${pkg.submissionId}.zip`;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(null);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  return <div className="w-[min(620px,94vw)] max-h-[74vh] overflow-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
    <div className="flex items-center justify-between gap-3">
      <div><h2 className="text-xl font-bold text-gray-900" data-draggable-title>发布记录</h2><p className="mt-1 text-xs text-gray-500">公开可读；仅显示已完成归档的审核结果。</p></div>
      <div className="flex items-center gap-1">
        <AppButton onClick={() => void refresh()} disabled={busy !== null} className="rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200" title="刷新发布记录"><RefreshCw className="h-4 w-4" /></AppButton>
        {onClose ? <AppButton onClick={onClose} data-draggable-close className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200" title="关闭">×</AppButton> : null}
      </div>
    </div>
    {message ? <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{message}</div> : null}
    <div className="mt-4 space-y-3">
      {records.map((release) => <section key={release.releaseId} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-start justify-between gap-2"><div className="font-semibold text-slate-900">{release.releaseId}</div><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">发布完成</span></div>
        <div className="mt-2 text-xs text-slate-600">完成时间：{release.lifecycle?.completedAt ?? release.lifecycle?.archivedAt ?? release.publishedAt ?? '未记录'}{release.formalVersion ? ` · 正式版本：${release.formalVersion}` : ' · 本次仅发布审核结果'}</div>
        <div className="mt-3 space-y-2">{release.packages.map((pkg) => {
          return <article key={`${pkg.submissionId}-${pkg.decisionRevisionId}`} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="truncate font-medium text-slate-900">{pkg.packageName}</div><div className="mt-1 break-all text-xs text-slate-500">版本：{pkg.decisionRevisionId} · 共 {pkg.revisionCount} 个版本</div></div><span className={`shrink-0 rounded-full px-2 py-1 text-xs ${statusTone[pkg.decisionAction]}`}>{statusLabel[pkg.decisionAction]}</span></div>
            <div className="mt-2 grid grid-cols-3 gap-1 text-center text-xs"><span className="rounded bg-blue-50 py-1 text-blue-700">{pkg.counts.featureCount} 要素</span><span className="rounded bg-amber-50 py-1 text-amber-700">{pkg.counts.deleteCount} 删除</span><span className="rounded bg-purple-50 py-1 text-purple-700">{pkg.counts.pictureCount} 图片</span></div>
            {pkg.reason ? <p className="mt-2 whitespace-pre-wrap rounded-lg border border-amber-200 bg-amber-50 px-2 py-2 text-xs leading-relaxed text-amber-900">{pkg.reason}</p> : null}
            <div className="mt-2 flex justify-end"><AppButton disabled={!pkg.download?.ready || busy !== null} onClick={() => void download(release, pkg)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs text-white hover:bg-blue-700 disabled:bg-blue-300"><Download className="h-3.5 w-3.5" />下载该审核包</AppButton></div>
          </article>;
        })}</div>
      </section>)}
      {!records.length && !message ? <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">{busy === 'refresh' ? '正在读取发布记录…' : '暂无已完成的公开发布记录。'}</div> : null}
    </div>
  </div>;
}

export default PublicReleaseRecordPanel;
