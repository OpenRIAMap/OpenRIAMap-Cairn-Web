import { getApplicationDefinition } from '@/core/project/applicationRuntime';
import { defaultSourceSettings, resourceGroupForWorld } from '@/core/project/applicationResources';
import { getRuleDataSourceSnapshot, type RuleDataSourceSnapshot } from './formalDataSourceRuntime';
import { formalObjectLayout, formalObjectUrl } from './formalObjectAccess';
import { FormalReleaseReaderError, readFormalReleaseSet, type FormalReleaseSet } from './formalReleaseReader';
import { fetchWorldMergeVersion, type RuleWorldVersion } from './worldRuleDatasetLoader';

export type WorldPublicationStatus = { worldId: string; state: 'published' | 'unpublished' | 'disabled' | 'error'; version: RuleWorldVersion; message?: string };
export function formalSourceErrorText(error:unknown):string {
  if(error instanceof FormalReleaseReaderError){
    if(error.status===401||error.status===403)return '远端访问被拒绝，请检查权限。';
    if(error.code==='network')return '远端网络读取失败。';
    if(error.code==='world-not-published')return '尚未发布';
    return `远端读取失败：${error.message}`;
  }
  return `远端读取失败：${error instanceof Error?error.message:String(error)}`;
}
export async function readWorldPublicationStatuses(worlds:readonly {id:string;enabled:boolean}[], sourceForWorld=getRuleDataSourceSnapshot):Promise<WorldPublicationStatus[]> {
  const sets=new Map<string,Promise<FormalReleaseSet>>();
  return Promise.all(worlds.map(async world=>{
    const empty={formalVersion:null,releaseId:''};
    if(!world.enabled)return {worldId:world.id,state:'disabled' as const,version:empty};
    try{
      const source=sourceForWorld(world.id),key=JSON.stringify([source.sourceId,source.resourceGroupId,source.rootUrl,formalObjectLayout(source)]);
      let pending=sets.get(key);if(!pending){pending=readFormalReleaseSet({source});sets.set(key,pending);}
      const set=await pending;
      if(!set.worlds.includes(source.remoteWorldId??world.id))return {worldId:world.id,state:'unpublished' as const,version:empty};
      return {worldId:world.id,state:'published' as const,version:await fetchWorldMergeVersion(world.id,undefined,source,set)};
    }catch(error){return {worldId:world.id,state:'error' as const,version:empty,message:formalSourceErrorText(error)};}
  }));
}
export type SourceComparison = {state:'same'|'different'|'unavailable'|'not-configured';text:string;checkedAt:number};
export async function compareFormalSourceVersions(worldId?:string):Promise<SourceComparison>{
  const application=getApplicationDefinition(),world=worldId??application.worlds.find(world=>world.default)?.id??application.worlds[0].id;
  const settings=resourceGroupForWorld(application,world)?.sources??defaultSourceSettings(application);
  const sources=settings.items.filter(source=>source.enabled&&source.readerKind==='formal-release-v2');
  const direct=sources.filter(source=>source.transport!=='github-raw-compatible'),mirrors=sources.filter(source=>source.transport==='github-raw-compatible');
  const authority=direct.find(source=>source.id===settings.defaultSourceId)??(direct.length===1?direct[0]:undefined);
  const active=getRuleDataSourceSnapshot(world);
  const mirror=mirrors.find(source=>source.id===active.sourceId)??(mirrors.length===1?mirrors[0]:undefined);
  if(!authority||!mirror)return {state:'not-configured',text:'当前来源组未配置可明确比较的权威来源与GitHub镜像。',checkedAt:Date.now()};
  const values=await Promise.allSettled([authority,mirror].map(source=>readFormalReleaseSet({source:getRuleDataSourceSnapshot(world,source.id)})));
  if(values.some(value=>value.status!=='fulfilled'))return {state:'unavailable',text:'尚未能完成来源比较；某一来源当前不可达或响应无效，不能据此认定镜像落后。',checkedAt:Date.now()};
  const [left,right]=values.map(value=>(value as PromiseFulfilledResult<FormalReleaseSet>).value);
  const same=left.releaseId===right.releaseId&&left.formalVersion===right.formalVersion&&JSON.stringify([...left.worlds].sort())===JSON.stringify([...right.worlds].sort());
  return {state:same?'same':'different',text:`${authority.label.zh||authority.id} v${left.formalVersion??'未分配'}；${mirror.label.zh||mirror.id} v${right.formalVersion??'未分配'}。${same?'发布身份一致。':'发布身份存在差异，请检查实际发布进度。'}`,checkedAt:Date.now()};
}
export function formalSourcePresentation(source:RuleDataSourceSnapshot){
  return {layout:formalObjectLayout(source)==='github-stable-v1'?'GitHub稳定镜像（Current / Release_Metadata / Data_Merge）':'COS发布目录（current/worlds / releases）',releaseSetUrl:formalObjectUrl(source,'current/worlds/_release-set.json'),worldPointerUrl:formalObjectUrl(source,`current/worlds/${source.remoteWorldId??source.worldId}.json`)};
}
