// CairnMap LEGACY CLEANUP: media/card executor helpers only.
// Project media rules should be config-driven.
/**
 * 图片目录规则（信息卡 - 照片报幕）。
 *
 * 新增：
 * - 支持根据 RULE_DATA_SOURCES 的 sourceMode / pictureSourceMode 判断走 public 或 Data 仓库来源
 * - Data 仓库模式下：读取 Picture/{world}/{class}/{kind?}/INDEX.json，再按 ID 解析图片列表
 *
 * 兼容：
 * - 若当前 world 未启用 dat 图片源，则仍沿用旧 public/pictures 目录探测逻辑
 */

import type { FeatureRecord } from '@/components/Rules/rendering/renderRules';
import { RULE_DATA_SOURCES } from '@/components/Rules/data/ruleDataSources';
import { resolveWorldDirName, resolvePictureFileUrl } from '@/components/Rules/data/sourceResolver';
import { fetchCategoryIndex } from '@/components/Rules/data/dataRepositoryReader';
import { loadFormalMediaAssets, formalMediaUrl } from '@/components/Rules/data/formalMediaReader';
import { getRuleDataSourceSnapshot } from '@/components/Rules/data/formalDataSourceRuntime';
import type { RulePictureSourceDef, SourceKey } from '@/components/Rules/data/sourceTypes';
import { readRuleWorldCache } from '@/components/Rules/data/worldRuleCache';

export type PictureDirRule = {
  name: string;
  match: {
    Kind?: string;
    SKind?: string;
    SKind2?: string;
  };
  dir: string;
};

export const DEFAULT_RULE_PICTURE_SOURCE: RulePictureSourceDef = {
  source: 'pub',
  worldField: 'World',
  classField: 'Class',
  kindField: 'Kind',
  idField: 'ID',
  publicPictureRoot: '/pictures',
  repositoryPictureMode: 'index_by_id',
  debugName: 'CARD_DEFAULT_PICTURE',
};

export type FeaturePictureEntry = {
  source: SourceKey | 'external';
  url: string;
  filename?: string;
  relativePath?: string;
};

const TEMP_MOUNTED_PICTURES_BY_WORLD = new Map<string, Record<string, FeaturePictureEntry[]>>();
const FORMAL_MEDIA_REQUESTS = new Map<string, Promise<FeaturePictureEntry[]>>();

export function setTempMountedPictureEntries(worldId: string, picturesById: Record<string, FeaturePictureEntry[]>) {
  const key = resolveWorldDirName(String(worldId || 'zth'));
  TEMP_MOUNTED_PICTURES_BY_WORLD.set(key, picturesById ?? {});
}

function resolveTempMountedPictureEntriesForFeature(feature?: FeatureRecord | null): FeaturePictureEntry[] {
  const fi: any = feature?.featureInfo ?? {};
  const world = resolveWorldDirName(String(fi.World ?? feature?.meta?.World ?? 'zth'));
  const id = String(fi.ID ?? feature?.meta?.idValue ?? '').trim();
  if (!id) return [];
  const mapping = TEMP_MOUNTED_PICTURES_BY_WORLD.get(world);
  const entries = mapping?.[id];
  if (!Array.isArray(entries)) return [];
  return entries
    .map((x) => ({
      source: x.source === 'pub' || x.source === 'dat' || x.source === 'formal' || x.source === 'external' ? x.source : 'dat',
      url: String(x.url ?? '').trim(),
      filename: x.filename,
      relativePath: x.relativePath,
    }))
    .filter((x) => Boolean(x.url));
}


export const PICTURE_DIR_RULES: PictureDirRule[] = [
  { name: 'NGF-LAD-ISD（岛屿）', match: { Kind: 'NGF', SKind: 'LAD', SKind2: 'ISD' }, dir: 'NGF/LAD/ISD' },
  { name: 'NGF-LAD-PNS（半岛）', match: { Kind: 'NGF', SKind: 'LAD', SKind2: 'PNS' }, dir: 'NGF/LAD/PNS' },
  { name: 'RLE（铁路线）', match: { Kind: 'RLE' }, dir: 'RLE' },
  { name: 'PLF（站台）', match: { Kind: 'PLF' }, dir: 'PLF' },
  { name: 'STA（站场）', match: { Kind: 'STA' }, dir: 'STA' },
  { name: 'STB（车站建筑）', match: { Kind: 'STB' }, dir: 'STB' },
];

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp'] as const;
const SPECIAL_CLASS_SET = new Set(['ISG', 'ISL', 'ISP']);

function readString(fi: any, keys: string[]): string {
  for (const k of keys) {
    const s = String(fi?.[k] ?? '').trim();
    if (s) return s;
  }
  return '';
}

export function extractKindTriplet(feature?: FeatureRecord | null): { Kind: string; SKind: string; SKind2: string } {
  const fi: any = feature?.featureInfo ?? {};
  const Kind = readString(fi, ['Kind']) || readString(fi?.tags, ['Kind']) || readString(fi, ['Class']) || String(feature?.meta?.Class ?? '').trim();
  const SKind = readString(fi, ['SKind']) || readString(fi?.tags, ['SKind']) || '';
  const SKind2 = readString(fi, ['SKind2']) || readString(fi?.tags, ['SKind2']) || '';
  return { Kind, SKind, SKind2 };
}

export function resolvePictureDir(feature?: FeatureRecord | null): string {
  const { Kind, SKind, SKind2 } = extractKindTriplet(feature);
  for (const r of PICTURE_DIR_RULES) {
    if (r.match.Kind && r.match.Kind !== Kind) continue;
    if (r.match.SKind && r.match.SKind !== SKind) continue;
    if (r.match.SKind2 && r.match.SKind2 !== SKind2) continue;
    return r.dir || '';
  }
  return '';
}

function fileNameFromUrl(url: string): string | undefined {
  try {
    const clean = String(url || '').split('?')[0];
    const parts = clean.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : undefined;
  } catch {
    return undefined;
  }
}

function tryLoad(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function resolvePublicPictureEntriesForFeature(feature?: FeatureRecord | null, opts?: { maxImages?: number }): Promise<FeaturePictureEntry[]> {
  const id = String(feature?.meta?.idValue ?? '').trim();
  if (!id) return [];
  const dir = resolvePictureDir(feature);
  const dirPrefix = dir ? `/pictures/${dir}` : '/pictures';
  const maxImages = Math.max(1, Math.min(30, opts?.maxImages ?? 12));
  const out: FeaturePictureEntry[] = [];
  for (let n = 1; n <= maxImages; n += 1) {
    let found: string | null = null;
    for (const ext of IMAGE_EXTS) {
      const url = `${dirPrefix}/${id}_${n}${ext}`;
      // eslint-disable-next-line no-await-in-loop
      const ok = await tryLoad(url);
      if (ok) { found = url; break; }
    }
    if (!found) break;
    out.push({ source: 'pub', url: found, filename: fileNameFromUrl(found) });
  }
  return out;
}

async function buildPublicPictureUrlsForFeature(feature?: FeatureRecord | null, opts?: { maxImages?: number }): Promise<string[]> {
  return (await resolvePublicPictureEntriesForFeature(feature, opts)).map((x) => x.url);
}

async function resolveRepositoryPictureEntriesForFeature(feature?: FeatureRecord | null): Promise<FeaturePictureEntry[]> {
  const fi: any = feature?.featureInfo ?? {};
  const world = fi.World ?? feature?.meta?.World ?? 'zth';
  const className = String(fi.Class ?? feature?.meta?.Class ?? '').trim();
  const kind = String(fi.Kind ?? '').trim();
  const id = String(fi.ID ?? feature?.meta?.idValue ?? '').trim();
  if (!className || !id) return [];
  try {
    const idx = await fetchCategoryIndex({
      worldId: resolveWorldDirName(world),
      className,
      kind: SPECIAL_CLASS_SET.has(className) ? kind : '',
      repoType: 'picture',
      stageName: `picture-index-${className}`,
    });
    const mapping = idx?.mapping ?? {};
    const rels = Array.isArray(mapping[id]) ? mapping[id] : [];
    return rels.map((rel: string) => ({
      source: 'dat',
      url: resolvePictureFileUrl({ worldId: world, className, kind, relativePath: rel }),
      filename: fileNameFromUrl(rel),
      relativePath: rel,
    }));
  } catch {
    return [];
  }
}

async function buildRepositoryPictureUrlsForFeature(feature?: FeatureRecord | null): Promise<string[]> {
  return (await resolveRepositoryPictureEntriesForFeature(feature)).map((x) => x.url);
}

/**
 * Formal release images are deliberately separate from the Data mirror. The
 * loaded world cache pins the exact release used by the current map, so a
 * card never mixes a new current pointer with an old feature dataset.
 */
async function resolveFormalMediaPictureEntriesForFeature(feature?: FeatureRecord | null): Promise<FeaturePictureEntry[]> {
  const fi: any = feature?.featureInfo ?? {};
  const worldId = resolveWorldDirName(String(fi.World ?? feature?.meta?.World ?? 'zth'));
  const classCode = String(fi.Class ?? feature?.meta?.Class ?? '').trim();
  const kind = String(fi.Kind ?? '').trim();
  const featureId = String(fi.ID ?? feature?.meta?.idValue ?? '').trim();
  if (!classCode || !featureId) return [];
  try {
    const source = getRuleDataSourceSnapshot();
    const dataset = readRuleWorldCache(worldId);
    const releaseId = String(dataset?.releaseId ?? dataset?.mergeVersion ?? '').trim();
    if (source.readerKind !== 'formal-release-v2' || !source.mediaRootUrl || !releaseId
      || dataset?.sourceId !== source.sourceId || dataset?.transportId !== source.transportId) return [];
    const kindPath = SPECIAL_CLASS_SET.has(classCode) && kind ? [kind] : [];
    const cacheKey = [source.sourceId, source.transportId, source.generation, releaseId, worldId, classCode, ...kindPath, featureId].join('\u0000');
    let request = FORMAL_MEDIA_REQUESTS.get(cacheKey);
    if (!request) {
      request = loadFormalMediaAssets({ source, releaseId, worldId, classCode, kindPath, featureId })
        .then((assets) => assets.flatMap((asset): FeaturePictureEntry[] => {
          if (asset.url) return [{
            source: 'external',
            url: asset.url,
            filename: fileNameFromUrl(asset.url),
            relativePath: asset.sourcePath,
          }];
          if (!asset.key) return [];
          return [{
            source: 'formal',
            url: formalMediaUrl(source.mediaRootUrl!, asset.key),
            filename: fileNameFromUrl(asset.key),
            relativePath: asset.sourcePath,
          }];
        }))
        .catch(() => []);
      FORMAL_MEDIA_REQUESTS.set(cacheKey, request);
    }
    return await request;
  } catch {
    return [];
  }
}

/**
 * 探测并返回当前要素可用的图片 URL 列表。
 */
export async function buildPictureUrlsForFeature(feature?: FeatureRecord | null, opts?: { maxImages?: number }): Promise<string[]> {
  const tempEntries = resolveTempMountedPictureEntriesForFeature(feature);
  if (tempEntries.length > 0) return tempEntries.map((x) => x.url);

  const formalEntries = await resolveFormalMediaPictureEntriesForFeature(feature);
  if (formalEntries.length > 0) return formalEntries.map((x) => x.url);

  const world = String((feature?.featureInfo as any)?.World ?? '').trim();
  const worldDir = resolveWorldDirName(world || 'zth');
  const ds = RULE_DATA_SOURCES[worldDir];
  const sourceMode = ds?.pictureSourceMode ?? ds?.sourceMode ?? 'pub';
  if (sourceMode === 'dat') {
    const out = await buildRepositoryPictureUrlsForFeature(feature);
    if (out.length > 0) return out;
  }
  return buildPublicPictureUrlsForFeature(feature, opts);
}


export async function resolvePictureEntriesForFeature(feature?: FeatureRecord | null, opts?: { maxImages?: number }): Promise<FeaturePictureEntry[]> {
  const tempEntries = resolveTempMountedPictureEntriesForFeature(feature);
  if (tempEntries.length > 0) return tempEntries;

  const formalEntries = await resolveFormalMediaPictureEntriesForFeature(feature);
  if (formalEntries.length > 0) return formalEntries;

  const world = String((feature?.featureInfo as any)?.World ?? '').trim();
  const worldDir = resolveWorldDirName(world || 'zth');
  const ds = RULE_DATA_SOURCES[worldDir];
  const sourceMode = ds?.pictureSourceMode ?? ds?.sourceMode ?? 'pub';
  if (sourceMode === 'dat') {
    const out = await resolveRepositoryPictureEntriesForFeature(feature);
    if (out.length > 0) return out;
  }
  return resolvePublicPictureEntriesForFeature(feature, opts);
}
