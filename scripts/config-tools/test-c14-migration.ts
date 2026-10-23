import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {CONTRACT_CAPABILITIES,formatContractRevision,formatConfigRevision} from '../../src/configStudio/contract';
import {MIGRATION_STEPS,migratePackageToC14,migrateContract,migrationChain,addC14ProfileDefaults,type MigrationStep} from '../../src/configStudio/contractMigration';
import {validateConfigPackage} from '../../src/configStudio/runtime';
import {validateNativeStructure} from '../../src/configStudio/nativeContractValidation';
import {createCategoryArtifact,prepareCategoryImport,categoryArtifactBlob,readCategoryArtifact} from '../../src/configStudio/categoryArtifact';
import {buildWorkflowArtifact,prepareWorkflowArtifactImport} from '../../src/configStudio/workflowArtifact';
import {migrateConfigToR9} from '../../src/configStudio/r9Migration';
import {migrateConfigToR10} from '../../src/configStudio/r10Migration';
import type {ConfigPackageV3} from '../../src/configStudio/types';
import {editableGeometryProfile} from '../../src/configStudio/renderRuleTemplates';
import {initializeCategory,type CategoryInitialization} from '../../src/configStudio/categoryInitialization';
const source=JSON.parse(gunzipSync(fs.readFileSync('scripts/config-tools/fixtures/c13-baseline.config.json.gz')).toString('utf8')) as ConfigPackageV3;
assert.equal(source.contractRevision,13,'The production c13 fixture must not be silently replaced');
const original=JSON.stringify(source),result=migratePackageToC14(source),config=result.config;
assert.equal(config.contractRevision,14);assert.equal(config.revision,source.revision);
assert.equal(JSON.stringify(source),original);assert.equal(result.report.steps[0],'c13 → c14');
assert.ok(result.report.changes.some(row=>row.kind==='default'));
const report=validateConfigPackage(config);assert.equal(report.valid,true,JSON.stringify(report.issues));
assert.deepEqual(migratePackageToC14(config).config,config);
assert.deepEqual(migrateConfigToR9(config),config);assert.deepEqual(migrateConfigToR10(config).config,config);
assert.throws(()=>migrateConfigToR9({...config,contractRevision:16} as unknown as ConfigPackageV3),/未知/);
assert.throws(()=>migratePackageToC14({...config,contractRevision:16} as unknown as ConfigPackageV3),/未知/);
assert.throws(()=>migrationChain(14,13,'package'),/降级/);
assert.throws(()=>migrationChain(12,14,'package'),/窗口/);
assert.throws(()=>migrationChain(13,14,'package',[]),/缺少/);
assert.throws(()=>migrateContract({contractRevision:13,nodes:[{nodeId:'broken'} as never]},14,'node'),/必需/,'fragments must be structurally checked before a migration hop');
const partial=editableGeometryProfile('LineString',13);partial.zoomPriority.rules[0].conditionalOverrides=[{id:'partial-diagnostic',when:[],style:{strokeOpacity:.5}}];addC14ProfileDefaults(partial,'LineString');assert.equal(partial.zoomPriority.rules[0].conditionalOverrides[0].style!.halo,undefined,'a partial diagnostic override must keep inheriting the parent halo');
const future:MigrationStep[]=Array.from({length:7},(_,i)=>({from:13+i,to:14+i,kinds:['package'],apply(){}}));
const known=Array.from({length:8},(_,i)=>13+i);
assert.equal(migrationChain(13,18,'package',future,known).length,5);
assert.equal(migrationChain(14,19,'package',future,known).length,5);
assert.throws(()=>migrationChain(13,19,'package',future,known),/窗口/);
assert.equal(formatContractRevision(14),'c14');assert.equal(formatConfigRevision(11),'r11');
for(const [from,to] of CONTRACT_CAPABILITIES.migration.steps)for(const kind of ['package','node','classTree','workflow'] as const)assert.equal(MIGRATION_STEPS.filter(step=>step.from===from&&step.to===to&&step.kinds.includes(kind)).length,1);
let nodes=0,trees=0,workflows=0;
for(const node of source.nodes){
  const artifact=await createCategoryArtifact(source,node.nodeId,'node'),text=JSON.stringify(artifact),imported=prepareCategoryImport(config,artifact);
  assert.equal(imported.config.contractRevision,14);assert.equal(imported.migration?.target,14);assert.equal(JSON.stringify(artifact),text);
  assert.equal(imported.report.valid,true,node.nodeId+': '+JSON.stringify(imported.report.issues));nodes++;
  assert.deepEqual(imported.config.nodes.find(item=>item.nodeId===node.nodeId)!.geometryProfiles,config.nodes.find(item=>item.nodeId===node.nodeId)!.geometryProfiles,'component and full migration must agree');
}
for(const classCode of new Set(source.nodes.map(node=>node.path.class))){
  const root=source.nodes.find(node=>node.path.class===classCode)!;
  const artifact=await createCategoryArtifact(source,root.nodeId,'classTree'),imported=prepareCategoryImport(config,artifact);
  assert.equal(imported.report.valid,true,classCode+': '+JSON.stringify(imported.report.issues));
  const blob=await categoryArtifactBlob(await createCategoryArtifact(imported.config,imported.selectedId,'classTree'));
  const parsed=await readCategoryArtifact(new File([blob],'tree.zip'));assert.equal(parsed.payload.contractRevision,14);trees++;
}
for(const workflow of source.workflows){const artifact=buildWorkflowArtifact(source,workflow),text=JSON.stringify(artifact),result=prepareWorkflowArtifactImport(config,artifact);assert.deepEqual(result.workflow,workflow);assert.equal(result.migration?.target,14);assert.equal(JSON.stringify(artifact),text);workflows++;}
for(const geometry of ['Point','LineString','Polygon'] as const){
  const request:CategoryInitialization={code:'HALO_NEW_'+geometry,labels:{zh:'新分类',en:''},mode:'blank',sync:{fields:false,geometry:false,display:false,card:false},geometry,multiple:false,anchor:'featureBbox'};
  const blank=initializeCategory(config,request);assert(validateConfigPackage(blank.config).valid);
  blank.node.geometryProfiles[geometry]=editableGeometryProfile(geometry,14);assert(validateConfigPackage(blank.config).valid,geometry+' defaults must be complete at creation');
  const copied=initializeCategory(config,{...request,mode:'template',sourceId:config.nodes.find(node=>node.geometryType===geometry)!.nodeId,sync:{fields:true,geometry:true,display:true,card:true}});assert(validateConfigPackage(copied.config).valid);
}
const bad=structuredClone(config),style=bad.nodes.flatMap(node=>Object.values(node.geometryProfiles)).flatMap(profile=>profile?.zoomPriority.rules??[]).find(rule=>rule.style?.halo)!.style!;
delete style.halo;assert.ok(validateNativeStructure(bad).some(issue=>issue.message.includes('Halo')));
const legacy=structuredClone(source);legacy.nodes.find(node=>Object.values(node.geometryProfiles).some(profile=>profile?.zoomPriority.rules.length))!.geometryProfiles[Object.keys(legacy.nodes.find(node=>Object.values(node.geometryProfiles).some(profile=>profile?.zoomPriority.rules.length))!.geometryProfiles)[0] as 'Point']!.zoomPriority.rules[0].style!.halo={enabled:false,widthPx:2,color:{mode:'fixed',color:'#ffffff'}};
assert.ok(validateNativeStructure(legacy).some(issue=>issue.message.includes('c14')));
console.log(JSON.stringify({contract:'c14',nodes,trees,workflows,changes:result.report.changes.length,sourceUnchanged:JSON.stringify(source)===original}));
