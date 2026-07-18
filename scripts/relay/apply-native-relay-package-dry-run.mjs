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

const context = await buildComparison(args, 'dry-run-apply');
const { reportPath } = writeDryRunOutputs(context);
const report = context.report;

console.log('CairnMap Native RelayPackage Dry-run Apply');
console.log(`  RelayPackage: ${report.inputs.relayRoot}`);
console.log(`  FeatureData baseline: ${report.inputs.featureDataRoot}`);
console.log(`  Picture baseline: ${report.inputs.pictureRoot}`);
console.log(`  Output root: ${report.inputs.outRoot}`);
console.log(`  Report: ${rel(reportPath)}`);
console.log('\nPreview outputs');
console.log('  Data_Spilt_preview/');
console.log('  Data_Spilt_delete_preview/');
console.log('  Picture_preview/');
console.log('  Media_Index_Spilt_preview/');
console.log('  Media_Index_Merge_preview/');
console.log('\nSummary');
console.log(`  Feature create/update/unchanged/delete: ${report.summary.featuresToCreate}/${report.summary.featuresToUpdate}/${report.summary.featuresUnchanged}/${report.summary.featuresToDelete}`);
console.log(`  Pictures to copy/unchanged: ${report.summary.picturesToCopy}/${report.summary.picturesUnchanged}`);
console.log(`  Media assets/bindings planned: ${report.summary.mediaAssetsPlanned}/${report.summary.mediaBindingsPlanned}`);
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
