import { useState } from 'react';
import type { ConfigPackageV3 } from './types';
import { bindOptionsTable, effectiveOptions, type OptionsOwner } from './lookupTables';
import { ValueOptionsEditor } from './ValueOptionsEditor';

export function TableOptionsEditor({config,value,disabled=false,onChange,title}:{config:ConfigPackageV3;value:OptionsOwner;disabled?:boolean;onChange:(value:OptionsOwner)=>void;title?:string}){
  const [picking,setPicking]=useState(Boolean(value.optionsTableId));
  const table=config.lookupTables?.find(row=>row.id===value.optionsTableId);
  return <div data-table-options className="min-w-0">
    <ValueOptionsEditor title={title} value={effectiveOptions(config,value)} disabled={disabled||Boolean(value.optionsTableId)} onChange={options=>onChange({...value,options})}/>
    {config.contractRevision>=10?<div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
      {!value.optionsTableId?<button type="button" disabled={disabled} className="rounded border px-2 py-1" onClick={()=>setPicking(!picking)}>使用既有表格</button>:<><span>绑定表格：{table?.label.zh??'不存在'}（{value.optionsTableId}）</span><button type="button" disabled={disabled} className="rounded border px-2 py-1" onClick={()=>{onChange(bindOptionsTable(config,value));setPicking(false);}}>解除绑定，保留本地副本</button></>}
      {picking?<label className="min-w-0">使用表格<select aria-label="使用表格" disabled={disabled} className="ml-2 max-w-full rounded border px-2 py-1" value={value.optionsTableId??''} onChange={event=>{if(event.target.value)onChange(bindOptionsTable(config,value,event.target.value));}}><option value="">请选择</option>{config.lookupTables?.map(row=><option key={row.id} value={row.id}>{row.label.zh}（{row.id}）</option>)}</select></label>:null}
    </div>:null}
  </div>;
}
