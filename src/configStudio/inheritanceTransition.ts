import type {ConfigPackageV3,InheritanceControls} from './types';
import {classificationContains} from './classificationScope';
import {classificationPathKey,inheritanceControls,resolveEffectiveFields,resolveCardConfiguration,resolveGeometryProfile} from './runtime';
import {resolveNodeFieldSettings} from './nodeFieldSettings';
import {linkCardInheritance} from './cardInheritance';
const semantic=(value:unknown):string=>JSON.stringify(clean(value));
function clean(value:unknown):unknown{if(Array.isArray(value))return value.map(clean);if(!value||typeof value!=='object')return value;return Object.fromEntries(Object.entries(value).filter(([key,item])=>item!==undefined&&!['fieldId','id','overrideOf','inheritance','inheritFrom','prefillAudit','sourceRuntimeField'].includes(key)).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>[key,clean(item)]));}
/** An immutable transaction: detach materializes; reattach refuses conflicts. */
export function changeNodeInheritance(input:ConfigPackageV3,nodeId:string,module:keyof InheritanceControls,enabled:boolean):ConfigPackageV3{
  const original=input.nodes.find(node=>node.nodeId===nodeId);if(!original)throw Error('分类不存在。');
  const controls=inheritanceControls(original);
  if(input.contractRevision<18)return {...input,nodes:input.nodes.map(node=>node.nodeId===nodeId?{...node,inheritDown:{...controls,[module]:enabled}}:node)};
  if(enabled&&module!=='fields'&&!controls.fields)throw Error('请先启用字段向下继承。');
  const config=structuredClone(input),source=config.nodes.find(node=>node.nodeId===nodeId)!;
  const descendants=input.nodes.filter(node=>node.nodeId!==nodeId&&classificationContains(original.path,node.path));
  if(!enabled){
    for(const prior of descendants){const node=config.nodes.find(node=>node.nodeId===prior.nodeId)!;
      if(module==='fields')node.fields=structuredClone(resolveEffectiveFields(input,prior.path)).map(field=>({...field,inheritance:'overridable'}));
      if(module==='fields'||module==='display'){
        node.geometryProfiles=Object.fromEntries((['Point','LineString','Polygon'] as const).flatMap(kind=>{const profile=resolveGeometryProfile(input,prior.path,kind);return profile?[[kind,structuredClone(profile)]]:[];}));
        node.displaySettings={structure:structuredClone(resolveNodeFieldSettings(input,prior.path).value.structure)};
      }
      if(module==='fields'||module==='card'){
        node.card=structuredClone(resolveCardConfiguration(input,prior.path));
        if(node.card?.mode==='fields')node.card.items=node.card.items.map(item=>{const copy={...item};delete copy.inheritFrom;return copy;});
      }
      if(module==='fields'||module==='search')node.searchSettings=structuredClone(resolveNodeFieldSettings(input,prior.path).value.search);
      const detached=module==='fields'?{fields:false,display:false,card:false,search:false}:{[module]:false};
      node.receiveFromParent={...node.receiveFromParent,...detached};
    }
    source.inheritDown={...controls,...(module==='fields'?{fields:false,display:false,card:false,search:false}:{[module]:false})};return config;
  }
  const incomingFields=resolveEffectiveFields(input,original.path),problems:string[]=[];
  for(const child of descendants){
    const own=resolveEffectiveFields(input,child.path);
    if(module==='fields')for(const field of incomingFields){const candidate=own.find(item=>item.key===field.key);if(!candidate||semantic(candidate)!==semantic(field))problems.push(`${classificationPathKey(child.path)} / ${field.key}：字段定义不同或缺失`);}
    if(module==='display')for(const geometry of ['Point','LineString','Polygon'] as const){const incoming=resolveGeometryProfile(input,original.path,geometry),local=resolveGeometryProfile(input,child.path,geometry);if(incoming&&local&&semantic(incoming)!==semantic(local))problems.push(`${classificationPathKey(child.path)} / ${geometry}：渲染设置不同`);}
    if(module==='card'){
      const incoming=resolveCardConfiguration(input,original.path),local=resolveCardConfiguration(input,child.path);
      const matches=incoming?.mode==='fields'&&local?.mode==='fields'
        ? incoming.items.every(item=>local.items.some(candidate=>semantic(candidate)===semantic(item)))
        : semantic(incoming)===semantic(local);
      if(!matches)problems.push(`${classificationPathKey(child.path)}：信息卡继承项不同或缺失`);
    }
    if(module==='search'){const incoming=resolveNodeFieldSettings(input,original.path).value.search,local=resolveNodeFieldSettings(input,child.path).value.search;if(incoming&&local&&semantic(incoming)!==semantic(local))problems.push(`${classificationPathKey(child.path)}：搜索设置不同`);}
  }
  if(problems.length)throw Error('重建继承前发现不一致，未修改任何绑定。请处理后重试：\n'+problems.join('\n'));
  source.inheritDown={...controls,[module]:true};
  // A stopped intermediate branch keeps its materialized copy. Independent
  // fields/card rows/profiles survive reattachment; only matching inherited
  // definitions are relinked.
  for(const child of descendants.sort((a,b)=>Object.values(a.path).filter(Boolean).length-Object.values(b.path).filter(Boolean).length)){
    const node=config.nodes.find(node=>node.nodeId===child.nodeId)!;
    node.receiveFromParent={...node.receiveFromParent,[module]:true};
    const parents=config.nodes.filter(candidate=>candidate.nodeId!==node.nodeId&&classificationContains(candidate.path,node.path)).sort((a,b)=>Object.values(b.path).filter(Boolean).length-Object.values(a.path).filter(Boolean).length);
    const parent=parents[0];if(!parent||!inheritanceControls(parent)[module])continue;
    if(module==='fields'){
      const incoming=resolveEffectiveFields(config,parent.path);
      for(const field of incoming){const local=node.fields.find(item=>item.key===field.key);if(local&&semantic(local)!==semantic(field))throw Error('重建继承前发现中间分类字段冲突，未修改任何绑定：'+classificationPathKey(node.path)+' / '+field.key);}
      node.fields=node.fields.filter(field=>!incoming.some(item=>item.key===field.key&&semantic(item)===semantic(field)));
    }
    if(module==='display'){
      for(const geometry of ['Point','LineString','Polygon'] as const){const incoming=resolveGeometryProfile(config,parent.path,geometry);if(incoming&&semantic(incoming)===semantic(node.geometryProfiles[geometry]))delete node.geometryProfiles[geometry];}
      const structure=resolveNodeFieldSettings(config,parent.path).value.structure;
      if(structure&&semantic(structure)===semantic(node.displaySettings?.structure))delete node.displaySettings;
    }
    if(module==='card'){const incoming=resolveCardConfiguration(config,parent.path),local=node.card;if(incoming?.mode==='fields'&&local?.mode==='fields'&&!incoming.items.every(item=>local.items.some(candidate=>semantic(candidate)===semantic(item))))throw Error('重建继承前发现中间分类信息卡冲突，未修改任何绑定：'+classificationPathKey(node.path));linkCardInheritance(node,incoming,parent.nodeId);}
    if(module==='search'&&semantic(resolveNodeFieldSettings(config,parent.path).value.search)===semantic(node.searchSettings))delete node.searchSettings;
  }
  return config;
}
