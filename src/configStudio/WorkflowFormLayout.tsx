import {workflowLayout} from './workflowLayout';
import {useEffect,useId,useRef,useState,type ReactNode} from 'react';
import type {WorkflowStep,WorkflowControl} from './types';
function Section({section,children,errorControlId,focusError,errorSignal}:{section:NonNullable<WorkflowStep['sections']>[number];children:ReactNode;errorControlId?:string;focusError:boolean;errorSignal:string[]}){
 const [open,setOpen]=useState(section.initialOpen!==false),contentId=useId(),root=useRef<HTMLElement>(null);
 useEffect(()=>{if(errorControlId)setOpen(true);},[errorControlId,errorSignal]);
 // Wait for the expanded DOM; an inactive responsive copy must not steal focus.
 useEffect(()=>{if(!open||!errorControlId||!focusError)return;const frame=requestAnimationFrame(()=>{if(!root.current?.getBoundingClientRect().height)return;const control=[...root.current.querySelectorAll<HTMLElement>('[data-workflow-control],[data-edit-control]')].find(node=>(node.dataset.workflowControl??node.dataset.editControl)===errorControlId);control?.querySelector<HTMLElement>('input:not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled)')?.focus();});return()=>cancelAnimationFrame(frame);},[open,errorControlId,focusError,errorSignal]);
 return <section ref={root} data-workflow-section={section.id} className="col-span-full min-w-0 rounded border"><button type="button" aria-controls={contentId} aria-expanded={open} className="flex w-full items-center gap-2 px-3 py-2 text-left font-medium" onClick={()=>setOpen(value=>!value)}><span aria-hidden>{open?'▾':'▸'}</span>{section.label.zh}</button><div id={contentId} data-workflow-section-content hidden={!open} className="cm-flex-grid border-t p-3">{children}</div></section>;
}
export function WorkflowFormLayout({step,controls,render,errors=[]}:{step:WorkflowStep;controls:WorkflowControl[];render:(c:WorkflowControl)=>ReactNode;errors?:string[]}){
 const visible=new Map(controls.map(control=>[control.id,control]));
 return <>{workflowLayout(step).map(item=>{
  if(item.kind==='control'){const control=visible.get(item.controlId);return control?render(control):null;}
  const section=step.sections?.find(s=>s.id===item.sectionId),children=item.children.flatMap(ref=>{const c=visible.get(ref.controlId);return c?[c]:[];});
  if(!section||!children.length)return null;const errorControlId=errors.find(id=>children.some(c=>c.id===id));
  return <Section key={section.id} section={section} errorControlId={errorControlId} focusError={errorControlId===errors[0]} errorSignal={errors}>{children.map(render)}</Section>;
 })}</>;
}
