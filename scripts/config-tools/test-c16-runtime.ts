import assert from 'node:assert/strict';
import fs from 'node:fs';
import {migratePackageToC16,migrateContract} from '../../src/configStudio/contractMigration';
import {prepareSpecializedCapture,recordsAfterExactDeletes} from '../../src/configStudio/nativeRecordSubmission';
import {externalRolePaths,resolveExternalReference,externalBindingIssues} from '../../src/configStudio/externalBindings';
import {EXTERNAL_COMPONENT_ROLES,EXTERNAL_ROLES} from '../../src/configStudio/externalCapabilities';
import {specializedFormView} from '../../src/components/Mapping/Workflow/specialized/registration';
import {specializedReferenceSearch} from '../../src/components/Mapping/Workflow/specialized/referenceSearch';
import {mergeWorkflowSearchPool,filterWorkflowSearchOptions} from '../../src/components/Mapping/Workflow/workflowSearchPool';
import {createTrpExternalEditSession,prepareTrpExternalEdit} from '../../src/configStudio/trpExternalEditing';
import {prepareWorkflowArtifactImport,buildWorkflowArtifact} from '../../src/configStudio/workflowArtifact';
import {createMergeDraft,prepareMergeDraft} from '../../src/components/Mapping/Special/NativeMergeForm';
import {readMultipartGeometry,type MultipartGeometry} from '../../src/core/geometry/multipartGeometry';
import {resolveEffectiveFields,resolveGeometryProfile} from '../../src/configStudio/runtime';
import {readC14MigrationSource} from './fixtures/c14-migration-source';
import type {ConfigPackageV3,ExternalRole} from '../../src/configStudio/types';
import type {WorkflowBridge} from '../../src/components/Mapping/Workflow/WorkflowHost';
const index=JSON.parse(fs.readFileSync('public/configuration/current.json','utf8')),base=JSON.parse(fs.readFileSync('public'+index.configUrl,'utf8')) as ConfigPackageV3,config=migratePackageToC16(base).config;
const point:MultipartGeometry={type:'Point',parts:[{x:1,y:64,z:2}]},ring=[{x:0,y:64,z:0},{x:20,y:64,z:0},{x:20,y:64,z:20},{x:0,y:64,z:20}],polygon:MultipartGeometry={type:'Polygon',parts:[[ring]]},multi:MultipartGeometry={type:'Polygon',parts:[[ring,ring.map(p=>({...p,x:5+p.x/4,z:5+p.z/4}))],[ring.map(p=>({...p,x:p.x+40}))]]},line:MultipartGeometry={type:'LineString',parts:[[ring[0],ring[1]]]};
const values:Record<ExternalRole,Record<string,unknown>>={railLine:{Name:'rail',bureau:'TEST',line:'A',color:'#123456',direction:1,startplf:'p1',endplf:'p2'},stationArea:{Name:'area',STBuilding:'b',platforms:[{ID:'p'}]},platform:{Name:'platform',Situation:true,Connect:false,lines:[{ID:'l',getin:true,getout:true}]},platformFootprint:{Name:'outline',LineID:'l'},stationBuilding:{Name:'building',Floors:[{ID:'f'}]},stationBuildingPoint:{Name:'building point',Floors:[{ID:'f'}],stations:[{ID:'s'}]},stationFloor:{Name:'floor',NofFloor:'1F',staBuildingID:'b'},tradePoint:{Name:'trade',Trade:[]}};
for(const workflow of config.workflows.filter(w=>w.mode==='external'&&w.external?.purpose!=='edit'))for(const role of EXTERNAL_COMPONENT_ROLES[workflow.external!.componentKey]){
 const paths=externalRolePaths(config,workflow,role),path=paths[0],geometry=role==='platformFootprint'?multi:EXTERNAL_ROLES[role].geometry==='Polygon'?polygon:EXTERNAL_ROLES[role].geometry==='LineString'?line:point;
 const record=prepareSpecializedCapture(config,workflow,role,geometry,{ID:'local-'+role,...values[role]},{},'zth','test',[],path);
 assert.equal(record.Class,path.class);assert.equal(record.Kind,path.kind);assert.equal(record.CreateBy,'test');assert.equal(readMultipartGeometry(record,geometry.type).geometry?.parts.length,geometry.parts.length);
 const renamed=structuredClone(config),customPath={class:'C16_ROLE_'+role.toUpperCase()},sourceNode=config.nodes.find(node=>JSON.stringify(node.path)===JSON.stringify(path))!;
 renamed.nodes.push({...structuredClone(sourceNode),nodeId:'custom-'+role,path:customPath,geometryType:EXTERNAL_ROLES[role].geometry,geometryProfiles:{[EXTERNAL_ROLES[role].geometry]:structuredClone(resolveGeometryProfile(config,path,EXTERNAL_ROLES[role].geometry)!)},fields:structuredClone(resolveEffectiveFields(config,path)),children:[]});
 const remapped=renamed.workflows.find(row=>row.id===workflow.id)!;remapped.external!.roleBindings!.find(binding=>binding.role===role)!.classificationGroup.selectors=[{id:'custom',mode:'self',path:customPath}];
 assert.deepEqual(externalBindingIssues(renamed).filter(issue=>issue.path.startsWith('workflows/'+workflow.id+'/')),[],role+' accepts arbitrary compatible taxonomy');
 const custom=prepareSpecializedCapture(renamed,remapped,role,geometry,{ID:'custom-'+role,Kind:'STALE',...values[role]},{},'zth','test',[],customPath);assert.equal(custom.Class,customPath.class);assert.equal(custom.Kind,undefined);
 const copy=JSON.stringify(geometry);if(role==='platformFootprint')assert.equal((record.CoordG as unknown[][])[0].length,2);assert.equal(JSON.stringify(geometry),copy);
 if(role==='stationBuilding')assert.throws(()=>prepareSpecializedCapture(config,workflow,role,multi,{ID:'bad',...values[role]},{},'zth','test',[],path),/一个面部件/);
 const view=specializedFormView(config,workflow,path,role);assert.equal(view.classification,undefined);assert.equal(view.fields.find(field=>field.path==='Name')?.label,resolveEffectiveFields(config,path).find(field=>field.key==='Name')?.labels.zh);
}
for(const role of ['platformFootprint','stationBuilding','platform','stationArea'] as ExternalRole[]){const bundle=createMergeDraft(config,role);assert.equal(bundle.role,role);assert(bundle.plan.controls.length>0);assert.equal(bundle.draft.slots.EDIT_ID,'');if(role==='stationBuilding')assert.throws(()=>prepareMergeDraft(bundle,multi,'zth','test',[]),/单部件/);}
const capture=config.workflows.find(w=>w.external?.componentKey==='tradePointWorkflow')!,editor=config.workflows.find(w=>w.external?.componentKey==='tradePointEditor')!,path=externalRolePaths(config,editor,'tradePoint')[0];
const trade=prepareSpecializedCapture(config,capture,'tradePoint',point,{ID:'trade-test',...values.tradePoint},{},'zth','creator',[],path),session=createTrpExternalEditSession(config,editor,trade);
const target=externalRolePaths(config,editor,'tradePoint')[1];session.values.__workflowEditorClassification=[target.kind??'',target.skind??'',target.skind2??''].join('||');session.values.Name='edited';const edited=prepareTrpExternalEdit(config,editor,session,point,'zth','editor',[]);assert.equal(edited.Kind,target.kind);assert.equal(edited.Name,'edited');assert.equal(edited.CreateBy,'creator');
const artifact=buildWorkflowArtifact(config,editor);assert.equal(prepareWorkflowArtifactImport(config,artifact).workflow.id,editor.id,'explicit references resolve against the surrounding package');
const binding=resolveExternalReference(config,capture,'landUnit'),landPath=binding.classificationGroup.selectors[0].path,records=[{ID:'land',Name:'Alpha',World:'zth',Class:landPath.class,Kind:landPath.kind,SKind:'SBC'},{ID:'foreign',Name:'Alpha',World:'eden',Class:landPath.class,Kind:landPath.kind,SKind:'SBC'}];
const bridge={getCaptureContext:()=>({config,workflow:capture})} as WorkflowBridge,cfg=specializedReferenceSearch(bridge,'landUnit');let pool=mergeWorkflowSearchPool(records,[],[],cfg,'zth');assert.equal(pool.length,1);assert.equal(pool[0].display,'Alpha（land）');assert.equal(filterWorkflowSearchOptions(pool,'alp',50,{...cfg,matcher:'prefix'}).length,1);assert.equal(filterWorkflowSearchOptions(pool,'pha',50,{...cfg,matcher:'prefix'}).length,0);assert.equal(filterWorkflowSearchOptions(pool,'ap',50,{...cfg,matcher:'fuzzy'}).length,1);
assert.equal(filterWorkflowSearchOptions(pool,'alp',50,{...cfg,minQueryLength:4}).length,0);assert.equal(mergeWorkflowSearchPool(records,[],[],{...cfg,worldScope:'loadedWorlds'},'zth').length,2);
assert.equal(mergeWorkflowSearchPool(records,[{...records[0],Class:'ROD'}],[],cfg,'zth').length,0,'scope-changing overlay removes stale base');
assert.throws(()=>mergeWorkflowSearchPool([{...records[0],Alias:'same'},{...records[0],ID:'second',Alias:'same'}],[],[],{...cfg,getId:r=>r.Alias},'zth'),/不唯一/);
const invalid=structuredClone(config);invalid.workflows.find(w=>w.id===capture.id)!.external!.referenceBindings![0]={bindingId:'landUnit',classificationGroup:binding.classificationGroup,search:{...binding.search,returnField:'Type',maxResults:0}};assert(externalBindingIssues(invalid).length);
const existing=[{ID:'x',Class:'A',World:'zth'},{ID:'x',Class:'B',World:'eden'}];assert.equal(recordsAfterExactDeletes(existing,[{ID:'x'}]).length,2);assert.deepEqual(recordsAfterExactDeletes(existing,[{ID:'x',classCode:'A',worldId:'zth'}]),[existing[1]]);
const c14=readC14MigrationSource().config;assert.equal(migratePackageToC16(c14).config.contractRevision,16);for(const kind of ['node','classTree'] as const){const nodes=base.nodes.filter(n=>n.path.class==='TRP'),document=kind==='node'?{contractRevision:15,node:nodes[0]}:{contractRevision:15,nodes};assert.equal(migrateContract(document,16,kind,base).document.contractRevision,16);}
console.log('c16 runtime: all 8 roles, full PFB/holes, STB guard, native merge forms, trade classification edit, component references, query semantics/world/overlay/ambiguity, exact deletions and migration chains passed');
