#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import JSZip from 'jszip';
import { defaultSampleRoot, packagePaths, rel, walkFiles } from './native-relay-package-tools.mjs';
import { resolveNativeRelayInput } from './native-relay-input-resolver.mjs';
import { createNativeRelayConfigContext, resolveNativeFeatureFile, resolveNativePictureFile, readFeatureJsonForResolver } from './native-relay-config-resolver.mjs';

const root = process.cwd();
const tmpRoot = path.join(root, '.cairnmap-tmp', 'native-relay-config-resolver');
const errors = [];
const warnings = [];

function addError(message) { errors.push(message); }
function addWarning(message) { warnings.push(message); }

async function makeZipFromSample(zipPath) {
  const zip = new JSZip();
  const files = walkFiles(defaultSampleRoot);
  for (const filePath of files) {
    const relative = path.relative(defaultSampleRoot, filePath).replaceAll(path.sep, '/');
    zip.file(`wrapped-relay/${relative}`, fs.readFileSync(filePath));
  }
  fs.mkdirSync(path.dirname(zipPath), { recursive: true });
  fs.writeFileSync(zipPath, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
}

if (!fs.existsSync(defaultSampleRoot)) addError(`[missing] sample package root is missing: ${rel(defaultSampleRoot)}`);

let dirInput = null;
let zipInput = null;
try {
  dirInput = await resolveNativeRelayInput(defaultSampleRoot, { clean: true });
} catch (error) {
  addError(`[directory-input] ${error.message}`);
}

const sampleZipPath = path.join(tmpRoot, 'wrapped-native-relay-sample.zip');
try {
  if (fs.existsSync(tmpRoot)) fs.rmSync(tmpRoot, { recursive: true, force: true });
  await makeZipFromSample(sampleZipPath);
  zipInput = await resolveNativeRelayInput(sampleZipPath, { clean: true });
  if (zipInput.rootPrefix !== 'wrapped-relay/') addWarning(`[zip-input] expected wrapped-relay/ rootPrefix, got ${zipInput.rootPrefix || '(none)'}`);
} catch (error) {
  addError(`[zip-input] ${error.message}`);
}

const packageRoot = zipInput?.packageRoot ?? dirInput?.packageRoot ?? defaultSampleRoot;
const context = createNativeRelayConfigContext('openriamap-ria');
const paths = packagePaths(packageRoot);
const featureFiles = fs.existsSync(paths.splitRoot)
  ? walkFiles(paths.splitRoot, (filePath) => path.extname(filePath).toLowerCase() === '.json')
  : [];
const pictureFiles = fs.existsSync(paths.pictureRoot)
  ? walkFiles(paths.pictureRoot, (filePath) => ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.avif'].includes(path.extname(filePath).toLowerCase()))
  : [];

if (featureFiles.length === 0) addError('[resolver] no sample feature files were found');
for (const featureFile of featureFiles) {
  const data = readFeatureJsonForResolver(featureFile, { warnings, errors });
  if (!data) continue;
  const resolved = resolveNativeFeatureFile(packageRoot, featureFile, data, context, { warnings, errors });
  if (!resolved.ref) addError(`[resolver] failed to resolve feature: ${rel(featureFile)}`);
}

for (const pictureFile of pictureFiles) {
  const resolved = resolveNativePictureFile(packageRoot, pictureFile, context, { warnings, errors });
  if (!resolved.ref) addError(`[resolver] failed to resolve picture: ${rel(pictureFile)}`);
}

console.log('CairnMap Native Relay Config Resolver Validation');
console.log(`  Directory input: ${dirInput ? rel(dirInput.packageRoot) : '(failed)'}`);
console.log(`  Zip input: ${zipInput ? rel(zipInput.inputPath) : '(failed)'}`);
console.log(`  Zip package root: ${zipInput ? rel(zipInput.packageRoot) : '(failed)'}`);
console.log(`  Features resolved: ${featureFiles.length}`);
console.log(`  Pictures resolved: ${pictureFiles.length}`);
if (warnings.length > 0) {
  console.log('\nWarnings');
  for (const warning of warnings) console.log(`  - ${warning}`);
}
if (errors.length > 0) {
  console.error('\nErrors');
  for (const error of errors) console.error(`  - ${error}`);
  console.error('\nFinal result: FAIL');
  process.exitCode = 1;
} else {
  console.log('\nFinal result: PASS');
}
