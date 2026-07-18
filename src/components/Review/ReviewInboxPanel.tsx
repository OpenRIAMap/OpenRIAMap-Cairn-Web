import { FileArchive, RefreshCw, UploadCloud } from 'lucide-react';
import AppButton from '@/components/ui/AppButton';
import type { ReviewInboxItem } from './reviewStatusTypes';
import ReviewPackageListPanel from './ReviewPackageListPanel';
import ReviewPackageDetailPanel from './ReviewPackageDetailPanel';
import type { ReviewPackageSession } from './reviewPackageSession';
import { describeReviewWorkbenchStatus } from './reviewPackageSession';

export type ReviewInboxPanelProps = {
  activeWorldId: string;
  items: ReviewInboxItem[];
  selectedPackageId: string | null;
  loading: boolean;
  error: string | null;
  localFileBusy: boolean;
  selectedItem: ReviewInboxItem | null;
  session: ReviewPackageSession | null;
  dirty: boolean;
  onReload: () => void;
  onSelect: (item: ReviewInboxItem) => void;
  onLocalFile: (file: File | null) => void;
  onLoadSelected: () => void;
};

export default function ReviewInboxPanel({
  activeWorldId,
  items,
  selectedPackageId,
  loading,
  error,
  localFileBusy,
  selectedItem,
  session,
  dirty,
  onReload,
  onSelect,
  onLocalFile,
  onLoadSelected,
}: ReviewInboxPanelProps) {
  const selectedWorldMismatch = Boolean(selectedItem && selectedItem.worldId !== activeWorldId);
  const loadedCurrent = Boolean(session && selectedItem && session.packageId === selectedItem.packageId);
  const sessionStatus = session ? describeReviewWorkbenchStatus(session.status) : '未加载';

  return (
    <div className="w-[390px] max-h-[72vh] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl" data-draggable-proxy-close="true">
      <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-4 py-3 pr-24">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900" data-draggable-title>审核序列</h3>
          <div className="mt-0.5 text-xs text-gray-500">选择待审核传递包，并加载到审核工作区。</div>
        </div>
        <button type="button" data-draggable-close className="sr-only" aria-label="关闭" />
      </div>

      <div className="max-h-[calc(72vh-48px)] overflow-y-auto p-3">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-gray-900">Inbox 来源</div>
              <div className="text-xs text-gray-500">内置样例 + 本地 RelayPackage zip</div>
            </div>
            <AppButton onClick={onReload} className="h-8 bg-white px-2 text-xs text-gray-700 hover:bg-gray-100" disabled={loading} type="button">
              <RefreshCw className="h-3.5 w-3.5" />
              重读
            </AppButton>
          </div>
          <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-3 py-2 text-xs text-gray-600 hover:bg-gray-100">
            <FileArchive className="h-4 w-4" />
            {localFileBusy ? '正在解析...' : '选择本地传递包 zip'}
            <input
              type="file"
              accept=".zip,application/zip"
              className="hidden"
              disabled={localFileBusy}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                event.target.value = '';
                onLocalFile(file);
              }}
            />
          </label>
        </div>

        <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-3 text-xs text-gray-600">
          <div className="flex justify-between gap-3"><span className="font-semibold text-gray-800">当前世界</span><span>{activeWorldId}</span></div>
          <div className="mt-1 flex justify-between gap-3"><span className="font-semibold text-gray-800">工作区状态</span><span className={dirty ? 'text-amber-700' : 'text-gray-700'}>{dirty ? '有未保存修改' : sessionStatus}</span></div>
          {session ? <div className="mt-1 truncate text-gray-500" title={session.packageId}>当前包：{session.packageId}</div> : null}
        </div>

        <div className="mt-3">
          <ReviewPackageListPanel
            items={items}
            selectedPackageId={selectedPackageId}
            loading={loading}
            error={error}
            onSelect={onSelect}
          />
        </div>

        <div className="mt-3">
          <ReviewPackageDetailPanel item={selectedItem} mountSummary={null} />
        </div>

        {selectedWorldMismatch ? (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            该包声明世界为 {selectedItem?.worldId}，当前地图世界为 {activeWorldId}。加载前请确认是否需要切换世界。
          </div>
        ) : null}

        <AppButton
          type="button"
          disabled={!selectedItem}
          onClick={onLoadSelected}
          className={`mt-3 w-full justify-center rounded-xl px-3 py-2 text-sm font-semibold ${
            selectedItem ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title={!selectedItem ? '请先选择一个审核包' : loadedCurrent ? '重新加载当前审核包到工作区' : '加载到审核工作区'}
        >
          <UploadCloud className="h-4 w-4" />
          {loadedCurrent ? '重新加载到审核工作区' : '加载到审核工作区'}
        </AppButton>

        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
          当前阶段仅整理前端审核工作台。保存、通过、打回只生成本地审核状态，不调用 GitHub，不写入 Data 仓。
        </div>
      </div>
    </div>
  );
}
