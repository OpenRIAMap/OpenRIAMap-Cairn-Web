import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { migrateConfigToR13 } from '../../src/configStudio/r13Migration';
import { validateConfigPackage } from '../../src/configStudio/runtime';
import type {ConfigPackageV3} from '../../src/configStudio/types';
import { applyApplicationSettings } from '../../src/core/project/applicationRuntime';
import { setRuntimeConfiguration } from '../../src/configRuntime/runtimeDataView';
import { captureNavigationContext } from '../../src/core/project/navigationRuntime';
import { loadRailNewIndex } from '../../src/components/Navigation/railNewIndex';
import { relatedLineTokens } from '../../src/components/Search/relatedLineTokens';
import { computeRailPlanFromCoords } from '../../src/components/Navigation/Navigation_RailNewIntegrated';
import { computeTeleportNewPlanFromCoords } from '../../src/components/Navigation/Navigation_TeleportNewIntegrated';
import { computeRoadPlanFromCoords } from '../../src/components/Navigation/Navigation_Road';
import { listHubReturnPoints } from '../../src/components/Navigation/teleportHubReturnPoints';

const localValues=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>localValues.get(key)??null,setItem:(key:string,value:string)=>localValues.set(key,String(value)),removeItem:(key:string)=>localValues.delete(key),clear:()=>localValues.clear(),key:(index:number)=>[...localValues.keys()][index]??null,get length(){return localValues.size;}}});
const base=migrateConfigToR13(JSON.parse(fs.readFileSync('src/configStudio/defaults/r11-r7.config.json','utf8'))).config;
const extraRoad=structuredClone(base.nodes.find(n=>n.path.class==='ROD'&&!n.path.kind)!);extraRoad.nodeId='independent-road-node';extraRoad.path={class:'XRD'};extraRoad.children=[];base.nodes.push(extraRoad);
const extra=structuredClone(base.nodes.find(n=>n.path.class==='RLE')!);extra.nodeId='fixture-extra-line';extra.path={class:'XRL'};extra.classificationLabels={class:{zh:'附加线路',en:'Extra line'}};base.nodes.push(extra);
base.application!.preferences.railwayRoles!.selectors.lines.push({class:'XRL'});
for(const group of (base.application!.sources as any).groups){group.dataPathTemplate='';for(const source of group.sources.items){source.rootUrl='https://navigation-fixture.invalid';source.transport='direct';}}
const activate=(config:ConfigPackageV3)=>{const report=validateConfigPackage(config);assert(report.valid,JSON.stringify(report.issues.filter(i=>i.severity==='error')));setRuntimeConfiguration(config);applyApplicationSettings(config.application);};
let records=JSON.parse(fs.readFileSync('scripts/config-tools/fixtures/navigation-r13-records.json','utf8')) as Record<string,any>[];
records.push({...structuredClone(records.find(r=>r.ID==='road-main')!),ID:'road-other',Class:'XRD',Kind:undefined,Name:'Custom road'});
let release=1;
const documents=new Map<string,Buffer>();
const put=(key:string,value:unknown)=>{const bytes=Buffer.from(JSON.stringify(value));documents.set(key,bytes);return {sha256:createHash('sha256').update(bytes).digest('hex'),byteLength:bytes.length};};
const rebuild=()=>{
  documents.clear();const rid='navigation-fixture-'+release;
  const chunk=`releases/${rid}/data-merge/zth/chunk.json`,catalog=`releases/${rid}/manifests/worlds/zth-catalog.json`,manifest=`releases/${rid}/manifests/worlds/zth.json`;
  const integrity=put(chunk,{schemaVersion:'openriamap.world-merge-chunk.v2',worldId:'zth',featureCount:records.length,features:records.map(record=>({featureId:record.ID,record}))});
  put(catalog,{schemaVersion:'openriamap.world-chunk-catalog.v2',worldId:'zth',releaseId:rid,chunks:[{key:chunk,...integrity,featureCount:records.length}]});
  const hash=put(manifest,{schemaVersion:'openriamap.world-release-manifest.v2',worldId:'zth',releaseId:rid,chunkCatalogKeys:[catalog],featureCount:records.length,chunkCount:1});
  put('current/worlds/_release-set.json',{schemaVersion:'openriamap.current-release-set.v2',releaseId:rid,formalVersion:release,worlds:['zth']});
  put('current/worlds/zth.json',{schemaVersion:'openriamap.current-world.v2',worldId:'zth',releaseId:rid,formalVersion:release,worldManifestKey:manifest,worldManifestSha256:hash.sha256});
};
const requests:string[]=[];
const originalFetch=globalThis.fetch;
globalThis.fetch=async(input)=>{const url=new URL(String(input));assert.equal(url.hostname,'navigation-fixture.invalid','No real network or SCF calls are allowed');const key=decodeURIComponent(url.pathname.slice(1)).replace(/^backup\//,'');requests.push(key);const bytes=documents.get(key);assert(bytes,`Unexpected fixture request ${key}`);return new Response(bytes,{status:200,headers:{'content-type':'application/json'}});};
try{
  rebuild();activate(base);
  const shared=await loadRailNewIndex('zth');assert.equal(shared.rles.size,2);assert.equal(shared.buildingToStations.get('building-a')?.has('station-a'),true);
  const chips=relatedLineTokens({featureInfo:{ID:'station-a'},meta:{idValue:'station-a'}} as any,shared,'station');assert.equal(chips.length,2);
  const rail=await computeRailPlanFromCoords({worldId:'zth',startCoord:{x:0,y:64,z:0},endCoord:{x:100,y:64,z:0},interCompEnabled:false});
  assert(rail.ok,rail.reason);assert(rail.overlay.segments.filter(s=>s.kind==='rail').every(s=>s.kind==='rail'&&s.lineId==='line-main'));assert.equal(rail.totalDistance,100);
  const stopped=structuredClone(base);stopped.application!.navigation!.rail.enabled=false;stopped.application!.navigation!.rail.selectors.lines=[];activate(stopped);
  assert.equal(await loadRailNewIndex('zth'),shared,'Navigation scope and switch must not rebuild the shared index');
  await assert.rejects(computeRailPlanFromCoords({worldId:'zth',startCoord:{x:0,z:0},endCoord:{x:100,z:0}}),/未启用/);
  activate(base);
  const road=await computeRoadPlanFromCoords({worldId:'zth',startCoord:{x:0,y:64,z:0},endCoord:{x:100,y:64,z:0},defaultSpeed:999,travelModeCode:'WALK'});
  assert(road.ok,road.reason);assert.equal(road.profileSpeed,4.3);assert(Math.abs(road.totalTimeSeconds-100/4.3)<0.01);
  const faster=structuredClone(base);faster.lookupTables!.find(t=>t.id==='road-travel-modes')!.rows[0].functionValue=10;activate(faster);
  const fast=await computeRoadPlanFromCoords({worldId:'zth',startCoord:{x:0,y:64,z:0},endCoord:{x:100,y:64,z:0},defaultSpeed:999,travelModeCode:'WALK'});
  assert.equal(fast.profileSpeed,10);assert(Math.abs(fast.totalTimeSeconds-10)<0.01);
  const scoped=structuredClone(faster);scoped.application!.navigation!.road.selectors.roads=[{class:'XRD'}];activate(scoped);
  const scopedRoad=await computeRoadPlanFromCoords({worldId:'zth',startCoord:{x:0,y:64,z:0},endCoord:{x:100,y:64,z:0},defaultSpeed:999,travelModeCode:'WALK'});assert(scopedRoad.ok);assert(scopedRoad.segments.filter(s=>s.kind==='road').every(s=>s.roadId==='road-other'));activate(faster);
  const teleport=await computeTeleportNewPlanFromCoords({worldId:'zth',startCoord:{x:0,y:64,z:0},endCoord:{x:1000,y:64,z:0},useElytra:false});assert(teleport.ok,teleport.reason);assert.equal(teleport.teleportCount,1);
  const noWarp=structuredClone(faster);noWarp.application!.navigation!.teleport.enabled=false;noWarp.application!.navigation!.teleport.selectors.warpPoints=[];activate(noWarp);await assert.rejects(computeTeleportNewPlanFromCoords({worldId:'zth',startCoord:{x:0,z:0},endCoord:{x:1000,z:0}}),/未启用/);
  const hub=structuredClone(faster);const table=hub.lookupTables!.find(t=>t.id==='teleport-hubs')!;const row=table.rows[0].functionValue as any;row.returnPoints[0].label.zh='已更新返回点';activate(hub);assert(listHubReturnPoints('zth')[0].name==='已更新返回点');
  const oldIndex=await loadRailNewIndex('zth');records=structuredClone(records);records.find(r=>r.ID==='line-main')!.Name='新数据线路';release++;rebuild();
  const newIndex=await loadRailNewIndex('zth');assert.notEqual(newIndex,oldIndex);assert.equal(newIndex.rles.get('line-main')!.name,'新数据线路');
  const sourceSwitch=structuredClone(hub);for(const group of (sourceSwitch.application!.sources as any).groups)for(const source of group.sources.items)source.rootUrl='https://navigation-fixture.invalid/backup';activate(sourceSwitch);const alternate=await loadRailNewIndex('zth');assert.notEqual(alternate,newIndex,'same release on a different source must not reuse shared index');
  const customRoles=structuredClone(sourceSwitch);
  for(const [original,custom,role] of [['PLF','XPF','platforms'],['STA','XSA','stationAreas'],['SBP','XBP','stations']] as const){
    const node=structuredClone(customRoles.nodes.find(n=>n.path.class===original&&!n.path.kind)!);node.nodeId='arbitrary-'+custom;node.path={class:custom};node.children=[];customRoles.nodes.push(node);
    customRoles.application!.preferences.railwayRoles!.selectors[role].push({class:custom});
    customRoles.application!.navigation!.rail.selectors[role]=[{class:custom}];
    records.filter(r=>r.Class===original).forEach(r=>r.Class=custom);
  }
  release++;rebuild();activate(customRoles);
  const customIndex=await loadRailNewIndex('zth');assert.equal(customIndex.stas.size,2);assert.equal(customIndex.plfs.size,2);assert.equal(customIndex.buildings.size,2);assert(customIndex.buildingToStations.get('building-a')?.has('station-a'));
  const customRoute=await computeRailPlanFromCoords({worldId:'zth',startCoord:{x:0,y:64,z:0},endCoord:{x:100,y:64,z:0},interCompEnabled:false});assert(customRoute.ok,customRoute.reason);assert.equal(customRoute.totalDistance,100);
  records.find(r=>r.ID==='road-main')!.Mode=[{code:'UNKNOWN'}];release++;rebuild();await assert.rejects(computeRoadPlanFromCoords({worldId:'zth',startCoord:{x:0,z:0},endCoord:{x:100,z:0},defaultSpeed:4.3,travelModeCode:'WALK'}),/不在绑定/);
  assert(captureNavigationContext().settings.common.walkSpeed===4.317);
  console.log(JSON.stringify({checks:['real formal-release loading with integrity','rail routing restricted to N','shared line chips retain S','disabled navigation retains same shared index','road function-table speeds affect actual cost','teleport uses Warp target','hub edits propagate','new data release invalidates shared index','road scope replaces actual graph','source switch at same release isolates index','custom platform/station/station-building classifications and arbitrary node IDs route correctly','unknown Mode fails closed'],fixtureRequests:requests.length,externalNetworkRequests:0}));
}finally{globalThis.fetch=originalFetch;}
