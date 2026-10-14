import { GripVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ConfigPackageV3, LookupTable } from './types';
import { renameLookupTable, tableReferences } from './lookupTables';

type Hub = Exclude<NonNullable<LookupTable['rows'][number]['functionValue']>,number>;
const inputClass='mt-1 w-full min-w-0 rounded border px-2 py-1';
function TableIdInput({id,onRename}:{id:string;onRename:(next:string)=>boolean}){
  const [text,setText]=useState(id);useEffect(()=>setText(id),[id]);
  return <label>表格 ID<input className={inputClass} value={text} onChange={event=>setText(event.target.value)} onBlur={()=>{if(!onRename(text.trim()))setText(id);}}/></label>;
}
function HubEditor({value,onChange}:{value:Hub;onChange:(value:Hub)=>void}){
  return <div className="col-span-full rounded border bg-white p-2"><div className="cm-flex-grid gap-2"><label>世界<input className={inputClass} value={value.world} onChange={event=>onChange({...value,world:event.target.value})}/></label><label>范围（方块）<input type="number" min={1} className={inputClass} value={value.range} onChange={event=>onChange({...value,range:Number(event.target.value)})}/></label></div>
    {value.returnPoints.map((point,index)=><article key={index} className="mt-2 rounded border p-2"><h5 className="font-medium">返回点 {index+1}</h5><div className="cm-flex-grid gap-2">{(['id','zh','en','x','y','z'] as const).map(key=><label key={key}>{key==='id'?'返回点 ID':key==='zh'?'名称 zh':key==='en'?'名称 en':key}<input className={inputClass} type={['x','y','z'].includes(key)?'number':'text'} value={key==='zh'||key==='en'?point.label[key]:point[key]} onChange={event=>onChange({...value,returnPoints:value.returnPoints.map((row,i)=>i!==index?row:key==='zh'||key==='en'?{...row,label:{...row.label,[key]:event.target.value}}:{...row,[key]:key==='id'?event.target.value:Number(event.target.value)})})}/></label>)}</div><button type="button" className="mt-2 text-rose-700" onClick={()=>onChange({...value,returnPoints:value.returnPoints.filter((_,i)=>i!==index)})}>删除返回点</button></article>)}
    <button type="button" className="mt-2 rounded border px-2 py-1" onClick={()=>onChange({...value,returnPoints:[...value.returnPoints,{id:'',label:{zh:'',en:''},x:0,y:-64,z:0}]})}>添加返回点</button>
  </div>;
}
export function LookupTablesEditor({config,onChange}:{config:ConfigPackageV3;onChange:(config:ConfigPackageV3)=>void}){
  const [drag,setDrag]=useState<{table:string;row:number}>(),[message,setMessage]=useState('');
  useEffect(()=>setMessage(''),[config]);
  const update=(id:string,patch:Partial<LookupTable>)=>onChange({...config,lookupTables:config.lookupTables?.map(table=>table.id===id?{...table,...patch}:table)});
  return <details className="mb-3 min-w-0 rounded border bg-slate-50 p-3"><summary className="cursor-pointer font-medium">预留对照表格</summary><p className="mt-2 text-xs text-slate-600">字段与下拉控件可显式绑定表格；预填只复制当时的名称与存储值。功能值供已接入的外部模块读取。</p>
    {(config.lookupTables??[]).map((table,tableIndex)=><article key={tableIndex} className="cm-field-card mt-3"><header>{table.label.zh}（{table.id}）</header><div className="cm-flex-grid gap-2 text-xs">
      <label>表格名<input className={inputClass} value={table.label.zh} onChange={event=>update(table.id,{label:{...table.label,zh:event.target.value}})}/></label>
      <label>名称 en<input className={inputClass} value={table.label.en} onChange={event=>update(table.id,{label:{...table.label,en:event.target.value}})}/></label>
      <TableIdInput id={table.id} onRename={next=>{try{onChange(renameLookupTable(config,table.id,next));return true;}catch(error){setMessage(String(error));return false;}}}/>
      <label>存储值类型<select className={inputClass} value={table.valueType} onChange={event=>update(table.id,{valueType:event.target.value as LookupTable['valueType']})}><option value="string">文本</option><option value="number">数字</option><option value="boolean">布尔</option></select></label>
      <label>功能值格式<select className={inputClass} value={table.functionKind} onChange={event=>{const kind=event.target.value as LookupTable['functionKind'];update(table.id,{functionKind:kind,rows:table.rows.map(row=>({...row,functionValue:kind==='none'?undefined:kind==='speed'?1:{world:'zth',range:100,returnPoints:[]}}))});}}><option value="none">无</option><option value="speed">速度（方块/秒）</option><option value="teleportHub">枢纽（世界、范围、返回点）</option></select></label>
    </div>
    {table.rows.map((row,index)=><section key={index} className="mt-3 rounded border bg-slate-50 p-2 text-xs" onDragOver={event=>event.preventDefault()} onDrop={event=>{event.preventDefault();event.stopPropagation();if(drag?.table!==table.id||drag.row===index)return;const rows=[...table.rows],[moved]=rows.splice(drag.row,1);rows.splice(index,0,moved);update(table.id,{rows});setDrag(undefined);}}>
      <div className="cm-flex-grid gap-2"><span draggable onDragStart={event=>{event.stopPropagation();setDrag({table:table.id,row:index});}} onDragEnd={()=>setDrag(undefined)} className="cursor-grab self-center" title="拖动手柄调整行顺序"><GripVertical className="h-4 w-4"/></span>
        {(['zh','en','value'] as const).map(key=><label key={key}>{key==='value'?'存储值':`名称 ${key}`}<input className={inputClass} value={key==='value'?row.value:row.label[key]} onChange={event=>update(table.id,{rows:table.rows.map((item,i)=>i!==index?item:key==='value'?{...item,value:event.target.value}:{...item,label:{...item.label,[key]:event.target.value}})})}/></label>)}
        {table.functionKind==='speed'?<label>功能值（方块/秒）<input type="number" min={0.001} step="any" className={inputClass} value={typeof row.functionValue==='number'?row.functionValue:''} onChange={event=>update(table.id,{rows:table.rows.map((item,i)=>i!==index?item:{...item,functionValue:Number(event.target.value)})})}/></label>:null}
        <button type="button" className="self-center text-rose-700" onClick={()=>update(table.id,{rows:table.rows.filter((_,i)=>i!==index)})}>删除行</button>
        {table.functionKind==='teleportHub'&&row.functionValue&&typeof row.functionValue!=='number'?<HubEditor value={row.functionValue} onChange={functionValue=>update(table.id,{rows:table.rows.map((item,i)=>i!==index?item:{...item,functionValue})})}/>:null}
      </div>
    </section>)}
    <div className="mt-2 flex flex-wrap gap-2 text-xs"><button type="button" className="rounded border px-2 py-1" onClick={()=>update(table.id,{rows:[...table.rows,{value:'',label:{zh:'',en:''},functionValue:table.functionKind==='speed'?1:table.functionKind==='teleportHub'?{world:'zth',range:100,returnPoints:[]}:undefined}]})}>添加选项</button><button type="button" className="rounded border px-2 py-1 text-rose-700" onClick={()=>{const refs=tableReferences(config,table.id);if(refs.length){setMessage(`不能删除，仍被引用：${refs.join('；')}`);return;}setMessage('');onChange({...config,lookupTables:config.lookupTables?.filter(row=>row.id!==table.id)});}}>删除表格</button></div>
    </article>)}
    <button type="button" className="mt-3 rounded border bg-white px-3 py-1 text-sm" onClick={()=>{let index=1;while(config.lookupTables?.some(table=>table.id===`table-${index}`))index++;onChange({...config,lookupTables:[...config.lookupTables??[],{id:`table-${index}`,label:{zh:'新对照表',en:''},valueType:'string',functionKind:'none',rows:[]}]});}}>添加对照</button>
    {message?<p role="alert" className="mt-2 text-xs text-rose-700">{message}</p>:null}
  </details>;
}
