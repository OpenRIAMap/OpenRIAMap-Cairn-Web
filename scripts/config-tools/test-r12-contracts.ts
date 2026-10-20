import fs from 'node:fs';
import assert from 'node:assert/strict';
import { validateConfigPackage } from '../../src/configStudio/runtime';
import { migrateConfigToR12 } from '../../src/configStudio/r12Migration';
import { basePointFromLegacy, defaultSymbolPlacement, ICON_LIBRARY } from '../../src/configStudio/pointSymbol';
import { createCustomPill } from '../../src/configStudio/customPill';
import { createCategoryArtifact, categoryArtifactBlob, readCategoryArtifact, prepareCategoryImport, prepareClassTreeCommit } from '../../src/configStudio/categoryArtifact';
import { buildConfigPackageArchive, readConfigPackage } from '../../src/configStudio/package';
import { validateConfiguration } from '../../vendor/configuration-r11/r11-validation.mjs';
import type { ConfigPackageV3 } from '../../src/configStudio/types';
const id=JSON.parse(fs.readFileSync('public/configuration/current.json','utf8'));
const publishedBody=fs.readFileSync('public'+id.configUrl,'utf8'),published=JSON.parse(publishedBody) as ConfigPackageV3;
assert.equal(published.contractRevision,id.contractRevision);
assert(validateConfigPackage(published).valid,'the current publication must remain valid after the pointer advances');
assert.deepEqual(await readConfigPackage(new File([publishedBody],'published.json')),published,'the current native publication imports without historical conversion');
// Historical migration coverage must not follow the mutable publication pointer.
const old=JSON.parse(fs.readFileSync('src/configStudio/defaults/r11-r7.config.json','utf8')) as ConfigPackageV3;
const c=migrateConfigToR12(old).config,n=c.nodes.find(n=>n.nodeId==='class-sbp')!,r=n.geometryProfiles.Point!.zoomPriority.rules[0];
r.style={pointSymbol:{kind:'icon',icon:{mode:'single',item:{library:'pinhead',id:'bus',sizePx:24,foreground:{mode:'fixed',color:'#334155'},foregroundOpacity:1,placement:defaultSymbolPlacement()}},fallback:basePointFromLegacy()}};
r.label!.style={family:'custom_pill_1',size:13,pill:createCustomPill()};
assert(validateConfigPackage(c).valid);
const issues=(v:ConfigPackageV3)=>validateConfigPackage(v).issues.filter(i=>i.severity==='error').map(i=>[i.code,i.path,i.message]);
assert.deepEqual(issues(c),validateConfiguration(c).issues.filter(i=>i.severity==='error').map(i=>[i.code,i.path,i.message]));
let cases=0;
for(const mutate of [
 (c:any)=>c.nodes.find((n:any)=>n.nodeId==='class-sbp').geometryProfiles.Point.zoomPriority.rules[0].style.pointSymbol.icon.item.sizePx=0,
 (c:any)=>c.nodes.find((n:any)=>n.nodeId==='class-sbp').geometryProfiles.Point.zoomPriority.rules[0].style.pointSymbol.icon.item.id='unknown-id',
 (c:any)=>c.resources.iconLibraries[0].manifestSha256='0'.repeat(64),
 (c:any)=>c.nodes.find((n:any)=>n.nodeId==='class-sbp').geometryProfiles.Point.zoomPriority.rules[0].style.weight=3,
 (c:any)=>c.nodes.find((n:any)=>n.nodeId==='class-sbp').geometryProfiles.Point.zoomPriority.rules[0].label.style.pill.radiusRatio=-1,
 (c:any)=>c.nodes.find((n:any)=>n.nodeId==='class-sbp').geometryProfiles.Point.zoomPriority.rules[0].label.style.pill.strokeWidth=73,
 (c:any)=>c.nodes.find((n:any)=>n.nodeId==='class-sbp').geometryProfiles.Point.zoomPriority.rules[0].label.style.pill.textColor={mode:'field',field:'missing_field',fallbackColor:'#ffffff'},
 (c:any)=>c.nodes.find((n:any)=>n.path.class==='ROD'&&!n.path.kind).geometryProfiles.LineString.zoomPriority.rules[0].extensions.lineLabel.simpleFallbackEnabled=true,
 (c:any)=>c.nodes.find((n:any)=>n.path.class==='ROD'&&!n.path.kind).geometryProfiles.LineString.zoomPriority.rules[0].extensions.lineLabel.cjkGlyphPathMode='off',
 (c:any)=>c.contractRevision=13,
]){const v=structuredClone(c);mutate(v);const expected=issues(v);assert(expected.length,'invalid setting must block');assert.deepEqual(validateConfiguration(v).issues.filter(i=>i.severity==='error').map(i=>[i.code,i.path,i.message]),expected);cases++;}
for(const zip of [false,true]){const artifact=await createCategoryArtifact(c,n.nodeId,'classTree');assert.deepEqual(artifact.payload.resources,c.resources);const file=await categoryArtifactBlob(artifact,zip),parsed=await readCategoryArtifact(new File([file],zip?'category.zip':'category.json'));const target=structuredClone(c);delete target.resources;target.nodes.find(n=>n.nodeId==='class-sbp')!.geometryProfiles.Point!.zoomPriority.rules[0].style={pointSymbol:{kind:'shape',shape:basePointFromLegacy()}};const prepared=prepareCategoryImport(target,parsed);assert(prepared.report.valid,JSON.stringify(prepared.report.issues.filter(i=>i.severity==='error')));const committed=prepareClassTreeCommit(target,target,prepared.config,n.path.class);assert.deepEqual(committed.resources,c.resources);assert(validateConfigPackage(committed).valid);const conflict=structuredClone(target);conflict.resources={iconLibraries:[{...ICON_LIBRARY,version:'v999'}]};assert.throws(()=>prepareCategoryImport(conflict,parsed),/版本/);}
const blob=await buildConfigPackageArchive(c,validateConfigPackage(c));assert.deepEqual(await readConfigPackage(new File([blob],'r12.zip')),c);
for(const file of ['r8-r4.config.json','r9-r5.config.json','r10-r6.config.json','r11-r7.config.json']){const v=JSON.parse(fs.readFileSync('src/configStudio/defaults/'+file,'utf8'));assert.equal((await readConfigPackage(new File([JSON.stringify(v)],file))).contractRevision,v.contractRevision);}
assert.equal(old.contractRevision,11);assert.deepEqual(migrateConfigToR12(c).config,c);
console.log(`r12 contracts: ${cases} invalid-setting parity cases; current publication import, JSON/ZIP category resource merge/conflicts/Class commit, package roundtrip, fixed historical r8-r11 imports and migration idempotence passed.`);
