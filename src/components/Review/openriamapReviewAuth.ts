import {
  normalizeReviewAuthSession,
  type ReviewAuthPort,
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

/** RIA-owned bridge for the provider-neutral settings component. */
export const openriamapGithubReviewAuth: ReviewAuthPort = {
  async getSession(): Promise<ReviewAuthSessionState> {
    try {
      const { response, body } = await jsonRequest('/api/auth/github/session');
      if (response.ok) return normalizeReviewAuthSession(body);
      if (response.status === 401) return { status: 'expired', message: 'GitHub 登录会话已过期，请重新登录。' };
      return { status: 'unavailable', message: message(body, '无法读取 GitHub 登录状态。') };
    } catch {
      return { status: 'unavailable', message: '无法连接 GitHub 登录状态服务。' };
    }
  },
  beginLogin(): void {
    window.location.assign('/api/auth/github/start');
  },
  async logout(): Promise<void> {
    const { response, body } = await jsonRequest('/api/auth/github/logout', { method: 'POST' });
    if (!response.ok) throw new Error(message(body, 'GitHub 登录退出失败。'));
  },
};

export default openriamapGithubReviewAuth;
