import {compileWorkflowEditPlan,hydrateWorkflowEdit,buildWorkflowEditRecord} from '../../src/configStudio/workflowEditing';
import {pruneWorkflowAvailability} from '../../src/configStudio/workflowEditing';
import {buildWorkflowArtifact,prepareWorkflowArtifactImport} from '../../src/configStudio/workflowArtifact';
import {createCategoryArtifact,prepareCategoryImport} from '../../src/configStudio/categoryArtifact';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {migratePackageToContract} from '../../src/configStudio/contractMigration';
import {changeNodeInheritance} from '../../src/configStudio/inheritanceTransition';
import {resolveEffectiveFields,resolveCardConfiguration,resolveGeometryProfile,validateConfigPackage} from '../../src/configStudio/runtime';
import {resolveNodeFieldSettings} from '../../src/configStudio/nodeFieldSettings';
import {syncWorkflowClassification} from '../../src/configStudio/systemClassification';
import {annotationsForOutput} from '../../src/configStudio/workflowAnnotations';
import {appendEditCheckpoint,readEditAudit,editAuditForExport,editDiff} from '../../src/configStudio/editAudit';
import {validateMediaPolicy} from '../../src/configStudio/mediaPolicy';
import {effectiveOptions} from '../../src/configStudio/lookupTables';
import {richTextProblems,safeRichTextLink} from '../../src/configStudio/richText';
import type {ConfigPackageV3,CategoryNode,CardItem,FieldDefinition} from '../../src/configStudio/types';

const original=JSON.parse(fs.readFileSync('public/configuration/releases/b81d2f8aa9f0014768645d5b0f9ec6d6d7bd2ccb671857d9175e0d09069d03be/config.json','utf8')) as ConfigPackageV3;
const migrated=migratePackageToContract(original,18).config;
const field={fieldId:'name',key:'Name',labels:{zh:'名称',en:'Name'},type:'string',cardinality:'single',required:false,inheritance:'overridable'} as FieldDefinition;
const item={id:'name-card',source:'Name',label:{zh:'名称',en:'Name'},renderer:'plain',section:'main',visible:true} as CardItem;
const nodes:CategoryNode[]=[
 {nodeId:'A',path:{class:'A'},children:['B'],inheritDown:{fields:true,card:true,display:true,search:true},fields:[field],geometryProfiles:{},card:{mode:'fields',items:[item]},searchSettings:{queryFields:['ID','Name'],subtitle:{mode:'classification'},extension:{mode:'none'}}},
 {nodeId:'B',path:{class:'A',kind:'B'},children:['C'],inheritDown:{fields:true,card:true,display:true,search:true},fields:[],geometryProfiles:{}},
 {nodeId:'C',path:{class:'A',kind:'B',skind:'C'},children:['D'],inheritDown:{fields:true,card:true,display:true,search:true},fields:[],geometryProfiles:{}},
 {nodeId:'D',path:{class:'A',kind:'B',skind:'C',skind2:'D'},children:[],inheritDown:{fields:true,card:true,display:true,search:true},fields:[],geometryProfiles:{}},
];
const fixture={...migrated,nodes};
const effective=(config:ConfigPackageV3)=>nodes.map(node=>({fields:resolveEffectiveFields(config,node.path).map(value=>({key:value.key,type:value.type})),card:resolveCardConfiguration(config,node.path)?.mode==='fields'?(resolveCardConfiguration(config,node.path) as {items:CardItem[]}).items.map(value=>({source:value.source,label:value.label})):null,search:resolveNodeFieldSettings(config,node.path).value.search}));
const before=effective(fixture),detached=changeNodeInheritance(fixture,'A','fields',false);
assert.deepEqual(effective(detached),before);assert.deepEqual(fixture.nodes[0].inheritDown,nodes[0].inheritDown);
detached.nodes[0].fields[0].labels.zh='父级更改';assert.equal(resolveEffectiveFields(detached,nodes[3].path)[0].labels.zh,'名称');
assert.throws(()=>changeNodeInheritance(detached,'A','fields',true),/未修改任何绑定/);
detached.nodes[0].fields[0].labels.zh='名称';
detached.nodes[3].fields.push({...field,fieldId:'extra',key:'tags.extra'});
const attached=changeNodeInheritance(detached,'A','fields',true);
assert.ok(resolveEffectiveFields(attached,nodes[3].path).some(value=>value.key==='tags.extra'));
const cardAttached=changeNodeInheritance(attached,'A','card',true);
assert.equal((resolveCardConfiguration(cardAttached,nodes[3].path) as {items:CardItem[]}).items.length,1);
const cardDetached=changeNodeInheritance(fixture,'A','card',false);
cardDetached.nodes[3].card={mode:'fields',items:[...((cardDetached.nodes[3].card as {items:CardItem[]}).items),{...item,id:'extra-card',source:'ID'}]};
const withExtra=changeNodeInheritance(cardDetached,'A','card',true);
assert.equal((resolveCardConfiguration(withExtra,nodes[3].path) as {items:CardItem[]}).items.length,2);

const workflow=structuredClone(migrated.workflows.find(value=>value.mode==='composed'&&value.outputs.length)!);
const first=workflow.outputs[0];workflow.outputs=[first,{...structuredClone(first),id:first.id+'-second'}];
const synced=syncWorkflowClassification(migrated,workflow),controls=synced.steps.flatMap(step=>step.controls??[]);
for(const output of synced.outputs)for(const kind of ['classificationPicker','tagsExtensions'])assert.equal(controls.filter(value=>value.kind===kind&&value.outputId===output.id).length,1);
const slots=Object.fromEntries(controls.filter(value=>value.kind==='tagsExtensions').map((value,index)=>[value.id,{[value.outputId!]:{tags:[{key:'test',type:'text',value:String(index)}]}}]));
assert.deepEqual(annotationsForOutput(synced,slots,synced.outputs[0].id).tags,{test:'0'});
assert.deepEqual(annotationsForOutput(synced,slots,synced.outputs[1].id).tags,{test:'1'});
assert.equal(syncWorkflowClassification(migrated,synced).steps.flatMap(step=>step.controls??[]).filter(value=>value.kind==='tagsExtensions').length,2);
synced.outputs.pop();assert.equal(syncWorkflowClassification(migrated,synced).steps.flatMap(step=>step.controls??[]).filter(value=>value.kind==='tagsExtensions').length,1);

const baseline={packageId:original.packageId,revision:151,contractRevision:17,configSha256:'0'.repeat(64)};
const audit=await appendEditCheckpoint(undefined,baseline,original,migrated),publication={...migrated,revision:152};
const stagedConfig={...migrated,displayName:{...migrated.displayName,zh:'尚未保存的候选'}};
const stagedAudit=await editAuditForExport(audit,stagedConfig,migrated);assert.ok(stagedAudit?.staged);assert.ok(await readEditAudit(stagedAudit,stagedConfig));await assert.rejects(()=>readEditAudit(stagedAudit,{...stagedConfig,revision:999}),/摘要不一致/);
const bound=await editAuditForExport(audit,publication);assert.ok(bound?.publication);
assert.ok(await readEditAudit(bound,publication));await assert.rejects(()=>readEditAudit(bound,{...publication,revision:153}),/摘要不一致/);
assert.equal((await appendEditCheckpoint(audit,baseline,original,migrated))?.checkpoints.length,1);

const policy=structuredClone(migrated);policy.application!.preferences.pictureControls={allowUpload:false,allowExternalLink:false};
const history=[{worldId:'eden',featureId:'same',url:'https://example.org/a.png'},{worldId:'eden',featureId:'same',sha256:'a'.repeat(64)}];
assert.deepEqual(validateMediaPolicy(policy,history,history),[]);
assert.equal(validateMediaPolicy(policy,[{...history[0],featureId:'another'}],history).length,1);
assert.equal(validateMediaPolicy(policy,[{...history[1],worldId:'houtu'}],history).length,1);
assert.deepEqual(validateMediaPolicy(policy,[],history),[]);
for(const upload of [false,true])for(const link of [false,true]){policy.application!.preferences.pictureControls={allowUpload:upload,allowExternalLink:link};assert.equal(validateMediaPolicy(policy,[{worldId:'eden',featureId:'new',url:'https://example.org/new.png'},{worldId:'eden',featureId:'new',sha256:'b'.repeat(64)}],[]).length,Number(!upload)+Number(!link));}
const hubs=effectiveOptions(migrated,{optionsTableId:'teleport-hubs'});assert.equal(hubs.length,migrated.lookupTables!.find(value=>value.id==='teleport-hubs')!.rows.length);
assert.ok(hubs.every(value=>!('functionValue' in value)));
assert.equal(safeRichTextLink('javascript:alert(1)'),false);assert.equal(safeRichTextLink('https://wiki.ria.red/'),true);
assert.ok(richTextProblems({paragraphs:[{runs:[{text:'bad',fontSize:1000}]}]}).length);
assert.equal(validateConfigPackage(original).valid,true);assert.equal(resolveGeometryProfile(migrated,{class:'FLR'},'Polygon')?.enabled,true);
const componentWorkflow=original.workflows.find(workflow=>workflow.mode==='composed')!;
const importedWorkflow=prepareWorkflowArtifactImport(migrated,buildWorkflowArtifact(original,componentWorkflow));
assert.ok(importedWorkflow.migration?.steps.includes('c17 → c18'));
for(const kind of ['node','classTree'] as const){
 const source=structuredClone(original),node=source.nodes.find(node=>node.path.class==='FLR'&&Object.values(node.path).filter(Boolean).length===1)!;
 if(node.fieldSettings?.search)node.fieldSettings.search.priority=123;
 const artifact=await createCategoryArtifact(source,node.nodeId,kind),incoming=prepareCategoryImport(migrated,artifact);
 assert.equal(incoming.config.contractRevision,18);assert.equal(incoming.config.revision,migrated.revision);
 assert.ok(incoming.migration?.steps.includes('c17 → c18'));
 if(node.fieldSettings?.search)assert.equal(resolveNodeFieldSettings(incoming.config,node.path).value.search?.priority,123);
}
console.log('c18 boundaries: four-level detach/reattach, independent extras, output isolation, audit publication binding, media policy, functional tables, rich text passed');

const quickFixture=structuredClone(migrated);
const quick=quickFixture.workflows.find(flow=>flow.quickMapping!==false&&!flow.editor?.dedicated&&flow.external?.purpose!=='edit')!;
quickFixture.application!.workflowAvailability={zth:[quick.id,'deleted'],eden:[quick.id]};
assert.deepEqual(pruneWorkflowAvailability(quickFixture).application!.workflowAvailability,{zth:[quick.id],eden:[quick.id]});
quick.quickMapping=false;
assert.deepEqual(pruneWorkflowAvailability(quickFixture).application!.workflowAvailability,{zth:[],eden:[]});

const rangeFlow=structuredClone(workflow);
rangeFlow.steps=[{id:'actor',kind:'actor',title:{zh:'人'},controls:[]},{id:'form',kind:'form',title:{zh:'表'},controls:[]},{id:'geometry',kind:'geometry',title:{zh:'图'},outputId:first.id,controls:[]}];
const rangePaths=[{class:'BUD',kind:'NOM'},{class:'PTA',kind:'AIR',skind:'NOM'}];
rangeFlow.outputs=[{...structuredClone(first),classification:rangePaths[0],geometry:{selected:'Polygon'},assignments:[],classificationGroup:{selectors:rangePaths.map((path,index)=>({id:'range-'+index,mode:'self',path}))}}];
rangeFlow.editor={enabled:true,range:{rows:rangePaths.map((path,index)=>({id:'edit-'+index,condition:'include',path}))}};
const plan=compileWorkflowEditPlan(rangeFlow,migrated);
const record={ID:'kept',Class:'PTA',Kind:'AIR',SKind:'NOM',World:'zth'};
const hydrated=hydrateWorkflowEdit(plan,record);
assert.equal(buildWorkflowEditRecord(plan,record,hydrated).ID,'kept');
assert.throws(()=>hydrateWorkflowEdit(plan,{...record,Class:'BUD',Kind:'SPE',SKind:undefined}),/不在/);

const auditDiff=editDiff({nodes:[{nodeId:'a',label:'old'},{nodeId:'b',label:'keep'}]},{nodes:[{nodeId:'a',label:'new'},{nodeId:'b',label:'keep'}]});
assert.deepEqual(auditDiff,[{path:'config/nodes/a/label',before:'old',after:'new'}]);
assert.deepEqual(editDiff([{id:'a'},{id:'b'}],[{id:'b'},{id:'a'}]).map(change=>change.path),['config/@order']);
