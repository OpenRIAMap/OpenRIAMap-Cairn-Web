import {useEffect,useRef,useState} from 'react';
import {LogIn,X} from 'lucide-react';
import AppCard from '@/components/ui/AppCard';
import AppButton from '@/components/ui/AppButton';
import {parseAuditExpression,COUNT_KEYS,priceMicros,formatMicros} from '@/core/audit/contributionContract.mjs';
import {requestRiaContributionAudit,type AuditOperation,type AuditQueryResult,type AuditSummary} from './riaReviewSubmissionAdapter';
import {useReleaseAuditAccess} from './releaseAuditAccess';
import {openriamapGithubReviewAuth} from './openriamapReviewAuth';

const labels=['新增要素','非必填字段新增','必填字段编辑','非必填字段编辑'];
const input='rounded border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900';
const numeric=['featuresCreated','optionalAdded','requiredEdited','optionalEdited','operations','deleted','unclassified','backfilled','geometryChanged','geometryAddedEstimate','geometryRemovedEstimate'] as const;
function mergeSummaries(summaries:AuditSummary[],features:number):AuditSummary{
  const combine=(rows:AuditSummary['total'][])=>{
    const base=Object.fromEntries(numeric.map(key=>[key,rows.reduce((n,row)=>n+Number(row[key]??0),0)]));
    return {...base,amount:formatMicros(rows.reduce((n,row)=>{const [whole,fraction='']=row.amount.split('.');return n+BigInt(whole)*1000000n+BigInt(fraction.padEnd(6,'0'));},0n))} as AuditSummary['total'];
  };
  const actors=[...new Set(summaries.flatMap(s=>s.actors.map(row=>row.actor)))].map(actor=>({actor,...combine(summaries.flatMap(s=>s.actors.filter(row=>row.actor===actor)))}));
  return {total:combine(summaries.map(s=>s.total)),actors,features};
}
export default function ContributionAuditPanel({onClose,showNativeClose=false}:{onClose:()=>void;showNativeClose?:boolean}){
  const {authorized,refresh}=useReleaseAuditAccess();
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const [dateFrom,setFrom]=useState(today.slice(0,8)+'01'),[dateTo,setTo]=useState(today),[expression,setExpression]=useState(''),[field,setField]=useState('CreateBy'),[operator,setOperator]=useState('='),[value,setValue]=useState('');
  const [prices,setPrices]=useState<Record<string,string>>({}),[includeSystem,setSystem]=useState(false),[includeClassification,setClassification]=useState(false);
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[summary,setSummary]=useState<AuditSummary|null>(null),[rows,setRows]=useState<AuditOperation[]>([]),[status,setStatus]=useState(''),[coverage,setCoverage]=useState<AuditQueryResult['coverage']|null>(null),[detail,setDetail]=useState<AuditOperation|null>(null);
  const generation=useRef(0),abort=useRef<AbortController|null>(null);
  const invalidate=()=>{generation.current++;abort.current?.abort();setBusy(false);setSummary(null);setRows([]);setStatus('');setCoverage(null);setDetail(null);setError('');};
  useEffect(()=>{if(authorized!==true)invalidate();return()=>{generation.current++;abort.current?.abort();};},[authorized]);
  const changed=(apply:()=>void)=>{invalidate();apply();};
  async function calculate(){
    if(!await refresh())return;
    const token=++generation.current;abort.current?.abort();const controller=new AbortController();abort.current=controller;
    setError('');setBusy(true);setSummary(null);setRows([]);setDetail(null);
    try{
      parseAuditExpression(expression);Object.values(prices).forEach(priceMicros);
      const summaries:AuditSummary[]=[],seen=new Set<string>(),preview:AuditOperation[]=[];let cursor:string|null=null,result:AuditQueryResult;
      do{
        result=await requestRiaContributionAudit('query',{dateFrom,dateTo,expression,prices,includeSystem,includeClassification,...(cursor?{cursor}:{})},controller.signal);
        if(token!==generation.current)return;
        if(result.summary)summaries.push(result.summary);
        for(const row of result.items){seen.add(row.worldId+':'+row.featureId);if(preview.length<200)preview.push(row);}
        setSummary(mergeSummaries(summaries,seen.size));setRows([...preview]);setCoverage(result.coverage);cursor=result.nextCursor;
        setStatus(cursor?'正在读取后续日志，当前为部分结果…':result.complete?'范围读取完成':'范围读取结束，结果包含覆盖限制，请核对下方说明。');
      }while(cursor);
    }catch(e){if(token===generation.current){setError((e as Error).message);setStatus('查询未完成，当前结果不可作为完整总额。');void refresh();}}
    finally{if(token===generation.current)setBusy(false);}
  }
  return <AppCard data-draggable-proxy-close="true" className="cm-audit-panel flex max-h-[76vh] w-[min(94vw,760px)] flex-col overflow-hidden border border-slate-200 bg-white text-slate-900 shadow-xl">
    <button type="button" data-draggable-close className="sr-only" aria-label="关闭" onClick={onClose}/>
    <div className="shrink-0 border-b border-slate-200 bg-slate-50 px-5 py-4 pr-24"><h2 data-draggable-title className="text-xl font-bold">审计</h2><p className="mt-1 text-xs text-slate-500">按 CreateTime／ModifityTime 查询行为日期；价格仅用于本次估算。</p>{showNativeClose?<AppButton onClick={onClose} title="关闭审计" className="absolute right-4 top-4 p-2"><X className="h-5 w-5"/></AppButton>:null}</div>
    <div className="min-h-0 overflow-auto p-5">
      {authorized===null?<p>正在核验登录状态…</p>:authorized===false?<div className="rounded border border-amber-200 bg-amber-50 p-4"><p>审计需要登录并具备 Contributor 或更高权限。</p><AppButton className="mt-2 inline-flex items-center gap-2 underline" onClick={()=>void openriamapGithubReviewAuth.beginLogin().catch(e=>setError(e.message))}><LogIn className="h-4 w-4"/>登录</AppButton></div>:<>
        <div className="grid grid-cols-2 gap-3"><label className="text-sm">行为日期起<input aria-label="行为日期起" type="date" value={dateFrom} className={input+' mt-1 w-full'} onChange={e=>changed(()=>setFrom(e.target.value))}/></label><label className="text-sm">行为日期止<input aria-label="行为日期止" type="date" value={dateTo} className={input+' mt-1 w-full'} onChange={e=>changed(()=>setTo(e.target.value))}/></label></div>
        <fieldset className="mt-4 rounded border border-slate-200 p-3"><legend className="px-1 text-sm font-semibold">范围条件</legend>
          <div className="flex flex-wrap gap-2"><select aria-label="条件字段" value={field} onChange={e=>setField(e.target.value)} className={input}>{['CreateBy','ModifityBy','tags.dataset','World','Class','Kind','before.tags.dataset','after.tags.dataset'].map(key=><option key={key}>{key}</option>)}</select><select aria-label="条件运算符" value={operator} onChange={e=>setOperator(e.target.value)} className={input}>{['=','!=','IS NULL','IS NOT NULL'].map(op=><option key={op}>{op}</option>)}</select>{!operator.startsWith('IS')?<input className={input+' min-w-0 flex-1'} aria-label="条件值" value={value} onChange={e=>setValue(e.target.value)}/>:null}{['AND','OR'].map(join=><AppButton key={join} className="rounded border px-2 py-1 text-xs" onClick={()=>changed(()=>setExpression(previous=>(previous?'('+previous+') '+join+' ':'')+field+' '+operator+(operator.startsWith('IS')?'':" '"+value.replace(/'/g,"''")+"'")))}>添加 {join}</AppButton>)}</div>
          <textarea aria-label="审计条件表达式" value={expression} onChange={e=>changed(()=>setExpression(e.target.value))} placeholder="(CreateBy = '114' OR ModifityBy = '114') AND tags.dataset = 'ZInd1'" className={input+' mt-2 min-h-20 w-full font-mono'}/>
        </fieldset>
        <fieldset className="mt-4 grid grid-cols-2 gap-3 rounded border border-slate-200 p-3"><legend className="px-1 text-sm font-semibold">计算参与值</legend>{COUNT_KEYS.map((key,i)=><label key={key} className="text-sm">{labels[i]}价格<input aria-label={labels[i]+'价格'} value={prices[key]??''} inputMode="decimal" placeholder="未设置，按 0" className={input+' mt-1 w-full'} onChange={e=>changed(()=>setPrices(old=>({...old,[key]:e.target.value})))}/></label>)}<label className="col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={includeSystem} onChange={e=>changed(()=>setSystem(e.target.checked))}/>系统字段参与计算</label><label className="col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={includeClassification} onChange={e=>changed(()=>setClassification(e.target.checked))}/>分类字段参与计算</label></fieldset>
        <div className="mt-4 flex gap-2"><AppButton className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50" disabled={busy||!dateFrom||!dateTo} onClick={()=>void calculate()}>{busy?'正在计算…':'计算'}</AppButton>{busy?<AppButton className="rounded border px-4" onClick={invalidate}>取消查询</AppButton>:null}</div>
        {status?<p role="status" className="mt-3 text-sm">{status}</p>:null}
        {summary?<section className="mt-4 rounded border border-slate-200 p-3"><h3 className="font-bold">计算结果：{summary.total.amount}</h3><div className="mt-2 grid grid-cols-2 gap-2 text-sm">{COUNT_KEYS.map((key,i)=><div key={key}>{labels[i]}：{summary.total[key as keyof typeof summary.total]} × {prices[key]||'0'} = {formatMicros(BigInt(Number(summary.total[key]??0))*priceMicros(prices[key]))}</div>)}</div><p className="mt-2 text-xs">匹配要素 {summary.features} · 行为 {summary.total.operations} · 删除 {summary.total.deleted} · 历史补录 {summary.total.backfilled} · 未归类字段 {summary.total.unclassified}</p><p className="mt-1 text-xs">几何变化行为 {summary.total.geometryChanged} · 控制点新增估算 {summary.total.geometryAddedEstimate}／删除估算 {summary.total.geometryRemovedEstimate}，不参与四项计价。</p><div className="mt-2 overflow-auto"><table className="w-full text-left text-sm"><thead><tr><th>责任人</th>{labels.map(x=><th key={x}>{x}</th>)}<th>计算值</th></tr></thead><tbody>{summary.actors.map(row=><tr key={row.actor}><td>{row.actor}</td>{COUNT_KEYS.map(key=><td key={key}>{row[key as keyof typeof row]}</td>)}<td>{row.amount}</td></tr>)}</tbody></table></div></section>:null}
        {coverage?<p className="mt-3 rounded border border-amber-200 bg-amber-50 p-3 text-xs">{coverage.enabled?'审计启用：'+coverage.enabledAt:'尚无审计覆盖记录'}。待恢复发布 {coverage.pending.length}；无编辑归属变更 {coverage.unattributed}。启用前仅按需补创建事实，未还原历史编辑；补录字段未知时不估算。</p>:null}
        {rows.length?<details className="mt-3 rounded border border-slate-200 p-3"><summary className="cursor-pointer text-sm font-semibold">行为明细（预览最多 200 条，统计读取全部匹配日志）</summary>{rows.map(row=><div key={row.operationId} className="mt-2 border-t py-2 text-xs"><span>{row.day} · {row.actor??'未归属'} · {row.worldId} · {row.featureId} · {row.kind} · {row.fields.length} 个字段</span><AppButton className="ml-2 underline" onClick={()=>{const token=generation.current;void requestRiaContributionAudit('detail',{releaseId:row.releaseId,operationId:row.operationId}).then(result=>{if(token===generation.current)setDetail(result as unknown as AuditOperation);}).catch(e=>{if(token===generation.current)setError(e.message);})}}>查看差分</AppButton></div>)}</details>:null}
        {detail?<details open className="mt-3"><summary>字段差分与发布来源</summary><pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all rounded bg-slate-50 p-3 text-xs">{JSON.stringify(detail,null,2)}</pre></details>:null}
      </>}
      {error?<p role="alert" className="mt-3 whitespace-pre-wrap rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>:null}
    </div>
  </AppCard>;
}
