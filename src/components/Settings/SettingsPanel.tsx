import {ConfigDialog} from '@/configStudio/ConfigDialog';
import { retiredSourceNotice } from '@/components/Rules/data/formalDataSourceRuntime';
import {getFormalConfiguration,subscribeFormalConfiguration} from '@/configRuntime/formalConfiguration';
import {getRuntimeDataDiagnostics} from '@/configRuntime/runtimeDataView';
/**
 * 设置面板组件
 * 显示 Rules 世界版本、缓存状态、PWA 状态等信息
 */

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { getApplicationSettings, subscribeApplication } from '@/core/project/applicationRuntime';
import { X, RefreshCw, Trash2, Database, Smartphone, CheckCircle, AlertCircle, Loader2, Download, SlidersHorizontal } from 'lucide-react';

// PWA 安装事件类型
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
import { useLoadingStore } from '@/store/loadingStore';
import { useRuleDataStore } from '@/store/ruleDataStore';
import { type RuleWorldVersion } from '@/components/Rules/data/worldRuleDatasetLoader';
import { compareFormalSourceVersions, readWorldPublicationStatuses, type SourceComparison, type WorldPublicationStatus } from '@/components/Rules/data/formalSourceStatus';
import {
  calculateRuleCacheSize,
  removeRuleWorldCachesForSource,
  readRuleWorldCache,
  readRuleWorldMeta,
} from '@/components/Rules/data/worldRuleCache';
import AppButton from '@/components/ui/AppButton';
import AppCard from '@/components/ui/AppCard';
import DataSourceSelectionSection from './DataSourceSelectionSection';
import { getRuleDataSourceSnapshot, getRuleDataSourceSelectionController, getRuleDataSourceSelectionPolicy, isFormalGithubTransportSource } from '@/components/Rules/data/formalDataSourceRuntime';
import ReviewAuthSettingsSection from '@/components/Settings/ReviewAuthSettingsSection';
import type { ReviewAuthPort,ReviewAuthSessionState } from '@/components/Review/auth';
import {WorldVersionControl} from './WorldVersionControl';
import {
  getCurrentSourceLinkModeId,
  getDefaultSourceLinkModeId,
  getSourceLinkModeDefs,
  setCurrentSourceLinkMode,
} from '@/components/Rules/data/sourceLinkModes';

interface SettingsPanelProps {
  onClose: () => void;
  onOpenConfigStudio?: () => void;
  onOpenConfigLab?: () => void;
  /** Optional application-owned identity provider; generic settings remain unchanged when absent. */
  reviewAuth?: ReviewAuthPort;
  reviewAuthTitle?: string;
  reviewAuthLoginLabel?: string;
}

type RuleWorldRow = {
  worldId: string;
  name: string;
  remoteVersion: string;
  remoteReleaseId: string | null;
  remoteOk: boolean;
  localVersion: string | null;
  localReleaseId: string | null;
  cachedAt: number | null;
  featureCount: number | null;
  isLoaded: boolean;
  publicationState?:WorldPublicationStatus['state'];
  errorMessage?:string;
  publicationVersion?:number;
  bindingRevision?:number;
  localBindingRevision?:number;
};

/** Keep the compact card readable while the title retains both immutable IDs. */
function compactFormalVersion(value: string | null): string {
  const version = String(value ?? '').trim();
  if (!/^\d+$/.test(version) || version.length <= 6) return version || '未分配';
  return `${version.slice(0, 6)}…`;
}

export function SettingsPanel({ onClose, onOpenConfigStudio, onOpenConfigLab, reviewAuth, reviewAuthTitle, reviewAuthLoginLabel }: SettingsPanelProps) {
  const [versionSession,setVersionSession]=useState<ReviewAuthSessionState>({status:'anonymous'});
  const formalConfiguration=useSyncExternalStore(subscribeFormalConfiguration,getFormalConfiguration);
  const formal=formalConfiguration?.identity;
  const compatibility=Object.values(getRuntimeDataDiagnostics()).flatMap(value=>value.unknown);
  const application = useSyncExternalStore(subscribeApplication, getApplicationSettings);
  const RULE_WORLDS = application.worlds.map(world => ({id:world.id,name:world.label.zh||world.label.en||world.id,enabled:world.enabled}));
  const { isLoading, activeRuleWorldId } = useLoadingStore();
  const datasets = useRuleDataStore((s) => s.datasets);
  const refreshWorlds = useRuleDataStore((s) => s.refreshWorlds);
  const dataSource = useRuleDataStore((s) => s.dataSource);
  const dataSourceApplying = useRuleDataStore((s) => s.dataSourceApplying);
  const applyDataSource = useRuleDataStore((s) => s.applyDataSource);
  const applyDataSourceTransport = useRuleDataStore((s) => s.applyDataSourceTransport);

  const [isRefreshingRules, setIsRefreshingRules] = useState(false);
  const [rulesRefreshProgress, setRulesRefreshProgress] = useState<string | null>(null);
  const [isSyncingRules, setIsSyncingRules] = useState(false);
  const [ruleCacheSize, setRuleCacheSize] = useState(0);
  const [ruleWorldRows, setRuleWorldRows] = useState<RuleWorldRow[]>([]);
  const worldSyncEpoch=useRef(0),comparisonEpoch=useRef(0);
  const [sourceComparison,setSourceComparison]=useState<SourceComparison|null>(null);
  const [comparisonBusy,setComparisonBusy]=useState(false);
  const [comparisonOpen,setComparisonOpen]=useState(false),[comparisonError,setComparisonError]=useState('');
  const [pwaStatus, setPwaStatus] = useState<{
    isInstalled: boolean;
    canInstall: boolean;
    swActive: boolean;
  }>({
    isInstalled: false,
    canInstall: false,
    swActive: false,
  });
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const sourceLinkModeDefs = getSourceLinkModeDefs(dataSource.worldId);
  const [sourceLinkModeDraft, setSourceLinkModeDraft] = useState(() => getCurrentSourceLinkModeId(dataSource.worldId));
  const [sourceLinkModeApplied, setSourceLinkModeApplied] = useState(() => getCurrentSourceLinkModeId(dataSource.worldId));
  const [sourceLinkModeStatus, setSourceLinkModeStatus] = useState<string>('');
  const dataSourceController = getRuleDataSourceSelectionController(dataSource.worldId);
  const dataSourcePolicy = getRuleDataSourceSelectionPolicy(dataSource.worldId);
  const sourceScope=JSON.stringify([dataSource.worldId,dataSource.resourceGroupId,dataSource.sourceId,dataSource.transportId,dataSource.generation]);
  const [dataSourceDraft, setDataSourceDraft] = useState(() => dataSource.sourceId);
  const [dataSourceStatus, setDataSourceStatus] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);

  const anyRefreshBusy = isRefreshingRules || isSyncingRules;
  const rulesRefreshBlocked = anyRefreshBusy || (isLoading && !!activeRuleWorldId);

  useEffect(() => {
    const current = getCurrentSourceLinkModeId(dataSource.worldId);
    setSourceLinkModeDraft(current);
    setSourceLinkModeApplied(current);
  }, [sourceScope]);

  useEffect(() => {
    setDataSourceDraft(dataSource.sourceId);
  }, [sourceScope]);

  useEffect(()=>{setSourceComparison(null);setComparisonBusy(false);setSourceLinkModeStatus('');setDataSourceStatus(null);void syncRuleWorldRows();return()=>{worldSyncEpoch.current++;comparisonEpoch.current++;};},[sourceScope,application]);

  const handleCompareSources=async()=>{
    const epoch=++comparisonEpoch.current;setComparisonBusy(true);setComparisonError('');
    try{const result=await compareFormalSourceVersions(dataSource.worldId);if(epoch===comparisonEpoch.current)setSourceComparison(result);}
    catch(error){if(epoch===comparisonEpoch.current)setComparisonError(String(error));}
    finally{if(epoch===comparisonEpoch.current)setComparisonBusy(false);}
  };

  useEffect(() => {
    if (!sourceLinkModeStatus) return;
    const timer = window.setTimeout(() => setSourceLinkModeStatus(''), 1800);
    return () => window.clearTimeout(timer);
  }, [sourceLinkModeStatus]);

  const handleApplySourceLinkMode = async () => {
    if (!isFormalGithubTransportSource(dataSource.sourceId,dataSource.worldId)) {
      setSourceLinkModeStatus('请先应用 GitHub 镜像作为运行数据读取来源。');
      return;
    }
    const next = setCurrentSourceLinkMode(sourceLinkModeDraft,dataSource.worldId);
    const nextId = next.id;
    const changed = nextId !== sourceLinkModeApplied;
    setSourceLinkModeDraft(nextId);
    setSourceLinkModeApplied(nextId);
    if (!changed) {
      setSourceLinkModeStatus('当前已是该模式');
      return;
    }
    try {
      await applyDataSourceTransport();
      setSourceLinkModeStatus('已应用，已清空运行数据缓存并重新读取当前世界。');
    } catch {
      setSourceLinkModeStatus('读取失败；来源未自动切换。请在恢复提示中明确选择后重试。');
    }
  };

  const handleApplyDataSource = async () => {
    setDataSourceStatus({ tone: 'info', text: '正在应用并重新读取当前世界数据…' });
    try {
      await applyDataSource(dataSourceDraft, 'settings');
      setDataSourceStatus({ tone: 'success', text: '已应用，当前世界数据已按所选来源重新读取。' });
    } catch {
      setDataSourceStatus({ tone: 'error', text: '读取失败。请在提示窗口中选择来源并明确重试。' });
    }
  };


  const buildRuleWorldRow = (worldId: string, remote: RuleWorldVersion, remoteOk: boolean): RuleWorldRow => {
    const source=getRuleDataSourceSnapshot(worldId);
    const candidate=datasets[worldId],latestMeta=readRuleWorldMeta(worldId,source);
    const meta=latestMeta?.sourceId===source.sourceId&&latestMeta.transportId===source.transportId?latestMeta:null;
    const loadedDataset=candidate?.sourceId===source.sourceId&&candidate.transportId===source.transportId?candidate:undefined;
    const cachedDataset = meta?readRuleWorldCache(meta):null;
    const localDataset = loadedDataset ?? cachedDataset;
    const loadedFeatureCount = Array.isArray(loadedDataset?.features) ? loadedDataset.features.length : null;
    return {
      worldId,
      name: RULE_WORLDS.find((item) => item.id === worldId)?.name ?? worldId,
      remoteVersion: remote.formalVersion ?? '未分配',
      remoteReleaseId: remote.releaseId,
      remoteOk,
      publicationVersion:remote.publicationVersion,
      bindingRevision:remote.bindingRevision,
      localBindingRevision:localDataset?.bindingRevision,
      localVersion: localDataset?.formalVersion === undefined || localDataset.formalVersion === null ? null : String(localDataset.formalVersion),
      localReleaseId: localDataset?.releaseId ?? meta?.releaseId ?? null,
      cachedAt: meta?.cachedAt ?? null,
      featureCount: loadedFeatureCount ?? cachedDataset?.features.length ?? null,
      isLoaded: !!loadedDataset,
    };
  };

  const syncRuleWorldRows = async (): Promise<RuleWorldRow[]> => {
    const epoch=++worldSyncEpoch.current;
    setIsSyncingRules(true);
    try {
      const statuses=await readWorldPublicationStatuses(RULE_WORLDS);
      const rows=statuses.map(status=>({...buildRuleWorldRow(status.worldId,status.version,status.state==='published'),publicationState:status.state,errorMessage:status.message}));
      if(epoch===worldSyncEpoch.current){setRuleWorldRows(rows);setRuleCacheSize(calculateRuleCacheSize());}
      return rows;
    } finally {
      if(epoch===worldSyncEpoch.current)setIsSyncingRules(false);
    }
  };

  const syncRuleWorldRowsFromLocal = () => {
    setRuleWorldRows((prev) => prev.map((row) => ({...row,...buildRuleWorldRow(row.worldId, { formalVersion: row.remoteVersion, releaseId: row.remoteReleaseId ?? '',publicationVersion:row.publicationVersion,bindingRevision:row.bindingRevision }, row.remoteOk)})));
    setRuleCacheSize(calculateRuleCacheSize());
  };

  // 检查 PWA 状态
  useEffect(() => {
    // 检查是否已安装（standalone 模式）
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // 检查 Service Worker 状态
    const checkSW = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        setPwaStatus(prev => ({
          ...prev,
          swActive: !!registration?.active,
        }));
      }
    };
    checkSW();

    setPwaStatus(prev => ({
      ...prev,
      isInstalled,
    }));

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPwaStatus(prev => ({
        ...prev,
        canInstall: true,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 监听安装完成
    window.addEventListener('appinstalled', () => {
      setPwaStatus(prev => ({
        ...prev,
        isInstalled: true,
        canInstall: false,
      }));
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (ruleWorldRows.length === 0) return;
    syncRuleWorldRowsFromLocal();
  }, [datasets]);

  // 格式化文件大小
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // 格式化时间
  const formatDate = (timestamp: number | null): string => {
    if (!timestamp) return '从未';
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRuleRowStatus = (row: RuleWorldRow): { text: string; className: string; icon: 'ok' | 'warn' | 'none' } => {
    if(row.publicationState==='unpublished')return {text:'尚未发布',className:'text-gray-600',icon:'none'};
    if(row.publicationState==='disabled')return {text:'未启用',className:'text-gray-600',icon:'none'};
    if (!row.remoteOk) return { text: '远端读取失败', className: 'text-orange-600', icon: 'warn' };
    if (!row.localReleaseId) return { text: row.isLoaded ? '仅内存已加载' : '未缓存', className: 'text-gray-600', icon: 'none' };
    if (row.localReleaseId === row.remoteReleaseId && row.localVersion === row.remoteVersion && (row.bindingRevision===undefined||row.bindingRevision===row.localBindingRevision)) return { text: '已缓存', className: 'text-green-600', icon: 'ok' };
    return { text: '缓存待刷新', className: 'text-orange-600', icon: 'warn' };
  };

  // 刷新当前主数据（Rules）
  const handleRefreshRules = async () => {
    if (rulesRefreshBlocked) return;
    setIsRefreshingRules(true);
    setRulesRefreshProgress('正在读取云端版本…');
    try {
      const remoteRows = await syncRuleWorldRows();
      const cachedWorldIds = RULE_WORLDS
        .map((world) => world.id)
        .filter((worldId) => !!readRuleWorldMeta(worldId));
      const loadedWorldIds = Object.keys(datasets);
      const outOfDateWorldIds = remoteRows
        .filter((row) => row.remoteOk && (row.remoteReleaseId !== row.localReleaseId||row.remoteVersion!==row.localVersion||row.bindingRevision!==row.localBindingRevision))
        .map((row) => row.worldId);
      const targetWorldIds = Array.from(new Set([...cachedWorldIds, ...loadedWorldIds, ...outOfDateWorldIds])).filter(id=>remoteRows.some(row=>row.worldId===id&&row.remoteOk));

      for (const [index, worldId] of targetWorldIds.entries()) {
        const worldName = RULE_WORLDS.find((world) => world.id === worldId)?.name ?? worldId;
        setRulesRefreshProgress(`正在同步 ${worldName}（${index + 1}/${targetWorldIds.length}）…`);
        await refreshWorlds([worldId]);
        syncRuleWorldRowsFromLocal();
      }
      setRulesRefreshProgress('正在核验本地与云端版本…');
      await syncRuleWorldRows();
    } finally {
      setIsRefreshingRules(false);
      setRulesRefreshProgress(null);
    }
  };

  // 清除当前主数据缓存（Rules）
  const handleClearRuleCache = async () => {
    if (!confirm('确定要清除当前世界数据缓存吗？已加载到内存的数据会在后续按需重新缓存。')) return;
    if(dataSource.worldId)removeRuleWorldCachesForSource(dataSource.worldId,dataSource);
    await syncRuleWorldRows();
  };

  // 安装 PWA
  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setPwaStatus(prev => ({
          ...prev,
          isInstalled: true,
          canInstall: false,
        }));
      }
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <AppCard className="w-80 max-h-[80vh] overflow-hidden flex flex-col">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <h2 className="font-bold text-gray-800">设置</h2>
        <AppButton
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <X className="w-5 h-5 text-gray-500" />
        </AppButton>
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {reviewAuth ? (
          <ReviewAuthSettingsSection
            auth={reviewAuth}
            title={reviewAuthTitle}
            loginLabel={reviewAuthLoginLabel}
            onSessionChange={setVersionSession}
          />
        ) : null}
        {/* 世界数据版本 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Database className="w-4 h-4" />
            <span>世界数据版本</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 space-y-3 text-sm">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>缓存大小</span>
              <span>{formatSize(ruleCacheSize)}</span>
            </div>

            {isSyncingRules && ruleWorldRows.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>正在读取世界版本…</span>
              </div>
            ) : (
              <div className="space-y-2">
                {ruleWorldRows.map((row) => {
                  const status = getRuleRowStatus(row);
                  return (
                    <div key={row.worldId} className="rounded-md border border-gray-200 bg-white px-3 py-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{row.name}</span>
                        <span className={`flex items-center gap-1 text-xs ${status.className}`}>
                          {status.icon === 'ok' ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                          {status.icon === 'warn' ? <AlertCircle className="w-3.5 h-3.5" /> : null}
                          {status.text}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600">
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-500">远端版本</span>
                          <span className="truncate text-gray-700" title={`正式版本：${row.remoteVersion}\n技术 ID：${row.remoteReleaseId ?? '—'}`}>
                            {compactFormalVersion(row.remoteVersion)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-500">本地版本</span>
                          <span className="truncate text-gray-700" title={`正式版本：${row.localVersion ?? '未分配'}\n技术 ID：${row.localReleaseId ?? '—'}`}>
                            {compactFormalVersion(row.localVersion)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2 col-span-2">
                          <span className="text-gray-500">缓存时间</span>
                          <span className="text-gray-700">{formatDate(row.cachedAt)}</span>
                        </div>
                        <div className="flex justify-between gap-2 col-span-2">
                          <span className="text-gray-500">Features</span>
                          <span className="text-gray-700">{row.featureCount ?? '—'}{row.isLoaded ? '（已加载）' : ''}</span>
                        </div>
                      </div>
                      {row.errorMessage?<p className="text-xs text-orange-700 break-words [overflow-wrap:anywhere]">{row.errorMessage}</p>:null}
                      {row.remoteReleaseId||row.localReleaseId?<details className="text-[11px] text-gray-500 break-words [overflow-wrap:anywhere]"><summary>数据发布身份</summary><p>远端技术数据 ID：{row.remoteReleaseId||'—'}</p><p>本地技术数据 ID：{row.localReleaseId||'—'}</p>{row.publicationVersion?<p>发布批次：{row.publicationVersion} · 绑定修订：{row.bindingRevision??'—'}</p>:null}<WorldVersionControl worldId={row.worldId} name={row.name} canManage={versionSession.status==='authenticated'&&Boolean(versionSession.roles?.some(role=>role==='maintainer'||role==='admin'))} onChanged={async()=>{await useRuleDataStore.getState().ensureWorldLoaded(row.worldId);await syncRuleWorldRows();}}/></details>:null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DataSourceSelectionSection
            sources={dataSourceController.getSources()}
            policy={dataSourcePolicy}
            draftSourceId={dataSourceDraft}
            appliedSourceId={dataSource.sourceId}
            isApplying={dataSourceApplying}
            status={dataSourceStatus??(retiredSourceNotice(dataSource.worldId)?{tone:'info',text:retiredSourceNotice(dataSource.worldId)}:null)}
            onDraftSourceIdChange={setDataSourceDraft}
            onApply={() => { void handleApplyDataSource(); }}
            title="运行数据读取来源"
            applyLabel="应用"
            appliedLabel="当前已应用"
            defaultSuffix="（默认）"
            hint="切换后会清除仅依赖当前运行数据源的缓存，并重新读取当前世界；读取失败不会自动改用其他来源。"
            renderSupplemental={(context) => {
              const isGithubCandidate = isFormalGithubTransportSource(context.draftSource?.id,dataSource.worldId);
              const isGithubApplied = context.appliedSource?.id === context.draftSource?.id
                && isFormalGithubTransportSource(context.appliedSource?.id,dataSource.worldId);
              if (!isGithubCandidate) return null;
              return (
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-3 space-y-2">
                  <div className="text-xs font-semibold text-gray-700">源数据仓库链接模式</div>
                  <div className="flex items-center gap-2">
                    <select
                      className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 disabled:bg-gray-100 disabled:text-gray-500"
                      value={sourceLinkModeDraft}
                      disabled={!isGithubApplied || context.isApplying}
                      onChange={(event) => setSourceLinkModeDraft(event.target.value)}
                      onMouseDownCapture={(event) => event.stopPropagation()}
                      onPointerDownCapture={(event) => event.stopPropagation()}
                      onTouchStartCapture={(event) => event.stopPropagation()}
                    >
                      {sourceLinkModeDefs.map((mode) => (
                        <option key={mode.id} value={mode.id}>
                          {mode.label}{mode.id === getDefaultSourceLinkModeId() ? '（默认）' : ''}
                        </option>
                      ))}
                    </select>
                    <AppButton
                      onClick={() => { void handleApplySourceLinkMode(); }}
                      disabled={!isGithubApplied || context.isApplying}
                      className="shrink-0 rounded bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      应用
                    </AppButton>
                  </div>
                  <div className="text-[11px] leading-relaxed text-gray-500">
                    {isGithubApplied
                      ? `当前已应用：${sourceLinkModeDefs.find((mode) => mode.id === sourceLinkModeApplied)?.label ?? sourceLinkModeApplied}。应用后会清空运行数据缓存、刷新并重新尝试当前世界；失败不会自动切换来源。`
                      : '请先应用 GitHub 镜像作为运行数据读取来源，再选择链接模式。'}
                  </div>
                  {sourceLinkModeStatus ? <div className="text-[11px] text-green-600">{sourceLinkModeStatus}</div> : null}
                </div>
              );
            }}
          />

          <div className="flex gap-2"><AppButton disabled={comparisonBusy} onClick={()=>{setComparisonOpen(true);void handleCompareSources();}} className="rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 disabled:opacity-50">{comparisonBusy?'正在比较…':'比较权威来源和镜像'}</AppButton></div>
          <ConfigDialog open={comparisonOpen} title="权威来源和镜像对比" onClose={()=>setComparisonOpen(false)}><p role="status">{comparisonBusy?'正在读取并比较来源版本…':comparisonError||sourceComparison?.text||'尚未获得比较结果。'}</p></ConfigDialog>

          <div className="flex gap-2">
            <AppButton
              onClick={handleRefreshRules}
              disabled={rulesRefreshBlocked}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm rounded-lg transition-colors"
            >
              {isRefreshingRules ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>刷新数据</span>
            </AppButton>

            <AppButton
              onClick={handleClearRuleCache}
              disabled={rulesRefreshBlocked}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 text-sm rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>清除缓存</span>
            </AppButton>
          </div>
          {rulesRefreshProgress ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800" role="status" aria-live="polite">
              <div className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" />{rulesRefreshProgress}</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded bg-blue-100"><div className="h-full w-2/3 animate-pulse rounded bg-blue-500" /></div>
            </div>
          ) : null}
        </div>

        {/* PWA 状态 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Smartphone className="w-4 h-4" />
            <span>PWA 状态</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">安装状态</span>
              <span className={`flex items-center gap-1 ${pwaStatus.isInstalled ? 'text-green-600' : 'text-gray-600'}`}>
                {pwaStatus.isInstalled ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    已安装
                  </>
                ) : (
                  '未安装'
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Service Worker</span>
              <span className={`flex items-center gap-1 ${pwaStatus.swActive ? 'text-green-600' : 'text-gray-600'}`}>
                {pwaStatus.swActive ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    活跃
                  </>
                ) : (
                  '未激活'
                )}
              </span>
            </div>
          </div>

          {/* 安装按钮 - 仅在可安装且未安装时显示 */}
          {pwaStatus.canInstall && !pwaStatus.isInstalled && (
            <AppButton
              onClick={handleInstallPWA}
              disabled={isInstalling}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm rounded-lg transition-colors"
            >
              {isInstalling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>安装到桌面</span>
            </AppButton>
          )}
        </div>


        {/* 配置编辑入口 */}
        {onOpenConfigStudio ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <SlidersHorizontal className="w-4 h-4" />
              <span>配置文件工作台</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 space-y-2 text-sm text-blue-900">
              <p>本地可视化编辑分类、字段、渲染规则、交互基线与通用包含关系。</p>
              <p className="text-xs">主地图使用正式发布配置。工作台保存本地编辑版本，实验室用于试运行；正式发布需通过全局核验和维护者身份确认。</p>
              {compatibility.length?<details className="text-xs"><summary>{compatibility.length} 条历史记录的分类未包含在当前配置中</summary><p>这些记录暂不进入显示、搜索和引用池，原始数据保留。补充合法分类并发布后可重新读取。</p>{compatibility.map((item,index)=><p className="break-all" key={index}>{item.id} · {Object.values(item.path).join('/')}</p>)}</details>:null}
            </div>
            <AppButton
              onClick={onOpenConfigStudio}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>打开配置文件工作台</span>
            </AppButton>
            {onOpenConfigLab ? <AppButton
              onClick={onOpenConfigLab}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>打开配置运行实验室</span>
            </AppButton> : null}
            <AppButton onClick={() => window.location.assign('/legacy-v1/')} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm rounded-lg">
              <SlidersHorizontal className="w-4 h-4" /><span>旧渲染规则入口</span>
            </AppButton>
          </div>
        ) : null}

        {formal?<div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-900 space-y-1 break-words [overflow-wrap:anywhere]">
          <p className="font-semibold">正式配置身份</p>
          <p>{formal.packageId} · 契约c{formal.contractRevision} / 修订r{formal.revision}</p>
          <p>{formal.releaseId}</p>
          <details><summary>配置摘要</summary><p>{formal.configSha256}</p></details>
          <p>本地工作台草稿与试运行版本独立保存，不作为主地图正式配置。</p>
        </div>:null}
        {/* 关于 */}
        <div className="text-xs text-gray-400 text-center pt-2">
          <p>主地图使用正式配置及当前正式数据发布。</p>
          <p>旧渲染规则通过独立的 V1 兼容分包进入。</p>
        </div>
      </div>
    </AppCard>
  );
}

export default SettingsPanel;
