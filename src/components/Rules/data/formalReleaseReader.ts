import type { ProgressCallback } from '@/lib/fetchWithMirror';
import type { RuleWorldDataset } from './sourceTypes';
import type { RuleDataSourceSnapshot } from './formalDataSourceRuntime';
import { abortFormalObjectRequests, fetchFormalObject, formalObjectPath, FormalObjectError, safeFormalObjectKey, type FormalObjectIntegrity } from './formalObjectAccess';

type JsonRecord = Record<string, unknown>;

export type FormalWorldRelease = {
  releaseId: string;
  formalVersion: number | null;
  worldId: string;
  worldManifest: JsonRecord;
  releaseSet: FormalReleaseSet;
};

export type FormalReleaseSet = { schemaVersion: 'openriamap.current-release-set.v2'; releaseId: string; formalVersion: number | null; worlds: string[] };
export type FormalReadOptions = { releaseId?: string; integrity?: FormalObjectIntegrity; signal?: AbortSignal };
/** Test/host adapters receive the logical key and declared integrity contract. */
export type FormalReleaseFetchJson = <T>(key: string, stage: FormalReleaseReaderError['stage'], options?: FormalReadOptions) => Promise<T>;

export class FormalReleaseReaderError extends Error {
  readonly stage: 'release-set' | 'world-pointer' | 'manifest' | 'chunk-catalog' | 'chunk' | 'unknown';

  constructor(stage: FormalReleaseReaderError['stage'], message: string, readonly code = 'invalid-release', readonly status?: number) {
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
  try { return safeFormalObjectKey(value); }
  catch { throw new FormalReleaseReaderError(stage, 'invalid object key'); }
}

export async function fetchFormalJson<T>(source: RuleDataSourceSnapshot, key: string, stage: FormalReleaseReaderError['stage'], options?: FormalReadOptions): Promise<T> {
  try {
    return await fetchFormalObject<T>(source, safeObjectKey(key, stage), options);
  } catch (error) {
    if (error instanceof FormalReleaseReaderError) throw error;
    const message = error instanceof Error ? error.message : String(error);
    throw new FormalReleaseReaderError(stage, message, error instanceof FormalObjectError ? error.code : 'network', error instanceof FormalObjectError ? error.status : undefined);
  }
}

function sourceFetcher(source: RuleDataSourceSnapshot, fetchJson?: FormalReleaseFetchJson): FormalReleaseFetchJson {
  return (key, stage, options) => {
    formalObjectPath(source, safeObjectKey(key, stage), options?.releaseId);
    return fetchJson ? fetchJson(key, stage, options) : fetchFormalJson(source, key, stage, options);
  };
}

export function abortActiveFormalDataRequests(worldIds?:readonly string[]): void {
  abortFormalObjectRequests(worldIds);
}

export async function readFormalReleaseSet(args: { source: RuleDataSourceSnapshot; fetchJson?: FormalReleaseFetchJson }): Promise<FormalReleaseSet> {
  const value = asRecord(await sourceFetcher(args.source,args.fetchJson)<JsonRecord>('current/worlds/_release-set.json','release-set'),'release-set','release set');
  const releaseId = requiredString(value,'releaseId','release-set');
  if(value.schemaVersion!=='openriamap.current-release-set.v2'||!Array.isArray(value.worlds)||!value.worlds.every(world=>typeof world==='string'&&/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(world))||new Set(value.worlds).size!==value.worlds.length||!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(releaseId))throw new FormalReleaseReaderError('release-set','发布集合无效。');
  return {schemaVersion:'openriamap.current-release-set.v2',releaseId,formalVersion:optionalFormalVersion(value,'formalVersion','release-set'),worlds:value.worlds as string[]};
}
export async function assertFormalReleaseCurrent(args: {source:RuleDataSourceSnapshot;release:FormalWorldRelease;fetchJson?:FormalReleaseFetchJson}):Promise<void>{
  const after=await readFormalReleaseSet(args);
  if(JSON.stringify(after)!==JSON.stringify(args.release.releaseSet))throw new FormalReleaseReaderError('release-set','读取期间正式发布已更新，正在重新同步。','release-changed');
}

export async function resolveFormalWorldRelease(args: {
  source: RuleDataSourceSnapshot;
  worldId: string;
  fetchJson?: FormalReleaseFetchJson;
  releaseSet?: FormalReleaseSet;
}): Promise<FormalWorldRelease> {
  const worldId = String(args.source.remoteWorldId ?? args.worldId ?? '').trim();
  if (!worldId) throw new FormalReleaseReaderError('world-pointer', 'worldId is required');
  const fetchJson = sourceFetcher(args.source, args.fetchJson);
  const releaseSet = args.releaseSet ?? await readFormalReleaseSet(args);
  const {releaseId,formalVersion}=releaseSet;
  if (!Array.isArray(releaseSet.worlds) || !releaseSet.worlds.includes(worldId)) {
    throw new FormalReleaseReaderError('release-set', `该来源尚未发布世界 ${worldId}。`, 'world-not-published');
  }

  const pointer = asRecord(await fetchJson<JsonRecord>(`current/worlds/${worldId}.json`, 'world-pointer'), 'world-pointer', 'world pointer');
  if (pointer.schemaVersion !== 'openriamap.current-world.v2') {
    throw new FormalReleaseReaderError('world-pointer', 'unsupported world-pointer schema');
  }
  if (requiredString(pointer, 'worldId', 'world-pointer') !== worldId) {
    throw new FormalReleaseReaderError('world-pointer', 'world pointer identity mismatch');
  }
  if (requiredString(pointer, 'releaseId', 'world-pointer') !== releaseId) {
    throw new FormalReleaseReaderError('world-pointer', 'release-set and world-pointer release mismatch', 'release-changed');
  }
  if (optionalFormalVersion(pointer, 'formalVersion', 'world-pointer') !== formalVersion) {
    throw new FormalReleaseReaderError('world-pointer', 'release-set and world-pointer formal version mismatch', 'release-changed');
  }

  const manifestKey = safeObjectKey(requiredString(pointer, 'worldManifestKey', 'world-pointer'), 'manifest');
  if(manifestKey!==`releases/${releaseId}/manifests/worlds/${worldId}.json`)throw new FormalReleaseReaderError('manifest','世界清单路径与发布身份不符。');
  if(!/^[a-f0-9]{64}$/.test(String(pointer.worldManifestSha256??'')))throw new FormalReleaseReaderError('world-pointer','世界清单缺少有效SHA256。');
  const worldManifest = asRecord(await fetchJson<JsonRecord>(manifestKey, 'manifest',{releaseId,integrity:{sha256:String(pointer.worldManifestSha256)}}), 'manifest', 'world manifest');
  if (worldManifest.schemaVersion !== 'openriamap.world-release-manifest.v2') {
    throw new FormalReleaseReaderError('manifest', 'unsupported world-manifest schema');
  }
  if (requiredString(worldManifest, 'worldId', 'manifest') !== worldId) {
    throw new FormalReleaseReaderError('manifest', 'world manifest identity mismatch');
  }
  if (requiredString(worldManifest, 'releaseId', 'manifest') !== releaseId) {
    throw new FormalReleaseReaderError('manifest', 'world pointer and manifest release mismatch', 'release-changed');
  }

  if(!Number.isSafeInteger(worldManifest.featureCount)||Number(worldManifest.featureCount)<0||!Number.isSafeInteger(worldManifest.chunkCount)||Number(worldManifest.chunkCount)<0)throw new FormalReleaseReaderError('manifest','世界清单计数无效。');
  return { releaseId, formalVersion, worldId, worldManifest, releaseSet };
}

export async function loadFormalWorldFeatures(args: {
  source: RuleDataSourceSnapshot;
  release: FormalWorldRelease;
  fetchJson?: FormalReleaseFetchJson;
  onProgress?: ProgressCallback;
}): Promise<Record<string, unknown>[]> {
  const fetchJson = sourceFetcher(args.source, args.fetchJson);
  const chunkCatalogKeys = args.release.worldManifest.chunkCatalogKeys;
  if (!Array.isArray(chunkCatalogKeys) || chunkCatalogKeys.length === 0 && args.release.worldManifest.featureCount !== 0) {
    throw new FormalReleaseReaderError('manifest', 'world manifest has no chunk catalogs');
  }

  args.onProgress?.({ stage: 'world-index-scan', status: 'loading' });
  const chunks: {key:string;sha256:string;byteLength:number;featureCount:number}[] = [];
  for (const catalogKeyValue of chunkCatalogKeys) {
    const catalogKey = safeObjectKey(String(catalogKeyValue ?? ''), 'chunk-catalog');
    if(!catalogKey.startsWith(`releases/${args.release.releaseId}/manifests/`))throw new FormalReleaseReaderError('chunk-catalog','数据块目录不属于当前发布。');
    const catalog = asRecord(await fetchJson<JsonRecord>(catalogKey, 'chunk-catalog',{releaseId:args.release.releaseId}), 'chunk-catalog', 'chunk catalog');
    if (catalog.schemaVersion !== 'openriamap.world-chunk-catalog.v2') {
      throw new FormalReleaseReaderError('chunk-catalog', 'unsupported chunk-catalog schema');
    }
    if (requiredString(catalog, 'worldId', 'chunk-catalog') !== args.release.worldId) {
      throw new FormalReleaseReaderError('chunk-catalog', 'chunk catalog world mismatch');
    }
    if (requiredString(catalog, 'releaseId', 'chunk-catalog') !== args.release.releaseId) {
      throw new FormalReleaseReaderError('chunk-catalog', 'chunk catalog release mismatch', 'release-changed');
    }
    if (!Array.isArray(catalog.chunks)) throw new FormalReleaseReaderError('chunk-catalog', 'chunk catalog chunks must be an array');
    for (const entry of catalog.chunks) {
      const chunk = asRecord(entry, 'chunk-catalog', 'chunk catalog entry');
      const key=safeObjectKey(requiredString(chunk,'key','chunk-catalog'),'chunk-catalog');
      if(!key.startsWith(`releases/${args.release.releaseId}/data-merge/${args.release.worldId}/`)||!/^[a-f0-9]{64}$/.test(String(chunk.sha256??''))||!Number.isSafeInteger(chunk.byteLength)||Number(chunk.byteLength)<1||!Number.isSafeInteger(chunk.featureCount)||Number(chunk.featureCount)<0)throw new FormalReleaseReaderError('chunk-catalog','数据块声明无效。');
      chunks.push({key,sha256:String(chunk.sha256),byteLength:Number(chunk.byteLength),featureCount:Number(chunk.featureCount)});
    }
  }
  if(new Set(chunks.map(chunk=>chunk.key)).size!==chunks.length||chunks.length!==args.release.worldManifest.chunkCount)throw new FormalReleaseReaderError('chunk-catalog','数据块目录重复或数量不符。');
  args.onProgress?.({ stage: 'world-index-scan', status: 'success', message: `Chunk catalogs: ${chunkCatalogKeys.length}` });

  args.onProgress?.({ stage: 'world-chunk-load', status: 'loading' });
  const features: Record<string, unknown>[] = [];
  for (let index = 0; index < chunks.length; index += 1) {
    const entry = chunks[index];
    const chunk = asRecord(await fetchJson<JsonRecord>(entry.key, 'chunk',{releaseId:args.release.releaseId,integrity:entry}), 'chunk', 'world chunk');
    if (chunk.schemaVersion !== 'openriamap.world-merge-chunk.v2') {
      throw new FormalReleaseReaderError('chunk', 'unsupported world-chunk schema');
    }
    if (requiredString(chunk, 'worldId', 'chunk') !== args.release.worldId) {
      throw new FormalReleaseReaderError('chunk', 'world chunk identity mismatch');
    }
    if (!Array.isArray(chunk.features)) throw new FormalReleaseReaderError('chunk', 'world chunk features must be an array');
    if(chunk.features.length!==entry.featureCount||chunk.featureCount!==entry.featureCount)throw new FormalReleaseReaderError('chunk','数据块记录计数不符。');
    for (const entry of chunk.features) {
      const wrapper = asRecord(entry, 'chunk', 'world chunk feature');
      const record = wrapper.record;
      if (!record || typeof record !== 'object' || Array.isArray(record)) {
        throw new FormalReleaseReaderError('chunk', 'world chunk feature record must be an object');
      }
      features.push(record as Record<string, unknown>);
    }
    args.onProgress?.({ stage: 'world-chunk-load', status: 'loading', message: `Chunks: ${index + 1}/${chunks.length}` });
  }
  if(features.length!==args.release.worldManifest.featureCount)throw new FormalReleaseReaderError('chunk','世界记录总数与清单不符。');
  await assertFormalReleaseCurrent(args);
  args.onProgress?.({ stage: 'world-chunk-load', status: 'success', message: `Features: ${features.length}` });
  return features;
}

export async function loadFormalWorldRuleDataset(args: {
  source: RuleDataSourceSnapshot;
  worldId: string;
  fetchJson?: FormalReleaseFetchJson;
  onProgress?: ProgressCallback;
}): Promise<RuleWorldDataset> {
  return withStableFormalRelease(async()=>{
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
  });
}

/** A bounded restart never commits a partly read stable mirror to cache. */
export async function withStableFormalRelease<T>(read:()=>Promise<T>):Promise<T>{
  for(let attempt=0;;attempt++){
    try{return await read();}catch(error){
      const changed=error instanceof FormalReleaseReaderError&&(error.code==='release-changed'||error.code==='integrity'||error.status===404);
      if(!changed||attempt>=2)throw error;
    }
  }
}
