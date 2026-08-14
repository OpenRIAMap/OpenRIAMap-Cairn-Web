import { verifySession } from '../../review-relay-transfer.mjs';
import { requireReviewAutomation } from '../../_reviewAutomation.mjs';

function parseCookies(value = '') {
  return Object.fromEntries(value.split(';').map((entry) => entry.trim().split('=').map(decodeURIComponent)).filter(([key, item]) => key && item));
}

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method-not-allowed' });
  if (!requireReviewAutomation(res)) return;
  const cookie = parseCookies(req.headers.cookie).cairn_review_session;
  const session = verifySession(cookie, process.env.CAIRN_SESSION_SIGNING_SECRET);
  res.setHeader('Cache-Control', 'no-store');
  if (session) return res.status(200).json({ status: 'authenticated', principalId: session.login });
  return res.status(200).json({ status: cookie ? 'expired' : 'anonymous' });
}
