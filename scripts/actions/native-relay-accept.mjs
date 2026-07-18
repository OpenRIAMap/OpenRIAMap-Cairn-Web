#!/usr/bin/env node
import process from 'node:process';
import {
  executeNativeRelayAccept,
  nativeRelayAcceptHelp,
  parseNativeRelayAcceptArgs,
} from './native-relay-accept-tools.mjs';
import { rel } from '../relay/native-relay-package-tools.mjs';
import {
  applyAcceptReportToStatus,
  loadOrCreateStatus,
  writeJson,
} from '../review/relay-review-status-tools.mjs';

try {
  const options = parseNativeRelayAcceptArgs();
  if (options.help) {
    console.log(nativeRelayAcceptHelp());
    process.exit(0);
  }
  const { report, paths } = executeNativeRelayAccept(options);
  let reviewStatusUpdate = null;
  if (options.updateReviewStatus) {
    if (!options.reviewStatusPath) throw new Error('--update-review-status requires --review-status-path');
    const current = loadOrCreateStatus(options.reviewStatusPath, {
      packageRoot: options.reviewPackageRoot || options.relay,
      projectId: options.projectId,
    });
    const next = applyAcceptReportToStatus(current, {
      report,
      reportPath: paths.acceptReport,
      runId: options.precheckRunId,
    });
    writeJson(options.reviewStatusPath, next);
    reviewStatusUpdate = { from: current.status, to: next.status, statusPath: options.reviewStatusPath };
  }

  console.log('CairnMap Native RelayPackage Accept Action');
  console.log(`  RelayPackage: ${rel(options.relay)}`);
  console.log(`  Data root: ${rel(options.dataRoot)}`);
  console.log(`  Output root: ${rel(options.outRoot)}`);
  console.log(`  Accept report: ${rel(paths.acceptReport)}`);
  console.log(`  Write mode: ${options.write ? 'ENABLED' : 'disabled'}`);
  console.log(`  Commit changes: ${options.commitChanges ? 'ENABLED' : 'disabled'}`);
  console.log(`  Push changes: ${options.pushChanges ? 'ENABLED' : 'disabled'}`);

  console.log('\nSteps');
  for (const step of report.steps) {
    console.log(`  ${step.status === 'PASS' ? 'PASS' : 'FAIL'}  ${step.id} - ${step.label}`);
  }

  console.log('\nSummary');
  console.log(`  Steps passed/failed: ${report.summary.passedSteps}/${report.summary.failedSteps}`);
  console.log(`  Pipeline status: ${report.summary.pipelineFinalStatus ?? '(not run)'}`);
  console.log(`  Apply features create/update/unchanged/delete: ${report.summary.apply.featuresToCreate ?? 0}/${report.summary.apply.featuresToUpdate ?? 0}/${report.summary.apply.featuresUnchanged ?? 0}/${report.summary.apply.featuresToDelete ?? 0}`);
  console.log(`  Feature merge processed/chunks: ${report.summary.featureMerge.processedFeatures ?? 0}/${report.summary.featureMerge.chunkCount ?? 0}`);
  console.log(`  Media assets/bindings/worlds: ${report.summary.mediaIndex.scannedAssets ?? 0}/${report.summary.mediaIndex.scannedBindings ?? 0}/${report.summary.mediaIndex.processedWorlds ?? 0}`);
  console.log(`  Git changes/commit/push: ${report.summary.git.hasChanges ? 'yes' : 'no'}/${report.summary.git.committed ? 'yes' : 'no'}/${report.summary.git.pushed ? 'yes' : 'no'}`);
  console.log(`  Guards status/warnings/errors: ${report.summary.guards?.finalStatus ?? '(not run)'}/${report.summary.guards?.warningCount ?? 0}/${report.summary.guards?.errorCount ?? 0}`);

  if (reviewStatusUpdate) {
    console.log(`  Review status: ${rel(reviewStatusUpdate.statusPath)} ${reviewStatusUpdate.from} -> ${reviewStatusUpdate.to}`);
  }

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
    console.log(`\nFinal result: ${report.finalStatus}`);
  }
} catch (error) {
  console.error('CairnMap Native RelayPackage Accept Action');
  console.error(`\nFatal error: ${error.message}`);
  process.exitCode = 1;
}
