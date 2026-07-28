import { requireReviewAutomation } from './_reviewAutomation.mjs';
import { signDispatcherRequest, verifySession } from './review-relay-transfer.mjs';

const operations = new Set([
  'detail', 'list', 'revision-upload-request', 'revision-upload-complete', 'save',
  'precheck', 'approve', 'reject', 'request-changes', 'reopen', 'save-and-approve',
  'publish', 'publish-precheck', 'publish-confirm', 'status', 'report', 'release-feed', 'release-gate', 'archive',
]);

const versionedOperations = new Set([
  'revision-upload-request', 'revision-upload-complete', 'save', 'precheck', 'approve',
  'reject', 'request-changes', 'reopen', 'save-and-approve', 'publish', 'publish-precheck', 'publish-confirm', 'archive',
]);

function parseCookies(value = '') {
  return Object.fromEntries(value.split(';').map((entry) => entry.trim().split('=').map(decodeURIComponent)).filter(([key, item]) => key && item));
}

function runtimeConfig(environment = process.env) {
  return {
    base: environment.CAIRN_CONTROL_API_BASE,
    sessionSecret: environment.CAIRN_SESSION_SIGNING_SECRET,
    dispatcherSecret: environment.CAIRN_BROKER_TO_DISPATCHER_SECRET,
  };
}

function requireString(value, code) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(code);
  return value;
}

function requireSha256(value, code) {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) throw new Error(code);
  return value;
}

function requireRequest(request, { versioned = false } = {}) {
  if (!request || typeof request !== 'object') throw new Error('invalid-review-control-request');
  for (const field of ['requestId', 'correlationId', 'idempotencyKey', 'submissionId']) requireString(request[field], 'invalid-review-control-request');
  if (versioned) {
    requireString(request.targetRevisionId, 'invalid-review-control-request');
    if (!Number.isSafeInteger(request.expectedStateVersion) || request.expectedStateVersion < 0) throw new Error('invalid-review-control-request');
  }
  return { ...request };
}

/**
 * Browser identity is never accepted from request input. The downstream
 * Dispatcher resolves Team membership and owns the package-state transition.
 */
export function normalizeReviewControlRequest(input, actor) {
  const operation = input?.operation;
  if (!operations.has(operation)) throw new Error('invalid-review-control-operation');
  if (operation === 'detail') return { operation, submissionId: requireString(input.submissionId, 'invalid-review-submission-id'), actor };
  if (operation === 'list') return { operation, limit: input.limit ?? 50, actor };
  if (operation === 'release-feed') return { operation, limit: input.limit ?? 10, actor };
  if (operation === 'release-gate') return { operation, actor };
  if (operation === 'status' || operation === 'report') return { operation, submissionId: requireString(input.submissionId, 'invalid-review-submission-id'), actor };
  if (operation === 'publish-confirm') {
    if (!Number.isSafeInteger(input.expectedGateVersion) || input.expectedGateVersion < 1) throw new Error('invalid-review-release-confirmation');
    return {
      operation,
      request: requireRequest(input.request, { versioned: true }),
      attemptId: requireString(input.attemptId, 'invalid-review-release-confirmation'),
      expectedGateVersion: input.expectedGateVersion,
      precheckReportSha256: requireSha256(input.precheckReportSha256, 'invalid-review-release-confirmation'),
      actor,
    };
  }
  return { operation, request: requireRequest(input.request, { versioned: versionedOperations.has(operation) }), actor };
}

export async function forwardReviewControl({ input, session, environment = process.env, fetcher = fetch }) {
  const runtime = runtimeConfig(environment);
  if (!runtime.base || !runtime.sessionSecret || !runtime.dispatcherSecret) throw new Error('workflow-broker-not-configured');
  const body = normalizeReviewControlRequest(input, { principalId: session.login });
  const signed = signDispatcherRequest(body, runtime.dispatcherSecret);
  const response = await fetcher(`${runtime.base.replace(/\/$/, '')}/v1/review-intents`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-cairn-timestamp': signed.timestamp, 'x-cairn-signature': signed.signature },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  return { status: response.status, payload };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method-not-allowed' });
  if (!requireReviewAutomation(res)) return;
  const runtime = runtimeConfig();
  if (!runtime.base || !runtime.sessionSecret || !runtime.dispatcherSecret) return res.status(503).json({ error: 'workflow-broker-not-configured' });
  const session = verifySession(parseCookies(req.headers.cookie).cairn_review_session, runtime.sessionSecret);
  if (!session) return res.status(401).json({ error: 'authentication-required' });
  try {
    const result = await forwardReviewControl({ input: req.body, session });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(result.status).json(result.payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'review-control-failed';
    const status = message.startsWith('invalid-') ? 400 : message === 'workflow-broker-not-configured' ? 503 : 502;
    return res.status(status).json({ error: message });
  }
}
