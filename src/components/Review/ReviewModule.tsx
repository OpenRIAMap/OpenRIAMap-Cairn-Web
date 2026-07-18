import { useCallback, useEffect, useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import AppButton from '@/components/ui/AppButton';
import { DraggablePanel } from '@/components/DraggablePanel/DraggablePanel';
import { parseRelayPackageZip } from '@/components/Mapping/core/relayPackageParser';
import ReviewInboxPanel from './ReviewInboxPanel';
import ReviewLayerManagerPanel from './ReviewLayerManagerPanel';
import { createReviewItemFromParsedRelayPackage, loadSampleReviewInbox } from './reviewInboxReader';
import type { ReviewInboxItem } from './reviewStatusTypes';
import type { ReviewPackageSession } from './reviewPackageSession';

type ReviewModuleProps = {
  activeWorldId: string;
  session: ReviewPackageSession | null;
  dirty: boolean;
  onClose: () => void;
  onLoadPackage: (item: ReviewInboxItem) => void;
};

export default function ReviewModule({ activeWorldId, session, dirty, onClose, onLoadPackage }: ReviewModuleProps) {
  const [items, setItems] = useState<ReviewInboxItem[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localFileBusy, setLocalFileBusy] = useState(false);

  const selectedItem = useMemo(
    () => items.find((item) => item.packageId === selectedPackageId) ?? null,
    [items, selectedPackageId],
  );

  const reloadSampleInbox = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedItems = await loadSampleReviewInbox();
      setItems((previous) => {
        const localItems = previous.filter((item) => item.source === 'local-file');
        return [...localItems, ...loadedItems];
      });
      setSelectedPackageId((previous) => previous ?? loadedItems[0]?.packageId ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadSampleInbox();
  }, [reloadSampleInbox]);

  const confirmSwitchIfNeeded = useCallback((nextPackageId?: string) => {
    if (!session) return true;
    if (nextPackageId && session.packageId === nextPackageId) return true;
    if (dirty) {
      return window.confirm('当前审核包已有未保存修改。切换审核包将清空当前审核图层管理组，是否继续？');
    }
    if (session.status === 'saved_local') {
      return window.confirm('当前审核包已有本地保存的审核修改，但尚未通过或打回。是否继续切换？');
    }
    return true;
  }, [dirty, session]);

  const handleLocalRelayPackageFile = async (file: File | null) => {
    if (!file) return;
    setLocalFileBusy(true);
    setError(null);
    try {
      const parsed = await parseRelayPackageZip(file);
      const item = createReviewItemFromParsedRelayPackage(file.name, parsed, activeWorldId);
      setItems((previous) => [item, ...previous.filter((existing) => existing.packageId !== item.packageId)]);
      setSelectedPackageId(item.packageId);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLocalFileBusy(false);
    }
  };

  const handleLoadSelected = useCallback(() => {
    if (!selectedItem) return;
    if (!confirmSwitchIfNeeded(selectedItem.packageId)) return;
    onLoadPackage(selectedItem);
  }, [confirmSwitchIfNeeded, onLoadPackage, selectedItem]);

  const handleSelect = useCallback((item: ReviewInboxItem) => {
    if (session && item.packageId !== session.packageId && dirty) {
      const ok = window.confirm('当前审核包已有未保存修改。仅切换列表选择不会清空工作区，但请先保存/通过/打回后再加载新包。是否继续选择？');
      if (!ok) return;
    }
    setSelectedPackageId(item.packageId);
  }, [dirty, session]);

  return (
    <>
      <DraggablePanel id="review-inbox-panel" defaultPosition={{ x: 18, y: 132 }} zIndex={1760} constrainExpandedToViewport>
        <ReviewInboxPanel
          activeWorldId={activeWorldId}
          items={items}
          selectedPackageId={selectedPackageId}
          loading={loading}
          error={error}
          localFileBusy={localFileBusy}
          selectedItem={selectedItem}
          session={session}
          dirty={dirty}
          onReload={reloadSampleInbox}
          onSelect={handleSelect}
          onLocalFile={(file) => void handleLocalRelayPackageFile(file)}
          onLoadSelected={handleLoadSelected}
        />
      </DraggablePanel>

      <DraggablePanel id="review-status-panel" defaultPosition={{ x: 424, y: 132 }} zIndex={1755} constrainExpandedToViewport>
        <ReviewLayerManagerPanel session={session} dirty={dirty} />
      </DraggablePanel>

      <div className="pointer-events-none absolute left-1/2 top-4 z-[1500] hidden -translate-x-1/2 sm:block">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-orange-200 bg-white/95 px-3 py-2 text-xs text-orange-800 shadow-lg">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-semibold">审核模块</span>
          <span className="text-orange-600">前端工作台框架；暂不连接 GitHub。</span>
          <AppButton type="button" onClick={onClose} className="ml-1 h-7 rounded-full bg-orange-100 px-2 text-xs text-orange-800 hover:bg-orange-200">退出</AppButton>
        </div>
      </div>
    </>
  );
}
