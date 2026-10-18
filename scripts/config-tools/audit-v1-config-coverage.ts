/** Cross-check the delivered r11 seed, rather than only a freshly generated adapter. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {listClassConfigs} from '../../src/core/project/classMetadata';
import {getOpenRIAMapWorkflowConfigs} from '../../src/core/project/openriamapRiaWorkflows';
import {defaultApplicationSettings} from '../../src/core/project/applicationDefaults';
import {migrateConfigToR11} from '../../src/configStudio/r11Migration';
import {createConfigPackageFromCurrentProject} from '../../src/configStudio/legacyProjectAdapter';
import {resolveEffectiveFields,classificationPathKey,validateConfigPackage} from '../../src/configStudio/runtime';
import {buildV3CardSections} from '../../src/configStudio/V3CardRenderer';
import {stableConfigText} from '../../src/configStudio/defaultConfigProvider';
import type {ConfigPackageV3} from '../../src/configStudio/types';
const out=process.env.CAIRNMAP_RELEASE_AUDIT_OUT??'docs/90_roadmap-and-history/runtime-v32-release-audit-20261016';
fs.mkdirSync(out,{recursive:true});
const c=JSON.parse(fs.readFileSync('src/configStudio/defaults/r11-r7.config.json','utf8')) as ConfigPackageV3;
const source=createConfigPackageFromCurrentProject();
const classes=listClassConfigs(),workflows=getOpenRIAMapWorkflowConfigs();
const missingPaths=source.nodes.filter(n=>!c.nodes.some(current=>classificationPathKey(current.path)===classificationPathKey(n.path))).map(n=>n.path);
const fields=source.nodes.map(n=>{const actual=resolveEffectiveFields(c,n.path);return {path:n.path,missing:resolveEffectiveFields(source,n.path).filter(f=>!actual.some(candidate=>candidate.key===f.key)).map(f=>f.key)};}).filter(n=>n.missing.length);
const sourceWorkflowIds=source.workflows.map(w=>w.id),missingWorkflows=sourceWorkflowIds.filter(id=>!c.workflows.some(w=>w.id===id));
const baseline=JSON.parse(fs.readFileSync('scripts/config-tools/fixtures/v1-independent-card-baseline.json','utf8'));
const empty=(value:any):boolean=>value==null||typeof value==='string'&&(!value.trim()||value.trim()==='未知')||typeof value==='object'&&!Object.keys(value).length||Array.isArray(value)&&!value.length||value.kind==='lineChips'&&!value.items?.length;
const normalize=(sections:any)=>Object.fromEntries(['mainRows','otherRows'].map(key=>[key,(sections?.[key]??[]).filter((row:any)=>!empty(row.value)).map(({label,value}:any)=>({label,value}))]));
const cardDifferences:any[]=[];let cardChecked=0;
for(const item of baseline.cases){if(item.record.Class==='TRP')continue;cardChecked++;const record:any={uid:item.record.ID,featureInfo:item.record,type:item.record.Type,meta:{Class:item.record.Class,idValue:item.record.ID,sig:item.record}};const expected=normalize(item.sections),actual=normalize(buildV3CardSections(c,record));if(stableConfigText(expected)!==stableConfigText(actual))cardDifferences.push({key:item.key,record:item.record,expected,actual});}
const application=migrateConfigToR11({...c,contractRevision:10,application:defaultApplicationSettings()}).config.application;
const appDiffs:any[]=[];
const compare=(a:any,b:any,at:string)=>{if(stableConfigText(a)===stableConfigText(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b)){for(const key of new Set([...Object.keys(a),...Object.keys(b)]))compare(a[key],b[key],at+'/'+key);}else appDiffs.push({path:at,source:a,delivered:b});};
compare(application,c.application,'application');
const inventory:any[]=[];
for(const root of ['project-config/presets','project-config/packages/openriamap-ria']){const walk=(dir:string)=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(file.endsWith('.json')){const bytes=fs.readFileSync(file);inventory.push({path:file.replaceAll('\\','/'),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}}};walk(root);}
const parity=(c.parity?.entries??[]).reduce((counts:any,item)=>({...counts,[item.status]:(counts[item.status]??0)+1}),{});
const approvedAliasRemovals=fields.filter(n=>n.path.class==='RLE'&&n.missing.every(k=>['LineName','LineID'].includes(k)));
const approvedCardChanges=cardDifferences.filter(item=>{const expected=structuredClone(item.expected);for(const rows of Object.values(expected) as any[])for(const row of rows){const target=row.value?.linkTarget;if(row.value?.kind==='featureLink'&&['BUD','STB'].includes(target?.classCode)){delete target.classCode;target.structureRole='main';}}return stableConfigText(expected)===stableConfigText(item.actual);});
const output={sourceConfigFiles:inventory.length,sourceClasses:classes.length,sourceWorkflows:workflows.length,sourceNodes:source.nodes.length,deliveredNodes:c.nodes.length,deliveredWorkflows:c.workflows.length,missingPaths,missingFields:fields,approvedAliasRemovals,unexplainedMissingFields:fields.filter(row=>!approvedAliasRemovals.includes(row)),missingWorkflows,parityStatuses:parity,unsupportedParity:(c.parity?.entries??[]).filter(e=>e.status==='unsupported'),cardCases:cardChecked,cardDifferences,approvedCardChangeCount:approvedCardChanges.length,unexplainedCardDifferences:cardDifferences.filter(row=>!approvedCardChanges.includes(row)),applicationDifferences:appDiffs,seedValid:validateConfigPackage(c).valid};
fs.writeFileSync(path.join(out,'v1-source-inventory.json'),JSON.stringify(inventory,null,2)+'\n');
fs.writeFileSync(path.join(out,'v1-delivered-coverage.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({...output,cardDifferences:cardDifferences.map(item=>item.key),applicationDifferences:appDiffs.map(item=>item.path)},null,2));
