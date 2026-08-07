import type { RuleWorldDataset } from './sourceTypes';

const RULE_CACHE_PREFIX = 'ria-rule-cache-v2:';
const RULE_META_PREFIX = 'ria-rule-meta-v2:';
const LEGACY_RULE_CACHE_PREFIX = 'ria-rule-cache-';
const LEGACY_RULE_META_PREFIX = 'ria-rule-meta-';
const SCHEMA_VERSION = '2.0.0';

export type RuleCacheScope = {
  sourceId: string;
  releaseId: string;
  worldId: string;
  readerSchemaVersion: string;
};

export type RuleCacheMeta = RuleCacheScope & {
  cachedAt: number;
  schemaVersion: string;
};

function normalized(value: string): string {
  return String(value ?? '').trim();
}

function scopePart(scope: RuleCacheScope): string {
  return [scope.sourceId, scope.releaseId, scope.worldId, scope.readerSchemaVersion]
    .map((value) => encodeURIComponent(normalized(value)))
    .join(':');
}

function cacheKey(scope: RuleCacheScope): string {
  return `${RULE_CACHE_PREFIX}${scopePart(scope)}`;
}

function metaKey(scope: RuleCacheScope): string {
  return `${RULE_META_PREFIX}${scopePart(scope)}`;
}

function isScope(value: RuleCacheScope | string): value is RuleCacheScope {
  return typeof value !== 'string';
}

function parseMeta(raw: string | null): RuleCacheMeta | null {
  if (!raw) return null;
  try {
    const meta = JSON.parse(raw) as RuleCacheMeta;
    if (meta.schemaVersion !== SCHEMA_VERSION) return null;
    if (!normalized(meta.sourceId) || !normalized(meta.releaseId) || !normalized(meta.worldId) || !normalized(meta.readerSchemaVersion)) return null;
    if (!Number.isFinite(meta.cachedAt)) return null;
    return meta;
  } catch {
    return null;
  }
}

function readLatestMetaForWorld(worldId: string): RuleCacheMeta | null {
  const normalizedWorld = normalized(worldId);
  let latest: RuleCacheMeta | null = null;
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key || !key.startsWith(RULE_META_PREFIX)) continue;
      const meta = parseMeta(localStorage.getItem(key));
      if (!meta || meta.worldId !== normalizedWorld) continue;
      if (!latest || meta.cachedAt > latest.cachedAt) latest = meta;
    }
  } catch {
    return null;
  }
  return latest;
}

export function readRuleWorldCache(scopeOrWorld: RuleCacheScope | string): RuleWorldDataset | null {
  const scope = isScope(scopeOrWorld)
    ? scopeOrWorld
    : readLatestMetaForWorld(scopeOrWorld);
  if (!scope) return null;
  try {
    const raw = localStorage.getItem(cacheKey(scope));
    if (!raw) return null;
    const dataset = JSON.parse(raw) as RuleWorldDataset;
    if (dataset.worldId !== scope.worldId || String(dataset.mergeVersion) !== String(scope.releaseId)) return null;
    if (dataset.sourceId !== scope.sourceId || dataset.readerSchemaVersion !== scope.readerSchemaVersion) return null;
    return dataset;
  } catch {
    return null;
  }
}

export function readRuleWorldMeta(scopeOrWorld: RuleCacheScope | string): RuleCacheMeta | null {
  if (!isScope(scopeOrWorld)) return readLatestMetaForWorld(scopeOrWorld);
  try {
    return parseMeta(localStorage.getItem(metaKey(scopeOrWorld)));
  } catch {
    return null;
  }
}

export function writeRuleWorldCache(scope: RuleCacheScope, dataset: RuleWorldDataset): void {
  const normalizedScope: RuleCacheScope = {
    sourceId: normalized(scope.sourceId),
    releaseId: normalized(scope.releaseId),
    worldId: normalized(scope.worldId),
    readerSchemaVersion: normalized(scope.readerSchemaVersion),
  };
  const normalizedDataset: RuleWorldDataset = {
    ...dataset,
    worldId: normalizedScope.worldId,
    mergeVersion: normalizedScope.releaseId,
    releaseId: normalizedScope.releaseId,
    sourceId: normalizedScope.sourceId,
    readerSchemaVersion: normalizedScope.readerSchemaVersion,
  };
  localStorage.setItem(cacheKey(normalizedScope), JSON.stringify(normalizedDataset));
  localStorage.setItem(metaKey(normalizedScope), JSON.stringify({
    ...normalizedScope,
    cachedAt: Date.now(),
    schemaVersion: SCHEMA_VERSION,
  } satisfies RuleCacheMeta));
}

export function isRuleWorldCacheValid(scope: RuleCacheScope): boolean {
  const cache = readRuleWorldCache(scope);
  const meta = readRuleWorldMeta(scope);
  if (!cache || !meta) return false;
  return meta.worldId === scope.worldId
    && meta.releaseId === scope.releaseId
    && meta.sourceId === scope.sourceId
    && meta.readerSchemaVersion === scope.readerSchemaVersion;
}

export function removeRuleWorldCache(scopeOrWorld: RuleCacheScope | string): void {
  try {
    if (isScope(scopeOrWorld)) {
      localStorage.removeItem(cacheKey(scopeOrWorld));
      localStorage.removeItem(metaKey(scopeOrWorld));
      return;
    }
    const worldId = normalized(scopeOrWorld);
    const scopes: RuleCacheScope[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key || !key.startsWith(RULE_META_PREFIX)) continue;
      const meta = parseMeta(localStorage.getItem(key));
      if (meta?.worldId === worldId) scopes.push(meta);
    }
    for (const scope of scopes) {
      localStorage.removeItem(cacheKey(scope));
      localStorage.removeItem(metaKey(scope));
    }
  } catch {
    // Cache removal is best effort; stale cache is never trusted without its full scope.
  }
}

export function clearAllRuleWorldCaches(): void {
  try {
    const keys: string[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key) continue;
      if (key.startsWith(RULE_CACHE_PREFIX)
        || key.startsWith(RULE_META_PREFIX)
        || key.startsWith(LEGACY_RULE_CACHE_PREFIX)
        || key.startsWith(LEGACY_RULE_META_PREFIX)) {
        keys.push(key);
      }
    }
    for (const key of keys) localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function getRuleWorldFeatureCount(worldId: string): number | null {
  const cache = readRuleWorldCache(worldId);
  const features = cache?.features;
  return Array.isArray(features) ? features.length : null;
}

export function calculateRuleCacheSize(): number {
  let size = 0;
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key) continue;
      if (!key.startsWith(RULE_CACHE_PREFIX) && !key.startsWith(RULE_META_PREFIX)
        && !key.startsWith(LEGACY_RULE_CACHE_PREFIX) && !key.startsWith(LEGACY_RULE_META_PREFIX)) continue;
      const value = localStorage.getItem(key);
      if (!value) continue;
      size += key.length + value.length;
    }
  } catch {
    return 0;
  }
  return size * 2;
}
