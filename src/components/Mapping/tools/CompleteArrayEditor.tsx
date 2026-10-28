import {useEffect,useRef,useState} from 'react';
import {X,Undo2,Redo2} from 'lucide-react';
import {DraggablePanel} from '@/components/DraggablePanel/DraggablePanel';
import AppCard from '@/components/ui/AppCard';
import AppButton from '@/components/ui/AppButton';
import type {MultipartGeometry} from '@/core/geometry/multipartGeometry';
import {completeArrayText,parseCompleteArray} from '../core/editingGeometry';

/** Separate text transaction, intentionally independent of the focus-array editor.
 * There is no reverse operation here. Only the measuring owner applies geometry. */
export default function CompleteArrayEditor({initial,sessionId,readOnly,allowParts,onApply,onClose}:{initial:MultipartGeometry;sessionId:number;readOnly:boolean;allowParts:boolean;onApply:(geometry:MultipartGeometry,sessionId:number)=>void;onClose:()=>void}){
  const [compact,setCompact]=useState(()=>window.innerWidth<640);
  useEffect(()=>{const resize=()=>setCompact(window.innerWidth<640);window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);
  const [text,setText]=useState(()=>completeArrayText(initial));
  const [applied,setApplied]=useState(text);
  const [undo,setUndo]=useState<string[]>([]),[redo,setRedo]=useState<string[]>([]);
  const [validated,setValidated]=useState<{text:string;geometry:MultipartGeometry}|null>(()=>{try{return {text,geometry:parseCompleteArray(text,initial.type,allowParts)};}catch{return null;}});
  const [error,setError]=useState('');
  const readOnlyRef=useRef(readOnly);readOnlyRef.current=readOnly;
  const change=(next:string)=>{if(readOnlyRef.current)return;setUndo(v=>[...v,text]);setRedo([]);setText(next);setValidated(null);setError('');};
  const history=(reverse=false)=>{if(readOnlyRef.current)return;const stack=reverse?redo:undo;if(!stack.length)return;const next=stack[stack.length-1];(reverse?setRedo:setUndo)(stack.slice(0,-1));(reverse?setUndo:setRedo)(v=>[...v,text]);setText(next);setValidated(null);setError('');};
  const close=()=>{if(text!==applied&&!window.confirm('完整数组中存在未应用的修改，确定关闭并放弃这些修改吗？'))return;onClose();};
  const validate=()=>{try{const geometry=parseCompleteArray(text,initial.type,allowParts);setValidated({text,geometry});setError('');}catch(e){setValidated(null);setError(e instanceof Error?e.message:String(e));}};
  const apply=()=>{if(readOnlyRef.current||!validated||validated.text!==text)return false;try{const geometry=parseCompleteArray(text,initial.type,allowParts);onApply(geometry,sessionId);setApplied(text);setError('已应用完整数组；部件和内洞按当前数组顺序编号。');return true;}catch(e){setValidated(null);setError(e instanceof Error?e.message:String(e));return false;}};
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(!(e.ctrlKey||e.metaKey)||e.altKey)return;const el=e.target as HTMLElement;if(!el.closest('[data-complete-array-editor]'))return;if(e.key.toLowerCase()==='z'||e.key.toLowerCase()==='y'){e.preventDefault();history(e.key.toLowerCase()==='y'||e.shiftKey);}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);});
  const ready=!!validated&&validated.text===text&&!readOnly;
  const content=<AppCard className="w-[420px] max-w-[calc(100vw-16px)] overflow-hidden border"><div data-complete-array-editor>
    <div className="flex items-center justify-between border-b px-4 py-3"><div className="flex items-center gap-2"><h3 className="font-bold text-gray-800">完整数组编辑</h3>{validated?<span className="rounded bg-green-100 px-2 py-0.5 text-[11px] text-green-700">已校验</span>:null}</div><AppButton type="button" aria-label="关闭完整数组" title="关闭" className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" onClick={close}><X className="h-4 w-4"/></AppButton></div>
    <div className="space-y-3 p-3"><p className="text-xs text-gray-600">{initial.type==='Point'?'CoordP：点部件 → [x,y,z]':initial.type==='LineString'?'CoordL：部件 → 坐标 → [x,y,z]':'CoordG：部件 → 外环/内洞 → 坐标 → [x,y,z]'}。null 表示未放置坐标，必须补齐后才能应用。</p>
    <textarea aria-label="完整 Coord 数组" className="h-56 w-full rounded border px-3 py-2 font-mono text-sm" value={text} disabled={readOnly} onChange={e=>change(e.target.value)}/>
    <div className="flex gap-2"><AppButton type="button" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-2 py-2 text-sm text-white disabled:opacity-50" disabled={!undo.length||readOnly} onClick={()=>history()}><Undo2 className="h-4 w-4"/>撤回</AppButton><AppButton type="button" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-400 px-2 py-2 text-sm text-white disabled:opacity-50" disabled={!redo.length||readOnly} onClick={()=>history(true)}><Redo2 className="h-4 w-4"/>恢复</AppButton></div>
    <div className="grid grid-cols-3 gap-2"><AppButton type="button" className={`rounded-lg px-2 py-2 text-sm ${readOnly||validated?'cursor-not-allowed bg-gray-200 text-gray-400':'bg-blue-600 text-white'}`} disabled={readOnly||!!validated} onClick={validate}>校验</AppButton><AppButton type="button" className={`rounded-lg px-2 py-2 text-sm ${ready?'bg-green-600 text-white':'cursor-not-allowed bg-gray-200 text-gray-400'}`} disabled={!ready} onClick={apply}>应用</AppButton><AppButton type="button" className={`rounded-lg px-2 py-2 text-sm ${ready?'bg-emerald-700 text-white':'cursor-not-allowed bg-gray-200 text-gray-400'}`} disabled={!ready} onClick={()=>{if(text===applied||apply())onClose();}}>完成</AppButton></div>
    {readOnly?<p role="alert" className="text-xs text-rose-700">当前上下文只读，不能应用；请返回原世界或关闭工具。</p>:null}{error?<p role="status" className="whitespace-pre-line text-xs text-rose-700">{error}</p>:null}
    </div></div></AppCard>;
  return compact?<div className="fixed inset-x-2 top-20 z-[2800] max-h-[calc(100dvh-96px)] overflow-y-auto" data-complete-array-compact>{content}</div>:<DraggablePanel id="complete-array-editor-panel" defaultPosition={{x:392,y:320}} zIndex={1860}>{content}</DraggablePanel>;
}
