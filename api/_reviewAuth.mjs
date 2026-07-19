import crypto from 'node:crypto';

function encode(value) { return Buffer.from(JSON.stringify(value)).toString('base64url'); }

export function sign(value, secret) {
  const encoded = typeof value === 'string' ? value : encode(value);
  return `${encoded}.${crypto.createHmac('sha256', secret).update(encoded).digest('base64url')}`;
}

export function verify(signed, secret) {
  const [encoded, signature] = (signed ?? '').split('.');
  if (!encoded || !signature || !secret) return null;
  const expected = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  if (Buffer.byteLength(signature) !== Buffer.byteLength(expected) || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try { return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')); } catch { return null; }
}

export function sessionCookie(login, secret) {
  const value = sign({ login, expiresAt: Date.now() + 8 * 60 * 60 * 1000 }, secret);
  return `cairn_review_session=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`;
}
