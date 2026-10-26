import {NATIVE_CONFIG_REVISION} from '../../src/configStudio/contract';
import assert from 'node:assert/strict';
import {readC14MigrationSource} from './fixtures/c14-migration-source';
import {createHash} from 'node:crypto';
import {migratePackageToC15,migratePackageToC14,migrateContract} from '../../src/configStudio/contractMigration';
import {validateConfigPackage} from '../../src/configStudio/runtime';
import {validateNativeStructure} from '../../src/configStudio/nativeContractValidation';
import {editableGeometryProfile} from '../../src/configStudio/renderRuleTemplates';
import {workflowClassificationGroup,outputAcceptsClassification,recordClassificationEligible} from '../../src/configStudio/workflowClassificationGroup';
import {buildWorkflowArtifact,prepareWorkflowArtifactImport} from '../../src/configStudio/workflowArtifact';
import type {ConfigPackageV3,WorkflowOutput,CategoryNode} from '../../src/configStudio/types';

const {identity:index,bytes,config:source}=readC14MigrationSource();
assert.equal(source.contractRevision,14);
assert.equal(createHash('sha256').update(bytes).digest('hex'),index.configSha256);
const original=JSON.stringify(source),result=migratePackageToC15(source),config=result.config;
assert.equal(JSON.stringify(source),original);
assert.equal(config.contractRevision,15);
assert.deepEqual(validateNativeStructure(config),[]);
const report=validateConfigPackage(config);
assert(report.valid,JSON.stringify(report.issues.filter(issue=>issue.severity==='error').slice(0,30),null,2));
assert.deepEqual(migratePackageToC15(config).config,config);
assert.throws(()=>migratePackageToC14(config),/降级/);
assert.throws(()=>migratePackageToC15({...config,contractRevision:NATIVE_CONFIG_REVISION+1} as unknown as ConfigPackageV3),/未知/);
for(const node of config.nodes)for(const profile of Object.values(node.geometryProfiles))if(profile){
  assert.equal(profile.anchor,undefined);assert.equal(profile.interaction,undefined);
  assert(profile.zoomPriority.rules.every(rule=>rule.multipartAnchor&&rule.interaction));
}
for(const workflow of source.workflows.filter(workflow=>workflow.mode==='composed')){
  const migrated=config.workflows.find(row=>row.id===workflow.id)!;
  assert.deepEqual(migrated.outputs.map(output=>output.id),workflow.outputs.map(output=>output.id));
  assert.deepEqual(migrated.outputs.map(output=>output.assignments),workflow.outputs.map(output=>output.assignments));
  assert(migrated.outputs.every(output=>!output.classification&&output.classificationGroup?.selectors.length===1));
  const fragment=migrateContract(buildWorkflowArtifact(source,workflow),15,'workflow',config).document;
  assert.deepEqual(fragment.workflow,migrated);
  assert.deepEqual(prepareWorkflowArtifactImport(config,buildWorkflowArtifact(source,workflow)).workflow,migrated);
}
const fixture=structuredClone(source);
const profile=Object.values(fixture.nodes.find(node=>node.path.class==='SBP'&&node.geometryProfiles.Point)!.geometryProfiles)[0]!;
const rule=profile.zoomPriority.rules.find(rule=>rule.style?.pointSymbol)!;
const point=rule.style!.pointSymbol!,shape=structuredClone(point.kind==='shape'?point.shape:point.fallback);
shape.pointShape='circle';shape.size=8.5;shape.halo!.enabled=false;
rule.style!.pointSymbol={kind:'shape',shape};
const after=migratePackageToC15(fixture);
const actual=Object.values(after.config.nodes.find(node=>node.nodeId===fixture.nodes.find(node=>node.geometryProfiles.Point===profile)!.nodeId)!.geometryProfiles)[0]!.zoomPriority.rules.find(row=>row.id===rule.id)!.style!.pointSymbol!;
assert.equal(actual.kind==='shape'&&actual.shape.size,9);
assert(after.report.changes.some(row=>row.path.endsWith('/size')&&row.before===8.5&&row.after===9));
for(const geometry of ['Point','LineString','Polygon'] as const){
 const profile=editableGeometryProfile(geometry,15);
 assert(profile.zoomPriority.rules.every(rule=>rule.multipartAnchor&&rule.interaction));
 assert.deepEqual(validateNativeStructure({...config,nodes:[{nodeId:'test',path:{class:'TEST'},fields:[],children:[],geometryType:geometry,geometryProfiles:{[geometry]:profile}}],workflows:[]}),[]);
}
const mixed=structuredClone(config);
const node=(id:string,kind:string|undefined,geometry?:'Point'|'LineString'|'Polygon'):CategoryNode=>({nodeId:id,path:{class:'C15MIX',...(kind?{kind}:{})},fields:[],children:[],...(geometry?{geometryType:geometry}:{}),geometryProfiles:geometry?{[geometry]:editableGeometryProfile(geometry,15)}:{}});
mixed.nodes.push(node('mixed',undefined),node('mixed-p','P','Point'),node('mixed-l','L','LineString'),node('mixed-a','A','Polygon'));
const output:WorkflowOutput={id:'group',classificationGroup:{selectors:[{id:'all',mode:'leafDescendants',path:{class:'C15MIX'}}]},geometry:{selected:'Polygon'},assignments:[]};
assert.deepEqual(workflowClassificationGroup(mixed,output).paths,[{class:'C15MIX',kind:'A'}]);
assert(!outputAcceptsClassification(mixed,output,{class:'C15MIX',kind:'P'}));
const duplicate={...output,classificationGroup:{selectors:[...output.classificationGroup!.selectors,{id:'same',mode:'self' as const,path:{class:'C15MIX',kind:'A'}}]}};
assert.equal(workflowClassificationGroup(mixed,duplicate).paths.length,1);
assert(!recordClassificationEligible(mixed,{class:'C15MIX'},'Polygon'));
const parent=structuredClone(mixed);parent.nodes.find(node=>node.nodeId==='mixed')!.geometryType='Point';parent.nodes.find(node=>node.nodeId==='mixed')!.geometryProfiles.Point=editableGeometryProfile('Point',15);
assert(recordClassificationEligible(parent,{class:'C15MIX'},'Point'));
console.log('c15: real r13/c14 source preserved; adjacent migration, workflow fragments, IDs, SVG radius, defaults and classification unions: OK');
