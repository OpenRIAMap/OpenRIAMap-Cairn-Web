import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import DraggablePanel from '../DraggablePanel/DraggablePanel';
import MobileBottomSheet from '../Mobile/MobileBottomSheet';
import ContributionAuditPanel from './ContributionAuditPanel';

/** One stable portal preserves the query and edited prices across breakpoint changes. */
export default function AuditWindow({collapsed,onToggle,onClose}:{collapsed:boolean;onToggle:()=>void;onClose:()=>void}){
  const [desktop,setDesktop]=useState(()=>matchMedia('(min-width:640px)').matches);
  const [host]=useState(()=>document.createElement('div'));
  useEffect(()=>{const query=matchMedia('(min-width:640px)'),change=()=>setDesktop(query.matches);query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);
  const attach=(node:HTMLDivElement|null)=>{node?.appendChild(host);};
  return <>{desktop?<DraggablePanel id="contribution-audit" defaultPosition={{x:620,y:140}} constrainExpandedToViewport><div ref={attach}/></DraggablePanel>:<MobileBottomSheet open title="审计" collapsed={collapsed} onToggleCollapsed={onToggle} onClose={onClose}><div ref={attach}/></MobileBottomSheet>}{createPortal(<ContributionAuditPanel onClose={onClose}/>,host)}</>;
}
