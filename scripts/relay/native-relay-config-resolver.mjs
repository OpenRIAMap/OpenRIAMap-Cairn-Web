import fs from 'node:fs';
import path from 'node:path';
import {
  featureIdentity,
  loadClassConfigs,
  loadWorlds,
  nativeFeaturePathInfo,
  packagePaths,
  readJson,
  rel,
} from './native-relay-package-tools.mjs';

function normalizeSlashes(value) {
  return String(value || '').replaceAll(path.sep, '/');
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function createNativeRelayConfigContext(projectId = 'openriamap-ria') {
  return {
    projectId,
    worlds: loadWorlds(),
    classConfigs: loadClassConfigs(),
  };
}

function classificationFields(classConfigEntry) {
  const classification = classConfigEntry?.data?.classification ?? {};
  return [classification.kindField, classification.skindField, classification.skind2Field]
    .filter((field) => typeof field === 'string' && field.length > 0);
}

function classificationValues(feature, classConfigEntry) {
  return classificationFields(classConfigEntry)
    .map((field) => ({ field, value: feature?.[field] }))
    .filter((item) => nonEmptyString(item.value));
}

function hasMatchingClassificationOption(feature, classConfigEntry) {
  const options = classConfigEntry?.data?.classification?.options;
  if (!Array.isArray(options) || options.length === 0) return true;
  const fields = classificationFields(classConfigEntry);
  if (fields.length === 0) return true;
  const values = fields.map((field) => feature?.[field]);
  if (values.every((value) => !nonEmptyString(value))) return true;
  return options.some((option) => {
    const expected = [option.kind, option.skind, option.skind2];
    return values.every((value, index) => !nonEmptyString(value) || String(value) === String(expected[index] ?? ''));
  });
}

export function resolveNativeFeatureFile(packageRoot, filePath, data, context, diagnostics = {}) {
  const warnings = diagnostics.warnings ?? [];
  const errors = diagnostics.errors ?? [];
  const info = nativeFeaturePathInfo(packageRoot, filePath);
  const relative = normalizeSlashes(path.relative(packageRoot, filePath));
  if (!info.validPathShape) {
    errors.push(`[feature-path] ${relative} must match Data_Spilt/{worldId}/{classCode}/.../{featureId}.json`);
    return { valid: false, info, ref: null, key: null, relative };
  }

  const world = context.worlds.byId.get(info.worldId);
  if (!world) errors.push(`[world] ${relative} worldId "${info.worldId}" is not registered in worlds.json`);

  const classConfigEntry = context.classConfigs.get(info.classCode);
  if (!classConfigEntry) errors.push(`[class] ${relative} classCode "${info.classCode}" is not registered in class configs`);

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const identity = featureIdentity(data, classConfigEntry?.data);
    if (identity.featureId !== info.featureIdFromFile) {
      errors.push(`[feature-id] ${relative} file name ${info.featureIdFromFile} does not match ${identity.idField}=${identity.featureId || '(missing)'}`);
    }
    if (identity.classCode !== info.classCode) {
      errors.push(`[class] ${relative} path class ${info.classCode} does not match ${identity.classField}=${identity.classCode || '(missing)'}`);
    }
    const worldItem = context.worlds.byNumeric.get(identity.worldCode);
    if (!worldItem) {
      errors.push(`[world] ${relative} ${identity.worldField}=${identity.worldCode} does not match any worlds.numericCode`);
    } else if (worldItem.id !== info.worldId) {
      errors.push(`[world] ${relative} path world ${info.worldId} does not match ${identity.worldField}=${identity.worldCode} (${worldItem.id})`);
    }

    const payloadKindValues = classificationValues(data, classConfigEntry);
    for (let i = 0; i < info.nestedPath.length; i += 1) {
      const payload = payloadKindValues[i];
      if (!payload) {
        warnings.push(`[kind-path] ${relative} path segment ${info.nestedPath[i]} has no corresponding configured classification payload field`);
        continue;
      }
      if (String(payload.value) !== String(info.nestedPath[i])) {
        warnings.push(`[kind-path] ${relative} path segment ${info.nestedPath[i]} does not match ${payload.field}=${payload.value}`);
      }
    }
    if (!hasMatchingClassificationOption(data, classConfigEntry)) {
      warnings.push(`[classification] ${relative} classification tuple is not present in class option config`);
    }
  }

  const ref = {
    projectId: context.projectId,
    worldId: info.worldId,
    classCode: info.classCode,
    kindPath: info.nestedPath ?? [],
    featureId: info.featureIdFromFile,
  };
  const key = [ref.projectId, ref.worldId, ref.classCode, ...(ref.kindPath ?? []), ref.featureId].join('/');
  return { valid: true, info, ref, key, relative };
}

export function resolveNativePictureFile(packageRoot, filePath, context, diagnostics = {}) {
  const warnings = diagnostics.warnings ?? [];
  const errors = diagnostics.errors ?? [];
  const pictureRoot = packagePaths(packageRoot).pictureRoot;
  const objectKey = normalizeSlashes(path.relative(pictureRoot, filePath));
  const parts = objectKey.split('/').filter(Boolean);
  if (parts.length < 4) {
    errors.push(`[picture-path] Picture path cannot bind to a feature: Picture/${objectKey}`);
    return { valid: false, objectKey, ref: null };
  }
  const worldId = parts[0];
  const classCode = parts[1];
  const featureId = parts[parts.length - 2];
  const kindPath = parts.slice(2, -2);
  if (!context.worlds.byId.has(worldId)) errors.push(`[picture-world] Picture/${objectKey} worldId "${worldId}" is not registered in worlds.json`);
  if (!context.classConfigs.has(classCode)) errors.push(`[picture-class] Picture/${objectKey} classCode "${classCode}" is not registered in class configs`);
  if (kindPath.length > 3) warnings.push(`[picture-kind-path] Picture/${objectKey} has a deep kind path (${kindPath.join('/')}); verify class classification config`);
  const ref = { projectId: context.projectId, worldId, classCode, kindPath, featureId };
  const key = [ref.projectId, ref.worldId, ref.classCode, ...kindPath, featureId].join('/');
  return { valid: true, objectKey, ref, key };
}

export function readFeatureJsonForResolver(filePath, diagnostics = {}) {
  try {
    return readJson(filePath);
  } catch (error) {
    const errors = diagnostics.errors ?? [];
    errors.push(`[parse-json] ${rel(filePath)}: ${error.message}`);
    return null;
  }
}

export function resolvePackageFeatures(packageRoot, context, diagnostics = {}) {
  const splitRoot = packagePaths(packageRoot).splitRoot;
  const result = [];
  if (!fs.existsSync(splitRoot)) return result;
  const stack = [splitRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.json') {
        const data = readFeatureJsonForResolver(full, diagnostics);
        if (data) result.push(resolveNativeFeatureFile(packageRoot, full, data, context, diagnostics));
      }
    }
  }
  return result.sort((a, b) => String(a.key).localeCompare(String(b.key)));
}
