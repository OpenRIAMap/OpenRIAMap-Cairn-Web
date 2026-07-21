import assert from 'node:assert/strict';
import { sessionCookie } from '../../api/_reviewAuth.mjs';
import handler from '../../api/review-workflow.mjs';

const previous = {
  enabled: process.env.CAIRN_REVIEW_AUTOMATION_ENABLED,
  base: process.env.CAIRN_CONTROL_API_BASE,
  session: process.env.CAIRN_SESSION_SIGNING_SECRET,
  dispatcher: process.env.CAIRN_BROKER_TO_DISPATCHER_SECRET,
};
process.env.CAIRN_REVIEW_AUTOMATION_ENABLED = 'true';
process.env.CAIRN_CONTROL_API_BASE = 'https://dispatcher.example';
process.env.CAIRN_SESSION_SIGNING_SECRET = 'session-test-secret';
process.env.CAIRN_BROKER_TO_DISPATCHER_SECRET = 'dispatcher-test-secret';
const originalFetch = globalThis.fetch;
let forwarded = null;
globalThis.fetch = async (_url, init) => { forwarded = JSON.parse(init.body); return { status: 200, json: async () => ({ accepted: true }) }; };
const response = {
  statusCode: null,
  payload: null,
  status(value) { this.statusCode = value; return this; },
  json(value) { this.payload = value; return this; },
};
try {
  await handler({
    method: 'POST',
    headers: { cookie: sessionCookie('alice', process.env.CAIRN_SESSION_SIGNING_SECRET) },
    body: {
      operation: 'dispatch',
      actor: { principalId: 'attacker' },
      request: { requestId: 'r1', idempotencyKey: 'p1:submit:1', packageId: 'p1', intent: 'precheck' },
    },
  }, response);
  assert.equal(response.statusCode, 200);
  assert.equal(forwarded.actor.principalId, 'alice');
  assert.equal(forwarded.request.actor.principalId, 'alice');
  console.log('Review workflow Broker actor override: PASS');
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(previous)) {
    const environmentKey = key === 'enabled' ? 'CAIRN_REVIEW_AUTOMATION_ENABLED' : key === 'base' ? 'CAIRN_CONTROL_API_BASE' : key === 'session' ? 'CAIRN_SESSION_SIGNING_SECRET' : 'CAIRN_BROKER_TO_DISPATCHER_SECRET';
    if (value === undefined) delete process.env[environmentKey]; else process.env[environmentKey] = value;
  }
}
