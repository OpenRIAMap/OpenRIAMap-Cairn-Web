import assert from 'node:assert/strict';
import fs from 'node:fs';
import { decodeVerifiedConfiguration, receiptFor } from '../../src/configRuntime/configurationVerification';
import { readFormalIdentity, type ConfigurationIdentity } from '../../src/configRuntime/formalConfiguration';
import { configPreflightStats } from '../../src/configStudio/runtime';

const identity = JSON.parse(fs.readFileSync('public/configuration/current.json', 'utf8')) as ConfigurationIdentity;
const bytes = new Uint8Array(fs.readFileSync('public' + identity.configUrl));
const first = configPreflightStats().packageValidations;
await decodeVerifiedConfiguration(identity, bytes);
assert.equal(configPreflightStats().packageValidations, first + 1);
await decodeVerifiedConfiguration(identity, bytes, receiptFor(identity));
assert.equal(configPreflightStats().packageValidations, first + 1, 'exact matching receipt skips repeated validation');
await decodeVerifiedConfiguration(identity, bytes, { ...receiptFor(identity), validatorFingerprint: 'stale' });
assert.equal(configPreflightStats().packageValidations, first + 2, 'new validator requires full validation');
await decodeVerifiedConfiguration(identity, bytes, { ...receiptFor(identity), resourceFingerprint: 'stale' });
assert.equal(configPreflightStats().packageValidations, first + 3, 'new resource capability requires full validation');
const corrupted = bytes.slice(); corrupted[0] ^= 1;
await assert.rejects(() => decodeVerifiedConfiguration(identity, corrupted, receiptFor(identity)), /摘要不符/);
await assert.rejects(() => decodeVerifiedConfiguration({ ...identity, revision: identity.revision + 1 }, bytes, receiptFor(identity)), /身份不一致/);
const priorFetch = globalThis.fetch, priorLocation = Object.getOwnPropertyDescriptor(globalThis, 'location');
const requested: string[] = [];
Object.defineProperty(globalThis, 'location', { configurable: true, value: { origin: 'https://cmap.ria9.top', hostname: 'cmap.ria9.top' } });
globalThis.fetch = async (input) => { requested.push(String(input)); return new Response(JSON.stringify(identity), { status: 200, headers: { 'Content-Type': 'application/json' } }); };
try { assert.deepEqual(await readFormalIdentity(), identity); assert.deepEqual(requested, ['/configuration/current.json']); }
finally { globalThis.fetch = priorFetch; if (priorLocation) Object.defineProperty(globalThis, 'location', priorLocation); else Reflect.deleteProperty(globalThis, 'location'); }
console.log('r12 verification: receipts, content integrity, capability changes and production static identity passed.');
