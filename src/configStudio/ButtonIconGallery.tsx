import {useState} from 'react';
import {BUTTON_ICONS} from '../core/project/buttonVisualCatalog';
import {resolveRuleButtonIcon} from '../components/Rules/ButtonRule/ruleButtonIconRegistry';
export default function ButtonIconGallery({value,onChange}:{value:string;onChange:(value:string)=>void}){
  const [query,setQuery]=useState(''),[page,setPage]=useState(0);
  const icons=BUTTON_ICONS.filter(([id,label])=>`${id} ${label}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="space-y-2"><label>搜索图标<input aria-label="搜索图标" className="w-full rounded border px-2 py-1" value={query} onChange={event=>{setQuery(event.target.value);setPage(0);}}/></label><div className="cm-flex-grid gap-2">{icons.slice(page*12,page*12+12).map(([id,label])=><button key={id} type="button" aria-pressed={id===value} className={`flex min-w-0 items-center gap-2 rounded border p-2 text-sm ${id===value?'border-violet-600 bg-violet-50':''}`} onClick={()=>onChange(id)}>{resolveRuleButtonIcon(id)}<span>{label} · {id}</span></button>)}</div><div className="flex items-center gap-2"><button type="button" disabled={!page} onClick={()=>setPage(page-1)}>上一组图标</button><span>{page+1}/{Math.max(1,Math.ceil(icons.length/12))}</span><button type="button" disabled={(page+1)*12>=icons.length} onClick={()=>setPage(page+1)}>下一组图标</button></div></section>;
}
