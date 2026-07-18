#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  assetSchemaPath,
  bindingSchemaPath,
  contractPath,
  contractSchemaPath,
  isPlainObject,
  loadAssets,
  loadBindings,
  mergeSchemaPath,
  nativeFeaturePath,
  nativePicturePath,
  readJson,
  rel,
  sampleAssetRoot,
  sampleBindingRoot,
  storageProfilesPath,
} from './media-index-sample-tools.mjs';

const errors = [];
const warnings = [];
function addError(message) { errors.push(message); }
function addWarning(message) { warnings.push(message); }
function requireString(value, message) { if (typeof value !== 'string' || value.length === 0) addError(message); }
function requireObject(value, message) { if (!isPlainObject(value)) addError(message); }
function readJsonSafe(filePath) {
  try { return readJson(filePath); }
  catch (error) { addError(`[parse-json] ${rel(filePath)}: ${error.message}`); return null; }
}

for (const requiredPath of [contractPath, storageProfilesPath, contractSchemaPath, assetSchemaPath, bindingSchemaPath, mergeSchemaPath]) {
  if (!fs.existsSync(requiredPath)) addError(`[missing] ${rel(requiredPath)} does not exist`);
  else readJsonSafe(requiredPath);
}

const contract = fs.existsSync(contractPath) ? readJsonSafe(contractPath) : null;
const storageProfiles = fs.existsSync(storageProfilesPath) ? readJsonSafe(storageProfilesPath) : null;

if (contract) {
  if (contract.schemaVersion !== 'cairnmap.media-index-contract.v1') addError(`[schema-version] ${rel(contractPath)} expected cairnmap.media-index-contract.v1`);
  if (contract.projectId !== 'openriamap-ria') addWarning(`[projectId] expected openriamap-ria, got ${contract.projectId || '(missing)'}`);
  if (contract.runtimeStatus !== 'contract-only') addWarning(`[runtimeStatus] expected contract-only for DATA_MEDIA_INDEX_CONTRACT_1, got ${contract.runtimeStatus || '(missing)'}`);
  requireObject(contract.storageProfileRefs, '[storageProfileRefs] must be an object');
  requireObject(contract.roots, '[roots] must be an object');
  requireObject(contract.asset, '[asset] must be an object');
  requireObject(contract.binding, '[binding] must be an object');
  requireObject(contract.merge, '[merge] must be an object');
  for (const key of ['media', 'mediaIndex', 'featureData', 'relayPool']) requireString(contract.storageProfileRefs?.[key], `[storageProfileRefs] ${key} is required`);
  for (const key of ['splitRoot', 'mergeRoot', 'assetSplitRoot', 'bindingSplitRoot', 'byFeatureMergeRoot', 'assetMergeRoot']) requireString(contract.roots?.[key], `[roots] ${key} is required`);
  if (contract.nativeRelayCompatibility?.doNotChangeNativeRelayPackagePictureShape !== true) addWarning('[nativeRelayCompatibility] expected doNotChangeNativeRelayPackagePictureShape=true');
  if (contract.compatibility?.doNotReplaceCurrentPictureRuntimeInThisPatch !== true) addWarning('[compatibility] expected doNotReplaceCurrentPictureRuntimeInThisPatch=true');
  if (contract.compatibility?.doNotWriteImageUrlsIntoFeatureJson !== true) addWarning('[compatibility] expected doNotWriteImageUrlsIntoFeatureJson=true');

  const profileIds = new Set(Array.isArray(storageProfiles?.profiles) ? storageProfiles.profiles.map((profile) => profile.id) : []);
  for (const [role, profileId] of Object.entries(contract.storageProfileRefs ?? {})) {
    if (!profileIds.has(profileId)) addError(`[storageProfileRefs] ${role} references missing storage profile id "${profileId}"`);
  }
}

if (!fs.existsSync(sampleAssetRoot)) addError(`[sample] missing ${rel(sampleAssetRoot)}`);
if (!fs.existsSync(sampleBindingRoot)) addError(`[sample] missing ${rel(sampleBindingRoot)}`);

const assets = fs.existsSync(sampleAssetRoot) ? loadAssets() : [];
const bindings = fs.existsSync(sampleBindingRoot) ? loadBindings() : [];
if (assets.length < 1) addError('[sample] expected at least 1 MediaAsset record');
if (bindings.length < 1) addError('[sample] expected at least 1 MediaBinding record');

const assetIds = new Set();
for (const { filePath, data } of assets) {
  if (data.schemaVersion !== 'cairnmap.media-asset.v1') addError(`[asset] ${rel(filePath)} expected schemaVersion cairnmap.media-asset.v1`);
  requireString(data.mediaId, `[asset] ${rel(filePath)} mediaId is required`);
  requireString(data.mediaType, `[asset] ${rel(filePath)} mediaType is required`);
  requireString(data.storageProfile, `[asset] ${rel(filePath)} storageProfile is required`);
  requireString(data.objectKey, `[asset] ${rel(filePath)} objectKey is required`);
  requireString(data.mimeType, `[asset] ${rel(filePath)} mimeType is required`);
  requireString(data.status, `[asset] ${rel(filePath)} status is required`);
  if (data.mediaId && assetIds.has(data.mediaId)) addError(`[asset] duplicate mediaId ${data.mediaId}`);
  if (data.mediaId) assetIds.add(data.mediaId);
  if (data.mediaType !== 'image') addError(`[asset] ${rel(filePath)} mediaType must be image in v1`);
  if (data.storageProfile !== contract?.storageProfileRefs?.media) addError(`[asset] ${rel(filePath)} storageProfile ${data.storageProfile} does not match contract media profile`);
  const picturePath = nativePicturePath(data);
  if (!fs.existsSync(picturePath)) addError(`[asset] ${rel(filePath)} objectKey does not resolve to native relay sample picture: ${rel(picturePath)}`);
  if (Number.isInteger(data.sizeBytes) && fs.existsSync(picturePath)) {
    const actualSize = fs.statSync(picturePath).size;
    if (data.sizeBytes !== actualSize) addError(`[asset] ${rel(filePath)} sizeBytes=${data.sizeBytes} but actual=${actualSize}`);
  }
}

const seenBindings = new Set();
for (const { filePath, data } of bindings) {
  if (data.schemaVersion !== 'cairnmap.media-binding.v1') addError(`[binding] ${rel(filePath)} expected schemaVersion cairnmap.media-binding.v1`);
  requireObject(data.featureRef, `[binding] ${rel(filePath)} featureRef must be an object`);
  for (const key of ['projectId', 'worldId', 'classCode', 'featureId']) requireString(data.featureRef?.[key], `[binding] ${rel(filePath)} featureRef.${key} is required`);
  if (!Array.isArray(data.media) || data.media.length < 1) addError(`[binding] ${rel(filePath)} media must contain at least one item`);
  const bindingKey = `${data.featureRef?.projectId}/${data.featureRef?.worldId}/${data.featureRef?.classCode}/${(data.featureRef?.kindPath ?? []).join('/')}/${data.featureRef?.featureId}`;
  if (seenBindings.has(bindingKey)) addError(`[binding] duplicate feature binding ${bindingKey}`);
  seenBindings.add(bindingKey);
  const featurePath = nativeFeaturePath(data.featureRef ?? {});
  if (!fs.existsSync(featurePath)) addError(`[binding] ${rel(filePath)} featureRef does not resolve to native relay sample feature: ${rel(featurePath)}`);
  let visibleCoverCount = 0;
  const orders = new Set();
  for (const item of Array.isArray(data.media) ? data.media : []) {
    if (!assetIds.has(item.mediaId)) addError(`[binding] ${rel(filePath)} references missing mediaId ${item.mediaId}`);
    if (item.role === 'cover' && item.visible === true) visibleCoverCount += 1;
    if (orders.has(item.order)) addWarning(`[binding] ${rel(filePath)} duplicate order ${item.order}`);
    orders.add(item.order);
  }
  if (visibleCoverCount > 1) addError(`[binding] ${rel(filePath)} has more than one visible cover`);
}

console.log('CairnMap MediaIndex Contract Validation');
console.log(`  Contract: ${rel(contractPath)}`);
console.log(`  Assets: ${assets.length}`);
console.log(`  Bindings: ${bindings.length}`);
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
