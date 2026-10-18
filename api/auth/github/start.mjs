import crypto from 'node:crypto';
import { sign } from '../../_reviewAuth.mjs';
import { requireReviewAutomation } from '../../_reviewAutomation.mjs';
import { publicationEnabled } from '../../_configurationPublication.mjs';

export default function handler(req, res) {
  const publication=req.query?.purpose==='configuration-publication';
  if(publication&&!publicationEnabled())return res.status(503).json({error:'configuration-publication-disabled'});
  if(!publication&&!requireReviewAutomation(res))return;
  const clientId = process.env.CAIRN_GITHUB_OAUTH_CLIENT_ID;
  const redirectUri = process.env.CAIRN_GITHUB_OAUTH_REDIRECT_URI;
  const secret = process.env.CAIRN_SESSION_SIGNING_SECRET;
  if (!clientId || !redirectUri || !secret) return res.status(503).json({ error: 'github-oauth-not-configured' });
  const popup = req.query?.mode === 'popup';
  const requestedNonce = typeof req.query?.nonce === 'string' ? req.query.nonce : '';
  // The caller-generated nonce binds the completion message to one parent
  // window. It is signed into OAuth state and never authorizes anything.
  if (popup && !/^[0-9a-f-]{36}$/i.test(requestedNonce)) return res.status(400).json({ error: 'invalid-oauth-popup-nonce' });
  if(publication&&(!popup||!/^[a-f0-9]{64}$/.test(req.query?.snapshotSha256??'')||!/^[a-f0-9]{64}$/.test(req.query?.baseSha256??'')||!/^[a-f0-9]{64}$/.test(req.query?.baseIdentitySha256??'')))return res.status(400).json({error:'invalid-configuration-oauth-context'});
  const state = sign({ nonce: popup ? requestedNonce : crypto.randomUUID(), popup, expiresAt: Date.now() + 5 * 60 * 1000,...(publication?{purpose:'configuration-publication',snapshotSha256:req.query.snapshotSha256,baseSha256:req.query.baseSha256,baseIdentitySha256:req.query.baseIdentitySha256}:{}) }, secret);
  if(publication)res.setHeader('Set-Cookie',`cairn_configuration_oauth=${encodeURIComponent(state)}; Path=/api/auth/github; HttpOnly; Secure; SameSite=Lax; Max-Age=300`);
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('scope', 'read:user');
  if(publication)url.searchParams.set('prompt','select_account');
  return res.redirect(302, url.toString());
}
