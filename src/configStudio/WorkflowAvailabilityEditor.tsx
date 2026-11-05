import {HelpLabel} from './SettingHelp';
import type {ConfigPackageV3} from './types';
import {isQuickMappingWorkflow} from './workflowEditing';
import {GripOrderControls} from './GripOrderControls';
export function availableQuickWorkflows(config:ConfigPackageV3,world:string){
 const candidates=config.workflows.filter(isQuickMappingWorkflow);
 if(config.contractRevision<18)return candidates;
 return (config.application?.workflowAvailability?.[world]??[]).flatMap(id=>{const workflow=candidates.find(item=>item.id===id);return workflow?[workflow]:[];});
}
export function WorkflowAvailabilityEditor({config,value,onChange}:{config:ConfigPackageV3;value:Record<string,string[]>;onChange:(value:Record<string,string[]>)=>void}){
 const candidates=config.workflows.filter(isQuickMappingWorkflow);
 return <div className="space-y-3">{config.application?.worlds.map(world=>{const ids=value[world.id]??[];return <details key={world.id} className="cm-item"><summary>{world.label.zh||world.id} · {ids.length} 个工作流</summary><div className="mt-2 space-y-2">{candidates.map(workflow=><HelpLabel context="WorkflowAvailabilityEditor" key={workflow.id} className="mr-3 inline-flex gap-1 text-sm"><input type="checkbox" checked={ids.includes(workflow.id)} onChange={event=>onChange({...value,[world.id]:event.target.checked?[...ids,workflow.id]:ids.filter(id=>id!==workflow.id)})}/>{workflow.label.zh||workflow.id}</HelpLabel>)}<ol>{ids.map((id,index)=><li key={id} className="flex items-center gap-2"><span>{candidates.find(item=>item.id===id)?.label.zh??id}</span><GripOrderControls scope={'world-workflows:'+world.id} index={index} count={ids.length} onMove={(from,to)=>{const next=[...ids],[moved]=next.splice(from,1);next.splice(to,0,moved);onChange({...value,[world.id]:next});}}/><button type="button" className="text-sm text-red-600" onClick={()=>onChange({...value,[world.id]:ids.filter(value=>value!==id)})}>移除</button></li>)}</ol></div></details>;})}</div>;
}
