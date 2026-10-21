/** Local-only acceptance entry; production build has no reference to this file. */
import React from 'react';
import {createRoot} from 'react-dom/client';
import seed from '../../../src/configStudio/defaults/r11-r7.config.json';
import fixtures from '../fixtures/navigation-r13-records.json';
import {migrateConfigToR13} from '../../../src/configStudio/r13Migration';
import {setRuntimeConfiguration} from '../../../src/configRuntime/runtimeDataView';
import {applyApplicationSettings} from '../../../src/core/project/applicationRuntime';
import {NavigationPanel} from '../../../src/components/Navigation/NavigationPanel';
import '../../../src/styles/index.css';

let config=migrateConfigToR13(seed as any).config;
const records=fixtures.filter(r=>r.Class!=='XRL').map(r=>({...r,...('lines' in r?{lines:r.lines!.filter(row=>row.ID!=='line-extra')}:{})}));
for(const group of (config.application!.sources as any).groups)for(const source of group.sources.items){source.rootUrl='https://navigation-fixture.invalid';source.transport='direct';group.dataPathTemplate='';}
const documents=new Map<string,string>();
const put=async(key:string,value:unknown)=>{const text=JSON.stringify(value),bytes=new TextEncoder().encode(text);documents.set(key,text);return{sha256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join(''),byteLength:bytes.length};};
const rid='browser-fixture',chunk=`releases/${rid}/data-merge/zth/data.json`,catalog=`releases/${rid}/manifests/worlds/zth-catalog.json`,manifest=`releases/${rid}/manifests/worlds/zth.json`;
const integrity=await put(chunk,{schemaVersion:'openriamap.world-merge-chunk.v2',worldId:'zth',features:records.map(record=>({featureId:record.ID,record})),featureCount:records.length});
await put(catalog,{schemaVersion:'openriamap.world-chunk-catalog.v2',worldId:'zth',releaseId:rid,chunks:[{key:chunk,...integrity,featureCount:records.length}]});
const hash=await put(manifest,{schemaVersion:'openriamap.world-release-manifest.v2',worldId:'zth',releaseId:rid,chunkCatalogKeys:[catalog],featureCount:records.length,chunkCount:1});
await put('current/worlds/_release-set.json',{schemaVersion:'openriamap.current-release-set.v2',releaseId:rid,formalVersion:1,worlds:['zth']});
await put('current/worlds/zth.json',{schemaVersion:'openriamap.current-world.v2',worldId:'zth',releaseId:rid,formalVersion:1,worldManifestKey:manifest,worldManifestSha256:hash.sha256});
let paused=false;const releases:Array<()=>void>=[];
const actualFetch=window.fetch.bind(window);
window.fetch=async(input,init)=>{const url=new URL(String(input),location.href);if(url.hostname!=='navigation-fixture.invalid')return actualFetch(input,init);if(paused)await new Promise<void>(resolve=>releases.push(resolve));const body=documents.get(url.pathname.slice(1));if(!body)throw Error('Unexpected fixture request '+url);return new Response(body,{headers:{'content-type':'application/json'}});};
const state={highlights:[] as unknown[],pause:()=>{paused=true;},resume:()=>{paused=false;releases.splice(0).forEach(resolve=>resolve());},disable:()=>{config=structuredClone(config);config.application!.navigation!.rail.enabled=false;activate();},rename:()=>{config=structuredClone(config);config.application!.navigation!.road.name.zh='定制道路';activate();}};
(window as any).navigationAcceptance=state;
const root=createRoot(document.getElementById('root')!);
function activate(){setRuntimeConfiguration(config);applyApplicationSettings(config.application);root.render(<NavigationPanel configRuntime={config} stations={[]} lines={[]} landmarks={[]} worldId="zth" onRouteFound={route=>state.highlights.push(route)}/>);}
activate();
