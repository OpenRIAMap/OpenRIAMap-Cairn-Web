import {gunzipSync} from 'node:zlib';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compileWorkflowEditPlan,hydrateWorkflowEdit,buildWorkflowEditRecord} from '../../src/configStudio/workflowEditing';
import {validateConfigPackage,resolveEffectiveFields} from '../../src/configStudio/runtime';
const config=JSON.parse(gunzipSync(fs.readFileSync('scripts/config-tools/fixtures/c18-tpt-status.config.json.gz')).toString('utf8'));
const before=JSON.parse(fs.readFileSync('public/configuration/releases/ee5dc23f57ac817c3da3977618d71be8d45f77e8aec1fc4fc071dbf9fe03a947/config.json','utf8'));
for(const id of ['v3-editor-tpp','v3-wrp_warp']){
 const plan=compileWorkflowEditPlan(config.workflows.find(w=>w.id===id),config),binding=plan.bindings.find(b=>b.target==='Situation')!;assert(binding);
 for(const state of [undefined,true,false]){
  const p=plan.classifications[0],record={ID:'test',Name:'test',World:'zth',Class:p.class,Kind:p.kind,SKind:p.skind,SKind2:p.skind2,Type:'Points',CoordP:[[0,64,0]],...(state===undefined?{}:{Situation:state})};
  const draft=hydrateWorkflowEdit(plan,record);assert.equal(draft.slots[binding.slot],state??true);
  assert.deepEqual(buildWorkflowEditRecord(plan,record,draft),record,'untouched edit must preserve absent/false exactly');
  const changed={...draft,slots:{...draft.slots,[binding.slot]:false}};assert.equal(buildWorkflowEditRecord(plan,record,changed).Situation,false);
 }
}
for(const node of before.nodes.filter(n=>n.fields.some(f=>f.key==='Situation')&&n.path.class==='TPT'))assert.deepEqual(config.nodes.find(n=>n.nodeId===node.nodeId),node);
for(const id of ['v3-landmark-standard','v3-landmark-fst','v3-naraku-portal','v3-houtu-post'])assert.deepEqual(config.workflows.find(w=>w.id===id),before.workflows.find(w=>w.id===id));
assert.deepEqual(config.application,before.application);
const report=validateConfigPackage(config);assert(report.valid);assert.equal(report.issues.length,3);assert.equal(report.designNotes?.length,10);
for(const p of [{class:'TPT',kind:'TPP',skind:'NOM',skind2:'NOM'},{class:'TPT',kind:'TPP',skind:'SPE',skind2:'SPE'},{class:'TPT',kind:'WRP',skind:'NOM',skind2:'NOM'},{class:'TPT',kind:'WRP',skind:'SPE',skind2:'SPE'}])assert.equal(resolveEffectiveFields(config,p).find(f=>f.key==='Situation')?.type,'boolean');
console.log('Candidate: true/false/missing edit hydration and unchanged writes; five existing fields/four workflows/application preserved; 3 warnings/10 notes passed.');
