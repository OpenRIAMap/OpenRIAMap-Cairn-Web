import { signDispatcherRequest, verifySession } from '../../review-relay-transfer.mjs';
import { requireReviewAutomation } from '../../_reviewAutomation.mjs';

function parseCookies(value = '') {
  return Object.fromEntries(value.split(';').map((entry) => entry.trim().split('=').map(decodeURIComponent)).filter(([key, item]) => key && item));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method-not-allowed' });
  if (!requireReviewAutomation(res)) return;
  const cookie = parseCookies(req.headers.cookie).cairn_review_session;
  const session = verifySession(cookie, process.env.CAIRN_SESSION_SIGNING_SECRET);
  res.setHeader('Cache-Control', 'no-store');
  if (session) {
    const base = process.env.CAIRN_CONTROL_API_BASE;
    const dispatcherSecret = process.env.CAIRN_BROKER_TO_DISPATCHER_SECRET;
    if (!base || !dispatcherSecret) return res.status(200).json({ status: 'authenticated', principalId: session.login, roles: [] });
    try {
      const body = { operation: 'identity', actor: { principalId: session.login } };
      const signed = signDispatcherRequest(body, dispatcherSecret);
      const response = await fetch(`${base.replace(/\/$/, '')}/v1/review-intents`, {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-cairn-timestamp': signed.timestamp, 'x-cairn-signature': signed.signature }, body: JSON.stringify(body),
      });
      const identity = await response.json();
      const roles = response.ok && Array.isArray(identity?.roles) ? identity.roles.filter((role) => typeof role === 'string') : [];
      return res.status(200).json({ status: 'authenticated', principalId: session.login, roles });
    } catch {
      return res.status(200).json({ status: 'authenticated', principalId: session.login, roles: [] });
    }
  }
  return res.status(200).json({ status: cookie ? 'expired' : 'anonymous' });
}
