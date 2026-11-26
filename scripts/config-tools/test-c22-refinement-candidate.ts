import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import type {ClassificationPath,ConfigPackageV3,GeometryKind,WorkflowDefinition} from '../../src/configStudio/types';
import {classificationPathKey,resolveEffectiveFields,resolveGeometryProfile,validateConfigPackage} from '../../src/configStudio/runtime';
import {workflowClassificationGroup} from '../../src/configStudio/workflowClassificationGroup';
import {compileWorkflowEditPlan,hydrateWorkflowEdit,buildWorkflowEditRecord,findEditingWorkflow,workflowEditClassifications} from '../../src/configStudio/workflowEditing';
import {evaluateV3WorkflowOutputs,validateV3WorkflowRecords} from '../../src/configStudio/workflowKernel';
import {workflowConditionContext} from '../../src/configStudio/c21Workflow';
import {applyApplicationSettings} from '../../src/core/project/applicationRuntime';
import type {MultipartGeometry} from '../../src/core/geometry/multipartGeometry';

// Exact configuration bytes exported by normal Edge studio UI. This test reads
// the candidate; it does not generate or rewrite business configuration.
const config=JSON.parse(gunzipSync(fs.readFileSync('scripts/config-tools/fixtures/c22-refinement-candidate.config.json.gz')).toString('utf8')) as ConfigPackageV3;
const base=JSON.parse(fs.readFileSync('public/configuration/releases/aa2a777f4cd1456b4155b8b7e5831ab2902b55054d80a613bec433716862826b/config.json','utf8')) as ConfigPackageV3;
assert.equal(config.contractRevision,22);assert.equal(config.nodes.length,149);assert.equal(config.workflows.length,37);
const report=validateConfigPackage(config);assert(report.valid,JSON.stringify(report.issues.filter(i=>i.severity==='error')));
assert.deepEqual(config.lookupTables,base.lookupTables);assert.deepEqual(config.engine,base.engine);
const application=structuredClone(config.application!);application.workflowAvailability=base.application!.workflowAvailability;assert.deepEqual(application,base.application);
applyApplicationSettings(config.application!);
const retiredGroups:Record<string,string[]>={
 'v3-natural-area':['v3-isg_ngf_lad','v3-isg_ngf_lis','v3-isg_ngf_wtb'],
 'v3-natural-line':['v3-ngf_lis_lal','v3-isl_ngf_wtr'],
 'v3-natural-point':['v3-ngf_lis_lap'],
 'v3-settlement-area':['v3-isg_adm_dbz','v3-isg_adm_plz'],
 'v3-settlement-boundary':['v3-isl_adm_dbl','v3-isl_adm_pll'],
 'v3-human-point':['v3-isp_adm_dbp','v3-isp_adm_plp'],
 'v3-airport-port':['v3-pta_air','v3-pta_pot'],
};
const counts=[16,5,2,8,2,4,2],retired=Object.values(retiredGroups).flat();assert.equal(retired.length,14);
assert(!config.workflows.some(w=>retired.includes(w.id)||w.id==='v3-editor-bud-standard'));
for(const [world,ids] of Object.entries(base.application!.workflowAvailability)){
 const replacements=new Map(Object.entries(retiredGroups).flatMap(([next,old])=>old.map(id=>[id,next] as const)));
 assert.deepEqual(config.application!.workflowAvailability[world],[...new Set(ids.map(id=>replacements.get(id)??id))],world);
}
const geometry=(kind:GeometryKind):MultipartGeometry=>kind==='Point'?{type:kind,parts:[{x:0,y:64,z:0}]}:kind==='LineString'?{type:kind,parts:[[{x:0,y:64,z:0},{x:10,y:64,z:10}]]}:{type:kind,parts:[[[{x:0,y:64,z:0},{x:10,y:64,z:0},{x:10,y:64,z:10},{x:0,y:64,z:10}]]]};
let total=0;
for(const [index,id] of Object.keys(retiredGroups).entries()){
 const w=config.workflows.find(w=>w.id===id)!;assert(w.editor?.enabled);assert.deepEqual(w.steps.map(s=>s.kind),['actor','form','geometry']);assert.equal(w.outputs.length,1);
 const output=w.outputs[0],paths=workflowClassificationGroup(config,output).paths;assert.equal(paths.length,counts[index]);const plan=compileWorkflowEditPlan(w,config),form=w.steps[1];
 assert.equal(form.sections?.length,2);for(const kind of ['classificationPicker','dataset','tagsExtensions'])assert.equal(form.controls!.filter(c=>c.kind===kind).length,1);
 const extra=form.layout!.find(item=>item.kind==='section'&&form.sections!.find(s=>s.id===item.sectionId)?.label.zh==='额外标签信息');assert(extra?.kind==='section');
 for(const c of form.controls!){const tag=c.kind==='dataset'||c.slot&&output.assignments.some(a=>a.target.startsWith('tags.')&&a.expression===c.slot);if(tag)assert(extra.children.some(item=>item.controlId===c.id),`${id}/${c.id}`);}
 for(const path of paths){
  const slots:Record<string,unknown>={actor:'candidate-test'};
  for(const c of form.controls!){if(c.kind==='classificationPicker')slots[c.slot??c.id]=JSON.stringify(path);else if(c.slot)slots[c.slot]=c.id.includes('abbr-')?'C22TEST':c.id.includes('wiki-')?'https://example.test/wiki':c.id.includes('YTime-')?'20271231':'样本';}
  const selected={[output.id]:path};const result=evaluateV3WorkflowOutputs(w,workflowConditionContext(w,slots,selected),{config,world:'zth',classifications:selected,coordinates:{[output.id]:geometry(output.geometry.selected)},now:new Date('2026-11-26T00:00:00Z')});
  assert.equal(result.length,1);assert.deepEqual(validateV3WorkflowRecords(config,w,result),[],classificationPathKey(path));
  const record={...result[0].record,unmanaged:{zero:0,no:false,nothing:null,empty:[]}};
  const draft=hydrateWorkflowEdit(plan,record);assert.deepEqual(buildWorkflowEditRecord(plan,record,draft),record);
  assert.equal(findEditingWorkflow(config,record)?.id,id);assert.equal(record.CreateBy,'candidate-test');assert(record.ID);
  if(id==='v3-natural-area')assert.equal(record.ID,'ZNGF'+(path.kind==='LAD'?'LAD'+path.skind:(path.skind??'')+(path.skind2??''))+'_C22TEST');
  const target=paths.find(p=>classificationPathKey(p)!==classificationPathKey(path))!;draft.classification=target;const changed=buildWorkflowEditRecord(plan,record,draft);assert.equal(changed.ID,record.ID);assert.deepEqual(changed.unmanaged,record.unmanaged);assert.equal(changed.CreateTime,record.CreateTime);total++;
 }
}
assert.equal(total,39);
const bud=config.workflows.find(w=>w.id==='v3-editor-bud-area')!,budPlan=compileWorkflowEditPlan(bud,config);assert(bud.editor?.dedicated);assert.equal(bud.quickMapping,false);assert.equal(budPlan.classifications.length,27);
assert.equal(workflowEditClassifications(budPlan,{class:'BUD',kind:'NOM',skind:'RES'}).length,26);assert.equal(workflowEditClassifications(budPlan,{class:'BUD',kind:'NOM'}).length,27);
assert(!budPlan.classifications.some(p=>p.skind==='BUP'||p.class==='FLR'));
for(const original of base.nodes){
 const node=config.nodes.find(n=>classificationPathKey(n.path)===classificationPathKey(original.path))!;assert(node);
 const p=node.path,key=classificationPathKey(p);
 if(p.class==='NGF'&&p.kind==='WTR'&&!p.skind){
  // Studio's category-template factory replaced the empty SWB placeholder.
  const paths=(c:ConfigPackageV3,ids:string[])=>(ids??[]).map(id=>classificationPathKey(c.nodes.find(n=>n.nodeId===id)!.path)).sort();
  assert.deepEqual(paths(config,node.children??[]),paths(base,original.children??[]));assert.deepEqual({...node,children:original.children},original);continue;
 }
 if(!['BUD','FLR'].includes(p.class)&&!(p.class==='NGF'&&p.kind==='WTR'&&['LWB','SWB'].includes(p.skind??''))){assert.deepEqual(node,original,key);continue;}
 if(['BUD','FLR'].includes(p.class)){
  const untouched=structuredClone(node);untouched.geometryProfiles=original.geometryProfiles;untouched.displaySettings=original.displaySettings;assert.deepEqual(untouched,original,key);
  for(const kind of Object.keys(node.geometryProfiles) as GeometryKind[]){
   const rules=node.geometryProfiles[kind]!.zoomPriority.rules,old=original.geometryProfiles[kind]!.zoomPriority.rules;if(!old.some(r=>r.representation!=='hidden')){assert.deepEqual(rules,old);continue;}
   const bup=p.skind==='BUP',member=p.class==='FLR'||p.kind==='SUB'&&!bup,large=p.kind==='LAR',visible=rules.filter(r=>r.representation!=='hidden');
   const mid=visible[0];assert.equal(mid.representation,bup?old.find(r=>r.representation!=='hidden')!.representation:'point',key);const symbol=mid.style.pointSymbol;assert.equal(symbol?.kind,'icon',key);assert.equal(symbol?.icon?.item?.sizePx,13,key);
   const icon=symbol!.icon!.item!;assert.equal(icon.foreground.color,'#000000');assert.equal(icon.halo?.color.color,'#ffffff');assert.equal(icon.halo?.widthPx,1.5);assert(!icon.plate);
   assert.deepEqual(mid.label,old.find(r=>r.representation!=='hidden')!.label,key+' keeps middle label');
   if(member){assert.deepEqual(mid.when.zoom,{min:4,max:7});assert.deepEqual(visible[1].when.zoom,{min:8,max:8});assert.equal(icon.behavior?.visibility,'independent');assert.equal(icon.behavior?.anchor,'geometry');}
   if(large){assert.deepEqual(mid.when.zoom,{min:3,max:4});assert.deepEqual(visible[1].when.zoom,{min:5,max:8});assert.equal(node.displaySettings?.structure?.floorViewMinZoom,5);}
   if(bup){assert.deepEqual(rules.map(r=>r.when.zoom),old.map(r=>r.when.zoom));assert(visible.every(r=>r.style.pointSymbol?.icon?.item?.sizePx===13));}
   assert.deepEqual(visible.at(-1)!.label,old.filter(r=>r.representation!=='hidden').at(-1)!.label,key+' keeps final label');
  }
 }
}
assert.equal(config.nodes.find(n=>n.path.class==='BUD'&&n.path.kind==='SUB'&&!n.path.skind)!.geometryType,undefined);
assert.equal(config.nodes.find(n=>n.path.class==='BUD'&&n.path.skind==='BUP'&&!n.path.skind2)!.geometryType,'Point');
for(const node of config.nodes.filter(n=>n.path.class==='NGF'&&n.path.kind==='WTR'&&['LWB','SWB'].includes(n.path.skind??''))){
 const small=node.path.skind==='SWB',profile=resolveGeometryProfile(config,node.path,'Polygon')!;assert(profile.enabled);const rules=[...profile.zoomPriority.rules].sort((a,b)=>a.when.zoom.min-b.when.zoom.min);assert.equal(rules.length,2);assert.deepEqual(rules[0].when.zoom,{min:0,max:small?2:0});assert.equal(rules[0].representation,'hidden');assert.deepEqual(rules[1].when.zoom,{min:small?3:1,max:8});assert.equal(rules[1].representation,'labelOnly');assert.equal(rules[1].label.style.size,small?12.5:14);
 if(small)assert(resolveEffectiveFields(config,node.path).some(f=>f.key==='Name'));
}
console.log('c22 UI candidate: 39 leaf create/edit outputs, seven layouts/routes, six worlds, polygon editor, unchanged-scope guards and all building/water effective display rules passed.');
