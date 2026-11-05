import fs from 'node:fs';
import path from 'node:path';
import {migratePackageToContract} from '../../src/configStudio/contractMigration';
import {defaultHalo} from '../../src/configStudio/halo';
import {validateConfigPackage} from '../../src/configStudio/runtime';
import {buildConfigPackageArchive} from '../../src/configStudio/package';
import type {ConfigPackageV3} from '../../src/configStudio/types';

const base=path.resolve('../../migration-runs/studio-runtime-c18-20261105'),original=JSON.parse(fs.readFileSync('public/configuration/releases/b81d2f8aa9f0014768645d5b0f9ec6d6d7bd2ccb671857d9175e0d09069d03be/config.json','utf8')) as ConfigPackageV3;
const {config,report:migration}=migratePackageToContract(original,18),changes:string[]=[];
for(const node of config.nodes)if(node.path.class==='FLR')for(const profile of Object.values(node.geometryProfiles))for(const rule of profile?.zoomPriority.rules??[]){
 if(rule.representation==='hidden'||rule.representation==='labelOnly')continue;
 rule.representation='point';
 rule.style={pointSymbol:{kind:'shape',shape:{pointShape:'circle',size:4.5,weight:3,lineCap:'round',lineJoin:'round',stroke:{mode:'fixed',color:'#000000'},fill:{mode:'fixed',color:'#ffffff'},strokeOpacity:.85,fillOpacity:1,halo:defaultHalo()}},symbolVisibility:'withLabel'};
 if(rule.label)rule.label={...rule.label,withDot:false,dotAnchorMode:undefined,placement:'E',offsetX:(rule.label.offsetX??0)+11,offsetY:rule.label.offsetY??0};
 changes.push(`${node.nodeId}/${rule.id}：附属面用原生面内点与独立 Label 重现，保留可见区间、名称回退、字号、优先级与楼层条件。`);
}
for(const workflow of config.workflows)for(const step of workflow.steps)for(const control of step.controls??[]){
 const field=control.fieldSource?.snapshot.key??control.prefillField;
 const targets=workflow.outputs.flatMap(output=>output.assignments.filter(assignment=>assignment.expression===control.slot).map(assignment=>assignment.target));
 if((field==='hub'||targets.includes('hub'))&&workflow.id.includes('tpp')){control.kind='select';control.optionsTableId='teleport-hubs';if(control.defaultValue==='')delete control.defaultValue;control.optionValueType='string';delete control.options;delete control.optionTable;delete control.optionSource;delete control.optionsFieldRef;changes.push(`${workflow.id}/${control.id}：枢纽下拉绑定功能表首层。`);}
 if((field==='Mode'||field==='Mode[]'||targets.includes('Mode'))&&control.kind==='group'&&control.group){
  for(const item of control.group.itemFields)if(item.key===''||item.key==='mode'||item.key==='code'){item.kind='select';item.optionsTableId='road-travel-modes';item.optionValueType='string';delete item.options;delete item.optionTable;delete item.optionSource;delete item.optionsFieldRef;changes.push(`${workflow.id}/${control.id}：出行方式组装项绑定功能表首层。`);}
 }
}
const report=validateConfigPackage(config);if(!report.valid)throw Error(JSON.stringify(report.issues.filter(issue=>issue.severity==='error'),null,2));
const folder=path.join(base,'delivery');fs.mkdirSync(folder,{recursive:true});
fs.writeFileSync(path.join(folder,'config-r151-c18-candidate.json'),JSON.stringify(config,null,2)+'\n');
fs.writeFileSync(path.join(folder,'migration-and-content-changes.json'),JSON.stringify({migration,changes,report},null,2)+'\n');
const blob=await buildConfigPackageArchive(config,report);fs.writeFileSync(path.join(folder,'CairnMap_20261105-base-r151-c18.cairn-config-v3.zip'),Buffer.from(await blob.arrayBuffer()));
console.log(`c18 candidate: r${config.revision}, ${changes.length} explicit content repairs, validated. No production changes.`);
