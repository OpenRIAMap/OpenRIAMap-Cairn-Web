import {setRuntimeConfiguration} from './runtimeDataView';
import type { ConfigPackageV3 } from '../configStudio/types';
import { validateConfigPackage, compileConfigRuntime } from '../configStudio/runtime';
import { applyApplicationSettings } from '../core/project/applicationRuntime';
import seed from '../configStudio/defaults/manifest.json';
import {stableConfigText} from './configurationFingerprint';

export type ConfigurationIdentity = {
  releaseId: string; packageId: string; projectId: string; revision: number;
  contractRevision: number; configSha256: string; manifestSha256: string; configUrl: string;
};
export type FormalConfiguration = { config: ConfigPackageV3; identity: ConfigurationIdentity; warning?: string };
export const CONFIGURATION_RULES_VERSION = 'cairnmap-r11-production-1';
let snapshot: FormalConfiguration | undefined, pending: Promise<FormalConfiguration> | undefined;
const subscribers = new Set<() => void>();
export const subscribeFormalConfiguration = (listener: () => void) => { subscribers.add(listener); return () => { subscribers.delete(listener); }; };
export const getFormalConfiguration = () => snapshot;
export async function sha256Bytes(value: BufferSource): Promise<string> {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', value))].map(byte => byte.toString(16).padStart(2, '0')).join('');
}
export function assertConfigurationIdentity(value: unknown): asserts value is ConfigurationIdentity {
  const v = value as ConfigurationIdentity;
  if (!v || !v.releaseId || !v.packageId || !v.projectId || !Number.isSafeInteger(v.revision) || v.revision < 1 || v.contractRevision !== 11 ||
    !/^[a-f0-9]{64}$/.test(v.configSha256) || !/^[a-f0-9]{64}$/.test(v.manifestSha256) || typeof v.configUrl !== 'string') throw Error('正式配置索引身份无效。');
  const url = new URL(v.configUrl, location.origin);
  if (url.origin !== location.origin || url.pathname!==`/configuration/releases/${v.configSha256}/config.json` || url.search || url.hash) throw Error('正式配置必须使用站内受控的内容散列地址。');
}
export async function verifyFormalConfiguration(identity: ConfigurationIdentity, bytes: Uint8Array): Promise<FormalConfiguration> {
  assertConfigurationIdentity(identity);
  if (await sha256Bytes(bytes as BufferSource) !== identity.configSha256) throw Error('正式配置字节摘要不符，已阻止启用。');
  const config = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as ConfigPackageV3;
  if (config.packageId !== identity.packageId || config.projectId !== identity.projectId || config.revision !== identity.revision || config.contractRevision !== identity.contractRevision) throw Error('正式配置与发布身份不一致。');
  const report = validateConfigPackage(config);
  if (!report.valid) throw Error('正式配置核验未通过：' + report.issues.filter(issue => issue.severity === 'error').slice(0, 4).map(issue => issue.message).join('；'));
  return { identity, config: compileConfigRuntime(config, true) };
}
export async function readFormalIdentity(): Promise<ConfigurationIdentity> {
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const response = await fetch(local ? '/configuration/current.json' : '/api/configuration', { cache: 'no-store' });
  if (!response.ok) throw Error(`正式配置索引读取失败（${response.status}）。`);
  const value = await response.json(); assertConfigurationIdentity(value); return value;
}
export function loadFormalConfiguration(): Promise<FormalConfiguration> {
  return pending ??= (async () => {
    let value: FormalConfiguration;
    try {
      const identity = await readFormalIdentity();
      const response = await fetch(identity.configUrl, { cache: 'force-cache' });
      if (!response.ok) throw Error(`正式配置读取失败（${response.status}）。`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      value = await verifyFormalConfiguration(identity, bytes);
      try { localStorage.setItem('cairnmap-formal-trusted-v1', JSON.stringify({ identity, raw: new TextDecoder('utf-8', {fatal:true}).decode(bytes) })); } catch { /* cache is optional */ }
    } catch (error) {
      // Only the byte-frozen registered seed is an offline bootstrap. Never use
      // Studio's active choice, nor an unverified candidate mirror.
      const cached = localStorage.getItem('cairnmap-formal-trusted-v1');
      if (!cached) throw error;
      const stored = JSON.parse(cached) as { identity: ConfigurationIdentity; raw: string };
      // Compiled JSON may differ in formatting. Store/reload original bytes below.
      value = await verifyFormalConfiguration(stored.identity, new TextEncoder().encode(stored.raw));
      value.warning = `当前使用已核实的正式缓存：${String(error)}`;
    }
    snapshot = value; setRuntimeConfiguration(value.config); applyApplicationSettings(value.config.application);
    for (const listener of subscribers) listener();
    return value;
  })();
}
export async function checkForFormalUpdate(): Promise<ConfigurationIdentity | undefined> {
  const identity = await readFormalIdentity();
  return snapshot && stableConfigText(identity) !== stableConfigText(snapshot.identity) ? identity : undefined;
}
export const seedConfigSha256 = seed.sha256;
