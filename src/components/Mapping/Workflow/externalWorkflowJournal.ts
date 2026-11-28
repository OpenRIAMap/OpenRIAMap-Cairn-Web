import type {WorkflowBridge,WorkflowCommitArgs,WorkflowDrawingDraft} from './WorkflowHost';

type Entry={page:string;layerId:number;before:unknown;draft:WorkflowDrawingDraft|null};
/** Journal ownership is internal layer identity, never a feature ID search. */
export class ExternalWorkflowJournal{
  page='';
  private entries:Entry[]=[];
  commit(bridge:WorkflowBridge,args:WorkflowCommitArgs){
    const before=bridge.captureCommittedState?.(),draft=bridge.getDrawingDraft?.()??null;
    const result=bridge.commitFeature(args);
    if(!result.ok){this.rollback(bridge,[this.page]);return result;}
    if(result.ok)this.entries.push({page:this.page,layerId:result.layerId,before,draft});
    return result;
  }
  lastDraft(page:string){const rows=this.entries.filter(entry=>entry.page===page);return rows[rows.length-1]?.draft??null;}
  rollback(bridge:WorkflowBridge,pages:readonly string[]){
    const owned=this.entries.filter(entry=>pages.includes(entry.page));
    if(owned.length){
      if(!bridge.rollbackWorkflowWrites)throw Error('当前测绘入口不支持安全回退，填写内容已保留。');
      bridge.rollbackWorkflowWrites([...owned].reverse().map(({layerId,before})=>({layerId,before})));
    }
    this.entries=this.entries.filter(entry=>!pages.includes(entry.page));
  }
}
