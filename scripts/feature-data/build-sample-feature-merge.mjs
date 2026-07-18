#!/usr/bin/env node
import path from 'node:path';
import { buildSampleMerge, outputRoot, rel } from './feature-data-sample-tools.mjs';

const result = buildSampleMerge({ clean: true });
console.log('CairnMap FeatureData Sample Merge Builder');
console.log(`  Records: ${result.records.length}`);
console.log(`  Output: ${rel(outputRoot)}`);
console.log(`  Merge index: ${rel(path.join(outputRoot, 'Data_Index', 'merge-index.json'))}`);
console.log('Final result: PASS');
