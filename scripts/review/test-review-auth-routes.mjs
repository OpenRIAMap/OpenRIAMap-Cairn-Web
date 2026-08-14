import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import sessionHandler from '../../api/auth/github/session.mjs';
import logoutHandler from '../../api/auth/github/logout.mjs';

function response() {
  return {
    statusCode: null, payload: null, headers: {},
    status(value) { this.statusCode = value; return this; },
    json(value) { this.payload = value; return this; },
    setHeader(key, value) { this.headers[key] = value; },
  };
}

const secret = 'session-test-secret';
const payload = Buffer.from(JSON.stringify({ login: 'alice', expiresAt: Date.now() + 60_000 })).toString('base64url');
const cookie = `${payload}.${crypto.createHmac('sha256', secret).update(payload).digest('base64url')}`;
const environment = { CAIRN_REVIEW_AUTOMATION_ENABLED: 'true', CAIRN_REVIEW_AUTOMATION_STAGE: 'staging', CAIRN_SESSION_SIGNING_SECRET: secret };
const original = process.env;
process.env = { ...process.env, ...environment };
try {
  const authenticated = response();
  sessionHandler({ method: 'GET', headers: { cookie: `cairn_review_session=${encodeURIComponent(cookie)}` } }, authenticated);
  assert.equal(authenticated.statusCode, 200);
  assert.deepEqual(authenticated.payload, { status: 'authenticated', principalId: 'alice' });
  const anonymous = response();
  sessionHandler({ method: 'GET', headers: {} }, anonymous);
  assert.deepEqual(anonymous.payload, { status: 'anonymous' });
  const loggedOut = response();
  logoutHandler({ method: 'POST' }, loggedOut);
  assert.equal(loggedOut.statusCode, 200);
  assert.equal(loggedOut.payload.status, 'anonymous');
  assert.match(String(loggedOut.headers['Set-Cookie']), /Max-Age=0/);
} finally {
  process.env = original;
}
console.log('Review auth routes: PASS');
