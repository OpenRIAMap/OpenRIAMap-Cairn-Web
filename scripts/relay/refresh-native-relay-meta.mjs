#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  collectPackageStats,
  outputRoot,
  packagePaths,
  parseArgs,
  refreshedIndex,
  rel,
  writeJson,
} from './native-relay-package-tools.mjs';
import { resolveNativeRelayInput } from './native-relay-input-resolver.mjs';

let args;
try { args = parseArgs(); }
catch (error) { console.error(error.message); process.exit(1); }
if (args.help) {
  console.log('Usage: npm run refresh:native-relay-meta -- [--package <NativeRelayPackageDirOrZip>] [--write]');
  process.exit(0);
}

const relayInput = await resolveNativeRelayInput(args.packageRoot, { clean: true });
if (args.write && relayInput.inputType === 'zip') {
  console.error('Refusing --write for .zip RelayPackage input. Extract the package first if metadata should be updated in place.');
  process.exit(1);
}
args.packageRoot = relayInput.packageRoot;
const stats = collectPackageStats(args.packageRoot);
const refreshed = refreshedIndex(stats.index, stats);
if (args.write) {
  writeJson(packagePaths(args.packageRoot).indexPath, refreshed);
  console.log('CairnMap Native RelayPackage Metadata Refresh');
  console.log(`  Updated: ${rel(packagePaths(args.packageRoot).indexPath)}`);
} else {
  if (fs.existsSync(outputRoot)) fs.rmSync(outputRoot, { recursive: true, force: true });
  const outPath = path.join(outputRoot, 'INDEX.refreshed.json');
  writeJson(outPath, refreshed);
  writeJson(path.join(outputRoot, 'preview-report.json'), {
    schemaVersion: 'cairnmap.native-relay-refresh-report.v1',
    packageRoot: rel(args.packageRoot),
    featureCount: stats.featureCount,
    pictureCount: stats.pictureCount,
    deleteCount: stats.deleteCount,
    outputIndex: rel(outPath),
  });
  console.log('CairnMap Native RelayPackage Metadata Refresh');
  console.log(`  Package input: ${rel(relayInput.inputPath)}`);
  console.log(`  Package root: ${rel(args.packageRoot)}`);
  console.log(`  Output: ${rel(outPath)}`);
}
console.log(`  Features: ${stats.featureCount}`);
console.log(`  Pictures: ${stats.pictureCount}`);
console.log(`  Deletes: ${stats.deleteCount}`);
console.log('Final result: PASS');
