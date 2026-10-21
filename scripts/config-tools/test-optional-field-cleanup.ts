import assert from 'node:assert/strict';
import fs from 'node:fs';
import {migrateConfigToR12} from '../../src/configStudio/r12Migration';
import {migrateConfigToR13} from '../../src/configStudio/r13Migration';
import {evaluateV3WorkflowOutputs,validateV3WorkflowInputs} from '../../src/configStudio/workflowKernel';
import {prepareNativeWorkflowCommit} from '../../src/configStudio/nativeWorkflowCommit';
import {prepareNativeFeatureImport} from '../../src/configStudio/nativeFeatureImport';
import {prepareDownstreamNativeImport} from '../../src/components/Mapping/Workflow/downstreamNativeImport';
import {compileWorkflowEditPlan,hydrateWorkflowEdit} from '../../src/configStudio/workflowEditing';
import {prepareNativeWorkflowEdit} from '../../src/configStudio/workflowEditCommit';
import {omitOptionalFieldValues} from '../../src/configStudio/optionalFieldValues';
import {readMultipartGeometry} from '../../src/core/geometry/multipartGeometry';
import {resolveEffectiveFields} from '../../src/configStudio/runtime';
import {createTrpExternalEditSession,prepareTrpExternalEdit} from '../../src/configStudio/trpExternalEditing';
import {storedOptionValue} from '../../src/configStudio/fieldReuse';
import type {ConfigPackageV3} from '../../src/configStudio/types';

const old=JSON.parse(fs.readFileSync('src/configStudio/defaults/r11-r7.config.json','utf8')) as ConfigPackageV3;
const roadFixture=JSON.parse(fs.readFileSync('scripts/config-tools/fixtures/v1-workflow-output-parity.json','utf8')).cases.find((item:any)=>item.schemaKey==='rod_road');
const railFixtures=JSON.parse(fs.readFileSync('scripts/config-tools/fixtures/v1-rail-editing-reference.json','utf8')).cases;
const trpFixture=JSON.parse(fs.readFileSync('scripts/config-tools/fixtures/v1-trp-editing-reference.json','utf8')).cases[0];
const blanks=[undefined,null,'',' ','\t','\r\n','\u3000',' \u3000\t\r\n ','\u00a0'];
let checked=0;
for(const config of [migrateConfigToR12(old).config,migrateConfigToR13(old).config]){
  const workflow=config.workflows.find(item=>item.id==='v3-rod_road')!,outputId=workflow.outputs[0].id;
  const road={...structuredClone(roadFixture.expectedRecord),opaque:{zero:0,no:false,nothing:null,text:'   ',list:[]}};
  const classification=roadFixture.classification,geometry=readMultipartGeometry(road,'LineString').geometry!;
  const slots={actor:'cleanup-test',A:'Road',F:0,G:false,H:true,I:false,J:false,N:'',O:'Audit',P:[],Q:[],R:[],'rod_road-classification':JSON.stringify(classification)};
  const options={config,world:'zth',classifications:{[outputId]:classification},coordinates:{[outputId]:geometry}};
  const edit=(original:Record<string,unknown>,value:unknown,changed=true)=>{
    const plan=compileWorkflowEditPlan(workflow,config),draft=hydrateWorkflowEdit(plan,original);
    if(changed)draft.slots.K=value;
    return prepareNativeWorkflowEdit(config,workflow,original,draft,geometry,'zth','cleanup-test',[]);
  };
  for(const blank of blanks){
    const values={...slots,K:blank,B:blank};
    assert.deepEqual(validateV3WorkflowInputs(workflow,values,workflow.steps,config),[]);
    const outputs=evaluateV3WorkflowOutputs(workflow,values,options),created=prepareNativeWorkflowCommit(config,workflow,outputs,'zth')[0].record;
    assert(!Object.hasOwn(created,'Speed'));assert(!Object.hasOwn(created.tags??{},'nomenclator'));
    assert.equal(created.Level,0);assert.equal(created.Oneway,false);
    const input={...structuredClone(road),Speed:blank,tags:{...road.tags,nomenclator:blank}},snapshot=structuredClone(input);
    const imported=prepareNativeFeatureImport(config,input,'zth').record;
    assert(!Object.hasOwn(imported,'Speed'));assert(!Object.hasOwn(imported.tags??{},'nomenclator'));
    assert.deepEqual(imported.opaque,road.opaque);assert.equal(imported.CreateBy,road.CreateBy);assert.deepEqual(input,snapshot);
    assert(!Object.hasOwn(prepareNativeFeatureImport(config,JSON.parse(JSON.stringify(imported)),'zth').record,'Speed'));
    const existing=edit(input,undefined,false);assert(!Object.hasOwn(existing,'Speed'));
    const cleared=edit({...road,Speed:4.5},blank);assert(!Object.hasOwn(cleared,'Speed'));
    assert.equal(cleared.CreateTime,road.CreateTime);assert.equal(cleared.CreateBy,road.CreateBy);assert.deepEqual(cleared.opaque,road.opaque);
    const directOutputs=[{outputId,classification,geometry:'LineString',record:input}];
    assert(!Object.hasOwn(prepareNativeWorkflowCommit(config,workflow,directOutputs,'zth')[0].record,'Speed'));
    assert.deepEqual(input,snapshot,'commit must not mutate its incoming record');
    assert.throws(()=>prepareNativeFeatureImport(config,{...road,Name:blank},'zth'),/Name|必填/);
    const requiredSlots={...slots,F:blank};assert(validateV3WorkflowInputs(workflow,requiredSlots,workflow.steps,config).some(issue=>issue.controlId==='rod_road-Level-F'));
    const missingRequired=evaluateV3WorkflowOutputs(workflow,requiredSlots,options);
    assert.throws(()=>prepareNativeWorkflowCommit(config,workflow,missingRequired,'zth'),/Level|必填/,'blank required numbers must not become 0');
    checked++;
  }
  for(const value of [0,-1,4.5,false,'abc','Infinity','4 5','  useful text  ']){
    const cleaned=omitOptionalFieldValues(config,classification,{...road,Speed:value});
    assert.deepEqual(cleaned.Speed,value,'nonblank content is never silently deleted');checked++;
  }
  for(const value of ['abc','Infinity','4 5'])assert.throws(()=>prepareNativeFeatureImport(config,{...road,Speed:value},'zth'),/Speed/);
  assert.equal(prepareNativeFeatureImport(config,{...road,Speed:0},'zth').record.Speed,0);
  const typedSelect=structuredClone(workflow),select=typedSelect.steps.flatMap(step=>step.controls??[]).find(control=>control.slot==='K')!;
  select.kind='select';select.optionValueType='number';select.options=[{value:'0',label:{zh:'零',en:''}},{value:'1',label:{zh:'一',en:''}}];
  for(const blank of blanks){
    assert.equal(storedOptionValue(blank,'number'),blank);
    const outputs=evaluateV3WorkflowOutputs(typedSelect,{...slots,K:blank},options);
    assert(!Object.hasOwn(prepareNativeWorkflowCommit(config,typedSelect,outputs,'zth')[0].record,'Speed'),'blank enum selection must not become numeric 0');
  }
  select.required=true;
  assert(validateV3WorkflowInputs(typedSelect,{...slots,K:'\u3000'},typedSelect.steps,config).some(issue=>issue.controlId===select.id));
  assert.equal(storedOptionValue('0','number'),0);assert.equal(storedOptionValue('false','boolean'),false);checked++;
  const textWorkflow=config.workflows.find(item=>item.id==='v3-editor-rle')!,rail=railFixtures.find((item:any)=>item.classCode==='RLE').original;
  const textPlan=compileWorkflowEditPlan(textWorkflow,config),textDraft=hydrateWorkflowEdit(textPlan,rail);
  textDraft.slots[textPlan.bindings.find(binding=>binding.target==='bureau')!.slot]=' \u3000\t ';
  const changedText=prepareNativeWorkflowEdit(config,textWorkflow,rail,textDraft,readMultipartGeometry(rail,'LineString').geometry!,'zth','cleanup-test',[]);
  assert(!Object.hasOwn(changedText,'bureau'));checked++;
  // Structured JSON and pre-r13 group controls agree about optional subfields.
  const platform=structuredClone(railFixtures.find((item:any)=>item.classCode==='PLF').original);
  platform.lines[0].stationCode='\u3000';platform.lines[0].stationDistance='\t';platform.lines[0].Avaliable=false;
  const nested=prepareNativeFeatureImport(config,platform,'zth').record.lines as Record<string,unknown>[];
  assert(!Object.hasOwn(nested[0],'stationCode'));assert(!Object.hasOwn(nested[0],'stationDistance'));
  assert.equal(nested[0].Avaliable,false);assert.equal(nested[0].ID,platform.lines[0].ID);
  const strictGroup=omitOptionalFieldValues(config,classification,{...road,ConnectL:[{mode:'endpoint',tgt:'   '}]});
  assert.equal((strictGroup.ConnectL as any[])[0].tgt,'   ','required nested fields are not erased');
  assert(validateV3WorkflowInputs(workflow,{...slots,P:[{mode:'endpoint',tgt:'   '}]},workflow.steps,config).length);
  const scalar=omitOptionalFieldValues(config,classification,{...road,Blacklist:['','   ']});assert.deepEqual(scalar.Blacklist,['','   '],'array positions are never filtered');checked++;
  // Explicit preserve and unknown properties retain their existing semantics.
  const preserve=structuredClone(config),field=preserve.nodes.find(node=>node.path.class==='ROD'&&!node.path.kind)!.fields.find(field=>field.key==='Speed')!;
  field.emptyValue='preserve';
  for(const blank of blanks.slice(1))assert.equal(omitOptionalFieldValues(preserve,classification,{...road,Speed:blank}).Speed,blank);
  const custom={...road,unknownBlank:'\t',unknownNull:null};assert.deepEqual(omitOptionalFieldValues(config,classification,custom),custom);
  const nestedPreserve=structuredClone(config),nestedRoot=nestedPreserve.nodes.find(node=>node.path.class==='ROD'&&!node.path.kind)!;
  const template=resolveEffectiveFields(config,classification).find(field=>field.key==='Name')!;
  nestedRoot.fields.push({...structuredClone(template),fieldId:'cleanup-object',key:'customObject',type:'json',required:false,valueSchema:{type:'object',properties:{kept:{type:'string'},removed:{type:'string'}}}},
    {...structuredClone(template),fieldId:'cleanup-preserve',key:'customObject.kept',required:false,emptyValue:'preserve'});
  assert.deepEqual(omitOptionalFieldValues(nestedPreserve,classification,{...road,customObject:{kept:'\t',removed:'\t',toString:'\t',constructor:null}}).customObject,{kept:'\t',toString:'\t',constructor:null});
  const strict=structuredClone(config),speed=strict.nodes.find(node=>node.path.class==='ROD'&&!node.path.kind)!.fields.find(field=>field.key==='Speed')!;
  speed.requiredWhen=[{kind:'fieldEquals',field:'Oneway',value:'true'}];
  assert.throws(()=>prepareNativeFeatureImport(strict,{...road,Oneway:true,Speed:'\u3000'},'zth'),/Speed|必填/);
  assert(!Object.hasOwn(prepareNativeFeatureImport(strict,{...road,Oneway:false,Speed:'\u3000'},'zth').record,'Speed'));
  const conditional=structuredClone(config),root=conditional.nodes.find(node=>node.path.class==='ROD'&&!node.path.kind)!;
  root.fields.push({...structuredClone(resolveEffectiveFields(config,classification).find(field=>field.key==='Name')!),fieldId:'blank-driver',key:'blankDriver',required:false});
  root.fields.find(field=>field.key==='Speed')!.requiredWhen=[{kind:'fieldEquals',field:'blankDriver',value:' '}];
  assert.throws(()=>prepareNativeFeatureImport(conditional,{...road,blankDriver:' ',Speed:null},'zth'),/Speed|必填/,'cleanup cannot switch off an active required condition');checked++;
  // Registered external editor uses the same write boundary.
  const trpWorkflow=config.workflows.find(item=>item.external?.purpose==='edit'&&item.external.componentKey==='tradePointEditor')!;
  const trpSession=createTrpExternalEditSession(config,trpWorkflow,trpFixture.original);trpSession.values.elevation=' \u3000\t ';
  const trp=prepareTrpExternalEdit(config,trpWorkflow,trpSession,trpSession.originalGeometry,'zth','cleanup-test',[]);
  assert(!Object.hasOwn(trp,'elevation'));assert.equal(trp.CreateBy,trpFixture.original.CreateBy);checked++;
}
// Historical compatibility still requires an exact, trusted published record.
const historical=JSON.parse(fs.readFileSync('scripts/config-tools/fixtures/sync01-published-record-compatibility.json','utf8')).records[0];
const trusted={...historical,elevation:'\u3000'};
const historicalConfig=migrateConfigToR13(old).config;
const downstream=prepareDownstreamNativeImport(historicalConfig,trusted,'zth',[trusted]);
if(resolveEffectiveFields(historicalConfig,{class:trusted.Class}).some(field=>field.key==='elevation'&&!field.required))assert(!Object.hasOwn(downstream.record,'elevation'));
assert.throws(()=>prepareDownstreamNativeImport(historicalConfig,{...trusted,Name:'untrusted edit'},'zth',[trusted]));
console.log(`optional-field-cleanup: ${checked} scenario groups across r12/r13; workflow create/commit, imports, trusted history, native/external edit, structured groups, strict required conditions, preserve/0/false/unknown data and JSON roundtrip: OK`);
