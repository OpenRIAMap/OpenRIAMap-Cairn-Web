import { sessionCookie, verify, sign } from '../../_reviewAuth.mjs';
import { requireReviewAutomation } from '../../_reviewAutomation.mjs';
import { publicationEnabled } from '../../_configurationPublication.mjs';

function popupCompletion(res, state, redirectUri) {
  const origin = new URL(redirectUri).origin;
  const payload = JSON.stringify({ type: state.purpose==='configuration-publication'?'cairn-configuration-auth-complete':'cairn-review-auth-complete', nonce: state.nonce, status: 'ok' });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'");
  return res.status(200).send(`<!doctype html><meta charset="utf-8"><title>登录完成</title><script>window.opener&&window.opener.postMessage(${payload},${JSON.stringify(origin)});window.close();</script><p>登录完成，可关闭此窗口。</p>`);
}

export default async function handler(req, res) {
  const secret = process.env.CAIRN_SESSION_SIGNING_SECRET;
  const clientId = process.env.CAIRN_GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.CAIRN_GITHUB_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.CAIRN_GITHUB_OAUTH_REDIRECT_URI;
  const state = verify(req.query?.state, secret);
  const publication=state?.purpose==='configuration-publication';
  if(publication&&!publicationEnabled())return res.status(503).json({error:'configuration-publication-disabled'});
  if(!publication&&!requireReviewAutomation(res))return;
  if(publication){
    const cookie=String(req.headers?.cookie??'').split(';').map(item=>item.trim()).find(item=>item.startsWith('cairn_configuration_oauth='));
    let matches=false;try{matches=!!cookie&&decodeURIComponent(cookie.slice('cairn_configuration_oauth='.length))===req.query?.state;}catch{/* invalid cookie encoding */}
    if(!matches)return res.status(401).json({error:'configuration-oauth-state-mismatch'});
  }
  if (!secret || !clientId || !clientSecret || !redirectUri || !state || state.expiresAt <= Date.now() || typeof req.query?.code !== 'string') return res.status(401).json({ error: 'invalid-oauth-callback' });
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code: req.query.code, redirect_uri: redirectUri }) });
  const token = await tokenResponse.json();
  if (!tokenResponse.ok || typeof token.access_token !== 'string') return res.status(502).json({ error: 'github-token-exchange-failed' });
  const userResponse = await fetch('https://api.github.com/user', { headers: { authorization: `Bearer ${token.access_token}`, accept: 'application/vnd.github+json', 'user-agent': 'cairn-review-broker' } });
  const user = await userResponse.json();
  if (!userResponse.ok || typeof user.login !== 'string') return res.status(502).json({ error: 'github-user-lookup-failed' });
  if(publication){
    const receipt=sign({purpose:'configuration-publication',login:user.login,nonce:state.nonce,snapshotSha256:state.snapshotSha256,baseSha256:state.baseSha256,baseIdentitySha256:state.baseIdentitySha256,expiresAt:Date.now()+15*60*1000},secret);
    res.setHeader('Set-Cookie',[`cairn_configuration_session=${encodeURIComponent(receipt)}; Path=/api/config-publication; HttpOnly; Secure; SameSite=Lax; Max-Age=900`,'cairn_configuration_oauth=; Path=/api/auth/github; HttpOnly; Secure; SameSite=Lax; Max-Age=0']);
  }else res.setHeader('Set-Cookie', sessionCookie(user.login, secret));
  if (state.popup === true) return popupCompletion(res, state, redirectUri);
  return res.redirect(302, '/');
}
