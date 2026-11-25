import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, LoaderCircle, LogIn, RefreshCw, X, ChevronDown,ChevronRight,Search,Calculator } from 'lucide-react';

import AppButton from '@/components/ui/AppButton';
import AppCard from '@/components/ui/AppCard';
import { openriamapGithubReviewAuth } from './openriamapReviewAuth';
import {
  requestRiaPublicReviewReleaseDetail,
  requestRiaReleaseHistory,
  requestRiaPublicReviewReleasePackageDownload,
  type PublicReviewReleaseDetail,
  type PublicReviewReleaseFeedItem,
  type ReleaseHistoryResult,
} from './riaReviewSubmissionAdapter';
import {useReleaseAuditAccess} from './releaseAuditAccess';

type PublicReleaseRecordsPanelProps = {
  onClose: () => void;
  /** DraggablePanel owns desktop window controls; mobile owns its close key. */
  showNativeClose?: boolean;
  /** Desktop outer window owns its header refresh action; mobile retains one. */
  showInlineRefresh?: boolean;
  refreshSignal?: number;
  onOpenAudit?:()=>void;
  onAuthorizationChange?:(authorized:boolean)=>void;
};

function textError(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function count(value: unknown): number {
  return Number.isSafeInteger(value) && Number(value) >= 0 ? Number(value) : 0;
}

function time(value: string | null | undefined): string {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function stateText(value: string | undefined): string {
  const labels: Record<string, string> = {
    approved: '通过',
    archived: '归档',
    rejected: '打回',
    'changes-requested': '要求修改',
  };
  return labels[value ?? ''] ?? (value || '已归档');
}

function decisionClass(value: string | undefined): string {
  if (value === 'rejected') return 'bg-rose-100 text-rose-700';
  if (value === 'changes-requested') return 'bg-amber-100 text-amber-800';
  if (value === 'approved') return 'bg-emerald-100 text-emerald-700';
  return 'bg-slate-100 text-slate-700';
}

function CompactPackageCard({
  entry,
  onDownload,
  downloading,
}: {
  entry: NonNullable<PublicReviewReleaseDetail['packages']>[number];
  onDownload: () => void;
  downloading: boolean;
}) {
  const counts = entry.counts ?? {};
  const displayState = entry.decisionState ?? entry.decisionAction;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="truncate text-sm font-semibold text-slate-900" title={entry.packageName ?? entry.submissionId}>
        {entry.packageName ?? entry.submissionId}
      </div>
      <div className="mt-1 break-all text-xs text-slate-500">版本：{entry.decisionRevisionId}</div>
      <div className="mt-1 text-xs text-slate-500">包用户：{entry.operator??'历史记录未提供'}</div>
      <div className="mt-2 grid grid-cols-3 overflow-hidden rounded-lg text-center text-xs">
        <div className="bg-blue-50 px-1.5 py-1.5 text-blue-700">{count(counts.featureCount)} 要素</div>
        <div className="bg-amber-50 px-1.5 py-1.5 text-amber-700">{count(counts.deleteCount)} 删除</div>
        <div className="bg-fuchsia-50 px-1.5 py-1.5 text-fuchsia-700">{count(counts.pictureCount)} 图片</div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${decisionClass(displayState)}`}>
          {stateText(displayState)}
        </span>
        <AppButton
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!entry.download?.ready || downloading}
          onClick={onDownload}
          title={entry.download?.ready ? `下载 ${entry.packageName ?? entry.submissionId}` : '该归档包暂不可下载'}
        >
          {downloading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          下载
        </AppButton>
      </div>
      {(displayState === 'rejected' || displayState === 'changes-requested') && entry.reason ? (
        <div className="mt-2 whitespace-pre-wrap rounded-lg bg-amber-50 px-2.5 py-2 text-xs leading-5 text-amber-900">
          {entry.reason}
        </div>
      ) : null}
    </div>
  );
}

export default function PublicReleaseRecordsPanel({onClose,showNativeClose=false,showInlineRefresh=showNativeClose,refreshSignal,onOpenAudit,onAuthorizationChange}:PublicReleaseRecordsPanelProps){
  const {authorized,refresh:refreshAccess}=useReleaseAuditAccess();
  const [filter,setFilter]=useState({dateFrom:'',dateTo:'',publisher:'',operator:''}),[applied,setApplied]=useState(filter);
  const [months,setMonths]=useState<ReleaseHistoryResult['months']>([]),[opened,setOpened]=useState<Record<string,boolean>>({}),[pages,setPages]=useState<Record<string,{items:PublicReviewReleaseFeedItem[];cursor:string|null}>>({}),[details,setDetails]=useState<Record<string,PublicReviewReleaseDetail>>({});
  const [loading,setLoading]=useState(false),[loadingMonth,setLoadingMonth]=useState<string|null>(null),[error,setError]=useState(''),[coverage,setCoverage]=useState(''),[downloadingKey,setDownloadingKey]=useState<string|null>(null);
  const generation=useRef(0),monthRequests=useRef(new Set<string>()),abort=useRef<AbortController|null>(null);
  useEffect(()=>{onAuthorizationChange?.(authorized===true);},[authorized,onAuthorizationChange]);
  const refresh=useCallback(async()=>{
    const token=++generation.current;abort.current?.abort();monthRequests.current.clear();setLoadingMonth(null);
    setPages({});setDetails({});setMonths([]);setCoverage('');setError('');
    if(authorized!==true){setLoading(false);return;}
    const controller=new AbortController();abort.current=controller;setLoading(true);
    try{const result=await requestRiaReleaseHistory(applied,controller.signal);if(token!==generation.current)return;setMonths(result.months);setCoverage(result.coverage);}
    catch(e){if(token===generation.current){setError(textError(e,'无法读取发布记录。'));void refreshAccess();}}
    finally{if(token===generation.current)setLoading(false);}
  },[authorized,applied,refreshAccess]);
  useEffect(()=>{void refresh();return()=>{generation.current++;abort.current?.abort();};},[refresh,refreshSignal]);
  useEffect(()=>{for(const group of months)if(opened[group.month]&&!pages[group.month])void loadMonth(group.month);},[months]);
  async function loadMonth(month:string,append=false){
    if(monthRequests.current.has(month))return;
    const token=generation.current;monthRequests.current.add(month);setLoadingMonth(month);setError('');
    try{
      const result=await requestRiaReleaseHistory({...applied,month,...(append&&pages[month]?.cursor?{cursor:pages[month].cursor}:{})},abort.current?.signal);
      if(token!==generation.current)return;
      setMonths(result.months);setCoverage(result.coverage);
      setPages(old=>({...old,[month]:{items:[...(append?old[month]?.items??[]:[]),...result.items],cursor:result.nextCursor}}));
      for(const entry of result.items){
        const detail=await requestRiaPublicReviewReleaseDetail(entry.releaseId);if(token!==generation.current)return;
        setDetails(old=>({...old,[entry.releaseId]:detail}));
      }
    }catch(e){if(token===generation.current)setError(textError(e,'该月份读取失败，请重试。'));}
    finally{if(token===generation.current){monthRequests.current.delete(month);setLoadingMonth(current=>current===month?null:current);}}
  }
  async function download(releaseId:string,submissionId:string,revisionId:string){
    const token=generation.current,key=releaseId+':'+submissionId+':'+revisionId;setDownloadingKey(key);
    try{const grant=await requestRiaPublicReviewReleasePackageDownload(releaseId,submissionId,revisionId);if(token!==generation.current)return;const a=document.createElement('a');a.href=grant.download.url;a.target='_blank';a.rel='noopener noreferrer';a.click();}
    catch(e){if(token===generation.current)setError(textError(e,'下载失败。'));}
    finally{if(token===generation.current)setDownloadingKey(null);}
  }
  return <AppCard data-draggable-proxy-close="true" className="cm-release-history flex h-[min(76vh,900px)] w-[min(94vw,680px)] flex-col overflow-hidden border border-slate-200 bg-white text-slate-900 shadow-xl">
    <button type="button" data-draggable-close className="sr-only" aria-label="关闭" onClick={onClose}/>
    <header className="relative shrink-0 border-b border-slate-200 bg-slate-50 px-5 py-4 pr-28">
      <h2 data-draggable-title className="text-xl font-bold">发布记录</h2><p className="mt-1 text-xs text-slate-500">按发布时间检索，月份默认收起。</p>
      {showInlineRefresh?<div className={'absolute top-3 flex items-center gap-1 '+(showNativeClose?'right-12':'right-3')}>
        {authorized===true&&onOpenAudit?<AppButton title="审计" className="rounded p-2 hover:bg-slate-100" onClick={onOpenAudit}><Calculator className="h-5 w-5"/></AppButton>:null}
        <AppButton title="刷新发布记录" className="rounded p-2 hover:bg-slate-100" onClick={()=>void refresh()}><RefreshCw className={'h-5 w-5 '+(loading?'animate-spin':'')}/></AppButton></div>:null}
      {showNativeClose?<AppButton title="关闭发布记录" className="absolute right-2 top-3 rounded p-2" onClick={onClose}><X className="h-5 w-5"/></AppButton>:null}
    </header>
    {authorized===true?<form className="shrink-0 border-b border-slate-200 bg-white px-5 py-3" onSubmit={event=>{event.preventDefault();setOpened({});setApplied({...filter});}}>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Search className="h-4 w-4"/>搜索</div>
      <div className="grid grid-cols-2 gap-2">{(['dateFrom','dateTo','publisher','operator'] as const).map((key,index)=><label key={key} className="text-xs">{['发布时间起','发布时间止','发布用户名','包用户名'][index]}<input aria-label={['发布时间起','发布时间止','发布用户名','包用户名'][index]} type={index<2?'date':'text'} value={filter[key]} onChange={event=>setFilter(old=>({...old,[key]:event.target.value}))} className="mt-1 w-full min-w-0 rounded border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"/></label>)}</div>
      <div className="mt-2 flex gap-2"><AppButton type="submit" className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white">搜索</AppButton><AppButton type="button" className="rounded border px-3 py-1.5 text-sm" onClick={()=>{const next={dateFrom:'',dateTo:'',publisher:'',operator:''};setFilter(next);setApplied(next);setOpened({});}}>重置</AppButton></div>
    </form>:null}
    <div data-release-list className="min-h-0 flex-1 overflow-auto p-5">
      {authorized===null?<p>正在核验登录状态…</p>:authorized===false?<div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm"><p className="font-semibold">需要登录</p><p>发布记录与归档下载需要 Contributor 或更高权限。</p><AppButton className="mt-2 inline-flex items-center gap-2 underline" onClick={()=>void openriamapGithubReviewAuth.beginLogin().catch(e=>setError(e.message))}><LogIn className="h-4 w-4"/>登录</AppButton></div>:<>
        {coverage&&coverage!=='complete'?<p className="mb-3 rounded border border-amber-200 bg-amber-50 p-2 text-xs">历史月份索引尚未全部补齐；已知记录可以检索，未覆盖范围不代表没有发布。</p>:null}
        {loading?<p role="status">正在读取月份…</p>:!months.length&&!error?<p>当前条件下没有发布记录。</p>:null}
        {months.map(group=><section key={group.month} className="mb-3 overflow-hidden rounded border border-slate-200">
          <AppButton aria-expanded={Boolean(opened[group.month])} className="flex w-full items-center gap-2 bg-slate-50 px-3 py-3 text-left text-sm font-semibold" onClick={()=>{const next=!opened[group.month];setOpened(old=>({...old,[group.month]:next}));if(next&&!pages[group.month])void loadMonth(group.month);}}>{opened[group.month]?<ChevronDown className="h-4 w-4"/>:<ChevronRight className="h-4 w-4"/>}<span>{group.month.replace('-',' 年 ')} 月</span><span className="ml-auto text-xs font-normal">{group.releaseCount} 次发布 / {group.packageCount} 个匹配包</span></AppButton>
          {opened[group.month]?<div className="space-y-3 p-3">
            {pages[group.month]?.items.map(entry=><section key={entry.releaseId} className="space-y-2 rounded border border-slate-200 p-3"><div className="text-sm font-semibold">{time(entry.effectivePublishedAt??entry.publishedAt)}</div><div className="break-all text-xs text-slate-500">{entry.releaseId} · 发布人：{entry.publisher??'历史记录未提供'} · {entry.matchingSubmissionIds?.length??entry.packageCount} / {entry.packageCount} 个包</div>
              {details[entry.releaseId]?(details[entry.releaseId].packages.filter(pkg=>!entry.matchingSubmissionIds||entry.matchingSubmissionIds.includes(pkg.submissionId)).map(pkg=><CompactPackageCard key={pkg.submissionId+pkg.decisionRevisionId} entry={pkg} downloading={downloadingKey===entry.releaseId+':'+pkg.submissionId+':'+pkg.decisionRevisionId} onDownload={()=>void download(entry.releaseId,pkg.submissionId,pkg.decisionRevisionId)}/>)):<p className="text-xs">正在读取归档详情…</p>}
            </section>)}
            {loadingMonth===group.month?<p role="status" className="text-sm">正在读取…</p>:pages[group.month]?.cursor?<AppButton className="rounded border px-3 py-1 text-sm" onClick={()=>void loadMonth(group.month,true)}>继续加载本月</AppButton>:!pages[group.month]?<AppButton className="underline" onClick={()=>void loadMonth(group.month)}>重试读取本月</AppButton>:null}
          </div>:null}
        </section>)}
      </>}
      {error?<div role="alert" className="mt-3 whitespace-pre-wrap rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>:null}
    </div>
  </AppCard>;
}
