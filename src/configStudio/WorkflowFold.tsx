import {createContext,useContext,useLayoutEffect,useMemo,useRef,type ReactNode} from 'react';
import type {ConfigValidationIssue,WorkflowDefinition} from './types';
const Context=createContext({workflowId:'',issues:[] as ConfigValidationIssue[]});
export function WorkflowFoldScope({workflowId,issues,children}:{workflowId:string;issues:ConfigValidationIssue[];children:ReactNode}){
 const value=useMemo(()=>({workflowId,issues}),[workflowId,issues]);return <Context.Provider value={value}>{children}</Context.Provider>;
}
/** UI identities follow editable rows without entering configuration or hashes. */
const identities=new WeakMap<object,string>();let sequence=0;
export function workflowItemKey(value:object):string{let id=identities.get(value);if(!id){id='row-'+(++sequence);identities.set(value,id);}return id;}
export function keepWorkflowItemKey<T extends object>(before:object,after:T):T{identities.set(after,workflowItemKey(before));return after;}
export function locateWorkflowSetting(path:string):void{
 const nodes=Array.from(document.querySelectorAll<HTMLElement>('[data-workflow-path]')).filter(node=>path===node.dataset.workflowPath||path.startsWith(node.dataset.workflowPath+'/'));
 const target=nodes.sort((a,b)=>(b.dataset.workflowPath?.length??0)-(a.dataset.workflowPath?.length??0))[0];if(!target)return;
 for(let parent:HTMLElement|null=target;parent;parent=parent.parentElement)if(parent instanceof HTMLDetailsElement)parent.open=true;
 requestAnimationFrame(()=>{target.scrollIntoView({block:'center'});target.querySelector<HTMLElement>('input,textarea,select,button')?.focus();});
}
export function WorkflowFold({title,foldKey,path,children}:{title:ReactNode;foldKey:string;path?:string;children:ReactNode}){
 const context=useContext(Context),ref=useRef<HTMLDetailsElement>(null),full=path?`workflows/${context.workflowId}/${path}`:undefined;
 const errors=full?context.issues.filter(issue=>issue.severity==='error'&&(issue.path===full||issue.path.startsWith(full+'/'))):[];
 useLayoutEffect(()=>{const node=ref.current;if(!node)return;const focus=(event:FocusEvent)=>{if(event.target!==node.querySelector(':scope > summary'))node.open=true;};node.addEventListener('focusin',focus);return()=>node.removeEventListener('focusin',focus);},[]);
 return <details ref={ref} data-fold-key={'workflow:'+context.workflowId+':'+foldKey} data-workflow-path={full} className="cm-subsection cm-workflow-fold"><summary className="cursor-pointer font-medium">{title}{errors.length?<span className="ml-2 text-xs text-rose-700">{errors.length} 项错误</span>:null}</summary><div className="mt-3">{children}</div></details>;
}

/** Indices only pair UI identities with this exact checkpoint; live keys are stable row IDs. */
export function workflowRowIdentities(workflow:WorkflowDefinition,restore?:Record<string,string>):Record<string,string>{
 const result:Record<string,string>={};
 const visit=(path:string,row:object)=>{const id=restore?.[path];if(id&&/^row-\d+$/.test(id)){identities.set(row,id);sequence=Math.max(sequence,Number(id.slice(4)));}result[path]=workflowItemKey(row);};
 for(const step of workflow.steps){for(const control of step.controls??[])for(const [index,field]of (control.group?.itemFields??[]).entries())visit(step.id+'/controls/'+control.id+'/group/'+index,field);for(const [index,binding]of (step.drawing?.bindings??[]).entries())visit(step.id+'/bindings/'+index,binding);}
 return result;
}
export function restoreWorkflowRows<T extends WorkflowDefinition|null>(workflow:T,keys?:Record<string,string>):T{if(workflow&&keys)workflowRowIdentities(workflow,keys);return workflow;}
