import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { forwardRelayTransfer, normalizeRelayTransferRequest, signDispatcherRequest, verifySession } from '../../api/review-relay-transfer.mjs';

const secret = 'session-test-secret';
const payload = Buffer.from(JSON.stringify({ login: 'alice', expiresAt: Date.now() + 60_000 })).toString('base64url');
const cookie = `${payload}.${crypto.createHmac('sha256', secret).update(payload).digest('base64url')}`;
const session = verifySession(cookie, secret);
assert.equal(session.login, 'alice');
assert.equal(verifySession(`${payload}.wrong`, secret), null);

const request = { requestId: 'r1', idempotencyKey: 'p1:submit:1', packageId: 'p1', byteLength: 1, sha256: 'a'.repeat(64), contentMd5: 'AAAAAAAAAAAAAAAAAAAAAA==' };
const normalized = normalizeRelayTransferRequest({ operation: 'relay-upload-request', request, actor: { principalId: 'attacker' } }, { principalId: session.login });
assert.equal(normalized.actor.principalId, 'alice');
assert.equal(normalizeRelayTransferRequest({ operation: 'relay-inbox-list', actor: { principalId: 'attacker' } }, { principalId: 'alice' }).actor.principalId, 'alice');
assert.throws(() => normalizeRelayTransferRequest({ operation: 'unknown' }, { principalId: 'alice' }), /invalid-relay-transfer-operation/);

let forwarded = null;
const environment = { CAIRN_CONTROL_API_BASE: 'https://dispatcher.example', CAIRN_SESSION_SIGNING_SECRET: secret, CAIRN_BROKER_TO_DISPATCHER_SECRET: 'broker-test-secret' };
const result = await forwardRelayTransfer({
  input: { operation: 'relay-upload-request', request }, session, environment,
  fetcher: async (url, init) => { forwarded = { url, init }; return { status: 200, json: async () => ({ accepted: true }) }; },
});
assert.equal(result.status, 200);
assert.equal(forwarded.url, 'https://dispatcher.example/v1/review-intents');
const forwardedBody = JSON.parse(forwarded.init.body);
assert.equal(forwardedBody.actor.principalId, 'alice');
const signed = signDispatcherRequest(forwardedBody, environment.CAIRN_BROKER_TO_DISPATCHER_SECRET, forwarded.init.headers['x-cairn-timestamp']);
assert.equal(forwarded.init.headers['x-cairn-signature'], signed.signature);
console.log('Review Relay transfer broker port: PASS');
