import {HelpControl} from './SettingHelp';
import {useEffect,useRef,useState} from 'react';
import {fetchFormalDefaultConfig} from './formalDefault';
import {readConfigPackageWithDiagnostics} from './package';
import {validateConfigPackage} from './runtime';
import type {ConfigPackageV3} from './types';
type Entry={id:string;name:string;config:ConfigPackageV3};
/** This pool belongs to this page. The iframe owns its runtime and derived caches. */
export function ConfigLab({onClose}:{onClose:()=>void}){
 const [entries,setEntries]=useState<Entry[]>([]),[selected,setSelected]=useState('formal'),[message,setMessage]=useState('正在读取当前正式配置…'),[ready,setReady]=useState(false),input=useRef<HTMLInputElement>(null),frame=useRef<HTMLIFrameElement>(null);
 const entry=entries.find(item=>item.id===selected),entryRef=useRef(entry);entryRef.current=entry;
 useEffect(()=>{let live=true;void fetchFormalDefaultConfig().then(config=>{if(live){setEntries([{id:'formal',name:`当前正式配置 r${config.revision} / c${config.contractRevision}`,config}]);setMessage('运行环境独立于配置编辑工作区；导入版本仅保留于当前页面。');}}).catch(error=>{if(live)setMessage(String(error));});return()=>{live=false;};},[]);
 const editRef=useRef<()=>void>();
 useEffect(()=>{const receive=(event:MessageEvent)=>{if(event.origin===location.origin&&event.source===frame.current?.contentWindow&&event.data?.type==='cairnmap-lab-ready'){setReady(true);if(entryRef.current)frame.current?.contentWindow?.postMessage({type:'cairnmap-lab-config',config:entryRef.current.config},location.origin);}else if(event.origin===location.origin&&event.source===frame.current?.contentWindow&&event.data?.type==='cairnmap-lab-edit')editRef.current?.();};window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive);},[]);
 useEffect(()=>{if(ready&&entry)frame.current?.contentWindow?.postMessage({type:'cairnmap-lab-config',config:entry.config},location.origin);},[ready,entry]);
 const importFile=async(file?:File)=>{if(!file)return;try{const imported=await readConfigPackageWithDiagnostics(file),report=validateConfigPackage(imported.config);if(!report.valid)throw Error('此配置尚不能运行，请先在工作台修复：'+report.issues.filter(issue=>issue.severity==='error').map(issue=>issue.message).join('；'));const id=crypto.randomUUID();setEntries(values=>[...values,{id,name:file.name,config:imported.config}]);setSelected(id);setMessage('已添加实验室版本；未改写正式配置或本机编辑缓存。');}catch(error){setMessage(String(error));}finally{if(input.current)input.current.value='';}};
 const edit=()=>{if(!entry)return;const id=crypto.randomUUID();sessionStorage.setItem('cairnmap-config-lab-handoff:'+id,JSON.stringify(entry.config));const url=new URL(location.href);url.searchParams.set('workspace','config-studio');url.searchParams.set('labHandoff',id);location.assign(url);};
 editRef.current=edit;
 const frameUrl=new URL(location.href);frameUrl.searchParams.set('workspace','config-lab-frame');frameUrl.searchParams.delete('labHandoff');
 return <div className="app-root h-screen w-screen"><iframe title="独立配置运行环境" ref={frame} src={frameUrl.toString()} className="h-full w-full border-0"/><header className="fixed bottom-12 left-1/2 z-[2700] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-xl border bg-white/95 p-3 shadow-lg"><strong className="text-sm">配置运行实验室</strong><HelpControl context="ConfigLab"><select aria-label="运行配置版本" className="max-w-sm rounded border p-2" value={selected} onChange={event=>setSelected(event.target.value)}>{entries.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></HelpControl><button disabled={!entry} className="rounded border px-3 py-2" onClick={edit}>编辑</button><button className="rounded border px-3 py-2" onClick={()=>input.current?.click()}>导入本地配置</button><button className="rounded border px-3 py-2" onClick={onClose}>关闭</button><input ref={input} hidden type="file" accept=".zip,.json" onChange={event=>void importFile(event.target.files?.[0])}/><p role="status" className="basis-full text-center text-xs text-slate-600">{message}</p></header></div>;
}
export default ConfigLab;
