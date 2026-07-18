import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  loadClassConfigs,
  loadWorlds,
  readJson,
  rel,
  sha256,
  stableJson,
  walkJsonFiles,
  writeJson,
} from '../relay/native-relay-package-tools.mjs';

export { rel };

export const root = process.cwd();
export const defaultSplitRoot = path.join(root, 'docs', '30_data-contracts', 'examples', 'media-index-sample', 'Media_Index_Spilt');
export const defaultOutRoot = path.join(root, '.cairnmap-tmp', 'media-index-full');
export const defaultMergeRoot = path.join(defaultOutRoot, 'Media_Index_Merge_preview');
export const buildReportSchemaPath = path.join(root, 'project-config', 'schemas', 'media', 'cairnmap.media-index-build-report.v1.schema.json');

const DEFAULT_PROJECT_ID = 'openriamap-ria';
const GENERATED_AT = '1970-01-01T00:00:00.000Z';

function normalizeSlashes(value) {
  return String(value || '').replaceAll(path.sep, '/');
}

function isDirectory(dir) {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

function ensureSafeWriteRoot(targetRoot, forbiddenRoots, label) {
  const resolved = path.resolve(targetRoot);
  if (resolved === path.parse(resolved).root) throw new Error(`[safe-write] ${label} must not be a filesystem root: ${resolved}`);
  for (const forbidden of forbiddenRoots) {
    const forbiddenResolved = path.resolve(forbidden);
    if (resolved === forbiddenResolved || resolved.startsWith(`${forbiddenResolved}${path.sep}`)) {
      throw new Error(`[safe-write] ${label} must not be inside ${normalizeSlashes(forbiddenResolved)}: ${normalizeSlashes(resolved)}`);
    }
  }
  return resolved;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function parseMediaIndexBuildArgs(argv = process.argv.slice(2)) {
  const result = {
    splitRoot: defaultSplitRoot,
    mergeRoot: defaultMergeRoot,
    outRoot: defaultOutRoot,
    projectId: DEFAULT_PROJECT_ID,
    write: false,
    clean: true,
    strictWorlds: false,
    strictClasses: false,
    allowLegacyProjectAwareBindings: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--split-root' || arg === '--split') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.splitRoot = path.resolve(root, next);
      i += 1;
    } else if (arg === '--merge-root' || arg === '--merge') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.mergeRoot = path.resolve(root, next);
      i += 1;
    } else if (arg === '--out' || arg === '--out-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.outRoot = path.resolve(root, next);
      if (!result.write) result.mergeRoot = path.join(result.outRoot, 'Media_Index_Merge_preview');
      i += 1;
    } else if (arg === '--project-id') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a project id`);
      result.projectId = next;
      i += 1;
    } else if (arg === '--write') {
      result.write = true;
    } else if (arg === '--clean') {
      result.clean = true;
    } else if (arg === '--no-clean') {
      result.clean = false;
    } else if (arg === '--strict-worlds') {
      result.strictWorlds = true;
    } else if (arg === '--strict-classes') {
      result.strictClasses = true;
    } else if (arg === '--no-legacy-project-aware-bindings') {
      result.allowLegacyProjectAwareBindings = false;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!result.write && result.mergeRoot === defaultMergeRoot) result.mergeRoot = path.join(result.outRoot, 'Media_Index_Merge_preview');
  return result;
}

export function mediaIndexBuildHelp() {
  return [
    'Usage:',
    '  npm run build:media-index-full -- [--split-root <Media_Index_SpiltDir>] [--out <outputDir>]',
    '  node ./scripts/media-index/build-media-index-full.mjs --split-root <Media_Index_SpiltDir> --merge-root <Media_Index_MergeDir> --write',
    '',
    'Defaults run the checked-in MediaIndex sample and generate preview output under .cairnmap-tmp/media-index-full.',
    'The canonical output is world-first: Media_Index_Merge/{worldId}/...',
    'Legacy project-aware binding input paths such as bindings/openriamap-ria/zth/... are accepted with warnings and normalized to world-first output.',
  ].join('\n');
}

function bindingKeyFromRef(ref) {
  return [ref.projectId, ref.worldId, ref.classCode, ...(ref.kindPath ?? []), ref.featureId].join('/');
}

function bindingMergeRelativePath(ref) {
  return `${ref.worldId}/by-feature/${[ref.classCode, ...(ref.kindPath ?? []), `${ref.featureId}.json`].join('/')}`;
}

function assetMergeRelativePath(worldId, mediaId) {
  return `${worldId}/assets/${mediaId}.json`;
}

function splitRootParts(splitRoot) {
  return {
    assetRoot: path.join(splitRoot, 'assets'),
    bindingRoot: path.join(splitRoot, 'bindings'),
  };
}

function classifyBindingPath(filePath, bindingRoot, projectId, context, options, warnings, errors) {
  const relative = normalizeSlashes(path.relative(bindingRoot, filePath));
  const parts = relative.split('/').filter(Boolean);
  if (parts.length < 3) return { validPathShape: false, relative, reason: 'expected {worldId}/{classCode}/.../{featureId}.json' };

  let offset = 0;
  let sourceLayout = 'world-first';
  if (parts[0] === projectId && parts.length >= 4 && context.worlds.byId.has(parts[1])) {
    sourceLayout = 'legacy-project-aware';
    offset = 1;
    const message = `[legacy] ${relative} uses deprecated project-aware binding path; normalized to world-first output`;
    if (options.allowLegacyProjectAwareBindings) warnings.push(message);
    else errors.push(message);
  }

  if (parts.length - offset < 3) return { validPathShape: false, relative, sourceLayout, reason: 'binding path is too short' };
  const worldId = parts[offset];
  const classCode = parts[offset + 1];
  const fileName = parts[parts.length - 1];
  const featureId = fileName.endsWith('.json') ? fileName.slice(0, -5) : fileName;
  const kindPath = parts.slice(offset + 2, -1);
  return {
    validPathShape: true,
    relative,
    sourceLayout,
    worldId,
    classCode,
    kindPath,
    featureId,
    registeredWorld: context.worlds.byId.has(worldId),
    registeredClass: context.classConfigs.has(classCode),
  };
}

export function loadMediaIndexSplit(options) {
  const warnings = [];
  const errors = [];
  const skippedWorldDirs = new Map();
  const skippedFiles = [];
  const context = {
    worlds: loadWorlds(),
    classConfigs: loadClassConfigs(),
  };
  const { assetRoot, bindingRoot } = splitRootParts(options.splitRoot);

  if (!isDirectory(options.splitRoot)) errors.push(`[split-root] Missing Media_Index_Spilt root: ${normalizeSlashes(options.splitRoot)}`);
  if (!isDirectory(assetRoot)) errors.push(`[asset-root] Missing Media_Index_Spilt/assets root: ${normalizeSlashes(assetRoot)}`);
  if (!isDirectory(bindingRoot)) errors.push(`[binding-root] Missing Media_Index_Spilt/bindings root: ${normalizeSlashes(bindingRoot)}`);
  if (errors.length > 0) return { assets: [], bindings: [], warnings, errors, skippedWorldDirs: [], skippedFiles, context };

  const assetFiles = walkJsonFiles(assetRoot);
  const bindingFiles = walkJsonFiles(bindingRoot);
  const assets = [];
  const assetById = new Map();
  const objectKeys = new Set();
  for (const filePath of assetFiles) {
    const relative = normalizeSlashes(path.relative(options.splitRoot, filePath));
    let data;
    try { data = readJson(filePath); }
    catch (error) { errors.push(`[parse-json] ${relative}: ${error.message}`); continue; }
    if (data.schemaVersion !== 'cairnmap.media-asset.v1') errors.push(`[asset] ${relative} expected schemaVersion cairnmap.media-asset.v1`);
    if (typeof data.mediaId !== 'string' || data.mediaId.length === 0) errors.push(`[asset] ${relative} mediaId is required`);
    if (typeof data.objectKey !== 'string' || data.objectKey.length === 0) errors.push(`[asset] ${relative} objectKey is required`);
    if (data.mediaId) {
      if (assetById.has(data.mediaId)) errors.push(`[asset] duplicate mediaId ${data.mediaId}`);
      assetById.set(data.mediaId, { filePath, relative, data });
    }
    if (data.objectKey) {
      if (objectKeys.has(data.objectKey)) warnings.push(`[asset] duplicate objectKey ${data.objectKey}`);
      objectKeys.add(data.objectKey);
    }
    assets.push({ filePath, relative, data });
  }

  const bindings = [];
  const seenBindings = new Set();
  for (const filePath of bindingFiles) {
    const pathInfo = classifyBindingPath(filePath, bindingRoot, options.projectId, context, options, warnings, errors);
    if (!pathInfo.validPathShape) {
      skippedFiles.push({ path: pathInfo.relative, reason: pathInfo.reason ?? 'invalid binding path shape' });
      continue;
    }
    if (!pathInfo.registeredWorld) {
      const count = skippedWorldDirs.get(pathInfo.worldId) ?? 0;
      skippedWorldDirs.set(pathInfo.worldId, count + 1);
      const message = `[world] skipped unregistered world directory "${pathInfo.worldId}" from ${pathInfo.relative}`;
      if (options.strictWorlds) errors.push(message);
      else warnings.push(message);
      continue;
    }
    if (!pathInfo.registeredClass) {
      const message = `[class] skipped unregistered class directory "${pathInfo.classCode}" from ${pathInfo.relative}`;
      if (options.strictClasses) errors.push(message);
      else warnings.push(message);
      skippedFiles.push({ path: pathInfo.relative, reason: `unregistered class ${pathInfo.classCode}` });
      continue;
    }

    let data;
    try { data = readJson(filePath); }
    catch (error) { errors.push(`[parse-json] ${pathInfo.relative}: ${error.message}`); continue; }

    if (data.schemaVersion !== 'cairnmap.media-binding.v1') errors.push(`[binding] ${pathInfo.relative} expected schemaVersion cairnmap.media-binding.v1`);
    const ref = data.featureRef ?? {};
    const expectedRef = {
      projectId: options.projectId,
      worldId: pathInfo.worldId,
      classCode: pathInfo.classCode,
      kindPath: pathInfo.kindPath,
      featureId: pathInfo.featureId,
    };
    if (ref.projectId !== options.projectId) errors.push(`[binding] ${pathInfo.relative} featureRef.projectId expected ${options.projectId}, got ${ref.projectId || '(missing)'}`);
    for (const key of ['worldId', 'classCode', 'featureId']) {
      if (ref[key] !== expectedRef[key]) errors.push(`[binding] ${pathInfo.relative} featureRef.${key} expected ${expectedRef[key]}, got ${ref[key] || '(missing)'}`);
    }
    const actualKind = Array.isArray(ref.kindPath) ? ref.kindPath : [];
    if (actualKind.join('/') !== pathInfo.kindPath.join('/')) errors.push(`[binding] ${pathInfo.relative} featureRef.kindPath does not match path`);
    const bindingKey = bindingKeyFromRef(expectedRef);
    if (seenBindings.has(bindingKey)) errors.push(`[binding] duplicate feature binding ${bindingKey}`);
    seenBindings.add(bindingKey);

    if (!Array.isArray(data.media) || data.media.length < 1) errors.push(`[binding] ${pathInfo.relative} media must contain at least one item`);
    let visibleCoverCount = 0;
    const orders = new Set();
    for (const item of Array.isArray(data.media) ? data.media : []) {
      if (!assetById.has(item.mediaId)) errors.push(`[binding] ${pathInfo.relative} references missing mediaId ${item.mediaId}`);
      if (item.role === 'cover' && item.visible === true) visibleCoverCount += 1;
      if (orders.has(item.order)) warnings.push(`[binding] ${pathInfo.relative} duplicate order ${item.order}`);
      orders.add(item.order);
    }
    if (visibleCoverCount > 1) errors.push(`[binding] ${pathInfo.relative} has more than one visible cover`);

    bindings.push({
      filePath,
      relative: pathInfo.relative,
      sourceLayout: pathInfo.sourceLayout,
      projectId: options.projectId,
      worldId: pathInfo.worldId,
      classCode: pathInfo.classCode,
      kindPath: pathInfo.kindPath,
      featureId: pathInfo.featureId,
      featureRef: expectedRef,
      data,
    });
  }

  bindings.sort((a, b) => bindingKeyFromRef(a.featureRef).localeCompare(bindingKeyFromRef(b.featureRef)));
  assets.sort((a, b) => String(a.data.mediaId || '').localeCompare(String(b.data.mediaId || '')));
  return {
    assets,
    bindings,
    warnings,
    errors,
    skippedWorldDirs: [...skippedWorldDirs.entries()].sort().map(([worldId, fileCount]) => ({ worldId, fileCount })),
    skippedFiles,
    context,
    assetById,
  };
}

export function buildMediaIndexOutputs(options) {
  const collected = loadMediaIndexSplit(options);
  const { assets, bindings, warnings, errors, skippedWorldDirs, skippedFiles, assetById } = collected;
  const files = new Map();
  const usedAssetByWorld = new Map();
  const featuresByWorld = new Map();

  for (const binding of bindings) {
    const ref = binding.featureRef;
    const media = [];
    for (const mediaItem of binding.data.media ?? []) {
      const asset = assetById.get(mediaItem.mediaId)?.data ?? null;
      media.push({ ...mediaItem, asset });
      if (asset) {
        if (!usedAssetByWorld.has(ref.worldId)) usedAssetByWorld.set(ref.worldId, new Map());
        usedAssetByWorld.get(ref.worldId).set(asset.mediaId, asset);
      }
    }
    const byFeatureRecord = {
      schemaVersion: 'cairnmap.media-index.by-feature.v1',
      featureRef: ref,
      media,
    };
    const relativePath = bindingMergeRelativePath(ref);
    files.set(relativePath, byFeatureRecord);
    if (!featuresByWorld.has(ref.worldId)) featuresByWorld.set(ref.worldId, []);
    featuresByWorld.get(ref.worldId).push({
      featureRef: ref,
      path: `by-feature/${[ref.classCode, ...(ref.kindPath ?? []), `${ref.featureId}.json`].join('/')}`,
      mediaCount: media.length,
    });
  }

  for (const [worldId, assetMap] of [...usedAssetByWorld.entries()].sort()) {
    for (const [mediaId, asset] of [...assetMap.entries()].sort()) {
      files.set(assetMergeRelativePath(worldId, mediaId), asset);
    }
  }

  for (const [worldId, features] of [...featuresByWorld.entries()].sort()) {
    const assetMap = usedAssetByWorld.get(worldId) ?? new Map();
    files.set(`${worldId}/INDEX.json`, {
      schemaVersion: 'cairnmap.media-index.merge-world-index.v1',
      projectId: options.projectId,
      worldId,
      generatedAt: GENERATED_AT,
      assetCount: assetMap.size,
      bindingCount: features.length,
      features: features.sort((a, b) => bindingKeyFromRef(a.featureRef).localeCompare(bindingKeyFromRef(b.featureRef))),
    });
  }

  files.set('INDEX.json', {
    schemaVersion: 'cairnmap.media-index.merge-root-index.v1',
    projectId: options.projectId,
    generatedAt: GENERATED_AT,
    layout: 'world-first',
    worldCount: featuresByWorld.size,
    assetCount: assets.length,
    bindingCount: bindings.length,
    worlds: [...featuresByWorld.keys()].sort().map((worldId) => ({
      worldId,
      indexPath: `${worldId}/INDEX.json`,
      assetCount: (usedAssetByWorld.get(worldId) ?? new Map()).size,
      bindingCount: featuresByWorld.get(worldId)?.length ?? 0,
    })),
  });

  const report = {
    schemaVersion: 'cairnmap.media-index-build-report.v1',
    patchId: 'DATA_MEDIA_INDEX_WORLD_FIRST_BUILD_1',
    generatedAt: GENERATED_AT,
    writeMode: Boolean(options.write),
    inputs: {
      splitRoot: normalizeSlashes(options.splitRoot),
      mergeRoot: normalizeSlashes(options.mergeRoot),
      projectId: options.projectId,
      strictWorlds: Boolean(options.strictWorlds),
      strictClasses: Boolean(options.strictClasses),
      allowLegacyProjectAwareBindings: Boolean(options.allowLegacyProjectAwareBindings),
    },
    outputs: {
      mergeRoot: normalizeSlashes(options.mergeRoot),
      buildReport: normalizeSlashes(path.join(options.outRoot, 'build-report.json')),
    },
    summary: {
      scannedAssets: assets.length,
      scannedBindings: bindings.length,
      processedBindings: bindings.length,
      processedWorlds: featuresByWorld.size,
      writtenFileCount: files.size,
      skippedWorldDirs: skippedWorldDirs.length,
      skippedFiles: skippedFiles.length,
      warningCount: warnings.length,
      errorCount: errors.length,
    },
    skippedWorldDirs,
    skippedFiles,
    warnings,
    errors,
    finalStatus: errors.length > 0 ? 'FAIL' : 'PASS',
  };

  return { files, report, collected };
}

export function writeMediaIndexBuildOutputs(outputs, options) {
  ensureDir(options.outRoot);
  if (options.write) {
    ensureSafeWriteRoot(options.mergeRoot, [options.splitRoot, options.outRoot, path.join(root, '.cairnmap-tmp', 'relay-input')], 'mergeRoot');
  }
  if (options.clean && fs.existsSync(options.mergeRoot)) fs.rmSync(options.mergeRoot, { recursive: true, force: true });
  ensureDir(options.mergeRoot);
  for (const [relativePath, payload] of outputs.files.entries()) {
    writeJson(path.join(options.mergeRoot, relativePath), payload);
  }
  writeJson(path.join(options.outRoot, 'build-report.json'), outputs.report);
}

export function executeMediaIndexBuild(options) {
  const effective = { ...options };
  if (!effective.write && effective.mergeRoot === defaultMergeRoot) effective.mergeRoot = path.join(effective.outRoot, 'Media_Index_Merge_preview');
  const outputs = buildMediaIndexOutputs(effective);
  writeMediaIndexBuildOutputs(outputs, effective);
  return { outputs, options: effective };
}
