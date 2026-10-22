import { readFormalIdentity, verifyFormalConfiguration } from '../configRuntime/formalConfiguration';
import { stableConfigText } from '../configRuntime/configurationFingerprint';
import type { ConfigPackageV3 } from './types';

/** Resolve the Web deployment afresh, without activating the map or querying SCF.
 * Never substitute the historical seed or an older cached pointer on failure. */
export async function fetchFormalDefaultConfig(): Promise<ConfigPackageV3> {
  const identity = await readFormalIdentity(AbortSignal.timeout(30000));
  const response = await fetch(identity.configUrl, { cache: 'force-cache', signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw Error(`正式配置读取失败（${response.status}）。`);
  const { config } = await verifyFormalConfiguration(identity, new Uint8Array(await response.arrayBuffer()));
  const current = await readFormalIdentity(AbortSignal.timeout(30000));
  if (stableConfigText(current) !== stableConfigText(identity)) throw Error('读取期间正式配置已更新，请重试；本地配置保持原状。');
  return config;
}
