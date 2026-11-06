import {useLayoutEffect,useRef,useState,type RefObject} from 'react';
import {createPortal} from 'react-dom';

/** A map toolbar hint must live outside its scroll container, below blocking dialogs. */
export function ToolButtonTooltip({anchor,label,onClose}:{anchor:RefObject<HTMLButtonElement>;label:string;onClose:()=>void}){
 const tip=useRef<HTMLSpanElement>(null),[position,setPosition]=useState({left:0,top:0,ready:false});
 useLayoutEffect(()=>{
  const update=()=>{
   const button=anchor.current,node=tip.current;
   if(!button||!node||!button.isConnected||button.closest('[inert]')||!button.getClientRects().length||document.querySelector('[data-blocking-modal],[aria-modal="true"]')){onClose();return;}
   const r=button.getBoundingClientRect(),t=node.getBoundingClientRect();
   const left=r.left-t.width-8>=8?r.left-t.width-8:Math.min(innerWidth-t.width-8,r.right+8);
   setPosition({left:Math.max(8,left),top:Math.max(8,Math.min(innerHeight-t.height-8,r.top+(r.height-t.height)/2)),ready:true});
  };
  update();window.addEventListener('resize',update);window.addEventListener('scroll',update,true);
  const resize=new ResizeObserver(update);if(anchor.current)resize.observe(anchor.current);
  const modal=new MutationObserver(()=>{if(document.querySelector('[data-blocking-modal],[aria-modal="true"]')||anchor.current?.closest('[inert]'))onClose();});modal.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['inert']});
  return()=>{window.removeEventListener('resize',update);window.removeEventListener('scroll',update,true);resize.disconnect();modal.disconnect();};
 },[anchor,label,onClose]);
 return createPortal(<span ref={tip} role="tooltip" className="pointer-events-none fixed z-[2600] max-w-[calc(100vw-16px)] rounded bg-gray-800 px-2 py-1 text-xs text-white" style={{left:position.left,top:position.top,visibility:position.ready?'visible':'hidden'}}>{label}</span>,document.body);
}
