import type { ProgressCallback } from '@/lib/fetchWithMirror';
import type { RuleWorldDataset } from './sourceTypes';
import type { RuleDataSourceSnapshot } from './formalDataSourceRuntime';

type JsonRecord = Record<string, unknown>;

export type FormalWorldRelease = {
  releaseId: string;
  formalVersion: number | null;
  worldId: string;
  worldManifest: JsonRecord;
};

export type FormalReleaseFetchJson = <T>(key: string, stage: FormalReleaseReaderError['stage']) => Promise<T>;

const activeRequests = new Set<AbortController>();

export class FormalReleaseReaderError extends Error {
  readonly stage: 'release-set' | 'world-pointer' | 'manifest' | 'chunk-catalog' | 'chunk' | 'unknown';

  constructor(stage: FormalReleaseReaderError['stage'], message: string) {
    super(message);
    this.name = 'FormalReleaseReaderError';
    this.stage = stage;
  }
}

function asRecord(value: unknown, stage: FormalReleaseReaderError['stage'], name: string): JsonRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new FormalReleaseReaderError(stage, `${name} must be an object`);
  }
  return value as JsonRecord;
}

function requiredString(record: JsonRecord, key: string, stage: FormalReleaseReaderError['stage']): string {
  const value = typeof record[key] === 'string' ? record[key].trim() : '';
  if (!value) throw new FormalReleaseReaderError(stage, `${key} is required`);
  return value;
}

function optionalFormalVersion(record: JsonRecord, key: string, stage: FormalReleaseReaderError['stage']): number | null {
  const value = record[key];
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) throw new FormalReleaseReaderError(stage, `${key} must be a positive integer`);
  return value;
}

function safeObjectKey(value: string, stage: FormalReleaseReaderError['stage']): string {
  const key = String(value ?? '').trim().replace(/^\/+/, '');
  if (!key || key.includes('..') || /^[a-z]+:/i.test(key)) {
    throw new FormalReleaseReaderError(stage, 'invalid object key');
  }
  return key;
}

async function fetchFormalJson<T>(source: RuleDataSourceSnapshot, key: string, stage: FormalReleaseReaderError['stage']): Promise<T> {
  const controller = new AbortController();
  activeRequests.add(controller);
  const url = `${source.rootUrl}/${safeObjectKey(key, stage)}`;
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new FormalReleaseReaderError(stage, `HTTP ${response.status} while reading ${key}`);
    return await response.json() as T;
  } catch (error) {
    if (error instanceof FormalReleaseReaderError) throw error;
    const message = error instanceof Error ? error.message : String(error);
    throw new FormalReleaseReaderError(stage, message);
  } finally {
    activeRequests.delete(controller);
  }
}

function sourceFetcher(source: RuleDataSourceSnapshot, fetchJson?: FormalReleaseFetchJson): FormalReleaseFetchJson {
  return fetchJson ?? ((key, stage) => fetchFormalJson(source, key, stage));
}

export function abortActiveFormalDataRequests(): void {
  for (const controller of activeRequests) controller.abort();
  activeRequests.clear();
}

export async function resolveFormalWorldRelease(args: {
  source: RuleDataSourceSnapshot;
  worldId: string;
  fetchJson?: FormalReleaseFetchJson;
}): Promise<FormalWorldRelease> {
  const worldId = String(args.worldId ?? '').trim();
  if (!worldId) throw new FormalReleaseReaderError('world-pointer', 'worldId is required');
  const fetchJson = sourceFetcher(args.source, args.fetchJson);
  const releaseSet = asRecord(await fetchJson<JsonRecord>('current/worlds/_release-set.json', 'release-set'), 'release-set', 'release set');
  if (releaseSet.schemaVersion !== 'openriamap.current-release-set.v2') {
    throw new FormalReleaseReaderError('release-set', 'unsupported release-set schema');
  }
  const releaseId = requiredString(releaseSet, 'releaseId', 'release-set');
  const formalVersion = optionalFormalVersion(releaseSet, 'formalVersion', 'release-set');
  if (!Array.isArray(releaseSet.worlds) || !releaseSet.worlds.includes(worldId)) {
    throw new FormalReleaseReaderError('release-set', `world is not published: ${worldId}`);
  }

  const pointer = asRecord(await fetchJson<JsonRecord>(`current/worlds/${worldId}.json`, 'world-pointer'), 'world-pointer', 'world pointer');
  if (pointer.schemaVersion !== 'openriamap.current-world.v2') {
    throw new FormalReleaseReaderError('world-pointer', 'unsupported world-pointer schema');
  }
  if (requiredString(pointer, 'worldId', 'world-pointer') !== worldId) {
    throw new FormalReleaseReaderError('world-pointer', 'world pointer identity mismatch');
  }
  if (requiredString(pointer, 'releaseId', 'world-pointer') !== releaseId) {
    throw new FormalReleaseReaderError('world-pointer', 'release-set and world-pointer release mismatch');
  }
  if (optionalFormalVersion(pointer, 'formalVersion', 'world-pointer') !== formalVersion) {
    throw new FormalReleaseReaderError('world-pointer', 'release-set and world-pointer formal version mismatch');
  }

  const manifestKey = safeObjectKey(requiredString(pointer, 'worldManifestKey', 'world-pointer'), 'manifest');
  const worldManifest = asRecord(await fetchJson<JsonRecord>(manifestKey, 'manifest'), 'manifest', 'world manifest');
  if (worldManifest.schemaVersion !== 'openriamap.world-release-manifest.v2') {
    throw new FormalReleaseReaderError('manifest', 'unsupported world-manifest schema');
  }
  if (requiredString(worldManifest, 'worldId', 'manifest') !== worldId) {
    throw new FormalReleaseReaderError('manifest', 'world manifest identity mismatch');
  }
  if (requiredString(worldManifest, 'releaseId', 'manifest') !== releaseId) {
    throw new FormalReleaseReaderError('manifest', 'world pointer and manifest release mismatch');
  }

  return { releaseId, formalVersion, worldId, worldManifest };
}

export async function loadFormalWorldFeatures(args: {
  source: RuleDataSourceSnapshot;
  release: FormalWorldRelease;
  fetchJson?: FormalReleaseFetchJson;
  onProgress?: ProgressCallback;
}): Promise<Record<string, unknown>[]> {
  const fetchJson = sourceFetcher(args.source, args.fetchJson);
  const chunkCatalogKeys = args.release.worldManifest.chunkCatalogKeys;
  if (!Array.isArray(chunkCatalogKeys) || chunkCatalogKeys.length === 0) {
    throw new FormalReleaseReaderError('manifest', 'world manifest has no chunk catalogs');
  }

  args.onProgress?.({ stage: 'world-index-scan', status: 'loading' });
  const chunkKeys: string[] = [];
  for (const catalogKeyValue of chunkCatalogKeys) {
    const catalogKey = safeObjectKey(String(catalogKeyValue ?? ''), 'chunk-catalog');
    const catalog = asRecord(await fetchJson<JsonRecord>(catalogKey, 'chunk-catalog'), 'chunk-catalog', 'chunk catalog');
    if (catalog.schemaVersion !== 'openriamap.world-chunk-catalog.v2') {
      throw new FormalReleaseReaderError('chunk-catalog', 'unsupported chunk-catalog schema');
    }
    if (requiredString(catalog, 'worldId', 'chunk-catalog') !== args.release.worldId) {
      throw new FormalReleaseReaderError('chunk-catalog', 'chunk catalog world mismatch');
    }
    if (requiredString(catalog, 'releaseId', 'chunk-catalog') !== args.release.releaseId) {
      throw new FormalReleaseReaderError('chunk-catalog', 'chunk catalog release mismatch');
    }
    if (!Array.isArray(catalog.chunks)) throw new FormalReleaseReaderError('chunk-catalog', 'chunk catalog chunks must be an array');
    for (const entry of catalog.chunks) {
      const chunk = asRecord(entry, 'chunk-catalog', 'chunk catalog entry');
      chunkKeys.push(safeObjectKey(requiredString(chunk, 'key', 'chunk-catalog'), 'chunk-catalog'));
    }
  }
  const uniqueChunkKeys = Array.from(new Set(chunkKeys));
  args.onProgress?.({ stage: 'world-index-scan', status: 'success', message: `Chunk catalogs: ${chunkCatalogKeys.length}` });

  args.onProgress?.({ stage: 'world-chunk-load', status: 'loading' });
  const features: Record<string, unknown>[] = [];
  for (let index = 0; index < uniqueChunkKeys.length; index += 1) {
    const key = uniqueChunkKeys[index];
    const chunk = asRecord(await fetchJson<JsonRecord>(key, 'chunk'), 'chunk', 'world chunk');
    if (chunk.schemaVersion !== 'openriamap.world-merge-chunk.v2') {
      throw new FormalReleaseReaderError('chunk', 'unsupported world-chunk schema');
    }
    if (requiredString(chunk, 'worldId', 'chunk') !== args.release.worldId) {
      throw new FormalReleaseReaderError('chunk', 'world chunk identity mismatch');
    }
    if (!Array.isArray(chunk.features)) throw new FormalReleaseReaderError('chunk', 'world chunk features must be an array');
    for (const entry of chunk.features) {
      const wrapper = asRecord(entry, 'chunk', 'world chunk feature');
      const record = wrapper.record;
      if (!record || typeof record !== 'object' || Array.isArray(record)) {
        throw new FormalReleaseReaderError('chunk', 'world chunk feature record must be an object');
      }
      features.push(record as Record<string, unknown>);
    }
    args.onProgress?.({ stage: 'world-chunk-load', status: 'loading', message: `Chunks: ${index + 1}/${uniqueChunkKeys.length}` });
  }
  args.onProgress?.({ stage: 'world-chunk-load', status: 'success', message: `Features: ${features.length}` });
  return features;
}

export async function loadFormalWorldRuleDataset(args: {
  source: RuleDataSourceSnapshot;
  worldId: string;
  fetchJson?: FormalReleaseFetchJson;
  onProgress?: ProgressCallback;
}): Promise<RuleWorldDataset> {
  const release = await resolveFormalWorldRelease(args);
  const features = await loadFormalWorldFeatures({ ...args, release });
  return {
    worldId: release.worldId,
    mergeVersion: release.releaseId,
    releaseId: release.releaseId,
    formalVersion: release.formalVersion ?? undefined,
    sourceId: args.source.sourceId,
    transportId: args.source.transportId,
    readerSchemaVersion: args.source.readerSchemaVersion,
    loadedAt: Date.now(),
    features,
  };
}
