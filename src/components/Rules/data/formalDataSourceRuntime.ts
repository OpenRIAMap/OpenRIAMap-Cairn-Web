import { getApplicationDefinition, applicationWorld } from '@/core/project/applicationRuntime';
import { defaultSourceSettings, expandWorldTemplate, resourceGroupForWorld } from '@/core/project/applicationResources';
import { createBrowserDataSourceSelectionStorage, createDataSourceSelectionController, parseDataSourceSelectionConfig, type DataSourceSelectionController, type DataSourceSelectionPolicy } from '@/core/dataSourceSelection';
import { getOpenRIAMapFormalDataSourceRuntimeConfig } from '@/core/project/openriamapRiaEnvironment';
import { buildRawCompatibleUrlFromParts, getCurrentSourceLinkMode } from './sourceLinkModes';

export type RuleDataSourceSnapshot = {
  worldId?:string; remoteWorldId?:string; resourceGroupId?:string;
  sourceId:string;label:string;readerKind:string;readerSchemaVersion:string;rootUrl:string;mediaRootUrl:string|null;transportId:string;generation:number;
};
type Entry={signature:string;controller:DataSourceSelectionController;config:ReturnType<typeof parseDataSourceSelectionConfig>};
const entries=new Map<string,Entry>();
function fingerprint(value:string):number{let hash=2166136261;for(let i=0;i<value.length;i++)hash=Math.imul(hash^value.charCodeAt(i),16777619);return hash>>>0;}
function context(worldId?:string){
  const application=getApplicationDefinition(),world=worldId?application.worlds.find(world=>world.id===worldId):applicationWorld('');
  if(!world)throw Error(`未定义世界：${worldId}`);
  const group=resourceGroupForWorld(application,world.id),settings=group?.sources??defaultSourceSettings(application);
  const id=group?.id??'legacy',signature=JSON.stringify(settings),existing=entries.get(id);
  let entry=existing;
  if(!entry||entry.signature!==signature){
    const runtime=getOpenRIAMapFormalDataSourceRuntimeConfig(world.id),config=parseDataSourceSelectionConfig(runtime.selection);
    for(const source of config.sources){const binding=runtime.bindings.find(binding=>binding.id===source.id);if(!binding||binding.readerKind!==source.readerKind||!binding.rootUrl||!binding.readerSchemaVersion)throw Error(`openriamap-formal-data-source:binding-invalid:${source.id}`);}
    entry={signature,config,controller:createDataSourceSelectionController({sources:config.sources,policy:config.policy,storage:createBrowserDataSourceSelectionStorage(),storageKey:config.storageKey})};entries.set(id,entry);
  }
  return {world,group,settings,entry,id};
}
export function getRuleDataSourceSelectionController(worldId?:string):DataSourceSelectionController{return context(worldId).entry.controller;}
export function getRuleDataSourceSelectionPolicy(worldId?:string):DataSourceSelectionPolicy{return {...context(worldId).entry.config.policy};}
export function isFormalGithubTransportSource(sourceId:string|null|undefined,worldId?:string):boolean{return !!sourceId&&context(worldId).settings.github.sourceIds.includes(sourceId);}
export function getFormalGithubTransportSourceIds(worldId?:string):string[]{return [...context(worldId).settings.github.sourceIds];}
function appendPath(root:string,template:string,world:string):string{return [root.replace(/\/+$/,''),expandWorldTemplate(template,world).replace(/^\/+|\/+$/g,'')].filter(Boolean).join('/');}

export function getRuleDataSourceSnapshot(worldId?:string):RuleDataSourceSnapshot {
  const {world,group,settings,entry,id}=context(worldId),state=entry.controller.getState();
  // Legacy imported packages retain their old behavior until explicit migration.
  const sourceId=!group&&state.sourceId===settings.defaultSourceId?world.dataSourceId??state.sourceId:state.sourceId;
  const source=settings.items.find(source=>source.id===sourceId);
  if(!source||!source.enabled)throw Error(`openriamap-formal-data-source:active-source-invalid:${sourceId}`);
  let root=source.rootUrl.replace(/\/+$/,''),transport=`direct:${root}`;
  if(source.transport==='github-raw-compatible'){
    if(!settings.github.sourceIds.includes(source.id))throw Error('GitHub 数据源未绑定该组。');
    const mode=getCurrentSourceLinkMode(world.id);
    root=buildRawCompatibleUrlFromParts(mode.rawCompatibleBaseUrl,{owner:settings.github.owner,repo:settings.github.repo,branch:settings.github.branch,path:''}).replace(/\/+$/,'');
    transport=`github-raw-compatible:${mode.id}:${root}`;
  }
  const remoteWorldId=world.remoteWorldId??world.id;
  root=appendPath(root,group?.dataPathTemplate??'',remoteWorldId);
  const mediaRootUrl=source.mediaRootUrl?appendPath(source.mediaRootUrl,group?.mediaPathTemplate??'',remoteWorldId):null;
  const signature=JSON.stringify({id,world:world.id,remoteWorldId,settings,path:group?.dataPathTemplate,media:group?.mediaPathTemplate});
  return {worldId:world.id,...(group?{resourceGroupId:group.id,remoteWorldId}:{}),sourceId:source.id,label:source.label.zh||source.label.en||source.id,readerKind:source.readerKind,readerSchemaVersion:source.readerSchemaVersion,rootUrl:root,mediaRootUrl,transportId:group?`group:${group.id}:${fingerprint(signature)}:${transport}`:transport,generation:fingerprint(signature)*1000000+state.generation};
}
export function retiredSourceNotice(worldId?:string):string {
  try{const raw=localStorage.getItem(context(worldId).entry.config.storageKey);if(raw&&JSON.parse(raw).sourceId==='legacy-github')return '旧兼容数据源已退役，请选择并显式应用现役正式来源。';}catch{}
  return '';
}
