import crypto from 'node:crypto';
import { requireReviewAutomation } from './_reviewAutomation.mjs';

const intents = new Set(['submit', 'precheck', 'approve', 'reject', 'request-changes', 'archive', 'status-refresh', 'report-refresh']);

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

function config() {
  return {
    base: process.env.CAIRN_CONTROL_API_BASE,
    sessionSecret: process.env.CAIRN_SESSION_SIGNING_SECRET,
    dispatcherSecret: process.env.CAIRN_BROKER_TO_DISPATCHER_SECRET,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method-not-allowed' });
  if (!requireReviewAutomation(res)) return;
  const runtime = config();
  if (!runtime.base || !runtime.sessionSecret || !runtime.dispatcherSecret) return res.status(503).json({ error: 'workflow-broker-not-configured' });
  const session = verifySession(parseCookies(req.headers.cookie).cairn_review_session, runtime.sessionSecret);
  if (!session) return res.status(401).json({ error: 'authentication-required' });
  const operation = req.body?.operation;
  const request = req.body?.request;
  const intent = operation === 'dispatch' ? request?.intent : operation === 'status' ? 'status-refresh' : operation === 'report' ? 'report-refresh' : null;
  if (!intent || !intents.has(intent)) return res.status(400).json({ error: 'invalid-intent' });
  if (operation === 'dispatch' && (!request?.requestId || !request?.idempotencyKey || !request?.packageId)) return res.status(400).json({ error: 'invalid-workflow-request' });
  // Role membership is intentionally resolved by the SCF dispatcher with the GitHub App.
  // Browser-provided roles and Vercel environment username lists are never authority.
  const actor = { principalId: session.login };
  const body = operation === 'dispatch' ? { ...req.body, actor, request: { ...request, actor } } : { ...req.body, actor };
  const signed = signDispatcherRequest(body, runtime.dispatcherSecret);
  const response = await fetch(`${runtime.base.replace(/\/$/, '')}/v1/review-intents`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-cairn-timestamp': signed.timestamp, 'x-cairn-signature': signed.signature }, body: JSON.stringify(body) });
  const payload = await response.json();
  return res.status(response.status).json(payload);
}
