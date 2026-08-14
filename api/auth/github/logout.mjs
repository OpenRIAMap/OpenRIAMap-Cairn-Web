import { clearSessionCookie } from '../../_reviewAuth.mjs';
import { requireReviewAutomation } from '../../_reviewAutomation.mjs';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method-not-allowed' });
  if (!requireReviewAutomation(res)) return;
  res.setHeader('Set-Cookie', clearSessionCookie());
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ status: 'anonymous' });
}
