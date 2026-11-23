import {useEffect,useState,type ReactNode} from 'react';
import type {WorkflowStep,WorkflowControl} from './types';
function Section({section,children,forceOpen}:{section:NonNullable<WorkflowStep['sections']>[number];children:ReactNode;forceOpen:boolean}){
 const [open,setOpen]=useState(section.initialOpen!==false);useEffect(()=>{if(forceOpen)setOpen(true);},[forceOpen]);
 return <section data-workflow-section={section.id} className="col-span-full min-w-0 rounded border"><button type="button" aria-expanded={open} className="flex w-full items-center gap-2 px-3 py-2 text-left font-medium" onClick={()=>setOpen(!open)}><span aria-hidden>{open?'▾':'▸'}</span>{section.label.zh}</button><div hidden={!open} className="cm-flex-grid border-t p-3">{children}</div></section>;
}
export function WorkflowFormLayout({step,controls,render,errors=[]}:{step:WorkflowStep;controls:WorkflowControl[];render:(c:WorkflowControl)=>ReactNode;errors?:string[]}){
 const seen=new Set<string>();return <>{controls.map(control=>{const section=step.sections?.find(s=>s.id===control.sectionId);if(!section)return render(control);if(seen.has(section.id))return null;seen.add(section.id);const children=controls.filter(c=>c.sectionId===section.id);return <Section key={section.id} section={section} forceOpen={children.some(c=>errors.includes(c.id))}>{children.map(render)}</Section>;})}</>;
}
