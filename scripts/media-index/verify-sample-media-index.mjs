#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  buildSampleMediaIndex,
  loadAssets,
  loadBindings,
  outputRoot,
  rel,
  readJson,
  bindingMergePath,
  assetMergePath,
} from './media-index-sample-tools.mjs';

const errors = [];
function addError(message) { errors.push(message); }
function readJsonSafe(filePath) {
  try { return readJson(filePath); }
  catch (error) { addError(`[parse-json] ${rel(filePath)}: ${error.message}`); return null; }
}

if (!fs.existsSync(outputRoot)) buildSampleMediaIndex({ clean: true });
const assets = loadAssets();
const bindings = loadBindings();

for (const { data: binding } of bindings) {
  const byFeaturePath = bindingMergePath(binding.featureRef);
  if (!fs.existsSync(byFeaturePath)) {
    addError(`[missing] expected by-feature merge output ${rel(byFeaturePath)}`);
    continue;
  }
  const generated = readJsonSafe(byFeaturePath);
  if (generated?.schemaVersion !== 'cairnmap.media-index.by-feature.v1') addError(`[schema-version] ${rel(byFeaturePath)} expected cairnmap.media-index.by-feature.v1`);
  if (!Array.isArray(generated?.media) || generated.media.length !== binding.media.length) addError(`[media-count] ${rel(byFeaturePath)} media count mismatch`);
  for (const item of generated?.media ?? []) {
    if (!item.asset) addError(`[asset-resolution] ${rel(byFeaturePath)} mediaId ${item.mediaId} did not resolve to an asset`);
  }
}

for (const { data: binding } of bindings) {
  const projectId = binding.featureRef.projectId;
  const worldId = binding.featureRef.worldId;
  for (const mediaItem of binding.media) {
    const assetPath = assetMergePath(projectId, worldId, mediaItem.mediaId);
    if (!fs.existsSync(assetPath)) addError(`[missing] expected asset merge output ${rel(assetPath)}`);
    const generatedAsset = fs.existsSync(assetPath) ? readJsonSafe(assetPath) : null;
    if (generatedAsset?.mediaId !== mediaItem.mediaId) addError(`[asset] ${rel(assetPath)} mediaId mismatch`);
  }
}

const worldIndexPath = path.join(outputRoot, 'Media_Index_Merge', 'zth', 'INDEX.json');
if (!fs.existsSync(worldIndexPath)) addError(`[missing] expected world index ${rel(worldIndexPath)}`);
else {
  const worldIndex = readJsonSafe(worldIndexPath);
  if (worldIndex?.schemaVersion !== 'cairnmap.media-index.merge-world-index.v1') addError(`[schema-version] ${rel(worldIndexPath)} expected cairnmap.media-index.merge-world-index.v1`);
  if (worldIndex?.assetCount !== assets.length) addError(`[asset-count] ${rel(worldIndexPath)} expected ${assets.length}, got ${worldIndex?.assetCount}`);
  if (worldIndex?.bindingCount !== bindings.length) addError(`[binding-count] ${rel(worldIndexPath)} expected ${bindings.length}, got ${worldIndex?.bindingCount}`);
}

console.log('CairnMap MediaIndex sample verification');
console.log(`  Output: ${rel(outputRoot)}`);
console.log(`  Assets: ${assets.length}`);
console.log(`  Bindings: ${bindings.length}`);
if (errors.length > 0) {
  console.error('\nErrors');
  for (const error of errors) console.error(`  - ${error}`);
  console.error('\nFinal result: FAIL');
  process.exitCode = 1;
} else {
  console.log('\nFinal result: PASS');
}
