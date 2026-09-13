export type ReviewOperationOverlayState = {
  title: string;
  message: string;
  phase: 'running' | 'success' | 'error';
  detail?: string;
  completedBytes?: number;
  totalBytes?: number;
};

type ReviewOperationOverlayProps = {
  operation: ReviewOperationOverlayState | null;
  onClose: () => void;
};

/** A shared, high-priority review-operation frame. It reports real stages only. */
export function ReviewOperationOverlay({ operation, onClose }: ReviewOperationOverlayProps) {
  if (!operation) return null;
  const terminal = operation.phase !== 'running';
  const progress = operation.totalBytes && operation.completedBytes !== undefined
    ? Math.max(0, Math.min(100, Math.round((operation.completedBytes / operation.totalBytes) * 100)))
    : null;
  const tone = operation.phase === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
    : operation.phase === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800'
      : 'border-blue-200 bg-blue-50 text-blue-800';
  const content = <div className="fixed inset-0 z-[2147483000] flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-live="polite">
    <div className="w-[460px] max-w-[94vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-900">{operation.title}</h2>
        {terminal ? <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900">关闭</button> : <span className="text-xs text-slate-500">处理中</span>}
      </div>
      <div className="space-y-4 px-5 py-5">
        <div className={`rounded-xl border px-4 py-3 text-sm ${tone}`}>{operation.message}</div>
        {operation.phase === 'running' ? <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          {progress === null ? <div className="h-full w-2/5 animate-pulse rounded-full bg-blue-600" /> : <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />}
        </div> : null}
        {progress !== null ? <div className="text-right text-xs text-slate-500">{progress}%</div> : null}
        {operation.detail ? <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">{operation.detail}</p> : null}
      </div>
    </div>
  </div>;
  // Draggable panels use transforms, which create stacking contexts. Portal
  // the operation frame to document.body so it is genuinely above every map
  // and floating panel instead of merely using a large local z-index.
  return typeof document === 'undefined' ? content : createPortal(content, document.body);
}

export default ReviewOperationOverlay;
import { createPortal } from 'react-dom';
