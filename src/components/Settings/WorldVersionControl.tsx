import { useEffect,useState } from 'react';
import AppButton from '@/components/ui/AppButton';
import { ConfigDialog } from '@/configStudio/ConfigDialog';
import { requestReviewConfirmation } from '@/components/Review/ReviewConfirmationHost';
import { requireBusinessConfiguration } from '@/configRuntime/businessConfiguration';
import { reviewEndpoint } from '@/core/project/applicationRuntime';
import { getRuleDataSourceSnapshot } from '@/components/Rules/data/formalDataSourceRuntime';
import type { FormalReleaseSet } from '@/components/Rules/data/formalReleaseReader';

type Plan = {operationId:string;planSha256:string;plan:{action:string;reason:string;worldId:string|null;targetVersion:number|null;expiresAt:number;before:{worldVersion:number;dataReleaseId:string;contentSha256:string}|null};publicationVersion:number};
type Progress = {operationId:string;state:string;error?:string};
const errors:Record<string,string>={
  'world-version-target-occupied':'目标编号已被本世界占用，不能覆盖。',
  'world-version-precheck-stale':'预检已过期或正式状态已变化，请重新预检。',
  'world-version-operation-pending':'另一个世界版本任务尚未完成，请先完成或恢复原任务。',
  'world-version-review-release-pending':'当前仍有审核发布任务未完成，请先处理原任务。',
  'world-version-management-disabled':'服务端尚未启用世界版本管理，请先完成配套部署。',
  'world-version-target-invalid':'目标版本必须是合法的正整数。',
  'world-version-operation-running':'任务仍在执行；进程中断后，请等待执行租约结束再恢复。',
  'role-not-authorized':'当前账号没有维护者权限。',
};
const stages:Record<string,string>={prepared:'已预检',authorizing:'正在记录授权',queued:'已排队',committing:'正在提交编号',committed:'编号已生效，正在补齐登记','mirror-pending':'等待镜像完成',completed:'已完成','recovery-required':'需要恢复原任务',failed:'未生效，请重新预检'};
export async function worldVersionCommand<T>(request:Record<string,unknown>):Promise<T>{
  const response=await fetch(reviewEndpoint('control'),{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({operation:'world-version',request})});
  const value=await response.json();
  if(!response.ok)throw Error(errors[value?.error]??value?.error??`世界版本管理请求失败（HTTP ${response.status}）。`);
  return value as T;
}

/** No service requests on mount. Only the maintainer's explicit action opens this flow. */
export function WorldVersionControl({worldId,name,canManage,onChanged}:{worldId:string;name:string;canManage:boolean;onChanged:()=>Promise<void>}){
  const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
  const [state,setState]=useState<{initialized:boolean;current:FormalReleaseSet;active:{operationId:string;state:string}|null}|null>(null);
  const [target,setTarget]=useState('1'),[reason,setReason]=useState(''),[plan,setPlan]=useState<Plan|null>(null),[progress,setProgress]=useState<Progress|null>(null);
  useEffect(()=>{if(!plan)return;const timer=setTimeout(()=>{setPlan(null);setMessage('预检已过期，请重新预检。');},Math.max(0,plan.plan.expiresAt-Date.now()));return()=>clearTimeout(timer);},[plan]);
  const run=async(action:()=>Promise<void>)=>{setBusy(true);setMessage('');try{await action();}catch(error){setMessage(error instanceof Error?error.message:String(error));}finally{setBusy(false);}};
  const remoteWorld=getRuleDataSourceSnapshot(worldId).remoteWorldId??worldId;
  const binding=state?.current.worldBindings?.find(b=>b.worldId===remoteWorld);
  const show=()=>void run(async()=>{
    await requireBusinessConfiguration();
    setPlan(null);setProgress(null);setTarget('1');setReason('');
    const value=await worldVersionCommand<NonNullable<typeof state>>({action:'inspect'});
    setState(value);setOpen(true);
  });
  const precheck=()=>void run(async()=>{
    const number=Number(target);
    if(state?.initialized&&(!Number.isSafeInteger(number)||number<1))throw Error(errors['world-version-target-invalid']);
    setPlan(await worldVersionCommand<Plan>({action:'precheck',request:{action:state?.initialized?'reassign':'initialize',worldId:remoteWorld,targetVersion:number,reason,readerProtocol:'openriamap.formal-release-reader.v3'}}));
  });
  const confirm=()=>void run(async()=>{
    if(!plan)return;
    const accepted=await requestReviewConfirmation({title:plan.plan.action==='initialize'?'确认初始化世界版本':'确认调拨世界版本',message:plan.plan.action==='initialize'
      ?`将为当前已发布的 ${state?.current.worlds.join('、')} 建立独立版本基线，并启用新读取协议。各世界暂保留当前编号 ${plan.publicationVersion}。`
      :`${name}（${remoteWorld}）：${plan.plan.before?.worldVersion} → ${plan.plan.targetVersion}。原编号将注销，历史审计保留；当前数据和图片不变。全局发布批次及其他世界编号不变。`,confirmLabel:'确认执行',cancelLabel:'取消',tone:'orange'});
    if(!accepted)return;
    await requireBusinessConfiguration();
    setProgress(await worldVersionCommand<Progress>({action:'confirm',request:{operationId:plan.operationId,planSha256:plan.planSha256}}));
  });
  const query=(recover=false)=>void run(async()=>{
    const operationId=progress?.operationId??state?.active?.operationId;
    if(!operationId)return;
    const result=await worldVersionCommand<Progress>({action:recover?'recover':'progress',operationId});setProgress(result);
    if(result.state==='completed'){
      setPlan(null);setState(await worldVersionCommand<NonNullable<typeof state>>({action:'inspect'}));
      await onChanged();setMessage('任务已完成，已同步编号并保留审计。');
    }
  });
  if(!canManage)return null;
  return <div className="mt-2 space-y-2">
    <AppButton type="button" onClick={show} disabled={busy} className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 disabled:opacity-50">调拨当前版本</AppButton>
    {!open&&message?<p role="alert" className="text-red-600">{message}</p>:null}
    <ConfigDialog open={open} title="世界版本管理" busy={busy} onClose={()=>setOpen(false)}>
      <div className="space-y-1 rounded border bg-slate-50 p-3 text-sm"><p>世界：{name}（{remoteWorld}）</p><p>权威来源：{binding?.authorityGroupId??'服务端正式数据来源'}</p><p>发布批次：{state?.current.publicationVersion??state?.current.formalVersion??'—'}</p><p>当前世界版本：{binding?.worldVersion??state?.current.formalVersion??'—'}</p><p className="break-all">技术数据 ID：{binding?.dataReleaseId??state?.current.releaseId}</p></div>
      {!progress&&(!state?.active||state.active.state!=='active')?<>
        {!state?.initialized?<p className="text-sm text-amber-800">当前使用旧发布协议。首次操作会初始化全部已发布世界的独立版本管理，保留现有编号；完成后再分别调拨。旧版页面需要刷新应用。</p>:<label className="block text-sm">目标世界版本<input aria-label="目标世界版本" type="number" min="1" step="1" className="mt-1 w-full rounded border px-3 py-2" value={target} disabled={busy} onChange={event=>{setTarget(event.target.value);setPlan(null);}}/></label>}
        <label className="block text-sm">调整原因<textarea aria-label="调整原因" className="mt-1 w-full rounded border px-3 py-2" maxLength={1000} value={reason} disabled={busy} onChange={event=>{setReason(event.target.value);setPlan(null);}}/></label>
        <p className="text-xs text-gray-600">{state?.initialized?'原编号将注销，历史审计保留。此操作只调整当前快照的编号。':'初始化保留现有发布批次、当前编号和数据，建立各世界独立账本。'}</p>
        {plan?<div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm">{plan.plan.action==='initialize'?`初始化基线：当前已发布世界暂保留 ${plan.publicationVersion}。`:`预检：${plan.plan.before?.worldVersion} → ${plan.plan.targetVersion}；数据摘要不变。`}<p>预检有效至：{new Date(plan.plan.expiresAt).toLocaleTimeString('zh-CN')}</p></div>:null}
        <div className="flex gap-2"><AppButton disabled={busy||!reason.trim()} onClick={precheck} className="rounded bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50">预检</AppButton><AppButton disabled={busy||!plan||plan.plan.expiresAt<=Date.now()} onClick={confirm} className="rounded bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-50">确认执行</AppButton></div>
      </>:null}
      {progress||state?.active?.state==='active'?<div className="space-y-2 rounded border p-3 text-sm">
        <p className="break-all">任务：{progress?.operationId??state?.active?.operationId}</p><p>状态：{progress?.state?(stages[progress.state]??progress.state):'处理中'}</p>
        {progress?.error?<p role="alert" className="text-red-600">{errors[progress.error]??progress.error}</p>:null}
        {(progress?.operationId??state?.active?.operationId)?.startsWith('world-version-')?<div className="flex gap-2">
          <AppButton onClick={()=>query()} disabled={busy} className="rounded border px-3 py-2">查询进度</AppButton>
          {progress?.state==='failed'?<AppButton disabled={busy} onClick={()=>{setProgress(null);setPlan(null);void run(async()=>setState(await worldVersionCommand<NonNullable<typeof state>>({action:'inspect'})));}} className="rounded border px-3 py-2">重新预检</AppButton>:progress?.state!=='completed'?<AppButton onClick={()=>query(true)} disabled={busy} className="rounded border px-3 py-2">恢复当前任务</AppButton>:null}
        </div>:<p>这是审核数据发布任务，请在审核模块查询或恢复该任务。</p>}
      </div>:null}
      {message?<p role="status" className="text-sm text-amber-800">{message}</p>:null}
    </ConfigDialog>
  </div>;
}
