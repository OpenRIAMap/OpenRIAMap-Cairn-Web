import {
  normalizeReviewAuthSession,
  type ReviewAuthPort,
  type ReviewAuthSessionOptions,
  type ReviewAuthSessionState,
} from '@/components/Review/auth';

type JsonResponse = { response: Response; body: unknown };

async function jsonRequest(path: string, init?: RequestInit): Promise<JsonResponse> {
  const response = await fetch(path, { credentials: 'same-origin', cache: 'no-store', ...init });
  let body: unknown = null;
  try { body = await response.json(); } catch {}
  return { response, body };
}

function message(body: unknown, fallback: string): string {
  return body && typeof body === 'object' && typeof (body as Record<string, unknown>).error === 'string'
    ? String((body as Record<string, unknown>).error)
    : fallback;
}

const AUTH_MESSAGE = 'cairn-review-auth-complete';

function popupNonce(): string {
  return crypto.randomUUID();
}

/**
 * Complete OAuth in an isolated popup.  The parent never receives a provider
 * token; it accepts only a same-origin, nonce-bound completion message and
 * then reads its normal HttpOnly cookie session.
 */
async function beginPopupLogin(): Promise<void> {
  const nonce = popupNonce();
  const start = new URL('/api/auth/github/start', window.location.origin);
  start.searchParams.set('mode', 'popup');
  start.searchParams.set('nonce', nonce);
  const popup = window.open(start.toString(), 'cairn-review-login', 'popup=yes,width=560,height=720,resizable=yes,scrollbars=yes');
  if (!popup) throw new Error('登录窗口被浏览器拦截；请允许此站点打开登录窗口后重试。');
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => finish(new Error('登录等待超时，请重新发起登录。')), 5 * 60 * 1000);
    const closed = window.setInterval(() => {
      if (popup.closed) finish(new Error('登录窗口已关闭，未完成登录。'));
    }, 400);
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || !event.data || typeof event.data !== 'object') return;
      const data = event.data as { type?: unknown; nonce?: unknown; status?: unknown; error?: unknown };
      if (data.type !== AUTH_MESSAGE || data.nonce !== nonce) return;
      if (data.status === 'ok') finish();
      else finish(new Error(typeof data.error === 'string' ? data.error : 'GitHub 登录未完成。'));
    };
    const finish = (error?: Error) => {
      window.clearTimeout(timeout);
      window.clearInterval(closed);
      window.removeEventListener('message', onMessage);
      if (!popup.closed) popup.close();
      if (error) reject(error);
      else resolve();
    };
    window.addEventListener('message', onMessage);
  });
  window.dispatchEvent(new CustomEvent('ria:review-auth-changed'));
}

/** RIA-owned bridge for the provider-neutral settings component. */
export const openriamapGithubReviewAuth: ReviewAuthPort = {
  async getSession(options: ReviewAuthSessionOptions = {}): Promise<ReviewAuthSessionState> {
    try {
      const path = options.includeRoles === false
        ? '/api/auth/github/session?includeRoles=0'
        : '/api/auth/github/session';
      const { response, body } = await jsonRequest(path);
      if (response.ok) return normalizeReviewAuthSession(body);
      if (response.status === 401) return { status: 'expired', message: 'GitHub 登录会话已过期，请重新登录。' };
      return { status: 'unavailable', message: message(body, '无法读取 GitHub 登录状态。') };
    } catch {
      return { status: 'unavailable', message: '无法连接 GitHub 登录状态服务。' };
    }
  },
  beginLogin: beginPopupLogin,
  async logout(): Promise<void> {
    const { response, body } = await jsonRequest('/api/auth/github/logout', { method: 'POST' });
    if (!response.ok) throw new Error(message(body, 'GitHub 登录退出失败。'));
  },
};

export default openriamapGithubReviewAuth;
