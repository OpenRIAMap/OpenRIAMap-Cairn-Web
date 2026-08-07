import { create } from 'zustand';
import {
  createDataSourceSelectionFailure,
  type DataSourceSelectionContext,
  type DataSourceSelectionFailure,
} from '@/core/dataSourceSelection';
import { useLoadingStore } from '@/store/loadingStore';
import { abortActiveRuleDatasetRequests, loadWorldRuleDataset } from '@/components/Rules/data/worldRuleDatasetLoader';
import { FormalReleaseReaderError } from '@/components/Rules/data/formalReleaseReader';
import {
  getRuleDataSourceSelectionController,
  getRuleDataSourceSnapshot,
  type RuleDataSourceSnapshot,
} from '@/components/Rules/data/formalDataSourceRuntime';
import { clearAllRuleWorldCaches } from '@/components/Rules/data/worldRuleCache';
import { loadMapSettings } from '@/lib/cookies';
import type { RuleWorldDataset } from '@/components/Rules/data/sourceTypes';
import type { LoadingProgress } from '@/lib/fetchWithMirror';

interface RuleDataState {
  datasets: Record<string, RuleWorldDataset>;
  loadingWorld: string | null;
  pending: Record<string, Promise<RuleWorldDataset> | undefined>;
  pendingGeneration: Record<string, number | undefined>;
  dataSource: RuleDataSourceSnapshot;
  dataSourceApplying: boolean;
  dataSourceFailure: DataSourceSelectionFailure | null;
  ensureWorldLoaded: (worldId: string) => Promise<RuleWorldDataset>;
  refreshWorlds: (worldIds: string[]) => Promise<void>;
  applyDataSource: (sourceId: string, context: DataSourceSelectionContext) => Promise<void>;
  clearDataSourceFailure: () => void;
}

const WORLD_LOADING_STAGES = [
  { name: 'world-version', label: '正在检查世界版本' },
  { name: 'world-cache-check', label: '正在检查缓存' },
  { name: 'world-index-scan', label: '正在扫描数据目录' },
  { name: 'world-chunk-load', label: '正在读取区块数据' },
  { name: 'world-cache-write', label: '正在更新缓存' },
  { name: 'world-ready', label: '当前世界数据已就绪' },
  { name: 'world-record-build', label: '正在构建要素记录' },
  { name: 'world-filter-apply', label: '正在应用渲染筛选' },
  { name: 'world-layer-render', label: '正在生成地图图层' },
  { name: 'world-first-paint', label: '正在等待首帧显示' },
];

function currentWorldId(): string {
  return String(loadMapSettings()?.currentWorld ?? '').trim() || 'zth';
}

function isCurrentSource(source: RuleDataSourceSnapshot): boolean {
  const active = getRuleDataSourceSnapshot();
  return active.sourceId === source.sourceId && active.generation === source.generation;
}

function toDataSourceFailure(error: unknown, source: RuleDataSourceSnapshot, worldId: string): DataSourceSelectionFailure {
  const stage = error instanceof FormalReleaseReaderError ? error.stage : 'network';
  const message = error instanceof Error ? error.message : String(error);
  return createDataSourceSelectionFailure({
    sourceId: source.sourceId,
    stage,
    message,
    retryAllowed: true,
    worldId,
  });
}

export const useRuleDataStore = create<RuleDataState>((set, get) => ({
  datasets: {},
  loadingWorld: null,
  pending: {},
  pendingGeneration: {},
  dataSource: getRuleDataSourceSnapshot(),
  dataSourceApplying: false,
  dataSourceFailure: null,
  ensureWorldLoaded: async (worldId: string) => {
    const source = getRuleDataSourceSnapshot();
    const pending = get().pending[worldId];
    if (pending && get().pendingGeneration[worldId] === source.generation) return pending;

    const ruleFlowId = `rule-world:${worldId}`;
    const { startLoading, updateStage, finishLoadingByFlow } = useLoadingStore.getState();
    startLoading(WORLD_LOADING_STAGES, { flowId: ruleFlowId, ruleWorldId: worldId });
    const onProgress = (progress: LoadingProgress) => updateStage(progress.stage, progress.status, progress.message);

    const promise = loadWorldRuleDataset(worldId, onProgress, source)
      .then((dataset) => {
        if (!isCurrentSource(source)) return dataset;
        set((state) => ({
          datasets: { ...state.datasets, [worldId]: dataset },
          loadingWorld: state.loadingWorld === worldId ? null : state.loadingWorld,
          pending: { ...state.pending, [worldId]: undefined },
          pendingGeneration: { ...state.pendingGeneration, [worldId]: undefined },
          dataSource: source,
          dataSourceFailure: null,
        }));
        updateStage('world-ready', 'success', '等待地图首帧显示');
        return dataset;
      })
      .catch((error) => {
        const failure = toDataSourceFailure(error, source, worldId);
        set((state) => {
          const shouldClearPending = state.pendingGeneration[worldId] === source.generation;
          return {
            loadingWorld: shouldClearPending && state.loadingWorld === worldId ? null : state.loadingWorld,
            pending: shouldClearPending ? { ...state.pending, [worldId]: undefined } : state.pending,
            pendingGeneration: shouldClearPending ? { ...state.pendingGeneration, [worldId]: undefined } : state.pendingGeneration,
            ...(isCurrentSource(source) ? { dataSource: source, dataSourceFailure: failure } : {}),
          };
        });
        updateStage('world-ready', 'error', failure.message);
        setTimeout(() => finishLoadingByFlow(ruleFlowId), 300);
        throw error;
      });

    set((state) => ({
      loadingWorld: worldId,
      pending: { ...state.pending, [worldId]: promise },
      pendingGeneration: { ...state.pendingGeneration, [worldId]: source.generation },
      dataSource: source,
    }));
    return promise;
  },
  refreshWorlds: async (worldIds: string[]) => {
    const ids = Array.from(new Set((worldIds ?? []).map((id) => String(id ?? '').trim()).filter(Boolean)));
    if (ids.length === 0) return;

    const source = getRuleDataSourceSnapshot();
    const currentWorld = currentWorldId();
    const activeWorldId = ids.includes(currentWorld) ? currentWorld : null;
    const orderedIds = activeWorldId ? [activeWorldId, ...ids.filter((id) => id !== activeWorldId)] : ids;

    const loading = useLoadingStore.getState();
    const activeFlowId = activeWorldId ? `rule-refresh:${activeWorldId}:${Date.now()}` : null;

    if (activeWorldId) {
      loading.startLoading(WORLD_LOADING_STAGES, { flowId: activeFlowId, ruleWorldId: activeWorldId });
      loading.updateStage('world-version', 'success', '正在刷新当前世界数据');
    }

    for (const worldId of orderedIds) {
      const onProgress = worldId === activeWorldId
        ? (progress: LoadingProgress) => {
            const state = useLoadingStore.getState();
            if (!state.isLoading || state.activeFlowId !== activeFlowId || state.activeRuleWorldId !== activeWorldId) return;
            state.updateStage(progress.stage, progress.status, progress.message);
          }
        : undefined;

      try {
        const dataset = await loadWorldRuleDataset(worldId, onProgress, source);
        if (!isCurrentSource(source)) return;
        set((state) => ({
          datasets: { ...state.datasets, [worldId]: dataset },
          pending: { ...state.pending, [worldId]: undefined },
          pendingGeneration: { ...state.pendingGeneration, [worldId]: undefined },
          loadingWorld: state.loadingWorld === worldId ? null : state.loadingWorld,
          dataSource: source,
          dataSourceFailure: null,
        }));
        if (worldId === activeWorldId) {
          const state = useLoadingStore.getState();
          if (state.isLoading && state.activeFlowId === activeFlowId && state.activeRuleWorldId === activeWorldId) {
            state.updateStage('world-ready', 'success', '等待地图首帧显示');
          }
        }
      } catch (error) {
        const failure = toDataSourceFailure(error, source, worldId);
        if (isCurrentSource(source)) set({ dataSource: source, dataSourceFailure: failure });
        if (worldId === activeWorldId) {
          const state = useLoadingStore.getState();
          if (state.isLoading && state.activeFlowId === activeFlowId && state.activeRuleWorldId === activeWorldId) {
            state.updateStage('world-ready', 'error', failure.message);
            setTimeout(() => {
              const latest = useLoadingStore.getState();
              if (latest.isLoading && latest.activeFlowId === activeFlowId && latest.activeRuleWorldId === activeWorldId) {
                latest.finishLoadingByFlow(activeFlowId);
              }
            }, 300);
          }
        }
        throw error;
      }
    }
  },
  applyDataSource: async (sourceId, context) => {
    set({ dataSourceApplying: true, dataSourceFailure: null });
    const controller = getRuleDataSourceSelectionController();
    try {
      await controller.apply(sourceId, context, {
        abortStaleLoads: () => abortActiveRuleDatasetRequests(),
        clearSourceDependentCache: () => clearAllRuleWorldCaches(),
        clearInMemoryDatasets: () => {
          const source = getRuleDataSourceSnapshot();
          set({
            datasets: {},
            pending: {},
            pendingGeneration: {},
            loadingWorld: null,
            dataSource: source,
            dataSourceFailure: null,
          });
        },
        reloadCurrentWorld: async () => {
          await get().ensureWorldLoaded(currentWorldId());
        },
      });
      set({ dataSource: getRuleDataSourceSnapshot(), dataSourceApplying: false, dataSourceFailure: null });
    } catch (error) {
      const source = getRuleDataSourceSnapshot();
      set({
        dataSource: source,
        dataSourceApplying: false,
        dataSourceFailure: toDataSourceFailure(error, source, currentWorldId()),
      });
      throw error;
    }
  },
  clearDataSourceFailure: () => set({ dataSourceFailure: null }),
}));
