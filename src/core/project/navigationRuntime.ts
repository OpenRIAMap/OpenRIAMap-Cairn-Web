import { getApplicationDefinition } from './applicationRuntime';
import { getRuntimeConfiguration } from '../../configRuntime/runtimeDataView';
import type { ApplicationSettings } from './applicationTypes';
import type { ClassificationPath, ConfigPackageV3, LookupTable } from '../../configStudio/types';
import type { NavigationSettings, RailwayRole, RailwaySelectors } from './navigationTypes';
import { defaultNavigationSettings, defaultRailwaySelectors, matchesRaw } from './navigationDefinition';
import { defaultLookupTables } from '../../configStudio/lookupTables';
import { validateStructuredValue, valueSchemaTemplate } from '../../configStudio/valueSchema';
import { validateNavigationRecords } from '../../configStudio/navigationValidation';
import { readNavigationGeometry } from './navigationGeometry';

export type NavigationContext = {
  configuration?: ConfigPackageV3;
  native: boolean;
  settings: NavigationSettings;
  shared: RailwaySelectors;
  tables: LookupTable[];
  language: 'zh'|'en';
  sharedSignature: string;
  /** Algorithm dependencies only: editing display names must not rebuild graphs. */
  graphSignature: string;
  signature: string;
};
let cachedApplication: ApplicationSettings | undefined, cachedConfig: ConfigPackageV3 | undefined, cached: NavigationContext | undefined;
export function captureNavigationContext(): NavigationContext {
  const app=getApplicationDefinition(),config=getRuntimeConfiguration();
  if(app===cachedApplication&&config===cachedConfig&&cached)return cached;
  const native=Boolean(app.navigation),settings=structuredClone(app.navigation??defaultNavigationSettings(app.preferences.navigation));
  const shared=structuredClone(app.preferences.railwayRoles?.selectors??defaultRailwaySelectors());
  // Old contracts keep their historical constant-backed navigation behaviour.
  const tables=structuredClone(native?config?.lookupTables??[]:defaultLookupTables());
  const structure=config?.nodes.filter(n=>Object.values(shared).some(paths=>paths.some(p=>p.class===n.path.class))).map(n=>({path:n.path,geometryType:n.geometryType,inheritDown:n.inheritDown,receiveFromParent:n.receiveFromParent,fields:n.fields.map(f=>({key:f.key,type:f.type,cardinality:f.cardinality,valueSchema:f.valueSchema}))}));
  const sharedSignature=JSON.stringify({shared,structure,sources:app.sources,worlds:app.worlds.map(w=>({id:w.id,remoteWorldId:w.remoteWorldId,numericCode:w.numericCode,prefix:w.prefix}))});
  const {name:_railName,...rail}=settings.rail,{name:_teleportName,...teleport}=settings.teleport,{name:_roadName,...road}=settings.road;
  const algorithmTables=tables.filter(t=>t.id===settings.teleport.hubTableId||t.id===settings.road.travelModesTableId).map(t=>({id:t.id,valueType:t.valueType,functionKind:t.functionKind,rows:t.rows.map(r=>({value:r.value,functionValue:r.functionValue&&typeof r.functionValue==='object'&&'returnPoints' in r.functionValue?{...r.functionValue,returnPoints:r.functionValue.returnPoints.map(({label:_label,...point})=>point)}:r.functionValue}))}));
  cached={configuration:config,native,settings,shared,tables,language:app.preferences.language,sharedSignature,graphSignature:JSON.stringify({rail,teleport,road,common:settings.common,sharedSignature,tables:algorithmTables}),signature:JSON.stringify({settings,sharedSignature,tables,language:app.preferences.language})};
  cachedApplication=app;cachedConfig=config;return cached;
}
export function sharedRailMatches(role: RailwayRole, record: Record<string,unknown>, context=captureNavigationContext()): boolean { return matchesRaw(context.shared[role],record); }
export function navigationRailMatches(role: RailwayRole, record: Record<string,unknown>, context:NavigationContext): boolean { return sharedRailMatches(role,record,context)&&matchesRaw(context.settings.rail.selectors[role],record); }
export function navigationLabel(context:NavigationContext,key:'rail'|'teleport'|'road'):string {const label=context.settings[key].name;return label[context.language]||label.zh||label.en;}
export function navigationTable(context:NavigationContext,id:string,kind:'speed'|'teleportHub'):LookupTable {
  const table=context.tables.find(t=>t.id===id);
  if(!table||table.functionKind!==kind||table.valueType!=='string')throw Error(`导航绑定表 ${id} 不存在或格式不兼容。`);
  return table;
}
export function roadTravelProfiles(context=captureNavigationContext()):Array<{code:string;name:string;speed:number}> {
  if(!context.settings.road.enabled)return [];
  return navigationTable(context,context.settings.road.travelModesTableId,'speed').rows.map(row=>{
    if(typeof row.functionValue!=='number'||!Number.isFinite(row.functionValue)||row.functionValue<=0)throw Error('道路出行速度无效。');
    return {code:row.value,name:row.label[context.language]||row.label.zh||row.label.en||row.value,speed:row.functionValue};
  });
}
export function activeRailSelectors(context:NavigationContext):RailwaySelectors {return context.settings.rail.selectors;}
export function isRailStationPoint(record:Record<string,unknown>):boolean {
  if(record.Type==='Point'||record.Type==='Points')return true;
  if(record.Type==='Polygon'||record.Type==='Polygons')return false;
  if(record.Class==='STB')return false;
  if(record.Class==='SBP')return true;
  return !record.CoordG&&!Array.isArray(record.Conpoints)&&!Array.isArray(record.Flrpoints)&&Boolean(record.CoordP??record.coordinate);
}
export const navigationPathForRecord=(record:Record<string,unknown>):ClassificationPath=>({class:String(record.Class??''),kind:record.Kind as string|undefined,skind:(record.SKind??record.Skind) as string|undefined,skind2:(record.SKind2??record.Skind2) as string|undefined});
export function assertNavigationInput(context:NavigationContext,items:Record<string,unknown>[],mode:'shared'|'rail'|'teleport'|'road'):void {
  if(!context.native)return;
  const ids=new Set<string>(),warps=new Set<string>();
  const matches=(role:RailwayRole,record:Record<string,unknown>)=>mode==='shared'?sharedRailMatches(role,record,context):navigationRailMatches(role,record,context);
  const codes=mode==='road'?new Set(roadTravelProfiles(context).map(p=>p.code)):undefined;
  for(const record of items){
    const templates:Array<[string,string]>=[];
    const rail=(mode==='shared'||mode==='rail')&&(['lines','platforms','stationAreas','stations'] as const).some(role=>matches(role,record));
    const road=mode==='road'&&matchesRaw(context.settings.road.selectors.roads,record);
    const teleport=mode==='teleport'&&matchesRaw(context.settings.teleport.selectors.teleportPoints,record),warp=mode==='teleport'&&matchesRaw(context.settings.teleport.selectors.warpPoints,record);
    if(!rail&&!road&&!teleport&&!warp)continue;
    const id=String(record.ID??'').trim();
    if(!id||ids.has(id))throw Error(`导航数据 ID 缺失或重复：${id||'空'}。`);ids.add(id);
    const scalar=(key:string,type:'number'|'boolean'|'string')=>{const value=record[key];if(value!==undefined&&(typeof value!==type||type==='number'&&!Number.isFinite(value)))throw Error(`${id}/${key} 需要有限的 ${type} 值。`);};
    if(rail&&matches('lines',record)){scalar('direction','number');if(record.direction!==undefined&&(!Number.isInteger(record.direction)||Number(record.direction)<0||Number(record.direction)>7))throw Error(`${id}/direction 需要 0–7 整数。`);}
    if(rail&&matches('stationAreas',record))scalar('STBuilding','string');
    if(road){scalar('Level','number');for(const key of ['Oneway','Enter','Exit','SelfJunction'])scalar(key,'boolean');}
    if(teleport){for(const key of ['TGTWarp','hub'])scalar(key,'string');for(const key of ['TGT_x','TGT_z','TGTelevation'])scalar(key,'number');}
    if(warp){scalar('WRPointI2D','string');scalar('elevation','number');}
    if(mode!=='shared'){
      const kind=road||rail&&matches('lines',record)?'LineString':rail&&matches('stations',record)&&!isRailStationPoint(record)?'Polygon':'Point';
      readNavigationGeometry(record,kind);
    }
    if(rail&&matches('platforms',record)){templates.push(['lines','rail-lines']);for(const key of ['Situation','Connect'])if(record[key]!==undefined&&typeof record[key]!=='boolean')throw Error(`${id}/${key} 需要布尔值。`);}
    if(rail&&matches('stationAreas',record))templates.push(['platforms','rail-platforms']);
    if(rail&&matches('stations',record))for(const key of ['Stations','stations','stationsgroup','stationsGroup','StationsGroup','Stationsgroup'])templates.push([key,'rail-stations']);
    if(road){
      templates.push(['Mode','road-modes'],['ConnectL','road-connections'],['Blacklist','road-blacklist']);
      if(record.Speed!==undefined&&(typeof record.Speed!=='number'||!Number.isFinite(record.Speed)||record.Speed<=0))throw Error(`${id}/Speed 必须为正有限数。`);
      if(Array.isArray(record.Mode))for(const row of record.Mode){const code=typeof row==='string'?row:Array.isArray(row)?String(row[0]??''):row&&typeof row==='object'?String(row.code??row.tgt??row.ID??row.id??''):'';if(!codes!.has(code))throw Error(`${id}/Mode 的 ${code} 不在绑定的出行方式表中。`);}
    }
    if(teleport)templates.push(['TGTcoordinate','target-point']);
    if(warp){const key=String(record.WRPointI2D??record.wrPointI2D??'').trim();if(!key||warps.has(key))throw Error(`Warp 定位键缺失或重复：${key||id}。`);warps.add(key);}
    for(const [key,template] of templates)if(record[key]!==undefined){const errors=validateStructuredValue(record[key],valueSchemaTemplate(template),`${id}/${key}`);if(errors.length)throw Error(errors[0]);}
  }
  const config=context.configuration;
  if(config){
    const prefix=mode==='shared'||mode==='rail'?'application/preferences/railwayRoles':`application/navigation/${mode}`;
    const errors=validateNavigationRecords({...config,application:{...config.application!,navigation:context.settings,preferences:{...config.application!.preferences,railwayRoles:{schemaVersion:'cairnmap.railway-roles.v1',selectors:context.shared}}},lookupTables:context.tables},items).filter(issue=>issue.severity==='error'&&(issue.path===prefix||mode==='rail'&&issue.path==='application/navigation/rail'||issue.path==='application/navigation'));
    if(errors.length)throw Error(errors[0].message);
  }
}
