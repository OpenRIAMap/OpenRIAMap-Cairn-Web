import { useLayoutEffect, useRef, useState } from 'react';
import { getApplicationSettings } from '@/core/project/applicationRuntime';
import AppCard from '@/components/ui/AppCard';
import ToolIconButton from '@/components/Toolbar/ToolIconButton';
import { RULE_BUTTON_DEFS } from './buttonRuleConfig';
import { User } from 'lucide-react';

type Props = {
  activeButtonIds: string[];
  onToggle: (id: string) => void;
  mode?: 'desktop' | 'mobile';
  frameless?: boolean;
  showPlayers?: boolean;
  onTogglePlayers?: (show: boolean) => void;
};

export default function RuleButtonPanel({ activeButtonIds, onToggle, mode = 'desktop', frameless = false, showPlayers = false, onTogglePlayers }: Props) {
  const active = new Set((activeButtonIds ?? []).map((x) => String(x).trim()).filter(Boolean));

  const mobile = mode === 'mobile';
  const cardRef=useRef<HTMLDivElement>(null),[available,setAvailable]=useState<number>(),[height,setHeight]=useState<number>();
  useLayoutEffect(()=>{
    if(mobile||frameless||!cardRef.current)return;
    const card=cardRef.current,toolbar=card.closest<HTMLElement>('[data-desktop-map-toolbar]');
    const obstruction=document.querySelector<HTMLElement>('[data-map-world-controls]');
    const measure=()=>{
      const own=toolbar?[...toolbar.children].find(item=>item.contains(card)):undefined,siblings=toolbar?[...toolbar.children].filter(item=>item!==own):[];
      const occupied=siblings.reduce((sum,item)=>sum+item.getBoundingClientRect().width,0)+siblings.length*8+(own?Math.max(0,own.getBoundingClientRect().width-card.getBoundingClientRect().width):0);
      const left=obstruction?.getBoundingClientRect(),reserved=left&&left.height>0?Math.max(0,left.right-16+8):0;
      const minimum=Math.max(44,...getApplicationSettings().buttons.items.map(item=>item.size??44))+26;
      const below=toolbar?.dataset.toolbarSide==='left'||window.innerWidth-32-reserved<occupied+minimum;
      const top=below&&left?Math.max(16,left.bottom+8):16;
      if(toolbar?.parentElement)toolbar.parentElement.style.top=top+'px';
      setAvailable(Math.max(minimum,window.innerWidth-32-(below?0:reserved)-occupied));setHeight(Math.max(100,window.innerHeight-top-16));
    };
    measure();const observer=new ResizeObserver(measure);if(toolbar)for(const item of toolbar.children)observer.observe(item);if(obstruction)observer.observe(obstruction);
    const attributes=new MutationObserver(measure);if(toolbar)attributes.observe(toolbar,{attributes:true,attributeFilter:['data-toolbar-side']});
    window.addEventListener('resize',measure);return()=>{observer.disconnect();attributes.disconnect();window.removeEventListener('resize',measure);};
  },[mobile,frameless]);
  const content = (
    <div className={`flex flex-wrap items-center ${mobile ? 'gap-1 justify-start' : 'gap-1'}`}>
      {RULE_BUTTON_DEFS.map((d) => (
        <ToolIconButton
          key={d.id}
          style={{width:getApplicationSettings().buttons.items.find(item=>item.id===d.id)?.size,height:getApplicationSettings().buttons.items.find(item=>item.id===d.id)?.size}}
          label={d.label}
          icon={d.icon}
          active={active.has(d.id)}
          tone={d.tone}
          onClick={() => onToggle(d.id)}
        />
      ))}
      {onTogglePlayers ? <ToolIconButton label="玩家" icon={<User className="w-5 h-5" />} active={showPlayers} tone="cyan" onClick={() => onTogglePlayers(!showPlayers)} /> : null}
    </div>
  );

  if (frameless) return content;

  return (
    <div ref={cardRef} className="min-w-0" style={mobile?undefined:{width:'max-content',maxWidth:available??'calc(100vw - 2rem)',maxHeight:height,overflowY:'auto'}}><AppCard className={`bg-white/90 ${mobile ? 'p-2.5 w-[172px]' : 'p-3 w-full'} flex flex-col gap-2`}>
      {content}
    </AppCard></div>
  );
}
