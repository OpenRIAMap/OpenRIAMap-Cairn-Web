import { useRef, useState } from 'react';
import type { RenderLabelStyle } from './types';
import { evaluateLabelTemplate, parseLabelTemplate } from './labelTemplate';

export function LabelSourceEditor({label,fields,onChange}:{label:RenderLabelStyle;fields:string[];onChange:(patch:Partial<RenderLabelStyle>)=>void}){
  const input=useRef<HTMLTextAreaElement>(null),[sample,setSample]=useState<Record<string,string>>({});
  let paths:string[]=[],error='',preview='';
  if(label.sourceMode==='combined')try{const tokens=parseLabelTemplate(label.template??'');paths=[...new Set(tokens.filter(token=>token.kind==='field').map(token=>token.value))];preview=evaluateLabelTemplate(tokens,path=>sample[path])??'（主组合为空，将使用回退来源）';}catch(value){error=(value as Error).message;}
  const insert=(path:string)=>{const element=input.current,start=element?.selectionStart??label.template?.length??0,end=element?.selectionEnd??start,current=label.template??'';onChange({template:current.slice(0,start)+'"'+path+'"'+current.slice(end)});element?.focus();};
  return <section className="cm-field-card space-y-2" aria-label="Label 来源">
    <label className="block text-xs">来源<select className="mt-1 w-full rounded border px-2 py-1" value={label.sourceMode??'single'} onChange={event=>onChange({sourceMode:event.target.value as 'single'|'combined'})}><option value="single">单一来源</option><option value="combined">组合来源</option></select></label>
    {label.sourceMode!=='combined'?<label className="block text-xs">主来源<select className="mt-1 w-full rounded border px-2 py-1" value={label.source??''} onChange={event=>onChange({source:event.target.value||undefined})}><option value="">不绑定来源（显示 Null）</option>{fields.map(field=><option key={field}>{field}</option>)}</select></label>:<>
      <label className="block text-xs">字段组合公式<textarea ref={input} className="mt-1 w-full rounded border px-2 py-1 font-mono" value={label.template??''} onChange={event=>onChange({template:event.target.value})} placeholder={'"bureau""line"'} /></label>
      <p className="text-xs text-slate-600">双引号内引用字段，外部文字原样连接。双击字段插入；空字段使用回退来源，0 和 false 保留。</p>
      <div className="flex flex-wrap gap-1">{fields.map(field=><button type="button" className="rounded border px-2 py-1 text-xs" key={field} onDoubleClick={()=>insert(field)}>{field}</button>)}</div>
      {error?<p role="alert" className="text-xs text-red-700">{error}</p>:<details><summary className="text-xs">组合结果预览（示例值）</summary><div className="cm-flex-grid gap-2">{paths.map(path=><label className="text-xs" key={path}>{path}<input className="mt-1 w-full rounded border px-2 py-1" value={sample[path]??''} onChange={event=>setSample({...sample,[path]:event.target.value})}/></label>)}</div><output className="block break-words rounded bg-slate-50 p-2 text-sm">{preview}</output></details>}
    </>}
  </section>;
}
