import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  collectPackageStats,
  defaultSampleRoot,
  packagePaths,
  readJson,
  rel,
  sha256,
  walkJsonFiles,
  walkPictureFiles,
  writeJson,
} from './native-relay-package-tools.mjs';
import { resolveNativeRelayInput } from './native-relay-input-resolver.mjs';
import { createNativeRelayConfigContext, resolveNativeFeatureFile, resolveNativePictureFile } from './native-relay-config-resolver.mjs';

export { rel };

export const root = process.cwd();
export const defaultFeatureDataRoot = path.join(root, 'docs', '30_data-contracts', 'examples', 'feature-data-sample', 'Data_Spilt');
export const defaultPictureRoot = path.join(defaultSampleRoot, 'Picture');
export const defaultDryRunRoot = path.join(root, '.cairnmap-tmp', 'native-relay-apply-local');
export const defaultMediaIndexRoot = path.join(root, '.cairnmap-tmp', 'native-relay-media-index-spilt-target');
export const dryRunReportSchemaPath = path.join(root, 'project-config', 'schemas', 'relay', 'cairnmap.native-relay-dry-run-report.v1.schema.json');

const IMAGE_MIME = new Map([
  ['.webp', 'image/webp'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.avif', 'image/avif'],
]);

function normalizeSlashes(value) {
  return value.replaceAll(path.sep, '/');
}

export function parseApplyArgs(argv = process.argv.slice(2)) {
  const result = {
    relayRoot: defaultSampleRoot,
    featureDataRoot: defaultFeatureDataRoot,
    pictureRoot: defaultPictureRoot,
    outRoot: defaultDryRunRoot,
    mediaIndexRoot: defaultMediaIndexRoot,
    projectId: 'openriamap-ria',
    clean: true,
    write: false,
    backup: false,
    allowOverwrite: true,
    strictDelete: false,
    explicitFeatureDataRoot: false,
    explicitPictureRoot: false,
    explicitMediaIndexRoot: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--relay' || arg === '--package' || arg === '--package-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.relayRoot = path.resolve(root, next);
      i += 1;
    } else if (arg === '--feature-data' || arg === '--feature-data-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.featureDataRoot = path.resolve(root, next);
      result.explicitFeatureDataRoot = true;
      i += 1;
    } else if (arg === '--picture-root' || arg === '--picture') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.pictureRoot = path.resolve(root, next);
      result.explicitPictureRoot = true;
      i += 1;
    } else if (arg === '--out' || arg === '--out-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.outRoot = path.resolve(root, next);
      i += 1;
    } else if (arg === '--media-index-root' || arg === '--media-index') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.mediaIndexRoot = path.resolve(root, next);
      result.explicitMediaIndexRoot = true;
      i += 1;
    } else if (arg === '--write') {
      result.write = true;
    } else if (arg === '--backup') {
      result.backup = true;
    } else if (arg === '--no-overwrite') {
      result.allowOverwrite = false;
    } else if (arg === '--strict-delete') {
      result.strictDelete = true;
    } else if (arg === '--project-id') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a project id`);
      result.projectId = next;
      i += 1;
    } else if (arg === '--no-clean') {
      result.clean = false;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return result;
}

export function applyHelp() {
  return [
    'Usage:',
    '  npm run compare:native-relay-package -- [--relay <NativeRelayPackageDirOrZip>] [--feature-data <Data_SpiltDir>] [--picture-root <PictureDir>] [--out <outputDir>]',
    '  npm run dry-run:native-relay-apply -- [--relay <NativeRelayPackageDirOrZip>] [--feature-data <Data_SpiltDir>] [--picture-root <PictureDir>] [--out <outputDir>]',
    '  npm run apply:native-relay-package -- [--relay <NativeRelayPackageDirOrZip>] [--feature-data <Data_SpiltDir>] [--picture-root <PictureDir>] [--media-index-root <Media_Index_SpiltDir>] [--out <outputDir>] [--write]',
    '',
    'Defaults run the checked-in sample fixtures. External local directory and .zip RelayPackage inputs are supported. The apply command writes target roots only when --write is explicitly supplied.',
  ].join('\n');
}

function pathExistsDir(dir) {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

export function detectSplitLayout(featureDataRoot, projectId) {
  if (!pathExistsDir(featureDataRoot)) return { exists: false, layout: 'missing', root: featureDataRoot };
  if (pathExistsDir(path.join(featureDataRoot, projectId))) return { exists: true, layout: 'project-aware', root: featureDataRoot };
  return { exists: true, layout: 'native-world-first', root: featureDataRoot };
}

export function targetFeatureRelativePath(info, projectId, layout = 'project-aware') {
  const nativeRelative = [info.worldId, info.classCode, ...(info.nestedPath ?? []), `${info.featureIdFromFile}.json`].join('/');
  if (layout === 'project-aware') return `${projectId}/${nativeRelative}`;
  return nativeRelative;
}

export function targetPictureRelativePath(packageRoot, pictureFile) {
  const pictureRoot = packagePaths(packageRoot).pictureRoot;
  return normalizeSlashes(path.relative(pictureRoot, pictureFile));
}

export function featureRefFromNativeInfo(info, projectId) {
  return {
    projectId,
    worldId: info.worldId,
    classCode: info.classCode,
    kindPath: info.nestedPath ?? [],
    featureId: info.featureIdFromFile,
  };
}

export function featureKeyFromRef(ref) {
  return [ref.projectId, ref.worldId, ref.classCode, ...(ref.kindPath ?? []), ref.featureId].join('/');
}

function featureKeyFromNativeInfo(info, projectId) {
  return featureKeyFromRef(featureRefFromNativeInfo(info, projectId));
}

function readJsonSafe(filePath, warnings, errors) {
  try {
    return readJson(filePath);
  } catch (error) {
    errors.push(`[parse-json] ${normalizeSlashes(filePath)}: ${error.message}`);
    return null;
  }
}

export function collectRelayFeatureEntries(packageRoot, projectId, warnings = [], errors = [], configContext = null) {
  const context = configContext ?? createNativeRelayConfigContext(projectId);
  const featureFiles = walkJsonFiles(packagePaths(packageRoot).splitRoot);
  const entries = [];
  const seenKeys = new Set();
  for (const sourcePath of featureFiles) {
    const data = readJsonSafe(sourcePath, warnings, errors);
    if (!data) continue;
    const resolved = resolveNativeFeatureFile(packageRoot, sourcePath, data, context, { warnings, errors });
    if (!resolved.valid || !resolved.ref) continue;
    const key = featureKeyFromRef(resolved.ref);
    if (seenKeys.has(key)) warnings.push(`[relay-feature] Duplicate feature key in package: ${key}`);
    seenKeys.add(key);
    entries.push({
      key,
      ref: resolved.ref,
      info: resolved.info,
      sourcePath,
      packageRelativePath: normalizeSlashes(path.relative(packageRoot, sourcePath)),
      sourceRelativePath: normalizeSlashes(path.relative(packagePaths(packageRoot).splitRoot, sourcePath)),
      data,
      contentHash: sha256(data),
    });
  }
  return entries.sort((a, b) => a.key.localeCompare(b.key));
}

export function collectBaselineFeatureMap(featureDataRoot, projectId, layout, warnings = [], errors = []) {
  const result = new Map();
  if (!pathExistsDir(featureDataRoot)) {
    warnings.push(`[baseline] FeatureData root does not exist; all package features will be treated as create candidates: ${normalizeSlashes(featureDataRoot)}`);
    return result;
  }
  const files = walkJsonFiles(featureDataRoot);
  for (const filePath of files) {
    const relative = normalizeSlashes(path.relative(featureDataRoot, filePath));
    const parts = relative.split('/');
    const offset = layout === 'project-aware' && parts[0] === projectId ? 1 : 0;
    if (parts.length - offset < 3) continue;
    const worldId = parts[offset];
    const classCode = parts[offset + 1];
    const fileName = parts[parts.length - 1];
    const featureId = fileName.endsWith('.json') ? fileName.slice(0, -5) : fileName;
    const kindPath = parts.slice(offset + 2, -1);
    const key = [projectId, worldId, classCode, ...kindPath, featureId].join('/');
    const data = readJsonSafe(filePath, warnings, errors);
    if (!data) continue;
    result.set(key, { key, filePath, relative, data, contentHash: sha256(data) });
  }
  return result;
}

export function normalizeDeleteItem(item, projectId, featureDataLayout) {
  if (typeof item === 'string') {
    const normalizedPath = normalizeSlashes(item);
    const parts = normalizedPath.replace(/^Data_Spilt\//, '').split('/');
    const offset = parts[0] === projectId ? 1 : 0;
    if (parts.length - offset >= 3) {
      const worldId = parts[offset];
      const classCode = parts[offset + 1];
      const fileName = parts[parts.length - 1];
      return {
        raw: item,
        worldId,
        classCode,
        kindPath: parts.slice(offset + 2, -1),
        featureId: fileName.endsWith('.json') ? fileName.slice(0, -5) : fileName,
        path: normalizedPath,
      };
    }
    return { raw: item, path: normalizedPath };
  }
  const pathValue = typeof item?.path === 'string' ? normalizeSlashes(item.path) : null;
  const kindPath = Array.isArray(item?.kindPath) ? item.kindPath : [];
  return {
    raw: item,
    worldId: item?.worldId,
    classCode: item?.classCode,
    kindPath,
    featureId: item?.featureId,
    path: pathValue,
    reason: item?.reason,
  };
}

export function deleteTargetRelativePath(deleteItem, projectId, layout) {
  if (deleteItem.path) {
    const cleaned = deleteItem.path.replace(/^Data_Spilt\//, '');
    if (layout === 'project-aware' && !cleaned.startsWith(`${projectId}/`)) return `${projectId}/${cleaned}`;
    if (layout !== 'project-aware' && cleaned.startsWith(`${projectId}/`)) return cleaned.slice(projectId.length + 1);
    return cleaned;
  }
  if (!deleteItem.worldId || !deleteItem.classCode || !deleteItem.featureId) return null;
  const nativeRelative = [deleteItem.worldId, deleteItem.classCode, ...(deleteItem.kindPath ?? []), `${deleteItem.featureId}.json`].join('/');
  return layout === 'project-aware' ? `${projectId}/${nativeRelative}` : nativeRelative;
}

export function collectPictureEntries(packageRoot, pictureRoot, projectId, warnings = [], errors = [], configContext = null, knownFeatureKeys = new Set()) {
  const context = configContext ?? createNativeRelayConfigContext(projectId);
  const sourcePictureFiles = walkPictureFiles(packagePaths(packageRoot).pictureRoot);
  const byFeature = new Map();
  const pictureChanges = [];
  for (const sourcePath of sourcePictureFiles) {
    const resolvedPicture = resolveNativePictureFile(packageRoot, sourcePath, context, { warnings, errors });
    const objectKey = resolvedPicture.objectKey ?? targetPictureRelativePath(packageRoot, sourcePath);
    const targetPath = path.join(pictureRoot, objectKey);
    const sourceHash = crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex');
    let status = 'create';
    let baselineHash = null;
    if (fs.existsSync(targetPath)) {
      baselineHash = crypto.createHash('sha256').update(fs.readFileSync(targetPath)).digest('hex');
      status = baselineHash === sourceHash ? 'unchanged' : 'overwrite';
    }
    const featureRef = resolvedPicture.ref;
    if (featureRef && knownFeatureKeys.size > 0 && !knownFeatureKeys.has(featureKeyFromRef(featureRef))) {
      warnings.push(`[picture-binding] Picture/${objectKey} binds to ${featureKeyFromRef(featureRef)}, which is not present in package features or baseline features`);
    }
    const entry = {
      status,
      objectKey,
      sourcePath,
      sourceRelativePath: normalizeSlashes(path.relative(packageRoot, sourcePath)),
      targetPath,
      targetRelativePath: normalizeSlashes(path.relative(pictureRoot, targetPath)),
      sourceHash,
      baselineHash,
      sizeBytes: fs.statSync(sourcePath).size,
      mimeType: IMAGE_MIME.get(path.extname(sourcePath).toLowerCase()) ?? 'application/octet-stream',
      featureRef,
    };
    pictureChanges.push(entry);
    if (featureRef) {
      const key = featureKeyFromRef(featureRef);
      if (!byFeature.has(key)) byFeature.set(key, []);
      byFeature.get(key).push(entry);
    }
  }
  return { pictureChanges: pictureChanges.sort((a, b) => a.objectKey.localeCompare(b.objectKey)), byFeature };
}

function mediaIdForPicture(entry) {
  const raw = crypto.createHash('sha256').update(entry.objectKey).digest('hex').slice(0, 16).toUpperCase();
  return `IMG_${raw}`;
}

export function buildMediaIndexPlan(pictureEntries, storageProfile = 'media.github.currentOpenRIAMapDataPicture') {
  const assets = [];
  const bindings = [];
  for (const entry of pictureEntries) {
    if (!entry.featureRef) continue;
    assets.push({
      schemaVersion: 'cairnmap.media-asset.v1',
      mediaId: mediaIdForPicture(entry),
      mediaType: 'image',
      storageProfile,
      objectKey: entry.objectKey,
      sha256: entry.sourceHash,
      mimeType: entry.mimeType,
      sizeBytes: entry.sizeBytes,
      variants: {},
      status: 'active',
    });
  }
  const byFeature = new Map();
  for (const entry of pictureEntries) {
    if (!entry.featureRef) continue;
    const key = featureKeyFromRef(entry.featureRef);
    if (!byFeature.has(key)) byFeature.set(key, { featureRef: entry.featureRef, entries: [] });
    byFeature.get(key).entries.push(entry);
  }
  for (const group of byFeature.values()) {
    const entries = group.entries.sort((a, b) => a.objectKey.localeCompare(b.objectKey));
    bindings.push({
      schemaVersion: 'cairnmap.media-binding.v1',
      featureRef: group.featureRef,
      media: entries.map((entry, index) => ({
        mediaId: mediaIdForPicture(entry),
        role: index === 0 ? 'cover' : 'gallery',
        order: index + 1,
        visible: true,
      })),
    });
  }
  return { assets: assets.sort((a, b) => a.mediaId.localeCompare(b.mediaId)), bindings: bindings.sort((a, b) => featureKeyFromRef(a.featureRef).localeCompare(featureKeyFromRef(b.featureRef))) };
}

export async function buildComparison(args, mode = 'compare') {
  const warnings = [];
  const errors = [];
  let relayInput = null;
  try {
    relayInput = await resolveNativeRelayInput(args.relayRoot, { clean: args.clean });
    args.relayInputPath = args.relayRoot;
    args.relayRoot = relayInput.packageRoot;
  } catch (error) {
    errors.push(error.message);
  }
  const splitLayout = detectSplitLayout(args.featureDataRoot, args.projectId);
  const featureDataLayout = splitLayout.layout === 'project-aware' ? 'project-aware' : 'native-world-first';
  const configContext = createNativeRelayConfigContext(args.projectId);
  const stats = pathExistsDir(args.relayRoot) ? collectPackageStats(args.relayRoot) : { index: {}, deleteItems: [], featureCount: 0, pictureCount: 0, deleteCount: 0, classes: {}, worlds: {}, paths: packagePaths(args.relayRoot) };
  const relayFeatures = pathExistsDir(args.relayRoot) ? collectRelayFeatureEntries(args.relayRoot, args.projectId, warnings, errors, configContext) : [];
  const baselineMap = collectBaselineFeatureMap(args.featureDataRoot, args.projectId, featureDataLayout, warnings, errors);
  const featureChanges = [];
  for (const entry of relayFeatures) {
    const targetRelativePath = targetFeatureRelativePath(entry.info, args.projectId, featureDataLayout);
    const targetPath = path.join(args.featureDataRoot, targetRelativePath);
    const baseline = baselineMap.get(entry.key);
    const status = baseline ? (baseline.contentHash === entry.contentHash ? 'unchanged' : 'update') : 'create';
    featureChanges.push({
      status,
      featureRef: entry.ref,
      featureKey: entry.key,
      name: entry.data.Name ?? null,
      sourcePackagePath: entry.packageRelativePath,
      targetRelativePath,
      targetPath: normalizeSlashes(targetPath),
      packageHash: entry.contentHash,
      baselineHash: baseline?.contentHash ?? null,
      baselineRelativePath: baseline?.relative ?? null,
    });
  }
  const deleteItems = Array.isArray(stats.deleteItems) ? stats.deleteItems : [];
  const deleteChanges = deleteItems.map((item) => {
    const normalized = normalizeDeleteItem(item, args.projectId, featureDataLayout);
    const targetRelativePath = deleteTargetRelativePath(normalized, args.projectId, featureDataLayout);
    const targetPath = targetRelativePath ? path.join(args.featureDataRoot, targetRelativePath) : null;
    const exists = targetPath ? fs.existsSync(targetPath) : false;
    return {
      status: exists ? 'delete' : 'missing-target',
      featureRef: normalized.worldId && normalized.classCode && normalized.featureId ? {
        projectId: args.projectId,
        worldId: normalized.worldId,
        classCode: normalized.classCode,
        kindPath: normalized.kindPath ?? [],
        featureId: normalized.featureId,
      } : null,
      targetRelativePath,
      targetPath: targetPath ? normalizeSlashes(targetPath) : null,
      reason: normalized.reason ?? null,
      raw: normalized.raw,
    };
  });
  for (const item of deleteChanges) {
    if (item.status === 'missing-target') warnings.push(`[delete] Delete target is not present in baseline: ${item.targetRelativePath ?? '(unresolved)'}`);
  }
  const knownFeatureKeys = new Set([...relayFeatures.map((item) => item.key), ...baselineMap.keys()]);
  const { pictureChanges } = pathExistsDir(args.relayRoot) ? collectPictureEntries(args.relayRoot, args.pictureRoot, args.projectId, warnings, errors, configContext, knownFeatureKeys) : { pictureChanges: [] };
  const mediaIndexPlan = buildMediaIndexPlan(pictureChanges);
  const generatedAt = new Date(0).toISOString();
  const report = {
    schemaVersion: 'cairnmap.native-relay-dry-run-report.v1',
    generatedAt,
    mode,
    projectId: args.projectId,
    inputs: {
      relayInput: args.relayInputPath ? rel(args.relayInputPath) : rel(args.relayRoot),
      relayInputType: relayInput?.inputType ?? 'directory',
      relayRoot: rel(args.relayRoot),
      relayRootPrefix: relayInput?.rootPrefix ?? '',
      relayExtractionRoot: relayInput?.extractionRoot ? rel(relayInput.extractionRoot) : null,
      featureDataRoot: rel(args.featureDataRoot),
      pictureRoot: rel(args.pictureRoot),
      mediaIndexRoot: rel(args.mediaIndexRoot),
      outRoot: rel(args.outRoot),
    },
    package: {
      operator: stats.index?.operator ?? null,
      version: stats.index?.version ?? null,
      packageVersion: stats.index?.packageVersion ?? null,
      exportedAt: stats.index?.exportedAt ?? null,
      featureCount: stats.featureCount ?? relayFeatures.length,
      pictureCount: stats.pictureCount ?? pictureChanges.length,
      deleteCount: stats.deleteCount ?? deleteChanges.length,
      classes: stats.classes ?? {},
      worlds: stats.worlds ?? {},
    },
    baseline: {
      featureDataExists: splitLayout.exists,
      featureDataLayout,
      baselineFeatureCount: baselineMap.size,
      pictureRootExists: pathExistsDir(args.pictureRoot),
    },
    summary: {
      featuresToCreate: featureChanges.filter((item) => item.status === 'create').length,
      featuresToUpdate: featureChanges.filter((item) => item.status === 'update').length,
      featuresUnchanged: featureChanges.filter((item) => item.status === 'unchanged').length,
      featuresToDelete: deleteChanges.filter((item) => item.status === 'delete').length,
      deleteTargetsMissing: deleteChanges.filter((item) => item.status === 'missing-target').length,
      picturesToCopy: pictureChanges.filter((item) => item.status === 'create' || item.status === 'overwrite').length,
      picturesUnchanged: pictureChanges.filter((item) => item.status === 'unchanged').length,
      mediaAssetsPlanned: mediaIndexPlan.assets.length,
      mediaBindingsPlanned: mediaIndexPlan.bindings.length,
      warnings: 0,
      errors: 0,
    },
    featureChanges,
    deleteChanges,
    pictureChanges: pictureChanges.map((item) => ({
      status: item.status,
      objectKey: item.objectKey,
      sourcePackagePath: item.sourceRelativePath,
      targetRelativePath: item.targetRelativePath,
      targetPath: normalizeSlashes(item.targetPath),
      sourceHash: item.sourceHash,
      baselineHash: item.baselineHash,
      sizeBytes: item.sizeBytes,
      mimeType: item.mimeType,
      featureRef: item.featureRef,
    })),
    mediaIndexPlan: {
      assetCount: mediaIndexPlan.assets.length,
      bindingCount: mediaIndexPlan.bindings.length,
      assets: mediaIndexPlan.assets.map((asset) => ({ mediaId: asset.mediaId, objectKey: asset.objectKey, storageProfile: asset.storageProfile })),
      bindings: mediaIndexPlan.bindings.map((binding) => ({ featureRef: binding.featureRef, mediaCount: binding.media.length })),
    },
    warnings,
    errors,
  };
  report.summary.warnings = warnings.length;
  report.summary.errors = errors.length;
  return { args, report, relayFeatures, pictureChanges, mediaIndexPlan, featureDataLayout };
}

export function writeDryRunOutputs(context, { writePreview = true } = {}) {
  const { args, report, relayFeatures, pictureChanges, mediaIndexPlan, featureDataLayout } = context;
  if (args.clean && fs.existsSync(args.outRoot)) fs.rmSync(args.outRoot, { recursive: true, force: true });
  const reportPath = path.join(args.outRoot, 'dry-run-report.json');
  writeJson(reportPath, report);
  writeJson(path.join(args.outRoot, 'feature-changes.json'), report.featureChanges);
  writeJson(path.join(args.outRoot, 'delete-changes.json'), report.deleteChanges);
  writeJson(path.join(args.outRoot, 'picture-changes.json'), report.pictureChanges);
  if (!writePreview) return { reportPath };

  for (const item of relayFeatures) {
    const targetRelativePath = targetFeatureRelativePath(item.info, args.projectId, featureDataLayout);
    const previewPath = path.join(args.outRoot, 'Data_Spilt_preview', targetRelativePath);
    writeJson(previewPath, item.data);
  }
  for (const item of report.deleteChanges) {
    if (item.targetRelativePath) writeJson(path.join(args.outRoot, 'Data_Spilt_delete_preview', `${item.targetRelativePath}.delete-plan.json`), item);
  }
  for (const item of pictureChanges) {
    const previewPath = path.join(args.outRoot, 'Picture_preview', item.objectKey);
    fs.mkdirSync(path.dirname(previewPath), { recursive: true });
    fs.copyFileSync(item.sourcePath, previewPath);
  }
  for (const asset of mediaIndexPlan.assets) {
    writeJson(path.join(args.outRoot, 'Media_Index_Spilt_preview', 'assets', `${asset.mediaId}.json`), asset);
    const worldId = asset.objectKey.split('/')[0] ?? 'unknown-world';
    writeJson(path.join(args.outRoot, 'Media_Index_Merge_preview', worldId, 'assets', `${asset.mediaId}.json`), asset);
  }
  const worldIndex = new Map();
  for (const binding of mediaIndexPlan.bindings) {
    const ref = binding.featureRef;
    const splitBindingPath = path.join(args.outRoot, 'Media_Index_Spilt_preview', 'bindings', ref.worldId, ref.classCode, ...(ref.kindPath ?? []), `${ref.featureId}.json`);
    writeJson(splitBindingPath, binding);
    const mergeByFeature = {
      schemaVersion: 'cairnmap.media-index.by-feature.v1',
      featureRef: ref,
      media: binding.media.map((mediaItem) => ({
        ...mediaItem,
        asset: mediaIndexPlan.assets.find((asset) => asset.mediaId === mediaItem.mediaId) ?? null,
      })),
    };
    const mergeBindingPath = path.join(args.outRoot, 'Media_Index_Merge_preview', ref.worldId, 'by-feature', ref.classCode, ...(ref.kindPath ?? []), `${ref.featureId}.json`);
    writeJson(mergeBindingPath, mergeByFeature);
    const worldKey = ref.worldId;
    if (!worldIndex.has(worldKey)) worldIndex.set(worldKey, []);
    worldIndex.get(worldKey).push({
      featureRef: ref,
      path: normalizeSlashes(path.relative(path.join(args.outRoot, 'Media_Index_Merge_preview', ref.worldId), mergeBindingPath)),
      mediaCount: binding.media.length,
    });
  }
  for (const [worldId, features] of worldIndex.entries()) {
    writeJson(path.join(args.outRoot, 'Media_Index_Merge_preview', worldId, 'INDEX.json'), {
      schemaVersion: 'cairnmap.media-index.merge-world-index.v1',
      projectId: args.projectId,
      worldId,
      generatedAt: report.generatedAt,
      assetCount: mediaIndexPlan.assets.length,
      bindingCount: mediaIndexPlan.bindings.length,
      features,
    });
  }
  return { reportPath };
}
