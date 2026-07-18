#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const configPath = path.join(root, 'project-config', 'packages', 'openriamap-ria', 'environment', 'storageProfiles.json');
const schemaPath = path.join(root, 'project-config', 'schemas', 'environment', 'cairnmap.storage-profiles.v1.schema.json');

const rel = (p) => path.relative(root, p).replaceAll(path.sep, '/');
const errors = [];
const warnings = [];

const requiredRoles = ['featureData', 'media', 'mediaIndex', 'relayPool'];
const allowedRoles = new Set(requiredRoles);
const allowedKinds = new Set(['internal-path', 'github-repo', 'raw-compatible', 'object-storage', 'api', 'database']);
const allowedModes = new Set(['internal', 'external', 'planned']);

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    addError(`[parse-json] ${rel(filePath)}: ${error.message}`);
    return null;
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function requireString(value, message) {
  if (typeof value !== 'string') addError(message);
}

function validateProfile(profile, index, ids) {
  const prefix = `profiles[${index}]`;
  if (!isPlainObject(profile)) {
    addError(`[profile] ${prefix} must be an object`);
    return;
  }

  requireString(profile.id, `[profile] ${prefix}.id must be a string`);
  requireString(profile.role, `[profile] ${prefix}.role must be a string`);
  requireString(profile.kind, `[profile] ${prefix}.kind must be a string`);
  requireString(profile.mode, `[profile] ${prefix}.mode must be a string`);
  requireString(profile.root, `[profile] ${prefix}.root must be a string`);

  if (typeof profile.id === 'string') {
    if (ids.has(profile.id)) addError(`[duplicate-id] duplicate storage profile id "${profile.id}"`);
    ids.add(profile.id);
  }
  if (typeof profile.role === 'string' && !allowedRoles.has(profile.role)) addError(`[profile] ${prefix}.role "${profile.role}" is not supported`);
  if (typeof profile.kind === 'string' && !allowedKinds.has(profile.kind)) addError(`[profile] ${prefix}.kind "${profile.kind}" is not supported`);
  if (typeof profile.mode === 'string' && !allowedModes.has(profile.mode)) addError(`[profile] ${prefix}.mode "${profile.mode}" is not supported`);

  if (profile.kind === 'github-repo') {
    for (const key of ['owner', 'repo', 'branch']) {
      if (typeof profile[key] !== 'string' || !profile[key]) addError(`[github-repo] ${prefix}.${key} is required for github-repo profiles`);
    }
  }

  if (profile.paths !== undefined && !isPlainObject(profile.paths)) addError(`[paths] ${prefix}.paths must be an object when present`);
  if (profile.read !== undefined && !isPlainObject(profile.read)) addError(`[read] ${prefix}.read must be an object when present`);
  if (profile.write !== undefined && !isPlainObject(profile.write)) addError(`[write] ${prefix}.write must be an object when present`);

  if (profile.write?.enabled === true) {
    addWarning(`[write-enabled] ${profile.id} has write.enabled=true. CM_STORAGE_PROFILE_1 is expected to be contract-only.`);
  }

  if (profile.compatibility?.currentRuntimeReplacement === true) {
    addWarning(`[runtime-replacement] ${profile.id} declares currentRuntimeReplacement=true. This patch should not replace the active runtime chain.`);
  }

  if (profile.role === 'featureData') {
    for (const key of ['splitRoot', 'mergeRoot']) {
      if (typeof profile.paths?.[key] !== 'string' || !profile.paths[key]) addError(`[featureData] ${prefix}.paths.${key} is required`);
    }
  }

  if (profile.role === 'media') {
    const hasObjectRoot = typeof profile.paths?.objectRoot === 'string' && profile.paths.objectRoot;
    if (!hasObjectRoot && !profile.root) addError(`[media] ${prefix} must define root or paths.objectRoot`);
  }

  if (profile.role === 'mediaIndex') {
    for (const key of ['splitRoot', 'mergeRoot']) {
      if (typeof profile.paths?.[key] !== 'string' || !profile.paths[key]) addError(`[mediaIndex] ${prefix}.paths.${key} is required`);
    }
  }

  if (profile.role === 'relayPool') {
    if (typeof profile.paths?.packageRoot !== 'string' || !profile.paths.packageRoot) addError(`[relayPool] ${prefix}.paths.packageRoot is required`);
  }
}

function main() {
  if (!fs.existsSync(configPath)) addError(`[missing] ${rel(configPath)} does not exist`);
  if (!fs.existsSync(schemaPath)) addError(`[missing] ${rel(schemaPath)} does not exist`);
  const config = fs.existsSync(configPath) ? readJson(configPath) : null;
  if (fs.existsSync(schemaPath)) readJson(schemaPath);

  if (!config) return;

  if (config.schemaVersion !== 'cairnmap.storage-profiles.v1') {
    addError(`[schema-version] ${rel(configPath)} expected cairnmap.storage-profiles.v1, got ${config.schemaVersion || '(missing)'}`);
  }
  if (config.projectId !== 'openriamap-ria') addWarning(`[projectId] expected openriamap-ria, got ${config.projectId || '(missing)'}`);
  if (!isPlainObject(config.defaults)) addError('[defaults] storageProfiles.defaults must be an object');
  if (!Array.isArray(config.profiles)) addError('[profiles] storageProfiles.profiles must be an array');

  const ids = new Set();
  const roleCounts = new Map();
  if (Array.isArray(config.profiles)) {
    config.profiles.forEach((profile, index) => {
      validateProfile(profile, index, ids);
      if (typeof profile?.role === 'string') roleCounts.set(profile.role, (roleCounts.get(profile.role) ?? 0) + 1);
    });
  }

  for (const role of requiredRoles) {
    if ((roleCounts.get(role) ?? 0) < 1) addError(`[role] missing at least one ${role} storage profile`);
    const defaultId = config.defaults?.[role];
    if (typeof defaultId !== 'string' || !defaultId) addError(`[defaults] defaults.${role} must reference a storage profile id`);
    else if (!ids.has(defaultId)) addError(`[defaults] defaults.${role} references missing profile id "${defaultId}"`);
  }

  if (config.compatibility?.doNotReplaceCurrentDataRuntimeInThisPatch !== true) {
    addWarning('[compatibility] doNotReplaceCurrentDataRuntimeInThisPatch should be true for CM_STORAGE_PROFILE_1');
  }
}

main();

console.log('CairnMap StorageProfile Validation');
console.log(`  Config: ${rel(configPath)}`);
console.log(`  Schema: ${rel(schemaPath)}`);
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
