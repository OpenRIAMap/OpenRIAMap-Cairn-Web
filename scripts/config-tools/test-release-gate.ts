/** Reuse the frozen audit's mutations, but turn every release expectation into
 * a failing assertion. Never write to the original audit evidence directory. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const output=path.resolve(process.env.CAIRNMAP_RELEASE_AUDIT_OUT??'migration-runs/release-repair-20261017/repaired-audit');
if(output.includes('runtime-v32-release-audit-20261016'))throw Error('Refusing to overwrite frozen audit evidence');
process.env.CAIRNMAP_RELEASE_AUDIT_OUT=output;
await import('./audit-release-readiness');
const rows=JSON.parse(fs.readFileSync(path.join(output,'mutation-scenarios.json'),'utf8'));
const summary=JSON.parse(fs.readFileSync(path.join(output,'audit-summary.json'),'utf8'));
assert.equal(rows.length,71);assert.equal(rows.filter((row:any)=>row.expected==='error').length,67);
for(const row of rows){assert.ok(row.matchesExpectation,`${row.id} expectation mismatch`);assert.equal(row.exception,undefined,row.id);if(row.expected==='error'){assert.equal(row.package.valid,false,`${row.id} package`);assert.equal(row.module.valid,false,`${row.id} module`);assert.equal(row.exportBlocked,true,`${row.id} export`);assert.equal(row.activationBlocked,true,`${row.id} activation`);}else {assert.equal(row.package.valid,true,row.id);assert.equal(row.activationBlocked,false,row.id);}}
assert.deepEqual(summary.gaps,[]);
assert.equal(summary.configSha256,'982e1c0b6dc004dd90ee1ff92cd502dfb0f77a9ef4c53bb5a707a2c188460d7e');
assert.ok(summary.integrity.every((row:any)=>row.rejected));
assert.ok(summary.compatibility.every((row:any)=>row.readValid&&row.migratedValid&&row.sourceUnchanged&&row.roundtripEqual));
assert.ok(summary.scale.every((row:any)=>row.valid&&row.roundtripNodes===row.nodes));
const mounted=summary.mountedAudit;
assert.equal(mounted.find((row:any)=>row.mode==='present-nested-required').mountedIssues.length,0);
assert.equal(mounted.find((row:any)=>row.mode==='nested-condition-missing-required').mountedIssues.length,1);
assert.equal(mounted.find((row:any)=>row.mode==='existing-value-wrong-type').mountedIssues.length,0,'opt-in required checks must not silently become a full data-type audit');
console.log('RELEASE GATE PASS: 71/71 expectations, 67 errors blocked at all four boundaries, all historical full packages and 495-node scale retained');
