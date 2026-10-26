import {effectiveOptions} from './lookupTables';
import type {ClassificationPath,ConfigPackageV3,ExternalReferenceBinding,ExternalReferenceSource,ExternalRole,ExternalRoleBinding,GeometryKind,MountedFeatureRecord,WorkflowDefinition} from './types';
import {classificationPathKey,hasCategoryNode,hasDescendants,pathMatchesScope,resolveEffectiveFields,resolveGeometryProfile} from './runtime';
import {EXTERNAL_COMPONENT_ROLES,EXTERNAL_ROLES} from './externalCapabilities';
import {legacyExternalRoleBindings} from './externalLegacyBindings';
import {findV3SearchCandidates} from './workflowKernel';
import {recordCategory} from './multipartPolicy';
import {migrationReferenceBindings} from './c16Migration';

export function externalRoleBindings(config:ConfigPackageV3,workflow:WorkflowDefinition):ExternalRoleBinding[]{
 return config.contractRevision>=16?workflow.external?.roleBindings??[]:legacyExternalRoleBindings(config,workflow);
}
export function expandBindingGroup(config:ConfigPackageV3,group:ExternalRoleBinding['classificationGroup'],geometry?:GeometryKind):ClassificationPath[]{
 const result=new Map<string,ClassificationPath>();
 for(const selector of group.selectors){
  if(!hasCategoryNode(config,selector.path))throw Error('绑定分类不存在：'+classificationPathKey(selector.path));
  if(!['self','leafDescendants'].includes(selector.mode))throw Error('未知分类绑定选择方式。');
  const paths=selector.mode==='self'?[selector.path]:config.nodes.filter(node=>pathMatchesScope(node.path,selector.path)&&!hasDescendants(config,node.path)).map(node=>node.path);
  for(const path of paths)if(!geometry||resolveGeometryProfile(config,path,geometry)?.enabled)result.set(classificationPathKey(path),path);
 }
 return [...result.values()];
}
export function externalRolePaths(config:ConfigPackageV3,workflow:WorkflowDefinition,role:ExternalRole):ClassificationPath[]{
 if(!EXTERNAL_COMPONENT_ROLES[workflow.external?.componentKey??'']?.includes(role))throw Error('此专用组件不支持角色 '+role+'。');
 const bindings=externalRoleBindings(config,workflow).filter(binding=>binding.role===role);
 if(bindings.length!==1)throw Error(EXTERNAL_ROLES[role].label+'需要唯一的输出角色绑定。');
 const paths=expandBindingGroup(config,bindings[0].classificationGroup,EXTERNAL_ROLES[role].geometry);
 if(!paths.length)throw Error(EXTERNAL_ROLES[role].label+'绑定范围没有可用分类。');
 return paths;
}
export function externalSingleRolePath(config:ConfigPackageV3,workflow:WorkflowDefinition,role:ExternalRole):ClassificationPath{
 const paths=externalRolePaths(config,workflow,role);
 if(paths.length!==1)throw Error(EXTERNAL_ROLES[role].label+'需要明确选择一个实际输出分类，不能自动采用首项。');
 return {...paths[0]};
}
export function resolveExternalReference(config:ConfigPackageV3,workflow:WorkflowDefinition,bindingId:string,seen=new Set<string>()):Extract<ExternalReferenceBinding,{classificationGroup:unknown}>{
 const identity=workflow.id+'/'+bindingId;
 if(seen.size>=32)throw Error('专用引用超过 32 级，已停止解析。');
 if(seen.has(identity))throw Error('专用引用绑定存在循环：'+identity);seen.add(identity);
 const definitions=workflow.external?.referenceBindings??(config.contractRevision<16&&['tradePointWorkflow','tradePointEditor'].includes(workflow.external?.componentKey??'')?migrationReferenceBindings(config):[]);
 const bindings=definitions.filter(binding=>binding.bindingId===bindingId);
 if(bindings.length!==1)throw Error('专用引用绑定缺失或重复：'+identity);
 const binding=bindings[0];
 if(binding.source){
  const sources=config.workflows.filter(row=>row.id===binding.source!.workflowId);
  if(sources.length!==1||sources[0].mode!=='external')throw Error('专用引用来源工作流不存在或不唯一。');
  return resolveExternalReference(config,sources[0],binding.source.bindingId,seen);
 }
 return binding;
}
export function resolveExternalReferenceSource(config:ConfigPackageV3,source:ExternalReferenceSource){
 const workflows=config.workflows.filter(row=>row.id===source.workflowId);
 if(workflows.length!==1)throw Error('引用来源工作流不存在或不唯一：'+source.workflowId);
 return resolveExternalReference(config,workflows[0],source.bindingId);
}
export function externalReferenceCandidates(config:ConfigPackageV3,workflow:WorkflowDefinition,bindingId:string,records:MountedFeatureRecord[],query:string,world:string){
 const binding=resolveExternalReference(config,workflow,bindingId),paths=new Set(expandBindingGroup(config,binding.classificationGroup).map(classificationPathKey));
 const filtered=records.filter(record=>paths.has(classificationPathKey(recordCategory(record))));
 return findV3SearchCandidates(filtered,{...binding.search,target:{class:''}},query,world,config);
}
export type ExternalBindingIssue={path:string;message:string};
export function externalBindingIssues(config:ConfigPackageV3):ExternalBindingIssue[]{
 if(config.contractRevision<16)return [];
 const issues:ExternalBindingIssue[]=[],fail=(path:string,message:string)=>issues.push({path,message});
 for(const workflow of config.workflows.filter(row=>row.mode==='external')){
  const base='workflows/'+workflow.id+'/external',external=workflow.external,expected=EXTERNAL_COMPONENT_ROLES[external?.componentKey??''];
  if(!expected){fail(base,'外部组件未登记。');continue;}
  if(external?.coveredClassifications!==undefined)fail(base+'/coveredClassifications','c16 必须使用角色绑定，不能保留旧范围副本。');
  for(const role of expected)try{
   const paths=externalRolePaths(config,workflow,role),spec=EXTERNAL_ROLES[role];
   for(const path of paths){
    const fields=resolveEffectiveFields(config,path),at=base+'/roleBindings/'+role+'/'+classificationPathKey(path);
    for(const [key,types]of Object.entries(spec.fields)){
     const field=fields.find(row=>row.key===key);
     if(!field||!types.includes(field.type))fail(at+'/'+key,'专用角色所需字段不存在或类型不符：'+key);
     if(field?.type==='json'&&field.valueSchema&&field.valueSchema.type!=='array'&&!field.valueSchema.anyOf?.some(schema=>schema.type==='array'))fail(at+'/'+key,'专用结构化字段需要明确的数组值格式：'+key);
     if(field?.type==='enum'&&key==='direction'){if(field.optionValueType!=='number')fail(at+'/'+key,'线路方向枚举必须保存数字。');else if(Array.from({length:8},(_,i)=>String(i)).some(value=>!effectiveOptions(config,field).some(option=>option.value===value)))fail(at+'/'+key,'线路方向枚举须接纳专用算法的 0–7 保存值。');}
    }
   }
  }catch(error){fail(base+'/roleBindings/'+role,error instanceof Error?error.message:String(error));}
  const seen=new Set<string>();
  for(const binding of external?.roleBindings??[]){
   if(!expected.includes(binding.role))fail(base+'/roleBindings','组件不支持角色 '+binding.role);
   for(const path of (()=>{try{return expandBindingGroup(config,binding.classificationGroup,EXTERNAL_ROLES[binding.role]?.geometry);}catch{return [];}})()){
    const key=classificationPathKey(path);if(seen.has(key))fail(base+'/roleBindings','多个角色绑定到同一分类，存在歧义：'+key);seen.add(key);
   }
  }
  const ids=new Set<string>();
  if(['tradePointWorkflow','tradePointEditor'].includes(external?.componentKey??''))for(const id of ['landUnit','settlementPoint','settlementArea'])if(!external?.referenceBindings?.some(binding=>binding.bindingId===id))fail(base+'/referenceBindings/'+id,'缺少交易点关联用途的明确绑定。');
  for(const binding of external?.referenceBindings??[])try{
   const at=base+'/referenceBindings/'+binding.bindingId;
   if(!binding.bindingId||ids.has(binding.bindingId))throw Error('引用键为空或重复。');ids.add(binding.bindingId);
   const resolved=resolveExternalReference(config,workflow,binding.bindingId),paths=expandBindingGroup(config,resolved.classificationGroup);
   if(!paths.length)throw Error('引用范围为空。');
   if(!['world','loadedWorlds'].includes(resolved.search.cacheScope))throw Error('引用世界范围无效。');
   if(!resolved.search.queryFields?.length||!resolved.search.returnField)throw Error('引用需要查询字段和返回字段。');
   const geometry=({landUnit:'Polygon',settlementPoint:'Point',settlementArea:'Polygon'} as Record<string,GeometryKind>)[binding.bindingId];
   if(geometry&&paths.some(path=>!resolveGeometryProfile(config,path,geometry)?.enabled))throw Error('引用范围包含不支持 '+geometry+' 的分类。');
   for(const [key,min,max]of [['minQueryLength',0,100],['maxResults',1,500],['debounceMs',0,5000]] as const){const value=resolved.search[key];if(value!==undefined&&(!Number.isInteger(value)||value<min||value>max))throw Error('引用检索参数 '+key+' 超出范围。');}
   for(const path of paths){const fields=resolveEffectiveFields(config,path);const returned=resolved.search.returnField;if(returned!=='ID'&&!fields.some(field=>field.key===returned&&['string','reference'].includes(field.type)))throw Error('专用引用返回字段必须为文本 ID 或引用字段。');}
   const displayFields=[...(resolved.search.displayTemplate??'').matchAll(/{{\s*([A-Za-z][A-Za-z0-9_.]*)\s*}}/g)].map(match=>match[1]);
   for(const path of paths)for(const key of [...resolved.search.queryFields,resolved.search.returnField,...displayFields]){
    if(!['ID','World','Class','Kind','SKind','SKind2'].includes(key)&&!resolveEffectiveFields(config,path).some(field=>field.key===key))fail(at,'引用目标缺少字段 '+key+'：'+classificationPathKey(path));
   }
  }catch(error){fail(base+'/referenceBindings/'+binding.bindingId,error instanceof Error?error.message:String(error));}
 }
 for(const node of config.nodes)if(node.card?.mode==='component'){
  const sources=node.card.options?.referenceBindings;
  if(node.card.componentKey==='TRP'&&(!sources||typeof sources!=='object'||!('landUnit' in sources)))fail('nodes/'+node.nodeId+'/card/options/referenceBindings','交易组件卡片需要明确的地理单元引用来源。');
  if(sources!==undefined){
   if(!sources||typeof sources!=='object'||Array.isArray(sources)){fail('nodes/'+node.nodeId+'/card/options/referenceBindings','卡片引用绑定必须为对象。');continue;}
   for(const [key,raw]of Object.entries(sources))try{if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('卡片引用来源无效。');const binding=resolveExternalReferenceSource(config,raw as ExternalReferenceSource),geometry=({landUnit:'Polygon',settlementPoint:'Point',settlementArea:'Polygon'} as Record<string,GeometryKind>)[key];if(geometry&&expandBindingGroup(config,binding.classificationGroup).some(path=>!resolveGeometryProfile(config,path,geometry)?.enabled))throw Error('卡片引用来源与 '+key+' 的几何用途不相容。');}catch(error){fail('nodes/'+node.nodeId+'/card/options/referenceBindings/'+key,error instanceof Error?error.message:String(error));}
  }
 }
 return issues;
}
