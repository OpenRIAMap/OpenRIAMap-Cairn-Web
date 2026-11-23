import fs from 'node:fs';
import assert from 'node:assert/strict';
import {FeatureStore} from '../../src/components/Rules/data/featureStore';
import {buildStructureIndex,STRUCTURE_CONTEXT_ID} from '../../src/configStudio/structureRoleIndex';
import {compileConfigRuntime} from '../../src/configStudio/runtime';
import {configHostFloorViewEligible,isConfigRuntimeRecordVisible,resolveConfigRuntimeRule} from '../../src/components/Rules/configRuntime/configPackageAdapter';
import type {FeatureRecord,RenderContext} from '../../src/components/Rules/rendering/renderPrimitives';
const root='../../outputs/c21-generation-20261124',c=compileConfigRuntime(JSON.parse(fs.readFileSync(root+'/candidate/candidate.config.json','utf8')),true);
function record(ID:string,Class:string,Kind:string,SKind:string,SKind2?:string,BuildingID?:string,NofFloor='1'):FeatureRecord {return {uid:ID,type:'Polygon',coords3:[{x:0,y:64,z:0},{x:10,y:64,z:0},{x:10,y:64,z:10}],meta:{Class,Type:'Polygon',World:'zth',idField:'ID',idValue:ID,sig:{},signatureKey:ID,groups:{}},featureInfo:{ID,World:'zth',Class,Kind,SKind,...(SKind2?{SKind2}:{}),Name:ID,...(BuildingID?{BuildingID,NofFloor}:{})}};}
const host=record('host','BUD','LAR','RES'),bum=record('bum','BUD','SUB','BUM','RES','host'),flr=record('flr','FLR','NOM','RES',undefined,'host'),other=record('other','FLR','NOM','RES',undefined,'host','2'),invalid=record('invalid','FLR','NOM','RES',undefined,'missing');
const records=[host,bum,flr,other,invalid],store=new FeatureStore(records),index=buildStructureIndex(c,store);assert.equal(index.hostsByMember.get(bum),host);assert.equal(index.hostsByMember.get(flr),host);assert(!index.hostsByMember.has(invalid));
const bup=record('entrance','BUD','SUB','BUP','ENT','host');bup.type='Points';bup.p3={x:0,y:64,z:0};bup.meta.Type='Points';delete bup.coords3;const pointStore=new FeatureStore([host,bup]);
for(const zoom of [4,5,6]){const ctx={worldId:'zth',leafletZoom:zoom-3,zoomLevel:zoom,inFloorView:true,activeBuildingUid:'host',activeContextBindingId:STRUCTURE_CONTEXT_ID,activeFloorSelector:'1',activeBuildingFloorRefSet:null} satisfies RenderContext;const rule=resolveConfigRuntimeRule(c,bup,ctx,null,pointStore);assert(rule);assert(rule.visible?.(bup,ctx,pointStore));assert.equal(rule.symbol.label?.enabled,zoom>=6);if(zoom<6)assert.equal(rule.symbol.point?.visibility,'independent');}
let count=0;
for(const zoom of [3,4,5,6]){assert.equal(configHostFloorViewEligible(c,host,zoom),zoom>=4);for(const active of [false,true]){const ctx={worldId:'zth',leafletZoom:zoom-3,zoomLevel:zoom,inFloorView:active,activeBuildingUid:active?'host':null,activeContextBindingId:STRUCTURE_CONTEXT_ID,activeFloorSelector:'1',activeBuildingFloorRefSet:null} satisfies RenderContext;
 for(const r of [bum,flr]){assert.equal(isConfigRuntimeRecordVisible(c,r,ctx,store),active&&zoom>=4);const rule=resolveConfigRuntimeRule(c,r,ctx,null,store);if(zoom>=4){assert(rule);assert.equal(rule.symbol.label?.enabled,zoom>=6);}}
 assert(!isConfigRuntimeRecordVisible(c,other,ctx,store));assert(!isConfigRuntimeRecordVisible(c,invalid,ctx,store));count+=4;
 }}
for(const value of [undefined,true,'',false]){const r=record('situation'+String(value),'BUD','NOM','RES');r.featureInfo.Situation=value;const s=new FeatureStore([r]);assert.equal(isConfigRuntimeRecordVisible(c,r,{worldId:'zth',zoomLevel:6,inFloorView:false} as RenderContext,s),value!==false);}
const status=record('closed','BUD','NOM','RES');status.featureInfo.Status=false;assert(isConfigRuntimeRecordVisible(c,status,{worldId:'zth',zoomLevel:6,inFloorView:false} as RenderContext,new FeatureStore([status])));
fs.writeFileSync(root+'/render-tests.json',JSON.stringify({passed:true,zoomContextCases:count,checks:['main/member single hierarchy','4–5 geometry with original Label threshold','active selector and unresolved reference isolation','strict Situation false only','Status false does not hide']},null,2)+'\n');console.log('c21 render acceptance:',count,'zoom/context cases and state semantics passed');
