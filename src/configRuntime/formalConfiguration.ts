import {setRuntimeConfiguration} from './runtimeDataView';
import type { ConfigPackageV3 } from '../configStudio/types';
import { compileConfigRuntime } from '../configStudio/runtime';
import { applyApplicationSettings } from '../core/project/applicationRuntime';
import seed from '../configStudio/defaults/manifest.json';
import {stableConfigText} from './configurationFingerprint';
import { readFormalCache, writeFormalCache, type ValidationReceipt } from './formalCache';
import { decodeVerifiedConfiguration, receiptFor, receiptMatches } from './configurationVerification';
export { sha256Bytes } from './configurationVerification';

export type ConfigurationIdentity = {
  releaseId: string; packageId: string; projectId: string; revision: number;
  contractRevision: number; configSha256: string; manifestSha256: string; configUrl: string;
};
export type FormalConfiguration = { config: ConfigPackageV3; identity: ConfigurationIdentity; warning?: string; availableIdentity?: ConfigurationIdentity };
export const CONFIGURATION_RULES_VERSION = 'cairnmap-r13-production-1';
let snapshot: FormalConfiguration | undefined, pending: Promise<FormalConfiguration> | undefined;
const subscribers = new Set<() => void>();
export const subscribeFormalConfiguration = (listener: () => void) => { subscribers.add(listener); return () => { subscribers.delete(listener); }; };
export const getFormalConfiguration = () => snapshot;
const notify = () => { for (const listener of subscribers) listener(); };
export function assertConfigurationIdentity(value: unknown): asserts value is ConfigurationIdentity {
  const v = value as ConfigurationIdentity;
  if (!v || !v.releaseId || !v.packageId || !v.projectId || !Number.isSafeInteger(v.revision) || v.revision < 1 || ![11,12,13].includes(v.contractRevision) ||
    !/^[a-f0-9]{64}$/.test(v.configSha256) || !/^[a-f0-9]{64}$/.test(v.manifestSha256) || typeof v.configUrl !== 'string') throw Error('正式配置索引身份无效。');
  const url = new URL(v.configUrl, location.origin);
  if (url.origin !== location.origin || url.pathname!==`/configuration/releases/${v.configSha256}/config.json` || url.search || url.hash) throw Error('正式配置必须使用站内受控的内容散列地址。');
}
async function decode(identity: ConfigurationIdentity, bytes: Uint8Array, receipt?: ValidationReceipt): Promise<ConfigPackageV3> {
  if (receiptMatches(identity, receipt) || typeof Worker === 'undefined') return decodeVerifiedConfiguration(identity, bytes, receipt);
  // First-time full validation runs off the UI thread; indexes are rebuilt locally.
  return new Promise((resolve, reject) => {
    let worker: Worker;
    try { worker = new Worker(new URL('./configurationWorker.ts', import.meta.url), { type: 'module' }); }
    catch { void decodeVerifiedConfiguration(identity, bytes, receipt).then(resolve, reject); return; }
    const timer = setTimeout(() => { worker.terminate(); reject(Error('正式配置核验超时，请重试。')); }, 30000);
    worker.onmessage = event => { clearTimeout(timer); worker.terminate(); event.data.error ? reject(Error(event.data.error)) : resolve(event.data.config); };
    worker.onerror = () => { clearTimeout(timer); worker.terminate(); void decodeVerifiedConfiguration(identity, bytes, receipt).then(resolve, reject); };
    worker.postMessage({ identity, bytes, receipt });
  });
}
export async function verifyFormalConfiguration(identity: ConfigurationIdentity, bytes: Uint8Array, receipt?: ValidationReceipt): Promise<FormalConfiguration> {
  assertConfigurationIdentity(identity);
  const config = await decode(identity, bytes, receipt);
  performance.mark('cairn:formal-verified',{detail:{reused:receiptMatches(identity,receipt),contractRevision:identity.contractRevision}});
  return { identity, config: compileConfigRuntime(config, true) };
}
/** Public deployment metadata only. No SCF call, regardless of hostname. */
export async function readFormalIdentity(): Promise<ConfigurationIdentity> {
  const response = await fetch('/configuration/current.json', { cache: 'no-cache' });
  if (!response.ok) throw Error(`正式配置静态索引读取失败（${response.status}）。`);
  const value = await response.json(); assertConfigurationIdentity(value); return value;
}
async function fetchVersion(identity: ConfigurationIdentity): Promise<{ value: FormalConfiguration; bytes: Uint8Array }> {
  const response = await fetch(identity.configUrl, { cache: 'force-cache' });
  if (!response.ok) throw Error(`正式配置读取失败（${response.status}）。`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  return { value: await verifyFormalConfiguration(identity, bytes), bytes };
}
async function persist(identity: ConfigurationIdentity, bytes: Uint8Array) {
  try {
    await writeFormalCache({ identity, bytes, receipt: receiptFor(identity), savedAt: new Date().toISOString() });
    try { localStorage.removeItem('cairnmap-formal-trusted-v1'); } catch { /* unrelated storage remains untouched */ }
  } catch { /* Optional cache: never block the map or alter an editing draft. */ }
}
async function cachedVersion(): Promise<FormalConfiguration | undefined> {
  try {
    const cached = await readFormalCache();
    if (cached) {
      const value = await verifyFormalConfiguration(cached.identity, cached.bytes, cached.receipt);
      if (!receiptMatches(cached.identity, cached.receipt)) void persist(cached.identity, cached.bytes);
      return value;
    }
  } catch { /* An invalid/corrupt cache must not prevent a clean Web fetch. */ }
  try {
    const legacy = localStorage.getItem('cairnmap-formal-trusted-v1');
    if (legacy) {
      const stored = JSON.parse(legacy) as { identity: ConfigurationIdentity; raw: string };
      const bytes = new TextEncoder().encode(stored.raw), value = await verifyFormalConfiguration(stored.identity, bytes);
      void persist(stored.identity, bytes);
      return value;
    }
  } catch { /* Not a cache that can be activated. */ }
  return undefined;
}
function activate(value: FormalConfiguration): FormalConfiguration {
  snapshot = value; setRuntimeConfiguration(value.config); applyApplicationSettings(value.config.application); performance.mark('cairn:formal-ready',{detail:{configSha256:value.identity.configSha256,revision:value.identity.revision,contractRevision:value.identity.contractRevision}}); notify(); return value;
}
export function loadFormalConfiguration(): Promise<FormalConfiguration> {
  return pending ??= (async () => {
    performance.mark('cairn:formal-start');
    // Attach the error handler immediately while the independent cache read runs.
    const remote = readFormalIdentity().then(identity => ({ identity, error: undefined }), error => ({ identity: undefined, error }));
    const refresh = new URL(location.href).searchParams.has('refreshConfiguration');
    const cached = refresh ? undefined : await cachedVersion();
    if (cached) {
      const value = activate(cached);
      void remote.then(async result => {
        if (result.error || !result.identity) {
          if (snapshot?.identity.configSha256 === value.identity.configSha256) { snapshot = { ...value, warning: '当前使用已核验正式缓存，Web 静态版本暂未确认；可继续浏览。' }; notify(); }
          return;
        }
        if (stableConfigText(result.identity) === stableConfigText(value.identity)) return;
        try {
          const next = await fetchVersion(result.identity); await persist(result.identity, next.bytes);
          // Never hot-swap an active editing/survey session. Refresh is explicit.
          if (snapshot?.identity.configSha256 === value.identity.configSha256) { snapshot = { ...value, availableIdentity: result.identity, warning: '新的 Web 正式配置已就绪；完成当前操作后刷新以更新。' }; notify(); }
        } catch (error) { if (snapshot) { snapshot = { ...snapshot, warning: '当前继续使用已核验缓存：' + String(error) }; notify(); } }
      });
      return value;
    }
    const result = await remote; if (!result.identity) throw result.error;
    const next = await fetchVersion(result.identity); const value = activate(next.value); void persist(result.identity, next.bytes);
    if (refresh && typeof history !== 'undefined') { const url = new URL(location.href); url.searchParams.delete('refreshConfiguration'); history.replaceState(history.state, '', url); }
    return value;
  })();
}
/** Explicit callers only; host has no focus listener or periodic identity probe. */
export async function checkForFormalUpdate(): Promise<ConfigurationIdentity | undefined> {
  const identity = await readFormalIdentity();
  return snapshot && stableConfigText(identity) !== stableConfigText(snapshot.identity) ? identity : undefined;
}
export const seedConfigSha256 = seed.sha256;
