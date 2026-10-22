import { Component, createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { ConfigDialog } from './ConfigDialog';
import { readFormalIdentity, type ConfigurationIdentity } from '../configRuntime/formalConfiguration';
import { initializeWorkspace, startDefaultWorkspace, resumeWorkspace, flushWorkspace, clearWorkspace, getWorkspaceState, subscribeWorkspace, needsWorkspaceExitPrompt, permitWorkspaceUnload,reopenWorkspaceAdmission } from './workspaceController';
import { currentValidation } from './workspaceValidation';
import type { WorkspaceCheckpoint } from './workspaceTypes';

const Navigation=createContext<(action:()=>void)=>void>(action=>action());
export const useWorkspaceNavigation=()=>useContext(Navigation);
export const useWorkspaceState=()=>useSyncExternalStore(subscribeWorkspace,getWorkspaceState);
const metadataText=(value:unknown,fallback='未知')=>typeof value==='string'||typeof value==='number'?String(value):fallback;

class WorkspaceBoundary extends Component<{children:ReactNode;onReset:()=>void},{error:string}>{
  state={error:''};static getDerivedStateFromError(error:Error){return {error:error.message};}
  render(){return this.state.error?<div role="alert" className="m-6 rounded border bg-white p-5">编辑工作区无法安全显示：{this.state.error}。本地检查点未被清除。<button className="ml-3 rounded border p-2" onClick={this.props.onReset}>恢复当前正式配置</button></div>:this.props.children;}
}
export function ConfigBootstrap({children,onClose}:{children:ReactNode;onClose:()=>void}){
  const [ready,setReady]=useState(false),[pending,setPending]=useState<WorkspaceCheckpoint>(),[error,setError]=useState(''),[busy,setBusy]=useState(false),[formal,setFormal]=useState<ConfigurationIdentity>();
  const [leaving,setLeaving]=useState(false),after=useRef<()=>void>(()=>undefined),workspace=useWorkspaceState();
  useEffect(()=>{let live=true;void initializeWorkspace().then(async stored=>{if(!live)return;if(stored.checkpoint){setPending(stored.checkpoint);void readFormalIdentity().then(value=>{if(live)setFormal(value);}).catch(()=>undefined);}else {await startDefaultWorkspace();if(live)setReady(true);}}).catch(reason=>{if(live)setError(String(reason));});return()=>{live=false;};},[]);
  useEffect(()=>{
    const hide=()=>{if(document.visibilityState==='hidden')void flushWorkspace().catch(()=>undefined);};
    const pagehide=()=>{void flushWorkspace().catch(()=>undefined);};
    window.addEventListener('pagehide',pagehide);document.addEventListener('visibilitychange',hide);
    return()=>{window.removeEventListener('pagehide',pagehide);document.removeEventListener('visibilitychange',hide);};
  },[]);
  const needsLeaveWarning=needsWorkspaceExitPrompt();
  useEffect(()=>{
    if(!needsLeaveWarning)return;
    const warn=(event:BeforeUnloadEvent)=>{if(needsWorkspaceExitPrompt()){event.preventDefault();event.returnValue='';}};
    window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);
  },[needsLeaveWarning]);
  useEffect(()=>{
    const show=(event:PageTransitionEvent)=>{if(!event.persisted)return;setReady(false);setPending(undefined);setError('');void reopenWorkspaceAdmission().then(async saved=>{if(saved.checkpoint)setPending(saved.checkpoint);else {await startDefaultWorkspace();setReady(true);}}).catch(reason=>setError(String(reason)));};
    window.addEventListener('pageshow',show);return()=>window.removeEventListener('pageshow',show);
  },[]);
  const choose=async(resume:boolean)=>{setBusy(true);setError('');try{if(resume&&pending)await resumeWorkspace(pending);else await startDefaultWorkspace();setPending(undefined);setReady(true);}catch(reason){setError(String(reason));}finally{setBusy(false);}};
  const finish=async(keep:boolean)=>{setBusy(true);setError('');try{if(keep)await flushWorkspace();else await clearWorkspace();setLeaving(false);permitWorkspaceUnload();after.current();}catch(reason){setError(String(reason));}finally{setBusy(false);}};
  const navigate=(action:()=>void)=>{after.current=action;if(needsWorkspaceExitPrompt())setLeaving(true);else void finish(true);};
  const status=currentValidation(pending?.validation,pending?.generation??-1)?pending?.validation?.report.valid?'已核验，尚未发布':'全局核验未通过':pending?.validation?'核验已失效':'尚未核验／有未保存内容';
  if(!ready)return <div className="flex h-screen items-center justify-center bg-slate-100">
    {pending?<ConfigDialog open title="检测到本机编辑缓存" onClose={onClose} busy={busy}>
      <p>本机：{metadataText(pending.config?.packageId,'未知配置')} · 配置 r{metadataText(pending.config?.revision,'?')} · 契约 r{metadataText(pending.config?.contractRevision,'?')}</p>
      <p>最后缓存：{metadataText(pending.updatedAt)} · {status}</p><p>当前 Web 正式配置：{formal?`配置 r${formal.revision} · 契约 r${formal.contractRevision}`:'暂未取得，可继续恢复本机稿。'}</p>
      <p className="text-sm text-slate-600">选择前不会启用或改写缓存。恢复默认将清除这一工作区，并读取当前正式配置。</p>
      <div className="flex flex-wrap gap-2"><button disabled={busy} className="rounded bg-violet-600 px-3 py-2 text-white" onClick={()=>void choose(true)}>继续编辑</button><button disabled={busy} className="rounded border px-3 py-2" onClick={()=>void choose(false)}>恢复默认</button></div>{error?<p role="alert" className="break-words text-rose-700">{error}</p>:null}
    </ConfigDialog>:<div role="status" className="rounded border bg-white p-5">{error||'正在加载当前正式配置…'}{error?<button className="ml-3 rounded border px-3 py-2" onClick={()=>location.reload()}>重新加载</button>:null}</div>}
  </div>;
  return <Navigation.Provider value={navigate}>{error&&!leaving?<div role="alert" className="fixed left-2 top-2 z-[5100] rounded border bg-white p-3 text-rose-800">{error}</div>:null}<WorkspaceBoundary onReset={()=>void startDefaultWorkspace().then(()=>location.reload()).catch(reason=>setError(String(reason)))}>{children}</WorkspaceBoundary>
    {workspace.writeError?<div role="alert" className="fixed bottom-2 left-2 z-[5100] max-w-lg rounded border border-rose-300 bg-white p-3 text-sm text-rose-800">本地缓存失败：{workspace.writeError}<button className="ml-2 rounded border p-1" onClick={()=>void flushWorkspace().catch(()=>undefined)}>重试缓存</button></div>:null}
    <ConfigDialog open={leaving} title="退出配置编辑" onClose={()=>setLeaving(false)} busy={busy}><p>{workspace.validation&&currentValidation(workspace.validation,workspace.generation)?'当前全局核验未通过。':'当前编辑内容尚未完成有效的全局核验，或仍有未保存区域。'}是否缓存到本地？</p><p className="text-sm">确认后保留当前工作区；取消缓存将清除本机工作区，下次从当前正式配置开始。</p><div className="flex flex-wrap gap-2"><button disabled={busy} className="rounded bg-violet-600 px-3 py-2 text-white" onClick={()=>void finish(true)}>确认，缓存并退出</button><button disabled={busy} className="rounded border px-3 py-2" onClick={()=>void finish(false)}>取消缓存，清除并退出</button></div>{error?<p role="alert" className="text-rose-700">{error}</p>:null}</ConfigDialog>
  </Navigation.Provider>;
}
