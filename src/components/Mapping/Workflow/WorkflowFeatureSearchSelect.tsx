import { useEffect, useMemo, useRef, useState } from 'react';
import { normalizeRuleSourceWorldId } from '@/core/project/worldIdentity';
import type { WorkflowBridge } from './WorkflowHost';
import { useRuleDataStore } from '@/store/ruleDataStore';
import { getRuleDataSourceSnapshot } from '@/components/Rules/data/formalDataSourceRuntime';
import { datasetMatchesSource, loadWorldRuleDataset, ruleDatasetSourceKey } from '@/components/Rules/data/worldRuleDatasetLoader';
import { filterWorkflowSearchOptions, mergeWorkflowSearchPool, type SearchSelectConfig, type SearchPoolOption } from './workflowSearchPool';
export { buildWorkflowSearchOptionsFromFeatures, filterWorkflowSearchOptions } from './workflowSearchPool';
export type { SearchSelectConfig, SearchPoolOption } from './workflowSearchPool';

type Props = { bridge: WorkflowBridge; label: string; value: string; onChange: (value: string) => void; placeholder?: string; config: SearchSelectConfig; disabled?: boolean };
const stageLabels: Record<string,string> = { 'world-version':'正在确认数据发布', 'world-cache-check':'正在检查数据缓存', 'world-index-scan':'正在读取数据目录', 'world-chunk-load':'正在读取要素数据', 'world-cache-write':'正在更新数据缓存', 'world-ready':'正在生成搜索候选' };

export default function WorkflowFeatureSearchSelect({ bridge, label, value, onChange, placeholder, config, disabled }: Props) {
  const worldId = normalizeRuleSourceWorldId(bridge.getCurrentWorldId());
  const dataset = useRuleDataStore(state=>state.datasets[worldId]);
  // Subscribe to source changes, but depend on its stable identity below.
  useRuleDataStore(state=>state.dataSource);
  const source = getRuleDataSourceSnapshot(worldId), sourceKey = ruleDatasetSourceKey(worldId,source);
  const committed = bridge.getCommittedLayerJsonInfos?.().map(item=>item.featureInfo) ?? [];
  const deleted = bridge.getDeleteMarkedFeatureIds?.() ?? [];
  const overlayKey = JSON.stringify([committed,deleted]);
  const input = useRef({source,committed,deleted}); input.current={source,committed,deleted};
  const stop = useRef<() => void>();
  const blurTimer = useRef<ReturnType<typeof setTimeout>>();
  const [pool,setPool] = useState<SearchPoolOption[]>([]);
  const [status,setStatus] = useState<'idle'|'loading'|'ready'|'error'|'cancelled'>('idle');
  const [error,setError] = useState(''), [stage,setStage] = useState('正在准备搜索候选');
  const [visible,setVisible] = useState(false), [open,setOpen] = useState(false), [requested,setRequested] = useState(false), [retry,setRetry] = useState(0);
  useEffect(()=>()=>{clearTimeout(blurTimer.current);},[]);
  useEffect(()=>{
    if (disabled) {setPool([]);setStatus('idle');setVisible(false);return;}
    if (!requested) return;
    const abort = new AbortController();
    let active=true;
    const snapshot=input.current;
    setPool([]); setStatus('loading'); setError(''); setVisible(false); setStage('正在准备搜索候选');
    const hint=setTimeout(()=>{if(active)setVisible(true);},1000);
    const timeout=setTimeout(()=>abort.abort(Error('搜索准备超时，请重试。')),30000);
    const progress=(text:string)=>{if(active)setStage(text);};
    void (async()=>{
      progress('正在读取已加载地图记录');
      const loaded = datasetMatchesSource(dataset,worldId,snapshot.source) ? dataset : await loadWorldRuleDataset(worldId,p=>progress(stageLabels[p.stage]??'正在读取当前数据源'),snapshot.source,{signal:abort.signal});
      abort.signal.throwIfAborted();
      if (ruleDatasetSourceKey(worldId,getRuleDataSourceSnapshot(worldId))!==sourceKey) throw Error('数据来源已改变，请重试。');
      progress('正在合并图层管理要素和删除标记');
      const list=mergeWorkflowSearchPool(loaded.features,snapshot.committed,snapshot.deleted,config,worldId);
      if(active){setPool(list);setStatus('ready');}
    })().catch(reason=>{if(active){setPool([]);setStatus('error');setError(reason instanceof Error?reason.message:String(reason));}}).finally(()=>{clearTimeout(hint);clearTimeout(timeout);if(active)setVisible(false);});
    const cancel=()=>{active=false;clearTimeout(hint);clearTimeout(timeout);abort.abort(Error('已取消搜索等待。'));};
    stop.current=cancel; return cancel;
  },[requested,disabled,worldId,sourceKey,dataset,overlayKey,config,retry]);
  const suggestions=useMemo(()=>filterWorkflowSearchOptions(pool,String(value??''),50),[pool,value]);
  const cancel=()=>{stop.current?.();setRequested(false);setVisible(false);setStatus('cancelled');setPool([]);};
  const restart=()=>{setRequested(true);setRetry(current=>current+1);setOpen(true);};
  return <div className="space-y-1">
    <div className="text-xs opacity-80">{label}</div>
    <input className="w-full border p-1 rounded text-sm" value={value??''} placeholder={placeholder} disabled={disabled}
      onChange={event=>{onChange(event.target.value);setRequested(true);setOpen(true);}}
      onFocus={()=>{clearTimeout(blurTimer.current);setRequested(true);setOpen(true);}} onBlur={()=>{blurTimer.current=setTimeout(()=>setOpen(false),120);}}
      onMouseDownCapture={event=>event.stopPropagation()} onPointerDownCapture={event=>event.stopPropagation()} onTouchStartCapture={event=>event.stopPropagation()}/>
    {status==='loading'?<div className="flex items-center gap-2 rounded border bg-slate-50 p-2 text-xs" role="status">
      {visible?<><span aria-hidden="true" className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"/><span>{stage}（等待中）</span></>:<span>正在准备搜索候选</span>}
      <button type="button" className="ml-auto shrink-0 rounded border px-2 py-1" onClick={cancel}>取消等待</button>
    </div>:null}
    {status==='error'||status==='cancelled'?<div className="text-xs text-rose-600" role={status==='error'?'alert':'status'}>{status==='error'?`检索池加载失败：${error}`:'已取消搜索等待，编辑内容保留。'} <button type="button" className="rounded border px-2 py-1" onClick={restart}>重试</button></div>:null}
    {open&&status==='ready'?(suggestions.length?<div className="border rounded bg-white max-h-40 overflow-auto">{suggestions.map(option=><button key={option.id} type="button" className="w-full text-left px-2 py-1 text-sm hover:bg-gray-50" onMouseDown={event=>event.preventDefault()} onClick={()=>{onChange(option.id);setOpen(false);}}>{option.display}</button>)}</div>:<div className="text-xs text-slate-500">没有匹配的候选要素。</div>):null}
  </div>;
}
