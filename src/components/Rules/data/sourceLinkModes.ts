import { subscribeApplication } from '@/core/project/applicationRuntime';
import { getOpenRIAMapSourceLinkModesConfig } from '../../../core/project/openriamapRiaEnvironment';

/**
 * Rules 数据源链接模式注册表。
 *
 * 约定：rawCompatibleBaseUrl 必须提供 GitHub Raw 兼容路径前缀：
 *   {base}/{owner}/{repo}/{branch}/{path}
 * 例如：
 *   https://data.ozk639.top/OpenRIAMap/OpenRIAMap-Data/main/Data_Merge/...
 */
export type SourceLinkModeDef = {
  id: string;
  label: string;
  rawCompatibleBaseUrl: string;
  isDefault?: boolean;
};

let sourceLinkModesConfig = getOpenRIAMapSourceLinkModesConfig();

export let SOURCE_LINK_MODE_STORAGE_KEY = sourceLinkModesConfig.storageKey;

export let SOURCE_LINK_MODE_LEGACY_STORAGE_KEYS = sourceLinkModesConfig.legacyStorageKeys ?? [];

export const RAW_GITHUB_BASE_URL = 'https://raw.githubusercontent.com';

export let SOURCE_LINK_MODE_DEFS: SourceLinkModeDef[] = sourceLinkModesConfig.items.map((item) => ({
  id: item.id,
  label: item.label,
  rawCompatibleBaseUrl: item.rawCompatibleBaseUrl,
  isDefault: item.default,
}));

subscribeApplication(()=>{sourceLinkModesConfig=getOpenRIAMapSourceLinkModesConfig();SOURCE_LINK_MODE_STORAGE_KEY=sourceLinkModesConfig.storageKey;SOURCE_LINK_MODE_LEGACY_STORAGE_KEYS=sourceLinkModesConfig.legacyStorageKeys??[];SOURCE_LINK_MODE_DEFS=sourceLinkModesConfig.items.map(item=>({id:item.id,label:item.label,rawCompatibleBaseUrl:item.rawCompatibleBaseUrl,isDefault:item.default}));});

function trimSlash(value: string): string {
  return String(value ?? '').trim().replace(/\/+$/, '');
}

function getDefaultSourceLinkMode(worldId?: string): SourceLinkModeDef {
  const defs=getSourceLinkModeDefs(worldId);return defs.find((item) => item.isDefault) ?? defs[0];
}

function readStoredSourceLinkModeId(worldId?: string): string {
  const config=getOpenRIAMapSourceLinkModesConfig(worldId);
  try {
    const current = localStorage.getItem(config.storageKey) ?? '';
    if (current) return current;
    for (const key of config.legacyStorageKeys??[]) {
      const legacy = localStorage.getItem(key) ?? '';
      if (legacy) return legacy;
    }
  } catch {
    return '';
  }
  return '';
}

function writeStoredSourceLinkModeId(modeId: string, worldId?: string): void {
  const config=getOpenRIAMapSourceLinkModesConfig(worldId);
  try {
    localStorage.setItem(config.storageKey, modeId);
  } catch {}
}

export function getSourceLinkModeDefs(worldId?: string): SourceLinkModeDef[] {
  if(!worldId)return SOURCE_LINK_MODE_DEFS;
  return getOpenRIAMapSourceLinkModesConfig(worldId).items.map(item=>({id:item.id,label:item.label,rawCompatibleBaseUrl:item.rawCompatibleBaseUrl,isDefault:item.default}));
}

export function getDefaultSourceLinkModeId(worldId?: string): string {
  return getDefaultSourceLinkMode(worldId).id;
}

export function findSourceLinkMode(modeId: string | null | undefined, worldId?: string): SourceLinkModeDef | null {
  const id = String(modeId ?? '').trim();
  if (!id) return null;
  return getSourceLinkModeDefs(worldId).find((item) => item.id === id) ?? null;
}

export function getCurrentSourceLinkMode(worldId?: string): SourceLinkModeDef {
  const stored = readStoredSourceLinkModeId(worldId);
  const found = findSourceLinkMode(stored,worldId);
  if (found) {
    writeStoredSourceLinkModeId(found.id,worldId);
    return found;
  }

  const fallback = getDefaultSourceLinkMode(worldId);
  writeStoredSourceLinkModeId(fallback.id,worldId);
  return fallback;
}

export function getCurrentSourceLinkModeId(worldId?: string): string {
  return getCurrentSourceLinkMode(worldId).id;
}

export function setCurrentSourceLinkMode(modeId: string, worldId?: string): SourceLinkModeDef {
  const found = findSourceLinkMode(modeId,worldId) ?? getDefaultSourceLinkMode(worldId);
  writeStoredSourceLinkModeId(found.id,worldId);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ria:source-link-mode-change', { detail: { modeId: found.id, worldId } }));
  }
  return found;
}

export function buildRawCompatibleUrlFromParts(
  baseUrl: string,
  parts: { owner: string; repo: string; branch: string; path: string },
): string {
  return `${trimSlash(baseUrl)}/${parts.owner}/${parts.repo}/${parts.branch}/${String(parts.path ?? '').replace(/^\/+/, '')}`;
}

export function buildCurrentRawCompatibleUrl(parts: { owner: string; repo: string; branch: string; path: string }): string {
  return buildRawCompatibleUrlFromParts(getCurrentSourceLinkMode().rawCompatibleBaseUrl, parts);
}

export type RawCompatibleUrlParts = {
  owner: string;
  repo: string;
  branch: string;
  path: string;
};

export function parseRawCompatibleUrl(url: string): RawCompatibleUrlParts | null {
  const source = String(url ?? '').trim();
  if (!source) return null;

  const candidates = [
    ...SOURCE_LINK_MODE_DEFS.map((item) => item.rawCompatibleBaseUrl),
    RAW_GITHUB_BASE_URL,
  ].map(trimSlash);

  for (const base of candidates) {
    const prefix = `${base}/`;
    if (!source.startsWith(prefix)) continue;
    const rest = source.slice(prefix.length);
    const parts = rest.split('/');
    if (parts.length < 4) return null;
    const [owner, repo, branch, ...pathParts] = parts;
    const path = pathParts.join('/');
    if (!owner || !repo || !branch || !path) return null;
    return { owner, repo, branch, path };
  }

  return null;
}
