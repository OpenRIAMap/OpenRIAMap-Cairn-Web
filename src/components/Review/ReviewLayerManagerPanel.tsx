import { ClipboardList } from 'lucide-react';
import type { ReviewPackageSession } from './reviewPackageSession';
import { describeReviewWorkbenchStatus } from './reviewPackageSession';

export default function ReviewLayerManagerPanel({ session, dirty }: { session: ReviewPackageSession | null; dirty: boolean }) {
  if (!session) {
    return (
      <div className="w-80 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-xl" data-draggable-proxy-close="true">
        <h3 className="font-bold text-gray-900" data-draggable-title>审核图层管理</h3>
        <button type="button" data-draggable-close className="sr-only" aria-label="关闭" />
        <div className="mt-2">请先在“审核序列”中加载一个传递包。加载后将打开测绘式审核图层管理面板。</div>
      </div>
    );
  }

  return (
    <div className="w-80 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900 shadow-xl" data-draggable-proxy-close="true">
      <div className="flex items-start gap-2">
        <ClipboardList className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0">
          <h3 className="font-bold" data-draggable-title>审核图层管理</h3>
          <div className="mt-1 truncate text-xs" title={session.packageId}>{session.packageId}</div>
        </div>
      </div>
      <button type="button" data-draggable-close className="sr-only" aria-label="关闭" />
      <div className="mt-3 space-y-1 text-xs">
        <div>状态：{dirty ? '有未保存修改' : describeReviewWorkbenchStatus(session.status)}</div>
        <div>要素：{session.featureCount}　删除：{session.deleteCount}　图片：{session.pictureCount}</div>
        <div>测绘式图层管理面板会在右侧打开；请使用其中的“保存 / 通过 / 打回 / 临挂 / 导出 / 删除”。</div>
      </div>
    </div>
  );
}
