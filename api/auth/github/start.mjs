import crypto from 'node:crypto';
import { sign } from '../../_reviewAuth.mjs';

export default function handler(req, res) {
  const clientId = process.env.CAIRN_GITHUB_OAUTH_CLIENT_ID;
  const redirectUri = process.env.CAIRN_GITHUB_OAUTH_REDIRECT_URI;
  const secret = process.env.CAIRN_SESSION_SIGNING_SECRET;
  if (!clientId || !redirectUri || !secret) return res.status(503).json({ error: 'github-oauth-not-configured' });
  const state = sign({ nonce: crypto.randomUUID(), expiresAt: Date.now() + 5 * 60 * 1000 }, secret);
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('scope', 'read:user');
  return res.redirect(302, url.toString());
}
