#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  contractPath,
  storageProfilesPath,
  contractSchemaPath,
  indexSchemaPath,
  sampleSplitRoot,
  featureKey,
  isPlainObject,
  loadSampleFeatures,
  readJson,
  rel,
  sourcePathFor,
} from './feature-data-sample-tools.mjs';

const errors = [];
const warnings = [];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function requireString(value, message) {
  if (typeof value !== 'string' || value.length === 0) addError(message);
}

function requireBoolean(value, message) {
  if (typeof value !== 'boolean') addError(message);
}

function readJsonSafe(filePath) {
  try {
    return readJson(filePath);
  } catch (error) {
    addError(`[parse-json] ${rel(filePath)}: ${error.message}`);
    return null;
  }
}

function validateContract(contract, storageProfiles) {
  if (!contract) return;
  if (contract.schemaVersion !== 'cairnmap.feature-data.v1') addError(`[schema-version] ${rel(contractPath)} expected cairnmap.feature-data.v1`);
  if (contract.projectId !== 'openriamap-ria') addWarning(`[projectId] expected openriamap-ria, got ${contract.projectId || '(missing)'}`);
  if (contract.runtimeStatus !== 'contract-only') addWarning(`[runtimeStatus] expected contract-only for DATA_FEATURE_REPO_CONTRACT_1, got ${contract.runtimeStatus || '(missing)'}`);

  if (!isPlainObject(contract.storageProfileRefs)) addError('[storageProfileRefs] must be an object');
  if (!isPlainObject(contract.roots)) addError('[roots] must be an object');
  if (!isPlainObject(contract.split)) addError('[split] must be an object');
  if (!isPlainObject(contract.merge)) addError('[merge] must be an object');
  if (!isPlainObject(contract.index)) addError('[index] must be an object');

  for (const key of ['splitRoot', 'mergeRoot', 'indexRoot']) requireString(contract.roots?.[key], `[roots] roots.${key} is required`);
  for (const key of ['featureData', 'media', 'mediaIndex', 'relayPool']) requireString(contract.storageProfileRefs?.[key], `[storageProfileRefs] ${key} is required`);
  requireBoolean(contract.split?.sourceOfTruth, '[split] sourceOfTruth must be boolean');
  requireBoolean(contract.merge?.runtimeCache, '[merge] runtimeCache must be boolean');
  requireString(contract.split?.pathTemplate, '[split] pathTemplate is required');
  requireString(contract.merge?.chunkPathTemplate, '[merge] chunkPathTemplate is required');
  requireString(contract.index?.mergeIndexPath, '[index] mergeIndexPath is required');
  requireString(contract.index?.chunkManifestPath, '[index] chunkManifestPath is required');
  requireString(contract.index?.dataVersionPath, '[index] dataVersionPath is required');

  if (contract.split?.sourceOfTruth !== true) addError('[split] Data_Spilt must remain the source of truth');
  if (contract.merge?.runtimeCache !== true) addError('[merge] Data_Merge must be declared as runtime cache');
  if (contract.compatibility?.doNotReplaceCurrentDataRuntimeInThisPatch !== true) {
    addWarning('[compatibility] doNotReplaceCurrentDataRuntimeInThisPatch should be true for this contract-only patch');
  }

  const profileIds = new Set(Array.isArray(storageProfiles?.profiles) ? storageProfiles.profiles.map((profile) => profile.id) : []);
  for (const [role, profileId] of Object.entries(contract.storageProfileRefs ?? {})) {
    if (!profileIds.has(profileId)) addError(`[storageProfileRefs] ${role} references missing storage profile id "${profileId}"`);
  }
}

function validateSampleFeatures(contract) {
  if (!fs.existsSync(sampleSplitRoot)) {
    addError(`[sample] missing ${rel(sampleSplitRoot)}`);
    return;
  }
  const sampleFeatures = loadSampleFeatures();
  if (sampleFeatures.length < 3) addError('[sample] expected at least 3 sample features');
  const required = contract?.split?.requiredRecordFields ?? ['projectId', 'worldId', 'classCode', 'featureId', 'geometry', 'properties'];
  const seen = new Set();
  const classes = new Set();
  const worlds = new Set();
  for (const { filePath, data } of sampleFeatures) {
    for (const field of required) {
      if (data[field] === undefined || data[field] === null || data[field] === '') addError(`[sample] ${rel(filePath)} missing required field ${field}`);
    }
    if (!isPlainObject(data.geometry) || typeof data.geometry.type !== 'string') addError(`[sample] ${rel(filePath)} geometry.type is required`);
    if (!isPlainObject(data.properties)) addError(`[sample] ${rel(filePath)} properties must be an object`);
    const key = featureKey(data);
    if (seen.has(key)) addError(`[sample] duplicate feature key ${key}`);
    seen.add(key);
    if (data.classCode) classes.add(data.classCode);
    if (data.worldId) worlds.add(data.worldId);
    const expectedSuffix = sourcePathFor(data);
    const normalizedPath = rel(filePath);
    if (!normalizedPath.endsWith(expectedSuffix)) {
      addError(`[sample] ${normalizedPath} does not match expected split path suffix ${expectedSuffix}`);
    }
  }
  if (classes.size < 2) addError('[sample] expected at least 2 classes in the sample fixture');
  if (worlds.size !== 1 || !worlds.has('zth')) addWarning(`[sample] expected zth-only sample fixture, got ${Array.from(worlds).join(', ') || '(none)'}`);
}

for (const requiredPath of [contractPath, storageProfilesPath, contractSchemaPath, indexSchemaPath]) {
  if (!fs.existsSync(requiredPath)) addError(`[missing] ${rel(requiredPath)} does not exist`);
}

const contract = fs.existsSync(contractPath) ? readJsonSafe(contractPath) : null;
const storageProfiles = fs.existsSync(storageProfilesPath) ? readJsonSafe(storageProfilesPath) : null;
if (fs.existsSync(contractSchemaPath)) readJsonSafe(contractSchemaPath);
if (fs.existsSync(indexSchemaPath)) readJsonSafe(indexSchemaPath);

validateContract(contract, storageProfiles);
validateSampleFeatures(contract);

console.log('CairnMap FeatureData Contract Validation');
console.log(`  Contract: ${rel(contractPath)}`);
console.log(`  Sample: ${rel(sampleSplitRoot)}`);
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
