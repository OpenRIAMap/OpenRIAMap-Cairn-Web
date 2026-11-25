import {useEffect,useRef,useState} from 'react';
import {flushConfigInputs} from './BufferedControl';
import type {LayoutMove} from './workflowLayout';
type Transfer={scope:string;id:string;container:string;section:boolean;topLevelOnly:boolean};
export type FoldMove=LayoutMove;
const format='application/x-cairnmap-fold-order';
let active:Transfer|undefined,restore:Array<[HTMLElement,boolean|undefined]>=[];
function finish(){const snapshot=restore.flatMap(([node,open])=>node.dataset.foldKey&&open!==undefined?[[node.dataset.foldKey,open] as const]:[]);for(const [node,open] of restore){if(node instanceof HTMLDetailsElement&&open!==undefined)node.open=open;node.style.opacity='';delete node.dataset.orderInsert;}restore=[];active=undefined;for(const el of document.querySelectorAll<HTMLElement>('[data-order-insert]'))delete el.dataset.orderInsert;if(snapshot.length)requestAnimationFrame(()=>{for(const [key,open] of snapshot)for(const node of document.querySelectorAll<HTMLDetailsElement>('details[data-fold-key]'))if(node.dataset.foldKey===key)node.open=open;});}
function scrollAt(node:HTMLElement,y:number){for(let parent:HTMLElement|null=node;parent;parent=parent.parentElement)if(parent.scrollHeight>parent.clientHeight+4&&['auto','scroll'].includes(getComputedStyle(parent).overflowY)){const rect=parent.getBoundingClientRect();if(y<rect.top+40)parent.scrollTop-=16;else if(y>rect.bottom-40)parent.scrollTop+=16;break;}}
export function FoldOrderControls({scope,container,id,index,count,onMove,onStep,disabled=false,label='项目',rowSelector='details',section=false,sectionContainer,topLevelOnly=false,layoutMode=false}:{scope:string;container:string;id:string;index:number;count:number;onMove:(move:FoldMove)=>void;onStep:(offset:number)=>void;disabled?:boolean;label?:string;rowSelector?:string;section?:boolean;sectionContainer?:string;topLevelOnly?:boolean;layoutMode?:boolean}){
 const ref=useRef<HTMLSpanElement>(null),[expanded,setExpanded]=useState(false),callbacks=useRef(onMove);callbacks.current=onMove;
 useEffect(()=>{
  const node=ref.current?.closest<HTMLElement>(rowSelector);if(!node)return;
  node.dataset.orderScope=scope;node.dataset.orderId=id;node.dataset.orderContainer=container;if(section)node.dataset.orderSection='true';
  const toggle=()=>setExpanded(node instanceof HTMLDetailsElement&&node.open);toggle();node.addEventListener('toggle',toggle);
  const target=(event:DragEvent,positionHint?:string):FoldMove|undefined=>{
    if(!active||active.scope!==scope||active.id===id&&active.container===container||disabled)return;
    let childContainer=false;try{childContainer=!!JSON.parse(container)[1];}catch{/* Legacy flat containers. */}
    if(childContainer&&(active.section||active.topLevelOnly))return;
    if(active.section&&node.closest('[data-order-id="'+CSS.escape(active.id)+'"][data-order-section]'))return;
    const rect=(section?node.querySelector('summary'):node)?.getBoundingClientRect()??node.getBoundingClientRect(),ratio=(event.clientY-rect.top)/Math.max(rect.height,1);
    let position=positionHint??(ratio>.5?'after':'before');
    if(section)position=ratio<1/3?'before':ratio<2/3?'into-end':node instanceof HTMLDetailsElement&&node.open?'into-start':'after';
    const inside=position.startsWith('into-');if(inside&&(active.section||active.topLevelOnly))return;
    node.dataset.orderInsert=position;
    return {from:active.id,to:inside?'':id,after:position==='after',fromContainer:active.container,toContainer:inside?sectionContainer!:container,...(inside?{into:position==='into-start'?'start' as const:'end' as const}:{})};
  };
  const over=(event:DragEvent)=>{if(active?.scope===scope)event.stopPropagation();const move=target(event);if(!move){delete node.dataset.orderInsert;if(event.dataTransfer)event.dataTransfer.dropEffect='none';return;}event.preventDefault();if(event.dataTransfer)event.dataTransfer.dropEffect='move';scrollAt(node,event.clientY);};
  const drop=(event:DragEvent)=>{if(active?.scope===scope)event.stopPropagation();const move=target(event,layoutMode?undefined:node.dataset.orderInsert);if(!move)return;event.preventDefault();finish();callbacks.current(move);};
  const leave=(event:DragEvent)=>{if(!node.contains(event.relatedTarget as Node))delete node.dataset.orderInsert;};
  node.addEventListener('dragover',over);node.addEventListener('drop',drop);node.addEventListener('dragleave',leave);
  return()=>{node.removeEventListener('toggle',toggle);node.removeEventListener('dragover',over);node.removeEventListener('drop',drop);node.removeEventListener('dragleave',leave);};
 },[scope,container,id,disabled,rowSelector,section,sectionContainer,layoutMode]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape')finish();};window.addEventListener('blur',finish);window.addEventListener('keydown',key);return()=>{window.removeEventListener('blur',finish);window.removeEventListener('keydown',key);};},[]);
 return <span data-order-controls ref={ref} className="ml-auto inline-flex items-center gap-1" onClick={event=>event.stopPropagation()}>
  <button type="button" draggable={!disabled&&(layoutMode||!expanded)} disabled={disabled||!layoutMode&&expanded} aria-label={`拖动${label}`} title={layoutMode?'拖动到插入线或分栏内部':expanded?'收起后才可拖动':'拖动到插入线位置'} className="cursor-grab rounded border px-1 text-slate-500 disabled:opacity-30" onDragStart={event=>{
    const node=ref.current?.closest<HTMLElement>(rowSelector);if(!node||disabled||!layoutMode&&node instanceof HTMLDetailsElement&&node.open||!flushConfigInputs()){event.preventDefault();return;}
    active={scope,container,id,section,topLevelOnly};event.dataTransfer.setData(format,JSON.stringify(active));event.dataTransfer.effectAllowed='move';
    restore=Array.from(document.querySelectorAll<HTMLElement>('[data-order-scope]')).filter(item=>item.dataset.orderScope===scope).map(item=>[item,item instanceof HTMLDetailsElement?item.open:undefined]);
    for(const [item] of restore)if(item instanceof HTMLDetailsElement&&(!layoutMode||!item.dataset.orderSection||item===node))item.open=false;
    node.style.opacity='.35';event.stopPropagation();
  }} onDragEnd={finish}>⠿</button>
  <button type="button" aria-label={`${label} 上移`} disabled={disabled||index<=0} className="rounded border px-1 disabled:opacity-30" onClick={()=>onStep(-1)}>↑</button>
  <button type="button" aria-label={`${label} 下移`} disabled={disabled||index>=count-1} className="rounded border px-1 disabled:opacity-30" onClick={()=>onStep(1)}>↓</button>
 </span>;
}
export function FoldDropArea({scope,container,onMove,children,sectionContainer=false}:{scope:string;container:string;onMove:(move:FoldMove)=>void;children:React.ReactNode;sectionContainer?:boolean}){
 const allowed=()=>active?.scope===scope&&!(sectionContainer&&(active.section||active.topLevelOnly));
 return <div className="min-h-6 rounded" data-order-drop-container={container} onDragOver={event=>{if(!allowed())return;event.preventDefault();event.stopPropagation();event.currentTarget.dataset.orderInsert='after';scrollAt(event.currentTarget,event.clientY);}} onDragLeave={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))delete event.currentTarget.dataset.orderInsert;}} onDrop={event=>{if(!allowed()||!active)return;event.preventDefault();event.stopPropagation();const move={from:active.id,to:'',after:true,fromContainer:active.container,toContainer:container};finish();onMove(move);}}>{children}<div aria-hidden className="h-5"/></div>;
}
