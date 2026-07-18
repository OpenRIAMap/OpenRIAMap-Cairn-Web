import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { rel, writeJson } from '../relay/native-relay-package-tools.mjs';
import {
  assertAcceptActionGuards,
  validateCommitPathSet,
} from './native-relay-action-guards.mjs';

const root = process.cwd();
const DEFAULT_PROJECT_ID = 'openriamap-ria';
const DEFAULT_RELAY = path.join(root, 'docs', '30_data-contracts', 'examples', 'native-relay-package-sample');
const DEFAULT_OUT_ROOT = path.join(root, '.cairnmap-actions', 'native-relay-accept');
const SCHEMA_VERSION = 'cairnmap.native-relay-accept-report.v1';
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

function isInsideRoot(candidatePath) {
  return isSubPath(root, candidatePath);
}

function rootRelativePath(candidatePath) {
  return normalizeSlashes(path.relative(root, path.resolve(candidatePath)) || '.');
}

function sanitizeBranchFragment(value) {
  return String(value || 'manual')
    .trim()
    .replace(/[^A-Za-z0-9._/-]+/g, '-')
    .replace(/\/+$/g, '')
    .replace(/^\/+/, '') || 'manual';
}

function defaultTargetBranch() {
  const runId = process.env.GITHUB_RUN_ID || 'local-run';
  return `accept/native-relay/${sanitizeBranchFragment(runId)}`;
}

function assertAcceptSafety(options) {
  const outRoot = path.resolve(options.outRoot);
  const relay = path.resolve(options.relay);
  if (outRoot === path.parse(outRoot).root) throw new Error(`[accept-safety] --out must not be a filesystem root: ${outRoot}`);
  if (isSubPath(relay, outRoot) || isSubPath(outRoot, relay)) {
    throw new Error(`[accept-safety] --out must not overlap RelayPackage input: ${normalizeSlashes(outRoot)} / ${normalizeSlashes(relay)}`);
  }
  if (options.write && !options.explicitDataRoot) {
    throw new Error('[accept-safety] --data-root must be explicitly provided when --write is enabled.');
  }
  if (options.write) {
    const dataRoot = path.resolve(options.dataRoot);
    if (dataRoot === path.parse(dataRoot).root) throw new Error(`[accept-safety] --data-root must not be a filesystem root: ${dataRoot}`);
    if (isSubPath(outRoot, dataRoot) || isSubPath(dataRoot, outRoot)) {
      throw new Error(`[accept-safety] --out must not overlap --data-root: ${normalizeSlashes(outRoot)} / ${normalizeSlashes(dataRoot)}`);
    }
    if (isSubPath(relay, dataRoot) || isSubPath(dataRoot, relay)) {
      throw new Error(`[accept-safety] --data-root must not overlap RelayPackage input: ${normalizeSlashes(dataRoot)} / ${normalizeSlashes(relay)}`);
    }
  }
  if (options.commitChanges && !options.write) {
    throw new Error('[accept-safety] --commit-changes requires --write.');
  }
  if (options.pushChanges && !options.commitChanges) {
    throw new Error('[accept-safety] --push requires --commit-changes.');
  }
  if (options.commitChanges && !isInsideRoot(options.dataRoot)) {
    throw new Error('[accept-safety] --commit-changes requires --data-root to be inside the checked-out repository.');
  }
}

export function parseNativeRelayAcceptArgs(argv = process.argv.slice(2)) {
  const result = {
    relay: DEFAULT_RELAY,
    outRoot: DEFAULT_OUT_ROOT,
    dataRoot: path.join(DEFAULT_OUT_ROOT, 'data-root-preview'),
    projectId: DEFAULT_PROJECT_ID,
    targetBranch: defaultTargetBranch(),
    commitMessage: 'Accept Native RelayPackage update',
    write: false,
    commitChanges: false,
    pushChanges: false,
    strictWorlds: false,
    backup: false,
    allowOverwrite: true,
    strictDelete: false,
    clean: true,
    precheckReport: null,
    precheckRunId: null,
    reviewStatusPath: null,
    reviewPackageRoot: null,
    updateReviewStatus: false,
    explicitRelay: false,
    explicitDataRoot: false,
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
      if (!result.explicitDataRoot) result.dataRoot = path.join(result.outRoot, 'data-root-preview');
      i += 1;
    } else if (arg === '--data-root') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a path`);
      result.dataRoot = resolveFromRoot(next);
      result.explicitDataRoot = true;
      i += 1;
    } else if (arg === '--project-id') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a project id`);
      result.projectId = next;
      i += 1;
    } else if (arg === '--precheck-report') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a report path`);
      result.precheckReport = resolveFromRoot(next);
      i += 1;
    } else if (arg === '--precheck-run-id') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a run id`);
      result.precheckRunId = next;
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
    } else if (arg === '--update-review-status') {
      result.updateReviewStatus = true;
    } else if (arg === '--target-branch') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a branch name`);
      result.targetBranch = next;
      i += 1;
    } else if (arg === '--commit-message') {
      const next = argv[i + 1];
      if (!next) throw new Error(`${arg} requires a commit message`);
      result.commitMessage = next;
      i += 1;
    } else if (arg === '--write') {
      result.write = true;
    } else if (arg === '--commit-changes') {
      result.commitChanges = true;
    } else if (arg === '--push') {
      result.pushChanges = true;
    } else if (arg === '--strict-worlds') {
      result.strictWorlds = true;
    } else if (arg === '--backup') {
      result.backup = true;
    } else if (arg === '--no-overwrite') {
      result.allowOverwrite = false;
    } else if (arg === '--strict-delete') {
      result.strictDelete = true;
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

export function nativeRelayAcceptHelp() {
  return [
    'Usage:',
    '  npm run action:native-relay-accept -- --relay <NativeRelayPackageDirOrZip> --data-root <OpenRIAMap-DataDir> --write [--commit-changes] [--push]',
    '  node ./scripts/actions/native-relay-accept.mjs --relay ./incoming/RelayPackage.zip --data-root ./OpenRIAMap-Data --write --commit-changes --target-branch accept/native-relay/manual-test',
    '',
    'Default mode is safe and does not write. --write is required to update a local data root. --commit-changes is required to create a git commit. --push is required to push the branch.',
    'Accept guards enforce RelayPackages/pending or prechecked package roots, OpenRIAMap-Data or approved preview data roots, and accept/native-relay/* commit branches.',
    'Add --update-review-status with --review-status-path to update a review-status.json sidecar after accept-report.json is generated.',
  ].join('\n');
}

function step(command, commandArgs, options) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 40,
  });
  const finishedAt = new Date().toISOString();
  const exitCode = typeof result.status === 'number' ? result.status : 1;
  return {
    id: options.id,
    label: options.label,
    command: path.basename(command),
    args: commandArgs.map(normalizeSlashes),
    startedAt,
    finishedAt,
    exitCode,
    status: exitCode === 0 ? 'PASS' : 'FAIL',
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

function nodeStep(scriptRelativePath, args, options) {
  const commandArgs = [path.join(root, scriptRelativePath), ...args.filter((item) => item !== null && item !== undefined && item !== false)];
  return step(process.execPath, commandArgs, { ...options, script: scriptRelativePath });
}

function gitStep(args, options) {
  return step('git', args, options);
}

function pushFlag(args, condition, flag) {
  if (condition) args.push(flag);
}

function writeText(filePath, text) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, text, 'utf8');
}

function tailLines(text, n = 30) {
  return String(text || '').split(/\r?\n/).filter(Boolean).slice(-n);
}

function collectGitDiffSummary(options, paths) {
  if (!isInsideRoot(options.dataRoot)) {
    const text = `Data root is outside the repository; git diff summary is not available.\nData root: ${normalizeSlashes(options.dataRoot)}\n`;
    writeText(paths.gitDiffSummary, text);
    return { available: false, dataRootInRepository: false, statusShort: [], hasChanges: false };
  }
  const dataRootRel = rootRelativePath(options.dataRoot);
  const status = spawnSync('git', ['status', '--short', '--', dataRootRel], { cwd: root, encoding: 'utf8' });
  const diff = spawnSync('git', ['diff', '--stat', '--', dataRootRel], { cwd: root, encoding: 'utf8' });
  const statusShort = String(status.stdout || '').split(/\r?\n/).filter(Boolean);
  const text = [
    `Data root: ${dataRootRel}`,
    '',
    'git status --short:',
    statusShort.length > 0 ? statusShort.join('\n') : '(no changes)',
    '',
    'git diff --stat:',
    String(diff.stdout || '').trim() || '(no tracked diff; new files may be listed only in status)',
    '',
  ].join('\n');
  writeText(paths.gitDiffSummary, text);
  const commitPathGuard = validateCommitPathSet(statusShort, options.dataRoot);
  return {
    available: true,
    dataRootInRepository: true,
    dataRootRel,
    statusShort,
    hasChanges: statusShort.length > 0,
    commitPathGuard,
  };
}

function ensureGitIdentity(gitSteps) {
  const currentName = spawnSync('git', ['config', '--get', 'user.name'], { cwd: root, encoding: 'utf8' });
  if (!String(currentName.stdout || '').trim()) {
    gitSteps.push(gitStep(['config', 'user.name', 'CairnMap Action'], { id: 'git-config-name', label: 'Configure git user.name' }));
  }
  const currentEmail = spawnSync('git', ['config', '--get', 'user.email'], { cwd: root, encoding: 'utf8' });
  if (!String(currentEmail.stdout || '').trim()) {
    gitSteps.push(gitStep(['config', 'user.email', 'cairnmap-action@example.invalid'], { id: 'git-config-email', label: 'Configure git user.email' }));
  }
}

function commitChanges(options, paths, gitSummary) {
  const gitSteps = [];
  if (!gitSummary.hasChanges) return { status: 'NO_CHANGES', branch: null, committed: false, pushed: false, steps: gitSteps };
  if (gitSummary.commitPathGuard?.finalStatus === 'FAIL') {
    return { status: 'FAIL', branch: null, committed: false, pushed: false, steps: gitSteps, guardErrors: gitSummary.commitPathGuard.errors };
  }

  ensureGitIdentity(gitSteps);
  if (gitSteps.some((item) => item.status !== 'PASS')) return { status: 'FAIL', branch: null, committed: false, pushed: false, steps: gitSteps };

  gitSteps.push(gitStep(['checkout', '-B', options.targetBranch], { id: 'git-checkout-branch', label: `Create or reset accept branch ${options.targetBranch}` }));
  if (gitSteps.at(-1).status !== 'PASS') return { status: 'FAIL', branch: options.targetBranch, committed: false, pushed: false, steps: gitSteps };

  gitSteps.push(gitStep(['add', '--', gitSummary.dataRootRel], { id: 'git-add-data-root', label: 'Stage data root changes' }));
  if (gitSteps.at(-1).status !== 'PASS') return { status: 'FAIL', branch: options.targetBranch, committed: false, pushed: false, steps: gitSteps };

  const staged = spawnSync('git', ['diff', '--cached', '--quiet', '--', gitSummary.dataRootRel], { cwd: root, encoding: 'utf8' });
  if (staged.status === 0) return { status: 'NO_STAGED_CHANGES', branch: options.targetBranch, committed: false, pushed: false, steps: gitSteps };

  gitSteps.push(gitStep(['commit', '-m', options.commitMessage], { id: 'git-commit', label: 'Commit accepted relay data changes' }));
  if (gitSteps.at(-1).status !== 'PASS') return { status: 'FAIL', branch: options.targetBranch, committed: false, pushed: false, steps: gitSteps };

  if (options.pushChanges) {
    gitSteps.push(gitStep(['push', '--set-upstream', 'origin', options.targetBranch], { id: 'git-push', label: 'Push accept branch' }));
    if (gitSteps.at(-1).status !== 'PASS') return { status: 'FAIL', branch: options.targetBranch, committed: true, pushed: false, steps: gitSteps };
    return { status: 'COMMITTED_AND_PUSHED', branch: options.targetBranch, committed: true, pushed: true, steps: gitSteps };
  }

  return { status: 'COMMITTED_NOT_PUSHED', branch: options.targetBranch, committed: true, pushed: false, steps: gitSteps };
}

function buildReport(options, paths, steps, childReports, gitSummary, gitCommitResult, guardReport) {
  const allSteps = [...steps, ...(gitCommitResult?.steps ?? [])];
  const failed = allSteps.filter((item) => item.status !== 'PASS');
  const pipelineReport = childReports.pipelineReport ?? null;
  const pipelineSummary = pipelineReport?.summary ?? {};
  const warningMessages = [];
  for (const stepItem of allSteps) {
    const combined = `${stepItem.stdout}\n${stepItem.stderr}`;
    if (combined.includes('[legacy]')) warningMessages.push(`[${stepItem.id}] legacy path warning was reported by child command`);
  }
  if (Array.isArray(pipelineReport?.warnings)) warningMessages.push(...pipelineReport.warnings.map((warning) => `[pipeline] ${warning}`));
  const pipelineFailed = pipelineReport?.finalStatus === 'FAIL';
  const gitFailed = options.commitChanges && gitCommitResult?.status === 'FAIL';
  if (guardReport?.warnings?.length) warningMessages.push(...guardReport.warnings.map((warning) => `[guard] ${warning}`));

  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: GENERATED_AT,
    projectId: options.projectId,
    mode: options.write ? 'accept-write' : 'accept-dry-run',
    finalStatus: failed.length === 0 && !pipelineFailed && !gitFailed ? 'PASS' : 'FAIL',
    inputs: {
      relay: normalizeSlashes(options.relay),
      dataRoot: normalizeSlashes(options.dataRoot),
      outRoot: normalizeSlashes(options.outRoot),
      writeEnabled: Boolean(options.write),
      commitChanges: Boolean(options.commitChanges),
      pushChanges: Boolean(options.pushChanges),
      targetBranch: options.targetBranch,
      strictWorlds: Boolean(options.strictWorlds),
      precheckReport: options.precheckReport ? normalizeSlashes(options.precheckReport) : null,
      precheckRunId: options.precheckRunId ?? null,
    },
    outputs: Object.fromEntries(Object.entries(paths).map(([key, value]) => [key, normalizeSlashes(value)])),
    summary: {
      stepCount: allSteps.length,
      passedSteps: allSteps.filter((item) => item.status === 'PASS').length,
      failedSteps: failed.length,
      pipelineFinalStatus: pipelineReport?.finalStatus ?? null,
      apply: pipelineSummary.apply ?? {},
      featureMerge: pipelineSummary.featureMerge ?? {},
      mediaIndex: pipelineSummary.mediaIndex ?? {},
      guards: {
        finalStatus: guardReport?.finalStatus ?? null,
        relay: guardReport?.checked?.relay ?? null,
        dataRoot: guardReport?.checked?.dataRoot ?? null,
        targetBranch: guardReport?.checked?.targetBranch ?? null,
        warningCount: guardReport?.warnings?.length ?? 0,
        errorCount: guardReport?.errors?.length ?? 0,
      },
      git: {
        available: gitSummary.available,
        dataRootInRepository: gitSummary.dataRootInRepository,
        hasChanges: gitSummary.hasChanges,
        status: gitCommitResult?.status ?? (options.commitChanges ? 'NOT_RUN' : 'SKIPPED'),
        branch: gitCommitResult?.branch ?? null,
        committed: Boolean(gitCommitResult?.committed),
        pushed: Boolean(gitCommitResult?.pushed),
      },
      warningCount: warningMessages.length,
      errorCount: failed.length + (pipelineFailed ? 1 : 0) + (gitFailed ? 1 : 0) + (guardReport?.errors?.length ?? 0),
    },
    steps: allSteps.map((item) => ({
      id: item.id,
      label: item.label,
      command: item.command,
      args: item.args,
      exitCode: item.exitCode,
      status: item.status,
      stdoutTail: tailLines(item.stdout),
      stderrTail: tailLines(item.stderr),
    })),
    childReports: {
      pipelineReport: fs.existsSync(paths.pipelineReport) ? normalizeSlashes(paths.pipelineReport) : null,
      applyReport: fs.existsSync(paths.applyReport) ? normalizeSlashes(paths.applyReport) : null,
      featureMergeBuildReport: fs.existsSync(paths.featureMergeBuildReport) ? normalizeSlashes(paths.featureMergeBuildReport) : null,
      mediaIndexBuildReport: fs.existsSync(paths.mediaIndexBuildReport) ? normalizeSlashes(paths.mediaIndexBuildReport) : null,
    },
    guards: guardReport ?? null,
    git: {
      diffSummaryPath: normalizeSlashes(paths.gitDiffSummary),
      ...gitSummary,
      commit: gitCommitResult ?? null,
    },
    warnings: warningMessages,
    errors: [
      ...failed.map((item) => `[${item.id}] ${item.label} failed with exit code ${item.exitCode}`),
      ...(pipelineFailed ? ['[pipeline] pipeline finalStatus is FAIL'] : []),
      ...(gitFailed ? ['[git] git commit/push stage failed'] : []),
      ...(gitCommitResult?.guardErrors ?? []),
      ...(guardReport?.errors?.map((error) => `[guard] ${error}`) ?? []),
    ],
  };
}

export function executeNativeRelayAccept(options) {
  const guardReport = assertAcceptActionGuards(options);
  assertAcceptSafety(options);
  if (options.clean && fs.existsSync(options.outRoot)) fs.rmSync(options.outRoot, { recursive: true, force: true });
  ensureDir(options.outRoot);

  const paths = {
    outRoot: options.outRoot,
    pipelineOut: path.join(options.outRoot, '01_pipeline'),
    acceptReport: path.join(options.outRoot, 'accept-report.json'),
    pipelineReport: path.join(options.outRoot, '01_pipeline', 'pipeline-report.json'),
    applyReport: path.join(options.outRoot, '01_pipeline', '01_apply', 'apply-report.json'),
    dryRunReport: path.join(options.outRoot, '01_pipeline', '01_apply', 'dry-run-report.json'),
    featureMergeBuildReport: path.join(options.outRoot, '01_pipeline', '02_feature_merge', 'build-report.json'),
    mediaIndexBuildReport: path.join(options.outRoot, '01_pipeline', '03_media_index', 'build-report.json'),
    gitDiffSummary: path.join(options.outRoot, 'git-diff-summary.txt'),
  };

  const steps = [];
  steps.push(nodeStep('scripts/relay/validate-native-relay-package.mjs', ['--package', options.relay], { id: 'validate-relay-package', label: 'Validate Native RelayPackage' }));

  if (steps.at(-1).status === 'PASS') {
    const pipelineArgs = [
      '--relay', options.relay,
      '--out', paths.pipelineOut,
      '--project-id', options.projectId,
    ];
    if (options.explicitDataRoot || options.write) pipelineArgs.push('--data-root', options.dataRoot);
    pushFlag(pipelineArgs, options.write, '--write');
    pushFlag(pipelineArgs, options.backup, '--backup');
    pushFlag(pipelineArgs, options.allowOverwrite === false, '--no-overwrite');
    pushFlag(pipelineArgs, options.strictDelete, '--strict-delete');
    pushFlag(pipelineArgs, options.strictWorlds, '--strict-worlds');
    steps.push(nodeStep('scripts/relay/run-native-relay-local-pipeline.mjs', pipelineArgs, { id: 'run-local-pipeline', label: options.write ? 'Run local accept pipeline in write mode' : 'Run local accept pipeline in dry-run mode' }));
  }

  const childReports = {
    pipelineReport: readJsonSafe(paths.pipelineReport),
  };
  const gitSummary = collectGitDiffSummary(options, paths);
  const gitCommitResult = options.commitChanges && steps.every((item) => item.status === 'PASS') && childReports.pipelineReport?.finalStatus !== 'FAIL'
    ? commitChanges(options, paths, gitSummary)
    : null;
  const report = buildReport(options, paths, steps, childReports, gitSummary, gitCommitResult, guardReport);
  writeJson(paths.acceptReport, report);
  return { report, paths };
}
