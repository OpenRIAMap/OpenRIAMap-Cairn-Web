import type {ClassificationPath,ConfigPackageV3,FieldDefinition,GeometryKind,WorkflowOutput} from './types';
import {classificationPathKey,hasCategoryNode,hasDescendants,pathMatchesScope,resolveEffectiveFields,resolveGeometryProfile} from './runtime';

export type ClassificationGroupRow = {id:string;paths:ClassificationPath[];filtered:number;error?:string};
export type ClassificationGroupResult = {paths:ClassificationPath[];rows:ClassificationGroupRow[]};
const cache=new WeakMap<ConfigPackageV3,WeakMap<WorkflowOutput,ClassificationGroupResult>>();
const levels=['class','kind','skind','skind2'] as const;
const continuous=(path:ClassificationPath)=>Boolean(path?.class)&&levels.every((key,index)=>!path[key]||levels.slice(0,index).every(parent=>Boolean(path[parent])));
const same=(a:ClassificationPath,b:ClassificationPath)=>classificationPathKey(a)===classificationPathKey(b);

/** Legacy scopes retain terminal-only semantics; c15 never invents a first scope. */
export function workflowClassificationGroup(config:ConfigPackageV3,output:WorkflowOutput):ClassificationGroupResult {
  const prior=cache.get(config)?.get(output);if(prior)return prior;
  const selectors=config.contractRevision>=15?output.classificationGroup?.selectors??[]:output.classification?[{id:'legacy',mode:'leafDescendants' as const,path:output.classification}]:[];
  const rows:ClassificationGroupRow[]=selectors.map(selector=>{
    if(!continuous(selector.path)||!hasCategoryNode(config,selector.path))return {id:selector.id,paths:[],filtered:0,error:'分类路径不存在或不连续。'};
    if(!['self','leafDescendants'].includes(selector.mode))return {id:selector.id,paths:[],filtered:0,error:'分类指定方式无效。'};
    const expanded=selector.mode==='self'?[selector.path]:config.nodes.filter(node=>pathMatchesScope(node.path,selector.path)&&!hasDescendants(config,node.path)).map(node=>node.path);
    const paths=expanded.filter(path=>resolveGeometryProfile(config,path,output.geometry.selected)?.enabled);
    return {id:selector.id,paths,filtered:expanded.length-paths.length,...(!paths.length?{error:'此行没有启用固定绘制类型的可选分类。'}:{})};
  });
  const paths=[...new Map(rows.flatMap(row=>row.paths).map(path=>[classificationPathKey(path),path])).values()];
  const result={paths,rows};let outputs=cache.get(config);if(!outputs){outputs=new WeakMap();cache.set(config,outputs);}outputs.set(output,result);return result;
}
export const outputAcceptsClassification=(config:ConfigPackageV3,output:WorkflowOutput,path:ClassificationPath)=>workflowClassificationGroup(config,output).paths.some(candidate=>same(candidate,path));
export function workflowOutputFields(config:ConfigPackageV3,output:WorkflowOutput):FieldDefinition[]{
  if(config.contractRevision<15&&output.classification)return resolveEffectiveFields(config,output.classification);
  const paths=workflowClassificationGroup(config,output).paths,sets=paths.map(path=>new Map(resolveEffectiveFields(config,path).map(field=>[field.key,field])));
  return sets.length?[...sets[0].values()].filter(field=>sets.every(set=>{const other=set.get(field.key);return other&&other.type===field.type&&other.cardinality===field.cardinality&&other.coordinateFormat===field.coordinateFormat&&other.format===field.format&&JSON.stringify(other.reference)===JSON.stringify(field.reference)&&JSON.stringify(other.valueSchema)===JSON.stringify(field.valueSchema);})):[];
}
export function recordClassificationEligible(config:ConfigPackageV3,path:ClassificationPath,geometry:GeometryKind):boolean{
  return hasCategoryNode(config,path)&&(config.contractRevision>=15||!hasDescendants(config,path))&&Boolean(resolveGeometryProfile(config,path,geometry)?.enabled);
}
/** No output scope fallback for c15: an unselected union has no classification. */
export const outputPlaceholderPath=(output?:WorkflowOutput):ClassificationPath=>output?.classification??{class:''};
