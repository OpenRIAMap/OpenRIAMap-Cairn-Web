import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import type {ConfigPackageV3} from '../../src/configStudio/types';
import {assertStructureTargets} from '../../src/configStudio/structureCommit';
import {effectiveMappingRecords,assertExportStructureTargets,mappingRecordWorld} from '../../src/components/Mapping/Workflow/effectiveMappingRecords';

const config = JSON.parse(gunzipSync(fs.readFileSync('scripts/config-tools/fixtures/c22-refinement-candidate.config.json.gz')).toString('utf8')) as ConfigPackageV3;
const host = {ID:'ZBUD_aunst_island_shrine',World:0,Class:'BUD',Kind:'NOM',Name:'金岛神社'};
const updated = {...host,World:'zth',Kind:'LAR',SKind:'CUL'};
const member = {ID:'ZBUD_aunst_island_shrine_emakake',World:'Z',Class:'BUD',Kind:'SUB',SKind:'BUM',SKind2:'AUX',BuildingID:host.ID,NofFloor:'G'};
const floor = {...member,ID:'FLOOR',Class:'FLR',Kind:'NOM',SKind:'RES',SKind2:undefined};
const deletion = {ID:host.ID,worldId:'zth',classCode:'BUD'};
let checks = 0;
const check = (name:string,run:()=>void) => {run();checks++;console.log('PASS '+name);};

check('formal host reclassification replaces the old version across numeric, prefix and stable worlds',()=>{
  assert.equal(mappingRecordWorld(config,0),'zth');
  assert.equal(mappingRecordWorld(config,'Z'),'zth');
  assert.equal(mappingRecordWorld(config,''),'');
  const before = JSON.stringify([host,updated]);
  const records = effectiveMappingRecords(config,[{featureInfo:host}],[updated]);
  assert.deepEqual(records,[updated]);
  assert.throws(()=>assertStructureTargets(config,[member],[host,updated]),/不唯一/);
  assertStructureTargets(config,[member],records);
  assertStructureTargets(config,[floor],records);
  assert.equal(JSON.stringify([host,updated]),before,'Search/validation must not mutate either source');
});
check('same-world same-Class subtype edits replace, but removal falls back to formal',()=>{
  assert.deepEqual(effectiveMappingRecords(config,[host],[updated]),[updated]);
  assert.deepEqual(effectiveMappingRecords(config,[host],[]),[host]);
  assertExportStructureTargets(config,[member],[host],[],['zth']);
});
check('package writes are counted once and only their latest host is validated',()=>{
  assertExportStructureTargets(config,[updated,member,floor],[host],[],['0']);
  assertExportStructureTargets(config,[updated,member],[],[],['zth']);
});
check('a removed local-only host blocks export even without resaving its member',()=>{
  assert.throws(()=>assertExportStructureTargets(config,[member],[],[],['zth']),error=>{
    const issues=(error as Error & {issues:{featureId:string;value:unknown;message:string}[]}).issues;
    assert.equal(issues[0].featureId,member.ID);assert.equal(issues[0].value,host.ID);
    return issues[0].message.includes('不存在');
  });
});
check('exact formal deletion removes the target; a bare ID or another world/Class does not',()=>{
  assert.throws(()=>assertExportStructureTargets(config,[member],[host],[deletion],['zth']),/不存在/);
  for(const mark of [{ID:host.ID},{...deletion,worldId:'eden'},{...deletion,classCode:'FLR'}])
    assertExportStructureTargets(config,[member],[host],[mark],['zth']);
});
check('delete and recreate applies the written replacement after the exact delete',()=>{
  assert.deepEqual(effectiveMappingRecords(config,[host],[updated],[deletion]),[updated]);
  assertExportStructureTargets(config,[updated,member],[host],[deletion],['zth']);
});
check('genuine duplicates within either source are never silently discarded',()=>{
  assert.equal(effectiveMappingRecords(config,[host,{...host}],[]).length,2);
  assert.equal(effectiveMappingRecords(config,[host,{...host}],[updated]).length,3);
  assert.equal(effectiveMappingRecords(config,[],[updated,{...updated}]).length,2);
  assert.throws(()=>assertExportStructureTargets(config,[member],[host,{...host}],[],['zth']),/不唯一/);
  assert.throws(()=>assertExportStructureTargets(config,[updated,{...updated},member],[host],[],['zth']),/重复 ID/);
});
check('same ID in another world cannot replace or satisfy a member target',()=>{
  const foreign = {...updated,World:'eden'};
  assert.equal(effectiveMappingRecords(config,[host],[foreign]).length,2);
  assert.throws(()=>assertExportStructureTargets(config,[member],[foreign],[],['zth']),/不存在/);
});
check('a cross-Class collision is preserved and blocks export',()=>{
  const collision = {...updated,Class:'FLR',Kind:'NOM',SKind:'RES'};
  assert.equal(effectiveMappingRecords(config,[host],[collision]).length,2);
  assert.throws(()=>assertExportStructureTargets(config,[collision],[host],[],['zth']),/跨 Class/);
});
check('a demoted target and self-binding still fail main-role validation',()=>{
  const demoted = {...member,ID:host.ID,BuildingID:'ANOTHER'};
  assert.throws(()=>assertExportStructureTargets(config,[member],[demoted],[],['zth']),/未启用主结构身份/);
  assert.throws(()=>assertExportStructureTargets(config,[{...member,BuildingID:member.ID}],[],[],['zth']),/未启用主结构身份/);
});
check('unloaded world data produces a readiness report rather than a missing-target claim',()=>{
  assert.throws(()=>assertExportStructureTargets(config,[member],[host],[],[]),error=>{
    const issues=(error as Error & {issues:{code:string;message:string}[]}).issues;
    return issues[0].code==='mapping-structure-world-not-ready'&&!issues[0].message.includes('不存在');
  });
});
check('unwritten historical members do not gain new blockers during a valid demotion',()=>{
  const otherHost = {...updated,ID:'OTHER'};
  const demoted = {...member,ID:host.ID,BuildingID:otherHost.ID};
  const stale = {...member,ID:'OLD_MEMBER'};
  assertExportStructureTargets(config,[demoted],[host,otherHost,stale],[],['zth']);
  assertExportStructureTargets(config,[otherHost],[stale],[],['zth']);
});
console.log(`mapping-record-overlay: ${checks} regressions passed`);
