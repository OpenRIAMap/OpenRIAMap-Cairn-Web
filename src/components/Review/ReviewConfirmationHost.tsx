import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import AppButton from '@/components/ui/AppButton';
import { REVIEW_LAYER } from './reviewLayering';

export type ReviewConfirmationRequest = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'blue' | 'green' | 'orange' | 'rose';
};

type PendingRequest = {
  request: ReviewConfirmationRequest;
  resolve: (confirmed: boolean) => void;
};

const REVIEW_CONFIRM_EVENT = 'ria:review-confirmation-request';

/**
 * Imperative review transports (such as export/upload) cannot receive a React
 * dialog callback. They use this small in-page bridge instead of a browser
 * `confirm`; the mounted host below owns the visual and interaction layer.
 */
export function requestReviewConfirmation(request: ReviewConfirmationRequest): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  return new Promise((resolve) => {
    const event = new CustomEvent(REVIEW_CONFIRM_EVENT, { cancelable: true, detail: { request, resolve } });
    // A caller outside the normal MapContainer (for example a unit test or an
    // accidental standalone mount) must fail closed instead of awaiting a
    // dialog host that does not exist.
    if (window.dispatchEvent(event)) resolve(false);
  });
}

export default function ReviewConfirmationHost() {
  const [pending, setPending] = useState<PendingRequest | null>(null);
  const pendingRef = useRef<PendingRequest | null>(null);

  useEffect(() => {
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<Partial<PendingRequest>>).detail;
      if (!detail?.request || typeof detail.resolve !== 'function') return;
      event.preventDefault();
      // There is deliberately no hidden confirmation queue: an action may not
      // silently confirm behind a currently visible destructive prompt.
      if (pendingRef.current) {
        detail.resolve(false);
        return;
      }
      const next = { request: detail.request, resolve: detail.resolve };
      pendingRef.current = next;
      setPending(next);
    };
    window.addEventListener(REVIEW_CONFIRM_EVENT, receive);
    return () => {
      window.removeEventListener(REVIEW_CONFIRM_EVENT, receive);
      pendingRef.current?.resolve(false);
      pendingRef.current = null;
    };
  }, []);

  const settle = (confirmed: boolean) => {
    const current = pending;
    pendingRef.current = null;
    setPending(null);
    current?.resolve(confirmed);
  };

  if (!pending || typeof document === 'undefined') return null;
  const tone = pending.request.tone ?? 'blue';
  const toneClass = tone === 'rose'
    ? 'bg-rose-600 hover:bg-rose-700'
    : tone === 'green'
      ? 'bg-green-600 hover:bg-green-700'
      : tone === 'orange'
        ? 'bg-orange-600 hover:bg-orange-700'
        : 'bg-blue-600 hover:bg-blue-700';

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950/45 p-4" style={{ zIndex: REVIEW_LAYER.confirmation }} role="dialog" aria-modal="true" aria-labelledby="review-confirm-host-title">
      <div className="w-full max-w-[510px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-5 py-4"><h3 id="review-confirm-host-title" className="text-lg font-bold text-slate-900">{pending.request.title}</h3></div>
        <p className="whitespace-pre-wrap px-5 py-5 text-sm leading-6 text-slate-700">{pending.request.message}</p>
        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
          <AppButton className="rounded-xl bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100" onClick={() => settle(false)}>{pending.request.cancelLabel ?? '取消'}</AppButton>
          <AppButton className={`rounded-xl px-4 py-2 text-sm text-white ${toneClass}`} onClick={() => settle(true)}>{pending.request.confirmLabel}</AppButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}
