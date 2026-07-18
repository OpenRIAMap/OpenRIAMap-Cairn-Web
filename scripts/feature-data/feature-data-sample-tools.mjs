import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

export const root = process.cwd();
export const contractPath = path.join(root, 'project-config', 'packages', 'openriamap-ria', 'environment', 'featureDataContract.json');
export const storageProfilesPath = path.join(root, 'project-config', 'packages', 'openriamap-ria', 'environment', 'storageProfiles.json');
export const contractSchemaPath = path.join(root, 'project-config', 'schemas', 'data', 'cairnmap.feature-data.v1.schema.json');
export const indexSchemaPath = path.join(root, 'project-config', 'schemas', 'data', 'cairnmap.feature-data-index.v1.schema.json');
export const sampleRoot = path.join(root, 'docs', '30_data-contracts', 'examples', 'feature-data-sample');
export const sampleSplitRoot = path.join(sampleRoot, 'Data_Spilt');
export const outputRoot = path.join(root, '.cairnmap-tmp', 'feature-data-sample');

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

export function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (isPlainObject(value)) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function sha256(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : stableJson(value)).digest('hex');
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

export function readContract() {
  return readJson(contractPath);
}

export function loadSampleFeatures() {
  const files = walkJsonFiles(sampleSplitRoot);
  return files.map((filePath) => ({ filePath, data: readJson(filePath) }));
}

export function featureKey(feature) {
  return `${feature.classCode}:${feature.featureId}`;
}

export function sourcePathFor(feature) {
  return `Data_Spilt/${feature.projectId}/${feature.worldId}/${feature.classCode}/${feature.featureId}.json`;
}

export function chunkPathFor(feature, chunkIndex) {
  return `Data_Merge/${feature.projectId}/${feature.worldId}/${feature.classCode}/chunk_${String(chunkIndex).padStart(3, '0')}.json`;
}

export function buildSampleMerge({ clean = true } = {}) {
  const contract = readContract();
  const chunkSize = contract.merge?.chunking?.sampleChunkSize ?? 2;
  if (clean && fs.existsSync(outputRoot)) fs.rmSync(outputRoot, { recursive: true, force: true });

  const records = loadSampleFeatures()
    .map(({ data }) => data)
    .sort((a, b) => `${a.projectId}/${a.worldId}/${a.classCode}/${a.featureId}`.localeCompare(`${b.projectId}/${b.worldId}/${b.classCode}/${b.featureId}`));

  const byWorld = new Map();
  const byClass = new Map();
  for (const feature of records) {
    const worldKey = `${feature.projectId}/${feature.worldId}`;
    const classKey = `${worldKey}/${feature.classCode}`;
    if (!byWorld.has(worldKey)) byWorld.set(worldKey, []);
    if (!byClass.has(classKey)) byClass.set(classKey, []);
    byWorld.get(worldKey).push(feature);
    byClass.get(classKey).push(feature);
  }

  const generatedAt = '1970-01-01T00:00:00.000Z';
  const mergeIndex = {
    schemaVersion: 'cairnmap.feature-data-index.merge-index.v1',
    generatedAt,
    projectId: contract.projectId,
    features: {},
  };
  const chunkManifest = {
    schemaVersion: 'cairnmap.feature-data-index.chunk-manifest.v1',
    generatedAt,
    projectId: contract.projectId,
    chunks: [],
  };

  for (const [classKey, classFeatures] of [...byClass.entries()].sort()) {
    const [projectId, worldId, classCode] = classKey.split('/');
    const classOutDir = path.join(outputRoot, 'Data_Merge', projectId, worldId, classCode);
    const classChunks = [];
    for (let index = 0; index < classFeatures.length; index += chunkSize) {
      const chunkFeatures = classFeatures.slice(index, index + chunkSize);
      const chunkIndex = Math.floor(index / chunkSize);
      const chunkPath = chunkPathFor(chunkFeatures[0], chunkIndex);
      const chunk = {
        schemaVersion: 'cairnmap.feature-data.merge-chunk.v1',
        projectId,
        worldId,
        classCode,
        chunkId: String(chunkIndex).padStart(3, '0'),
        features: chunkFeatures,
      };
      const chunkHash = sha256(chunk);
      writeJson(path.join(outputRoot, chunkPath), chunk);
      classChunks.push({ chunkPath, featureCount: chunkFeatures.length, contentHash: chunkHash });
      chunkManifest.chunks.push({ chunkPath, projectId, worldId, classCode, featureCount: chunkFeatures.length, contentHash: chunkHash });
      for (const feature of chunkFeatures) {
        mergeIndex.features[featureKey(feature)] = {
          projectId: feature.projectId,
          worldId: feature.worldId,
          classCode: feature.classCode,
          featureId: feature.featureId,
          sourcePath: sourcePathFor(feature),
          mergeChunk: chunkPath,
          contentHash: sha256(feature),
        };
      }
    }
    writeJson(path.join(classOutDir, 'INDEX.json'), {
      schemaVersion: 'cairnmap.feature-data.class-index.v1',
      projectId,
      worldId,
      classCode,
      chunks: classChunks,
    });
  }

  for (const [worldKey, worldFeatures] of [...byWorld.entries()].sort()) {
    const [projectId, worldId] = worldKey.split('/');
    const classes = [...new Set(worldFeatures.map((feature) => feature.classCode))].sort().map((classCode) => ({
      classCode,
      indexPath: `Data_Merge/${projectId}/${worldId}/${classCode}/INDEX.json`,
      featureCount: worldFeatures.filter((feature) => feature.classCode === classCode).length,
    }));
    writeJson(path.join(outputRoot, 'Data_Merge', projectId, worldId, 'INDEX.json'), {
      schemaVersion: 'cairnmap.feature-data.world-index.v1',
      projectId,
      worldId,
      classes,
    });
  }

  writeJson(path.join(outputRoot, 'Data_Index', 'merge-index.json'), mergeIndex);
  writeJson(path.join(outputRoot, 'Data_Index', 'chunk-manifest.json'), chunkManifest);
  writeJson(path.join(outputRoot, 'Data_Index', 'data-version.json'), {
    schemaVersion: 'cairnmap.feature-data-index.data-version.v1',
    dataVersion: 'sample-19700101T000000Z',
    generatedAt,
    projectId: contract.projectId,
    sourceProfile: contract.storageProfileRefs.featureData,
    mergeStrategy: contract.merge?.chunking?.strategy ?? 'stable-class-world-chunks',
    builderVersion: 'DATA_FEATURE_REPO_CONTRACT_1.sample-builder',
  });

  return { records, outputRoot };
}
