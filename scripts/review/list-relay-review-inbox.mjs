#!/usr/bin/env node
import process from 'node:process';
import { listInbox, parseCommonReviewArgs, rel, writeJson, DEFAULT_WORK_ROOT } from './relay-review-status-tools.mjs';
import path from 'node:path';

try {
  const options = parseCommonReviewArgs();
  if (options.help) {
    console.log('Usage: npm run list:relay-review-inbox -- [--inbox-root <RelayPackagesRoot>]');
    process.exit(0);
  }
  const report = listInbox(options.inboxRoot);
  const out = path.join(DEFAULT_WORK_ROOT, 'relay-review-inbox-list.json');
  writeJson(out, report);
  console.log('CairnMap Relay Review Inbox List');
  console.log(`  Inbox root: ${rel(options.inboxRoot)}`);
  console.log(`  Output: ${rel(out)}`);
  console.log(`  Package count: ${report.summary.packageCount}`);
  console.log('\nFinal result: PASS');
} catch (error) {
  console.error('CairnMap Relay Review Inbox List');
  console.error(`\nFatal error: ${error.message}`);
  process.exitCode = 1;
}
