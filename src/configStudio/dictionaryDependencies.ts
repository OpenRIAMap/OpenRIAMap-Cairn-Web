import type { ClassificationPath, ConfigPackageV3, FieldDefinitionRef } from './types';
import { referencedField } from './lookupTables';
import { fieldFingerprint } from './prefillAudit';
import { classificationPathKey, resolveEffectiveFields } from './runtime';

export type DictionaryFieldDependency={ref:FieldDefinitionRef;path:ClassificationPath;key:string;fingerprint:string};
export function dictionaryRefs(value:unknown):FieldDefinitionRef[]{
  const result:FieldDefinitionRef[]=[];
  const walk=(value:unknown)=>{if(!value||typeof value!=='object')return;if(Array.isArray(value)){value.forEach(walk);return;}for(const [key,item] of Object.entries(value)){if(['fieldBinding','optionsFieldRef'].includes(key)&&item&&typeof item==='object')result.push(item as FieldDefinitionRef);else walk(item);}};
  walk(value);return result;
}
export function dictionaryDependencies(config:ConfigPackageV3,value:unknown):DictionaryFieldDependency[]{
  const seen=new Set<string>();return dictionaryRefs(value).flatMap(ref=>{const id=JSON.stringify(ref);if(seen.has(id))return [];seen.add(id);const node=config.nodes.find(node=>node.nodeId===ref.nodeId),field=referencedField(config,ref);if(!node||!field)throw Error(`对照来源字段 ${ref.nodeId}/${ref.fieldId} 不存在。`);return [{ref:structuredClone(ref),path:structuredClone(node.path),key:field.key,fingerprint:fieldFingerprint(field)}];});
}
export function dictionaryTableIds(config:ConfigPackageV3,value:unknown):Set<string>{
  const ids=new Set<string>();const walk=(value:unknown)=>{if(!value||typeof value!=='object')return;if(Array.isArray(value)){value.forEach(walk);return;}for(const [key,item] of Object.entries(value))if((key==='optionsTableId'||key==='valueTableId')&&typeof item==='string')ids.add(item);else if(config.contractRevision>=11&&key==='kind'&&item==='tagsExtensions')ids.add('standard-tag-fields');else walk(item);};walk(value);
  for(const dep of dictionaryDependencies(config,value)){const field=referencedField(config,dep.ref);if(field?.optionsTableId)ids.add(field.optionsTableId);}for(const id of ids)walk(config.lookupTables?.find(table=>table.id===id));return ids;
}
/** Require existing definitions, or remap an identical field at the exact path.
 * Importing a card/workflow never creates or overwrites unrelated categories. */
export function remapDictionaryDependencies(config:ConfigPackageV3,value:unknown,dependencies:DictionaryFieldDependency[]=[]):void{
  const refs=dictionaryRefs(value),used=new Set<string>();
  for(const ref of refs){const dep=dependencies.find(row=>row.ref.nodeId===ref.nodeId&&row.ref.fieldId===ref.fieldId);if(!dep)throw Error(`缺少字段引用依赖：${ref.nodeId}/${ref.fieldId}`);used.add(JSON.stringify(dep.ref));
    const node=config.nodes.find(node=>classificationPathKey(node.path)===classificationPathKey(dep.path));
    const field=node?resolveEffectiveFields(config,node.path).find(field=>field.key===dep.key):undefined;
    if(!node||!field||fieldFingerprint(field)!==dep.fingerprint)throw Error(`来源字段 ${classificationPathKey(dep.path)}/${dep.key} 缺失或内容冲突；请先导入来源分类，或在来源处解除绑定后重新导出副本。`);
    ref.nodeId=node.nodeId;ref.fieldId=field.fieldId;
  }
  if(dependencies.some(dep=>!used.has(JSON.stringify(dep.ref))))throw Error('文件包含未使用的字段依赖。');
}
