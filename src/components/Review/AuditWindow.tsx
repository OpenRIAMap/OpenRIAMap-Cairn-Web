import {useCallback,useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import DraggablePanel from '../DraggablePanel/DraggablePanel';
import MobileBottomSheet from '../Mobile/MobileBottomSheet';
import ContributionAuditPanel from './ContributionAuditPanel';
import type {ConfigPackageV3} from '@/configStudio/types';

/** One stable portal preserves the query and edited prices across breakpoint changes. */
export default function AuditWindow({collapsed,onToggle,onClose,configuration,formal=true}:{collapsed:boolean;onToggle:()=>void;onClose:()=>void;configuration?:ConfigPackageV3;formal?:boolean}){
  const [desktop,setDesktop]=useState(()=>matchMedia('(min-width:640px)').matches);
  const [host]=useState(()=>document.createElement('div'));
  const scroll=useRef(0);
  const migrating=useRef(false);
  const restoreFrame=useRef(0);
  useEffect(()=>{const query=matchMedia('(min-width:640px)'),change=()=>{migrating.current=true;setDesktop(query.matches);};query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);
  useEffect(()=>{const remember=(event:Event)=>{const target=event.target;if(!migrating.current&&host.isConnected&&target instanceof HTMLElement&&target.clientHeight>0&&target.hasAttribute('data-audit-scroll'))scroll.current=target.scrollTop;};host.addEventListener('scroll',remember,true);return()=>host.removeEventListener('scroll',remember,true);},[host]);
  const attach=useCallback((node:HTMLDivElement|null)=>{
    if(!node)return;
    if(host.parentNode===node)return;
    node.appendChild(host);
    migrating.current=true;
    cancelAnimationFrame(restoreFrame.current);
    const saved=scroll.current;let attempts=0,visibleFrames=0;
    // Desktop's portal host is connected after this ref runs. Wait for its
    // measured scroll container before restoring, rather than clamping to 0
    // while the new host is still detached.
    const restore=()=>{
      const body=host.querySelector<HTMLElement>('[data-audit-scroll]');
      if(body&&host.isConnected&&body.clientHeight>0){body.scrollTop=saved;visibleFrames++;}
      if(++attempts<30&&visibleFrames<2)restoreFrame.current=requestAnimationFrame(restore);
      else migrating.current=false;
    };
    restoreFrame.current=requestAnimationFrame(restore);
  },[host]);
  useEffect(()=>()=>cancelAnimationFrame(restoreFrame.current),[]);
  return <>{desktop?<DraggablePanel id="contribution-audit" defaultPosition={{x:620,y:140}} constrainExpandedToViewport><div ref={attach}/></DraggablePanel>:<MobileBottomSheet open title="审计" collapsed={collapsed} onToggleCollapsed={onToggle} onClose={onClose}><div ref={attach}/></MobileBottomSheet>}{createPortal(<ContributionAuditPanel onClose={onClose} configuration={configuration} formal={formal}/>,host)}</>;
}
