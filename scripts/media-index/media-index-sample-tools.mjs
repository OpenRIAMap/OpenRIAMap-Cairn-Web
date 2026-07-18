import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

export const root = process.cwd();
export const contractPath = path.join(root, 'project-config', 'packages', 'openriamap-ria', 'environment', 'mediaIndexContract.json');
export const storageProfilesPath = path.join(root, 'project-config', 'packages', 'openriamap-ria', 'environment', 'storageProfiles.json');
export const contractSchemaPath = path.join(root, 'project-config', 'schemas', 'media', 'cairnmap.media-index-contract.v1.schema.json');
export const assetSchemaPath = path.join(root, 'project-config', 'schemas', 'media', 'cairnmap.media-asset.v1.schema.json');
export const bindingSchemaPath = path.join(root, 'project-config', 'schemas', 'media', 'cairnmap.media-binding.v1.schema.json');
export const mergeSchemaPath = path.join(root, 'project-config', 'schemas', 'media', 'cairnmap.media-index-merge.v1.schema.json');
export const sampleRoot = path.join(root, 'docs', '30_data-contracts', 'examples', 'media-index-sample');
export const sampleSplitRoot = path.join(sampleRoot, 'Media_Index_Spilt');
export const sampleAssetRoot = path.join(sampleSplitRoot, 'assets');
export const sampleBindingRoot = path.join(sampleSplitRoot, 'bindings');
export const nativeRelaySampleRoot = path.join(root, 'docs', '30_data-contracts', 'examples', 'native-relay-package-sample');
export const outputRoot = path.join(root, '.cairnmap-tmp', 'media-index-sample');

export function rel(p) {
  return path.relative(root, p).replaceAll(path.sep, '/');
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function walkJsonFiles(dir) {
  const result = [];
  if (!fs.existsSync(dir)) return result;
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name.endsWith('.json')) result.push(full);
    }
  }
  return result.sort((a, b) => rel(a).localeCompare(rel(b)));
}

export function loadAssets() {
  return walkJsonFiles(sampleAssetRoot).map((filePath) => ({ filePath, data: readJson(filePath) }));
}

export function loadBindings() {
  return walkJsonFiles(sampleBindingRoot).map((filePath) => ({ filePath, data: readJson(filePath) }));
}

export function featureKey(featureRef) {
  return [
    featureRef.projectId,
    featureRef.worldId,
    featureRef.classCode,
    ...(Array.isArray(featureRef.kindPath) ? featureRef.kindPath : []),
    featureRef.featureId,
  ].join('/');
}

export function bindingMergePath(featureRef) {
  const kindPath = Array.isArray(featureRef.kindPath) ? featureRef.kindPath : [];
  return path.join(
    outputRoot,
    'Media_Index_Merge',
    featureRef.worldId,
    'by-feature',
    featureRef.classCode,
    ...kindPath,
    `${featureRef.featureId}.json`,
  );
}

export function assetMergePath(_projectId, worldId, mediaId) {
  return path.join(outputRoot, 'Media_Index_Merge', worldId, 'assets', `${mediaId}.json`);
}

export function nativeFeaturePath(featureRef) {
  const kindPath = Array.isArray(featureRef.kindPath) ? featureRef.kindPath : [];
  return path.join(nativeRelaySampleRoot, 'Data_Spilt', featureRef.worldId, featureRef.classCode, ...kindPath, `${featureRef.featureId}.json`);
}

export function nativePicturePath(asset) {
  return path.join(nativeRelaySampleRoot, 'Picture', asset.objectKey);
}

export function buildSampleMediaIndex({ clean = true } = {}) {
  if (clean && fs.existsSync(outputRoot)) fs.rmSync(outputRoot, { recursive: true, force: true });
  const assets = loadAssets();
  const bindings = loadBindings();
  const assetById = new Map(assets.map((entry) => [entry.data.mediaId, entry]));
  const generatedAt = '1970-01-01T00:00:00.000Z';
  const features = [];

  for (const { data: binding } of bindings) {
    const featureRef = binding.featureRef;
    const resolvedMedia = binding.media.map((item) => {
      const asset = assetById.get(item.mediaId)?.data;
      return {
        ...item,
        asset: asset ? {
          mediaId: asset.mediaId,
          mediaType: asset.mediaType,
          storageProfile: asset.storageProfile,
          objectKey: asset.objectKey,
          mimeType: asset.mimeType,
          variants: asset.variants ?? {},
          status: asset.status,
        } : null,
      };
    });
    const byFeatureRecord = {
      schemaVersion: 'cairnmap.media-index.by-feature.v1',
      featureRef,
      media: resolvedMedia,
    };
    writeJson(bindingMergePath(featureRef), byFeatureRecord);
    features.push({
      featureRef,
      path: rel(bindingMergePath(featureRef)).replace('.cairnmap-tmp/media-index-sample/Media_Index_Merge/' + featureRef.worldId + '/', ''),
      mediaCount: resolvedMedia.length,
    });
    const projectId = featureRef.projectId;
    const worldId = featureRef.worldId;
    for (const item of resolvedMedia) {
      if (item.asset) writeJson(assetMergePath(projectId, worldId, item.mediaId), item.asset);
    }
  }

  const worlds = new Map();
  for (const feature of features) {
    const key = feature.featureRef.worldId;
    if (!worlds.has(key)) worlds.set(key, []);
    worlds.get(key).push(feature);
  }
  for (const [worldId, worldFeatures] of worlds.entries()) {
    writeJson(path.join(outputRoot, 'Media_Index_Merge', worldId, 'INDEX.json'), {
      schemaVersion: 'cairnmap.media-index.merge-world-index.v1',
      projectId: 'openriamap-ria',
      worldId,
      generatedAt,
      assetCount: assets.length,
      bindingCount: bindings.length,
      features: worldFeatures,
    });
  }

  return { assets, bindings, outputRoot };
}
