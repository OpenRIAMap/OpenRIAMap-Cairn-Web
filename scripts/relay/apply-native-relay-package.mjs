#!/usr/bin/env node
import process from 'node:process';
import { applyHelp, buildComparison, parseApplyArgs, rel } from './native-relay-apply-tools.mjs';
import { runProtectedApply } from './native-relay-write-tools.mjs';

let args;
try { args = parseApplyArgs(); }
catch (error) { console.error(error.message); process.exit(1); }
if (args.help) {
  console.log(applyHelp());
  process.exit(0);
}

const context = await buildComparison(args, 'dry-run-apply');
let result;
try {
  result = await runProtectedApply(context);
} catch (error) {
  const applyReport = {
    schemaVersion: 'cairnmap.native-relay-apply-report.v1',
    generatedAt: context.report.generatedAt,
    mode: args.write ? 'write' : 'dry-run',
    finalStatus: 'FAIL',
    projectId: args.projectId,
    inputs: {
      ...context.report.inputs,
      mediaIndexRoot: args.mediaIndexRoot,
      writeEnabled: Boolean(args.write),
    },
    dryRunSummary: context.report.summary,
    writes: {
      featureWrites: [],
      deleteWrites: [],
      pictureWrites: [],
      mediaAssetWrites: [],
      mediaBindingWrites: [],
      backupManifest: [],
    },
    warnings: [...context.report.warnings],
    errors: [...context.report.errors, error.message],
  };
  const { writeApplyOutputs } = await import('./native-relay-write-tools.mjs');
  const { applyReportPath } = writeApplyOutputs(context, applyReport);
  console.error('CairnMap Native RelayPackage Apply');
  console.error(`  Report: ${rel(applyReportPath)}`);
  console.error(`  Error: ${error.message}`);
  console.error('\nFinal result: FAIL');
  process.exit(1);
}

const { applyReport, applyReportPath, wroteTargets } = result;

console.log('CairnMap Native RelayPackage Apply');
console.log(`  RelayPackage: ${context.report.inputs.relayRoot}`);
console.log(`  FeatureData target: ${context.report.inputs.featureDataRoot}`);
console.log(`  Picture target: ${context.report.inputs.pictureRoot}`);
console.log(`  MediaIndex target: ${args.mediaIndexRoot}`);
console.log(`  Output root: ${context.report.inputs.outRoot}`);
console.log(`  Apply report: ${rel(applyReportPath)}`);
console.log(`  Write mode: ${args.write ? 'ENABLED' : 'disabled'}`);
if (!wroteTargets) console.log('  Target write: skipped; rerun with --write to apply changes.');

console.log('\nDry-run summary');
console.log(`  Feature create/update/unchanged/delete: ${context.report.summary.featuresToCreate}/${context.report.summary.featuresToUpdate}/${context.report.summary.featuresUnchanged}/${context.report.summary.featuresToDelete}`);
console.log(`  Pictures to copy/unchanged: ${context.report.summary.picturesToCopy}/${context.report.summary.picturesUnchanged}`);
console.log(`  Media assets/bindings planned: ${context.report.summary.mediaAssetsPlanned}/${context.report.summary.mediaBindingsPlanned}`);

if (wroteTargets) {
  console.log('\nWrite summary');
  console.log(`  Feature write records: ${applyReport.writes.featureWrites.length}`);
  console.log(`  Delete write records: ${applyReport.writes.deleteWrites.length}`);
  console.log(`  Picture write records: ${applyReport.writes.pictureWrites.length}`);
  console.log(`  Media asset writes: ${applyReport.writes.mediaAssetWrites.length}`);
  console.log(`  Media binding writes: ${applyReport.writes.mediaBindingWrites.length}`);
  console.log(`  Backup records: ${applyReport.writes.backupManifest.length}`);
}

if (applyReport.warnings.length > 0) {
  console.log('\nWarnings');
  for (const warning of applyReport.warnings) console.log(`  - ${warning}`);
}
if (applyReport.errors.length > 0) {
  console.error('\nErrors');
  for (const error of applyReport.errors) console.error(`  - ${error}`);
  console.error('\nFinal result: FAIL');
  process.exitCode = 1;
} else {
  console.log(`\nFinal result: ${applyReport.finalStatus}`);
}
