import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

export const root = process.cwd();
export const relayInputCacheRoot = path.join(root, '.cairnmap-tmp', 'relay-input');

export function normalizeZipPath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\/+/, '');
}

export function isIgnoredRelayPath(value) {
  const normalized = normalizeZipPath(value);
  const lower = normalized.toLowerCase();
  return (
    !normalized ||
    lower.endsWith('/.ds_store') ||
    lower === '.ds_store' ||
    lower.startsWith('__macosx/') ||
    lower.includes('/__macosx/')
  );
}

export function stripTrailingSlash(value) {
  return normalizeZipPath(value).replace(/\/+$/, '');
}

export function stripRootPrefix(value, rootPrefix) {
  const normalized = normalizeZipPath(value);
  if (!rootPrefix) return normalized;
  return normalized.startsWith(rootPrefix) ? normalized.slice(rootPrefix.length) : normalized;
}

export function getTopLevelName(value) {
  const normalized = stripTrailingSlash(value);
  const first = normalized.split('/').filter(Boolean)[0];
  return first || '';
}

export function hasRelayPackageMarkers(relativePaths) {
  for (const raw of relativePaths) {
    const p = stripTrailingSlash(raw);
    if (!p) continue;
    const lower = p.toLowerCase();
    if (lower === 'index.json') return true;
    if (lower === 'delete.json') return true;
    if (lower.startsWith('data_spilt/')) return true;
    if (lower.startsWith('picture/')) return true;
    if (lower.startsWith('tool_refresh/')) return true;
  }
  return false;
}

export function detectRelayPackageRootPrefix(paths) {
  const effectivePaths = paths
    .map((p) => normalizeZipPath(p))
    .filter((p) => p && !isIgnoredRelayPath(p));

  if (hasRelayPackageMarkers(effectivePaths)) {
    return { isRelayPackageLike: true, rootPrefix: '' };
  }

  const topLevelNames = Array.from(new Set(effectivePaths.map(getTopLevelName).filter(Boolean)));
  if (topLevelNames.length !== 1) {
    return { isRelayPackageLike: false, rootPrefix: '' };
  }

  const rootPrefix = `${topLevelNames[0]}/`;
  const strippedPaths = effectivePaths.map((p) => stripRootPrefix(p, rootPrefix));
  if (hasRelayPackageMarkers(strippedPaths)) {
    return { isRelayPackageLike: true, rootPrefix };
  }

  return { isRelayPackageLike: false, rootPrefix: '' };
}

function isSafeRelativePath(relativePath) {
  const normalized = normalizeZipPath(relativePath);
  if (!normalized) return false;
  if (path.isAbsolute(normalized)) return false;
  if (normalized.split('/').some((part) => part === '..')) return false;
  return true;
}

function assertSafeOutputPath(baseDir, relativePath) {
  if (!isSafeRelativePath(relativePath)) {
    throw new Error(`[relay-input] Unsafe zip entry path rejected: ${relativePath}`);
  }
  const outputPath = path.resolve(baseDir, relativePath);
  const resolvedBase = path.resolve(baseDir);
  if (outputPath !== resolvedBase && !outputPath.startsWith(`${resolvedBase}${path.sep}`)) {
    throw new Error(`[relay-input] Zip entry escapes extraction root: ${relativePath}`);
  }
  return outputPath;
}

function findRelayPackageRootInDirectory(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return { isRelayPackageLike: false, packageRoot: dir, rootPrefix: '' };
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const names = entries.map((entry) => entry.name);
  const directMarkers = [];
  for (const name of names) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) directMarkers.push(`${name}/`);
    else directMarkers.push(name);
  }
  if (hasRelayPackageMarkers(directMarkers)) {
    return { isRelayPackageLike: true, packageRoot: dir, rootPrefix: '' };
  }

  const visibleDirs = entries.filter((entry) => entry.isDirectory() && !isIgnoredRelayPath(entry.name));
  const visibleFiles = entries.filter((entry) => entry.isFile() && !isIgnoredRelayPath(entry.name));
  if (visibleFiles.length === 0 && visibleDirs.length === 1) {
    const child = path.join(dir, visibleDirs[0].name);
    const childResult = findRelayPackageRootInDirectory(child);
    if (childResult.isRelayPackageLike) {
      return { ...childResult, rootPrefix: `${visibleDirs[0].name}/` };
    }
  }
  return { isRelayPackageLike: false, packageRoot: dir, rootPrefix: '' };
}

function extractionDirForZip(zipPath) {
  const buffer = fs.readFileSync(zipPath);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 12).toUpperCase();
  const baseName = path.basename(zipPath).replace(/\.zip$/i, '').replace(/[^A-Za-z0-9._-]+/g, '_') || 'relay-package';
  return { buffer, hash, extractionRoot: path.join(relayInputCacheRoot, `${baseName}-${hash}`) };
}

async function extractZipRelayPackage(inputPath, options = {}) {
  let JSZip;
  try {
    JSZip = (await import('jszip')).default;
  } catch {
    throw new Error('Missing dependency jszip. Run npm install before using .zip RelayPackage input.');
  }

  const { buffer, hash, extractionRoot } = extractionDirForZip(inputPath);
  const zip = await JSZip.loadAsync(buffer);
  const entries = Object.values(zip.files);
  const fileEntries = entries.filter((entry) => !entry.dir);
  const ignoredEntries = fileEntries.filter((entry) => isIgnoredRelayPath(entry.name)).length;
  const { isRelayPackageLike, rootPrefix } = detectRelayPackageRootPrefix(fileEntries.map((entry) => String(entry.name || '')));
  if (!isRelayPackageLike) {
    throw new Error(`[relay-input] Zip does not look like a Native RelayPackage: ${inputPath}`);
  }

  if (options.clean !== false && fs.existsSync(extractionRoot)) fs.rmSync(extractionRoot, { recursive: true, force: true });
  fs.mkdirSync(extractionRoot, { recursive: true });

  let extractedFileCount = 0;
  for (const entry of fileEntries) {
    const originalPath = normalizeZipPath(entry.name);
    if (isIgnoredRelayPath(originalPath)) continue;
    const strippedPath = stripRootPrefix(originalPath, rootPrefix);
    if (!strippedPath || isIgnoredRelayPath(strippedPath)) continue;
    const outputPath = assertSafeOutputPath(extractionRoot, strippedPath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const content = await entry.async('nodebuffer');
    fs.writeFileSync(outputPath, content);
    extractedFileCount += 1;
  }

  const packageRoot = findRelayPackageRootInDirectory(extractionRoot).packageRoot;
  return {
    inputPath,
    inputType: 'zip',
    packageRoot,
    isRelayPackageLike: true,
    rootPrefix,
    extractionRoot,
    extracted: true,
    zipHash: hash,
    extractedFileCount,
    ignoredEntries,
  };
}

export async function resolveNativeRelayInput(inputPath, options = {}) {
  const resolvedInput = path.resolve(root, inputPath || '');
  if (!fs.existsSync(resolvedInput)) {
    throw new Error(`[relay-input] Input does not exist: ${resolvedInput}`);
  }
  const stat = fs.statSync(resolvedInput);
  if (stat.isDirectory()) {
    const rootResult = findRelayPackageRootInDirectory(resolvedInput);
    if (!rootResult.isRelayPackageLike) {
      throw new Error(`[relay-input] Directory does not look like a Native RelayPackage: ${resolvedInput}`);
    }
    return {
      inputPath: resolvedInput,
      inputType: 'directory',
      packageRoot: rootResult.packageRoot,
      isRelayPackageLike: true,
      rootPrefix: rootResult.rootPrefix,
      extracted: false,
      extractionRoot: null,
      extractedFileCount: null,
      ignoredEntries: null,
    };
  }
  if (stat.isFile() && resolvedInput.toLowerCase().endsWith('.zip')) {
    return extractZipRelayPackage(resolvedInput, options);
  }
  throw new Error(`[relay-input] Input must be a Native RelayPackage directory or .zip file: ${resolvedInput}`);
}
