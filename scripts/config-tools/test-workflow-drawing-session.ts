import assert from 'node:assert/strict';
import {NativeDrawingSession} from '../../src/components/Mapping/Workflow/nativeDrawingSession';
import type {WorkflowDefinition,WorkflowStep} from '../../src/configStudio/types';
import type {WorkflowBridge,WorldPoint} from '../../src/components/Mapping/Workflow/WorkflowHost';

let points:WorldPoint[]=[],mode='none',starts=0;
const previews=new Set<string>();
const bridge={getTempPoints:()=>points,setTempPoints:(next:WorldPoint[])=>{points=next;},clearTempPoints:()=>{points=[];},setDrawMode:(next:string)=>{mode=next;starts++;},suspendDrawMode:()=>{mode='none';},clearWorkflowPreview:(key:string)=>{previews.delete(key);}} as unknown as WorkflowBridge;
const step=(id:string,kind:WorkflowStep['kind']):WorkflowStep=>({id,kind,label:{zh:id,en:''},...(kind==='geometry'?{geometry:['Point'],geometryRole:'auxiliary',drawing:{keepDrawingWhenBack:true,enabledFromThisPage:true}}:{})});
const info=step('info','form'),main=step('main','geometry'),target=step('target','geometry');
const workflow={steps:[info,main,target]} as WorkflowDefinition;
const session=new NativeDrawingSession(()=>bridge,workflow);
// Runner resolves immutable controls and gives the host cloned steps, not the
// same object references as its frozen workflow snapshot.
const visit=(value:WorkflowStep)=>session.switchPage(structuredClone(value));
visit(info);visit(main);assert.equal(mode,'point');points=[{x:1,y:2,z:3}];
visit(target);assert.deepEqual(session.drafts.get('main'),[{x:1,y:2,z:3}]);points=[{x:8,z:9}];
visit(main);assert.deepEqual(points,[{x:1,y:2,z:3}]);assert.equal(session.active,'main');
visit(info);assert.equal(mode,'point');points=[{x:4,y:5,z:6}];
const startsBefore=starts;visit(main);assert.equal(starts,startsBefore);assert.deepEqual(points,[{x:4,y:5,z:6}]);
visit(info);points=[{x:7,z:10}];visit(target);assert.deepEqual(session.capture('main'),[{x:7,z:10}]);assert.deepEqual(points,[{x:8,z:9}]);
session.invalidate('target');assert.equal(mode,'none');assert.equal(session.active,undefined);assert.deepEqual(session.drafts.get('target'),[{x:8,z:9}]);
visit(main);points=[{x:12,z:13}];session.setWorldMismatch(true);assert.equal(mode,'none');assert.throws(()=>session.capture('main'));
session.setWorldMismatch(false);assert.throws(()=>session.capture('main'));session.activate('main','Point');assert.deepEqual(points,[{x:12,z:13}]);
main.drawing!.keepDrawingWhenBack=false;visit(target);visit(main);points=[{x:99,z:99}];visit(info);assert.equal(mode,'none');assert.equal(session.drafts.has('main'),false);
main.drawing!.keepDrawingWhenBack=true;main.drawing!.enabledFromThisPage=false;visit(main);assert.equal(mode,'none');assert.equal(session.paused,true);session.activate('main','Point');assert.equal(mode,'point');
session.stop();assert.equal(mode,'none');assert.equal(session.drafts.size,0);assert.equal(session.active,undefined);
console.log('drawing-session: TPP backtrack, cloned step identity, information-page edits, active-task isolation, condition invalidation, world pause/resume, explicit discard/manual-start and exit: OK');
