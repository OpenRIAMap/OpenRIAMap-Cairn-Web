import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateConfigPackage,workflowSearchFields,resolveEffectiveFields} from '../../src/configStudio/runtime';
import {resolveWorkflowFields} from '../../src/configStudio/fieldReuse';
import {validateV3WorkflowRecords} from '../../src/configStudio/workflowKernel';
import {validateIncomingBatch} from './server-validation-entry';
import {validDesignNotes} from '../../src/configStudio/workflowDesignNotes';
import {remoteFeedback,remoteError} from '../../src/feedback/remoteFeedback';
import {teleportNodeAvailable,teleportAvailabilitySignature} from '../../src/core/project/teleportAvailability';
import type {ConfigPackageV3,SearchProfile} from '../../src/configStudio/types';
const config=JSON.parse(fs.readFileSync('public/configuration/releases/ee5dc23f57ac817c3da3977618d71be8d45f77e8aec1fc4fc071dbf9fe03a947/config.json','utf8')) as ConfigPackageV3;
const feedbackContract=JSON.parse(fs.readFileSync('src/feedback/contract.json','utf8'));assert.equal(createHash('sha256').update(fs.readFileSync('src/feedback/remoteFeedbackCatalog.json')).digest('hex'),feedbackContract.catalogSha256);
const original=JSON.stringify(config),report=validateConfigPackage(config);
assert(report.valid,JSON.stringify(report.issues));assert.equal(report.issues.length,3,JSON.stringify(report.issues));
assert(report.issues.every(item=>item.code==='prefill-source-field-missing'));
assert.equal(report.designNotes?.length,10);assert.equal(new Set(report.designNotes!.map(item=>item.groupRoot)).size,1);
assert.equal(JSON.stringify(config),original);assert(validDesignNotes(report.designNotes));assert(validDesignNotes(undefined));assert(!validDesignNotes([{code:'fake'}]));
const road=resolveWorkflowFields(config,config.workflows.find(row=>row.id==='v3-rod_road')!);
const searches=road.steps.flatMap(s=>s.controls??[]).flatMap(c=>[c,...c.group?.itemFields??[]]).filter(c=>c.search);
for(const c of searches){const search=c.search!;assert(workflowSearchFields(config,search).some(f=>f.key===search.returnField));}
const search=searches[0].search!;
assert.equal(workflowSearchFields(config,search).find(f=>f.key==='CoordP')?.type,'json');
assert.equal(workflowSearchFields(config,{...search,scope:undefined,target:{class:'ROD'}}).find(f=>f.key==='ID')?.type,'string');
assert.deepEqual(workflowSearchFields(config,{...search,scope:undefined,target:{class:''}}),[]);
assert.deepEqual(workflowSearchFields(config,{...search,scope:{rows:[{id:'exclude',condition:'exclude',path:{class:'ROD'}}]}} as SearchProfile),[]);
assert.equal(workflowSearchFields(config,{...search,returnField:'nonexistent'}).find(f=>f.key==='nonexistent'),undefined);
const wf=resolveWorkflowFields(config,config.workflows.find(row=>row.id==='v3-editor-tpp')!);
const node=config.nodes.find(n=>n.path.class==='TPT'&&n.path.kind==='TPP'&&n.path.skind==='NOM'&&n.path.skind2==='NOM')!;
const fields=resolveEffectiveFields(config,node.path);assert(fields.some(f=>f.key==='TGTcoordinate'));
const base={ID:'ZTPTTEST',Name:'test',Type:'Point',World:'zth',Class:'TPT',Kind:'TPP',Skind:'NOM',Skind2:'NOM',Coord:[{x:1,z:2}],TGTcoordinate:{x:1,z:2}};
// Actual result validation must reject JSON that is syntactically valid but
// does not satisfy its coordinate target. No static design note is a bypass.
for(const bad of [{x:1},{x:'1',z:2},{x:Infinity,z:2},[]]){
 const result=[{outputId:wf.outputs[0].id,classification:node.path,geometry:'Point',record:{...base,TGTcoordinate:bad}}] as any;
 assert(validateV3WorkflowRecords(config,wf,result).some(issue=>issue.message.includes('TGTcoordinate')),JSON.stringify({bad,issues:validateV3WorkflowRecords(config,wf,result)}));
}
assert.equal(teleportNodeAvailable({}),true);assert.equal(teleportNodeAvailable({Situation:true}),true);assert.equal(teleportNodeAvailable({Situation:false}),false);assert.equal(teleportNodeAvailable({Situation:'false'}),true);
const items=[{ID:'a',Situation:true}];const sig=teleportAvailabilitySignature(items,()=>true);items[0].Situation=false;assert.notEqual(sig,teleportAvailabilitySignature(items,()=>true));
assert.match(remoteFeedback('DELETE_EXISTING_TARGET','raw English','zh'),/确认后/);assert.equal(remoteFeedback('DELETE_EXISTING_TARGET','raw English','en'),'raw English');
assert.equal(remoteFeedback('future-code','reason','zh'),'reason');assert.match(remoteError('configuration-preflight-receipt-stale','zh'),/过期/);
const c19=JSON.parse(fs.readFileSync('public/configuration/releases/a8952271420dabf94d930eb0ba19499da18a891ca39a71cb512432a7f062cac5/config.json','utf8')) as ConfigPackageV3;
const warp={Class:'TPT',Kind:'WRP',SKind:'ZTH',SKind2:'LAKz',Type:'Point',World:'zth',WRPointI2D:'batch-warp'};
const left={...warp,ID:'left-warp'},right={...warp,ID:'right-warp'};
assert.doesNotThrow(()=>validateIncomingBatch(c19,[left],[]));
assert.doesNotThrow(()=>validateIncomingBatch(c19,[right],[]));
assert.throws(()=>validateIncomingBatch(c19,[left,right],[],[],{checkAffectedStructures:true}),error=>{
  const issues=(error as {issues:Array<{worldId:string;businessKey:string;affectedFeatures:Array<{id:string}>}>}).issues;
  assert.deepEqual(issues.map(issue=>[issue.worldId,issue.businessKey,issue.affectedFeatures[0].id]),[
    ['zth','batch-warp','left-warp'],['zth','batch-warp','right-warp'],
  ]);
  return true;
});
assert.doesNotThrow(()=>validateIncomingBatch(c19,[left,{...right,WRPointI2D:'other-warp'}],[],[],{checkAffectedStructures:true}));
console.log(JSON.stringify({valid:report.valid,warnings:report.issues.length,designNotes:report.designNotes?.length,originalUnchanged:true}));
