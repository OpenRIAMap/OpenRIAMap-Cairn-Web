import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {buildingWorkflowSpecs} from './c21-building-workflows';
import {workflowClassificationGroup} from '../../src/configStudio/workflowClassificationGroup';
import {classificationPathKey,validateConfigPackage} from '../../src/configStudio/runtime';
import {compileWorkflowEditPlan,hydrateWorkflowEdit,buildWorkflowEditRecord,findEditingWorkflow,workflowEditClassifications,isQuickMappingWorkflow} from '../../src/configStudio/workflowEditing';
import {prepareNativeWorkflowEdit} from '../../src/configStudio/workflowEditCommit';
import {prepareFullEditorCreate} from '../../src/configStudio/fullEditor';
import {readMultipartGeometry} from '../../src/core/geometry/multipartGeometry';
import {readConfigPackage} from '../../src/configStudio/package';
import type {ConfigPackageV3,ClassificationPath} from '../../src/configStudio/types';
const out=process.argv[2]??'../../outputs/c21-repair-20261124',c=JSON.parse(fs.readFileSync(out+'/candidate/candidate.config.json','utf8')) as ConfigPackageV3;
const checks:string[]=[];const check=(name:string,body:()=>void)=>{body();checks.push(name);};
const raw=(p:ClassificationPath)=>({Class:p.class,Kind:p.kind,SKind:p.skind,SKind2:p.skind2});
check('five exact capture groups, two dedicated editors and unique edit routing',()=>{
 for(const [i,spec]of buildingWorkflowSpecs.entries()){
  const w=c.workflows.find(w=>w.id===spec.id)!;assert(w&&isQuickMappingWorkflow(w));
  const paths=workflowClassificationGroup(c,w.outputs[0]).paths;assert.equal(paths.length,[9,8,8,4,9][i]);assert(paths.every(p=>classificationPathKey(p).startsWith(spec.prefix+'/')));assert.equal(w.outputs[0].geometry.selected,spec.geometry);
  for(const p of paths){const editor=findEditingWorkflow(c,raw(p))!;assert.equal(editor.id,'editor'in spec?spec.editor:spec.id);assert(compileWorkflowEditPlan(editor,c));}
 }
 assert.equal(c.workflows.filter(w=>w.id==='v3-editor-bud-standard'||w.id==='v3-editor-flr-standard').length,2);
 for(const id of ['v3-editor-bud-standard','v3-editor-flr-standard']){const w=c.workflows.find(w=>w.id===id)!;assert(!isQuickMappingWorkflow(w));assert.equal(workflowClassificationGroup(c,w.outputs[0]).paths.length,10);}
});
check('world availability contains all five captures and no retired or dedicated workflow',()=>{
 for(const ids of Object.values(c.application!.workflowAvailability!)){for(const s of buildingWorkflowSpecs)assert(ids.includes(s.id));assert(!ids.some(id=>['v3-bud_building','v3-flr_unit','v3-editor-bud-standard','v3-editor-flr-standard'].includes(id)));}
 assert(!c.workflows.some(w=>['v3-bud_building','v3-flr_unit'].includes(w.id)));
});
check('SPE removed precisely; PLB, all 38 leaves and building button scopes retained',()=>{
 assert(!c.nodes.some(n=>['BUD','FLR'].includes(n.path.class)&&n.path.kind==='SPE'));
 for(const cls of ['BUD','FLR'])assert(c.nodes.some(n=>n.path.class===cls&&n.path.kind==='PLB'));
 assert.equal(c.nodes.filter(n=>['BUD','FLR'].includes(n.path.class)&&!n.children.length&&n.path.kind!=='PLB').length,38);
 assert(validateConfigPackage(c).valid);
 const scope=c.application!.buttons.items.find(b=>b.id==='building')!.criteria.scope!;for(const s of buildingWorkflowSpecs)assert(scope.rows.some(r=>s.prefix.startsWith(classificationPathKey(r.path))));
});
check('member bindings required, single writer per field, and output IDs remapped',()=>{
 for(const s of buildingWorkflowSpecs){const w=c.workflows.find(w=>w.id===s.id)!,o=w.outputs[0],controls=w.steps.flatMap(s=>s.controls??[]);
  assert(controls.filter(c=>['classificationPicker','tagsExtensions','dataset'].includes(c.kind)).every(c=>c.outputId===o.id));assert.equal(controls.filter(c=>c.kind==='dataset').length,1);
  assert.equal(new Set(o.assignments.map(a=>a.target)).size,o.assignments.length);
  if(s.prefix.includes('/SUB/')||s.prefix.startsWith('FLR'))for(const target of ['BuildingID','NofFloor']){const a=o.assignments.find(a=>a.target===target)!;const control=controls.find(c=>c.slot===a.expression)!;assert(control.required);assert.equal(control.sectionId,'building-details');if(target==='BuildingID')assert.equal(control.search?.targetRole,'main');}
 }
});
const source=path.resolve('../ui-sidebar-local-web/.cache/ui-validation/formal-data/releases/review-a41383cdf72c47df2e23/data-merge/zth');
const records=fs.readdirSync(source).filter(p=>p.endsWith('.json')).flatMap(p=>JSON.parse(fs.readFileSync(path.join(source,p),'utf8')).features.map((f:any)=>f.record)) as Record<string,unknown>[];
const historical=records.filter(r=>['BUD','FLR'].includes(String(r.Class))&&r.Kind==='NOM'&&!r.SKind&&!r.Skind);
check('50 real historical parent records hydrate and save through actual edit boundary',()=>{
 assert.equal(historical.length,50);
 for(const record of historical){const w=findEditingWorkflow(c,record)!,plan=compileWorkflowEditPlan(w,c),draft=hydrateWorkflowEdit(plan,record),geometry=readMultipartGeometry(record,w.outputs[0].geometry.selected).geometry!;
  assert(geometry,String(record.ID));const updated=prepareNativeWorkflowEdit(c,w,record,draft,geometry,'zth','local-reviewer',records.filter(r=>r.ID!==record.ID));
  assert.equal(updated.ID,record.ID);assert.equal(updated.SKind,record.SKind);assert.equal(updated.Kind,'NOM');assert.equal(updated.CreateBy,record.CreateBy);assert.deepEqual(updated.tags,record.tags);
  assert(workflowEditClassifications(plan,draft.classification).some(p=>!p.skind));assert(!workflowEditClassifications(plan,draft.classification,'create').some(p=>!p.skind));
 }
});
check('legacy parents can specialize; new leaves cannot downgrade or create parent records',()=>{
 for(const cls of ['BUD','FLR']){const original=historical.find(r=>r.Class===cls)!,w=findEditingWorkflow(c,original)!,plan=compileWorkflowEditPlan(w,c),draft=hydrateWorkflowEdit(plan,original),leaf={class:cls,kind:'NOM',skind:'RES'},geometry=readMultipartGeometry(original,'Polygon').geometry!;
  const updated=prepareNativeWorkflowEdit(c,w,original,{...draft,classification:leaf},geometry,'zth','tester',records.filter(r=>r.ID!==original.ID));assert.equal(updated.SKind,'RES');assert.equal(updated.ID,original.ID);
  const specialized=hydrateWorkflowEdit(plan,updated);assert(!workflowEditClassifications(plan,specialized.classification).some(p=>!p.skind));
  assert.throws(()=>buildWorkflowEditRecord(plan,updated,{...specialized,classification:{class:cls,kind:'NOM'}}),/不能退回/);
  assert.throws(()=>prepareFullEditorCreate(c,w,draft,geometry,'zth','tester'),/末级用途/);
 }
});
const zip=fs.readFileSync(out+'/candidate/c21-ria-review.cairn-config.zip');assert.deepEqual(await readConfigPackage(new File([zip],'c21.zip')),c);checks.push('final ZIP roundtrip retains all workflow and editor policies');
fs.writeFileSync(out+'/followup-tests.json',JSON.stringify({passed:checks.length,historicalRecords:historical.length,checks},null,2)+'\n');console.log('c21 followup:',checks.length,'groups passed; historical records:',historical.length);
