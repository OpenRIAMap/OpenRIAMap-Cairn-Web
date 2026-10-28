import {drawingKey,type WorkflowDrawingTarget} from '@/configStudio/workflowDrawing';
import type {WorkflowDefinition,WorkflowStep} from '@/configStudio/types';
import type {WorkflowBridge,WorkflowDrawingDraft} from './WorkflowHost';

/** The editor owns structure. A session only transports complete drafts and
 * their selected part/ring between tasks, including unfinished geometry. */
export class NativeDrawingSession {
  readonly drafts=new Map<string,WorkflowDrawingDraft>();
  active?:string;
  paused=false;
  private page?:WorkflowStep;
  private worldMismatch=false;
  private targets:Record<string,WorkflowDrawingTarget>={};
  constructor(private readonly bridge:()=>WorkflowBridge,private readonly workflow:WorkflowDefinition) {}
  setTargets(targets:Record<string,WorkflowDrawingTarget>) {
    this.targets=targets;
    if(this.active)this.bindTarget(this.active);
  }
  private bindTarget(key:string) {
    const target=this.targets[key];
    // A bound unresolved/auxiliary target must not fall through to a previous
    // full-editor classification. Clearing context is a separate operation.
    this.bridge().setDrawingTarget?.(target?.path??{class:''},target?.allowParts===true);
  }
  archive() {
    if(!this.active||this.paused)return;
    const draft=this.bridge().getDrawingDraft?.();
    if(draft)this.drafts.set(this.active,structuredClone(draft));
  }
  switchPage(step:WorkflowStep|undefined) {
    const settled=step?.kind!=='geometry'||this.active===drawingKey(step);
    // Drawing notifications must not silently resume a world/manual pause.
    // An unsettled task may retry after its previous tool transaction closes.
    if(this.page?.id===step?.id&&settled)return;
    const previous=this.page;
    const backwards=!!previous&&!!step&&this.workflow.steps.findIndex(item=>item.id===step.id)<this.workflow.steps.findIndex(item=>item.id===previous.id);
    this.archive();
    if(backwards&&previous?.kind==='geometry'&&previous.drawing?.keepDrawingWhenBack===false) {
      const key=drawingKey(previous);this.drafts.delete(key);this.bridge().clearWorkflowPreview(`native:${key}`);
      if(this.active===key){this.bridge().suspendDrawMode();this.bridge().clearTempPoints();this.bridge().setDrawingTarget?.(undefined);this.active=undefined;}
    }
    this.page=step;
    if(step?.kind!=='geometry'||this.worldMismatch)return;
    this.activate(drawingKey(step),step.geometry![0],step.drawing?.enabledFromThisPage!==false);
  }
  activate(key:string,type:string,start=true) {
    if(this.worldMismatch)throw Error('请返回工作流所属世界。');
    // setDrawMode resets structure; repeated activation of a live task must not
    // reset its selected part/ring or undo history.
    if(this.active===key&&!this.paused&&start){this.bindTarget(key);return;}
    if(this.bridge().prepareDrawingTransition?.()===false)throw Error('请先完成或关闭当前坐标编辑工具，再重新进入绘制页。');
    this.archive();
    const bridge=this.bridge();
    bridge.suspendDrawMode();bridge.clearTempPoints();
    this.active=key;this.paused=!start;
    this.bindTarget(key);
    if(!start)return;
    bridge.setDrawMode(type==='Point'?'point':type==='LineString'?'polyline':'polygon');
    const draft=this.drafts.get(key);
    if(draft){
      if(!bridge.restoreDrawingDraft)throw Error('测绘组件未提供完整草稿恢复接口。');
      bridge.restoreDrawingDraft(structuredClone(draft));
    }
  }
  capture(key:string):WorkflowDrawingDraft {
    if(this.worldMismatch||key===this.active&&this.paused)throw Error('绘制已暂停，请返回原世界并恢复绘制。');
    const draft=this.active===key?this.bridge().getDrawingDraft?.():this.drafts.get(key);
    if(!draft)throw Error('此绘制尚未采集完整草稿。');
    this.drafts.set(key,structuredClone(draft));return structuredClone(draft);
  }
  invalidate(key:string) {
    this.bridge().clearWorkflowPreview(`native:${key}`);
    if(this.active===key){this.archive();this.bridge().suspendDrawMode();this.bridge().clearTempPoints();this.bridge().setDrawingTarget?.(undefined);this.active=undefined;this.paused=false;}
  }
  setWorldMismatch(value:boolean) {
    if(value===this.worldMismatch)return;
    this.archive();this.worldMismatch=value;
    if(value)for(const key of this.drafts.keys())this.bridge().clearWorkflowPreview(`native:${key}`);
    this.bridge().suspendDrawMode();this.bridge().clearTempPoints();this.bridge().setDrawingTarget?.(undefined);this.paused=true;
  }
  stop() {
    this.archive();this.bridge().suspendDrawMode();this.bridge().clearTempPoints();this.bridge().setDrawingTarget?.(undefined);
    for(const key of this.drafts.keys())this.bridge().clearWorkflowPreview(`native:${key}`);
    this.active=undefined;this.drafts.clear();this.paused=true;
  }
}
