import type { ConfigPackageV3 } from './types';
import { migrateConfigToR9 } from './r9Migration';
import { defaultLookupTables } from './lookupTables';
import { createPrefillAudit } from './prefillAudit';
import { linkCardInheritance } from './cardInheritance';
import { inheritanceControls, parentClassificationPath, classificationPathKey, pathDepth, resolveCardConfiguration, resolveEffectiveFields, resolveIncomingFields } from './runtime';

export type R10MigrationReport={from:number;to:10;changes:Array<{path:string;message:string}>};
/** Upgrade adds capabilities without reusing the frozen r9/r5 identity. */
export function migrateConfigToR10(value:ConfigPackageV3):{config:ConfigPackageV3;report:R10MigrationReport}{
  const report:R10MigrationReport={from:value.contractRevision,to:10,changes:[]};
  if(value.contractRevision===10)return {config:structuredClone(value),report};
  const original=value.contractRevision<9?migrateConfigToR9(value):structuredClone(value),config=structuredClone(original);
  config.contractRevision=10;config.revision=Math.max(value.revision+1,6);
  config.lookupTables=defaultLookupTables();report.changes.push({path:'lookupTables',message:'加入所属枢纽区/四返回点与出行方式表；未替换导航消费者。'});
  for(const node of [...config.nodes].sort((a,b)=>pathDepth(a.path)-pathDepth(b.path))){
    const incoming=resolveIncomingFields(config,node.path);
    node.fields=node.fields.filter(field=>{const fixed=incoming.find(row=>row.key===(field.overrideOf??field.key));if(!fixed)return true;report.changes.push({path:`nodes/${node.nodeId}/fields/${field.fieldId}`,message:`移除遮挡固定父定义的 ${field.key} 副本，父字段身份/定义优先。`});return false;});
    const parentPath=parentClassificationPath(node.path),parent=parentPath?config.nodes.find(row=>classificationPathKey(row.path)===classificationPathKey(parentPath)):undefined;
    if(parent&&inheritanceControls(parent).card){
      const before=node.card?.mode==='fields'?node.card.items.map(item=>item.id):[];
      linkCardInheritance(node,resolveCardConfiguration(config,parent.path),parent.nodeId,true);
      if(node.card?.mode==='fields')report.changes.push({path:`nodes/${node.nodeId}/card`,message:`保留 ${before.length} 项本地布局/显示器；链接 ${node.card.items.filter(item=>item.inheritFrom).length} 个稳定继承项，旧布局未列出的父项保持隐藏。`});
    }
    const fields=resolveEffectiveFields(config,node.path);
    if(node.card?.mode==='fields')for(const item of node.card.items){const field=fields.find(field=>field.key===item.source);if(field&&!item.inheritFrom)item.prefillAudit=createPrefillAudit(node.path,field);}
  }
  for(const workflow of config.workflows)for(const step of workflow.steps)for(const control of step.controls??[]){
    const binding=workflow.outputs.flatMap(output=>output.assignments.map(assignment=>({output,assignment}))).find(({assignment})=>assignment.expression===control.slot&&assignment.target!=='ID');
    const scope=binding?.output.classification??workflow.outputs[0]?.classification;
    if(!scope)continue;const fields=resolveEffectiveFields(config,scope),key=control.prefillField??binding?.assignment.target;
    const field=fields.find(field=>field.key===key);
    if(field&&control.kind==='select')control.prefillAudit=createPrefillAudit(scope,field);
    if(field&&control.kind==='group'&&control.group?.storage==='scalar'&&control.group.itemFields[0])control.group.itemFields[0].prefillAudit=createPrefillAudit(scope,field);
  }
  return {config,report};
}

