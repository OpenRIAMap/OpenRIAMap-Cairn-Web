import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import handler from '../../api/config-publication.mjs';
import { sign } from '../../api/_reviewAuth.mjs';
import { ConfigurationPublicationForwardError, publicationFailure } from '../../api/_configurationPublicationFailure.mjs';

const originalEnv = { ...process.env }, originalFetch = globalThis.fetch, originalLog = console.error;
const secretMarker = 'private-cookie-token-signature-and-signed-url';
const session = {
  purpose: 'configuration-publication', login: 'maintainer-test', nonce: randomUUID(),
  snapshotSha256: 'a'.repeat(64), baseSha256: 'b'.repeat(64), baseIdentitySha256: 'c'.repeat(64),
  expiresAt: Date.now() + 60_000,
};
const requestId = randomUUID(), jobId = `config-${randomUUID()}`;
const logs = [];
let fetchCalls = 0, checks = 0;
function response() {
  return {
    headers: {}, setHeader(key, value) { this.headers[key] = value; return this; },
    status(value) { this.statusCode = value; return this; }, json(value) { this.body = value; return this; },
  };
}
function input(operation) {
  return operation === 'prepare'
    ? { operation, requestId, snapshotSha256: session.snapshotSha256, baseSha256: session.baseSha256, archiveSha256: 'd'.repeat(64), byteLength: 128, proposedRevision: 8 }
    : { operation, requestId, jobId, ...(operation === 'confirm' ? { receipt: secretMarker, warningsAccepted: true } : {}) };
}
async function call(body, fetcher) {
  fetchCalls = 0; logs.length = 0;
  globalThis.fetch = async (...args) => { fetchCalls++; return fetcher(...args); };
  const res = response();
  await handler({ method: 'POST', headers: {
    origin: 'https://application.example.test',
    cookie: `cairn_configuration_session=${encodeURIComponent(sign(session, process.env.CAIRN_SESSION_SIGNING_SECRET))}`,
  }, body }, res);
  return res;
}
function checkFailure(res, status, code, stage) {
  assert.equal(res.statusCode, status);
  assert.equal(res.body.error, code);
  assert.match(res.body.diagnosticId, /^[a-f0-9-]{36}$/i);
  assert.equal(res.body.diagnosticId, res.headers['X-Cairn-Diagnostic-Id']);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.equal(logs.length, 1);
  const log = JSON.parse(logs[0]);
  assert.equal(log.diagnosticId, res.body.diagnosticId);
  assert.equal(log.status, status); assert.equal(log.stage, stage);
  assert.equal(typeof log.elapsedMs, 'number');
  assert(!JSON.stringify([res.body, log]).includes(secretMarker), 'do not leak a cause message or request credentials');
  for (const value of [session.nonce, process.env.CAIRN_SESSION_SIGNING_SECRET, process.env.CAIRN_BROKER_TO_DISPATCHER_SECRET, sign(session, process.env.CAIRN_SESSION_SIGNING_SECRET)]) {
    assert(!JSON.stringify([res.body, log]).includes(value), 'do not log authentication material');
  }
  const allowedLogKeys = new Set(['event', 'diagnosticId', 'operation', 'requestId', 'jobId', 'elapsedMs', 'status', 'error', 'stage', 'errorName', 'causeNames', 'causeCodes', 'upstreamStatus']);
  assert(Object.keys(log).every(key => allowedLogKeys.has(key)), 'logging must use an explicit safe field list');
  checks++;
  return log;
}
const transportError = code => new TypeError(`fetch failed ${secretMarker}`, { cause: Object.assign(new Error(secretMarker), { code }) });
try {
  Object.assign(process.env, {
    CAIRN_CONFIGURATION_PUBLICATION_ENABLED: 'true',
    CAIRN_SESSION_SIGNING_SECRET: 'offline-session-secret',
    CAIRN_BROKER_TO_DISPATCHER_SECRET: 'offline-broker-secret',
    CAIRN_CONTROL_API_BASE: 'https://dispatcher.example.test',
    CAIRN_GITHUB_OAUTH_REDIRECT_URI: 'https://application.example.test/api/auth/github/callback',
  });
  console.error = value => logs.push(value);

  for (const operation of ['prepare', 'preflight', 'confirm', 'status']) {
    const res = await call(input(operation), async () => { throw transportError('ECONNRESET'); });
    const log = checkFailure(res, 502, 'configuration-publication-upstream-unavailable', 'request');
    assert.equal(log.operation, operation); assert.equal(log.requestId, requestId);
    assert.equal(log.jobId, operation === 'prepare' ? undefined : jobId);
    assert.deepEqual(log.causeCodes, ['ECONNRESET']); assert.equal(log.errorName, 'TypeError');
    assert.equal(fetchCalls, 1, 'never automatically retry a publication operation');
  }
  for (const code of ['UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_HEADERS_TIMEOUT', 'UND_ERR_BODY_TIMEOUT', 'ETIMEDOUT']) {
    const res = await call(input('confirm'), async () => { throw transportError(code); });
    const log = checkFailure(res, 504, 'configuration-publication-upstream-timeout', 'request');
    assert.deepEqual(log.causeCodes, [code]); assert.equal(fetchCalls, 1);
  }
  for (const code of ['ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED', 'ERR_TLS_CERT_ALTNAME_INVALID']) {
    const res = await call(input('status'), async () => { throw transportError(code); });
    const log = checkFailure(res, 502, 'configuration-publication-upstream-unavailable', 'request');
    assert.deepEqual(log.causeCodes, [code]);
  }
  const aggregate = new TypeError(secretMarker, { cause: new AggregateError([
    Object.assign(new Error(secretMarker), { code: 'ECONNREFUSED' }),
    Object.assign(new Error(secretMarker), { code: 'ETIMEDOUT' }),
  ], secretMarker) });
  let res = await call(input('confirm'), async () => { throw aggregate; });
  let log = checkFailure(res, 504, 'configuration-publication-upstream-timeout', 'request');
  assert.deepEqual(log.causeCodes, ['ECONNREFUSED', 'ETIMEDOUT']);

  res = await call(input('status'), async () => { throw new DOMException(secretMarker, 'TimeoutError'); });
  checkFailure(res, 504, 'configuration-publication-upstream-timeout', 'request');

  const unknown = Object.assign(new Error(secretMarker), { name: secretMarker, code: secretMarker });
  unknown.cause = unknown;
  res = await call(input('status'), async () => { throw unknown; });
  log = checkFailure(res, 502, 'configuration-publication-upstream-unavailable', 'request');
  assert.deepEqual(log.causeCodes, []); assert.deepEqual(log.causeNames, ['Error']);

  res = await call(input('status'), async () => ({ status: 200, json: async () => { throw new SyntaxError(secretMarker); } }));
  log = checkFailure(res, 502, 'configuration-publication-upstream-invalid-response', 'response');
  assert.equal(log.upstreamStatus, 200); assert.equal(fetchCalls, 1);
  res = await call(input('status'), async () => ({ status: 200, json: async () => { throw transportError('UND_ERR_BODY_TIMEOUT'); } }));
  checkFailure(res, 504, 'configuration-publication-upstream-timeout', 'response');

  const noFetch = async () => { assert.fail('invalid requests must not be forwarded'); };
  res = await call(`{broken:${secretMarker}`, noFetch);
  checkFailure(res, 400, 'invalid-configuration-json', 'validation'); assert.equal(fetchCalls, 0);
  res = await call({ operation: secretMarker, requestId: secretMarker, jobId: secretMarker }, noFetch);
  log = checkFailure(res, 400, 'invalid-configuration-operation', 'validation');
  assert.equal(log.operation, undefined); assert.equal(log.requestId, undefined); assert.equal(log.jobId, undefined);
  for (const change of [{ requestId: secretMarker }, { jobId: '../'+secretMarker }, { receipt: undefined }]) {
    res = await call({ ...input('confirm'), ...change }, noFetch);
    assert.equal(res.statusCode, 400); assert.equal(fetchCalls, 0); checks++;
  }
  res = await call({ ...input('prepare'), snapshotSha256: 'e'.repeat(64) }, noFetch);
  checkFailure(res, 400, 'configuration-snapshot-mismatch', 'validation'); assert.equal(fetchCalls, 0);

  delete process.env.CAIRN_CONTROL_API_BASE;
  res = await call(input('status'), noFetch);
  checkFailure(res, 503, 'configuration-publisher-not-configured', 'configuration'); assert.equal(fetchCalls, 0);
  process.env.CAIRN_CONTROL_API_BASE = 'https://dispatcher.example.test';
  const unexpected = publicationFailure(new Error(secretMarker), randomUUID());
  assert.equal(unexpected.status, 500); assert(!JSON.stringify(unexpected).includes(secretMarker)); checks++;

  // Valid Dispatcher responses keep their original status and payload, including conflicts.
  for (const status of [200, 403, 409, 500]) {
    const payload = status === 200 ? { jobId, state: 'validated', receipt: 'existing-receipt' } : { error: 'upstream-rejection' };
    res = await call(input('status'), async (url, options) => {
      assert.equal(url, 'https://dispatcher.example.test/v1/review-intents');
      assert.equal(JSON.parse(options.body).request.operation, 'status');
      return { status, json: async () => payload };
    });
    assert.equal(res.statusCode, status); assert.deepEqual(res.body, payload);
    assert.equal(fetchCalls, 1); assert.equal(logs.length, 0); checks++;
  }
  assert.equal(publicationFailure(new ConfigurationPublicationForwardError(new DOMException('', 'AbortError'), 'request'), randomUUID()).status, 502);
  checks++;
} finally {
  globalThis.fetch = originalFetch; console.error = originalLog;
  for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
  Object.assign(process.env, originalEnv);
}
console.log(`configuration-publication-transport: ${checks} offline checks passed (timeouts, network errors, response parsing, redaction, correlation, validation guards, upstream passthrough, and no automatic retries)`);
