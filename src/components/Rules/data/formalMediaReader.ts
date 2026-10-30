import type { RuleDataSourceSnapshot } from './formalDataSourceRuntime';
import { fetchFormalObject, formalObjectLayout } from './formalObjectAccess';
import { readFormalReleaseSet, bindingForWorld, FormalReleaseReaderError } from './formalReleaseReader';

type JsonRecord = Record<string, unknown>;

export type FormalMediaAsset = {
  sourcePath: string;
  /** Present for COS-backed media. Omitted for URL-only external media. */
  key?: string;
  /** HTTPS URL for an externally hosted, index-only image. */
  url?: string;
  sha256: string;
  byteLength: number;
  contentType: string;
  role: 'display';
  order: number;
};

export type FormalMediaFetchJson = <T>(key: string) => Promise<T>;

const SAFE_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const SAFE_MEDIA_KEY = /^worlds\/[A-Za-z0-9][A-Za-z0-9._-]*\/assets\/[0-9a-f]{64}\/display\/[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

function isSafeExternalUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.hash;
  } catch {
    return false;
  }
}

function safeSegment(value: string, field: string): string {
  const normalized = String(value ?? '').trim();
  if (!SAFE_SEGMENT.test(normalized)) throw new Error(`formal-media-${field}-invalid`);
  return normalized;
}

function safeKindPath(value: readonly string[]): string[] {
  return value.map((part) => safeSegment(part, 'kind'));
}

function featureIndexKey(releaseId: string, worldId: string, classCode: string, kindPath: readonly string[]): string {
  return `releases/${safeSegment(releaseId, 'release')}/media-index-merge/${safeSegment(worldId, 'world')}/feature-index/${[safeSegment(classCode, 'class'), ...safeKindPath(kindPath)].join('/')}/INDEX.json`;
}

function readAsset(value: unknown, worldId: string): FormalMediaAsset | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const asset = value as JsonRecord;
  const key = typeof asset.key === 'string' ? asset.key : '';
  const url = typeof asset.url === 'string' ? asset.url : '';
  const sourcePath = String(asset.sourcePath ?? '');
  const sha256 = String(asset.sha256 ?? '');
  const byteLength = typeof asset.byteLength === 'number' ? asset.byteLength : Number.NaN;
  const contentType = String(asset.contentType ?? '');
  const role = asset.role;
  const order = typeof asset.order === 'number' ? asset.order : Number.NaN;
  if (!/^[0-9a-f]{64}$/.test(sha256) || !Number.isSafeInteger(byteLength) || byteLength < 0
    || role !== 'display' || !Number.isSafeInteger(order) || order < 1) return null;
  if (isSafeExternalUrl(url)) {
    if (sourcePath !== `external:${url}` || key || byteLength !== 0 || contentType !== 'external-url') return null;
    return { sourcePath, url, sha256, byteLength, contentType, role, order };
  }
  if (!SAFE_MEDIA_KEY.test(key) || !key.startsWith(`worlds/${worldId}/`) || !sourcePath.startsWith(`Picture/${worldId}/`)
    || !contentType.startsWith('image/')) return null;
  return { sourcePath, key, sha256, byteLength, contentType, role, order };
}

export async function loadFormalMediaAssets(args: {
  source: RuleDataSourceSnapshot;
  releaseId: string;
  worldId: string;
  classCode: string;
  kindPath: readonly string[];
  featureId: string;
  fetchJson?: FormalMediaFetchJson;
}): Promise<FormalMediaAsset[]> {
  if (!args.source.mediaRootUrl) return [];
  const releaseId = safeSegment(args.releaseId, 'release');
  const worldId = safeSegment(args.source.remoteWorldId??args.worldId, 'world');
  const classCode = safeSegment(args.classCode, 'class');
  const kindPath = safeKindPath(args.kindPath);
  const featureId = safeSegment(args.featureId, 'feature');
  const key = featureIndexKey(releaseId, worldId, classCode, kindPath);
  const checkCurrent = async()=>{
    const current=await readFormalReleaseSet({source:args.source});
    if((bindingForWorld(current,worldId)?.dataReleaseId??current.releaseId)!==releaseId||!current.worlds.includes(worldId))throw new FormalReleaseReaderError('release-set','图片所属发布已更新，请重新同步该世界。','release-changed');
  };
  const mutableMirror=!args.fetchJson&&formalObjectLayout(args.source)==='github-stable-v1';
  if(mutableMirror)await checkCurrent();
  const fetchJson = args.fetchJson ?? (async <T>(objectKey: string) => {
    return fetchFormalObject<T>(args.source,objectKey,{releaseId});
  });
  const document = await fetchJson<JsonRecord>(key);
  if (!document || typeof document !== 'object' || Array.isArray(document)
    || document.schemaVersion !== 'openriamap.world-media-feature-index.v1'
    || document.releaseId !== releaseId || document.worldId !== worldId
    || document.category !== [classCode, ...kindPath].join('/')) {
    throw new Error('formal-media-index-invalid');
  }
  const rawByFeature = document.assetsByFeature;
  if (!rawByFeature || typeof rawByFeature !== 'object' || Array.isArray(rawByFeature)) throw new Error('formal-media-index-assets-invalid');
  const rawAssets = (rawByFeature as JsonRecord)[featureId];
  if(mutableMirror)await checkCurrent();
  if (!Array.isArray(rawAssets)) return [];
  return rawAssets
    .map((asset) => readAsset(asset, worldId))
    .filter((asset): asset is FormalMediaAsset => asset !== null)
    .sort((left, right) => left.order - right.order || (left.key ?? left.url ?? '').localeCompare(right.key ?? right.url ?? ''));
}

export function formalMediaUrl(mediaRootUrl: string, key: string): string {
  if (!String(mediaRootUrl ?? '').trim() || !SAFE_MEDIA_KEY.test(key)) throw new Error('formal-media-url-invalid');
  return `${mediaRootUrl.replace(/\/+$/, '')}/${key}`;
}
