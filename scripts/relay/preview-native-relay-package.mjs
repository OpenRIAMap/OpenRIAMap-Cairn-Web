#!/usr/bin/env node
import process from 'node:process';
import { parseArgs, previewReport, rel } from './native-relay-package-tools.mjs';
import { resolveNativeRelayInput } from './native-relay-input-resolver.mjs';

let args;
try { args = parseArgs(); }
catch (error) { console.error(error.message); process.exit(1); }
if (args.help) {
  console.log('Usage: npm run preview:native-relay-package -- [--package <NativeRelayPackageDirOrZip>]');
  process.exit(0);
}

const relayInput = await resolveNativeRelayInput(args.packageRoot, { clean: true });
args.packageRoot = relayInput.packageRoot;
const report = previewReport(args.packageRoot);
console.log('CairnMap Native RelayPackage Preview');
console.log(`  Package input: ${rel(relayInput.inputPath)}`);
console.log(`  Package root: ${rel(args.packageRoot)}`);
if (relayInput.inputType === 'zip') console.log(`  Zip root prefix: ${relayInput.rootPrefix || '(none)'}`);
console.log(`  Operator: ${report.operator ?? '(missing)'}`);
console.log(`  Version: ${report.version ?? '(missing)'}`);
console.log(`  Features: ${report.featureCount}`);
console.log(`  Pictures: ${report.pictureCount}`);
console.log(`  Deletes: ${report.deleteCount}`);
console.log('\nClasses');
for (const [classCode, count] of Object.entries(report.classes)) console.log(`  - ${classCode}: ${count}`);
console.log('\nWorlds');
for (const [worldId, count] of Object.entries(report.worlds)) console.log(`  - ${worldId}: ${count}`);
console.log('\nRepresentative feature refs');
for (const feature of report.featureRefs.slice(0, 10)) {
  console.log(`  - ${feature.worldId}/${feature.classCode}/${feature.featureId} :: ${feature.name ?? '(unnamed)'}`);
}
if (report.featureRefs.length > 10) console.log(`  ... ${report.featureRefs.length - 10} more feature(s)`);
console.log('\nFinal result: PASS');
