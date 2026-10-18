import type { ApplicationSettings } from './applicationTypes';
import buttons from '../../../project-config/packages/openriamap-ria/environment/ruleButtons.json';
import sources from '../../../.cairn/formal-data-source-runtime.json';
import modes from '../../../project-config/packages/openriamap-ria/environment/sourceLinkModes.json';
import worlds from '../../../project-config/packages/openriamap-ria/environment/worlds.json';
const centers:Record<string,{x:number;y:number;z:number}>={zth:{x:-643,y:35,z:-1562},laputa:{x:272,y:64,z:104}};
const labels:Record<string,string>={zth:'零洲',eden:'伊甸',naraku:'奈落洲',houtu:'后土洲',laputa:'拉普塔',yunduan:'云端'};
const prefixes:Record<string,string>={zth:'Z',eden:'E',naraku:'N',houtu:'H',laputa:'L',yunduan:'Y'};
/** Public downstream settings only. OAuth/cloud secrets remain server-owned. */
export function defaultApplicationSettings():ApplicationSettings {
  return {
    schemaVersion:'cairnmap.application.v1',
    worlds:[...worlds.items].sort((a,b)=>['zth','eden','naraku','houtu','laputa','yunduan'].indexOf(a.id)-['zth','eden','naraku','houtu','laputa','yunduan'].indexOf(b.id)).map(world=>({id:world.id,prefix:prefixes[world.id],numericCode:world.numericCode,label:{zh:labels[world.id],en:''},enabled:world.id!=='yunduan',default:world.id==='zth',center:centers[world.id]??{x:0,y:64,z:0},mapLink:`https://satellite.ria.red/map/_${world.id}/`,dataSourceId:sources.selection.policy.defaultSourceId,
      projection:{id:'dynmap-flat',worldToMap:[4,0,0,0,0,-4,0,1,0],mapToWorld:[0.25,0,0,0,0,1,0,-0.25,0],mapzoomin:2,mapzoomout:3,tileSize:128,tilescale:0},
      tiles:{filteredBaseUrl:`/api/dynmap/_${world.id}/tiles/world/`,baseUrl:`https://satellite.ria.red/map/_${world.id}/tiles/world/`,prefix:'flat',imageFormat:'jpg',extraZoomLevels:2,minNativeZoom:-2,maxNativeZoom:3,attribution:'&copy; <a href="https://satellite.ria.red">RIA Satellite</a>',maxRetries:3,retryDelay:1000}})),
    buttons:{storageKey:buttons.storageKey,legacyStorageKeys:buttons.legacyStorageKeys??[],maxActive:buttons.policy.maxActive,fallback:buttons.defaults.fallback,byWorld:buttons.defaults.byWorld,items:buttons.items.map(({label,...item})=>({...item,tone:item.tone as ApplicationSettings['buttons']['items'][number]['tone'],names:{zh:label,en:''},size:36,group:'default'}))},
    sources:{storageKey:sources.selection.storageKey,defaultSourceId:sources.selection.policy.defaultSourceId,selectionMode:'user-select',retryOnFailure:true,
      items:sources.bindings.filter(binding=>binding.readerKind==='formal-release-v2').map(binding=>({...binding,readerKind:'formal-release-v2',readerSchemaVersion:'openriamap.formal-release-reader.v2',mediaRootUrl:binding.mediaRootUrl??'',transport:binding.transport as 'direct'|'github-raw-compatible',label:{zh:sources.selection.sources.find(item=>item.id===binding.id)!.label,en:''},enabled:true,selectable:true})),
      github:{sourceIds:sources.githubRawTransport.sourceIds,...sources.githubRawTransport.repository},linkModes:{storageKey:modes.storageKey,legacyStorageKeys:modes.legacyStorageKeys??[],items:modes.items.map(item=>({id:item.id,label:{zh:item.label,en:''},baseUrl:item.rawCompatibleBaseUrl,default:Boolean(item.default)}))}},
    modules:{items:(['mapping','measurement','navigation','search','review','players','settings','publicReleases'] as const).map(id=>({id,enabled:true,load:id==='mapping'||id==='measurement'||id==='review'?'lazy':'eager',exclusiveWith:id==='mapping'?['measurement','review']:id==='measurement'?['mapping','review']:id==='review'?['mapping','measurement']:[]})),players:{endpoint:'/api/dynmap/_{world}/up/world/world/{timestamp}',directEndpoint:'https://satellite.ria.red/map/_{world}/up/world/world/{timestamp}',mode:'proxy',pollIntervalMs:5000,requestTimeoutMs:10000}},
    review:{enabled:true,provider:'github-cookie',protocol:'openriamap-review-v1',auth:{start:'/api/auth/github/start',session:'/api/auth/github/session',logout:'/api/auth/github/logout'},control:'/api/review-control',workflow:'/api/review-workflow',publicReleases:'/api/public-review-releases',serverReferences:{oauthClientId:'CAIRN_GITHUB_OAUTH_CLIENT_ID',oauthRedirectUri:'CAIRN_GITHUB_OAUTH_REDIRECT_URI',sessionSigning:'CAIRN_SESSION_SIGNING_SECRET',controlApiBase:'CAIRN_CONTROL_API_BASE',brokerSecret:'CAIRN_BROKER_TO_DISPATCHER_SECRET'}},
    preferences:{language:'zh',search:{homepageLimit:35,navigationLimit:30,debounceMs:0},navigation:{transferWalkSpeed:3,railRideSpeed:16,transferCostFactor:1,normalPlatformTransferCost:5},map:{logicalInitialZoom:5,leafletOffset:-3,scrollWheelZoom:true,doubleClickZoom:true,dragging:true},toolbar:{position:'right',compact:false}},
  };
}
