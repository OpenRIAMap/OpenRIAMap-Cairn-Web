import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { rel, writeJson } from '../relay/native-relay-package-tools.mjs';

const root = process.cwd();
const DEFAULT_PROJECT_ID = 'openriamap-ria';
const DEFAULT_RELAY = path.join(root, 'docs', '30_data-contracts', 'examples', 'native-relay-package-sample');
const DEFAULT_OUT_ROOT = path.join(root, '.cairnmap-actions', 'native-relay-precheck');
const SCHEMA_VERSION = 'cairnmap.native-relay-precheck-report.v1';
const GENERATED_AT = '1970-01-01T00:00:00.000Z';

function resolveFromRoot(value) {
  return path.resolve(root, value);
}

function normalizeSlashes(value) {
  return String(value || '').replace(/\\/g, '/');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function rmDirIfExists(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
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

function assertPrecheckSafety(options) {
  if (options.write) throw new Error('[precheck-safety] write mode is not supported by ACTIONS_RELAY_PRECHECK_1. Use the local pipeline or a later accept action for writes.');
  const outRoot = path.resolve(options.outRoot);
  const relay = path.resolve(options.relay);
  if (outRoot === path.parse(outRoot).root) throw new Error(`[precheck-safety] --out must not be a filesystem root: ${outRoot}`);
  if (options.dataRoot) {
    const dataRoot = path.resolve(options.dataRoot);
    if (dataRoot === path.parse(dataRoot).root) throw new Error(`[precheck-safety] --data-root must not be a filesystem root: ${dataRoot}`);
    if (isSubPath(outRoot, dataRoot) || isSubPath(dataRoot, outRoot)) {
      throw new Error(`[precheck-safety] --out must not overlap --data-root: ${normalizeSlashes(outRoot)} / ${normalizeSlashes(dataRoot)}`);
    }
  }
  if (isSubPath(relay, outRoot) || isSubPath(outRoot, relay)) {
    throw new Error(`[precheck-safety] --out must not overlap RelayPackage input: ${normalizeSlashes(outRoot)} / ${normalizeSlashes(relay)}`);
  }
}

export function parseNativeRelayPrecheckArgs(argv = process.argv.slice(2)) {
  const result = {
    relay: DEFAULT_RELAY,
    outRoot: DEFAULT_OUT_ROOT,
    projectId: DEFAULT_PROJECT_ID,
    dataRoot: null,
    strictWorlds: false,
    clean: true,
    explicitRelay: false,
    write: false,
    reviewStatusPath: null,
    reviewPackageRoot: null,
    updateReviewStatus: false,
    precheckRunId: process.env.GITHUB_RUN_ID || null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--relay' || arg === '--package' || arg === '--package-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.relay = resolveFromRoot(next);
      result.explicitRelay = true;
      i += 1;
    } else if (arg === '--out' || arg === '--out-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.outRoot = resolveFromRoot(next);
      i += 1;
    } else if (arg === '--project-id') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a project id`);
      result.projectId = next;
      i += 1;
    } else if (arg === '--data-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.dataRoot = resolveFromRoot(next);
      i += 1;
    } else if (arg === '--review-status-path') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.reviewStatusPath = resolveFromRoot(next);
      i += 1;
    } else if (arg === '--review-package-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.reviewPackageRoot = resolveFromRoot(next);
      i += 1;
    } else if (arg === '--precheck-run-id') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a run id`);
      result.precheckRunId = next;
      i += 1;
    } else if (arg === '--update-review-status') {
      result.updateReviewStatus = true;
    } else if (arg === '--strict-worlds') {
      result.strictWorlds = true;
    } else if (arg === '--no-clean') {
      result.clean = false;
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

export function nativeRelayPrecheckHelp() {
  return [
    'Usage:',
    '  npm run action:native-relay-precheck -- --relay <NativeRelayPackageDirOrZip> [--data-root <OpenRIAMap-DataDir>] [--out <outputDir>] [--project-id openriamap-ria]',
    '  node ./scripts/actions/native-relay-precheck.mjs --relay ./incoming/RelayPackage.zip --out .cairnmap-actions/native-relay-precheck',
    '',
    'This command is read-only for data roots. Add --update-review-status with --review-status-path to update a review-status.json sidecar after the precheck report is generated.',
  ].join('\n');
}

function nodeStep(scriptRelativePath, args, options) {
  const command = process.execPath;
  const commandArgs = [path.join(root, scriptRelativePath), ...args.filter((item) => item !== null && item !== undefined && item !== false)];
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 30,
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

function copyIfExists(source, target) {
  if (!fs.existsSync(source)) return false;
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
  return true;
}

function reportFromSteps(options, steps, paths, childReports) {
  const failed = steps.filter((step) => step.status !== 'PASS');
  const pipelineReport = childReports.pipelineReport ?? null;
  const pipelineSummary = pipelineReport?.summary ?? {};
  const warnings = [];
  for (const step of steps) {
    const combined = `${step.stdout}\n${step.stderr}`;
    if (combined.includes('[legacy]')) warnings.push(`[${step.id}] legacy path warning was reported by child command`);
  }
  if (Array.isArray(pipelineReport?.warnings)) warnings.push(...pipelineReport.warnings.map((warning) => `[pipeline] ${warning}`));
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: GENERATED_AT,
    projectId: options.projectId,
    mode: 'precheck-dry-run',
    finalStatus: failed.length === 0 && pipelineReport?.finalStatus !== 'FAIL' ? 'PASS' : 'FAIL',
    inputs: {
      relay: normalizeSlashes(options.relay),
      dataRoot: options.dataRoot ? normalizeSlashes(options.dataRoot) : null,
      outRoot: normalizeSlashes(options.outRoot),
      writeEnabled: false,
      strictWorlds: Boolean(options.strictWorlds),
    },
    outputs: Object.fromEntries(Object.entries(paths).map(([key, value]) => [key, normalizeSlashes(value)])),
    summary: {
      stepCount: steps.length,
      passedSteps: steps.filter((step) => step.status === 'PASS').length,
      failedSteps: failed.length,
      pipelineFinalStatus: pipelineReport?.finalStatus ?? null,
      apply: pipelineSummary.apply ?? {},
      featureMerge: pipelineSummary.featureMerge ?? {},
      mediaIndex: pipelineSummary.mediaIndex ?? {},
      warningCount: warnings.length,
      errorCount: failed.length + (pipelineReport?.finalStatus === 'FAIL' ? 1 : 0),
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
    childReports: {
      pipelineReport: childReports.pipelineReport ? normalizeSlashes(paths.pipelineReportCopy) : null,
      applyReport: childReports.applyReport ? normalizeSlashes(paths.applyReportCopy) : null,
      featureMergeBuildReport: childReports.featureMergeBuildReport ? normalizeSlashes(paths.featureMergeBuildReportCopy) : null,
      mediaIndexBuildReport: childReports.mediaIndexBuildReport ? normalizeSlashes(paths.mediaIndexBuildReportCopy) : null,
    },
    warnings,
    errors: failed.map((step) => `[${step.id}] ${step.label} failed with exit code ${step.exitCode}`),
  };
}

export function executeNativeRelayPrecheck(options) {
  assertPrecheckSafety(options);
  if (options.clean) rmDirIfExists(options.outRoot);
  ensureDir(options.outRoot);

  const paths = {
    validationOut: path.join(options.outRoot, '01_validate'),
    pipelineOut: path.join(options.outRoot, '02_pipeline'),
    precheckReport: path.join(options.outRoot, 'precheck-report.json'),
    pipelineReportCopy: path.join(options.outRoot, 'pipeline-report.json'),
    applyReportCopy: path.join(options.outRoot, 'apply-report.json'),
    featureMergeBuildReportCopy: path.join(options.outRoot, 'feature-merge-build-report.json'),
    mediaIndexBuildReportCopy: path.join(options.outRoot, 'media-index-build-report.json'),
  };

  const steps = [];
  ensureDir(paths.validationOut);

  steps.push(nodeStep('scripts/relay/validate-native-relay-package.mjs', ['--relay', options.relay], {
    id: 'validate-relay-package',
    label: 'Validate Native RelayPackage structure and config references',
  }));

  if (steps.at(-1).status === 'PASS') {
    const pipelineArgs = [
      '--relay', options.relay,
      '--out', paths.pipelineOut,
      '--project-id', options.projectId,
    ];
    if (options.dataRoot) pipelineArgs.push('--data-root', options.dataRoot);
    if (options.strictWorlds) pipelineArgs.push('--strict-worlds');
    steps.push(nodeStep('scripts/relay/run-native-relay-local-pipeline.mjs', pipelineArgs, {
      id: 'dry-run-local-pipeline',
      label: 'Run Native Relay local pipeline in dry-run mode',
    }));
  }

  const pipelineReportSource = path.join(paths.pipelineOut, 'pipeline-report.json');
  const applyReportSource = path.join(paths.pipelineOut, '01_apply', 'dry-run-report.json');
  const featureMergeBuildReportSource = path.join(paths.pipelineOut, '02_feature_merge', 'build-report.json');
  const mediaIndexBuildReportSource = path.join(paths.pipelineOut, '03_media_index', 'build-report.json');

  copyIfExists(pipelineReportSource, paths.pipelineReportCopy);
  copyIfExists(applyReportSource, paths.applyReportCopy);
  copyIfExists(featureMergeBuildReportSource, paths.featureMergeBuildReportCopy);
  copyIfExists(mediaIndexBuildReportSource, paths.mediaIndexBuildReportCopy);

  const childReports = {
    pipelineReport: readJsonSafe(paths.pipelineReportCopy),
    applyReport: readJsonSafe(paths.applyReportCopy),
    featureMergeBuildReport: readJsonSafe(paths.featureMergeBuildReportCopy),
    mediaIndexBuildReport: readJsonSafe(paths.mediaIndexBuildReportCopy),
  };

  const report = reportFromSteps(options, steps, paths, childReports);
  writeJson(paths.precheckReport, report);
  return { report, steps, paths };
}
