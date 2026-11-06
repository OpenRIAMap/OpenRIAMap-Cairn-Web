import {HelpLabel} from './SettingHelp';
import type {ConfigPackageV3} from './types';
import {isQuickMappingWorkflow} from './workflowEditing';
import {FoldOrderControls,type FoldMove} from './FoldOrderControls';
export function availableQuickWorkflows(config:ConfigPackageV3,world:string){
 const candidates=config.workflows.filter(isQuickMappingWorkflow);
 if(config.contractRevision<18)return candidates;
 return (config.application?.workflowAvailability?.[world]??[]).flatMap(id=>{const workflow=candidates.find(item=>item.id===id);return workflow?[workflow]:[];});
}
export function WorkflowAvailabilityEditor({config,value,onChange}:{config:ConfigPackageV3;value:Record<string,string[]>;onChange:(value:Record<string,string[]>)=>void}){
 const candidates=config.workflows.filter(isQuickMappingWorkflow);
 return <div className="space-y-3">{config.application?.worlds.map(world=>{
  const ids=value[world.id]??[],set=(next:string[])=>onChange({...value,[world.id]:next});
  const move=(from:number,to:number)=>{if(from<0||to<0||from>=ids.length||to>=ids.length||from===to)return;const next=[...ids],[item]=next.splice(from,1);next.splice(to,0,item);set(next);};
  const drop=(m:FoldMove)=>{if(m.fromContainer!==world.id||m.toContainer!==world.id)return;const from=ids.indexOf(m.from),at=ids.indexOf(m.to);if(from<0||at<0)return;const next=ids.filter(id=>id!==m.from),target=next.indexOf(m.to);next.splice(target+(m.after?1:0),0,m.from);set(next);};
  return <details key={world.id} className="cm-subsection"><summary className="font-semibold">{world.label.zh||world.id} · {ids.length} 个工作流</summary><div className="mt-3 space-y-4">
   <fieldset className="rounded border bg-slate-50 p-3"><legend className="text-sm font-medium">可选工作流</legend><div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr))]">{candidates.map(workflow=><HelpLabel context="WorkflowAvailabilityEditor" key={workflow.id} className="text-sm"><input type="checkbox" checked={ids.includes(workflow.id)} onChange={event=>set(event.target.checked?[...ids,workflow.id]:ids.filter(id=>id!==workflow.id))}/>{workflow.label.zh||workflow.id}<span className="break-all text-xs text-slate-500">{workflow.id}</span></HelpLabel>)}</div></fieldset>
   <section aria-label={world.label.zh+'工作流顺序'} className="space-y-2"><h4 className="text-sm font-medium">快捷菜单顺序</h4>{ids.map((id,index)=><div data-order-row key={id} className="flex min-w-0 items-center gap-2 rounded-lg border bg-white p-3"><span className="min-w-0 flex-1 break-words font-medium">{candidates.find(item=>item.id===id)?.label.zh??id}{!candidates.some(item=>item.id===id)?<span className="ml-2 text-xs text-rose-700">工作流已失效，请移除</span>:null}</span><FoldOrderControls rowSelector="[data-order-row]" scope={'world-workflows:'+world.id} container={world.id} id={id} index={index} count={ids.length} label="工作流" onMove={drop} onStep={offset=>move(index,index+offset)}/><button type="button" className="shrink-0 text-sm text-rose-700" onClick={()=>set(ids.filter(item=>item!==id))}>移除</button></div>)}</section>
  </div></details>;
 })}</div>;
}
