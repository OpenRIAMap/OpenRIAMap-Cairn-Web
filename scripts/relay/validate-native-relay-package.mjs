#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  deleteSchemaPath,
  indexSchemaPath,
  isPlainObject,
  loadClassConfigs,
  loadWorlds,
  packagePaths,
  parseArgs,
  protocolPath,
  protocolSchemaPath,
  readJson,
  readPackage,
  rel,
  reviewSchemaPath,
  storageProfilesPath,
} from './native-relay-package-tools.mjs';
import { resolveNativeRelayInput } from './native-relay-input-resolver.mjs';
import { createNativeRelayConfigContext, resolveNativeFeatureFile, resolveNativePictureFile } from './native-relay-config-resolver.mjs';

const errors = [];
const warnings = [];
function addError(message) { errors.push(message); }
function addWarning(message) { warnings.push(message); }
function requireString(value, message) { if (typeof value !== 'string' || value.length === 0) addError(message); }
function readJsonSafe(filePath) {
  try { return readJson(filePath); }
  catch (error) { addError(`[parse-json] ${rel(filePath)}: ${error.message}`); return null; }
}

let args;
try { args = parseArgs(); }
catch (error) { console.error(error.message); process.exit(1); }
if (args.help) {
  console.log('Usage: npm run validate:native-relay-package -- [--package <NativeRelayPackageDirOrZip>]');
  process.exit(0);
}

let relayInput = null;
let packageRoot = args.packageRoot;
try {
  relayInput = await resolveNativeRelayInput(args.packageRoot, { clean: true });
  packageRoot = relayInput.packageRoot;
} catch (error) {
  addError(error.message);
}
const paths = packagePaths(packageRoot);

for (const requiredPath of [protocolPath, storageProfilesPath, protocolSchemaPath, indexSchemaPath, deleteSchemaPath, reviewSchemaPath]) {
  if (!fs.existsSync(requiredPath)) addError(`[missing] ${rel(requiredPath)} does not exist`);
  else readJsonSafe(requiredPath);
}

const protocol = fs.existsSync(protocolPath) ? readJsonSafe(protocolPath) : null;
const storageProfiles = fs.existsSync(storageProfilesPath) ? readJsonSafe(storageProfilesPath) : null;

if (!fs.existsSync(packageRoot)) addError(`[missing] package root does not exist: ${rel(packageRoot)}`);
for (const requiredPath of [paths.indexPath, paths.deletePath, paths.reviewPath, paths.splitRoot]) {
  if (!fs.existsSync(requiredPath)) addError(`[missing] ${rel(requiredPath)} does not exist`);
}

if (protocol) {
  if (protocol.schemaVersion !== 'cairnmap.native-relay-protocol.v1') addError(`[schema-version] ${rel(protocolPath)} expected cairnmap.native-relay-protocol.v1`);
  if (protocol.projectId !== 'openriamap-ria') addWarning(`[projectId] expected openriamap-ria, got ${protocol.projectId || '(missing)'}`);
  if (protocol.runtimeStatus !== 'contract-only') addWarning(`[runtimeStatus] expected contract-only for CM_RELAY_PACKAGE_PROTOCOL_1, got ${protocol.runtimeStatus || '(missing)'}`);
  for (const key of ['indexFile', 'deleteFile', 'reviewFile', 'splitRoot', 'pictureRoot']) requireString(protocol.roots?.[key], `[roots] roots.${key} is required`);
  if (protocol.semantics?.operationArrays !== 'not-required-in-native-v1') addWarning('[semantics] operationArrays should remain not-required-in-native-v1 for this patch');
  if (protocol.compatibility?.doNotIntroduceOperationArrayProtocolInThisPatch !== true) addWarning('[compatibility] expected doNotIntroduceOperationArrayProtocolInThisPatch=true');

  const profileIds = new Set(Array.isArray(storageProfiles?.profiles) ? storageProfiles.profiles.map((profile) => profile.id) : []);
  for (const [role, profileId] of Object.entries(protocol.storageProfileRefs ?? {})) {
    if (!profileIds.has(profileId)) addError(`[storageProfileRefs] ${role} references missing storage profile id "${profileId}"`);
  }
}

const loaded = fs.existsSync(packageRoot) ? readPackage(packageRoot) : null;
const configContext = fs.existsSync(paths.splitRoot) ? createNativeRelayConfigContext(protocol?.projectId ?? 'openriamap-ria') : null;

if (loaded?.index) {
  requireString(loaded.index.schemaVersion, `[index] ${rel(paths.indexPath)} schemaVersion is required`);
  requireString(loaded.index.operator, `[index] ${rel(paths.indexPath)} operator is required`);
  requireString(loaded.index.version, `[index] ${rel(paths.indexPath)} version is required`);
  requireString(loaded.index.packageVersion, `[index] ${rel(paths.indexPath)} packageVersion is required`);
  requireString(loaded.index.exportedAt, `[index] ${rel(paths.indexPath)} exportedAt is required`);
  for (const key of ['featureCount', 'pictureCount', 'deleteCount']) {
    if (!Number.isInteger(loaded.index[key]) || loaded.index[key] < 0) addError(`[index] ${key} must be a non-negative integer`);
  }
}
if (loaded?.deleteTable) {
  requireString(loaded.deleteTable.deleteTime, `[delete] ${rel(paths.deletePath)} deleteTime is required`);
  if (!Array.isArray(loaded.deleteTable.items)) addError(`[delete] ${rel(paths.deletePath)} items must be an array`);
}
if (loaded?.review) {
  if (loaded.review.schemaVersion !== 'cairnmap.native-relay-review.v1') addError(`[review] ${rel(paths.reviewPath)} expected schemaVersion cairnmap.native-relay-review.v1`);
  requireString(loaded.review.status, `[review] ${rel(paths.reviewPath)} status is required`);
  if (!Array.isArray(loaded.review.notes)) addError(`[review] ${rel(paths.reviewPath)} notes must be an array`);
  if (!isPlainObject(loaded.review.precheck)) addError(`[review] ${rel(paths.reviewPath)} precheck must be an object`);
}

const featureFiles = loaded?.featureFiles ?? [];
const pictureFiles = loaded?.pictureFiles ?? [];
const deleteItems = Array.isArray(loaded?.deleteTable?.items) ? loaded.deleteTable.items : [];
if (featureFiles.length === 0) addWarning('[features] no feature JSON files found in Data_Spilt');

const seenFeaturePaths = new Set();
for (const filePath of featureFiles) {
  const relative = rel(filePath);
  const feature = readJsonSafe(filePath);
  if (!feature || !configContext) continue;
  const resolved = resolveNativeFeatureFile(packageRoot, filePath, feature, configContext, { warnings, errors });
  if (!resolved.valid || !resolved.ref) continue;
  const key = `${resolved.ref.worldId}:${resolved.ref.classCode}:${resolved.ref.featureId}`;
  if (seenFeaturePaths.has(key)) addError(`[duplicate-feature] duplicate feature reference ${key}`);
  seenFeaturePaths.add(key);
}

for (const pictureFile of pictureFiles) {
  if (configContext) resolveNativePictureFile(packageRoot, pictureFile, configContext, { warnings, errors });
}

for (const [indexKey, actualValue] of [['featureCount', featureFiles.length], ['pictureCount', pictureFiles.length], ['deleteCount', deleteItems.length]]) {
  if (Number.isInteger(loaded?.index?.[indexKey]) && loaded.index[indexKey] !== actualValue) {
    addError(`[index-count] ${indexKey}=${loaded.index[indexKey]} but actual=${actualValue}`);
  }
}

if (pictureFiles.length > 0 && !fs.existsSync(paths.pictureRoot)) addError(`[picture] ${rel(paths.pictureRoot)} is missing`);

console.log('CairnMap Native RelayPackage Validation');
console.log(`  Package input: ${relayInput?.inputPath ? rel(relayInput.inputPath) : rel(packageRoot)}`);
console.log(`  Package root: ${rel(packageRoot)}`);
if (relayInput?.inputType === 'zip') console.log(`  Zip root prefix: ${relayInput.rootPrefix || '(none)'}`);
console.log(`  Features: ${featureFiles.length}`);
console.log(`  Pictures: ${pictureFiles.length}`);
console.log(`  Deletes: ${deleteItems.length}`);
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
