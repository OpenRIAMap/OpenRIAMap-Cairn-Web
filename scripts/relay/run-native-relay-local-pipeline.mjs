#!/usr/bin/env node
import process from 'node:process';
import {
  executeNativeRelayLocalPipeline,
  nativeRelayPipelineHelp,
  parseNativeRelayPipelineArgs,
  rel,
} from './native-relay-pipeline-tools.mjs';

try {
  const options = parseNativeRelayPipelineArgs();
  if (options.help) {
    console.log(nativeRelayPipelineHelp());
    process.exit(0);
  }
  const { report, paths } = executeNativeRelayLocalPipeline(options);
  console.log('CairnMap Native Relay Local Pipeline');
  console.log(`  RelayPackage: ${rel(options.relay)}`);
  console.log(`  Data root: ${rel(options.dataRoot)}`);
  console.log(`  Output root: ${rel(options.outRoot)}`);
  console.log(`  Pipeline report: ${rel(paths.pipelineReport)}`);
  console.log(`  Write mode: ${options.write ? 'ENABLED' : 'disabled (preview output only)'}`);

  console.log('\nSteps');
  for (const step of report.steps) {
    console.log(`  ${step.status === 'PASS' ? 'PASS' : 'FAIL'}  ${step.id} - ${step.label}`);
  }

  console.log('\nSummary');
  console.log(`  Steps passed/failed: ${report.summary.passedSteps}/${report.summary.failedSteps}`);
  console.log(`  Apply features create/update/unchanged/delete: ${report.summary.apply.featuresToCreate ?? 0}/${report.summary.apply.featuresToUpdate ?? 0}/${report.summary.apply.featuresUnchanged ?? 0}/${report.summary.apply.featuresToDelete ?? 0}`);
  console.log(`  Feature merge processed/chunks: ${report.summary.featureMerge.processedFeatures ?? 0}/${report.summary.featureMerge.chunkCount ?? 0}`);
  console.log(`  Media assets/bindings/worlds: ${report.summary.mediaIndex.scannedAssets ?? 0}/${report.summary.mediaIndex.scannedBindings ?? 0}/${report.summary.mediaIndex.processedWorlds ?? 0}`);

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
  console.error('CairnMap Native Relay Local Pipeline');
  console.error(`\nFatal error: ${error.message}`);
  process.exitCode = 1;
}
