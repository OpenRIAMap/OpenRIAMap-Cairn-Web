import crypto from 'node:crypto';
import { requireReviewAutomation } from './_reviewAutomation.mjs';

const operations = new Set(['relay-upload-request', 'relay-upload-complete', 'relay-inbox-list', 'status']);

function parseCookies(value = '') {
  return Object.fromEntries(value.split(';').map((entry) => entry.trim().split('=').map(decodeURIComponent)).filter(([key, item]) => key && item));
}

function secureEqual(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function verifySession(cookie, signingSecret) {
  const [encoded, signature] = (cookie ?? '').split('.');
  if (!encoded || !signature || !signingSecret) return null;
  const expected = crypto.createHmac('sha256', signingSecret).update(encoded).digest('base64url');
  if (!secureEqual(signature, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return typeof session.login === 'string' && typeof session.expiresAt === 'number' && session.expiresAt > Date.now() ? session : null;
  } catch { return null; }
}

export function signDispatcherRequest(body, secret, timestamp = new Date().toISOString()) {
  const payload = JSON.stringify(body);
  return { timestamp, signature: crypto.createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('base64url') };
}

function config(environment = process.env) {
  return {
    base: environment.CAIRN_CONTROL_API_BASE,
    sessionSecret: environment.CAIRN_SESSION_SIGNING_SECRET,
    dispatcherSecret: environment.CAIRN_BROKER_TO_DISPATCHER_SECRET,
  };
}

export function normalizeRelayTransferRequest(input, actor) {
  const operation = input?.operation;
  if (!operations.has(operation)) throw new Error('invalid-relay-transfer-operation');
  if (operation === 'relay-upload-request' || operation === 'relay-upload-complete') {
    const request = input.request;
    if (!request?.requestId || !request?.idempotencyKey || !request?.packageId || !Number.isSafeInteger(request?.byteLength) || typeof request?.sha256 !== 'string' || typeof request?.contentMd5 !== 'string') throw new Error('invalid-relay-transfer-request');
    return { operation, request: { ...request }, actor };
  }
  if (operation === 'relay-inbox-list') return { operation, limit: input.limit ?? 50, actor };
  if (typeof input.packageId !== 'string') throw new Error('invalid-relay-package-id');
  return { operation, packageId: input.packageId, actor };
}

export async function forwardRelayTransfer({ input, session, environment = process.env, fetcher = fetch }) {
  const runtime = config(environment);
  if (!runtime.base || !runtime.sessionSecret || !runtime.dispatcherSecret) throw new Error('workflow-broker-not-configured');
  const body = normalizeRelayTransferRequest(input, { principalId: session.login });
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
  const runtime = config();
  if (!runtime.base || !runtime.sessionSecret || !runtime.dispatcherSecret) return res.status(503).json({ error: 'workflow-broker-not-configured' });
  const session = verifySession(parseCookies(req.headers.cookie).cairn_review_session, runtime.sessionSecret);
  if (!session) return res.status(401).json({ error: 'authentication-required' });
  try {
    const result = await forwardRelayTransfer({ input: req.body, session });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(result.status).json(result.payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'relay-transfer-failed';
    const status = message.startsWith('invalid-') ? 400 : message === 'workflow-broker-not-configured' ? 503 : 502;
    return res.status(status).json({ error: message });
  }
}
