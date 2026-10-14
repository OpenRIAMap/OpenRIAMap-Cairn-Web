import type { ApplicationSettings } from './applicationTypes';
export type ApplicationIssue={path:string;message:string};
export function validateApplication(value:ApplicationSettings,classCodes?:Set<string>):ApplicationIssue[]{
  const issues:ApplicationIssue[]=[],fail=(path:string,message:string)=>issues.push({path,message});
  const unique=(rows:Array<{id:string}>,path:string)=>{const ids=new Set<string>();for(const row of rows){if(!/^[A-Za-z0-9_-]+$/.test(row.id)||ids.has(row.id))fail(path,`ID 非法或重复：${row.id}`);ids.add(row.id);}return ids;};
  const url=(value:string,path:string,empty=false)=>{if(empty&&!value)return;try{const parsed=new URL(value);if(!['http:','https:'].includes(parsed.protocol)||parsed.username||parsed.password)throw Error();}catch{fail(path,'必须是无凭据的 HTTP(S) 地址。');}};
  const worlds=unique(value.worlds,'worlds'),buttons=unique(value.buttons.items,'buttons/items'),sources=unique(value.sources.items,'sources/items'),modes=unique(value.sources.linkModes.items,'sources/linkModes');
  if(value.worlds.filter(world=>world.enabled&&world.default).length!==1)fail('worlds','必须有且仅有一个启用的默认世界。');
  const numbers=new Set<number>(),prefixes=new Set<string>();
  for(const world of value.worlds){const path=`worlds/${world.id}`;
    if(!Number.isSafeInteger(world.numericCode)||world.numericCode<0||numbers.has(world.numericCode))fail(path,'世界数字编号必须唯一且为非负整数。');numbers.add(world.numericCode);
    if(!/^[A-Z]$/.test(world.prefix)||prefixes.has(world.prefix))fail(path,'简称必须是唯一的大写字母。');prefixes.add(world.prefix);
    if(!sources.has(world.dataSourceId)||world.enabled&&!value.sources.items.some(source=>source.id===world.dataSourceId&&source.enabled))fail(path,'世界绑定的数据源不存在或未启用。');
    if(!Object.values(world.center).every(Number.isFinite))fail(path,'世界中心必须是有限坐标。');
    url(world.mapLink,path+'/mapLink');url(world.tiles.baseUrl,path+'/tiles/baseUrl');if(!world.tiles.filteredBaseUrl.startsWith('/')||world.tiles.filteredBaseUrl.startsWith('//'))url(world.tiles.filteredBaseUrl,path+'/tiles/filteredBaseUrl');
    const projection=world.projection;if(projection.id!=='dynmap-flat'||projection.worldToMap.length!==9||projection.mapToWorld.length!==9||![...projection.worldToMap,...projection.mapToWorld].every(Number.isFinite))fail(path,'投影必须使用注册的 dynmap-flat 和两组 9 项有限参数。');
    if(![projection.mapzoomin,projection.mapzoomout,projection.tilescale,world.tiles.extraZoomLevels].every(number=>Number.isSafeInteger(number)&&number>=0&&number<=16))fail(path,'投影/瓦片缩放参数须为 0–16 整数。');
    if(!Number.isInteger(world.tiles.minNativeZoom)||!Number.isInteger(world.tiles.maxNativeZoom)||world.tiles.minNativeZoom>world.tiles.maxNativeZoom||world.tiles.minNativeZoom<value.preferences.map.leafletOffset||world.tiles.maxNativeZoom>8+value.preferences.map.leafletOffset)fail(path,'原生瓦片范围必须位于逻辑 Zoom 映射内且下限不大于上限。');
    if(!Number.isInteger(world.tiles.maxRetries)||world.tiles.maxRetries<0||world.tiles.maxRetries>10||!Number.isFinite(world.tiles.retryDelay)||world.tiles.retryDelay<0)fail(path,'瓦片重试次数/间隔无效。');
  }
  for(const button of value.buttons.items){const path=`buttons/${button.id}`;if(!['train','route','leaf','home','map','zap','shoppingCart','building2'].includes(button.iconKey))fail(path,'图标未注册。');
    if(classCodes)for(const code of button.criteria.classCode??[])if(!classCodes.has(code))fail(path,`绑定 Class 不存在：${code}`);
    const behavior=button.behavior;for(const target of [...behavior?.exclusiveWith??[],...behavior?.disableWhenEnabled??[],...behavior?.enableWhenEnabled??[],...(behavior?.linkedButtons??[]).map(row=>row.targetId)])if(target===button.id||!buttons.has(target))fail(path,`关联按钮不存在或引用自身：${target}`);
    const enables=new Set([...(behavior?.enableWhenEnabled??[]),...(behavior?.linkedButtons??[]).filter(row=>row.mode!=='disableWhenThisEnabled').map(row=>row.targetId)]),disables=new Set([...(behavior?.disableWhenEnabled??[]),...(behavior?.exclusiveWith??[]),...(behavior?.linkedButtons??[]).filter(row=>row.mode==='disableWhenThisEnabled').map(row=>row.targetId)]);for(const id of enables)if(disables.has(id))fail(path,`按钮同时要求开/关：${id}`);
  }
  const graph=new Map(value.buttons.items.map(button=>[button.id,[...button.behavior?.enableWhenEnabled??[],...button.behavior?.linkedButtons?.filter(row=>row.mode!=='disableWhenThisEnabled').map(row=>row.targetId)??[]]]));
  const walk=(id:string,stack:Set<string>,done:Set<string>)=>{if(stack.has(id)){fail('buttons','联动存在循环：'+id);return;}if(done.has(id))return;stack.add(id);for(const next of graph.get(id)??[])walk(next,stack,done);stack.delete(id);done.add(id);};const done=new Set<string>();for(const id of buttons)walk(id,new Set(),done);
  for(const [world,ids] of Object.entries(value.buttons.byWorld)){if(!worlds.has(world))fail('buttons/byWorld','默认按钮世界不存在：'+world);checkDefaults(ids,world);}checkDefaults(value.buttons.fallback,'fallback');
  function checkDefaults(ids:string[],context:string){if(new Set(ids).size!==ids.length||ids.some(id=>!buttons.has(id)))fail('buttons/defaults',`默认按钮重复或不存在：${context}`);if(value.buttons.maxActive>0&&ids.length>value.buttons.maxActive)fail('buttons/defaults',`默认数量超过上限：${context}`);for(const id of ids){const button=value.buttons.items.find(row=>row.id===id);if(button?.behavior?.exclusiveWith?.some(target=>ids.includes(target)))fail('buttons/defaults',`默认按钮互斥：${context}/${id}`);}}
  if(!Number.isInteger(value.buttons.maxActive)||value.buttons.maxActive<0)fail('buttons/maxActive','最大活动数须为非负整数。');
  if(!value.sources.items.some(source=>source.id===value.sources.defaultSourceId&&source.enabled))fail('sources/defaultSourceId','默认来源必须存在且启用。');
  for(const source of value.sources.items){url(source.rootUrl,`sources/${source.id}/rootUrl`);url(source.mediaRootUrl,`sources/${source.id}/mediaRootUrl`,true);if(source.readerKind!=='formal-release-v2'||source.readerSchemaVersion!=='openriamap.formal-release-reader.v2')fail('sources','只接受现役正式发布格式。');if(source.transport==='github-raw-compatible'&&!value.sources.github.sourceIds.includes(source.id))fail('sources','GitHub transport 缺少源绑定。');}
  for(const id of value.sources.github.sourceIds)if(!sources.has(id))fail('sources/github','镜像源不存在：'+id);
  if(![value.sources.github.owner,value.sources.github.repo,value.sources.github.branch].every(part=>part&&/^[A-Za-z0-9_.\/-]+$/.test(part)&&!part.includes('..')))fail('sources/github','仓库/分支参数无效。');
  if(!modes.size||value.sources.linkModes.items.filter(mode=>mode.default).length!==1)fail('sources/linkModes','必须有一个默认链接模式。');for(const mode of value.sources.linkModes.items)url(mode.baseUrl,`sources/linkModes/${mode.id}`);
  const modules=unique(value.modules.items,'modules');for(const module of value.modules.items)for(const id of module.exclusiveWith)if(!modules.has(id)||id===module.id)fail('modules','模块互斥目标不存在或是自身。');
  for(const id of ['mapping','measurement','navigation','search','review','players','settings','publicReleases'])if(!modules.has(id))fail('modules','缺少注册模块：'+id);
  for(const module of value.modules.items)if(!['mapping','measurement','review'].includes(module.id)&&module.load!=='eager')fail('modules','内置模块使用 eager 加载；按需/预载只用于注册分包。');
  for(const id of ['mapping','measurement','review'])for(const other of ['mapping','measurement','review'])if(id!==other&&!value.modules.items.find(module=>module.id===id)?.exclusiveWith.includes(other as 'mapping'|'measurement'|'review'))fail('modules','测绘、测量、审核必须保留单一活动工作区互斥关系。');
  if(value.modules.players.pollIntervalMs<1000||value.modules.players.requestTimeoutMs<1000)fail('modules/players','玩家轮询和超时不能小于 1000ms。');if(!value.modules.players.endpoint.startsWith('/')||value.modules.players.endpoint.startsWith('//'))url(value.modules.players.endpoint.replace('{timestamp}','0').replace('{world}','zth'),'modules/players/endpoint');url(value.modules.players.directEndpoint.replace('{timestamp}','0').replace('{world}','zth'),'modules/players/directEndpoint');
  for(const [key,path] of Object.entries({...value.review.auth,control:value.review.control,workflow:value.review.workflow,publicReleases:value.review.publicReleases}))if((value.review.enabled||path)&&(!path.startsWith('/')||path.startsWith('//')||path.includes('..')||/[?#]/.test(path)))fail('review/'+key,'审核使用同源绝对路径；启用时不可为空。');
  for(const ref of Object.values(value.review.serverReferences))if(!/^[A-Z][A-Z0-9_]*$/.test(ref))fail('review/serverReferences','仅保存服务端环境变量引用名。');
  const preferences=value.preferences;if(!Number.isInteger(preferences.map.leafletOffset)||Math.abs(preferences.map.leafletOffset)>8||!Number.isInteger(preferences.map.logicalInitialZoom)||preferences.map.logicalInitialZoom<0||preferences.map.logicalInitialZoom>8)fail('preferences/map','逻辑 Zoom 为 0–8，映射偏移须为 -8–8 整数。');
  for(const count of [preferences.search.homepageLimit,preferences.search.navigationLimit])if(!Number.isInteger(count)||count<1||count>200)fail('preferences/search','结果数量须为 1–200 整数。');if(!Number.isFinite(preferences.search.debounceMs)||preferences.search.debounceMs<0||preferences.search.debounceMs>2000)fail('preferences/search','延迟须为 0–2000ms。');
  for(const [key,number] of Object.entries(value.preferences.navigation))if(!Number.isFinite(number)||number<0||key!=='normalPlatformTransferCost'&&number===0)fail('preferences/navigation/'+key,'导航速度/系数必须为正有限数值，换乘成本可为零。');
  return issues;
}
