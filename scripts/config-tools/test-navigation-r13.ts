import assert from 'node:assert/strict';
import fs from 'node:fs';
import { migrateConfigToR13 } from '../../src/configStudio/r13Migration';
import { validateConfigPackage } from '../../src/configStudio/runtime';
import { validateStudioModule } from '../../src/configStudio/studioModuleValidation';
import { prepareConfigForActivation } from '../../src/configStudio/configActivation';
import { validateStructuredValue, valueSchemaTemplate } from '../../src/configStudio/valueSchema';
import { tableReferences, renameLookupTable } from '../../src/configStudio/lookupTables';
import { prepareLookupTableCommit } from '../../src/configStudio/lookupTableTransaction';
import { setRuntimeConfiguration } from '../../src/configRuntime/runtimeDataView';
import { applyApplicationSettings } from '../../src/core/project/applicationRuntime';
import { captureNavigationContext, roadTravelProfiles } from '../../src/core/project/navigationRuntime';
import { listHubReturnPoints } from '../../src/components/Navigation/teleportHubReturnPoints';
import { createCategoryArtifact, categoryArtifactBlob, readCategoryArtifact, prepareCategoryImport } from '../../src/configStudio/categoryArtifact';
import { buildWorkflowArtifact, prepareWorkflowArtifactImport } from '../../src/configStudio/workflowArtifact';
import { validateWorkflowWrites } from '../../src/configStudio/workflowPreflight';
import { validateNavigationRecords } from '../../src/configStudio/navigationValidation';
import type {ConfigPackageV3} from '../../src/configStudio/types';

// Immutable historical fixture: capabilities do not depend on current.json IDs.
const old=JSON.parse(fs.readFileSync('src/configStudio/defaults/r11-r7.config.json','utf8')) as ConfigPackageV3;
const oldText=JSON.stringify(old),{config,unresolved}=migrateConfigToR13(old);
const report=validateConfigPackage(config);
assert(report.valid,JSON.stringify(report.issues.filter(i=>i.severity==='error'),null,2));
assert.deepEqual(unresolved,[]);assert.equal(JSON.stringify(old),oldText);
assert.equal(config.contractRevision,13);assert.equal(config.application!.preferences.navigation,undefined);
assert.deepEqual(config.application!.navigation!.rail.parameters,old.application!.preferences.navigation);
assert.deepEqual(migrateConfigToR13(config).config,config);
assert.equal(prepareConfigForActivation(config).contractRevision,13);
const invalid=(name:string,mutate:(value:ConfigPackageV3)=>void,region?:string)=>{
  const value=structuredClone(config);mutate(value);const result=region?validateStudioModule(value,[],[region]):validateConfigPackage(value);assert(!result.valid,`${name} must block`);return result;
};
invalid('outside shared role',c=>c.application!.navigation!.rail.selectors.lines=[{class:'ROD'}],'application/navigation');
invalid('shared removal checks dependents',c=>c.application!.preferences.railwayRoles!.selectors.lines=[],'application/preferences');
invalid('missing class',c=>c.application!.preferences.railwayRoles!.selectors.lines=[{class:'MISSING'}]);
invalid('non-continuous path',c=>c.application!.navigation!.rail.selectors.lines=[{class:'RLE',skind:'NOM'}]);
invalid('role overlap',c=>c.application!.preferences.railwayRoles!.selectors.platforms=[{class:'RLE'}]);
invalid('missing complex schema',c=>delete c.nodes.find(n=>n.path.class==='PLF')!.fields.find(f=>f.key==='lines')!.valueSchema,'nodes/'+config.nodes.find(n=>n.path.class==='PLF')!.nodeId);
invalid('wrong nested schema',c=>c.nodes.find(n=>n.path.class==='PLF')!.fields.find(f=>f.key==='lines')!.valueSchema={type:'string'});
invalid('field type conflicts',c=>c.nodes.find(n=>n.path.class==='STA')!.fields.find(f=>f.key==='platforms')!.type='string');
invalid('missing table',c=>c.lookupTables=c.lookupTables!.filter(t=>t.id!=='road-travel-modes'),'lookupTables');
invalid('wrong functional kind',c=>c.lookupTables!.find(t=>t.id==='road-travel-modes')!.functionKind='none','lookupTables');
invalid('old and new parameter conflict',c=>c.application!.preferences.navigation=old.application!.preferences.navigation);
invalid('unknown schema attribute',c=>(c.application!.navigation as any).customScript='run');
for(const number of [0,-1,NaN,Infinity,'4' as any])invalid('illegal common speed',c=>c.application!.navigation!.common.walkSpeed=number);
const zero=structuredClone(config);zero.application!.navigation!.rail.parameters.normalPlatformTransferCost=0;assert(validateConfigPackage(zero).valid);
assert.deepEqual(validateStructuredValue([{ID:'line',getin:true}],valueSchemaTemplate('rail-lines')),[]);
assert(validateStructuredValue([{ID:'line',getin:'yes'}],valueSchemaTemplate('rail-lines')).length);
assert(validateStructuredValue({ID:'line'},valueSchemaTemplate('rail-lines')).length);
assert(validateStructuredValue({x:0,z:Infinity},valueSchemaTemplate('target-point')).length);
const custom=structuredClone(config);const source=custom.lookupTables!.find(t=>t.id==='road-travel-modes')!;custom.lookupTables!.push({...structuredClone(source),id:'custom-modes'});custom.application!.navigation!.road.travelModesTableId='custom-modes';
assert(tableReferences(custom,'custom-modes').some(r=>r.includes('道路')));
const renamed=renameLookupTable(custom,'custom-modes','renamed-modes');
assert.equal(renamed.application!.navigation!.road.travelModesTableId,'renamed-modes');
assert.equal(prepareLookupTableCommit(custom,{baseline:custom,value:renamed}).application!.navigation!.road.travelModesTableId,'renamed-modes');
assert(validateConfigPackage(renamed).valid);
setRuntimeConfiguration(config);applyApplicationSettings(config.application);
const before=captureNavigationContext();assert.equal(roadTravelProfiles(before)[0].code,'WALK');assert.equal(listHubReturnPoints('zth',before).length,4);assert.equal(listHubReturnPoints('eden',before).length,0);
const stopped=structuredClone(config);stopped.application!.navigation!.rail.enabled=false;stopped.application!.navigation!.rail.selectors.lines=[];setRuntimeConfiguration(stopped);applyApplicationSettings(stopped.application);
const after=captureNavigationContext();assert.equal(before.sharedSignature,after.sharedSignature);assert.notEqual(before.signature,after.signature);assert.equal(before.settings.rail.selectors.lines.length,1);
setRuntimeConfiguration(config);applyApplicationSettings(config.application);
console.log('r13 navigation: migration, roles/scopes, isolated dependency guards, structured values, function-table references and shared-cache independence passed.');

const workflow=structuredClone(config.workflows[0]);
workflow.steps=[{id:'group',kind:'form',label:{zh:'结构测试',en:''},controls:[{id:'entries',kind:'group',slot:'ROWS',label:{zh:'线路',en:''},group:{storage:'object',minItems:0,itemFields:[{id:'id',key:'ID',kind:'text',label:{zh:'ID',en:''}},{id:'in',key:'getin',kind:'toggle',label:{zh:'上车',en:''}}]}}]}] as any;
workflow.outputs=[{id:'out',classification:{class:'PLF'},geometry:{selected:'Point'},assignments:[{id:'links',target:'lines',expression:'ROWS'}]}];
const f=config.nodes.find(n=>n.path.class==='PLF')!.fields;
assert(!validateWorkflowWrites(workflow,()=>f).some(i=>i.code==='workflow-value-schema-conflict'));
workflow.steps[0].controls![0].group!.itemFields[1].kind='text';
assert(validateWorkflowWrites(workflow,()=>f).some(i=>i.code==='workflow-value-schema-conflict'));
const records=JSON.parse(fs.readFileSync('scripts/config-tools/fixtures/navigation-r13-records.json','utf8')).filter((r:any)=>r.Class!=='XRL');
for(const r of records)if(r.lines)r.lines=r.lines.filter((v:any)=>v.ID!=='line-extra');
assert(!validateNavigationRecords(config,records).some(i=>i.severity==='error'));
const bad=structuredClone(records);bad.find((r:any)=>r.Class==='TPP').TGTWarp='missing';assert(validateNavigationRecords(config,bad).some(i=>i.message.includes('传送目标无法解析')));
const broken=structuredClone(records);broken.find((r:any)=>r.Class==='STA').STBuilding='missing';assert(validateNavigationRecords(config,broken).some(i=>i.severity==='error'));
const duplicate=structuredClone(records);duplicate.push(structuredClone(duplicate.find((r:any)=>r.Class==='WRP')));assert(validateNavigationRecords(config,duplicate).some(i=>i.message.includes('重复')));
const renamedConfig=structuredClone(config);renamedConfig.application!.navigation!.rail.name.zh='新名称';setRuntimeConfiguration(config);applyApplicationSettings(config.application);const graphBefore=captureNavigationContext().graphSignature;setRuntimeConfiguration(renamedConfig);applyApplicationSettings(renamedConfig.application);assert.equal(captureNavigationContext().graphSignature,graphBefore);
console.log('r13 navigation: workflow nested type contracts, target integrity, duplicate keys, and display-name graph independence passed.');

const classId=config.nodes.find(n=>n.path.class==='PLF')!.nodeId;
for(const zipped of [false,true]){const a=await createCategoryArtifact(config,classId,'classTree'),blob=await categoryArtifactBlob(a,zipped),parsed=await readCategoryArtifact(new File([blob],zipped?'plf.zip':'plf.json'));assert.equal(parsed.payload.contractRevision,13);assert(prepareCategoryImport(config,parsed).report.valid);}
const artifact=buildWorkflowArtifact(config,config.workflows.find(w=>w.mode==='composed')!);assert.equal(artifact.contractRevision,13);assert.equal(prepareWorkflowArtifactImport(config,artifact).workflow.id,artifact.workflow.id);
console.log('r13 classification JSON/ZIP and workflow artifact roundtrips passed.');

const disabled=structuredClone(config);disabled.application!.navigation!.road.enabled=false;disabled.application!.navigation!.road.travelModesTableId='';disabled.application!.navigation!.teleport.enabled=false;disabled.application!.navigation!.teleport.hubTableId='';assert(validateConfigPackage(disabled).valid);setRuntimeConfiguration(disabled);applyApplicationSettings(disabled.application);assert.deepEqual(roadTravelProfiles(),[]);assert.deepEqual(listHubReturnPoints('zth'),[]);
console.log('disabled modules may leave bindings empty without breaking navigation panel helpers.');

const aliasWorld=structuredClone(config);for(const row of aliasWorld.lookupTables!.find(t=>t.id==='teleport-hubs')!.rows)(row.functionValue as any).world='0';assert(validateConfigPackage(aliasWorld).valid);setRuntimeConfiguration(aliasWorld);applyApplicationSettings(aliasWorld.application);assert.equal(listHubReturnPoints('zth').length,4);
console.log('hub world identities resolve numeric aliases without mixing worlds.');

const badMode=structuredClone(records);badMode.find((r:any)=>r.Class==='ROD').Mode=[{code:'UNKNOWN'}];assert(!validateStudioModule(config,badMode,['lookupTables']).valid,'mounted code-domain conflict must block the table region too');
console.log('mounted navigation code conflicts participate in isolated table validation.');
