import fs from 'node:fs';
import assert from 'node:assert/strict';
import { verifyFormalConfiguration } from '../../src/configRuntime/formalConfiguration';
import { setRuntimeConfiguration, runtimeDatasetView, getRuntimeDataDiagnostics } from '../../src/configRuntime/runtimeDataView';
import { categoryAllowsParts, drawingAllowsParts } from '../../src/configStudio/multipartPolicy';
import { resolveGeometryProfile, validateConfigPackage } from '../../src/configStudio/runtime';
import { serializeDrawingCapture } from '../../src/configStudio/workflowDrawing';
import { readMultipartGeometry } from '../../src/core/geometry/multipartGeometry';
import {createNativeRelayConfigContext} from '../relay/native-relay-config-resolver.mjs';
import {verifyPublishedMirror} from './productionMirror';

Object.assign(globalThis,{location:new URL('http://localhost:5202')});
const raw=fs.readFileSync('src/configStudio/defaults/r11-r7.config.json'),config=JSON.parse(raw.toString());
const identity=JSON.parse(fs.readFileSync('public/configuration/releases/982e1c0b6dc004dd90ee1ff92cd502dfb0f77a9ef4c53bb5a707a2c188460d7e/release.json','utf8')).identity;
assert.equal((await verifyFormalConfiguration(identity,raw)).config.contractRevision,11);
await assert.rejects(()=>verifyFormalConfiguration({...identity,configSha256:'0'.repeat(64)},raw),/受控|摘要/);
await assert.rejects(()=>verifyFormalConfiguration({...identity,revision:99},raw),/身份/);
await assert.rejects(()=>verifyFormalConfiguration({...identity,configUrl:'https://attacker.example/config.json'},raw),/受控/);
await assert.rejects(()=>verifyFormalConfiguration({...identity,contractRevision:12},raw),/身份/);
const input={worldId:'zth',mergeVersion:'audit',loadedAt:0,features:[
  {ID:'road',Class:'ROD',Kind:'NOM',SKind:'NOM',Type:'Polyline',CoordL:[[[0,0,0],[2,0,2]]]},
  {ID:'future',Class:'ROD',Kind:'FUTURE',Type:'Polyline'},
  {ID:'future-child',Class:'ROD',Kind:'NOM',SKind:'FUTURE',Type:'Polyline'},
]};
const before=JSON.stringify(input);setRuntimeConfiguration(config);const view=runtimeDatasetView(input);
assert.equal(view.features.length,1);assert.equal(view.features[0].SKind,undefined);assert.equal(JSON.stringify(input),before);
assert.deepEqual(getRuntimeDataDiagnostics().zth.unknown.map(row=>row.id),['future','future-child']);
const expanded=structuredClone(config),rod=expanded.nodes.find((node:any)=>node.path.class==='ROD'&&node.path.kind==='NOM');
const future=structuredClone(rod);future.nodeId='audit-future';future.path={class:'ROD',kind:'FUTURE'};expanded.nodes.push(future);
setRuntimeConfiguration(expanded);assert.equal(runtimeDatasetView(view).features.length,2,'views recover original data after a config change');

const path={class:'BUD',kind:'NOM',skind:'NOM'},profile=structuredClone(resolveGeometryProfile(config,path,'Polygon')!);
const child=config.nodes.find((node:any)=>JSON.stringify(node.path)===JSON.stringify(path));
child.geometryProfiles.Polygon={...profile,allowMultipleParts:false,anchor:'featureBbox'};
assert.equal(categoryAllowsParts(config,path,'Polygon'),false);
assert.equal(categoryAllowsParts(config,{class:'BUD'},'Polygon'),false,'an unresolved parent cannot authorize new parts');
const polygon={type:'Polygon' as const,parts:[[[{x:0,y:0,z:0},{x:20,y:0,z:0},{x:20,y:0,z:20},{x:0,y:0,z:20}],[{x:3,y:0,z:3},{x:3,y:0,z:5},{x:5,y:0,z:5},{x:5,y:0,z:3}]]]};
const step={id:'draw',kind:'geometry',outputId:'out',label:{zh:'draw',en:''},geometry:['Polygon'],drawing:{multiple:false,returnFormat:'coordinateArray'}} as any;
assert.equal(serializeDrawingCapture(step,{coordinates:[],geometry:polygon},{}).geometry.parts[0].length,2,'single part retains a hole');
assert.throws(()=>serializeDrawingCapture(step,{coordinates:[],geometry:{...polygon,parts:[...polygon.parts,...polygon.parts]}},{}),/一个部件/);
const workflow={outputs:[{id:'out',classification:{class:'BUD'},geometry:{selected:'Polygon'}}]} as any;
assert.equal(drawingAllowsParts(config,workflow,{...step,drawing:{multiple:true}},{out:path}),false);
assert.equal(drawingAllowsParts(config,workflow,{...step,geometry:['Point'],drawing:{multiple:true,returnFormat:'pointObject'}},{out:path}),false);
assert.equal(readMultipartGeometry({CoordG:serializeDrawingCapture(step,{coordinates:[],geometry:polygon},{}).value},'Polygon').geometry?.parts.length,1);
assert.equal(validateConfigPackage(JSON.parse(raw.toString())).valid,true,'frozen seed untouched');
const published=await verifyPublishedMirror(),activeRelay=createNativeRelayConfigContext(config.projectId);
assert.equal(activeRelay.configurationIdentity.configSha256,published.identity.configSha256);
assert.deepEqual(activeRelay.worlds.items.map((world:any)=>world.id),published.config.application.worlds.map((world:any)=>world.id));
const relay=createNativeRelayConfigContext(config.projectId,identity);
const sample=JSON.parse(fs.readFileSync('docs/30_data-contracts/examples/native-relay-package-sample/Data_Spilt/zth/FLR/ZFLRNOMNOM_matlantic_1st_bof_101.json','utf8'));
assert.deepEqual(relay.validateRecord(sample,'zth'),[]);
assert(relay.validateRecord({...sample,Name:123},'zth').length>0,'CLI uses shared strict field validation');
assert(relay.validateRecord({...sample,Class:'FUTURE'},'zth').length>0);
console.log('production-runtime: pinned bytes/identity, no foreign URLs, raw-preserving historical views, unknown paths, restored future paths, per-output single parts and Polygon holes passed');
