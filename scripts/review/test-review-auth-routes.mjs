import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import sessionHandler from '../../api/auth/github/session.mjs';
import logoutHandler from '../../api/auth/github/logout.mjs';
import startHandler from '../../api/auth/github/start.mjs';
import callbackHandler from '../../api/auth/github/callback.mjs';
import { sign } from '../../api/_reviewAuth.mjs';

function response() {
  return {
    statusCode: null, payload: null, headers: {},
    status(value) { this.statusCode = value; return this; },
    json(value) { this.payload = value; return this; },
    send(value) { this.payload = value; return this; },
    setHeader(key, value) { this.headers[key] = value; },
    redirect(status, value) { this.statusCode = status; this.redirectTo = value; return this; },
  };
}

const secret = 'session-test-secret';
const payload = Buffer.from(JSON.stringify({ login: 'alice', expiresAt: Date.now() + 60_000 })).toString('base64url');
const cookie = `${payload}.${crypto.createHmac('sha256', secret).update(payload).digest('base64url')}`;
const environment = {
  CAIRN_REVIEW_AUTOMATION_ENABLED: 'true',
  CAIRN_REVIEW_AUTOMATION_STAGE: 'staging',
  CAIRN_SESSION_SIGNING_SECRET: secret,
  CAIRN_GITHUB_OAUTH_CLIENT_ID: 'test-client',
  CAIRN_GITHUB_OAUTH_CLIENT_SECRET: 'test-client-secret',
  CAIRN_GITHUB_OAUTH_REDIRECT_URI: 'https://cmap.example.test/api/auth/github/callback',
};
const original = process.env;
process.env = { ...process.env, ...environment };
try {
  const authenticated = response();
  sessionHandler({ method: 'GET', headers: { cookie: `cairn_review_session=${encodeURIComponent(cookie)}` } }, authenticated);
  assert.equal(authenticated.statusCode, 200);
  assert.deepEqual(authenticated.payload, { status: 'authenticated', principalId: 'alice', roles: [] });
  const anonymous = response();
  sessionHandler({ method: 'GET', headers: {} }, anonymous);
  assert.deepEqual(anonymous.payload, { status: 'anonymous' });
  const loggedOut = response();
  logoutHandler({ method: 'POST' }, loggedOut);
  assert.equal(loggedOut.statusCode, 200);
  assert.equal(loggedOut.payload.status, 'anonymous');
  assert.match(String(loggedOut.headers['Set-Cookie']), /Max-Age=0/);
  const popupStart = response();
  startHandler({ query: { mode: 'popup', nonce: 'db1d906f-398a-4bc7-b0cd-ec4e8e415896' } }, popupStart);
  assert.equal(popupStart.statusCode, 302);
  const authorizationUrl = new URL(popupStart.redirectTo);
  assert.equal(authorizationUrl.origin, 'https://github.com');
  assert.equal(authorizationUrl.pathname, '/login/oauth/authorize');
  assert.equal(authorizationUrl.searchParams.get('client_id'), 'test-client');
  assert.ok(authorizationUrl.searchParams.get('state'));
  const invalidPopupStart = response();
  startHandler({ query: { mode: 'popup', nonce: 'not-a-nonce' } }, invalidPopupStart);
  assert.equal(invalidPopupStart.statusCode, 400);
  assert.equal(invalidPopupStart.payload.error, 'invalid-oauth-popup-nonce');
  const fetchBeforeCallback = globalThis.fetch;
  globalThis.fetch = async (url) => String(url).includes('access_token')
    ? { ok: true, json: async () => ({ access_token: 'test-token' }) }
    : { ok: true, json: async () => ({ login: 'alice' }) };
  try {
    const popupCallback = response();
    const nonce = '77d8c020-2ec0-4bf9-9f22-2cb10d1a2087';
    await callbackHandler({ query: { code: 'test-code', state: sign({ nonce, popup: true, expiresAt: Date.now() + 60_000 }, secret) } }, popupCallback);
    assert.equal(popupCallback.statusCode, 200);
    assert.match(String(popupCallback.headers['Set-Cookie']), /cairn_review_session=/);
    assert.match(String(popupCallback.payload), /cairn-review-auth-complete/);
    assert.match(String(popupCallback.payload), /https:\/\/cmap\.example\.test/);
    assert.match(String(popupCallback.payload), new RegExp(nonce));
  } finally {
    globalThis.fetch = fetchBeforeCallback;
  }
} finally {
  process.env = original;
}
console.log('Review auth routes: PASS');
