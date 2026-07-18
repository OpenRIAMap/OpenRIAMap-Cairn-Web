import type { ReviewInboxItem, ReviewLayerMountSummary } from './reviewStatusTypes';

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 py-1.5 text-xs last:border-b-0">
      <span className="shrink-0 text-gray-500">{label}</span>
      <span className="min-w-0 break-words text-right font-medium text-gray-800">{value ?? '—'}</span>
    </div>
  );
}

type ReviewPackageDetailPanelProps = {
  item: ReviewInboxItem | null;
  mountSummary: ReviewLayerMountSummary | null;
};

export default function ReviewPackageDetailPanel({ item, mountSummary }: ReviewPackageDetailPanelProps) {
  if (!item) {
    return (
      <section className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
        请选择一个传递包查看详情；确认后可加载到审核工作区。
      </section>
    );
  }

  const pictureCount = Object.values(item.picturesById).reduce((sum, entries) => sum + entries.length, 0);
  const warningCount = item.warnings.length + (item.review?.precheck?.warnings?.length ?? 0);
  const errorCount = item.errors.length + (item.review?.precheck?.errors?.length ?? 0);

  return (
    <section className="flex min-h-0 flex-col gap-3">
      <div>
        <div className="text-sm font-semibold text-gray-900">审核包详情</div>
        <div className="mt-0.5 break-all text-xs text-gray-500">{item.packageId}</div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-3">
        <InfoRow label="状态" value={item.status} />
        <InfoRow label="阶段" value={item.currentStage} />
        <InfoRow label="项目" value={item.projectId} />
        <InfoRow label="世界" value={item.worldId} />
        <InfoRow label="来源" value={item.source} />
        <InfoRow label="包类型" value={item.packageType} />
        <InfoRow label="包路径" value={item.packagePath} />
      </div>

      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="rounded-2xl bg-blue-50 px-2 py-2 text-blue-700"><div className="text-base font-bold">{item.features.length}</div><div>要素</div></div>
        <div className="rounded-2xl bg-amber-50 px-2 py-2 text-amber-700"><div className="text-base font-bold">{item.deleteMarks.length}</div><div>删除</div></div>
        <div className="rounded-2xl bg-purple-50 px-2 py-2 text-purple-700"><div className="text-base font-bold">{pictureCount}</div><div>图片</div></div>
        <div className="rounded-2xl bg-gray-50 px-2 py-2 text-gray-700"><div className="text-base font-bold">{warningCount + errorCount}</div><div>报告</div></div>
      </div>

      {mountSummary && (
        <div className="rounded-2xl border border-green-100 bg-green-50 p-3 text-xs text-green-800">
          当前已挂载：create {mountSummary.createCount} / update {mountSummary.updateCount} / delete {mountSummary.deleteCount} / pictures {mountSummary.pictureCount}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-3 text-xs">
        <div className="mb-2 font-semibold text-gray-800">报告摘要</div>
        <InfoRow label="预检" value={item.precheck?.status ?? item.review?.precheck?.status} />
        <InfoRow label="接收" value={item.accept?.status} />
        <InfoRow label="警告" value={warningCount} />
        <InfoRow label="错误" value={errorCount} />
      </div>

      {(item.warnings.length > 0 || item.errors.length > 0) && (
        <div className="max-h-28 overflow-auto rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800">
          {[...item.warnings, ...item.errors].map((message, index) => <div key={`${message}-${index}`}>• {message}</div>)}
        </div>
      )}
    </section>
  );
}
