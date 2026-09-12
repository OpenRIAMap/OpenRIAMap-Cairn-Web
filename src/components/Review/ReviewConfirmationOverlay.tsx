export type ReviewConfirmationOverlayState = {
  title: string;
  message: string;
  detail?: string;
  confirmLabel?: string;
};

type ReviewConfirmationOverlayProps = {
  confirmation: ReviewConfirmationOverlayState | null;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Uses the same high-priority frame as long-running review operations. */
export function ReviewConfirmationOverlay({ confirmation, onConfirm, onCancel }: ReviewConfirmationOverlayProps) {
  if (!confirmation) return null;
  return <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="review-confirmation-title">
    <div className="w-[460px] max-w-[94vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <div className="border-b border-slate-200 px-5 py-4"><h2 id="review-confirmation-title" className="text-lg font-bold text-slate-900">{confirmation.title}</h2></div>
      <div className="space-y-3 px-5 py-5">
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">{confirmation.message}</p>
        {confirmation.detail ? <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">{confirmation.detail}</p> : null}
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
        <button type="button" onClick={onCancel} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">取消</button>
        <button type="button" onClick={onConfirm} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{confirmation.confirmLabel ?? '确认'}</button>
      </div>
    </div>
  </div>;
}

export default ReviewConfirmationOverlay;
