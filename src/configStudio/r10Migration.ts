import { defaultApplicationSettings } from '../core/project/applicationDefaults';
import type { CategorySearch, ConfigPackageV3 } from './types';
import { resolveNodeFieldSettings } from './nodeFieldSettings';
import { STRUCTURE_CONTEXT_ID } from './structureRoleIndex';
import { SEARCH_CATEGORY_OVERRIDE_LINES,SEARCH_RULE_PRIORITY_LINES,SEARCH_RULE_BLACKLIST_LINES } from '../components/Search/searchRuleTables';
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
  config.application=defaultApplicationSettings();
  config.lookupTables=defaultLookupTables();report.changes.push({path:'lookupTables',message:'加入所属枢纽区/四返回点与出行方式表；未替换导航消费者。'});
  const names=new Map(SEARCH_CATEGORY_OVERRIDE_LINES.map(line=>{const value=JSON.parse('{'+line+'}') as {Class:string;Name:string};return [value.Class,value.Name];}));
  const priorities=SEARCH_RULE_PRIORITY_LINES.map(line=>(JSON.parse('{'+line+'}') as {Class:string}).Class),blacklist=new Set(SEARCH_RULE_BLACKLIST_LINES.map(line=>(JSON.parse('{'+line+'}') as {Class:string}).Class));
  for(const node of config.nodes.filter(node=>pathDepth(node.path)===1)){
    const code=node.path.class,search:CategorySearch={enabled:!blacklist.has(code),queryFields:['Name','ID','Class'],priority:priorities.includes(code)?priorities.indexOf(code):100,subtitle:{mode:code==='FLR'||code==='STF'?'classificationField':'classification',...(names.has(code)?{classificationLabel:{zh:names.get(code)!,en:''}}:{}),...(code==='FLR'||code==='STF'?{field:code==='FLR'?'BuildingID':'staBuildingID',valueMode:'reference',referenceDisplayField:'Name'}:{})},extension:{mode:'none'}};
    if(['PLF','PFB','STA','STB'].includes(code))search.extension={mode:'lineChips',lineChipSource:code==='PLF'||code==='PFB'?'platform':code==='STA'?'station':'stationBuilding'};
    if(code==='RLE')search.extension={mode:'nameColorCapsule',nameField:'Name',colorField:'color',displayName:false,fallbackColor:'#999999'};
    if(code==='FLR'||code==='STF')search.subtitle.fallbackClassificationLabel={zh:'楼层',en:''};
    if(code==='ROD')search.subtitle.fallbackClassificationLabel={zh:'ROD',en:'ROD'};
    node.fieldSettings={...node.fieldSettings,search};
  }
  for(const binding of original.contextBindings??[])if(binding.enabled){
    if(binding.host.referenceField!=='ID')throw Error(`旧绑定 ${binding.id} 的主端不是 ID，需先明确目标 ID 语义，不能静默转换。`);
    const host=config.nodes.find(node=>classificationPathKey(node.path)===classificationPathKey(binding.host.classification)),member=config.nodes.find(node=>classificationPathKey(node.path)===classificationPathKey(binding.member.classification));
    if(!host||!member)throw Error(`旧绑定 ${binding.id} 的分类不存在。`);
    const hostRole={enabled:true,role:'main' as const,...(host.fields.some(field=>field.key==='Floors')?{memberField:'Floors'}:{})},memberRole={enabled:true,role:'member' as const,hostField:binding.member.referenceField,selectorField:binding.memberSelectorField,visibility:binding.profile==='show-active-member-only'?'activeLevel' as const:'allMembers' as const};
    for(const [node,structure] of [[host,hostRole],[member,memberRole]] as const){if(node.fieldSettings?.structure&&JSON.stringify(node.fieldSettings.structure)!==JSON.stringify(structure))throw Error(`旧绑定 ${binding.id} 产生同分类身份/字段冲突，请先调整。`);node.fieldSettings={...node.fieldSettings,structure};}
    report.changes.push({path:`contextBindings/${binding.id}`,message:'迁移为自身角色与引用字段；解除对端 Class 限制，保留显示策略及主向下兼容引用。'});
  }
  config.contextBindings=[];
  for(const node of config.nodes)for(const profile of Object.values(node.geometryProfiles))for(const rule of profile?.zoomPriority.rules??[])if(rule.extensions?.visibility?.mode==='activeContextMember')rule.extensions.visibility.activeContextMember={...rule.extensions.visibility.activeContextMember,bindingId:STRUCTURE_CONTEXT_ID};
  for(const node of [...config.nodes].sort((a,b)=>pathDepth(a.path)-pathDepth(b.path))){
    const incoming=resolveIncomingFields(config,node.path);
    node.fields=node.fields.filter(field=>{const fixed=incoming.find(row=>row.key===(field.overrideOf??field.key));if(!fixed)return true;report.changes.push({path:`nodes/${node.nodeId}/fields/${field.fieldId}`,message:`移除遮挡固定父定义的 ${field.key} 副本，父字段身份/定义优先。`});return false;});
    const parentPath=parentClassificationPath(node.path),parent=parentPath?config.nodes.find(row=>classificationPathKey(row.path)===classificationPathKey(parentPath)):undefined;
    if(parent&&inheritanceControls(parent).card){
      const before=node.card?.mode==='fields'?node.card.items.map(item=>item.id):[];
      linkCardInheritance(node,resolveCardConfiguration(config,parent.path),parent.nodeId,true);
      if(node.card?.mode==='fields')report.changes.push({path:`nodes/${node.nodeId}/card`,message:`保留 ${before.length} 项本地布局/显示器；链接 ${node.card.items.filter(item=>item.inheritFrom).length} 个稳定继承项，旧布局未列出的父项保持隐藏。`});
    }
    const fields=resolveEffectiveFields(config,node.path),role=resolveNodeFieldSettings(config,node.path).value.structure;
    if(role?.enabled&&role.role==='member'&&node.card?.mode==='fields')for(const item of node.card.items)if(item.renderer==='relationLink'&&item.source===role.hostField)item.relation={...item.relation,targetClassification:undefined,targetRole:'main',targetMatchField:'ID',targetDisplayField:item.relation?.targetDisplayField??'Name'};
    if(node.card?.mode==='fields')for(const item of node.card.items){const field=fields.find(field=>field.key===item.source);if(field&&!item.inheritFrom)item.prefillAudit=createPrefillAudit(node.path,field);}
  }
  for(const workflow of config.workflows)for(const step of workflow.steps)for(const control of step.controls??[]){
    const binding=workflow.outputs.flatMap(output=>output.assignments.map(assignment=>({output,assignment}))).find(({assignment})=>assignment.expression===control.slot&&assignment.target!=='ID');
    const scope=binding?.output.classification??workflow.outputs[0]?.classification;
    if(!scope)continue;const role=resolveNodeFieldSettings(config,scope).value.structure;if(role?.enabled&&role.role==='member'&&control.search&&binding?.assignment.target===role.hostField)control.search={...control.search,targetRole:'main'};const fields=resolveEffectiveFields(config,scope),key=control.prefillField??binding?.assignment.target;
    const field=fields.find(field=>field.key===key);
    if(field&&control.kind==='select')control.prefillAudit=createPrefillAudit(scope,field);
    if(field&&control.kind==='group'&&control.group?.storage==='scalar'&&control.group.itemFields[0])control.group.itemFields[0].prefillAudit=createPrefillAudit(scope,field);
  }
  const rail=config.nodes.find(node=>node.path.class==='RLE'&&!node.path.kind)?.geometryProfiles.LineString;
  if(rail){
    const rules=rail.zoomPriority.rules,base=rules.find(rule=>rule.when?.zoom.min===0&&rule.when?.zoom.max===4),full=rules.find(rule=>rule.when?.zoom.min===5&&rule.when?.zoom.max===7&&rule.when?.fields);
    if(base&&full&&full.label){
      const low=structuredClone(base);low.id=base.id+'--zoom2-4';low.when!.zoom.min=2;base.when!.zoom.max=1;
      const pill=structuredClone(full);pill.id='r10-rle-code-pill-zoom2-4';pill.when!.zoom={min:2,max:4};pill.label={...pill.label!,sourceMode:'combined',template:'"bureau""line"',style:{...pill.label!.style!,size:11}};
      pill.extensions={...pill.extensions,lineLabel:{...pill.extensions?.lineLabel,profile:'strict-on-line',mode:'strictOnLine',minLengthPx:24,endpointPaddingMinPx:4,endpointPaddingRatio:0.05,repositionMode:'off',repositionStrictSvg:false}};
      const position=rules.indexOf(base);rules.splice(position+1,0,low,pill);
      report.changes.push({path:'RLE/LineString/zoom2-4',message:'用户批准的 V1 偏离：direction=3 显示 bureau+line 11px 线路色代码胶囊；0–1、5–7、8 保持原意。'});
      for(const rule of rules)if(rule.label?.style?.family==='rle-pill-color')rule.extensions={...rule.extensions,lineLabel:{...rule.extensions?.lineLabel,profile:rule.extensions?.lineLabel?.profile??'strict-on-line',repositionStrictSvg:false}};
      report.changes.push({path:'RLE/LineString/pill',message:'修复 SVG-only 限制误隐藏背景胶囊；既有正式名称与代码胶囊采用支持背景的标签回退，不修改 ROD。'});
    }else throw Error('RLE 基线缺少 0–4/5–7 原生规则，无法自动创建代码胶囊。');
  }
  return {config,report};
}

