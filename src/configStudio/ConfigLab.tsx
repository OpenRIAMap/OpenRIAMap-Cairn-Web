import {GlobalPackageControls} from './GlobalPackageControls';
import {HelpLabel} from './SettingHelp';
import { getActiveConfigSnapshot, getStudioSessionSnapshot, persistActiveConfig, restoreApplicationDefault } from './defaultConfigProvider';
import { prepareConfigForActivation } from './configActivation';
import { hasStudioDraft } from './studioSession';
import { Component, type ErrorInfo, type ReactNode, useEffect, useRef, useState } from 'react';
import {  FileUp, FlaskConical, Pencil, Save, X } from 'lucide-react';
import MapContainer from '@/components/Map/MapContainer';
import { readConfigPackage } from './package';
import {listConfigLabPackageSummaries,loadConfigLabHistory,readConfigLabHistoryRaw,type ConfigHistorySummary,type ConfigHistoryCursor} from './configLabStorage';
import type { ConfigPackageV3 } from './types';

class LabErrorBoundary extends Component<{ children: ReactNode; onError: (error: Error) => void }, { error?: Error }> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, _info: ErrorInfo) { this.props.onError(error); }
  render() { return this.state.error ? <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-950/60 p-4"><div className="max-w-lg rounded-xl bg-white p-5"><h2 className="font-semibold text-rose-700">配置运行实验室错误</h2><p className="mt-2 text-sm">{this.state.error.message}</p><button type="button" className="mt-4 rounded bg-slate-800 px-3 py-2 text-white" onClick={() => window.location.reload()}>重新加载</button></div></div> : this.props.children; }
}

export function ConfigLab({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState<ConfigPackageV3>(() => getActiveConfigSnapshot());
  const [preservedDraft]=useState(()=>hasStudioDraft(getStudioSessionSnapshot()));
  const [restoreBusy,setRestoreBusy]=useState(false);
  const [versions, setVersions] = useState<ConfigHistorySummary[]>([]);
  const [message, setMessage] = useState('正在加载本地 V3 配置…');
  const inputRef = useRef<HTMLInputElement>(null);
  const importController=useRef<AbortController>();
  const [importing,setImporting]=useState(false);
  const [importBusy,setImportBusy]=useState(false);
  useEffect(()=>()=>importController.current?.abort(),[]);
  const [historyPage,setHistoryPage]=useState<{next?:ConfigHistoryCursor;pendingBackfill:boolean}>({pendingBackfill:false});
  const [failedHistory,setFailedHistory]=useState<string>();
  const refreshVersions = (after?:ConfigHistoryCursor) => void listConfigLabPackageSummaries({after}).then(page=>{setVersions(previous=>after?[...previous,...page.items]:page.items);setHistoryPage(page);}).catch(error=>setMessage(String(error)));
  const selectVersion=async(key:string)=>{try{const next=await loadConfigLabHistory(key);setConfig(await persistActiveConfig(next));setFailedHistory(undefined);setMessage(`已切换活动版本 ${next.packageId} r${next.revision}。`);}catch(error){setFailedHistory(key);setMessage(String(error));}};
  const downloadFailedHistory=async()=>{if(!failedHistory)return;const raw=await readConfigLabHistoryRaw(failedHistory),url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),anchor=document.createElement('a');anchor.href=url;anchor.download='history-diagnostic.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),0);};

  useEffect(() => {
    refreshVersions();
    setMessage(`已加载活动 V3 配置 ${config.packageId} r${config.revision}（契约 r${config.contractRevision}），刷新保持当前选择。`);
  }, []);
  const saveLocal = async () => { try { setConfig(await persistActiveConfig(config)); refreshVersions(); setMessage(`已保存本地 V3 版本 ${config.packageId} r${config.revision}。`); } catch (error) { setMessage(error instanceof Error ? error.message : '保存本地配置失败。'); } };
  const importFile = async (file?: File) => { if (!file||importController.current) return;const controller=new AbortController();importController.current=controller;setImporting(true);setImportBusy(true);try { const next = prepareConfigForActivation(await readConfigPackage(file,{signal:controller.signal,onProgress:setMessage}));controller.signal.throwIfAborted();setImporting(false);setConfig(await persistActiveConfig(next)); refreshVersions(); setMessage(`已导入并暂存 ${next.packageId} r${next.revision}。`); } catch (error) { setMessage(controller.signal.aborted?'已取消本次导入，当前配置保持原样。':error instanceof Error ? error.message : '上传配置失败。'); }finally{importController.current=undefined;setImporting(false);setImportBusy(false);if(inputRef.current)inputRef.current.value='';} };
  const openEditor = () => { try { sessionStorage.setItem('cairnmap-config-studio-draft', JSON.stringify(config)); sessionStorage.setItem('cairnmap-config-studio-return', new URL(window.location.href).toString()); } catch { /* editor can still begin from baseline */ } const target = new URL(window.location.href); target.searchParams.set('workspace', 'config-studio'); window.location.assign(target.toString()); };
  const restoreFormalDefault = async () => {
    if (importBusy || preservedDraft || restoreBusy) return;
    setRestoreBusy(true);setMessage('正在读取并核验当前正式配置…');
    try { await restoreApplicationDefault();location.reload(); }
    catch (error) { setMessage(String(error)); }
    finally { setRestoreBusy(false); }
  };
  return <div {...(restoreBusy?{inert:''}:{})} aria-busy={restoreBusy} className="app-root h-screen w-screen"><LabErrorBoundary onError={(error) => setMessage(`运行错误：${error.message}`)}><MapContainer configRuntime={config} configLab /></LabErrorBoundary><header className="fixed bottom-12 left-1/2 z-[2700] flex w-max max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-10rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur"><span className="inline-flex items-center gap-1 px-2 text-sm font-semibold"><FlaskConical className="h-4 w-4 text-violet-600" />配置运行实验室</span><><button type="button" className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" onClick={openEditor}><Pencil className="h-3.5 w-3.5" />编辑</button><button type="button" className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" onClick={() => void saveLocal()}><Save className="h-3.5 w-3.5" />保存本地</button><button type="button" className="rounded border px-2 py-1 text-sm" disabled={importBusy||preservedDraft||restoreBusy} title="读取并核验当前 Web 正式配置，替换本机编辑版本；原配置会保留恢复副本。" onClick={()=>void restoreFormalDefault()}>恢复当前正式配置</button><button type="button" className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" disabled={importBusy} onClick={() => inputRef.current?.click()}><FileUp className="h-3.5 w-3.5" />导入本地配置</button><GlobalPackageControls config={config} hasDraft={importBusy||preservedDraft} onSaved={setConfig} onMessage={setMessage}/>{versions.length ? <HelpLabel context="ConfigLab" className="text-xs">本地版本<select className="ml-1 rounded border px-2 py-1" value={`${config.packageId}:${config.revision}`} onChange={(event) => {const next=versions.find(item=>`${item.packageId}:${item.revision}`===event.target.value);if(next)void selectVersion(next.key);}}><option value={`${config.packageId}:${config.revision}`}>{config.packageId} r{config.revision}（当前）</option>{versions.filter((item) => `${item.packageId}:${item.revision}` !== `${config.packageId}:${config.revision}`).map((item) => <option key={`${item.packageId}:${item.revision}`} value={`${item.packageId}:${item.revision}`}>{item.packageId} r{item.revision}{item.validation==='validated'?'':'（待核验）'}</option>)}</select></HelpLabel> : null}{historyPage.next?<button type="button" className="rounded border px-2 py-1 text-sm" onClick={()=>refreshVersions(historyPage.next)}>更多历史版本</button>:null}{historyPage.pendingBackfill?<button type="button" className="rounded border px-2 py-1 text-sm" onClick={()=>refreshVersions()}>继续整理旧历史</button>:null}{failedHistory?<button type="button" className="rounded border px-2 py-1 text-sm" onClick={()=>void downloadFailedHistory()}>下载原文诊断</button>:null}</><button type="button" className="rounded p-1.5 hover:bg-slate-100" aria-label="返回主地图" onClick={onClose}><X className="h-4 w-4" /></button><>{importing?<button type="button" className="rounded border px-2 py-1 text-sm" onClick={()=>importController.current?.abort()}>取消导入</button>:null}</><input ref={inputRef} className="hidden" type="file" accept=".zip,.json,application/json,application/zip" onChange={(event) => void importFile(event.target.files?.[0])} /><div className="hidden basis-full px-2 text-center text-xs text-slate-600 sm:block">{message}　本页运行本地编辑配置；正式主地图使用已发布版本。本地版本和历史保存在 IndexedDB。</div></header></div>;
}

export default ConfigLab;
