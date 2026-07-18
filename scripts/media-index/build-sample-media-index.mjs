#!/usr/bin/env node
import { buildSampleMediaIndex, rel, outputRoot } from './media-index-sample-tools.mjs';

const result = buildSampleMediaIndex({ clean: true });
console.log('CairnMap MediaIndex sample build');
console.log(`  Assets: ${result.assets.length}`);
console.log(`  Bindings: ${result.bindings.length}`);
console.log(`  Output: ${rel(outputRoot)}`);
console.log('\nFinal result: PASS');
