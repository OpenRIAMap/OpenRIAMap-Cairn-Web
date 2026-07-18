#!/usr/bin/env node
import process from 'node:process';
import path from 'node:path';
import {
  createInitialReviewStatus,
  DEFAULT_WORK_ROOT,
  parseCommonReviewArgs,
  readJsonSafe,
  rel,
  syncReportToReviewPackage,
  writeJson,
} from './relay-review-status-tools.mjs';

try {
  const options = parseCommonReviewArgs();
  if (options.help) {
    console.log('Usage: npm run sync:relay-review-report -- --report <report.json> [--status-path <review-status.json>]');
    process.exit(0);
  }
  if (!readJsonSafe(options.statusPath)) writeJson(options.statusPath, createInitialReviewStatus(options));
  let reportPath = options.reportPath;
  if (!reportPath) {
    reportPath = path.join(DEFAULT_WORK_ROOT, 'sample-report.json');
    writeJson(reportPath, { schemaVersion: 'cairnmap.sample-report.v1', finalStatus: 'PASS', generatedAt: '1970-01-01T00:00:00.000Z' });
  }
  const result = syncReportToReviewPackage({ ...options, reportPath });
  console.log('CairnMap Relay Review Report Sync');
  console.log(`  Status path: ${rel(options.statusPath)}`);
  console.log(`  Report source: ${rel(reportPath)}`);
  console.log(`  Copied to: ${rel(result.copiedTo)}`);
  console.log('\nFinal result: PASS');
} catch (error) {
  console.error('CairnMap Relay Review Report Sync');
  console.error(`\nFatal error: ${error.message}`);
  process.exitCode = 1;
}
