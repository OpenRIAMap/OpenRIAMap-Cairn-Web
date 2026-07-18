#!/usr/bin/env node
import process from 'node:process';
import {
  createInitialReviewStatus,
  parseCommonReviewArgs,
  rel,
  writeJson,
  validateReviewStatusObject,
} from './relay-review-status-tools.mjs';

try {
  const options = parseCommonReviewArgs();
  if (options.help) {
    console.log('Usage: npm run init:relay-review-status -- [--status-path <path>] [--package-root <NativeRelayPackage>] [--project-id openriamap-ria] [--world-id zth]');
    process.exit(0);
  }
  const status = createInitialReviewStatus(options);
  const validation = validateReviewStatusObject(status);
  if (options.write) writeJson(options.statusPath, status);
  console.log('CairnMap Relay Review Status Init');
  console.log(`  Status path: ${rel(options.statusPath)}`);
  console.log(`  Package root: ${rel(options.packageRoot)}`);
  console.log(`  Write mode: ${options.write ? 'ENABLED' : 'disabled'}`);
  console.log(`  Package/status: ${status.packageId}/${status.status}`);
  if (validation.errors.length) {
    console.error('\nErrors');
    for (const error of validation.errors) console.error(`  - ${error}`);
    console.error('\nFinal result: FAIL');
    process.exitCode = 1;
  } else {
    console.log('\nFinal result: PASS');
  }
} catch (error) {
  console.error('CairnMap Relay Review Status Init');
  console.error(`\nFatal error: ${error.message}`);
  process.exitCode = 1;
}
