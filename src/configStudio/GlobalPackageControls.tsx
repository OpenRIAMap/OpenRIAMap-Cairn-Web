import { checkPublicationWebDeployment, type PublicationWebState } from './publicationDeployment';
import {HelpLabel} from './SettingHelp';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ConfigDialog } from './ConfigDialog';
import type { ConfigPackageV3, MountedFeatureRecord } from './types';
import { validateConfigPackage } from './runtime';
import { buildConfigPackageArchive, buildTemporaryConfigArchive, downloadConfigPackage } from './package';
import {useWorkspaceState} from './ConfigBootstrap';
import {getWorkspaceState,recordWorkspaceValidation,flushWorkspace,invalidateWorkspaceValidation} from './workspaceController';
import {validateWorkspace,currentValidation,VALIDATION_SESSION} from './workspaceValidation';
import type {WorkspaceValidation} from './workspaceTypes';
import { highestConfigLabRevision } from './configLabStorage';
import { persistActiveConfig, readDurableActiveConfig, stableConfigText } from './defaultConfigProvider';
import { CONFIGURATION_RULES_VERSION, readFormalIdentity, sha256Bytes, type ConfigurationIdentity } from '../configRuntime/formalConfiguration';

type Gate = { snapshot: string; records: string; base: string; rules: string; run: WorkspaceValidation };
type ServerResult = { jobId?:string; state?:string; revision?:number; configSha256?:string; report?:{valid:boolean;issues:Array<{severity:string;message:string}>}; identity?:ConfigurationIdentity; upload?:{url:string;headers?:Record<string,string>}; receipt?:string; error?:string; message?:string; diagnosticId?:string; actor?:string; summary?:string[]; manifestSha256?:string; archiveSha256?:string };
async function command(operation: string, body: Record<string, unknown> = {}): Promise<ServerResult> {
  const response = await fetch('/api/config-publication', { method:'POST', credentials:'same-origin', headers:{'content-type':'application/json'}, body:JSON.stringify({operation,...body}) });
  const result = await response.json() as ServerResult;
  if (!response.ok || result.error&&!result.jobId) {
    const message=result.message ?? result.error ?? `发布请求失败（${response.status}）。`;
    throw Error(message+(result.diagnosticId?` 诊断编号：${result.diagnosticId}`:''));
  }
  return result;
}

export function GlobalPackageControls({ config, records = [], hasDraft, formalBlocked=false, onValidated, onSaved, onMessage }: { config:ConfigPackageV3; records?:MountedFeatureRecord[]; hasDraft:boolean; formalBlocked?:boolean; onValidated?:(run:WorkspaceValidation)=>void; onSaved:(value:ConfigPackageV3)=>void; onMessage:(value:string)=>void }) {
  const workspace=useWorkspaceState();
  const [temporaryOpen,setTemporaryOpen]=useState(false),[cacheFailure,setCacheFailure]=useState('');
  const [base,setBase] = useState<ConfigurationIdentity>();
  const [gate,setGate] = useState<Gate>();
  const [open,setOpen] = useState(false), [busy,setBusy] = useState(false), [message,setMessage] = useState('');
  const [server,setServer] = useState<ServerResult>(), [warningsAccepted,setWarningsAccepted] = useState(false);
  const [authenticated,setAuthenticated] = useState(false);
  const [serverRevision,setServerRevision]=useState(0);
  const [web,setWeb]=useState<PublicationWebState>();
  const [webChecking,setWebChecking]=useState(false);
  const [webCheck,setWebCheck]=useState(0);
  const operationId=useRef(crypto.randomUUID());
  const snapshot = useMemo(()=>stableConfigText(config),[config]);
  const recordText = useMemo(()=>stableConfigText(records),[records]);
  const candidate = useRef<{config:ConfigPackageV3;blob:Blob;snapshotHash:string;archiveHash:string;requestId:string;baseKey:string}>();
  const live = useRef({snapshot,recordText,hasDraft,base}); live.current={snapshot,recordText,hasDraft,base};
  const baseKey=base?stableConfigText(base):'';
  const checked = !!gate && !hasDraft && gate.snapshot===snapshot && gate.records===recordText && gate.rules===CONFIGURATION_RULES_VERSION && currentValidation(gate.run,workspace.generation);
  const valid = checked && !formalBlocked && gate.run.report.valid && !!base && gate.base===baseKey;
  const inform = (value:string)=>{setMessage(value);onMessage(value);};
  useEffect(()=>{let active=true;const check=()=>void readFormalIdentity().then(value=>{if(active)setBase(value);}).catch(error=>{if(active){setBase(undefined);setGate(undefined);inform(String(error));}});check();const timer=setInterval(check,60000);window.addEventListener('focus',check);return()=>{active=false;clearInterval(timer);window.removeEventListener('focus',check);};},[]);
  useEffect(()=>{setGate(current=>current&&!hasDraft&&current.snapshot===snapshot&&current.records===recordText&&current.run.generation===workspace.generation?current:undefined);},[snapshot,recordText,hasDraft,workspace.generation]);
  // A remote baseline change after activation must not erase the tracked task.
  useEffect(()=>{setServer(undefined);setWeb(undefined);setAuthenticated(false);candidate.current=undefined;setWarningsAccepted(false);setServerRevision(0);operationId.current=crypto.randomUUID();},[snapshot,recordText,hasDraft]);
  useEffect(()=>{
    if(server?.state!=='complete'||!server.identity){setWeb(undefined);setWebChecking(false);return;}
    const abort=new AbortController();setWebChecking(true);
    void checkPublicationWebDeployment(server.identity,abort.signal).then(result=>{if(!abort.signal.aborted)setWeb(result);}).finally(()=>{if(!abort.signal.aborted)setWebChecking(false);});
    return()=>abort.abort();
  },[server?.state,server?.identity,webCheck]);
  useEffect(()=>{
    const run=workspace.validation;if(!run||run.sessionId!==VALIDATION_SESSION||hasDraft||!currentValidation(run,workspace.generation))return;
    let live=true;
    void Promise.all([snapshot,recordText].map(text=>sha256Bytes(new TextEncoder().encode(text)))).then(([configHash,recordsHash])=>{
      if(live&&run.configFingerprint===configHash&&run.recordsFingerprint===recordsHash)setGate({snapshot,records:recordText,base:baseKey,rules:CONFIGURATION_RULES_VERSION,run});
    });return()=>{live=false;};
  },[workspace.validation,workspace.generation,snapshot,recordText,hasDraft]);
  useEffect(()=>{
    let live=true;void sha256Bytes(new TextEncoder().encode(recordText)).then(hash=>{const run=getWorkspaceState().validation;if(live&&run&&run.recordsFingerprint!==hash)invalidateWorkspaceValidation();});return()=>{live=false;};
  },[recordText]);
  const validate = async()=>{
    if(hasDraft){inform('请先保存或放弃所有区域、工作流和 Class 树草稿。');return;}
    setBusy(true);try{
      const run=await validateWorkspace(config,records,getWorkspaceState().generation);
      if(live.current.snapshot!==snapshot||live.current.hasDraft||live.current.recordText!==recordText)throw Error('核验期间内容已改变，请重新核验。');
      recordWorkspaceValidation(run);setGate({snapshot,records:recordText,base:baseKey,rules:CONFIGURATION_RULES_VERSION,run});onValidated?.(run);
      inform(run.report.valid?`全局核验通过：${run.report.issues.length} 项提示。`:`全局核验未通过：${run.report.issues.filter(item=>item.severity==='error').length} 项阻断。可以临时保存和下载以继续修复。`);
    }catch(error){setGate(undefined);inform(String(error));}finally{setBusy(false);}
  };
  const temporaryDownload=async(downloadOnly=false)=>{
    if(!checked||!gate)return;setBusy(true);setCacheFailure('');
    try{
      const blob=await buildTemporaryConfigArchive(config,gate.run,getWorkspaceState().generation);
      if(!downloadOnly)try{await flushWorkspace();}catch(error){setCacheFailure(String(error));return;}
      if(live.current.snapshot!==snapshot||live.current.hasDraft||live.current.recordText!==recordText||!currentValidation(gate.run,getWorkspaceState().generation))throw Error('内容已改变，请重新全局核验。');
      const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${config.packageId}.r${config.revision}.contract-r${config.contractRevision}.temporary.${Date.now()}.zip`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      setTemporaryOpen(false);inform('已发起临时诊断包下载；仅用于继续编辑与排查，不代表正式核验通过。');
    }catch(error){inform(String(error));}finally{setBusy(false);}
  };
  const prepare = async()=>{
    const assertCurrent=()=>{if(!valid||live.current.hasDraft||live.current.snapshot!==snapshot||live.current.recordText!==recordText||stableConfigText(live.current.base)!==baseKey)throw Error('全局核验已失效，请重新核验。');};
    assertCurrent();
    if(candidate.current&&candidate.current.baseKey!==baseKey)throw Error('正式基线已改变，请重新登录并准备新候选。');
    if(candidate.current)return candidate.current;
    const revision=Math.max(Math.max(config.revision,await highestConfigLabRevision(config.packageId),base?.revision??0)+1,serverRevision);
    const next={...config,revision},report=validateConfigPackage(next,records);
    if(!report.valid)throw Error('自动修订候选未通过核验。');
    const blob=await buildConfigPackageArchive(next,report);
    const value={config:next,blob,snapshotHash:await sha256Bytes(new TextEncoder().encode(stableConfigText(next))),archiveHash:await sha256Bytes(await blob.arrayBuffer()),requestId:operationId.current,baseKey};
    assertCurrent();
    candidate.current=value;return value;
  };
  const download = async()=>{
    setBusy(true);try{
      const operation=async()=>{
        const durable=await readDurableActiveConfig();
        if(stableConfigText(durable.config)!==snapshot)throw Error('本地已保存版本已改变，请刷新编辑器后重新核验。');
        // A candidate prepared for login may outlive another tab's export.
        // Reallocate under the cross-tab lock; never reuse an occupied revision.
        if(candidate.current&&await highestConfigLabRevision(config.packageId)>=candidate.current.config.revision){candidate.current=undefined;setAuthenticated(false);setServer(undefined);operationId.current=crypto.randomUUID();}
        const value=await prepare();const saved=await persistActiveConfig(value.config,false,durable);
        await flushWorkspace();
        downloadConfigPackage(value.blob,value.config);onSaved(saved);setOpen(false);inform(`已下载 ${value.config.packageId} r${value.config.revision}；正式配置保持当前发布版本。`);
      };
      if(navigator.locks)await navigator.locks.request(`cairnmap-config-export:${config.packageId}`,operation);else await operation();
    }catch(error){inform(String(error));}finally{setBusy(false);}
  };
  const login = async()=>{
    setBusy(true);try{
      // Open synchronously to retain browser popup permission.
      const popup=window.open('about:blank','cairnmap-configuration-auth','popup,width=620,height=760');if(!popup)throw Error('请允许身份确认弹窗。');
      if(candidate.current&&candidate.current.baseKey!==baseKey){candidate.current=undefined;setServer(undefined);operationId.current=crypto.randomUUID();}
      const value=await prepare(),nonce=crypto.randomUUID();
      const url=new URL('/api/auth/github/start',location.origin);for(const [key,item] of Object.entries({purpose:'configuration-publication',mode:'popup',nonce,snapshotSha256:value.snapshotHash,baseSha256:base!.configSha256,baseIdentitySha256:await sha256Bytes(new TextEncoder().encode(stableConfigText(base)))}))url.searchParams.set(key,item);
      popup.location.assign(url.toString());
      await new Promise<void>((resolve,reject)=>{
        const stop=()=>{window.removeEventListener('message',receive);clearInterval(timer);clearTimeout(timeout);};
        const receive=(event:MessageEvent)=>{if(event.origin!==location.origin||event.source!==popup||event.data?.type!=='cairn-configuration-auth-complete'||event.data?.nonce!==nonce)return;stop();event.data.status==='ok'?resolve():reject(Error('身份确认失败。'));};
        const timer=setInterval(()=>{if(popup.closed){stop();reject(Error('已取消身份确认，编辑内容保持。'));}},500);
        const timeout=setTimeout(()=>{stop();reject(Error('身份确认超时。'));},300000);window.addEventListener('message',receive);
      });setAuthenticated(true);inform('已重新确认身份；再次核验将由服务端实时检查维护者权限。');
    }catch(error){inform(String(error));}finally{setBusy(false);}
  };
  const preflight = async()=>{
    setBusy(true);try{
      const value=await prepare();
      const grant=await command('prepare',{requestId:value.requestId,snapshotSha256:value.snapshotHash,baseSha256:base!.configSha256,archiveSha256:value.archiveHash,byteLength:value.blob.size,proposedRevision:value.config.revision});
      if(grant.revision!==undefined&&grant.revision!==value.config.revision){setServerRevision(grant.revision);candidate.current=undefined;setAuthenticated(false);setServer(grant);throw Error('服务端已保留修订号 r'+grant.revision+'，请重新登录以确认更新后的候选版本。');}
      if(grant.upload){const response=await fetch(grant.upload.url,{method:'PUT',headers:grant.upload.headers,body:value.blob});if(!response.ok)throw Error('配置归档上传失败，可重试。');}
      const result=await command('preflight',{jobId:grant.jobId,requestId:value.requestId});setServer({...result,jobId:grant.jobId});
      if(result.revision!==undefined&&result.revision!==value.config.revision){candidate.current=undefined;setAuthenticated(false);throw Error('服务端已分配更新修订版，请重新取得候选并确认。');}
      inform(result.report?.valid?'服务端核验通过，请检查版本、摘要和提示后确认发布。':'服务端正在核验；可查询进度。');
    }catch(error){inform(String(error));}finally{setBusy(false);}
  };
  const publish = async()=>{setBusy(true);try{const result=await command('confirm',{jobId:server?.jobId,receipt:server?.receipt,requestId:candidate.current?.requestId,warningsAccepted});setServer(result);inform(`配置发布任务：${result.state??'queued'}。`);}catch(error){inform(String(error));}finally{setBusy(false);}};
  const refresh = async()=>{setBusy(true);try{const result=await command('status',{jobId:server?.jobId,requestId:candidate.current?.requestId});setServer(result);inform(`发布阶段：${result.state}${result.error?'；'+result.error:''}`);}catch(error){inform(String(error));}finally{setBusy(false);}};
  const warning=server?.report?.issues.some(issue=>issue.severity==='warning');
  return <><button type="button" className="rounded border px-3 py-1.5 text-sm disabled:opacity-40" disabled={busy||hasDraft} onClick={()=>void validate()}>全局核验</button><button type="button" className="rounded border border-violet-300 px-3 py-1.5 text-sm disabled:opacity-40" disabled={!checked||busy} onClick={()=>{setCacheFailure('');setTemporaryOpen(true);}}>临时保存和下载</button><button type="button" className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white disabled:bg-slate-300" disabled={!valid||busy} onClick={()=>setOpen(true)}>整包下载/上传</button>
    <ConfigDialog open={temporaryOpen} title="临时保存和下载" onClose={()=>setTemporaryOpen(false)} busy={busy}>
      <p>{config.packageId} · 配置 r{config.revision} · 契约 r{config.contractRevision}</p>
      <p>错误 {gate?.run.report.issues.filter(item=>item.severity==='error').length??0} 项，警告 {gate?.run.report.issues.filter(item=>item.severity==='warning').length??0} 项。</p>
      <p className="text-sm">此文件保留配置和本次诊断报告，仅用于继续编辑或排查。临时下载不代表正式核验通过，不会上传或发布。</p>
      {!checked?<p role="alert" className="text-rose-700">内容已改变，请关闭并重新全局核验。</p>:null}
      <button type="button" className="rounded bg-violet-600 px-3 py-2 text-white disabled:bg-slate-300" disabled={!checked||busy} onClick={()=>void temporaryDownload()}>确认临时保存并下载</button>
      {cacheFailure?<div role="alert" className="text-rose-700">本地缓存失败：{cacheFailure}<button type="button" className="ml-2 rounded border px-3 py-2" disabled={!checked||busy} onClick={()=>void temporaryDownload(true)}>仅下载副本</button></div>:null}
    </ConfigDialog>
    <ConfigDialog open={open} title="整包下载/上传" onClose={()=>setOpen(false)} busy={busy}>
      <p className="text-sm">正式基线：{base?.packageId} r{base?.revision} · 契约 r{base?.contractRevision}</p><p className="break-all text-xs">SHA-256：{base?.configSha256}</p>
      <p className="text-sm">下载将自动分配高于已保存、已导出及已知正式版本的修订号。在线发布由服务端最终分配。</p>
      {!valid?<p role="alert" className="text-rose-700">全局核验已失效，请关闭并重新核验。</p>:null}
      <div className="flex flex-wrap gap-2"><button type="button" className="rounded border px-3 py-2" disabled={busy||!valid} onClick={()=>void download()}>下载配置整包</button><button type="button" className="rounded bg-violet-600 px-3 py-2 text-white" disabled={busy||!valid} onClick={()=>void login()}>重新登录并准备上传</button>{authenticated?<button type="button" className="rounded border px-3 py-2" disabled={busy||!valid} onClick={()=>void preflight()}>再次核验</button>:null}</div>
      {server?<section className="space-y-2 rounded border bg-slate-50 p-3"><p>操作者：{server.actor??'等待服务端确认'} · 服务端阶段：{server.state}</p><p>候选：r{server.revision} · {server.jobId}</p><p className="break-all text-xs">JSON SHA-256: {server.configSha256}</p><p className="break-all text-xs">Manifest SHA-256: {server.manifestSha256}</p><p className="break-all text-xs">ZIP SHA-256: {server.archiveSha256}</p>{server.summary?.map((item,index)=><p key={index} className="text-xs">{item}</p>)}{server.report?.issues.map((issue,index)=><p key={index} className={issue.severity==='error'?'text-rose-700':'text-amber-800'}>{issue.message}</p>)}{warning?<HelpLabel context="GlobalPackageControls" className="flex gap-2"><input type="checkbox" checked={warningsAccepted} onChange={event=>setWarningsAccepted(event.target.checked)}/>已检查以上警告</HelpLabel>:null}<button type="button" className="rounded border px-3 py-2" disabled={busy} onClick={()=>void refresh()}>查询进度</button><button type="button" className="ml-2 rounded bg-emerald-600 px-3 py-2 text-white disabled:bg-slate-300" disabled={busy||!valid||!authenticated||server.report?.valid!==true||!server.receipt||warning&&!warningsAccepted} onClick={()=>void publish()}>上传并发布</button></section>:null}
      {server?.state==='complete'?<section className="space-y-2 rounded border bg-slate-50 p-3 text-sm" role="status"><p>{webChecking?'正在确认最终 Web 部署…':web?.message??'服务端发布完成，等待确认最终 Web 部署。'}</p><button type="button" className="rounded border px-3 py-2" disabled={webChecking} onClick={()=>setWebCheck(value=>value+1)}>检查最终 Web 部署</button></section>:null}
      <p role="status" className="text-sm">{message}</p>
    </ConfigDialog>
  </>;
}
