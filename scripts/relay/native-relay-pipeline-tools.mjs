import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { rel, writeJson } from './native-relay-package-tools.mjs';

export { rel };

const root = process.cwd();
const DEFAULT_PROJECT_ID = 'openriamap-ria';
const DEFAULT_OUT_ROOT = path.join(root, '.cairnmap-tmp', 'native-relay-local-pipeline');
const DEFAULT_SAMPLE_RELAY = path.join(root, 'docs', '30_data-contracts', 'examples', 'native-relay-package-sample');
const SCHEMA_VERSION = 'cairnmap.native-relay-pipeline-report.v1';
const GENERATED_AT = '1970-01-01T00:00:00.000Z';

function normalizeSlashes(value) {
  return String(value || '').replace(/\\/g, '/');
}

function parseBooleanArg(value) {
  return value === true || value === 'true';
}

function resolvePath(value) {
  return path.resolve(root, value);
}

function dataRootPath(dataRoot, child) {
  return path.join(dataRoot, child);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function isSubPath(baseDir, candidatePath) {
  const base = path.resolve(baseDir);
  const candidate = path.resolve(candidatePath);
  return candidate === base || candidate.startsWith(`${base}${path.sep}`);
}

function assertDataRootSafety(options) {
  if (!options.write) return;
  if (!options.explicitDataRoot) throw new Error('[pipeline-safety] --data-root must be explicitly provided in --write mode.');
  const dataRoot = path.resolve(options.dataRoot);
  const outRoot = path.resolve(options.outRoot);
  const relay = path.resolve(options.relay);
  if (dataRoot === path.parse(dataRoot).root) throw new Error(`[pipeline-safety] --data-root must not be a filesystem root: ${dataRoot}`);
  if (isSubPath(outRoot, dataRoot) || isSubPath(dataRoot, outRoot)) {
    throw new Error(`[pipeline-safety] --data-root must not overlap --out: ${normalizeSlashes(dataRoot)} / ${normalizeSlashes(outRoot)}`);
  }
  if (isSubPath(relay, dataRoot) || isSubPath(dataRoot, relay)) {
    throw new Error(`[pipeline-safety] --data-root must not overlap RelayPackage input: ${normalizeSlashes(dataRoot)} / ${normalizeSlashes(relay)}`);
  }
  if (normalizeSlashes(dataRoot).includes('/.cairnmap-tmp/relay-input/')) {
    throw new Error('[pipeline-safety] --data-root must not be inside .cairnmap-tmp/relay-input.');
  }
}

export function parseNativeRelayPipelineArgs(argv = process.argv.slice(2)) {
  const result = {
    relay: DEFAULT_SAMPLE_RELAY,
    dataRoot: path.join(DEFAULT_OUT_ROOT, 'data-root-preview'),
    outRoot: DEFAULT_OUT_ROOT,
    projectId: DEFAULT_PROJECT_ID,
    write: false,
    clean: true,
    backup: false,
    allowOverwrite: true,
    strictDelete: false,
    strictWorlds: false,
    explicitDataRoot: false,
    explicitRelay: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--relay' || arg === '--package' || arg === '--package-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.relay = resolvePath(next);
      result.explicitRelay = true;
      i += 1;
    } else if (arg === '--data-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.dataRoot = resolvePath(next);
      result.explicitDataRoot = true;
      i += 1;
    } else if (arg === '--out' || arg === '--out-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.outRoot = resolvePath(next);
      if (!result.explicitDataRoot) result.dataRoot = path.join(result.outRoot, 'data-root-preview');
      i += 1;
    } else if (arg === '--project-id') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a project id`);
      result.projectId = next;
      i += 1;
    } else if (arg === '--write') {
      result.write = true;
    } else if (arg === '--backup') {
      result.backup = true;
    } else if (arg === '--no-overwrite') {
      result.allowOverwrite = false;
    } else if (arg === '--strict-delete') {
      result.strictDelete = true;
    } else if (arg === '--strict-worlds') {
      result.strictWorlds = true;
    } else if (arg === '--no-clean') {
      result.clean = false;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return result;
}

export function nativeRelayPipelineHelp() {
  return [
    'Usage:',
    '  npm run run:native-relay-local-pipeline -- [--relay <NativeRelayPackageDirOrZip>] [--data-root <OpenRIAMap-DataDir>] [--out <outputDir>] [--project-id openriamap-ria] [--write]',
    '  node ./scripts/relay/run-native-relay-local-pipeline.mjs --relay <RelayPackage.zip> --data-root <OpenRIAMap-Data-TEMP> --write',
    '',
    'Default mode is dry-run. It generates apply previews, Data_Merge/Data_Index previews, Media_Index_Merge previews, and pipeline-report.json under .cairnmap-tmp/native-relay-local-pipeline.',
    'Write mode requires an explicit --data-root and writes only under that data root: Data_Spilt, Picture, Media_Index_Spilt, Data_Merge, Data_Index, and Media_Index_Merge.',
  ].join('\n');
}

function nodeStep(scriptRelativePath, args, options) {
  const command = process.execPath;
  const commandArgs = [path.join(root, scriptRelativePath), ...args.filter((item) => item !== null && item !== undefined && item !== false)];
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
  const finishedAt = new Date().toISOString();
  const exitCode = typeof result.status === 'number' ? result.status : 1;
  return {
    id: options.id,
    label: options.label,
    script: scriptRelativePath,
    args: commandArgs.slice(1).map(normalizeSlashes),
    startedAt,
    finishedAt,
    exitCode,
    status: exitCode === 0 ? 'PASS' : 'FAIL',
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

function pushFlag(args, condition, flag) {
  if (condition) args.push(flag);
}

function stageSummaryFromJson(filePath, fallback = {}) {
  return readJsonSafe(filePath)?.summary ?? fallback;
}

function reportFromSteps(options, steps, paths, extra = {}) {
  const failed = steps.filter((step) => step.status !== 'PASS');
  const warnings = [];
  for (const step of steps) {
    const combined = `${step.stdout}\n${step.stderr}`;
    if (combined.includes('[legacy]')) warnings.push(`[${step.id}] legacy path warning was reported by child command`);
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: GENERATED_AT,
    projectId: options.projectId,
    mode: options.write ? 'write' : 'dry-run',
    finalStatus: failed.length === 0 ? 'PASS' : 'FAIL',
    inputs: {
      relay: normalizeSlashes(options.relay),
      dataRoot: normalizeSlashes(options.dataRoot),
      outRoot: normalizeSlashes(options.outRoot),
      writeEnabled: Boolean(options.write),
      backupEnabled: Boolean(options.backup),
      allowOverwrite: options.allowOverwrite !== false,
      strictDelete: Boolean(options.strictDelete),
      strictWorlds: Boolean(options.strictWorlds),
    },
    paths: Object.fromEntries(Object.entries(paths).map(([key, value]) => [key, normalizeSlashes(value)])),
    summary: {
      stepCount: steps.length,
      passedSteps: steps.filter((step) => step.status === 'PASS').length,
      failedSteps: failed.length,
      apply: extra.applySummary ?? {},
      featureMerge: extra.featureMergeSummary ?? {},
      mediaIndex: extra.mediaIndexSummary ?? {},
      warningCount: warnings.length,
      errorCount: failed.length,
    },
    steps: steps.map((step) => ({
      id: step.id,
      label: step.label,
      script: step.script,
      args: step.args,
      exitCode: step.exitCode,
      status: step.status,
      stdoutTail: step.stdout.split(/\r?\n/).filter(Boolean).slice(-20),
      stderrTail: step.stderr.split(/\r?\n/).filter(Boolean).slice(-20),
    })),
    warnings,
    errors: failed.map((step) => `[${step.id}] ${step.label} failed with exit code ${step.exitCode}`),
  };
}

export function executeNativeRelayLocalPipeline(options) {
  assertDataRootSafety(options);
  if (options.clean && fs.existsSync(options.outRoot)) fs.rmSync(options.outRoot, { recursive: true, force: true });
  ensureDir(options.outRoot);

  const paths = {
    applyOut: path.join(options.outRoot, '01_apply'),
    featureBuildOut: path.join(options.outRoot, '02_feature_merge'),
    mediaBuildOut: path.join(options.outRoot, '03_media_index'),
    pipelineReport: path.join(options.outRoot, 'pipeline-report.json'),
    dataSplit: dataRootPath(options.dataRoot, 'Data_Spilt'),
    picture: dataRootPath(options.dataRoot, 'Picture'),
    mediaIndexSplit: dataRootPath(options.dataRoot, 'Media_Index_Spilt'),
    dataMerge: dataRootPath(options.dataRoot, 'Data_Merge'),
    dataIndex: dataRootPath(options.dataRoot, 'Data_Index'),
    mediaIndexMerge: dataRootPath(options.dataRoot, 'Media_Index_Merge'),
  };

  const steps = [];

  const applyScript = options.write ? 'scripts/relay/apply-native-relay-package.mjs' : 'scripts/relay/apply-native-relay-package-dry-run.mjs';
  const applyArgs = [
    '--relay', options.relay,
    '--out', paths.applyOut,
    '--project-id', options.projectId,
  ];
  if (options.explicitDataRoot || options.write) {
    applyArgs.push('--feature-data', paths.dataSplit, '--picture-root', paths.picture, '--media-index-root', paths.mediaIndexSplit);
  }
  pushFlag(applyArgs, options.write, '--write');
  pushFlag(applyArgs, options.backup, '--backup');
  pushFlag(applyArgs, options.allowOverwrite === false, '--no-overwrite');
  pushFlag(applyArgs, options.strictDelete, '--strict-delete');
  steps.push(nodeStep(applyScript, applyArgs, { id: 'apply', label: options.write ? 'Apply RelayPackage to local data root' : 'Dry-run RelayPackage and generate previews' }));

  if (steps.at(-1).status === 'PASS') {
    const featureSplit = options.write ? paths.dataSplit : path.join(paths.applyOut, 'Data_Spilt_preview');
    const featureMerge = options.write ? paths.dataMerge : path.join(paths.featureBuildOut, 'Data_Merge_preview');
    const featureIndex = options.write ? paths.dataIndex : path.join(paths.featureBuildOut, 'Data_Index_preview');
    const featureArgs = [
      '--out', paths.featureBuildOut,
      '--split-root', featureSplit,
      '--merge-root', featureMerge,
      '--index-root', featureIndex,
      '--project-id', options.projectId,
      '--layout', 'auto',
    ];
    pushFlag(featureArgs, options.write, '--write');
    pushFlag(featureArgs, options.strictWorlds, '--strict-worlds');
    steps.push(nodeStep('scripts/feature-data/build-feature-merge-full.mjs', featureArgs, { id: 'build-feature-merge', label: 'Build Data_Merge and Data_Index' }));

    if (steps.at(-1).status === 'PASS') {
      steps.push(nodeStep('scripts/feature-data/verify-feature-merge-full.mjs', featureArgs, { id: 'verify-feature-merge', label: 'Verify Data_Merge and Data_Index' }));
    }
  }

  if (steps.at(-1).status === 'PASS') {
    const mediaSplit = options.write ? paths.mediaIndexSplit : path.join(paths.applyOut, 'Media_Index_Spilt_preview');
    const mediaMerge = options.write ? paths.mediaIndexMerge : path.join(paths.mediaBuildOut, 'Media_Index_Merge_preview');
    const mediaArgs = [
      '--out', paths.mediaBuildOut,
      '--split-root', mediaSplit,
      '--merge-root', mediaMerge,
      '--project-id', options.projectId,
    ];
    pushFlag(mediaArgs, options.write, '--write');
    pushFlag(mediaArgs, options.strictWorlds, '--strict-worlds');
    steps.push(nodeStep('scripts/media-index/build-media-index-full.mjs', mediaArgs, { id: 'build-media-index', label: 'Build Media_Index_Merge' }));

    if (steps.at(-1).status === 'PASS') {
      steps.push(nodeStep('scripts/media-index/verify-media-index-full.mjs', mediaArgs, { id: 'verify-media-index', label: 'Verify Media_Index_Merge' }));
    }
  }

  const applySummary = options.write
    ? (readJsonSafe(path.join(paths.applyOut, 'apply-report.json'))?.dryRunSummary ?? {})
    : (readJsonSafe(path.join(paths.applyOut, 'dry-run-report.json'))?.summary ?? {});
  const featureMergeSummary = stageSummaryFromJson(path.join(paths.featureBuildOut, 'build-report.json'));
  const mediaIndexSummary = stageSummaryFromJson(path.join(paths.mediaBuildOut, 'build-report.json'));
  const report = reportFromSteps(options, steps, paths, { applySummary, featureMergeSummary, mediaIndexSummary });
  writeJson(paths.pipelineReport, report);
  return { report, steps, paths };
}
