import { DATA_TOOL_SCHEMA } from '@/components/Common/buildDataToolSchema';
import type { ProgressCallback } from '@/lib/fetchWithMirror';
import { resolveWorldDirName } from './sourceResolver';
import { getRuleDataSourceSnapshot, type RuleDataSourceSnapshot } from './formalDataSourceRuntime';
import {
  abortActiveFormalDataRequests,
  loadFormalWorldFeatures,
  resolveFormalWorldRelease,
} from './formalReleaseReader';
import { isRuleWorldCacheValid, readRuleWorldCache, writeRuleWorldCache, type RuleCacheScope } from './worldRuleCache';
import type { RuleWorldDataset } from './sourceTypes';

const SPECIAL_CLASS_SET = new Set(DATA_TOOL_SCHEMA.specialClasses);
const activeLegacyRequests = new Set<AbortController>();

function cacheScope(source: RuleDataSourceSnapshot, releaseId: string, worldId: string): RuleCacheScope {
  return {
    sourceId: source.sourceId,
    releaseId: String(releaseId),
    worldId: String(worldId),
    readerSchemaVersion: source.readerSchemaVersion,
  };
}

function legacyDataRoot(source: RuleDataSourceSnapshot): string {
  return `${source.rootUrl.replace(/\/+$/, '')}/Data_Merge`;
}

function legacyCategoryPath(worldId: string, className: string, kind?: string): string {
  const worldDir = resolveWorldDirName(worldId);
  const normalizedClassName = String(className ?? '').trim();
  const normalizedKind = String(kind ?? '').trim();
  return SPECIAL_CLASS_SET.has(normalizedClassName) && normalizedKind
    ? `${worldDir}/${normalizedClassName}/${normalizedKind}`
    : `${worldDir}/${normalizedClassName}`;
}

async function fetchLegacyJson<T>(source: RuleDataSourceSnapshot, relativePath: string, stage: string, onProgress?: ProgressCallback): Promise<T> {
  const controller = new AbortController();
  activeLegacyRequests.add(controller);
  onProgress?.({ stage, status: 'loading' });
  try {
    const response = await fetch(`${legacyDataRoot(source)}/${String(relativePath ?? '').replace(/^\/+/, '')}`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`legacy-data HTTP ${response.status}: ${relativePath}`);
    const data = await response.json() as T;
    onProgress?.({ stage, status: 'success' });
    return data;
  } finally {
    activeLegacyRequests.delete(controller);
  }
}

async function fetchLegacyMergeVersion(worldId: string, source: RuleDataSourceSnapshot, onProgress?: ProgressCallback): Promise<number | string> {
  const worldDir = resolveWorldDirName(worldId);
  const data = await fetchLegacyJson<any>(source, `${worldDir}/INDEX.json`, 'world-version', onProgress);
  return data?.version ?? '0';
}

async function loadLegacyWorldDataset(
  worldId: string,
  source: RuleDataSourceSnapshot,
  onProgress?: ProgressCallback,
): Promise<RuleWorldDataset> {
  const mergeVersion = await fetchLegacyMergeVersion(worldId, source, onProgress);
  const scope = cacheScope(source, String(mergeVersion), worldId);
  onProgress?.({ stage: 'world-cache-check', status: 'loading' });
  if (isRuleWorldCacheValid(scope)) {
    onProgress?.({ stage: 'world-cache-check', status: 'success' });
    const cached = readRuleWorldCache(scope);
    if (cached) return cached;
  } else {
    onProgress?.({ stage: 'world-cache-check', status: 'success', message: 'Cache requires refresh' });
  }

  onProgress?.({ stage: 'world-index-scan', status: 'loading' });
  const targets: Array<{ className: string; kind?: string }> = [];
  for (const className of DATA_TOOL_SCHEMA.featureClasses) {
    if (SPECIAL_CLASS_SET.has(className)) {
      const kinds = DATA_TOOL_SCHEMA.workflowKinds[className] ?? [];
      for (const kind of kinds) targets.push({ className, kind });
    } else {
      targets.push({ className });
    }
  }
  onProgress?.({ stage: 'world-index-scan', status: 'success', message: `Categories: ${targets.length}` });

  onProgress?.({ stage: 'world-chunk-load', status: 'loading' });
  const all: Record<string, unknown>[] = [];
  let loadedChunkCount = 0;
  for (const target of targets) {
    try {
      const categoryPath = legacyCategoryPath(worldId, target.className, target.kind);
      const idx = await fetchLegacyJson<any>(source, `${categoryPath}/INDEX.json`, `merge-${target.className}-index`, onProgress);
      const files = Array.isArray(idx?.chunks) ? idx.chunks.map((chunk: any) => chunk?.file).filter(Boolean) : [];
      for (const file of files) {
        const arr = await fetchLegacyJson<any[]>(source, `${categoryPath}/${String(file)}`, `chunk-${file}`, onProgress);
        if (!Array.isArray(arr)) throw new Error(`legacy-data chunk must be an array: ${file}`);
        for (const item of arr) if (item && typeof item === 'object') all.push(item as Record<string, unknown>);
        loadedChunkCount += 1;
        onProgress?.({ stage: 'world-chunk-load', status: 'loading', message: `Chunks: ${loadedChunkCount}` });
      }
    } catch {
      // A legacy category can be absent for a world. This does not switch the selected source.
    }
  }
  onProgress?.({ stage: 'world-chunk-load', status: 'success', message: `Features: ${all.length}` });

  onProgress?.({ stage: 'world-cache-write', status: 'loading' });
  const dataset: RuleWorldDataset = {
    worldId,
    mergeVersion,
    releaseId: String(mergeVersion),
    sourceId: source.sourceId,
    readerSchemaVersion: source.readerSchemaVersion,
    loadedAt: Date.now(),
    features: all,
  };
  writeRuleWorldCache(scope, dataset);
  onProgress?.({ stage: 'world-cache-write', status: 'success' });
  onProgress?.({ stage: 'world-ready', status: 'success' });
  return dataset;
}

export async function fetchWorldMergeVersion(
  worldId: string,
  onProgress?: ProgressCallback,
  source: RuleDataSourceSnapshot = getRuleDataSourceSnapshot(),
): Promise<number | string> {
  if (source.readerKind === 'formal-release-v2') {
    const release = await resolveFormalWorldRelease({ source, worldId });
    return release.releaseId;
  }
  return fetchLegacyMergeVersion(worldId, source, onProgress);
}

export function abortActiveRuleDatasetRequests(): void {
  abortActiveFormalDataRequests();
  for (const controller of activeLegacyRequests) controller.abort();
  activeLegacyRequests.clear();
}

export async function loadWorldRuleDataset(
  worldId: string,
  onProgress?: ProgressCallback,
  source: RuleDataSourceSnapshot = getRuleDataSourceSnapshot(),
): Promise<RuleWorldDataset> {
  if (source.readerKind !== 'formal-release-v2') {
    return loadLegacyWorldDataset(worldId, source, onProgress);
  }

  const release = await resolveFormalWorldRelease({ source, worldId });
  const scope = cacheScope(source, release.releaseId, release.worldId);
  onProgress?.({ stage: 'world-cache-check', status: 'loading' });
  if (isRuleWorldCacheValid(scope)) {
    onProgress?.({ stage: 'world-cache-check', status: 'success' });
    const cached = readRuleWorldCache(scope);
    if (cached) return cached;
  } else {
    onProgress?.({ stage: 'world-cache-check', status: 'success', message: 'Cache requires refresh' });
  }

  const features = await loadFormalWorldFeatures({ source, release, onProgress });
  onProgress?.({ stage: 'world-cache-write', status: 'loading' });
  const dataset: RuleWorldDataset = {
    worldId: release.worldId,
    mergeVersion: release.releaseId,
    releaseId: release.releaseId,
    sourceId: source.sourceId,
    readerSchemaVersion: source.readerSchemaVersion,
    loadedAt: Date.now(),
    features,
  };
  writeRuleWorldCache(scope, dataset);
  onProgress?.({ stage: 'world-cache-write', status: 'success' });
  onProgress?.({ stage: 'world-ready', status: 'success' });
  return dataset;
}
