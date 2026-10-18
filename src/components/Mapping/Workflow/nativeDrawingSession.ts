import {drawingKey} from '@/configStudio/workflowDrawing';
import type {WorkflowDefinition,WorkflowStep} from '@/configStudio/types';
import type {WorkflowBridge,WorldPoint} from './WorkflowHost';

const clonePoints=(points:WorldPoint[])=>points.map(point=>({...point}));
/** Page location and the active map task are separate. Drafts include incomplete
 * paths; only the runner's geometry validator can turn them into valid outputs. */
export class NativeDrawingSession {
  readonly drafts=new Map<string,WorldPoint[]>();
  active?:string;
  paused=false;
  private page?:WorkflowStep;
  private worldMismatch=false;
  constructor(private readonly bridge:()=>WorkflowBridge,private readonly workflow:WorkflowDefinition) {}
  archive() {if(this.active&&!this.paused)this.drafts.set(this.active,clonePoints(this.bridge().getTempPoints()));}
  switchPage(step:WorkflowStep|undefined) {
    if(this.page?.id===step?.id&&(!this.paused||step?.kind!=='geometry'||step.drawing?.enabledFromThisPage===false||this.worldMismatch))return;
    const previous=this.page;
    const backwards=!!previous&&!!step&&this.workflow.steps.findIndex(item=>item.id===step.id)<this.workflow.steps.findIndex(item=>item.id===previous.id);
    this.archive();
    if(backwards&&previous?.kind==='geometry'&&previous.drawing?.keepDrawingWhenBack===false) {
      const key=drawingKey(previous);this.drafts.delete(key);this.bridge().clearWorkflowPreview(`native:${key}`);
      if(this.active===key){this.bridge().suspendDrawMode();this.bridge().clearTempPoints();this.active=undefined;}
    }
    this.page=step;
    if(step?.kind!=='geometry'||this.worldMismatch)return;
    const key=drawingKey(step);
    // Returning to the same live task must not reset its current path or undo stack.
    if(this.active===key&&!this.paused)return;
    this.activate(key,step.geometry![0],step.drawing?.enabledFromThisPage!==false);
  }
  activate(key:string,type:string,start=true,newPart=false) {
    if(this.worldMismatch)throw Error('请返回工作流所属世界。');
    if(this.active!==key||this.paused){
      this.archive();this.bridge().suspendDrawMode();this.active=key;
      this.bridge().setTempPoints(clonePoints(this.drafts.get(key)??[]));
    }
    if(newPart)this.bridge().clearTempPoints();
    this.paused=!start;
    if(start)this.bridge().setDrawMode(type==='Point'?'point':type==='LineString'?'polyline':'polygon');
    else this.bridge().suspendDrawMode();
  }
  capture(key:string):WorldPoint[] {
    if(this.worldMismatch||this.paused)throw Error('绘制已暂停，请返回原世界并恢复绘制。');
    const points=this.active===key?this.bridge().getTempPoints():this.drafts.get(key);
    if(!points)throw Error('此绘制尚未采集坐标。');
    this.drafts.set(key,clonePoints(points));return clonePoints(points);
  }
  invalidate(key:string) {
    this.bridge().clearWorkflowPreview(`native:${key}`);
    if(this.active===key){this.archive();this.bridge().suspendDrawMode();this.bridge().clearTempPoints();this.active=undefined;this.paused=false;}
  }
  setWorldMismatch(value:boolean) {
    if(value===this.worldMismatch)return;
    this.archive();this.worldMismatch=value;
    this.bridge().suspendDrawMode();this.bridge().clearTempPoints();this.paused=true;
  }
  stop() {
    this.archive();this.bridge().suspendDrawMode();this.bridge().clearTempPoints();
    for(const key of this.drafts.keys())this.bridge().clearWorkflowPreview(`native:${key}`);
    this.active=undefined;this.drafts.clear();this.paused=true;
  }
}
