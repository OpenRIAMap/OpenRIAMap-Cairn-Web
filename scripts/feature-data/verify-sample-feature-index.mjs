#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  buildSampleMerge,
  chunkPathFor,
  featureKey,
  loadSampleFeatures,
  outputRoot,
  readJson,
  rel,
  sourcePathFor,
} from './feature-data-sample-tools.mjs';

const errors = [];
function addError(message) {
  errors.push(message);
}
function ensureBuilt() {
  const mergeIndexPath = path.join(outputRoot, 'Data_Index', 'merge-index.json');
  if (!fs.existsSync(mergeIndexPath)) buildSampleMerge({ clean: true });
}
function readRequired(filePath) {
  if (!fs.existsSync(filePath)) {
    addError(`[missing] ${rel(filePath)} does not exist`);
    return null;
  }
  try {
    return readJson(filePath);
  } catch (error) {
    addError(`[parse-json] ${rel(filePath)}: ${error.message}`);
    return null;
  }
}

ensureBuilt();
const mergeIndex = readRequired(path.join(outputRoot, 'Data_Index', 'merge-index.json'));
const chunkManifest = readRequired(path.join(outputRoot, 'Data_Index', 'chunk-manifest.json'));
const dataVersion = readRequired(path.join(outputRoot, 'Data_Index', 'data-version.json'));
const sampleFeatures = loadSampleFeatures().map(({ data }) => data).sort((a, b) => `${a.classCode}/${a.featureId}`.localeCompare(`${b.classCode}/${b.featureId}`));

if (mergeIndex?.schemaVersion !== 'cairnmap.feature-data-index.merge-index.v1') addError('[merge-index] schemaVersion mismatch');
if (chunkManifest?.schemaVersion !== 'cairnmap.feature-data-index.chunk-manifest.v1') addError('[chunk-manifest] schemaVersion mismatch');
if (dataVersion?.schemaVersion !== 'cairnmap.feature-data-index.data-version.v1') addError('[data-version] schemaVersion mismatch');

const featureEntries = mergeIndex?.features ?? {};
if (Object.keys(featureEntries).length !== sampleFeatures.length) {
  addError(`[merge-index] expected ${sampleFeatures.length} feature entries, got ${Object.keys(featureEntries).length}`);
}
for (const feature of sampleFeatures) {
  const key = featureKey(feature);
  const entry = featureEntries[key];
  if (!entry) {
    addError(`[merge-index] missing feature entry ${key}`);
    continue;
  }
  if (entry.sourcePath !== sourcePathFor(feature)) addError(`[merge-index] ${key} sourcePath mismatch`);
  if (!entry.mergeChunk || !fs.existsSync(path.join(outputRoot, entry.mergeChunk))) addError(`[merge-index] ${key} mergeChunk does not exist: ${entry.mergeChunk || '(missing)'}`);
}

const chunks = chunkManifest?.chunks ?? [];
if (chunks.length !== 3) addError(`[chunk-manifest] expected 3 chunks for 5 sample features with sampleChunkSize=2, got ${chunks.length}`);
for (const chunk of chunks) {
  if (!fs.existsSync(path.join(outputRoot, chunk.chunkPath))) addError(`[chunk-manifest] missing chunk file ${chunk.chunkPath}`);
  if (!Number.isInteger(chunk.featureCount) || chunk.featureCount < 1) addError(`[chunk-manifest] invalid featureCount for ${chunk.chunkPath}`);
}

for (const worldIndex of ['Data_Merge/openriamap-ria/zth/INDEX.json', 'Data_Merge/openriamap-ria/zth/BUD/INDEX.json', 'Data_Merge/openriamap-ria/zth/STA/INDEX.json']) {
  if (!fs.existsSync(path.join(outputRoot, worldIndex))) addError(`[index] missing ${worldIndex}`);
}

console.log('CairnMap FeatureData Sample Index Verification');
console.log(`  Output: ${rel(outputRoot)}`);
if (errors.length > 0) {
  console.error('\nErrors');
  for (const error of errors) console.error(`  - ${error}`);
  console.error('\nFinal result: FAIL');
  process.exitCode = 1;
} else {
  console.log('\nFinal result: PASS');
}
