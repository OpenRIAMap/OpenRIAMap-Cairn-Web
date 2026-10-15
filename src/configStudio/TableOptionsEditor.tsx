import {HelpLabel} from './SettingHelp';
import { useState } from 'react';
import type { ClassificationPath, ConfigPackageV3 } from './types';
import { bindOptionsField, bindOptionsTable, effectiveOptionTable, localOptions, prefillOptionTable, type OptionsOwner } from './lookupTables';
import { ValueOptionsEditor } from './ValueOptionsEditor';
import { FieldPrefill } from './FieldPrefillDialog';
import { ConfigDialog } from './ConfigDialog';
import { ModuleHelp } from './ModuleHelp';

export function TableOptionsEditor({config,value,disabled=false,onChange,title,allowFieldBinding=true,initialPath}:{config:ConfigPackageV3;value:OptionsOwner;disabled?:boolean;onChange:(value:OptionsOwner)=>void;title?:string;allowFieldBinding?:boolean;initialPath?:ClassificationPath}){
  const [mode,setMode]=useState<'prefill'|'bind'>(),[tableId,setTableId]=useState(''),[error,setError]=useState('');
  const table=effectiveOptionTable(config,value),bound=Boolean(value.optionsTableId||value.optionsFieldRef);
  const source=value.optionsTableId?`公共表 ${value.optionsTableId}`:value.optionsFieldRef?`字段 ${value.optionsFieldRef.nodeId}/${value.optionsFieldRef.fieldId}`:'';
  const run=(action:()=>void)=>{try{action();setError('');}catch(reason){setError(String(reason));}};
  return <div data-table-options className="min-w-0">
    {config.contractRevision>=11?<HelpLabel context="TableOptionsEditor" className="mt-2 grid max-w-xs gap-1 text-xs">对照保存值类型<select aria-label="对照保存值类型" disabled={disabled||bound} value={table.valueType} onChange={event=>onChange(localOptions(config,value,{...table,valueType:event.target.value as typeof table.valueType}))}><option value="string">文本</option><option value="number">数字</option><option value="boolean">布尔</option></select></HelpLabel>:null}
    <ValueOptionsEditor title={title} value={table.rows} disabled={disabled||bound} onChange={rows=>onChange(localOptions(config,value,{...table,rows}))}/>
    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
      <ModuleHelp title="对照取用" text="预填把字段或公共表的对照复制为可编辑副本，同值行更新名称并保留其他行；绑定则直接取用来源，来源保存后自动更新。解除绑定会复制当时的完整有效对照，之后可独立编辑。"/>
      {bound?<><span>绑定表格对照 {table.rows.length} 项 · {source}</span><button type="button" disabled={disabled} className="rounded border px-2 py-1 text-rose-700" onClick={()=>run(()=>onChange(bindOptionsTable(config,value)))}>解除对照绑定</button></>:<><button type="button" disabled={disabled} className="rounded border px-2 py-1" onClick={()=>{setMode('prefill');setTableId('');setError('');}}>预填表格</button><button type="button" disabled={disabled} className="rounded border px-2 py-1" onClick={()=>{setMode('bind');setTableId('');setError('');}}>绑定</button><button type="button" disabled={disabled} className="rounded border px-2 py-1" onClick={()=>onChange(localOptions(config,value,{...table,rows:[]}))}>清除</button></>}
    </div>
    {mode?<ConfigDialog open title={mode==='bind'?'绑定对照来源':'预填表格对照'} onClose={()=>setMode(undefined)}>
      <p className="text-sm">{mode==='bind'?'直接引用来源，不另存独立行。':'按相同保存值更新名称，保留其他本地行；仅注入名称、存储值和类型。'}</p>
      <HelpLabel context="TableOptionsEditor" className="grid min-w-0 gap-1 text-sm">公共表<select aria-label="对照来源表格" value={tableId} onChange={event=>setTableId(event.target.value)}><option value="">选择表格</option>{config.lookupTables?.map(row=><option key={row.id} value={row.id}>{row.label.zh||row.label.en}（{row.id}）</option>)}</select></HelpLabel>
      <button type="button" disabled={!tableId||disabled} className="rounded border px-3 py-1" onClick={()=>run(()=>{const table=config.lookupTables?.find(row=>row.id===tableId);if(!table)throw Error('表格不存在。');onChange(mode==='bind'?bindOptionsTable(config,value,table.id):prefillOptionTable(config,value,{valueType:table.valueType,rows:table.rows.map(({value,label})=>({value,label}))}));setMode(undefined);})}>{mode==='bind'?'绑定表格':'导入预填'}</button>
      {mode==='bind'&&allowFieldBinding&&config.contractRevision>=11?<FieldPrefill config={config} initialPath={initialPath} buttonLabel="绑定字段对照" optionsOnly single onApply={(_field,_audit,ref)=>{if(!ref)return;onChange(bindOptionsField(config,value,ref));setMode(undefined);}}/>:null}
      {error?<p role="alert" className="text-rose-700">{error}</p>:null}
    </ConfigDialog>:error?<p role="alert" className="text-xs text-rose-700">{error}</p>:null}
  </div>;
}
