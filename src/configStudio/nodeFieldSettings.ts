import type {CategoryNode,ClassificationPath,ConfigPackageV3,ConfigValidationIssue,FieldDefinition,NodeFieldSettings} from './types';
import {classificationPathKey,inheritanceControls,resolveCategoryNodes} from './runtime';

type Module=keyof NodeFieldSettings;
export type FieldSettingsResolution={value:NodeFieldSettings;owners:Partial<Record<Module,string>>};
const cache=new WeakMap<ConfigPackageV3,Map<string,FieldSettingsResolution>>();
export function resolveNodeFieldSettings(config:ConfigPackageV3,path:ClassificationPath):FieldSettingsResolution {
  const key=classificationPathKey(path),cached=cache.get(config)?.get(key);if(cached)return cached;
  const value:NodeFieldSettings={},owners:FieldSettingsResolution['owners']={},fixed=new Set<Module>();let propagate=true;
  for(const [index,node] of resolveCategoryNodes(config,path).entries()){
    if(index>0)for(const module of ['structure','search'] as const){if(propagate&&value[module]&&(module==='structure'||value.search?.inheritance==='sealed'))fixed.add(module);else if(!propagate&&!fixed.has(module)){delete value[module];delete owners[module];}}
    for(const module of ['structure','search'] as const)if(!fixed.has(module)&&node.fieldSettings?.[module]){Object.assign(value,{[module]:node.fieldSettings[module]});owners[module]=node.nodeId;}
    propagate=inheritanceControls(node).fields;
  }
  const result={value,owners};if(Object.isFrozen(config)){Object.freeze(value);Object.freeze(owners);Object.freeze(result);let entries=cache.get(config);if(!entries){entries=new Map();cache.set(config,entries);}entries.set(key,result);}return result;
}
export function incomingNodeFieldSettings(config:ConfigPackageV3,node:CategoryNode):NodeFieldSettings {
  const effective=resolveNodeFieldSettings(config,node.path);return Object.fromEntries(Object.entries(effective.value).filter(([key])=>effective.owners[key as Module]!==node.nodeId));
}
export function validateNodeFieldSettings(config:ConfigPackageV3,resolveFields:(config:ConfigPackageV3,path:ClassificationPath)=>FieldDefinition[]):ConfigValidationIssue[]{
  const issues:ConfigValidationIssue[]=[];
  const error=(path:string,message:string)=>issues.push({severity:'error',code:'field-settings-invalid',path,message});
  if(config.contractRevision<10){if(config.nodes.some(node=>node.fieldSettings))error('nodes','通用包含关系与搜索控制需要 r10。');return issues;}
  if(config.contextBindings?.length)error('contextBindings','r10 以分类自身角色定义包含关系，不能保留旧的分类对绑定。');
  for(const node of config.nodes){
    const path=`nodes/${node.nodeId}/fieldSettings`,effective=resolveNodeFieldSettings(config,node.path),incoming=incomingNodeFieldSettings(config,node);
    for(const module of ['structure','search'] as const)if(incoming[module]&&node.fieldSettings?.[module]&&(module==='structure'||incoming.search?.inheritance==='sealed'))error(`${path}/${module}`,'该模块由祖先字段设计固定继承，不能用本地副本覆盖。');
    const fields=resolveFields(config,node.path),byKey=new Map(fields.map(field=>[field.key,field]));
    const has=(key?:string)=>Boolean(key&&(['ID','Name','World','Class','Kind','SKind','SKind2'].includes(key)||byKey.has(key)));
    const idField=(key?:string,reverse=false)=>{if(!has(key))return false;if(key==='ID')return true;const field=byKey.get(key!)!;return field&&(['string','reference'].includes(field.type)||field.type==='enum'&&(field.optionValueType??'string')==='string'||reverse&&field.type==='json')&&(reverse||field.cardinality==='single');};
    const role=effective.value.structure;
    if(role?.enabled){
      if(role.role==='main'&&role.memberField&&!idField(role.memberField,true))error(`${path}/structure`,'主结构指向附属字段必须是已定义的 ID/ID 列表字段。');
      if(role.role==='member'){
        if(!idField(role.hostField))error(`${path}/structure`,'附属结构必须选择单值的主结构 ID 字段。');
        const selector=role.selectorField?byKey.get(role.selectorField):undefined;
        if(!selector||selector.cardinality!=='single'||selector.type==='json')error(`${path}/structure`,'附属结构必须选择单值标量层级字段。');
      }
      if(role.role==='main'&&(role.hostField||role.selectorField)||role.role==='member'&&role.memberField)error(`${path}/structure`,'包含关系配置含有与自身身份不符的字段。');
    }
    const search=effective.value.search;if(!search)continue;
    if(!search.queryFields.includes('ID')||!search.queryFields.includes('Name')||new Set(search.queryFields).size!==search.queryFields.length||search.queryFields.some(key=>!has(key)))error(`${path}/search`,'搜索来源必须包含 Name、ID，且不能重复或引用未定义字段。');
    if(search.priority!==undefined&&(!Number.isFinite(search.priority)||search.priority<0))error(`${path}/search`,'搜索排序优先级必须是非负数。');
    const subtitle=search.subtitle;
    if(subtitle.mode!=='classification'){
      if(!has(subtitle.field))error(`${path}/search/subtitle`,'副标题字段未定义。');
      if(subtitle.valueMode==='reference'&&(!idField(subtitle.field)||!/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/.test(subtitle.referenceDisplayField??'Name')||/(?:^|\.)(?:__proto__|constructor|prototype)(?:\.|$)/.test(subtitle.referenceDisplayField??'')))error(`${path}/search/subtitle`,'关联显示需要单值 ID 字段和安全的目标字段路径。');
      if(subtitle.valueMode==='meaning'){
        const rows=subtitle.valueOptions??[],values=new Set(rows.map(row=>row.value)),field=byKey.get(subtitle.field!);
        if(!rows.length||values.size!==rows.length||rows.some(row=>!row.value.trim()||!row.label.zh.trim()||!row.label.en.trim())||(field?.options??[]).some(option=>!values.has(option.value)))error(`${path}/search/subtitle`,'意义显示需非空、唯一、覆盖字段可选值且同时具有 zh/en 的本地对照。');
        if(field&&(field.cardinality!=='single'||field.type==='json'))error(`${path}/search/subtitle`,'意义显示需要单值标量字段。');
      }
    }
    if(search.extension.mode==='nameColorCapsule'&&(!has(search.extension.nameField)||!has(search.extension.colorField)))error(`${path}/search/extension`,'名称与颜色胶囊必须选择有效的名称字段和颜色字段。');
    if(search.extension.mode==='lineChips'&&!search.extension.lineChipSource)error(`${path}/search/extension`,'关联线路胶囊必须选择关联层级。');
  }
  return issues;
}
