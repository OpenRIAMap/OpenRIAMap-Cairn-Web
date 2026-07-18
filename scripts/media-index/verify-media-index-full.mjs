#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { defaultOutRoot, executeMediaIndexBuild, parseMediaIndexBuildArgs, rel } from './media-index-build-tools.mjs';

const errors = [];
const warnings = [];
function addError(message) { errors.push(message); }
function addWarning(message) { warnings.push(message); }

function readJsonSafe(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch (error) { addError(`[parse-json] ${rel(filePath)}: ${error.message}`); return null; }
}

function exists(filePath, label) {
  if (!fs.existsSync(filePath)) {
    addError(`[missing] ${label}: ${rel(filePath)}`);
    return false;
  }
  return true;
}

try {
  const parsed = parseMediaIndexBuildArgs();
  const options = parsed.help ? { outRoot: defaultOutRoot } : parsed;
  const reportPath = path.join(options.outRoot ?? defaultOutRoot, 'build-report.json');
  if (!fs.existsSync(reportPath)) executeMediaIndexBuild({ ...options, write: false });

  const report = readJsonSafe(reportPath);
  if (report?.schemaVersion !== 'cairnmap.media-index-build-report.v1') addError('[report] schemaVersion mismatch');
  if (report?.finalStatus !== 'PASS') addError(`[report] finalStatus expected PASS, got ${report?.finalStatus || '(missing)'}`);

  const mergeRoot = report?.outputs?.mergeRoot;
  if (!mergeRoot || !exists(mergeRoot, 'merge root')) throw new Error('merge root missing');

  const rootIndexPath = path.join(mergeRoot, 'INDEX.json');
  const rootIndex = exists(rootIndexPath, 'root index') ? readJsonSafe(rootIndexPath) : null;
  if (rootIndex?.schemaVersion !== 'cairnmap.media-index.merge-root-index.v1') addError('[root-index] schemaVersion mismatch');
  if (rootIndex?.layout !== 'world-first') addError('[root-index] layout must be world-first');

  const projectAwareDir = path.join(mergeRoot, report?.inputs?.projectId ?? 'openriamap-ria');
  if (fs.existsSync(projectAwareDir)) addError(`[layout] Media_Index_Merge must not contain project-aware directory ${rel(projectAwareDir)}`);

  let worldCount = 0;
  let bindingCount = 0;
  let assetCount = 0;
  for (const world of rootIndex?.worlds ?? []) {
    const worldIndexPath = path.join(mergeRoot, world.worldId, 'INDEX.json');
    const worldIndex = exists(worldIndexPath, `world index ${world.worldId}`) ? readJsonSafe(worldIndexPath) : null;
    if (worldIndex?.schemaVersion !== 'cairnmap.media-index.merge-world-index.v1') addError(`[world-index] ${world.worldId} schemaVersion mismatch`);
    if (worldIndex?.worldId !== world.worldId) addError(`[world-index] ${world.worldId} worldId mismatch`);
    worldCount += 1;
    bindingCount += Number(worldIndex?.bindingCount ?? 0);
    assetCount += Number(worldIndex?.assetCount ?? 0);
    for (const feature of worldIndex?.features ?? []) {
      const byFeaturePath = path.join(mergeRoot, world.worldId, feature.path);
      if (!exists(byFeaturePath, `by-feature ${world.worldId}/${feature.path}`)) continue;
      const byFeature = readJsonSafe(byFeaturePath);
      if (byFeature?.schemaVersion !== 'cairnmap.media-index.by-feature.v1') addError(`[by-feature] ${world.worldId}/${feature.path} schemaVersion mismatch`);
      if (byFeature?.featureRef?.worldId !== world.worldId) addError(`[by-feature] ${world.worldId}/${feature.path} featureRef.worldId mismatch`);
      for (const item of byFeature?.media ?? []) {
        const assetPath = path.join(mergeRoot, world.worldId, 'assets', `${item.mediaId}.json`);
        if (!exists(assetPath, `asset ${world.worldId}/${item.mediaId}`)) continue;
        const asset = readJsonSafe(assetPath);
        if (asset?.mediaId !== item.mediaId) addError(`[asset] ${world.worldId}/${item.mediaId} mediaId mismatch`);
      }
    }
  }

  if (worldCount !== report?.summary?.processedWorlds) addError(`[root-index] world count ${worldCount} does not match report ${report?.summary?.processedWorlds}`);
  if (bindingCount !== report?.summary?.processedBindings) addError(`[world-index] binding count ${bindingCount} does not match report ${report?.summary?.processedBindings}`);
  if (assetCount < 0) addError('[asset] impossible asset count');
  if ((report?.warnings ?? []).some((warning) => String(warning).includes('[legacy]'))) addWarning('[legacy] legacy project-aware Media_Index_Spilt binding path was normalized as expected');

  console.log('CairnMap MediaIndex Full Verification');
  console.log(`  Build report: ${rel(reportPath)}`);
  console.log(`  Merge root: ${rel(mergeRoot)}`);
  console.log(`  Worlds/assets/bindings: ${worldCount}/${assetCount}/${bindingCount}`);
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
  console.error('CairnMap MediaIndex Full Verification');
  console.error(`\nFatal error: ${error.message}`);
  process.exitCode = 1;
}
