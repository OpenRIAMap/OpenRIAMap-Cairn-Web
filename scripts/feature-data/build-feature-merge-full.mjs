#!/usr/bin/env node
import process from 'node:process';
import { executeFeatureMergeBuild, featureMergeBuildHelp, parseFeatureMergeBuildArgs, rel } from './feature-merge-build-tools.mjs';

try {
  const options = parseFeatureMergeBuildArgs();
  if (options.help) {
    console.log(featureMergeBuildHelp());
    process.exit(0);
  }
  const { outputs, options: effectiveOptions } = executeFeatureMergeBuild(options);
  const { report } = outputs;
  console.log('CairnMap FeatureData Full Merge Build');
  console.log(`  Split root: ${rel(effectiveOptions.splitRoot)}`);
  console.log(`  Merge output: ${rel(effectiveOptions.mergeRoot)}`);
  console.log(`  Index output: ${rel(effectiveOptions.indexRoot)}`);
  console.log(`  Build report: ${rel(`${effectiveOptions.outRoot}/build-report.json`)}`);
  console.log(`  Write mode: ${effectiveOptions.write ? 'ENABLED' : 'disabled (preview output only)'}`);
  console.log('\nSummary');
  console.log(`  Processed features: ${report.summary.processedFeatures}`);
  console.log(`  Classes/chunks: ${report.summary.classCount}/${report.summary.chunkCount}`);
  console.log(`  Skipped world dirs/files: ${report.summary.skippedWorldDirs}/${report.summary.skippedFiles}`);
  console.log(`  Warnings/errors: ${report.summary.warningCount}/${report.summary.errorCount}`);
  if (report.skippedWorldDirs.length > 0) {
    console.log('\nSkipped world directories');
    for (const item of report.skippedWorldDirs) console.log(`  - ${item.worldId}: ${item.fileCount} file(s)`);
  }
  if (report.warnings.length > 0) {
    console.log('\nWarnings');
    for (const warning of report.warnings.slice(0, 20)) console.log(`  - ${warning}`);
    if (report.warnings.length > 20) console.log(`  ... ${report.warnings.length - 20} more warning(s)`);
  }
  if (report.errors.length > 0) {
    console.error('\nErrors');
    for (const error of report.errors) console.error(`  - ${error}`);
    console.error('\nFinal result: FAIL');
    process.exitCode = 1;
  } else {
    console.log('\nFinal result: PASS');
  }
} catch (error) {
  console.error('CairnMap FeatureData Full Merge Build');
  console.error(`\nFatal error: ${error.message}`);
  process.exitCode = 1;
}
