import assert from 'node:assert/strict';
import {NativeDrawingSession} from '../../src/components/Mapping/Workflow/nativeDrawingSession';
import type {WorkflowDefinition,WorkflowStep} from '../../src/configStudio/types';
import type {WorkflowBridge,WorkflowDrawingDraft} from '../../src/components/Mapping/Workflow/WorkflowHost';
import {firstMultipartCoordinate,multipartGeometryFromSinglePath,validateMultipartGeometry,type MultipartGeometry} from '../../src/core/geometry/multipartGeometry';

let current:WorkflowDrawingDraft|null=null,mode='none',starts=0,flatReads=0;
let bound:{path:unknown;allowParts:boolean|undefined}|undefined;
const previews=new Set<string>();
const point=(x:number,z=x)=>({x,y:64,z});
const draft=(geometry:MultipartGeometry,part=0,hole=0):WorkflowDrawingDraft=>{
  const coordinates=geometry.type==='Point'?geometry.parts.slice(part,part+1):geometry.type==='LineString'?geometry.parts[part]??[]:geometry.parts[part]?.[hole]??[];
  return {geometry:structuredClone(geometry),coordinates:structuredClone(coordinates.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.z))),point:firstMultipartCoordinate(geometry)??undefined,editor:{multipart:true,part,innerSpace:geometry.type==='Polygon',editingHole:hole>0,hole:Math.max(0,hole-1),panelOpen:false,showingPartNumbers:true},redo:[point(-7)]};
};
const putPoint=(x:number)=>{current=draft({type:'Point',parts:[point(x)]});current.coordinates=[point(x)];};
// Model the real mode/suspend/clear operations: each destroys multipart state.
const bridge={getTempPoints:()=>{flatReads++;return current?.coordinates??[];},setTempPoints:()=>{throw Error('A full draft must never be restored through the flat projection.');},clearTempPoints:()=>{current=null;},setDrawMode:(next:string)=>{mode=next;starts++;current=draft(multipartGeometryFromSinglePath(next==='point'?'Point':next==='polyline'?'LineString':'Polygon',[]));},suspendDrawMode:()=>{mode='none';current=null;},getDrawingDraft:()=>current&&structuredClone(current),restoreDrawingDraft:(value:WorkflowDrawingDraft)=>{current=structuredClone(value);},setDrawingTarget:(path:unknown,allowParts:boolean|undefined)=>{bound=path?{path,allowParts}:undefined;},clearWorkflowPreview:(key:string)=>{previews.delete(key);}} as unknown as WorkflowBridge;
const step=(id:string,kind:WorkflowStep['kind']):WorkflowStep=>({id,kind,label:{zh:id,en:''},...(kind==='geometry'?{geometry:['Point'],geometryRole:'auxiliary',drawing:{keepDrawingWhenBack:true,enabledFromThisPage:true}}:{})});
const info=step('info','form'),main=step('main','geometry'),target=step('target','geometry');
const workflow={steps:[info,main,target]} as WorkflowDefinition;
const session=new NativeDrawingSession(()=>bridge,workflow);
session.setTargets({main:{path:{class:'TPT'},allowParts:true},target:{allowParts:false}});
// Runner resolves immutable controls and gives the host cloned steps, not the
// same object references as its frozen workflow snapshot.
const visit=(value:WorkflowStep)=>session.switchPage(structuredClone(value));
visit(info);visit(main);assert.equal(mode,'point');putPoint(1);
visit(target);assert.deepEqual(session.drafts.get('main')!.geometry,{type:'Point',parts:[point(1)]});putPoint(8);
assert.deepEqual(bound,{path:{class:''},allowParts:false});
visit(main);assert.deepEqual(current!.geometry,{type:'Point',parts:[point(1)]});assert.equal(session.active,'main');
visit(info);assert.equal(mode,'point');putPoint(4);
const startsBefore=starts;visit(main);session.activate('main','Point');assert.equal(starts,startsBefore);assert.deepEqual(current!.geometry,{type:'Point',parts:[point(4)]});
visit(info);putPoint(7);visit(target);assert.deepEqual(session.capture('main').geometry,{type:'Point',parts:[point(7)]});assert.deepEqual(current!.geometry,{type:'Point',parts:[point(8)]});
session.invalidate('target');assert.equal(mode,'none');assert.equal(session.active,undefined);assert.deepEqual(session.drafts.get('target')!.geometry,{type:'Point',parts:[point(8)]});assert.equal(bound,undefined);
visit(main);putPoint(12);const worldDraft=structuredClone(current);session.setWorldMismatch(true);assert.equal(mode,'none');assert.throws(()=>session.capture('main'));
session.setWorldMismatch(false);visit(main);assert.equal(session.paused,true);assert.equal(mode,'none');assert.throws(()=>session.capture('main'));session.activate('main','Point');assert.deepEqual(current,worldDraft);
main.drawing!.keepDrawingWhenBack=false;visit(target);visit(main);putPoint(99);visit(info);assert.equal(mode,'none');assert.equal(session.drafts.has('main'),false);
main.drawing!.keepDrawingWhenBack=true;main.drawing!.enabledFromThisPage=false;visit(main);assert.equal(mode,'none');assert.equal(session.paused,true);session.activate('main','Point');assert.equal(mode,'point');
session.stop();assert.equal(mode,'none');assert.equal(session.drafts.size,0);assert.equal(session.active,undefined);
assert.equal(bound,undefined);
const transactionSession=new NativeDrawingSession(()=>bridge,{steps:[main,target]} as WorkflowDefinition);
main.drawing!.enabledFromThisPage=true;transactionSession.switchPage(main);putPoint(77);const transactionDraft=structuredClone(current),transactionStarts=starts;
bridge.prepareDrawingTransition=()=>false;
assert.throws(()=>transactionSession.switchPage(target),/编辑工具/);assert.deepEqual(current,transactionDraft);assert.equal(starts,transactionStarts);assert.equal(transactionSession.active,'main');
bridge.prepareDrawingTransition=()=>true;
transactionSession.switchPage(target);assert.equal(transactionSession.active,'target');assert.deepEqual(transactionSession.drafts.get('main'),transactionDraft);transactionSession.stop();

const square=(x:number)=>[point(x,0),point(x+50,0),point(x+50,50),point(x,50)];
for(const geometry of [
  {type:'Point',parts:[point(1),point(2)]},
  {type:'LineString',parts:[[point(0),point(10)],[point(20),point(30)]]},
  {type:'Polygon',parts:[[square(0),[point(5,5),point(10,5),point(10,10)]],[square(100),[point(105,5),point(110,5),point(110,10)]]]},
] as MultipartGeometry[]){
  const a={...step('a','geometry'),geometry:[geometry.type]},b={...step('b','geometry'),geometry:['Point']} as WorkflowStep;
  const s=new NativeDrawingSession(()=>bridge,{steps:[a,b]} as WorkflowDefinition);
  s.setTargets({a:{path:{class:'BUD'},allowParts:true}});s.switchPage(a);current=draft(geometry,1,geometry.type==='Polygon'?1:0);const expected=structuredClone(current);
  s.switchPage(b);putPoint(88);s.switchPage(a);assert.deepEqual(current,expected);
  for(let i=0;i<20;i++)assert.deepEqual(s.capture('a'),expected);
  const captured=s.capture('a');captured.geometry.parts.length=0;assert.deepEqual(s.capture('a'),expected,'Readers cannot mutate the owner or archived draft.');
  s.setTargets({a:{path:{class:'BUD',kind:'SINGLE'},allowParts:false}});assert.deepEqual(current,expected,'Policy changes must not trim existing parts.');assert.equal(bound!.allowParts,false);
  s.setWorldMismatch(true);s.setWorldMismatch(false);s.activate('a',geometry.type);assert.deepEqual(current,expected);
  s.stop();assert.equal(bound,undefined);
}
const pending=new NativeDrawingSession(()=>bridge,{steps:[main,target]} as WorkflowDefinition);main.drawing!.enabledFromThisPage=true;pending.switchPage(main);
current=draft({type:'Point',parts:[point(1),{x:NaN,y:NaN,z:NaN}]},1);const unfinished=structuredClone(current);
pending.switchPage(target);pending.switchPage(main);assert.deepEqual(current,unfinished);assert.ok(validateMultipartGeometry(current!.geometry));pending.stop();
assert.equal(flatReads,0,'The native session must not use getTempPoints for complete task geometry.');
const heights=new NativeDrawingSession(()=>bridge,{steps:[main,target]} as WorkflowDefinition);heights.switchPage(main);
current=draft({type:'Point',parts:[{x:1,y:-64,z:2}]});current.coordinates=[{x:1,z:2}];current.point={x:1,z:2};current.representatives=[[0,{x:1,z:2}]];
const rawHeight=structuredClone(current);heights.switchPage(target);heights.switchPage(main);assert.deepEqual(current,rawHeight);assert.equal(heights.capture('main').point?.y,undefined);heights.stop();
console.log('drawing-session: full point/line/polygon+holes, cursor/panel/lock/history restoration, unfinished parts, policy, idempotence, isolation, backtrack, pause, condition, discard, manual start and exit: OK');
