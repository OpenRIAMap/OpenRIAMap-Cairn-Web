import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ReviewReasonOverlayState = {
  title: string;
  message: string;
  submitLabel: string;
};

type ReviewReasonOverlayProps = {
  request: ReviewReasonOverlayState | null;
  onSubmit: (reason: string) => void;
  onCancel: () => void;
};

/** Collects a durable reviewer reason without falling back to window.prompt. */
export function ReviewReasonOverlay({ request, onSubmit, onCancel }: ReviewReasonOverlayProps) {
  const [reason, setReason] = useState('');
  useEffect(() => { setReason(''); }, [request]);
  if (!request) return null;
  const valid = Boolean(reason.trim());
  const content = <div className="fixed inset-0 z-[2147483002] flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="review-reason-title">
    <form className="w-[520px] max-w-[94vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onSubmit={(event) => { event.preventDefault(); if (valid) onSubmit(reason.trim()); }}>
      <div className="border-b border-slate-200 px-5 py-4"><h2 id="review-reason-title" className="text-lg font-bold text-slate-900">{request.title}</h2></div>
      <div className="space-y-3 px-5 py-5">
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">{request.message}</p>
        <label className="block text-sm font-medium text-slate-700" htmlFor="review-decision-reason">审核意见</label>
        <textarea id="review-decision-reason" autoFocus value={reason} onChange={(event) => setReason(event.target.value)} rows={6} maxLength={2000} placeholder="可输入多行说明；该内容会显示在公开发布记录中。" className="w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm leading-relaxed outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        <div className="text-right text-xs text-slate-500">{reason.length}/2000</div>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
        <button type="button" onClick={onCancel} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">取消</button>
        <button type="submit" disabled={!valid} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:bg-rose-300">{request.submitLabel}</button>
      </div>
    </form>
  </div>;
  return typeof document === 'undefined' ? content : createPortal(content, document.body);
}

export default ReviewReasonOverlay;
