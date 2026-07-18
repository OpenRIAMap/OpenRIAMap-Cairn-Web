#!/usr/bin/env node
import process from 'node:process';
import {
  createInitialReviewStatus,
  parseCommonReviewArgs,
  readJsonSafe,
  rel,
  validateReviewStatusObject,
  writeJson,
} from './relay-review-status-tools.mjs';

try {
  const options = parseCommonReviewArgs();
  if (options.help) {
    console.log('Usage: npm run validate:relay-review-status -- [--status-path <path>]');
    process.exit(0);
  }
  if (!readJsonSafe(options.statusPath)) writeJson(options.statusPath, createInitialReviewStatus(options));
  const status = readJsonSafe(options.statusPath);
  const validation = validateReviewStatusObject(status);
  console.log('CairnMap Relay Review Status Validation');
  console.log(`  Status path: ${rel(options.statusPath)}`);
  console.log(`  Package/status: ${status?.packageId ?? '(missing)'}/${status?.status ?? '(missing)'}`);
  console.log(`  Warnings/errors: ${validation.warnings.length}/${validation.errors.length}`);
  if (validation.warnings.length) {
    console.log('\nWarnings');
    for (const warning of validation.warnings) console.log(`  - ${warning}`);
  }
  if (validation.errors.length) {
    console.error('\nErrors');
    for (const error of validation.errors) console.error(`  - ${error}`);
    console.error('\nFinal result: FAIL');
    process.exitCode = 1;
  } else {
    console.log('\nFinal result: PASS');
  }
} catch (error) {
  console.error('CairnMap Relay Review Status Validation');
  console.error(`\nFatal error: ${error.message}`);
  process.exitCode = 1;
}
