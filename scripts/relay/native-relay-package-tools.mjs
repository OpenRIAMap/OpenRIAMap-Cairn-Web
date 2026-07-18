import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

export const root = process.cwd();
export const protocolPath = path.join(root, 'project-config', 'packages', 'openriamap-ria', 'environment', 'relayPackageProtocol.json');
export const storageProfilesPath = path.join(root, 'project-config', 'packages', 'openriamap-ria', 'environment', 'storageProfiles.json');
export const worldsPath = path.join(root, 'project-config', 'packages', 'openriamap-ria', 'environment', 'worlds.json');
export const protocolSchemaPath = path.join(root, 'project-config', 'schemas', 'relay', 'cairnmap.native-relay-protocol.v1.schema.json');
export const indexSchemaPath = path.join(root, 'project-config', 'schemas', 'relay', 'cairnmap.native-relay-index.v1.schema.json');
export const deleteSchemaPath = path.join(root, 'project-config', 'schemas', 'relay', 'cairnmap.native-relay-delete.v1.schema.json');
export const reviewSchemaPath = path.join(root, 'project-config', 'schemas', 'relay', 'cairnmap.native-relay-review.v1.schema.json');
export const defaultSampleRoot = path.join(root, 'docs', '30_data-contracts', 'examples', 'native-relay-package-sample');
export const outputRoot = path.join(root, '.cairnmap-tmp', 'native-relay-package-sample');

const jsonExtensions = new Set(['.json']);
const imageExtensions = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif', '.avif']);

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
  if (isPlainObject(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

export function sha256(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : stableJson(value)).digest('hex');
}

export function parseArgs(argv = process.argv.slice(2)) {
  const result = { packageRoot: defaultSampleRoot, write: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--package' || arg === '--package-root' || arg === '--relay') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.packageRoot = path.resolve(root, next);
      i += 1;
    } else if (arg === '--write') {
      result.write = true;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return result;
}

export function walkFiles(dir, predicate = () => true) {
  const result = [];
  if (!fs.existsSync(dir)) return result;
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && predicate(full)) result.push(full);
    }
  }
  return result.sort((a, b) => rel(a).localeCompare(rel(b)));
}

export function walkJsonFiles(dir) {
  return walkFiles(dir, (filePath) => jsonExtensions.has(path.extname(filePath).toLowerCase()));
}

export function walkPictureFiles(dir) {
  return walkFiles(dir, (filePath) => imageExtensions.has(path.extname(filePath).toLowerCase()));
}

export function loadWorlds() {
  const data = readJson(worldsPath);
  const byId = new Map();
  const byNumeric = new Map();
  for (const item of Array.isArray(data.items) ? data.items : []) {
    if (typeof item.id === 'string') byId.set(item.id, item);
    if (Number.isInteger(item.numericCode)) byNumeric.set(item.numericCode, item);
  }
  return { byId, byNumeric, items: Array.from(byId.values()) };
}

export function loadClassConfigs() {
  const presetRoot = path.join(root, 'project-config', 'presets');
  const files = walkJsonFiles(presetRoot).filter((filePath) => rel(filePath).includes('/classes/'));
  const byCode = new Map();
  for (const filePath of files) {
    const data = readJson(filePath);
    if (typeof data.classCode === 'string') byCode.set(data.classCode, { filePath, data });
  }
  return byCode;
}

export function packagePaths(packageRoot) {
  return {
    packageRoot,
    indexPath: path.join(packageRoot, 'INDEX.json'),
    deletePath: path.join(packageRoot, 'Delete.json'),
    reviewPath: path.join(packageRoot, 'Review.json'),
    splitRoot: path.join(packageRoot, 'Data_Spilt'),
    pictureRoot: path.join(packageRoot, 'Picture'),
    toolRefreshRoot: path.join(packageRoot, 'Tool_Refresh'),
  };
}

export function readPackage(packageRoot) {
  const paths = packagePaths(packageRoot);
  return {
    paths,
    index: fs.existsSync(paths.indexPath) ? readJson(paths.indexPath) : null,
    deleteTable: fs.existsSync(paths.deletePath) ? readJson(paths.deletePath) : null,
    review: fs.existsSync(paths.reviewPath) ? readJson(paths.reviewPath) : null,
    featureFiles: walkJsonFiles(paths.splitRoot),
    pictureFiles: walkPictureFiles(paths.pictureRoot),
  };
}

export function nativeFeaturePathInfo(packageRoot, filePath) {
  const splitRoot = path.join(packageRoot, 'Data_Spilt');
  const relative = path.relative(splitRoot, filePath).replaceAll(path.sep, '/');
  const parts = relative.split('/');
  if (parts.length < 3) return { relative, validPathShape: false };
  const worldId = parts[0];
  const classCode = parts[1];
  const fileName = parts[parts.length - 1];
  const featureIdFromFile = fileName.endsWith('.json') ? fileName.slice(0, -5) : fileName;
  const nestedPath = parts.slice(2, -1);
  return { relative, validPathShape: true, worldId, classCode, nestedPath, featureIdFromFile };
}

export function featureIdentity(feature, classConfig) {
  const identityField = classConfig?.data?.identity?.idField || classConfig?.data?.identityField || classConfig?.identity?.idField || 'ID';
  const classField = classConfig?.data?.classField || 'Class';
  const worldField = classConfig?.data?.worldField || 'World';
  const kindField = classConfig?.classification?.kindField || 'Kind';
  return {
    idField: identityField,
    classField,
    worldField,
    kindField,
    featureId: feature?.[identityField],
    classCode: feature?.[classField],
    worldCode: feature?.[worldField],
    kind: feature?.[kindField],
  };
}

export function collectPackageStats(packageRoot) {
  const loaded = readPackage(packageRoot);
  const classes = new Map();
  const worlds = new Map();
  const features = [];
  for (const filePath of loaded.featureFiles) {
    const info = nativeFeaturePathInfo(packageRoot, filePath);
    const data = readJson(filePath);
    classes.set(info.classCode, (classes.get(info.classCode) ?? 0) + 1);
    worlds.set(info.worldId, (worlds.get(info.worldId) ?? 0) + 1);
    features.push({ filePath, info, data, contentHash: sha256(data) });
  }
  const deleteItems = Array.isArray(loaded.deleteTable?.items) ? loaded.deleteTable.items : [];
  return {
    ...loaded,
    features,
    deleteItems,
    featureCount: features.length,
    pictureCount: loaded.pictureFiles.length,
    deleteCount: deleteItems.length,
    classes: Object.fromEntries([...classes.entries()].sort()),
    worlds: Object.fromEntries([...worlds.entries()].sort()),
  };
}

export function refreshedIndex(baseIndex, stats) {
  return {
    ...(isPlainObject(baseIndex) ? baseIndex : {}),
    featureCount: stats.featureCount,
    pictureCount: stats.pictureCount,
    deleteCount: stats.deleteCount,
  };
}

export function previewReport(packageRoot) {
  const stats = collectPackageStats(packageRoot);
  return {
    schemaVersion: 'cairnmap.native-relay-preview.v1',
    packageRoot: rel(packageRoot),
    operator: stats.index?.operator ?? null,
    version: stats.index?.version ?? null,
    packageVersion: stats.index?.packageVersion ?? null,
    exportedAt: stats.index?.exportedAt ?? null,
    featureCount: stats.featureCount,
    pictureCount: stats.pictureCount,
    deleteCount: stats.deleteCount,
    classes: stats.classes,
    worlds: stats.worlds,
    files: {
      index: fs.existsSync(stats.paths.indexPath) ? rel(stats.paths.indexPath) : null,
      delete: fs.existsSync(stats.paths.deletePath) ? rel(stats.paths.deletePath) : null,
      review: fs.existsSync(stats.paths.reviewPath) ? rel(stats.paths.reviewPath) : null,
    },
    featureRefs: stats.features.map(({ filePath, info, data, contentHash }) => ({
      path: rel(filePath),
      worldId: info.worldId,
      classCode: info.classCode,
      nestedPath: info.nestedPath,
      featureId: data.ID ?? info.featureIdFromFile,
      name: data.Name ?? null,
      contentHash,
    })),
    pictureFiles: stats.pictureFiles.map((filePath) => rel(filePath)),
    deleteItems: stats.deleteItems,
  };
}
