import {useRef,useState} from 'react';
import {GlobalPackageControls} from './GlobalPackageControls';
import {getActiveConfigSnapshot,getStudioSessionSnapshot,persistActiveConfig,restoreApplicationDefault,persistStudioEditingSession} from './defaultConfigProvider';
import {useWorkspaceNavigation,useWorkspaceState} from './ConfigBootstrap';
import {flushWorkspace,setImportedDiagnostic} from './workspaceController';
import {readConfigPackageWithDiagnostics} from './package';
import {validateConfigPackage} from './runtime';
import MapContainer from '@/components/Map/MapContainer';

export function ConfigLab({onClose}:{onClose:()=>void}){
  const [config,setConfig]=useState(getActiveConfigSnapshot),[busy,setBusy]=useState(false),[message,setMessage]=useState('运行已选择的本机配置；正式主地图保持正式版本。');
  const workspace=useWorkspaceState(),navigate=useWorkspaceNavigation(),input=useRef<HTMLInputElement>(null);
  const openEditor=()=>navigate(()=>{const url=new URL(location.href);url.searchParams.set('workspace','config-studio');location.assign(url);});
  const restore=async()=>{setBusy(true);try{await restoreApplicationDefault();location.reload();}catch(error){setMessage(String(error));}finally{setBusy(false);}};
  const importFile=async(file?:File)=>{if(!file)return;setBusy(true);try{
    const imported=await readConfigPackageWithDiagnostics(file);
    if(imported.recheckReason&&!window.confirm(imported.recheckReason+' 确认后重新核验，并在工作台检查。'))return;
    const report=validateConfigPackage(imported.config);setImportedDiagnostic(imported.diagnostic);
    if(!report.valid||imported.recheckReason){await persistStudioEditingSession({baseline:config,draft:null,tree:null,selectedId:'',editing:false,packageCandidate:{baseline:config,config:imported.config,source:'import'},activeTab:'features'});await flushWorkspace();setMessage('导入稿需要在工作台核验和修复，未启用到运行实验室。');}
    else setConfig(await persistActiveConfig(imported.config));
  }catch(error){setMessage(String(error));}finally{setBusy(false);if(input.current)input.current.value='';}};
  if(workspace.hasDraft||getStudioSessionSnapshot()?.packageCandidate)return <div className="flex h-screen items-center justify-center bg-slate-100"><div className="space-y-3 rounded border bg-white p-5"><p>当前工作区仍有未完成草稿或隔离候选，不能在运行实验室启用。</p><button className="rounded border p-2" onClick={openEditor}>打开工作台继续编辑</button><button className="ml-2 rounded border p-2" onClick={onClose}>返回主地图</button></div></div>;
  return <div {...(busy?{inert:''}:{})} aria-busy={busy} className="app-root h-screen w-screen"><MapContainer configRuntime={config} configLab/><header className="fixed bottom-12 left-1/2 z-[2700] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-xl border bg-white/95 p-3 shadow-lg">
    <strong className="text-sm">配置运行实验室 · 本机 r{config.revision}／契约 r{config.contractRevision}</strong><button className="rounded border px-3 py-2" onClick={openEditor}>编辑</button>
    <button className="rounded border px-3 py-2" onClick={()=>void persistActiveConfig(config).then(setConfig).catch(error=>setMessage(String(error)))}>保存本地</button>
    <button className="rounded border px-3 py-2" disabled={workspace.hasDraft} onClick={()=>void restore()}>恢复当前正式配置</button>
    <button className="rounded border px-3 py-2" onClick={()=>input.current?.click()}>导入本地配置</button><GlobalPackageControls config={config} hasDraft={busy} onSaved={setConfig} onMessage={setMessage}/>
    <button className="rounded border px-3 py-2" onClick={onClose} aria-label="返回主地图">关闭</button><input ref={input} className="hidden" type="file" accept=".zip,.json" onChange={event=>void importFile(event.target.files?.[0])}/><p role="status" className="basis-full text-center text-xs text-slate-600">{message}</p>
  </header></div>;
}
export default ConfigLab;
