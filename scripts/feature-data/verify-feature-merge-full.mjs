#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { defaultOutRoot, executeFeatureMergeBuild, parseFeatureMergeBuildArgs, rel } from './feature-merge-build-tools.mjs';

const errors = [];
const warnings = [];
function addError(message) { errors.push(message); }
function addWarning(message) { warnings.push(message); }

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    addError(`[parse-json] ${rel(filePath)}: ${error.message}`);
    return null;
  }
}

function exists(filePath, label) {
  if (!fs.existsSync(filePath)) {
    addError(`[missing] ${label}: ${rel(filePath)}`);
    return false;
  }
  return true;
}

try {
  const parsed = parseFeatureMergeBuildArgs();
  const options = parsed.help ? { outRoot: defaultOutRoot } : parsed;
  const reportPath = path.join(options.outRoot ?? defaultOutRoot, 'build-report.json');
  if (!fs.existsSync(reportPath)) executeFeatureMergeBuild({ ...options, write: false });

  const report = readJsonSafe(reportPath);
  if (report?.schemaVersion !== 'cairnmap.feature-merge-build-report.v1') addError('[report] schemaVersion mismatch');
  if (report?.finalStatus !== 'PASS') addError(`[report] finalStatus expected PASS, got ${report?.finalStatus || '(missing)'}`);

  const mergeRoot = report?.outputs?.mergeRoot;
  const indexRoot = report?.outputs?.indexRoot;
  if (!mergeRoot || !exists(mergeRoot, 'merge root')) throw new Error('merge root missing');
  if (!indexRoot || !exists(indexRoot, 'index root')) throw new Error('index root missing');

  const mergeIndexPath = path.join(indexRoot, 'merge-index.json');
  const chunkManifestPath = path.join(indexRoot, 'chunk-manifest.json');
  const dataVersionPath = path.join(indexRoot, 'data-version.json');
  const mergeIndex = exists(mergeIndexPath, 'merge-index') ? readJsonSafe(mergeIndexPath) : null;
  const chunkManifest = exists(chunkManifestPath, 'chunk-manifest') ? readJsonSafe(chunkManifestPath) : null;
  const dataVersion = exists(dataVersionPath, 'data-version') ? readJsonSafe(dataVersionPath) : null;

  if (mergeIndex?.schemaVersion !== 'cairnmap.feature-data-index.merge-index.v1') addError('[merge-index] schemaVersion mismatch');
  if (chunkManifest?.schemaVersion !== 'cairnmap.feature-data-index.chunk-manifest.v1') addError('[chunk-manifest] schemaVersion mismatch');
  if (dataVersion?.schemaVersion !== 'cairnmap.feature-data-index.data-version.v1') addError('[data-version] schemaVersion mismatch');

  const featureCount = Object.keys(mergeIndex?.features ?? {}).length;
  if (featureCount !== report?.summary?.processedFeatures) addError(`[merge-index] feature count ${featureCount} does not match report ${report?.summary?.processedFeatures}`);
  const chunks = chunkManifest?.chunks ?? [];
  if (chunks.length !== report?.summary?.chunkCount) addError(`[chunk-manifest] chunk count ${chunks.length} does not match report ${report?.summary?.chunkCount}`);

  for (const chunk of chunks) {
    const relativeChunk = String(chunk.chunkPath || '').replace(/^Data_Merge\//, '');
    const chunkFile = path.join(mergeRoot, relativeChunk);
    if (!exists(chunkFile, `chunk ${chunk.chunkPath}`)) continue;
    const payload = readJsonSafe(chunkFile);
    if (!Array.isArray(payload)) addError(`[chunk] ${chunk.chunkPath} must be an array`);
    else if (payload.length !== chunk.featureCount) addError(`[chunk] ${chunk.chunkPath} expected ${chunk.featureCount}, got ${payload.length}`);
  }

  for (const [key, entry] of Object.entries(mergeIndex?.features ?? {})) {
    if (entry.worldId === '0') addError(`[world] merge-index must not include numeric error world 0 (${key})`);
    const relativeChunk = String(entry.mergeChunk || '').replace(/^Data_Merge\//, '');
    if (!fs.existsSync(path.join(mergeRoot, relativeChunk))) addError(`[merge-index] ${key} mergeChunk missing: ${entry.mergeChunk}`);
  }

  if (fs.existsSync(path.join(mergeRoot, '0'))) addError('[world] Data_Merge output must not include skipped numeric world directory 0');
  if ((report?.skippedWorldDirs ?? []).some((item) => item.worldId === '0')) addWarning('[world] skipped legacy/error world directory 0 was reported as expected');

  console.log('CairnMap FeatureData Full Merge Verification');
  console.log(`  Build report: ${rel(reportPath)}`);
  console.log(`  Merge root: ${rel(mergeRoot)}`);
  console.log(`  Index root: ${rel(indexRoot)}`);
  console.log(`  Features/chunks: ${featureCount}/${chunks.length}`);
  if (warnings.length > 0) {
    console.log('\nWarnings');
    for (const warning of warnings) console.log(`  - ${warning}`);
  }
  if (errors.length > 0) {
    console.error('\nErrors');
    for (const error of errors) console.error(`  - ${error}`);
    console.error('\nFinal result: FAIL');
    process.exitCode = 1;
  } else {
    console.log('\nFinal result: PASS');
  }
} catch (error) {
  console.error('CairnMap FeatureData Full Merge Verification');
  console.error(`\nFatal error: ${error.message}`);
  process.exitCode = 1;
}
