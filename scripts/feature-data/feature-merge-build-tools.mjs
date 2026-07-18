import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  featureIdentity,
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
export const defaultSplitRoot = path.join(root, 'docs', '30_data-contracts', 'examples', 'native-relay-package-sample', 'Data_Spilt');
export const defaultOutRoot = path.join(root, '.cairnmap-tmp', 'feature-merge-full');
export const defaultMergeRoot = path.join(defaultOutRoot, 'Data_Merge_preview');
export const defaultIndexRoot = path.join(defaultOutRoot, 'Data_Index_preview');
export const buildReportSchemaPath = path.join(root, 'project-config', 'schemas', 'data', 'cairnmap.feature-merge-build-report.v1.schema.json');

const DEFAULT_PROJECT_ID = 'openriamap-ria';
const DEFAULT_CHUNK_SIZE = 200;
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

export function parseFeatureMergeBuildArgs(argv = process.argv.slice(2)) {
  const result = {
    splitRoot: defaultSplitRoot,
    mergeRoot: defaultMergeRoot,
    indexRoot: defaultIndexRoot,
    outRoot: defaultOutRoot,
    projectId: DEFAULT_PROJECT_ID,
    layout: 'auto',
    chunkSize: DEFAULT_CHUNK_SIZE,
    write: false,
    clean: true,
    strictWorlds: false,
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
    } else if (arg === '--index-root' || arg === '--index') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.indexRoot = path.resolve(root, next);
      i += 1;
    } else if (arg === '--out' || arg === '--out-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.outRoot = path.resolve(root, next);
      if (!result.write) {
        result.mergeRoot = path.join(result.outRoot, 'Data_Merge_preview');
        result.indexRoot = path.join(result.outRoot, 'Data_Index_preview');
      }
      i += 1;
    } else if (arg === '--project-id') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a project id`);
      result.projectId = next;
      i += 1;
    } else if (arg === '--layout') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires auto, native-world-first, or project-aware`);
      if (!['auto', 'native-world-first', 'project-aware'].includes(next)) throw new Error(`[layout] Unsupported layout: ${next}`);
      result.layout = next;
      i += 1;
    } else if (arg === '--chunk-size') {
      const next = Number.parseInt(argv[i + 1], 10);
      if (!Number.isInteger(next) || next < 1) throw new Error(`${arg} requires a positive integer`);
      result.chunkSize = next;
      i += 1;
    } else if (arg === '--write') {
      result.write = true;
    } else if (arg === '--clean') {
      result.clean = true;
    } else if (arg === '--no-clean') {
      result.clean = false;
    } else if (arg === '--strict-worlds') {
      result.strictWorlds = true;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!result.write && (result.mergeRoot === defaultMergeRoot || result.indexRoot === defaultIndexRoot)) {
    result.mergeRoot = path.join(result.outRoot, 'Data_Merge_preview');
    result.indexRoot = path.join(result.outRoot, 'Data_Index_preview');
  }

  return result;
}

export function featureMergeBuildHelp() {
  return [
    'Usage:',
    '  npm run build:feature-merge-full -- [--split-root <Data_SpiltDir>] [--out <outputDir>] [--layout auto|native-world-first|project-aware]',
    '  node ./scripts/feature-data/build-feature-merge-full.mjs --split-root <Data_SpiltDir> --merge-root <Data_MergeDir> --index-root <Data_IndexDir> --write',
    '',
    'Defaults run the checked-in Native RelayPackage sample and generate preview output under .cairnmap-tmp/feature-merge-full.',
    'Only config-registered worldId directories are processed. Unknown world directories such as Data_Spilt/0 are skipped and reported unless --strict-worlds is supplied.',
  ].join('\n');
}

function classifySplitPath(filePath, splitRoot, projectId, context, requestedLayout) {
  const relative = normalizeSlashes(path.relative(splitRoot, filePath));
  const parts = relative.split('/').filter(Boolean);
  if (parts.length < 3) return { validPathShape: false, relative };

  let layout = requestedLayout;
  if (layout === 'auto') layout = parts[0] === projectId ? 'project-aware' : 'native-world-first';

  let offset = 0;
  if (layout === 'project-aware') {
    if (parts[0] !== projectId) return { validPathShape: false, relative, layout, reason: `expected projectId segment ${projectId}` };
    offset = 1;
  }

  if (parts.length - offset < 3) return { validPathShape: false, relative, layout };
  const worldId = parts[offset];
  const classCode = parts[offset + 1];
  const fileName = parts[parts.length - 1];
  const featureId = fileName.endsWith('.json') ? fileName.slice(0, -5) : fileName;
  const kindPath = parts.slice(offset + 2, -1);

  return {
    validPathShape: true,
    relative,
    layout,
    worldId,
    classCode,
    kindPath,
    featureId,
    registeredWorld: context.worlds.byId.has(worldId),
    registeredClass: context.classConfigs.has(classCode),
  };
}

function validateFeatureAgainstConfig(record, context, warnings, errors) {
  const classEntry = context.classConfigs.get(record.classCode);
  const identity = featureIdentity(record.data, classEntry?.data);
  if (identity.featureId !== record.featureId) errors.push(`[feature-id] ${record.sourceRelativePath} file name ${record.featureId} does not match ${identity.idField}=${identity.featureId || '(missing)'}`);
  if (identity.classCode !== record.classCode) errors.push(`[class] ${record.sourceRelativePath} path class ${record.classCode} does not match ${identity.classField}=${identity.classCode || '(missing)'}`);
  const worldItem = context.worlds.byNumeric.get(identity.worldCode);
  if (!worldItem) {
    errors.push(`[world] ${record.sourceRelativePath} ${identity.worldField}=${identity.worldCode} does not match any worlds.numericCode`);
  } else if (worldItem.id !== record.worldId) {
    errors.push(`[world] ${record.sourceRelativePath} path world ${record.worldId} does not match ${identity.worldField}=${identity.worldCode} (${worldItem.id})`);
  }
}

export function collectSplitFeatureRecords(options) {
  const warnings = [];
  const errors = [];
  const skippedWorldDirs = new Map();
  const skippedFiles = [];
  const context = {
    worlds: loadWorlds(),
    classConfigs: loadClassConfigs(),
  };

  if (!isDirectory(options.splitRoot)) {
    errors.push(`[split-root] Missing Data_Spilt root: ${normalizeSlashes(options.splitRoot)}`);
    return { records: [], warnings, errors, skippedWorldDirs: [], skippedFiles, context };
  }

  const files = walkJsonFiles(options.splitRoot);
  const seen = new Set();
  const records = [];

  for (const filePath of files) {
    const pathInfo = classifySplitPath(filePath, options.splitRoot, options.projectId, context, options.layout);
    if (!pathInfo.validPathShape) {
      skippedFiles.push({ path: normalizeSlashes(path.relative(options.splitRoot, filePath)), reason: pathInfo.reason ?? 'invalid split path shape' });
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
    try {
      data = readJson(filePath);
    } catch (error) {
      errors.push(`[parse-json] ${pathInfo.relative}: ${error.message}`);
      continue;
    }

    const record = {
      projectId: options.projectId,
      worldId: pathInfo.worldId,
      classCode: pathInfo.classCode,
      kindPath: pathInfo.kindPath,
      featureId: pathInfo.featureId,
      sourcePath: filePath,
      sourceRelativePath: pathInfo.relative,
      sourceLayout: pathInfo.layout,
      data,
      contentHash: sha256(data),
    };
    const key = featureKey(record);
    if (seen.has(key)) warnings.push(`[duplicate] duplicate feature key ${key}; later file kept in scan order`);
    seen.add(key);
    validateFeatureAgainstConfig(record, context, warnings, errors);
    records.push(record);
  }

  records.sort((a, b) => [a.worldId, a.classCode, ...a.kindPath, a.featureId].join('/').localeCompare([b.worldId, b.classCode, ...b.kindPath, b.featureId].join('/')));
  return {
    records,
    warnings,
    errors,
    skippedWorldDirs: [...skippedWorldDirs.entries()].sort().map(([worldId, fileCount]) => ({ worldId, fileCount })),
    skippedFiles,
    context,
  };
}

export function featureKey(record) {
  return [record.projectId, record.worldId, record.classCode, ...(record.kindPath ?? []), record.featureId].join('/');
}

function mergeFeaturePath(record, chunkId) {
  return `${record.worldId}/${record.classCode}/chunk_${chunkId}.json`;
}

function sourcePathFor(record, splitRootName = 'Data_Spilt') {
  return `${splitRootName}/${record.worldId}/${record.classCode}/${[...(record.kindPath ?? []), `${record.featureId}.json`].join('/')}`;
}

function classIndexPath(record) {
  return `${record.worldId}/${record.classCode}/INDEX.json`;
}

function normalizeMergeFileMapPath(relativePath) {
  return normalizeSlashes(relativePath).replace(/^\/+/, '');
}

function buildClassGroups(records) {
  const groups = new Map();
  for (const record of records) {
    const key = `${record.worldId}/${record.classCode}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }
  return groups;
}

export function buildFeatureMergeOutputs(options) {
  const collected = collectSplitFeatureRecords(options);
  const { records, warnings, errors, skippedWorldDirs, skippedFiles } = collected;
  const files = new Map();
  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const byClass = buildClassGroups(records);
  const mergeIndex = {
    schemaVersion: 'cairnmap.feature-data-index.merge-index.v1',
    generatedAt: GENERATED_AT,
    projectId: options.projectId,
    layout: 'native-world-first',
    features: {},
  };
  const chunkManifest = {
    schemaVersion: 'cairnmap.feature-data-index.chunk-manifest.v1',
    generatedAt: GENERATED_AT,
    projectId: options.projectId,
    layout: 'native-world-first',
    chunks: [],
  };

  const worldClassCounts = new Map();
  for (const [classKey, classRecords] of [...byClass.entries()].sort()) {
    const [worldId, classCode] = classKey.split('/');
    classRecords.sort((a, b) => [a.kindPath.join('/'), a.featureId].join('/').localeCompare([b.kindPath.join('/'), b.featureId].join('/')));
    const chunks = [];
    const items = classRecords.map((record) => record.featureId);
    for (let start = 0; start < classRecords.length; start += chunkSize) {
      const chunkIndex = Math.floor(start / chunkSize) + 1;
      const chunkId = String(chunkIndex).padStart(3, '0');
      const chunkRecords = classRecords.slice(start, start + chunkSize);
      const chunkFile = `chunk_${chunkId}.json`;
      const chunkRelative = `${worldId}/${classCode}/${chunkFile}`;
      const chunkPayload = chunkRecords.map((record) => record.data);
      files.set(chunkRelative, chunkPayload);
      const chunkHash = sha256(stableJson(chunkPayload));
      const chunkItemIds = chunkRecords.map((record) => record.featureId);
      chunks.push({ file: chunkFile, itemCount: chunkRecords.length, items: chunkItemIds });
      chunkManifest.chunks.push({
        chunkPath: `Data_Merge/${chunkRelative}`,
        worldId,
        classCode,
        chunkId,
        featureCount: chunkRecords.length,
        contentHash: chunkHash,
      });
      for (const record of chunkRecords) {
        mergeIndex.features[featureKey(record)] = {
          projectId: record.projectId,
          worldId: record.worldId,
          classCode: record.classCode,
          kindPath: record.kindPath,
          featureId: record.featureId,
          sourcePath: sourcePathFor(record),
          mergeChunk: `Data_Merge/${chunkRelative}`,
          contentHash: record.contentHash,
        };
      }
    }
    files.set(`${worldId}/${classCode}/INDEX.json`, {
      version: 1,
      itemCount: classRecords.length,
      updatedAt: GENERATED_AT,
      items,
      chunkSize,
      chunkCount: chunks.length,
      chunks,
    });
    worldClassCounts.set(worldId, (worldClassCounts.get(worldId) ?? 0) + classRecords.length);
  }

  for (const world of collected.context.worlds.items.filter((item) => worldClassCounts.has(item.id))) {
    files.set(`${world.id}/INDEX.json`, {
      version: 1,
      updatedAt: GENERATED_AT,
      itemCount: worldClassCounts.get(world.id) ?? 0,
    });
  }
  files.set('INDEX.json', {
    version: 1,
    updatedAt: GENERATED_AT,
    itemCount: records.length,
    worlds: [...worldClassCounts.entries()].sort().map(([worldId, itemCount]) => ({ worldId, itemCount })),
  });

  const dataVersion = {
    schemaVersion: 'cairnmap.feature-data-index.data-version.v1',
    dataVersion: `full-rebuild-${GENERATED_AT.replace(/[-:.]/g, '').slice(0, 15)}Z`,
    generatedAt: GENERATED_AT,
    projectId: options.projectId,
    sourceProfile: 'featureData.github.currentOpenRIAMapData',
    mergeStrategy: 'full-rebuild-config-worlds-only',
    builderVersion: 'DATA_MERGE_BUILD_LOCAL_1.full-builder',
    featureCount: records.length,
    chunkCount: chunkManifest.chunks.length,
  };

  const summary = {
    scannedFeatureFiles: walkJsonFiles(options.splitRoot).length,
    processedFeatures: records.length,
    skippedWorldDirs: skippedWorldDirs.length,
    skippedFiles: skippedFiles.length,
    classCount: byClass.size,
    chunkCount: chunkManifest.chunks.length,
    warningCount: warnings.length,
    errorCount: errors.length,
  };

  const report = {
    schemaVersion: 'cairnmap.feature-merge-build-report.v1',
    patchId: 'DATA_MERGE_BUILD_LOCAL_1',
    generatedAt: GENERATED_AT,
    writeMode: Boolean(options.write),
    inputs: {
      splitRoot: normalizeSlashes(options.splitRoot),
      mergeRoot: normalizeSlashes(options.mergeRoot),
      indexRoot: normalizeSlashes(options.indexRoot),
      projectId: options.projectId,
      layout: options.layout,
      chunkSize,
      strictWorlds: Boolean(options.strictWorlds),
    },
    outputs: {
      mergeRoot: normalizeSlashes(options.mergeRoot),
      indexRoot: normalizeSlashes(options.indexRoot),
      buildReport: normalizeSlashes(path.join(options.outRoot, 'build-report.json')),
    },
    summary,
    skippedWorldDirs,
    skippedFiles,
    warnings,
    errors,
    finalStatus: errors.length > 0 ? 'FAIL' : 'PASS',
  };

  return {
    files,
    dataIndex: {
      'merge-index.json': mergeIndex,
      'chunk-manifest.json': chunkManifest,
      'data-version.json': dataVersion,
    },
    report,
    records,
  };
}

function cleanRoot(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

export function writeFeatureMergeOutputs(outputs, options) {
  const forbidden = [options.splitRoot, path.join(root, '.cairnmap-tmp', 'relay-input')];
  const mergeRoot = ensureSafeWriteRoot(options.mergeRoot, forbidden, 'mergeRoot');
  const indexRoot = ensureSafeWriteRoot(options.indexRoot, forbidden, 'indexRoot');
  if (path.resolve(mergeRoot) === path.resolve(indexRoot)) throw new Error('[safe-write] mergeRoot and indexRoot must be different directories');
  if (options.clean) {
    cleanRoot(mergeRoot);
    cleanRoot(indexRoot);
  } else {
    fs.mkdirSync(mergeRoot, { recursive: true });
    fs.mkdirSync(indexRoot, { recursive: true });
  }

  for (const [relativePath, payload] of outputs.files.entries()) {
    writeJson(path.join(mergeRoot, normalizeMergeFileMapPath(relativePath)), payload);
  }
  for (const [fileName, payload] of Object.entries(outputs.dataIndex)) {
    writeJson(path.join(indexRoot, fileName), payload);
  }
}

export function writeBuildReport(outputs, options) {
  fs.mkdirSync(options.outRoot, { recursive: true });
  writeJson(path.join(options.outRoot, 'build-report.json'), outputs.report);
}

export function executeFeatureMergeBuild(options) {
  const effectiveOptions = { ...options };
  if (!effectiveOptions.write) {
    effectiveOptions.mergeRoot = path.join(effectiveOptions.outRoot, 'Data_Merge_preview');
    effectiveOptions.indexRoot = path.join(effectiveOptions.outRoot, 'Data_Index_preview');
  }
  const outputs = buildFeatureMergeOutputs(effectiveOptions);
  if (effectiveOptions.clean) {
    if (fs.existsSync(effectiveOptions.outRoot)) fs.rmSync(effectiveOptions.outRoot, { recursive: true, force: true });
    fs.mkdirSync(effectiveOptions.outRoot, { recursive: true });
  }
  if (outputs.report.finalStatus === 'PASS') writeFeatureMergeOutputs(outputs, effectiveOptions);
  writeBuildReport(outputs, effectiveOptions);
  return { outputs, options: effectiveOptions };
}
