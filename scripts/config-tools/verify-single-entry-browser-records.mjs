import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {gunzipSync} from 'node:zlib';
import {validateIncomingRecord,validateIncomingBatch,validateRecordGeometry} from '../../vendor/configuration-r11/r11-validation.mjs';

const out=path.resolve(process.env.CAIRNMAP_ACCEPTANCE_OUT??process.argv[2]??'scripts/config-tools/browser/artifacts');
const read=name=>JSON.parse(fs.readFileSync(path.join(out,name),'utf8'));
const config=name=>JSON.parse(gunzipSync(fs.readFileSync(path.join(out,`single-entry-${name}-config.json.gz`))).toString('utf8'));
const result=read('single-entry-drawing-result.json');assert.equal(result.runtimeErrors.length,0);assert.deepEqual(result.remoteOrWriteRequests,[]);
const cases=[['polygon','single-entry-polygon-record.json'],['Point','single-entry-Point-record.json'],['LineString','single-entry-LineString-record.json'],['multi-output','single-entry-multi-output-records.json'],['multi-output','single-entry-disabled-output-record.json'],['heights','single-entry-SEHEIGHTZERO-record.json'],['heights','single-entry-SEHEIGHTMANUAL-record.json']];
const checked=[];
for(const [fixture,file] of cases){
  const c=config(fixture),value=read(file),records=Array.isArray(value)?value:[value];
  for(const record of records)assert.deepEqual(validateIncomingRecord(c,record,'zth'),[],file);
  validateIncomingBatch(c,records,[]);
  checked.push({file,records:records.length,contract:c.contractRevision,revision:c.revision});
}
const point=config('Point'),pointRecord=read('single-entry-Point-record.json');
for(const node of point.nodes)if(node.geometryProfiles?.Point)node.geometryProfiles.Point.allowMultipleParts=false;
assert.ok(validateRecordGeometry(point,pointRecord).length,'Same multipart record must be rejected when the configured policy forbids it.');
const polygon=config('polygon'),invalid=read('single-entry-polygon-record.json');
invalid.CoordG[0][1]=[[9999,64,9999],[10009,64,9999],[10009,64,10009]];
assert.ok(validateIncomingRecord(polygon,invalid,'zth').length,'Invalid holes must still fail the deployed pure Node validator.');
const verification={checked,negativeCases:['forbidden multipart','outside hole'],kernel:'existing c17 pure Node entry',browserOnlyLocal:true};
fs.writeFileSync(path.join(out,'single-entry-browser-record-kernel-result.json'),JSON.stringify(verification,null,2)+'\n');
console.log(JSON.stringify(verification));
