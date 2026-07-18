import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

export const root = process.cwd();
export const REVIEW_SCHEMA_VERSION = 'cairnmap.relay-review-status.v1';
export const INBOX_SCHEMA_VERSION = 'cairnmap.relay-review-inbox.v1';
export const GENERATED_AT = '1970-01-01T00:00:00.000Z';
export const DEFAULT_PROJECT_ID = 'openriamap-ria';
export const DEFAULT_WORLD_ID = 'zth';
export const DEFAULT_PACKAGE_ROOT = path.join(root, 'docs', '30_data-contracts', 'examples', 'native-relay-package-sample');
export const DEFAULT_WORK_ROOT = path.join(root, '.cairnmap-tmp', 'relay-review-workflow');
export const DEFAULT_STATUS_PATH = path.join(DEFAULT_WORK_ROOT, 'review-status.json');
export const DEFAULT_INBOX_ROOT = path.join(root, 'docs', '30_data-contracts', 'examples', 'relay-review-workflow-sample', 'RelayPackages');

export const REVIEW_STATUSES = new Set([
  'pending',
  'precheck_running',
  'prechecked',
  'precheck_failed',
  'accepted',
  'accept_failed',
  'rejected',
  'changes_requested',
  'archived',
]);

const ALLOWED_TRANSITIONS = new Map([
  ['pending', new Set(['precheck_running', 'prechecked', 'precheck_failed', 'rejected', 'changes_requested', 'archived'])],
  ['precheck_running', new Set(['prechecked', 'precheck_failed'])],
  ['prechecked', new Set(['accepted', 'accept_failed', 'rejected', 'changes_requested', 'archived'])],
  ['precheck_failed', new Set(['precheck_running', 'rejected', 'changes_requested', 'archived'])],
  ['accept_failed', new Set(['precheck_running', 'accepted', 'rejected', 'changes_requested', 'archived'])],
  ['changes_requested', new Set(['precheck_running', 'rejected', 'archived'])],
  ['rejected', new Set(['archived'])],
  ['accepted', new Set(['archived'])],
  ['archived', new Set([])],
]);

export function normalizeSlashes(value) {
  return String(value || '').replace(/\\/g, '/');
}

export function rel(filePath) {
  return normalizeSlashes(path.relative(root, path.resolve(filePath)) || '.');
}

export function resolveFromRoot(value) {
  return path.resolve(root, value);
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return readJson(filePath);
  } catch {
    return null;
  }
}

export function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
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
  return result.sort((a, b) => normalizeSlashes(a).localeCompare(normalizeSlashes(b)));
}

export function packageIdFromPath(packageRoot) {
  const base = path.basename(path.resolve(packageRoot));
  if (base && base !== 'native-relay-package-sample') return base;
  const index = readJsonSafe(path.join(packageRoot, 'INDEX.json'));
  const operator = index?.operator || 'sample';
  const version = index?.packageVersion || index?.version || 'draft';
  return `RelayPackage_${operator}_${version}`.replace(/[^A-Za-z0-9._-]+/g, '-');
}

export function inferWorldId(packageRoot, fallback = DEFAULT_WORLD_ID) {
  const splitRoot = path.join(packageRoot, 'Data_Spilt');
  if (fs.existsSync(splitRoot)) {
    const dirs = fs.readdirSync(splitRoot, { withFileTypes: true }).filter((item) => item.isDirectory()).map((item) => item.name).sort();
    if (dirs.length > 0) return dirs[0];
  }
  return fallback;
}

export function createInitialReviewStatus(options = {}) {
  const packageRoot = options.packageRoot ? path.resolve(options.packageRoot) : DEFAULT_PACKAGE_ROOT;
  const packageId = options.packageId || packageIdFromPath(packageRoot);
  const projectId = options.projectId || DEFAULT_PROJECT_ID;
  const worldId = options.worldId || inferWorldId(packageRoot, DEFAULT_WORLD_ID);
  const now = options.now || GENERATED_AT;
  return {
    schemaVersion: REVIEW_SCHEMA_VERSION,
    packageId,
    projectId,
    worldId,
    status: options.status || 'pending',
    createdAt: now,
    updatedAt: now,
    currentStage: 'created',
    package: {
      path: normalizeSlashes(options.packagePath || rel(packageRoot)),
      type: options.packageType || 'native-relay-package',
    },
    precheck: {
      status: 'NOT_RUN',
      runId: null,
      reportPath: null,
      finalStatus: null,
      updatedAt: null,
    },
    accept: {
      status: 'NOT_RUN',
      runId: null,
      reportPath: null,
      finalStatus: null,
      updatedAt: null,
    },
    review: {
      decision: null,
      reviewer: null,
      comment: null,
      decidedAt: null,
    },
    history: [
      {
        at: now,
        from: null,
        to: options.status || 'pending',
        stage: 'init',
        reason: 'review status initialized',
      },
    ],
    warnings: [],
    errors: [],
  };
}

export function validateReviewStatusObject(status) {
  const errors = [];
  const warnings = [];
  if (!status || typeof status !== 'object' || Array.isArray(status)) {
    return { finalStatus: 'FAIL', errors: ['review status must be an object'], warnings };
  }
  if (status.schemaVersion !== REVIEW_SCHEMA_VERSION) errors.push(`schemaVersion must be ${REVIEW_SCHEMA_VERSION}`);
  for (const field of ['packageId', 'projectId', 'worldId', 'status', 'createdAt', 'updatedAt']) {
    if (typeof status[field] !== 'string' || status[field].length === 0) errors.push(`${field} is required`);
  }
  if (!REVIEW_STATUSES.has(status.status)) errors.push(`invalid status: ${status.status}`);
  if (!Array.isArray(status.history)) errors.push('history must be an array');
  if (status.precheck && !['NOT_RUN', 'RUNNING', 'PASS', 'FAIL'].includes(status.precheck.status)) warnings.push(`unexpected precheck.status: ${status.precheck.status}`);
  if (status.accept && !['NOT_RUN', 'RUNNING', 'PASS', 'FAIL'].includes(status.accept.status)) warnings.push(`unexpected accept.status: ${status.accept.status}`);
  return { finalStatus: errors.length === 0 ? 'PASS' : 'FAIL', errors, warnings };
}

export function assertAllowedTransition(from, to) {
  if (from === to) return;
  if (!REVIEW_STATUSES.has(to)) throw new Error(`[review-status] invalid target status: ${to}`);
  const allowed = ALLOWED_TRANSITIONS.get(from);
  if (!allowed || !allowed.has(to)) {
    throw new Error(`[review-status] invalid transition: ${from} -> ${to}`);
  }
}

export function transitionReviewStatus(status, options = {}) {
  const targetStatus = options.status;
  if (!targetStatus) throw new Error('[review-status] status is required');
  const now = options.now || GENERATED_AT;
  const current = status.status || 'pending';
  if (!options.allowSameStatus) assertAllowedTransition(current, targetStatus);

  const next = JSON.parse(JSON.stringify(status));
  next.status = targetStatus;
  next.updatedAt = now;
  next.currentStage = options.stage || stageForStatus(targetStatus);
  if (!Array.isArray(next.history)) next.history = [];
  next.history.push({
    at: now,
    from: current,
    to: targetStatus,
    stage: options.stage || stageForStatus(targetStatus),
    reason: options.reason || null,
    runId: options.runId || null,
    reportPath: options.reportPath ? normalizeSlashes(options.reportPath) : null,
  });
  return next;
}

export function stageForStatus(status) {
  if (String(status).startsWith('precheck')) return 'precheck';
  if (String(status).startsWith('accept') || status === 'accepted') return 'accept';
  if (status === 'rejected' || status === 'changes_requested') return 'manual-review';
  if (status === 'archived') return 'archive';
  return 'pending';
}

function reportFinalStatus(report) {
  return report?.finalStatus || report?.summary?.pipelineFinalStatus || null;
}

export function statusFromPrecheckReport(report) {
  const finalStatus = reportFinalStatus(report);
  return finalStatus === 'PASS' ? 'prechecked' : 'precheck_failed';
}

export function statusFromAcceptReport(report) {
  const finalStatus = reportFinalStatus(report);
  return finalStatus === 'PASS' ? 'accepted' : 'accept_failed';
}

export function applyPrecheckReportToStatus(status, options = {}) {
  const report = options.report || readJsonSafe(options.reportPath);
  const finalStatus = reportFinalStatus(report);
  const targetStatus = finalStatus === 'PASS' ? 'prechecked' : 'precheck_failed';
  let next = transitionReviewStatus(status, {
    status: targetStatus,
    stage: 'precheck',
    reason: finalStatus === 'PASS' ? 'precheck passed' : 'precheck failed',
    runId: options.runId || report?.inputs?.runId || null,
    reportPath: options.reportPath ? rel(options.reportPath) : report?.outputs?.precheckReport || null,
    now: options.now || GENERATED_AT,
  });
  next.precheck = {
    status: finalStatus === 'PASS' ? 'PASS' : 'FAIL',
    runId: options.runId || null,
    reportPath: options.reportPath ? normalizeSlashes(rel(options.reportPath)) : null,
    finalStatus: finalStatus || 'FAIL',
    updatedAt: options.now || GENERATED_AT,
  };
  return next;
}

export function applyAcceptReportToStatus(status, options = {}) {
  const report = options.report || readJsonSafe(options.reportPath);
  const finalStatus = reportFinalStatus(report);
  const targetStatus = finalStatus === 'PASS' ? 'accepted' : 'accept_failed';
  let next = transitionReviewStatus(status, {
    status: targetStatus,
    stage: 'accept',
    reason: finalStatus === 'PASS' ? 'accept passed' : 'accept failed',
    runId: options.runId || report?.inputs?.precheckRunId || null,
    reportPath: options.reportPath ? rel(options.reportPath) : report?.outputs?.acceptReport || null,
    now: options.now || GENERATED_AT,
  });
  next.accept = {
    status: finalStatus === 'PASS' ? 'PASS' : 'FAIL',
    runId: options.runId || null,
    reportPath: options.reportPath ? normalizeSlashes(rel(options.reportPath)) : null,
    finalStatus: finalStatus || 'FAIL',
    updatedAt: options.now || GENERATED_AT,
  };
  return next;
}

export function manualReviewDecision(status, options = {}) {
  const decision = options.decision;
  const statusMap = {
    reject: 'rejected',
    rejected: 'rejected',
    request_changes: 'changes_requested',
    changes_requested: 'changes_requested',
    archive: 'archived',
    archived: 'archived',
  };
  const targetStatus = statusMap[decision];
  if (!targetStatus) throw new Error(`[review-status] unsupported manual decision: ${decision}`);
  let next = transitionReviewStatus(status, {
    status: targetStatus,
    stage: targetStatus === 'archived' ? 'archive' : 'manual-review',
    reason: options.reason || decision,
    now: options.now || GENERATED_AT,
  });
  next.review = {
    decision: targetStatus,
    reviewer: options.reviewer || null,
    comment: options.comment || null,
    decidedAt: options.now || GENERATED_AT,
  };
  return next;
}

export function loadOrCreateStatus(statusPath, options = {}) {
  if (fs.existsSync(statusPath)) return readJson(statusPath);
  return createInitialReviewStatus(options);
}

export function parseCommonReviewArgs(argv = process.argv.slice(2)) {
  const options = {
    statusPath: DEFAULT_STATUS_PATH,
    packageRoot: DEFAULT_PACKAGE_ROOT,
    packageId: null,
    projectId: DEFAULT_PROJECT_ID,
    worldId: DEFAULT_WORLD_ID,
    reportPath: null,
    runId: null,
    status: null,
    decision: null,
    reviewer: null,
    comment: null,
    reason: null,
    inboxRoot: DEFAULT_INBOX_ROOT,
    stage: null,
    write: true,
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--status-path') { if (!next) throw new Error(`${arg} requires a path`); options.statusPath = resolveFromRoot(next); i += 1; }
    else if (arg === '--package-root' || arg === '--package') { if (!next) throw new Error(`${arg} requires a path`); options.packageRoot = resolveFromRoot(next); i += 1; }
    else if (arg === '--package-id') { if (!next) throw new Error(`${arg} requires a value`); options.packageId = next; i += 1; }
    else if (arg === '--project-id') { if (!next) throw new Error(`${arg} requires a value`); options.projectId = next; i += 1; }
    else if (arg === '--world-id') { if (!next) throw new Error(`${arg} requires a value`); options.worldId = next; i += 1; }
    else if (arg === '--report' || arg === '--report-path') { if (!next) throw new Error(`${arg} requires a path`); options.reportPath = resolveFromRoot(next); i += 1; }
    else if (arg === '--run-id') { if (!next) throw new Error(`${arg} requires a value`); options.runId = next; i += 1; }
    else if (arg === '--status') { if (!next) throw new Error(`${arg} requires a value`); options.status = next; i += 1; }
    else if (arg === '--decision') { if (!next) throw new Error(`${arg} requires a value`); options.decision = next; i += 1; }
    else if (arg === '--reviewer') { if (!next) throw new Error(`${arg} requires a value`); options.reviewer = next; i += 1; }
    else if (arg === '--comment') { if (!next) throw new Error(`${arg} requires a value`); options.comment = next; i += 1; }
    else if (arg === '--reason') { if (!next) throw new Error(`${arg} requires a value`); options.reason = next; i += 1; }
    else if (arg === '--inbox-root') { if (!next) throw new Error(`${arg} requires a path`); options.inboxRoot = resolveFromRoot(next); i += 1; }
    else if (arg === '--stage') { if (!next) throw new Error(`${arg} requires a value`); options.stage = next; i += 1; }
    else if (arg === '--no-write') { options.write = false; }
    else if (arg === '--help' || arg === '-h') { options.help = true; }
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

export function listInbox(inboxRoot = DEFAULT_INBOX_ROOT) {
  const buckets = ['pending', 'prechecked', 'accepted', 'rejected', 'failed', 'archived'];
  const packages = [];
  for (const bucket of buckets) {
    const bucketDir = path.join(inboxRoot, bucket);
    if (!fs.existsSync(bucketDir)) continue;
    for (const entry of fs.readdirSync(bucketDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const rootPath = path.join(bucketDir, entry.name);
      const statusPath = path.join(rootPath, 'review-status.json');
      packages.push({
        bucket,
        packageId: entry.name,
        root: rel(rootPath),
        statusPath: fs.existsSync(statusPath) ? rel(statusPath) : null,
        status: readJsonSafe(statusPath)?.status || null,
        reports: walkFiles(path.join(rootPath, 'reports'), (file) => file.endsWith('.json')).map(rel),
      });
    }
  }
  return {
    schemaVersion: INBOX_SCHEMA_VERSION,
    generatedAt: GENERATED_AT,
    inboxRoot: rel(inboxRoot),
    summary: {
      packageCount: packages.length,
      buckets: Object.fromEntries(buckets.map((bucket) => [bucket, packages.filter((item) => item.bucket === bucket).length])),
    },
    packages,
  };
}

export function syncReportToReviewPackage(options = {}) {
  const statusPath = options.statusPath || DEFAULT_STATUS_PATH;
  const reportPath = options.reportPath;
  if (!reportPath || !fs.existsSync(reportPath)) throw new Error('[review-sync] --report is required and must exist');
  const status = loadOrCreateStatus(statusPath, options);
  const reportName = path.basename(reportPath);
  const reportsDir = path.join(path.dirname(statusPath), 'reports');
  const targetReport = path.join(reportsDir, reportName);
  ensureDir(reportsDir);
  fs.copyFileSync(reportPath, targetReport);
  return { status, copiedTo: targetReport };
}
