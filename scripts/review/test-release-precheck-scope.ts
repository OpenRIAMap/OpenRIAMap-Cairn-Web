import assert from 'node:assert/strict';
import {releasePrecheckScopeKey,releasePrecheckCanPublish} from '../../src/components/Review/releasePrecheckScope';
import type {ReviewReleaseControlReport,ReviewReleaseGateSnapshot} from '../../src/components/Review/contracts';

const a={submissionId:'a',decisionRevisionId:'r1'},b={submissionId:'b',decisionRevisionId:'r2'};
const key=releasePrecheckScopeKey([a,b],7,'reviewer');
assert.equal(key,releasePrecheckScopeKey([b,a],7,'reviewer'),'List order must not invalidate an unchanged selection');
for(const other of [
  releasePrecheckScopeKey([a],7,'reviewer'),
  releasePrecheckScopeKey([a,{...b,decisionRevisionId:'r3'}],7,'reviewer'),
  releasePrecheckScopeKey([a,b],8,'reviewer'),
  releasePrecheckScopeKey([a,b],7,'another-reviewer'),
])assert.notEqual(key,other,'Package, revision, board and actor changes must invalidate permission');
const gate:ReviewReleaseGateSnapshot={state:'awaiting-confirmation',attemptId:'attempt',gateVersion:2,leaseExpiresAt:'2026-11-27T12:00:00Z'};
const report:ReviewReleaseControlReport={decision:'ready',gate,report:{reportSha256:'a'.repeat(64)}};
const input={dirty:false,currentKey:key,reportKey:key,report,gate,now:Date.parse('2026-11-27T11:00:00Z')};
assert.equal(releasePrecheckCanPublish(input),true);
assert.equal(releasePrecheckCanPublish({...input,currentKey:releasePrecheckScopeKey([a],7,'reviewer')}),false,'A retained report cannot publish newly selected scope');
assert.equal(releasePrecheckCanPublish({...input,dirty:true}),false);
assert.equal(releasePrecheckCanPublish({...input,gate:{...gate,attemptId:'another'}}),false);
assert.equal(releasePrecheckCanPublish({...input,gate:{...gate,gateVersion:3}}),false);
assert.equal(releasePrecheckCanPublish({...input,gate:{...gate,state:'running'}}),false);
assert.equal(releasePrecheckCanPublish({...input,now:Date.parse(gate.leaseExpiresAt!)}),false);
assert.equal(releasePrecheckCanPublish({...input,report:{...report,decision:'pending'}}),false);
assert.equal(releasePrecheckCanPublish({...input,report:{...report,decision:'blocked'}}),false);
assert.equal(releasePrecheckCanPublish({...input,report:{...report,decision:'warning-confirmation-required'}}),false,'Malformed warning protocols remain blocked');
console.log('release precheck: stable scopes and current scope/revision/actor/gate/dirty/protocol guards passed');
