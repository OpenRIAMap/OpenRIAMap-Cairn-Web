import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import JSZip from 'jszip';
import {prepareConfigForActivation} from '../../src/configStudio/configActivation';
import {resolveGeometryProfile,validateConfigPackage,resolveEffectiveFields} from '../../src/configStudio/runtime';
import {resolveConfigRuntimeRule} from '../../src/components/Rules/configRuntime/configPackageAdapter';
import {FeatureStore} from '../../src/components/Rules/data/featureStore';
import {evaluateV3WorkflowOutputs} from '../../src/configStudio/V3WorkflowRunner';
import {isQuickMappingWorkflow,findEditingWorkflow} from '../../src/configStudio/workflowEditing';
import {testWorkflowEditConversion} from '../../src/configStudio/workflowEditCommit';
import {readConfigPackage} from '../../src/configStudio/package';
import {stableConfigText} from '../../src/configStudio/defaultConfigProvider';
import {buildV3CardSections} from '../../src/configStudio/V3CardRenderer';
import {resolveWorkflowFields} from '../../src/configStudio/fieldReuse';
import {buildWorkflowArtifact,prepareWorkflowArtifactImport} from '../../src/configStudio/workflowArtifact';
import {createCategoryArtifact,prepareCategoryImport} from '../../src/configStudio/categoryArtifact';
import {migrateConfigToR11} from '../../src/configStudio/r11Migration';
import {createEditableConfigPackageFromCurrentProject} from '../../src/configStudio/renderRuleTemplates';
import type {ConfigPackageV3} from '../../src/configStudio/types';

const sha=(v:string|Uint8Array)=>createHash('sha256').update(v).digest('hex'),base='src/configStudio/defaults',out='docs/90_roadmap-and-history/runtime-v32-postc-v11-20261015';
const bytes=fs.readFileSync(base+'/r11-r7.config.json'),config=JSON.parse(bytes.toString('utf8')) as ConfigPackageV3;
const oldBytes=fs.readFileSync(base+'/r10-r6.config.json'),old=JSON.parse(oldBytes.toString('utf8')) as ConfigPackageV3;
const manifest=JSON.parse(fs.readFileSync(base+'/manifest.json','utf8')),{parity:_,...content}=config;
assert.equal(sha(oldBytes),'e42b6047c8459ffd00bbe196cdc8194f220dfc65b2e0ce5963fde4e42b9ef292');
assert.equal(sha(bytes),manifest.sha256);assert.equal(sha(stableConfigText(content)),manifest.semanticFingerprint);
assert.equal(manifest.seedFile,'r11-r7.config.json');assert.equal(config.contractRevision,11);assert.equal(config.revision,7);
assert.equal(config.nodes.length,95);assert.equal(config.workflows.length,28);assert.equal(config.workflows.filter(isQuickMappingWorkflow).length,20);
assert.deepEqual(config.lookupTables!.map(t=>t.id),['teleport-hubs','road-travel-modes','standard-tag-fields']);
assert.equal(config.application!.sources.kind,'world-groups');
assert(validateConfigPackage(config).valid);assert(stableConfigText(migrateConfigToR11(config).config)===stableConfigText(config),'r11 migration idempotent');
assert(validateConfigPackage(migrateConfigToR11(createEditableConfigPackageFromCurrentProject()).config).valid,'fresh V1 regeneration must support the full r11 contract');
const active=prepareConfigForActivation(config),oldActive=prepareConfigForActivation(old);
const normalize=(value:unknown)=>JSON.stringify(value,(_key,row)=>typeof row==='function'?undefined:row);
let plans=0;
for(const node of config.nodes)for(const geometry of ['Point','LineString','Polygon'] as const){
 if(!resolveGeometryProfile(config,node.path,geometry)?.enabled)continue;
 for(const direction of ['0','1','3'])for(const Connect of [false,true])for(let zoom=0;zoom<=8;zoom++){
  const featureInfo={ID:'postc-comparison',World:'zth',Class:node.path.class,Kind:node.path.kind,SKind:node.path.skind,SKind2:node.path.skind2,Name:'比较',direction,Connect,bureau:'T',line:'1',color:'#ff0000'};
  const record:any={uid:'postc-comparison',featureInfo,type:geometry==='Point'?'Points':geometry==='LineString'?'Polyline':'Polygon',meta:{Class:node.path.class,idValue:'postc-comparison',sig:{},groups:{}},p3:{x:0,y:-64,z:0},coords3:[{x:0,y:-64,z:0},{x:100,y:-64,z:0},{x:100,y:-64,z:100},{x:0,y:-64,z:0}]};
  const ctx:any={worldId:'zth',zoomLevel:zoom,leafletZoom:zoom-3,inFloorView:false,activeBuildingUid:null,activeFloorSelector:null,activeBuildingFloorRefSet:null},store=new FeatureStore([record]);
  const before=resolveConfigRuntimeRule(oldActive,record,ctx,null,store),after=resolveConfigRuntimeRule(active,record,ctx,null,store);
  const label=`${node.nodeId}/${geometry}/${direction}/${Connect}/${zoom}`;
  assert(normalize(before)===normalize(after),'render plan changed: '+label);
  assert.equal(after?.symbol?.label?.textFrom?.(record),before?.symbol?.label?.textFrom?.(record),label);plans++;
 }
}
const fixtures=JSON.parse(fs.readFileSync('scripts/config-tools/fixtures/v1-workflow-output-parity.json','utf8')).cases;
for(const fixture of fixtures){
 const workflow=resolveWorkflowFields(config,config.workflows.find(w=>w.id===`v3-${fixture.schemaKey}`)!),output=workflow.outputs[0],slots:Record<string,unknown>={actor:'fixture-user'};
 for(const control of workflow.steps.flatMap(s=>s.controls??[]))if(control.slot){const key=control.id.slice(fixture.schemaKey.length+1,-control.slot.length-1);if(key in fixture.inputs)slots[control.slot]=fixture.inputs[key];}
 const data=fixture.geometry==='Point'?fixture.expectedRecord.CoordP:fixture.geometry==='LineString'?fixture.expectedRecord.CoordL[0]:fixture.expectedRecord.CoordG[0][0];
 const record=evaluateV3WorkflowOutputs(workflow,slots,{world:'zth',config,classifications:{[output.id]:fixture.classification},coordinates:{[output.id]:data.map(([x,y,z]:number[])=>({x,y,z}))},now:new Date('2026-10-07T00:00:00Z')})[0].record;
 assert(stableConfigText(record)===stableConfigText(fixture.expectedRecord),'final V1 record differs: '+fixture.schemaKey);
}
let edits=0;
for(const workflow of config.workflows){if(workflow.mode==='composed'&&workflow.editor?.enabled){testWorkflowEditConversion(config,workflow);edits++;}const artifact=buildWorkflowArtifact(config,workflow);assert.equal(prepareWorkflowArtifactImport(config,artifact).workflow.id,workflow.id);}
for(const code of ['RLE','STA','PLF','PFB','STB','SBP','STF','TRP'])assert(findEditingWorkflow(config,{Class:code})?.editor?.dedicated,code);
let categories=0;
for(const node of config.nodes.filter(n=>!n.path.kind)){const artifact=await createCategoryArtifact(config,node.nodeId,'classTree');assert(prepareCategoryImport(config,artifact).report.valid,'Class tree roundtrip '+node.path.class);categories++;}
const rle=resolveEffectiveFields(config,{class:'RLE'}).find(f=>f.key==='direction')!;assert.equal(rle.optionTable!.rows.length,8);
const en=structuredClone(config);en.application!.preferences.language='en';const cardNode=en.nodes.find(n=>n.path.class==='WRP'&&!n.path.kind)!;cardNode.card={mode:'fields',items:[{id:'empty-en',source:'Name',renderer:'text',visible:true,label:{zh:'中文名称',en:''}}]};
assert.equal(buildV3CardSections(en,{featureInfo:{Class:'WRP',Name:'Value'},meta:{Class:'WRP'}} as any)?.mainRows[0].label,'Name');
const delivery=JSON.parse(fs.readFileSync(out+'/delivery-manifest.json','utf8')),zipBytes=fs.readFileSync(out+'/OpenRIAMap_V32_PostC_v1_1_r7.zip');assert.equal(sha(zipBytes),delivery.zipSha256);
assert(stableConfigText(await readConfigPackage(new File([zipBytes],'r11.zip')))===stableConfigText(config),'delivery ZIP differs');
const archive=await JSZip.loadAsync(zipBytes),deps=JSON.parse(await archive.file('reports/application-dependencies.json')!.async('text'));assert.equal(deps.authProvider,'github-cookie');assert.equal(deps.lookupTables.length,3);
console.log(`r11-final-package: SHA/default and frozen r10, ${plans} unchanged render plans, ${fixtures.length} complete V1 records, ${edits} actual edit conversions, 28 workflow/${categories} Class-tree roundtrips, English fallback and complete ZIP dependencies passed`);
