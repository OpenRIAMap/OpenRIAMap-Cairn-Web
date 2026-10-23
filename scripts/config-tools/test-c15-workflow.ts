import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gzipSync,gunzipSync} from 'node:zlib';
import {migratePackageToC15,migrateContract} from '../../src/configStudio/contractMigration';
import {validateConfigPackage,validateWorkflowDefinition,classificationPathKey} from '../../src/configStudio/runtime';
import {createCategoryArtifact,prepareCategoryImport} from '../../src/configStudio/categoryArtifact';
import {buildWorkflowArtifact,prepareWorkflowArtifactImport} from '../../src/configStudio/workflowArtifact';
import {workflowClassificationGroup,workflowOutputFields} from '../../src/configStudio/workflowClassificationGroup';
import {evaluateV3WorkflowOutputs,validateV3WorkflowRecords,workflowOutputSystem} from '../../src/configStudio/workflowKernel';
import {prepareNativeFeatureImport} from '../../src/configStudio/nativeFeatureImport';
import {compileWorkflowEditPlan,hydrateWorkflowEdit,findEditingWorkflow} from '../../src/configStudio/workflowEditing';
import {syncWorkflowClassification} from '../../src/configStudio/systemClassification';
import {editableGeometryProfile} from '../../src/configStudio/renderRuleTemplates';
import {validateIncomingRecord,validateConfiguration} from '../../vendor/configuration-r11/r11-validation.mjs';
import type {CategoryNode,ConfigPackageV3,WorkflowDefinition,FieldDefinition} from '../../src/configStudio/types';
const source=JSON.parse(gunzipSync(fs.readFileSync('scripts/config-tools/fixtures/c13-baseline.config.json.gz')).toString('utf8')) as ConfigPackageV3;
const original=JSON.stringify(source),config=migratePackageToC15(source).config;
assert.equal(config.contractRevision,15);assert(validateConfigPackage(config).valid);assert.equal(JSON.stringify(source),original);
let nodes=0,trees=0,workflows=0;
if(!process.argv.includes('--kernel-only'))for(const node of source.nodes){for(const kind of node.path.kind?['node'] as const:['node','classTree'] as const){const artifact=await createCategoryArtifact(source,node.nodeId,kind),bytes=JSON.stringify(artifact),imported=prepareCategoryImport(config,artifact);assert.equal(JSON.stringify(artifact),bytes);assert(imported.report.valid,node.nodeId+JSON.stringify(imported.report.issues));assert.equal(imported.config.contractRevision,15);for(const child of imported.config.nodes.filter(item=>kind==='node'?item.nodeId===node.nodeId:item.path.class===node.path.class))assert.deepEqual(child.geometryProfiles,config.nodes.find(row=>row.nodeId===child.nodeId)!.geometryProfiles);if(kind==='node')nodes++;else trees++;}}
if(!process.argv.includes('--kernel-only'))for(const workflow of source.workflows){const artifact=buildWorkflowArtifact(source,workflow),before=JSON.stringify(artifact),imported=prepareWorkflowArtifactImport(config,artifact);assert.equal(JSON.stringify(artifact),before);assert.deepEqual(imported.workflow,config.workflows.find(row=>row.id===workflow.id));workflows++;}
const working=structuredClone(config);working.workflows=[];
const node=(id:string,path:CategoryNode['path'],type:'Point'|'Polygon',fields:FieldDefinition[]=[]):CategoryNode=>({nodeId:id,path,geometryType:type,geometryProfiles:{[type]:editableGeometryProfile(type,15)},fields,children:[]});
const field=(key:string,type:'string'|'number'):FieldDefinition=>({fieldId:'test-'+key,key,labels:{zh:key,en:''},description:{zh:'',en:''},type,cardinality:'single',input:'text'});
working.nodes.push(node('c15-parent',{class:'C15TEST'},'Point',[field('alpha','string')]),node('c15-child',{class:'C15TEST',kind:'CHILD'},'Point',[field('beta','number')]),node('c15-area',{class:'C15AREA'},'Polygon'));
const output={id:'out',classificationGroup:{selectors:[{id:'parent',mode:'self' as const,path:{class:'C15TEST'}},{id:'children',mode:'leafDescendants' as const,path:{class:'C15TEST'}}]},geometry:{selected:'Point' as const},assignments:[{id:'id',target:'ID',expression:'"C15_record"'},{id:'alpha',target:'alpha',expression:'"valid"',when:{token:'Kind',operator:'empty' as const}},{id:'beta',target:'beta',expression:'42',when:{token:'Kind',operator:'equals' as const,value:'CHILD'}}]};
let workflow:WorkflowDefinition={id:'c15-test',label:{zh:'分类组回归',en:''},mode:'composed',actor:{required:false},steps:[{id:'actor',kind:'actor',label:{zh:'填写人',en:''}},{id:'form',kind:'form',label:{zh:'基本信息',en:''},controls:[{id:'tags',kind:'tagsExtensions',columns:1,label:{zh:'标签与扩展',en:''},systemManaged:true,tagsExtensions:{tagsEnabled:true,extensionsEnabled:true}}]},{id:'geometry',kind:'geometry',label:{zh:'绘制',en:''},outputId:'out',geometry:['Point'],drawing:{returnFormat:'coordP',captureSlot:'MAIN'}}],outputs:[output]};
workflow=syncWorkflowClassification(working,workflow);assert.equal(workflow.steps[1].controls?.filter(c=>c.kind==='classificationPicker').length,1);
assert.deepEqual(workflowClassificationGroup(working,output).paths,[{class:'C15TEST'},{class:'C15TEST',kind:'CHILD'}]);
assert(!workflowOutputFields(working,output).some(field=>field.key==='beta'));
const report=validateWorkflowDefinition(workflow,working);assert(report.valid,JSON.stringify(report.issues));
for(const path of [{class:'C15TEST'},{class:'C15TEST',kind:'CHILD'}]){
 const outputs=evaluateV3WorkflowOutputs(workflow,{}, {config:working,world:'zth',classifications:{out:path},coordinates:{out:{type:'Point',parts:[{x:1,y:2,z:3}]}}});
 assert.equal(outputs.length,1);assert.equal(outputs[0].record.Kind,path.kind);assert.equal(validateV3WorkflowRecords(working,workflow,outputs).length,0);
 assert.equal(workflowOutputSystem(workflow,{}, {config:working,classifications:{out:path}},'out').Kind_1,path.kind??'');
 const imported=prepareNativeFeatureImport(working,outputs[0].record,'zth');assert.equal(imported.record.Class,'C15TEST');assert.deepEqual(validateIncomingRecord(working,imported.record),[]);
 const bad={...imported.record,Type:'Polygon'};assert.throws(()=>prepareNativeFeatureImport(working,bad,'zth'));assert(validateIncomingRecord(working,bad).length>0);
}
assert.throws(()=>evaluateV3WorkflowOutputs(workflow,{}, {config:working,classifications:{out:{class:'C15AREA'}}}),/分类|几何/);
const removed={...working,nodes:working.nodes.filter(node=>node.nodeId!=='c15-child')};assert.equal(workflowClassificationGroup(removed,output).paths.length,1);assert.throws(()=>evaluateV3WorkflowOutputs(workflow,{}, {config:removed,classifications:{out:{class:'C15TEST',kind:'CHILD'}}}),/分类|几何/);
const editor={...workflow,editor:{enabled:true},outputs:[{...output,assignments:[{id:'id',target:'ID',expression:'ID'}]}]};const plan=compileWorkflowEditPlan(editor,working);assert.equal(plan.classifications.length,2);assert.equal(hydrateWorkflowEdit(plan,{ID:'old',Class:'C15TEST'}).classification.class,'C15TEST');assert.equal(findEditingWorkflow({...working,workflows:[editor]}, {Class:'C15TEST'})?.id,editor.id);
const multi={...workflow,outputs:[output,{...output,id:'second',assignments:[{id:'id2',target:'ID',expression:'ID_1+"_next"'}]}],steps:[...workflow.steps,{id:'geometry2',kind:'geometry' as const,label:{zh:'第二绘制',en:''},outputId:'second',geometry:['Point' as const]}]};const multiFlow=syncWorkflowClassification(working,multi);assert(validateWorkflowDefinition(multiFlow,working).valid);const results=evaluateV3WorkflowOutputs(multiFlow,{}, {config:working,classifications:{out:{class:'C15TEST'},second:{class:'C15TEST',kind:'CHILD'}}});assert.equal(results[1].record.ID,'C15_record_next');
const invalid=structuredClone(config),profile=invalid.nodes.flatMap(node=>Object.values(node.geometryProfiles)).find(profile=>profile?.zoomPriority.rules.length)!;delete profile.zoomPriority.rules[0].multipartAnchor;assert(!validateConfiguration(invalid).valid);assert(!validateConfigPackage(invalid).valid);
assert.throws(()=>migrateContract({...buildWorkflowArtifact(source,source.workflows.find(flow=>flow.mode==='composed')!)},15,'workflow'),/上下文/);
if(process.env.CAIRNMAP_C15_FIXTURE_OUT)fs.writeFileSync(process.env.CAIRNMAP_C15_FIXTURE_OUT,gzipSync(JSON.stringify(config),{level:9}));
console.log(JSON.stringify({contract:'c15',nodes,trees,workflows,cases:['all c13 component imports match full chain','candidate guards and shared fields','exact parent capture/import/server/editing','selection invalidation','multi-output identity dependencies','same-origin Node parity','strict schema and missing context']}));
