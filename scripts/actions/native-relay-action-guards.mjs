import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = process.cwd();

const SCHEMA_VERSION = 'cairnmap.native-relay-accept-guards.v1';
const GENERATED_AT = '1970-01-01T00:00:00.000Z';
const ACCEPT_BRANCH_PREFIX = 'accept/native-relay/';
const PROTECTED_BRANCHES = new Set(['main', 'master', 'production', 'prod', 'release', 'gh-pages']);
const ALLOWED_DATA_ROOTS = [
  'OpenRIAMap-Data',
  '.cairnmap-tmp/native-relay-accept-data-root',
  '.cairnmap-actions/native-relay-accept/data-root-preview',
];
const ALLOWED_RELAY_ROOTS = [
  'docs/30_data-contracts/examples/native-relay-package-sample',
  'RelayPackages/pending',
  'RelayPackages/prechecked',
];
const COMMIT_ALLOWED_CHILDREN = [
  'Data_Spilt',
  'Picture',
  'Media_Index_Spilt',
  'Data_Merge',
  'Data_Index',
  'Media_Index_Merge',
];

function normalizeSlashes(value) {
  return String(value || '').replace(/\\/g, '/');
}

function resolveFromRoot(value) {
  return path.resolve(root, value);
}

function isSubPath(baseDir, candidatePath) {
  const base = path.resolve(baseDir);
  const candidate = path.resolve(candidatePath);
  return candidate === base || candidate.startsWith(`${base}${path.sep}`);
}

function rootRelative(candidatePath) {
  return normalizeSlashes(path.relative(root, path.resolve(candidatePath)) || '.');
}

function hasPathTraversal(value) {
  const normalized = normalizeSlashes(value);
  return normalized === '..' || normalized.startsWith('../') || normalized.includes('/../') || normalized.endsWith('/..');
}

function isInsideAllowedRoots(candidatePath, roots) {
  return roots.some((rootEntry) => isSubPath(resolveFromRoot(rootEntry), candidatePath));
}

function isExplicitlyAllowedRoot(candidatePath, roots) {
  return roots.some((rootEntry) => path.resolve(candidatePath) === resolveFromRoot(rootEntry));
}

function validateRelayPath(options) {
  const errors = [];
  const warnings = [];
  const relay = path.resolve(options.relay);
  const rel = rootRelative(relay);
  if (path.isAbsolute(String(options.relay || '')) && !isSubPath(root, relay)) {
    errors.push(`[relay-path] RelayPackage must be inside the checked-out repository for accept actions: ${normalizeSlashes(relay)}`);
  }
  if (hasPathTraversal(rel)) errors.push(`[relay-path] RelayPackage path must not contain traversal segments: ${rel}`);
  if (!isInsideAllowedRoots(relay, ALLOWED_RELAY_ROOTS)) {
    errors.push(`[relay-path] RelayPackage must be under an allowed inbox/example root: ${ALLOWED_RELAY_ROOTS.join(', ')}`);
  }
  if (!fs.existsSync(relay)) errors.push(`[relay-path] RelayPackage path does not exist: ${rel}`);
  return { errors, warnings, normalized: rel };
}

function validateDataRoot(options) {
  const errors = [];
  const warnings = [];
  const dataRoot = path.resolve(options.dataRoot);
  const rel = rootRelative(dataRoot);
  if (!options.write) {
    if (!isExplicitlyAllowedRoot(dataRoot, ALLOWED_DATA_ROOTS)) {
      warnings.push(`[data-root] dry-run data_root is outside the standard allowlist; this is allowed because write mode is disabled: ${rel}`);
    }
    return { errors, warnings, normalized: rel };
  }
  if (path.isAbsolute(String(options.dataRoot || '')) && !isSubPath(root, dataRoot)) {
    errors.push(`[data-root] write mode only permits data_root inside the checked-out repository: ${normalizeSlashes(dataRoot)}`);
  }
  if (hasPathTraversal(rel)) errors.push(`[data-root] data_root must not contain traversal segments: ${rel}`);
  if (!isExplicitlyAllowedRoot(dataRoot, ALLOWED_DATA_ROOTS)) {
    errors.push(`[data-root] write mode data_root must exactly match one of: ${ALLOWED_DATA_ROOTS.join(', ')}`);
  }
  return { errors, warnings, normalized: rel };
}

function validateBranch(options) {
  const errors = [];
  const warnings = [];
  const branch = String(options.targetBranch || '');
  const normalized = normalizeSlashes(branch);
  const leaf = normalized.split('/').at(-1);
  if (!branch.trim()) errors.push('[branch] target branch must not be empty.');
  if (hasPathTraversal(normalized) || normalized.includes('..')) errors.push(`[branch] target branch must not contain traversal or double-dot segments: ${normalized}`);
  if (normalized.startsWith('/') || normalized.endsWith('/') || normalized.includes('//')) errors.push(`[branch] target branch has invalid slash placement: ${normalized}`);
  if (PROTECTED_BRANCHES.has(normalized) || PROTECTED_BRANCHES.has(leaf)) {
    errors.push(`[branch] target branch must not be a protected branch: ${normalized}`);
  }
  if ((options.commitChanges || options.pushChanges) && !normalized.startsWith(ACCEPT_BRANCH_PREFIX)) {
    errors.push(`[branch] commit/push mode requires target branch prefix ${ACCEPT_BRANCH_PREFIX}`);
  }
  if (!normalized.startsWith(ACCEPT_BRANCH_PREFIX)) {
    warnings.push(`[branch] target branch is outside ${ACCEPT_BRANCH_PREFIX}; allowed only while commit and push are disabled.`);
  }
  return { errors, warnings, normalized };
}

function validateModeFlags(options) {
  const errors = [];
  const warnings = [];
  if (options.commitChanges && !options.write) errors.push('[mode] commit_changes requires write mode.');
  if (options.pushChanges && !options.commitChanges) errors.push('[mode] push requires commit_changes.');
  if (options.pushChanges && !options.write) errors.push('[mode] push requires write mode.');
  if (options.write && !options.explicitDataRoot) errors.push('[mode] write mode requires explicit --data-root.');
  if (options.commitChanges && !options.explicitRelay) warnings.push('[mode] committing the built-in example package is usually only for smoke tests.');
  return { errors, warnings };
}

export function validateAcceptActionGuards(options) {
  const relay = validateRelayPath(options);
  const dataRoot = validateDataRoot(options);
  const branch = validateBranch(options);
  const flags = validateModeFlags(options);
  const errors = [...relay.errors, ...dataRoot.errors, ...branch.errors, ...flags.errors];
  const warnings = [...relay.warnings, ...dataRoot.warnings, ...branch.warnings, ...flags.warnings];
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: GENERATED_AT,
    finalStatus: errors.length === 0 ? 'PASS' : 'FAIL',
    policy: {
      acceptBranchPrefix: ACCEPT_BRANCH_PREFIX,
      protectedBranches: [...PROTECTED_BRANCHES],
      allowedRelayRoots: ALLOWED_RELAY_ROOTS,
      allowedDataRoots: ALLOWED_DATA_ROOTS,
      commitAllowedChildren: COMMIT_ALLOWED_CHILDREN,
    },
    checked: {
      relay: relay.normalized,
      dataRoot: dataRoot.normalized,
      targetBranch: branch.normalized,
      write: Boolean(options.write),
      commitChanges: Boolean(options.commitChanges),
      pushChanges: Boolean(options.pushChanges),
      explicitRelay: Boolean(options.explicitRelay),
      explicitDataRoot: Boolean(options.explicitDataRoot),
    },
    warnings,
    errors,
  };
}

export function assertAcceptActionGuards(options) {
  const result = validateAcceptActionGuards(options);
  if (result.errors.length > 0) {
    throw new Error(result.errors.map((item) => `[accept-guard] ${item}`).join('\n'));
  }
  return result;
}

export function allowedCommitPathsForDataRoot(dataRoot) {
  const base = rootRelative(dataRoot);
  return COMMIT_ALLOWED_CHILDREN.map((child) => normalizeSlashes(path.posix.join(base, child)));
}

function extractPathFromGitStatusLine(line) {
  const raw = String(line || '').slice(3).trim();
  if (raw.includes(' -> ')) return raw.split(' -> ').at(-1).trim();
  return raw.replace(/^"|"$/g, '');
}

export function validateCommitPathSet(statusShort, dataRoot) {
  const allowedPrefixes = allowedCommitPathsForDataRoot(dataRoot);
  const errors = [];
  const checkedPaths = [];
  for (const line of statusShort || []) {
    const changedPath = normalizeSlashes(extractPathFromGitStatusLine(line));
    if (!changedPath) continue;
    checkedPaths.push(changedPath);
    const ok = allowedPrefixes.some((prefix) => changedPath === prefix || changedPath.startsWith(`${prefix}/`));
    if (!ok) errors.push(`[commit-path] Git change is outside allowed data children: ${changedPath}`);
  }
  return {
    finalStatus: errors.length === 0 ? 'PASS' : 'FAIL',
    allowedPrefixes,
    checkedPaths,
    errors,
  };
}

function parseGuardArgs(argv = process.argv.slice(2)) {
  const options = {
    relay: resolveFromRoot('docs/30_data-contracts/examples/native-relay-package-sample'),
    dataRoot: resolveFromRoot('.cairnmap-actions/native-relay-accept/data-root-preview'),
    targetBranch: 'accept/native-relay/local-run',
    write: false,
    commitChanges: false,
    pushChanges: false,
    explicitRelay: false,
    explicitDataRoot: false,
    checkDefaults: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--check-defaults') {
      options.checkDefaults = true;
    } else if (arg === '--relay') {
      const next = argv[++i];
      if (!next) throw new Error('--relay requires a path');
      options.relay = resolveFromRoot(next);
      options.explicitRelay = true;
    } else if (arg === '--data-root') {
      const next = argv[++i];
      if (!next) throw new Error('--data-root requires a path');
      options.dataRoot = resolveFromRoot(next);
      options.explicitDataRoot = true;
    } else if (arg === '--target-branch') {
      const next = argv[++i];
      if (!next) throw new Error('--target-branch requires a name');
      options.targetBranch = next;
    } else if (arg === '--write') {
      options.write = true;
    } else if (arg === '--commit-changes') {
      options.commitChanges = true;
    } else if (arg === '--push') {
      options.pushChanges = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

export function acceptActionGuardsHelp() {
  return [
    'Usage:',
    '  npm run validate:native-relay-accept-guards -- --check-defaults',
    '  node ./scripts/actions/native-relay-action-guards.mjs --relay RelayPackages/pending/pkg.zip --data-root OpenRIAMap-Data --write --target-branch accept/native-relay/test',
    '',
    'Validates accept-action safety policy: RelayPackage inbox roots, write data_root allowlist, accept branch prefix, and mode flag consistency.',
  ].join('\n');
}

function runCli() {
  try {
    const options = parseGuardArgs();
    if (options.help) {
      console.log(acceptActionGuardsHelp());
      return;
    }
    const report = validateAcceptActionGuards(options);
    console.log('CairnMap Native Relay Accept Guards');
    console.log(`  RelayPackage: ${report.checked.relay}`);
    console.log(`  Data root: ${report.checked.dataRoot}`);
    console.log(`  Target branch: ${report.checked.targetBranch}`);
    console.log(`  Mode write/commit/push: ${report.checked.write}/${report.checked.commitChanges}/${report.checked.pushChanges}`);
    if (report.warnings.length > 0) {
      console.log('\nWarnings');
      for (const warning of report.warnings) console.log(`  - ${warning}`);
    }
    if (report.errors.length > 0) {
      console.error('\nErrors');
      for (const error of report.errors) console.error(`  - ${error}`);
      console.error('\nFinal result: FAIL');
      process.exitCode = 1;
    } else {
      console.log('\nFinal result: PASS');
    }
  } catch (error) {
    console.error('CairnMap Native Relay Accept Guards');
    console.error(`\nFatal error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
