import type { ReviewInboxItem } from './reviewStatusTypes';

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

type ReviewPackageListPanelProps = {
  items: ReviewInboxItem[];
  selectedPackageId?: string | null;
  loading: boolean;
  error?: string | null;
  onSelect: (item: ReviewInboxItem) => void;
};

export default function ReviewPackageListPanel({ items, selectedPackageId, loading, error, onSelect }: ReviewPackageListPanelProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-2">
      <div>
        <div className="text-sm font-semibold text-gray-900">审核队列</div>
        <div className="text-xs text-gray-500">样例队列 / 本地传递包</div>
      </div>

      {loading && <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700">正在读取审核样例...</div>}
      {error && <div className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}
      {!loading && items.length === 0 && !error && (
        <div className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-600">当前没有可显示的审核包。</div>
      )}

      <div className="min-h-0 flex-1 overflow-auto pr-1">
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const selected = item.packageId === selectedPackageId;
            return (
              <button
                key={`${item.source}:${item.packageId}`}
                type="button"
                onClick={() => onSelect(item)}
                className={`rounded-2xl border px-3 py-2 text-left transition ${selected ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-900">{item.packageId}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{item.projectId ?? '未知项目'} · {item.worldId}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                    {item.status}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1 text-[11px] text-gray-600">
                  <span>要素 {item.features.length}</span>
                  <span>删除 {item.deleteMarks.length}</span>
                  <span>图片 {Object.values(item.picturesById).reduce((sum, entries) => sum + entries.length, 0)}</span>
                </div>
                <div className="mt-1 text-[11px] text-gray-400">{formatDate(item.updatedAt ?? item.createdAt)}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
