import {Loader2} from 'lucide-react';
import {useRef} from 'react';
import {useLoadingStore} from '@/store/loadingStore';
import {useRuleDataStore} from '@/store/ruleDataStore';
import {getApplicationSettings} from '@/core/project/applicationRuntime';

/** Owned by App: stays mounted across configuration activation and map creation. */
export function LoadingOverlay({initial=true}:{initial?:boolean}){
  const state=useLoadingStore(),failure=useRuleDataStore(s=>s.dataSourceFailure);
  const floor=useRef({task:'',progress:0}),task=initial&&!state.initialized?'startup':state.activeFlowId??'idle';
  if(floor.current.task!==task)floor.current={task,progress:0};
  if(failure||!state.isLoading&&(!initial||state.initialized))return null;
  const english=getApplicationSettings().preferences.language==='en',configuring=initial&&state.configurationStatus!=='ready'&&!state.initialized;
  const failed=state.configurationStatus==='error'||state.stages.some(s=>s.status==='error');
  const stage=state.stages.find(s=>s.status==='loading')??state.stages.find(s=>s.status==='error')??state.stages.find(s=>s.status==='pending')??state.stages[state.stages.length-1];
  const done=state.stages.filter(s=>s.status==='success').length,base=state.initialized||!initial?0:20;
  const completedProgress=configuring?(state.configurationStatus==='verifying'?12:2):base+(state.stages.length?done/state.stages.length:0)*(100-base);
  const progress=Math.max(floor.current.progress,completedProgress);floor.current.progress=progress;
  const label=configuring?(failed?(english?'Configuration could not be loaded':'配置加载失败'):state.configurationStatus==='verifying'?(english?'Verifying configuration':'正在核验配置'):(english?'Reading configuration':'正在读取配置')):(stage?.label??(english?'Preparing world data':'正在准备世界数据'));
  return <div data-global-loading className="fixed inset-0 z-[29000] flex items-center justify-center bg-black/25 p-4 backdrop-blur-md" aria-busy={!failed}>
    <section className="w-[min(92vw,420px)] rounded-2xl border p-6 shadow-xl" style={{background:'var(--cm-panel-bg,#fff)',color:'var(--cm-panel-ink,#222)',borderColor:'var(--cm-panel-line,#ccc)'}} role={failed?'alert':'status'}>
      <h2 className="text-lg font-bold">{english?'Loading map':'地图加载中'}</h2>
      <div className="mt-4 h-2 overflow-hidden rounded bg-black/10" role="progressbar" aria-label={english?'Loading progress':'加载进度'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><div className="h-full rounded bg-blue-500 transition-[width] duration-200 motion-reduce:transition-none" style={{width:Math.min(progress,failed?99:100)+'%'}}/></div>
      <p className="mt-4 flex items-center gap-2 break-words text-sm">{!failed?<Loader2 className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none"/>:null}<span>{label}</span></p>
      {state.configurationError?<><p className="mt-3 text-sm">{english?'Reload to try again.':'请重新加载后重试。'}</p><details className="mt-2 break-all text-xs"><summary>{english?'Diagnostic details':'诊断详情'}</summary>{state.configurationError}</details><button className="mt-3 rounded border px-3 py-1" onClick={()=>location.reload()}>{english?'Reload':'重新加载'}</button></>:null}
    </section>
  </div>;
}
export default LoadingOverlay;
