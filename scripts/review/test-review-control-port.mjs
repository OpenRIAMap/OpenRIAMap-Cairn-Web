import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { forwardReviewControl, normalizeReviewControlRequest } from '../../api/review-control.mjs';
import { verifySession } from '../../api/review-relay-transfer.mjs';

const secret = 'session-test-secret';
const payload = Buffer.from(JSON.stringify({ login: 'alice', expiresAt: Date.now() + 60_000 })).toString('base64url');
const cookie = `${payload}.${crypto.createHmac('sha256', secret).update(payload).digest('base64url')}`;
const session = verifySession(cookie, secret);
const request = { requestId: 'r1', correlationId: 'c1', idempotencyKey: 'submission-1:r2:approve:c1', submissionId: 'submission-1', targetRevisionId: 'submission-1-r2', expectedStateVersion: 3 };

const normalized = normalizeReviewControlRequest({ operation: 'approve', request, actor: { principalId: 'attacker' } }, { principalId: session.login });
assert.equal(normalized.actor.principalId, 'alice');
assert.equal(normalized.request.targetRevisionId, 'submission-1-r2');
assert.throws(() => normalizeReviewControlRequest({ operation: 'approve', request: { ...request, expectedStateVersion: -1 } }, { principalId: 'alice' }), /invalid-review-control-request/);
assert.throws(() => normalizeReviewControlRequest({ operation: 'unknown' }, { principalId: 'alice' }), /invalid-review-control-operation/);
const uploadRequest = {
  requestId: 'upload-r1', correlationId: 'upload-c1', idempotencyKey: 'submission-2:submission-2-r1:upload:upload-c1',
  submissionId: 'submission-2', revisionId: 'submission-2-r1', expectedStateVersion: 0,
  byteLength: 22, sha256: 'a'.repeat(64), contentMd5: 'dGVzdC1tZDU=', packageName: 'RelayPackage.zip',
};
const upload = normalizeReviewControlRequest({ operation: 'revision-upload-request', request: uploadRequest }, { principalId: 'alice' });
assert.equal(upload.request.revisionId, 'submission-2-r1');
assert.equal(upload.request.targetRevisionId, 'submission-2-r1');
const uploadComplete = normalizeReviewControlRequest({ operation: 'revision-upload-complete', request: uploadRequest }, { principalId: 'alice' });
assert.equal(uploadComplete.request.targetRevisionId, 'submission-2-r1');
assert.throws(() => normalizeReviewControlRequest({ operation: 'revision-upload-request', request: { ...uploadRequest, targetRevisionId: 'another-revision' } }, { principalId: 'alice' }), /invalid-review-control-request/);
const confirmation = normalizeReviewControlRequest({
  operation: 'publish-confirm', request,
  attemptId: 'attempt-demo-001', expectedGateVersion: 2, precheckReportSha256: 'b'.repeat(64),
}, { principalId: 'alice' });
assert.equal(confirmation.attemptId, 'attempt-demo-001');
assert.equal(confirmation.precheckReportSha256, 'b'.repeat(64));
assert.equal(normalizeReviewControlRequest({ operation: 'release-gate' }, { principalId: 'alice' }).operation, 'release-gate');

let forwarded = null;
const environment = { CAIRN_CONTROL_API_BASE: 'https://dispatcher.example', CAIRN_SESSION_SIGNING_SECRET: secret, CAIRN_BROKER_TO_DISPATCHER_SECRET: 'broker-test-secret' };
const result = await forwardReviewControl({
  input: { operation: 'approve', request }, session, environment,
  fetcher: async (url, init) => { forwarded = { url, body: JSON.parse(init.body) }; return { status: 200, json: async () => ({ accepted: true }) }; },
});
assert.equal(result.status, 200);
assert.equal(forwarded.url, 'https://dispatcher.example/v1/review-intents');
assert.equal(forwarded.body.actor.principalId, 'alice');
assert.equal(forwarded.body.request.submissionId, 'submission-1');
console.log('Review submission control broker port: PASS');
