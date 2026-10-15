import type { ApplicationAttribution, ApplicationProjection, ApplicationResourceGroup, ApplicationSettings, ApplicationSourceSettings, ApplicationTileProfile, ApplicationTiles, ApplicationWorld, ApplicationWorldGroups, ResolvedApplicationSettings, ResolvedApplicationWorld } from './applicationTypes';

export const DYNMAP_FLAT_PRESET: ApplicationProjection = { id:'dynmap-flat',worldToMap:[4,0,0,0,0,-4,0,1,0],mapToWorld:[0.25,0,0,0,0,1,0,-0.25,0],mapzoomin:2,mapzoomout:3,tileSize:128,tilescale:0 };
export const DEFAULT_TILE_SETTINGS = { prefix:'flat',imageFormat:'jpg' as const,extraZoomLevels:2,minNativeZoom:-2,maxNativeZoom:3,maxRetries:3,retryDelay:1000 };
/** Matches the deployed Vite/Vercel mapping. New proxies require deployment registration. */
export const REGISTERED_TILE_PROXIES = [{id:'ria-satellite',name:'RIA Satellite 同源代理',target:'https://satellite.ria.red/map/',path:'/api/dynmap/'}] as const;
export const isWorldGroups=(sources:ApplicationSettings['sources']):sources is ApplicationWorldGroups=>'kind' in sources&&sources.kind==='world-groups';
const stable=(value:unknown):string=>JSON.stringify(value,(_key,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.entries(item).sort(([a],[b])=>a.localeCompare(b))):item);
const escape=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

export function attributionMarkup(value:ApplicationAttribution):string {
  const name=escape(value.name||value.legacyText||'');
  return value.url?`&copy; <a href="${escape(value.url)}">${name}</a>`:name;
}
export function migrateAttribution(value:string):ApplicationAttribution {
  const match=value.match(/^\s*(?:&copy;|©)?\s*<a\s+href=["'](https?:\/\/[^"']+)["']\s*>([^<>]+)<\/a>\s*$/i);
  if(match)return {name:match[2],url:match[1]};
  return {name:value.replace(/<[^>]*>/g,'').replace(/&copy;/g,'©').trim(),...(value.includes('<')?{legacyText:value}:{})};
}
export function expandWorldTemplate(template:string,worldKey:string):string {
  if(!/^[A-Za-z0-9_.-]+$/.test(worldKey)||worldKey==='.'||worldKey==='..')throw Error('远端世界键必须是合法路径段。');
  if(/[{}]/.test(template.split('{world}').join(''))||template.includes('..')||template.includes('\\'))throw Error('世界路径模板包含未知 token 或非法路径。');
  return template.split('{world}').join(encodeURIComponent(worldKey));
}
export function resourceGroupForWorld(application:ApplicationSettings,worldId:string):ApplicationResourceGroup|undefined {
  if(!isWorldGroups(application.sources))return undefined;
  const id=application.sources.bindings[worldId]??application.sources.defaultGroupId;
  const group=application.sources.groups.find(group=>group.id===id);
  if(!group||!group.enabled)throw Error(`世界 ${worldId} 的来源配置组 ${id} 不存在或未启用。`);
  return group;
}
export function defaultSourceSettings(application:ApplicationSettings):ApplicationSourceSettings {
  const sources=application.sources;if(!isWorldGroups(sources))return sources;
  const group=sources.groups.find(group=>group.id===sources.defaultGroupId);
  if(!group||!group.enabled)throw Error('默认来源配置组不存在或未启用。');
  return group.sources;
}
export function resolveGroupTiles(profile:ApplicationTileProfile,worldKey:string):ApplicationTiles {
  const baseUrl=expandWorldTemplate(profile.baseUrlTemplate,worldKey);
  let filteredBaseUrl=baseUrl;
  if(profile.filteredAccess==='registered-proxy'){
    const proxy=REGISTERED_TILE_PROXIES.find(proxy=>proxy.id===profile.proxyId);
    if(!proxy||!baseUrl.startsWith(proxy.target))throw Error('瓦片代理未注册或与实际原图目标不一致，请部署对应代理或使用支持 CORS 的直连。');
    filteredBaseUrl=proxy.path+baseUrl.slice(proxy.target.length);
  }
  if(profile.legacyFilteredTemplate)throw Error('历史滤镜代理地址尚未确认部署映射，已保留，请选择已注册代理或明确使用直连。');
  return {...DEFAULT_TILE_SETTINGS,...Object.fromEntries(Object.entries(profile).filter(([key,value])=>key in DEFAULT_TILE_SETTINGS&&value!==undefined)),baseUrl,filteredBaseUrl,attribution:attributionMarkup(profile.attribution)} as ApplicationTiles;
}
export function resolveApplicationWorld(application:ApplicationSettings,world:ApplicationWorld):ResolvedApplicationWorld {
  const group=resourceGroupForWorld(application,world.id);
  if(!group){
    if(!world.tiles||!world.projection||!world.dataSourceId)throw Error(`旧世界 ${world.id} 的来源／投影／瓦片配置不完整。`);
    return world as ResolvedApplicationWorld;
  }
  return {...world,dataSourceId:group.sources.defaultSourceId,projection:world.projectionOverride??DYNMAP_FLAT_PRESET,tiles:resolveGroupTiles(group.tiles,world.remoteWorldId??world.id)};
}
export function resolveApplicationSettings(application:ApplicationSettings):ResolvedApplicationSettings {
  return {...application,sources:defaultSourceSettings(application),worlds:application.worlds.map(world=>resolveApplicationWorld(application,world))};
}
function templateFromWorld(value:string,world:string):string {
  try { const url=new URL(value,'https://placeholder.invalid');url.pathname=url.pathname.split('/').map(part=>part===world?'{world}':part===`_${world}`?'_{world}':part).join('/');return (value.startsWith('/')?url.pathname:url.toString()).replace(/%7Bworld%7D/g,'{world}'); }
  catch {return value;}
}
export function migrateApplicationResources(value:ApplicationSettings):ApplicationSettings {
  if(isWorldGroups(value.sources))return structuredClone(value);
  const next=structuredClone(value),groups:ApplicationResourceGroup[]=[],bindings:Record<string,string>={},keys=new Map<string,string>();
  for(const world of next.worlds){
    if(!world.tiles||!world.projection||!world.dataSourceId)throw Error(`世界 ${world.id} 无法迁移：旧设置不完整。`);
    const {baseUrl,filteredBaseUrl,attribution,...settings}=world.tiles;
    const baseUrlTemplate=templateFromWorld(baseUrl,world.id),filteredTemplate=templateFromWorld(filteredBaseUrl,world.id);
    const proxy=REGISTERED_TILE_PROXIES.find(row=>baseUrlTemplate.startsWith(row.target)&&filteredTemplate===row.path+baseUrlTemplate.slice(row.target.length));
    const tiles:ApplicationTileProfile={baseUrlTemplate,filteredAccess:proxy?'registered-proxy':'direct',...(proxy?{proxyId:proxy.id}:{}),...(!proxy&&filteredTemplate!==baseUrlTemplate?{legacyFilteredTemplate:filteredTemplate}:{}),attribution:migrateAttribution(attribution)};
    for(const key of Object.keys(DEFAULT_TILE_SETTINGS) as Array<keyof typeof DEFAULT_TILE_SETTINGS>)if(settings[key]!==DEFAULT_TILE_SETTINGS[key])(tiles as unknown as Record<string,unknown>)[key]=settings[key];
    const sources:ApplicationSourceSettings={...structuredClone(value.sources),defaultSourceId:world.dataSourceId};
    const key=stable({sources,tiles});let id=keys.get(key);
    if(!id){id=groups.length?'server-'+(groups.length+1):'default';keys.set(key,id);if(id!=='default'){sources.storageKey+=':'+id;sources.linkModes.storageKey+=':'+id;sources.linkModes.legacyStorageKeys=[];}groups.push({id,label:{zh:groups.length?`独立服务器 ${groups.length+1}`:'默认共享来源',en:''},enabled:true,sources,dataPathTemplate:'',mediaPathTemplate:'',tiles});}
    if(id!=='default')bindings[world.id]=id;
    if(stable(world.projection)!==stable(DYNMAP_FLAT_PRESET))world.projectionOverride=world.projection;
    delete world.dataSourceId;delete world.projection;delete world.tiles;
  }
  next.sources={kind:'world-groups',defaultGroupId:'default',sharedInterfaceGroupId:'default',groups,bindings};return next;
}

export function validateResourceGroups(application:ApplicationSettings):Array<{path:string;message:string}> {
  if(!isWorldGroups(application.sources))return [];
  const issues:Array<{path:string;message:string}>=[],fail=(path:string,message:string)=>issues.push({path,message});
  const config=application.sources,ids=new Set<string>(),storage=new Set<string>(),worlds=new Set(application.worlds.map(world=>world.id));
  for(const group of config.groups){
    const path=`sources/groups/${group.id}`;
    if(!/^[A-Za-z0-9_-]+$/.test(group.id)||['__proto__','constructor','prototype'].includes(group.id)||ids.has(group.id))fail(path,'来源组 ID 非法或重复。');ids.add(group.id);
    if(!(group.label.zh.trim()||group.label.en.trim()))fail(path,'来源组至少需要一种语言的名称。');
    if(!group.sources.storageKey.trim()||storage.has(group.sources.storageKey))fail(path,'各来源组须使用不同且非空的选源状态存储键。');storage.add(group.sources.storageKey);
    if(!group.sources.linkModes.storageKey.trim()||storage.has(group.sources.linkModes.storageKey))fail(path,'来源组链接模式存储键须独立且非空。');storage.add(group.sources.linkModes.storageKey);
    if(!['fixed','user-select','user-select-on-failure'].includes(group.sources.selectionMode))fail(path,'未知来源选择方式。');
    const sourceIds=new Set<string>();
    for(const source of group.sources.items){
      if(!/^[A-Za-z0-9_-]+$/.test(source.id)||sourceIds.has(source.id))fail(path,'组内数据源 ID 非法或重复。');sourceIds.add(source.id);
      for(const [key,url] of [['rootUrl',source.rootUrl],['mediaRootUrl',source.mediaRootUrl]] as const)if(url||key==='rootUrl')try{const value=new URL(url);if(!['http:','https:'].includes(value.protocol)||value.username||value.password)throw Error();}catch{fail(path+'/'+key,'数据／媒体来源须为无凭据的 HTTP(S) 地址。');}
      if(source.readerKind!=='formal-release-v2'||source.readerSchemaVersion!=='openriamap.formal-release-reader.v2')fail(path,'未知读取协议；当前只支持 formal-release-v2。');
      if(!['direct','github-raw-compatible'].includes(source.transport))fail(path,'未知数据访问方式。');
      if(source.transport==='github-raw-compatible'&&!group.sources.github.sourceIds.includes(source.id))fail(path,'GitHub 访问方式未绑定该组数据源。');
    }
    if(!group.sources.items.some(source=>source.id===group.sources.defaultSourceId&&source.enabled))fail(path,'组内默认数据源不存在或未启用。');
    if(group.sources.github.sourceIds.some(id=>!sourceIds.has(id)))fail(path,'组内 GitHub 来源引用不存在。');
    if(group.sources.linkModes.items.filter(mode=>mode.default).length!==1)fail(path,'组内须有一个默认链接模式。');
    const modeIds=new Set<string>();for(const mode of group.sources.linkModes.items){if(!/^[A-Za-z0-9_-]+$/.test(mode.id)||modeIds.has(mode.id))fail(path,'链接模式 ID 非法或重复。');modeIds.add(mode.id);try{const url=new URL(mode.baseUrl);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error();}catch{fail(path,'链接模式根地址须为无凭据的 HTTP(S) 地址。');}}
    for(const part of [group.sources.github.owner,group.sources.github.repo,group.sources.github.branch])if(!part||!/^[A-Za-z0-9_.\/-]+$/.test(part)||part.includes('..'))fail(path,'组内 GitHub 仓库参数非法。');
    try {
      for(const template of [group.dataPathTemplate,group.mediaPathTemplate]){expandWorldTemplate(template,'world');if(template.startsWith('/')||/^[a-z]+:/i.test(template))throw Error('数据／媒体子路径模板须为根地址下的相对路径。');}
      const tile=resolveGroupTiles(group.tiles,'world'),url=new URL(tile.baseUrl);
      if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error('瓦片来源须为无凭据的 HTTP(S) 地址。');
      if(![tile.extraZoomLevels,tile.maxRetries].every(Number.isSafeInteger)||tile.extraZoomLevels<0||tile.extraZoomLevels>16||tile.maxRetries<0||tile.maxRetries>10||!Number.isFinite(tile.retryDelay)||tile.retryDelay<0)throw Error('瓦片额外级别／重试参数非法。');
      if(!Number.isInteger(tile.minNativeZoom)||!Number.isInteger(tile.maxNativeZoom)||tile.minNativeZoom>tile.maxNativeZoom||tile.minNativeZoom<application.preferences.map.leafletOffset||tile.maxNativeZoom>8+application.preferences.map.leafletOffset)throw Error('原生瓦片范围不在共享 Zoom 映射中。');
      if(group.tiles.attribution.url){const link=new URL(group.tiles.attribution.url);if(!['http:','https:'].includes(link.protocol)||link.username||link.password)throw Error('署名链接非法。');}
    }catch(error){fail(path,error instanceof Error?error.message:String(error));}
  }
  if(!config.groups.some(group=>group.id===config.defaultGroupId&&group.enabled))fail('sources/defaultGroupId','默认来源组必须存在且启用。');
  if(config.sharedInterfaceGroupId&&!ids.has(config.sharedInterfaceGroupId))fail('sources/sharedInterfaceGroupId','当前应用审核／玩家服务的来源组引用不存在。');
  for(const [world,id] of Object.entries(config.bindings))if(!worlds.has(world)||!config.groups.some(group=>group.id===id&&group.enabled))fail('sources/bindings/'+world,'绑定的世界或启用来源组不存在。');
  const normalizedWorlds=new Set<string>();for(const world of application.worlds){
    const normalized=world.id.toLowerCase();if(normalizedWorlds.has(normalized)||['__proto__','constructor','prototype'].includes(normalized))fail('worlds/'+world.id,'世界 ID 不能与另一世界仅大小写不同或使用保留名称。');normalizedWorlds.add(normalized);
    if(world.dataSourceId!==undefined||world.tiles!==undefined||world.projection!==undefined)fail('worlds/'+world.id,'来源组世界不能同时保存旧的零散数据源／投影／瓦片设置。');
    try{expandWorldTemplate('{world}',world.remoteWorldId??world.id);}catch(error){fail('worlds/'+world.id,String(error));}
  }
  return issues;
}
