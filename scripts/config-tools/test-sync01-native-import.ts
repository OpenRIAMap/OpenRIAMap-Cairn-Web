import assert from 'node:assert/strict';
import fs from 'node:fs';
import seed from '../../src/configStudio/defaults/r9-r5.config.json';
import {prepareConfigForActivation} from '../../src/configStudio/configActivation';
import {prepareNativeFeatureImport} from '../../src/configStudio/nativeFeatureImport';
import {prepareDownstreamNativeImport} from '../../src/components/Mapping/Workflow/downstreamNativeImport';
import {readMultipartGeometry} from '../../src/core/geometry/multipartGeometry';
import type {ConfigPackageV3} from '../../src/configStudio/types';
const config=prepareConfigForActivation(seed as ConfigPackageV3);
const {records}=JSON.parse(fs.readFileSync('scripts/config-tools/fixtures/sync01-published-record-compatibility.json','utf8'));
assert.equal(records.length,5);
for(const record of records){
 const original=structuredClone(record);
 assert.throws(()=>prepareNativeFeatureImport(config,record,'zth'),'fixture reproduces the strict import incompatibility');
 const imported=prepareDownstreamNativeImport(config,record,'zth',records);
 assert.deepEqual(readMultipartGeometry(imported.record,imported.geometry.type).geometry,imported.geometry);
 const headers=(item:Record<string,unknown>)=>Object.fromEntries(Object.entries(item).filter(([key])=>!['CoordP','CoordL','CoordG'].includes(key)));
 assert.deepEqual(headers(imported.record),headers(record),'complete attributes and unknown extensions preserved');
 assert.deepEqual(record,original,'published snapshot is immutable');
 assert.throws(()=>prepareDownstreamNativeImport(config,record,'zth',[]),'untrusted import stays strict');
 assert.throws(()=>prepareDownstreamNativeImport(config,{...record,Name:'changed'},'zth',records),'changed content stays strict');
 assert.throws(()=>prepareDownstreamNativeImport(config,{...record,ID:'new'},'zth',records),'new ID stays strict');
 assert.throws(()=>prepareDownstreamNativeImport(config,record,'eden',records),'world boundary stays strict');
}
console.log('sync01-native-import: five actual published incompatibilities, lossless attributes/geometry; untrusted/new/modified/cross-world records remain blocked: OK');
