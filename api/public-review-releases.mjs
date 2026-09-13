import { signDispatcherRequest } from './review-relay-transfer.mjs';

function runtimeConfig(environment = process.env) {
  return {
    base: environment.CAIRN_CONTROL_API_BASE,
    dispatcherSecret: environment.CAIRN_BROKER_TO_DISPATCHER_SECRET,
  };
}

function text(value, code) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(code);
  return value.trim();
}

function releaseId(value) {
  const parsed = text(value, 'invalid-public-review-release-id');
  if (!/^[a-z0-9][a-z0-9-]{2,80}$/.test(parsed)) throw new Error('invalid-public-review-release-id');
  return parsed;
}

async function dispatch(body, environment = process.env, fetcher = fetch) {
  const runtime = runtimeConfig(environment);
  if (!runtime.base || !runtime.dispatcherSecret) throw new Error('public-release-broker-not-configured');
  const signed = signDispatcherRequest(body, runtime.dispatcherSecret);
  const response = await fetcher(`${runtime.base.replace(/\/$/, '')}/v1/review-intents`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-cairn-timestamp': signed.timestamp, 'x-cairn-signature': signed.signature },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  return { status: response.status, payload };
}

/**
 * Login-free release history.  This route is deliberately limited to the
 * immutable public release projection; it cannot list active submissions,
 * modify a lamp, or expose a raw COS path.
 */
export default async function handler(req, res) {
  try {
    let body;
    if (req.method === 'GET') {
      const id = typeof req.query?.releaseId === 'string' ? req.query.releaseId : null;
      body = id
        ? { operation: 'public-release-detail', releaseId: releaseId(id) }
        : { operation: 'public-release-feed', limit: Math.min(50, Math.max(1, Number(req.query?.limit) || 20)) };
    } else if (req.method === 'POST') {
      if (req.body?.operation !== 'package-download') throw new Error('invalid-public-review-release-operation');
      body = {
        operation: 'public-release-package-download-request',
        releaseId: releaseId(req.body.releaseId),
        submissionId: text(req.body.submissionId, 'invalid-public-review-release-download'),
        revisionId: text(req.body.revisionId, 'invalid-public-review-release-download'),
      };
    } else return res.status(405).json({ error: 'method-not-allowed' });
    const result = await dispatch(body);
    res.setHeader('Cache-Control', req.method === 'GET' ? 'public, max-age=30, stale-while-revalidate=60' : 'no-store');
    return res.status(result.status).json(result.payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'public-review-release-failed';
    return res.status(message.startsWith('invalid-') ? 400 : message === 'public-release-broker-not-configured' ? 503 : 502).json({ error: message });
  }
}
