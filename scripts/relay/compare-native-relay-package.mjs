#!/usr/bin/env node
import process from 'node:process';
import { applyHelp, buildComparison, parseApplyArgs, rel, writeDryRunOutputs } from './native-relay-apply-tools.mjs';

let args;
try { args = parseApplyArgs(); }
catch (error) { console.error(error.message); process.exit(1); }
if (args.help) {
  console.log(applyHelp());
  process.exit(0);
}

const context = await buildComparison(args, 'compare');
const { reportPath } = writeDryRunOutputs(context, { writePreview: false });
const report = context.report;

console.log('CairnMap Native RelayPackage Compare');
console.log(`  RelayPackage: ${report.inputs.relayRoot}`);
console.log(`  FeatureData baseline: ${report.inputs.featureDataRoot}`);
console.log(`  Picture baseline: ${report.inputs.pictureRoot}`);
console.log(`  Output report: ${rel(reportPath)}`);
console.log(`  Baseline layout: ${report.baseline.featureDataLayout}`);
console.log('\nFeature changes');
console.log(`  Create: ${report.summary.featuresToCreate}`);
console.log(`  Update: ${report.summary.featuresToUpdate}`);
console.log(`  Unchanged: ${report.summary.featuresUnchanged}`);
console.log(`  Delete: ${report.summary.featuresToDelete}`);
console.log(`  Delete missing target: ${report.summary.deleteTargetsMissing}`);
console.log('\nPicture and MediaIndex plan');
console.log(`  Pictures to copy: ${report.summary.picturesToCopy}`);
console.log(`  Pictures unchanged: ${report.summary.picturesUnchanged}`);
console.log(`  Media assets planned: ${report.summary.mediaAssetsPlanned}`);
console.log(`  Media bindings planned: ${report.summary.mediaBindingsPlanned}`);
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
  console.log('\nFinal result: PASS');
}
