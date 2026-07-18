#!/usr/bin/env node
import process from 'node:process';
import {
  applyAcceptReportToStatus,
  applyPrecheckReportToStatus,
  createInitialReviewStatus,
  loadOrCreateStatus,
  manualReviewDecision,
  parseCommonReviewArgs,
  readJsonSafe,
  rel,
  transitionReviewStatus,
  validateReviewStatusObject,
  writeJson,
} from './relay-review-status-tools.mjs';

try {
  const options = parseCommonReviewArgs();
  if (options.help) {
    console.log('Usage: npm run update:relay-review-status -- [--status-path <path>] [--status prechecked|accepted|rejected|...] [--report <report.json>] [--stage precheck|accept] [--decision reject|request_changes|archive]');
    process.exit(0);
  }
  if (!readJsonSafe(options.statusPath)) writeJson(options.statusPath, createInitialReviewStatus(options));
  const current = loadOrCreateStatus(options.statusPath, options);
  let next;
  if (options.decision) {
    next = manualReviewDecision(current, options);
  } else if (options.reportPath && (options.stage === 'precheck' || /precheck/i.test(options.reportPath))) {
    next = applyPrecheckReportToStatus(current, options);
  } else if (options.reportPath && (options.stage === 'accept' || /accept/i.test(options.reportPath))) {
    next = applyAcceptReportToStatus(current, options);
  } else if (options.status) {
    next = transitionReviewStatus(current, { status: options.status, stage: options.stage, reason: options.reason, runId: options.runId });
  } else {
    next = transitionReviewStatus(current, { status: 'prechecked', stage: 'precheck', reason: 'default smoke-test transition', allowSameStatus: false });
  }
  const validation = validateReviewStatusObject(next);
  if (validation.finalStatus === 'PASS' && options.write) writeJson(options.statusPath, next);
  console.log('CairnMap Relay Review Status Update');
  console.log(`  Status path: ${rel(options.statusPath)}`);
  console.log(`  Transition: ${current.status} -> ${next.status}`);
  console.log(`  Write mode: ${options.write ? 'ENABLED' : 'disabled'}`);
  if (validation.errors.length) {
    console.error('\nErrors');
    for (const error of validation.errors) console.error(`  - ${error}`);
    console.error('\nFinal result: FAIL');
    process.exitCode = 1;
  } else {
    console.log('\nFinal result: PASS');
  }
} catch (error) {
  console.error('CairnMap Relay Review Status Update');
  console.error(`\nFatal error: ${error.message}`);
  process.exitCode = 1;
}
