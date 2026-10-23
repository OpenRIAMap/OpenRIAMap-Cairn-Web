import assert from 'node:assert/strict';
import {readC14MigrationSource} from './fixtures/c14-migration-source';
import {migratePackageToC15} from '../../src/configStudio/contractMigration';
import {initializeCategory} from '../../src/configStudio/categoryInitialization';
import {createCategoryFromTemplate,compatibleCategoryTemplates} from '../../src/configStudio/categoryTemplates';
import {resolveGeometryProfile,validateConfigPackage} from '../../src/configStudio/runtime';
import {validateNativeStructure} from '../../src/configStudio/nativeContractValidation';

const config=migratePackageToC15(readC14MigrationSource().config).config;
const parent=config.nodes.find(node=>node.path.class==='ROD'&&!node.path.kind)!;
const source=resolveGeometryProfile(config,parent.path,'LineString')!;
source.zoomPriority.rules.forEach((rule,index)=>{rule.multipartAnchor=index%2?'perPart':'featureBbox';rule.interaction={triggers:{line:true,label:false}};});
const original=JSON.stringify(config);
const request={code:'C15NEW',labels:{zh:'测试',en:''},mode:'blank' as const,sync:{fields:false,geometry:false,display:false,card:false},geometry:'Point' as const,multiple:false,anchor:'perPart' as const};
for(const result of [initializeCategory(config,request),initializeCategory(config,{...request,parentId:parent.nodeId,mode:'parent',sync:{fields:true,geometry:true,display:true,card:true}}),initializeCategory(config,{...request,mode:'template',sourceId:parent.nodeId,sync:{fields:true,geometry:true,display:true,card:true}})]){
 assert.deepEqual(validateNativeStructure(result.config),[]);
 const report=validateConfigPackage(result.config);assert(report.valid,JSON.stringify(report.issues.filter(issue=>issue.severity==='error')));
 for(const profile of Object.values(result.node.geometryProfiles))if(profile){assert.equal(profile.anchor,undefined);assert.equal(profile.interaction,undefined);}
 if(result.node.geometryProfiles.LineString)assert.deepEqual(result.node.geometryProfiles.LineString.zoomPriority.rules.map(rule=>[rule.multipartAnchor,rule.interaction]),source.zoomPriority.rules.map(rule=>[rule.multipartAnchor,rule.interaction]));
}
const templateRequest={parentId:parent.nodeId,code:'C15TEMPLATE',geometry:'LineString' as const,allowMultipleParts:source.allowMultipleParts,anchor:'perPart' as const};
assert(compatibleCategoryTemplates(config,templateRequest).some(row=>row.node.nodeId===parent.nodeId));
for(const result of [createCategoryFromTemplate(config,templateRequest),createCategoryFromTemplate(config,{...templateRequest,sourceId:parent.nodeId})]){
 assert.deepEqual(validateNativeStructure(result.config),[]);assert(validateConfigPackage(result.config).valid);
 const profile=resolveGeometryProfile(result.config,result.node.path,'LineString')!;
 assert.equal(profile.anchor,undefined);assert.equal(profile.interaction,undefined);
 assert.deepEqual(profile.zoomPriority.rules.map(rule=>[rule.multipartAnchor,rule.interaction]),source.zoomPriority.rules.map(rule=>[rule.multipartAnchor,rule.interaction]));
}
const report=validateConfigPackage(config);assert(report.valid);
assert(!report.issues.some(issue=>issue.code==='interaction-trigger-none'&&issue.path.startsWith('nodes/'+parent.nodeId+'/')),'c15 interaction warnings must inspect rules instead of removed profile fields');
const copy=structuredClone(config),profile=copy.nodes.find(node=>node.nodeId===parent.nodeId)!.geometryProfiles.LineString!;
profile.allowMultipleParts=false;profile.zoomPriority.rules[0].multipartAnchor='perPart';profile.zoomPriority.rules[0].interaction={triggers:{point:true,line:false,label:false}};profile.zoomPriority.rules[0].representation='point';
// Point/Label and inactive line flags are legitimate on a line shown as points.
assert(!validateConfigPackage(copy).issues.some(issue=>['anchor-requires-multipart','interaction-trigger-geometry-invalid'].includes(issue.code)));
profile.zoomPriority.rules[0].interaction={triggers:{interior:true}};
assert(validateConfigPackage({...copy}).issues.some(issue=>issue.code==='interaction-trigger-geometry-invalid'&&issue.path.includes('/renderRules/')));
assert.equal(JSON.stringify(config),original,'new categories must not mutate their template');
console.log('c15 categories: blank/parent/template factories, inherited and copied rules, per-rule diagnostics, inactive source flags and single-part anchor retention: OK');
