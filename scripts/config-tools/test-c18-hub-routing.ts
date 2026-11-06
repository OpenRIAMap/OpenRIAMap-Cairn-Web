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
import { navigationPoint, navigationLine, navigationPolygon } from '../../src/core/project/navigationGeometry';
import { migrateConfigToR12 } from '../../src/configStudio/r12Migration';
import { listRailNewStaBuildingsForSearch } from '../../src/components/Navigation/Navigation_RailNewIntegrated';
import { listHubReturnPoints } from '../../src/components/Navigation/teleportHubReturnPoints';

const localValues=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>localValues.get(key)??null,setItem:(key:string,value:string)=>localValues.set(key,String(value)),removeItem:(key:string)=>localValues.delete(key),clear:()=>localValues.clear(),key:(index:number)=>[...localValues.keys()][index]??null,get length(){return localValues.size;}}});
const base=migrateConfigToR13(JSON.parse(fs.readFileSync('src/configStudio/defaults/r11-r7.config.json','utf8'))).config;
const extraRoad=structuredClone(base.nodes.find(n=>n.path.class==='ROD'&&!n.path.kind)!);extraRoad.nodeId='independent-road-node';extraRoad.path={class:'XRD'};extraRoad.children=[];base.nodes.push(extraRoad);
const extra=structuredClone(base.nodes.find(n=>n.path.class==='RLE')!);extra.nodeId='fixture-extra-line';extra.path={class:'XRL'};extra.classificationLabels={class:{zh:'附加线路',en:'Extra line'}};base.nodes.push(extra);
base.application!.preferences.railwayRoles!.selectors.lines.push({class:'XRL'});
for(const group of (base.application!.sources as any).groups){group.dataPathTemplate='';for(const source of group.sources.items){source.rootUrl='https://navigation-fixture.invalid';source.transport='direct';}}
const activate=(config:ConfigPackageV3)=>{const report=validateConfigPackage(config);assert(report.valid,JSON.stringify(report.issues.filter(i=>i.severity==='error')));setRuntimeConfiguration(config);applyApplicationSettings(config.application);};
let records=JSON.parse(fs.readFileSync(process.argv.includes('--canonical-only')?'scripts/config-tools/fixtures/navigation-canonical-records.json':'scripts/config-tools/fixtures/navigation-r13-records.json','utf8')) as Record<string,any>[];
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

const point=(x:number,z=0)=>({x,y:64,z});
const tp=(ID:string,x:number,z:number,tx:number,tz:number,hub?:string)=>({ID,Name:ID,World:'zth',Class:'TPP',Kind:'NOM',SKind:'NOM',Type:'Points',CoordP:[[x,64,z]],TGTcoordinate:point(tx,tz),...(hub?{hub}:{})});
const query=(start=point(0),end=point(100000),extra={})=>computeTeleportNewPlanFromCoords({worldId:'zth',startCoord:start,endCoord:end,useElytra:false,...extra});
const setup=(hub?:string)=>{records=[tp('A',0,0,1000,0),tp('C',1090,0,100000,0,hub),...Array.from({length:30},(_,i)=>tp('near-B-'+i,1000+i*.01,10,1000+i*.01,10)),...Array.from({length:30},(_,i)=>tp('near-C-'+i,1090+i*.01,10,1090+i*.01,10))];release++;rebuild();};
try{
 activate(base);setup();const ordinary=await query();
 setup('custom-hub');const plan=await query();assert(plan.ok,plan.reason);assert.equal(plan.teleportCount,2);assert.equal(plan.totalDistance,90);assert(Math.abs(plan.totalTimeSeconds-(6+90/4.317))<1e-7);assert(!ordinary.ok||ordinary.totalTimeSeconds>plan.totalTimeSeconds,'dense nearest-24 must not provide the same direct transfer');
 assert.deepEqual(plan.segments.filter(s=>s.kind==='teleport').map(s=>s.kind==='teleport'&&s.tpId),['A','C']);
 const fromHub=await query(point(1000));assert(fromHub.ok);assert.equal(fromHub.usedHub,'custom-hub');assert.equal(fromHub.teleportCount,1);
 const flying=await query(point(1000),point(100000),{useElytra:true});assert(flying.totalTimeSeconds<fromHub.totalTimeSeconds);
 // Reverse ordinary hub edges include arrivals at the endpoint without
 // inventing a reverse teleport, or using a standalone Warp directory.
 const reverse=await query(point(100000),point(0));assert(!reverse.ok||reverse.totalTimeSeconds>plan.totalTimeSeconds);
 records.find(r=>r.ID==='C')!.hub='changed-hub';release++;rebuild();const changed=await query(point(1000));assert.equal(changed.usedHub,'changed-hub');
 records.find(r=>r.ID==='C')!.CoordP=[[5000,64,0]];release++;rebuild();const moved=await query(point(1000));assert.equal(moved.usedHub,undefined);
 // Explicitly disabled sources and destinations cannot enter any hub or
 // nearest-24 expansion, and a named disabled Warp never uses TGTcoordinate.
 records=[tp('state-a',0,0,100000,0,'state-hub')];release++;rebuild();assert((await query()).ok);
 records[0].Situation=false;release++;rebuild();const disabled=await query();assert(!disabled.ok);assert.match(disabled.reason??'',/停用/);
 delete records[0].Situation;release++;rebuild();assert((await query()).ok);
 records[0].TGTWarp='named-warp';records.push({ID:'warp-state',Name:'warp',World:'zth',Class:'WRP',Kind:'NOM',SKind:'NOM',Type:'Points',CoordP:[[100000,64,0]],WRPointI2D:'named-warp',Situation:false});release++;rebuild();assert(!(await query()).ok,'explicit disabled Warp must not fall back to valid legacy coordinates');
 records[1].Situation=true;release++;rebuild();assert((await query()).ok);
 records.push({...tp('other-route',0,0,100000,0),Situation:true});records[1].Situation=false;release++;rebuild();const alternate=await query();assert(alternate.ok);assert(alternate.segments.some(s=>s.kind==='teleport'&&s.tpId==='other-route'));
 const metrics=[];
 for(const hub of [undefined,'dense-hub']){
  records=Array.from({length:600},(_,i)=>tp('dense-'+i,(i%30)*10,Math.floor(i/30)*10,100000+i*10,0,hub));release++;rebuild();const before=performance.now(),memory=process.memoryUsage().heapUsed;
  const route=await query(point(0),point(100000));assert(route.ok,route.reason);const cold=performance.now()-before,warm=performance.now();assert((await query(point(0),point(100000))).ok);
  metrics.push({mode:hub?'hub':'ordinary',points:600,coldMs:Math.round(cold),warmMs:Math.round(performance.now()-warm),heapDeltaMB:Math.round((process.memoryUsage().heapUsed-memory)/1048576)});
 }
 console.log(JSON.stringify({checks:['actual intermediate transfer beyond ordinary 24','start and intermediate use same region','real walking cost and directional teleport count','walk and elytra recompute cost','hub text/coordinate cache invalidation','600-trigger cold/warm benchmark'],metrics,externalNetworkRequests:0}));
}finally{globalThis.fetch=originalFetch;}
