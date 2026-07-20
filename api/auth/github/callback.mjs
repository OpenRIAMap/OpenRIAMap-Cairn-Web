import { sessionCookie, verify } from '../../_reviewAuth.mjs';
import { requireReviewAutomation } from '../../_reviewAutomation.mjs';

export default async function handler(req, res) {
  if (!requireReviewAutomation(res)) return;
  const secret = process.env.CAIRN_SESSION_SIGNING_SECRET;
  const clientId = process.env.CAIRN_GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.CAIRN_GITHUB_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.CAIRN_GITHUB_OAUTH_REDIRECT_URI;
  const state = verify(req.query?.state, secret);
  if (!secret || !clientId || !clientSecret || !redirectUri || !state || state.expiresAt <= Date.now() || typeof req.query?.code !== 'string') return res.status(401).json({ error: 'invalid-oauth-callback' });
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code: req.query.code, redirect_uri: redirectUri }) });
  const token = await tokenResponse.json();
  if (!tokenResponse.ok || typeof token.access_token !== 'string') return res.status(502).json({ error: 'github-token-exchange-failed' });
  const userResponse = await fetch('https://api.github.com/user', { headers: { authorization: `Bearer ${token.access_token}`, accept: 'application/vnd.github+json', 'user-agent': 'cairn-review-broker' } });
  const user = await userResponse.json();
  if (!userResponse.ok || typeof user.login !== 'string') return res.status(502).json({ error: 'github-user-lookup-failed' });
  res.setHeader('Set-Cookie', sessionCookie(user.login, secret));
  return res.redirect(302, '/');
}
