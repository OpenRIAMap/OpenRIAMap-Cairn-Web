import { create } from 'zustand';

/** `measuring` remains the stable persisted key for the mapping base bundle. */
export type FeatureModuleKey = 'measuring' | 'review' | 'legacy';
export type FeatureModuleStatus = 'idle' | 'loading' | 'loaded' | 'error';

type FeatureModuleRuntime = {
  status: FeatureModuleStatus;
  enabledByUser: boolean;
  lastLoadedVersion: string | null;
  error: string | null;
};

type FeatureModuleDialogState = {
  isOpen: boolean;
  moduleKey: FeatureModuleKey | null;
  title: string;
  description: string;
  loading: boolean;
  error: string | null;
};

type FeatureModuleLoadingOverlayState = {
  isOpen: boolean;
  moduleKey: FeatureModuleKey | null;
};

type FeatureModuleLoadOptions = {
  title?: string;
  description?: string;
};

export type PersistedFeatureModuleState = {
  appVersion: string | null;
  modules: Record<FeatureModuleKey, { enabledByUser: boolean; lastLoadedVersion: string | null }>;
};

interface FeatureModuleState {
  appVersion: string;
  hydrated: boolean;
  modules: Record<FeatureModuleKey, FeatureModuleRuntime>;
  dialog: FeatureModuleDialogState;
  loadingOverlay: FeatureModuleLoadingOverlayState;
  hydrate: () => void;
  requestModuleActivation: (moduleKey: FeatureModuleKey, options?: FeatureModuleLoadOptions) => void;
  dismissDialog: () => void;
  confirmDialogAndLoad: () => Promise<void>;
  ensureModuleLoaded: (moduleKey: FeatureModuleKey) => Promise<void>;
  resetModuleError: (moduleKey: FeatureModuleKey) => void;
}

const STORAGE_KEY = 'ria_feature_modules_v1';
const CURRENT_APP_VERSION = typeof __APP_VERSION__ === 'string' && __APP_VERSION__.trim() ? __APP_VERSION__.trim() : 'dev';

export const FEATURE_MODULE_DEPENDENCIES: Record<FeatureModuleKey, readonly FeatureModuleKey[]> = {
  measuring: [],
  review: ['measuring'],
  legacy: [],
};

const DEFAULT_TITLES: Record<FeatureModuleKey, string> = {
  measuring: '需要启用测绘扩展模块',
  review: '需要下载审核与测绘分包',
  legacy: '需要启用旧图层扩展模块',
};

const DEFAULT_DESCRIPTIONS: Record<FeatureModuleKey, string> = {
  measuring:
    '该功能属于按需加载的扩展模块。本次确认仅用于启用该模块；在当前浏览器缓存条件和版本匹配的情况下，后续点击此入口将自动加载并进入功能，无需再次确认。',
  review:
    '审核工作区依赖测绘基础分包和审核分包。确认后将按“测绘 → 审核”顺序下载并启用；只会记录分包启用状态，不会保存审核包、图片、图层或草稿。',
  legacy:
    '该功能属于按需加载的扩展模块。本次确认仅用于启用该模块；在当前浏览器缓存条件和版本匹配的情况下，后续点击此入口将自动加载并进入功能，无需再次确认。',
};

const makeDefaultModuleState = (): Record<FeatureModuleKey, FeatureModuleRuntime> => ({
  measuring: { status: 'idle', enabledByUser: false, lastLoadedVersion: null, error: null },
  review: { status: 'idle', enabledByUser: false, lastLoadedVersion: null, error: null },
  legacy: { status: 'idle', enabledByUser: false, lastLoadedVersion: null, error: null },
});

const defaultDialogState = (): FeatureModuleDialogState => ({
  isOpen: false,
  moduleKey: null,
  title: '',
  description: '',
  loading: false,
  error: null,
});

const defaultLoadingOverlayState = (): FeatureModuleLoadingOverlayState => ({
  isOpen: false,
  moduleKey: null,
});

const loaders: Record<FeatureModuleKey, () => Promise<unknown>> = {
  measuring: async () => {
    const mod = await import('@/entrypoints/measuringEntry');
    await mod.loadMeasuringModuleBundle();
  },
  review: async () => {
    // Keep the dependency rule at the module boundary so every review entry
    // follows the same safe `mapping -> review` loading sequence.
    for (const dependency of FEATURE_MODULE_DEPENDENCIES.review) {
      await useFeatureModuleStore.getState().ensureModuleLoaded(dependency);
    }
    // The dependency loader closes its own phase when mapping is ready.  Reopen
    // the same shared overlay for the final audit-bundle phase instead of
    // introducing a second loading surface.
    useFeatureModuleStore.setState({ loadingOverlay: { isOpen: true, moduleKey: 'review' } });
    const mod = await import('@/entrypoints/reviewEntry');
    await mod.loadReviewModuleBundle();
  },
  legacy: async () => {
    const mod = await import('@/entrypoints/legacyEntry');
    await mod.loadLegacyModuleBundle();
  },
};

const pendingLoads = new Map<FeatureModuleKey, Promise<void>>();

/**
 * Migrates older v1 values which did not have a `review` member.  This parser
 * never reads audit data; it is limited to code-bundle enablement markers.
 */
export function normalizePersistedFeatureModuleState(raw: string | null): PersistedFeatureModuleState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedFeatureModuleState>;
    return {
      appVersion: typeof parsed.appVersion === 'string' ? parsed.appVersion : null,
      modules: {
        measuring: {
          enabledByUser: !!parsed.modules?.measuring?.enabledByUser,
          lastLoadedVersion: typeof parsed.modules?.measuring?.lastLoadedVersion === 'string' ? parsed.modules?.measuring?.lastLoadedVersion : null,
        },
        review: {
          enabledByUser: !!parsed.modules?.review?.enabledByUser,
          lastLoadedVersion: typeof parsed.modules?.review?.lastLoadedVersion === 'string' ? parsed.modules?.review?.lastLoadedVersion : null,
        },
        legacy: {
          enabledByUser: !!parsed.modules?.legacy?.enabledByUser,
          lastLoadedVersion: typeof parsed.modules?.legacy?.lastLoadedVersion === 'string' ? parsed.modules?.legacy?.lastLoadedVersion : null,
        },
      },
    };
  } catch {
    return null;
  }
}

function readPersistedState(): PersistedFeatureModuleState | null {
  if (typeof window === 'undefined') return null;
  return normalizePersistedFeatureModuleState(window.localStorage.getItem(STORAGE_KEY));
}

function persistState(modules: Record<FeatureModuleKey, FeatureModuleRuntime>) {
  if (typeof window === 'undefined') return;
  const payload: PersistedFeatureModuleState = {
    appVersion: CURRENT_APP_VERSION,
    modules: {
      measuring: {
        enabledByUser: modules.measuring.enabledByUser,
        lastLoadedVersion: modules.measuring.lastLoadedVersion,
      },
      review: {
        enabledByUser: modules.review.enabledByUser,
        lastLoadedVersion: modules.review.lastLoadedVersion,
      },
      legacy: {
        enabledByUser: modules.legacy.enabledByUser,
        lastLoadedVersion: modules.legacy.lastLoadedVersion,
      },
    },
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore persistence failures
  }
}

export const useFeatureModuleStore = create<FeatureModuleState>((set, get) => ({
  appVersion: CURRENT_APP_VERSION,
  hydrated: false,
  modules: makeDefaultModuleState(),
  dialog: defaultDialogState(),
  loadingOverlay: defaultLoadingOverlayState(),

  hydrate: () => {
    if (get().hydrated) return;
    const nextModules = makeDefaultModuleState();
    const persisted = readPersistedState();
    const savedVersion = persisted?.appVersion ?? null;
    const versionMatches = savedVersion === CURRENT_APP_VERSION;

    (['measuring', 'review', 'legacy'] as FeatureModuleKey[]).forEach((moduleKey) => {
      const saved = persisted?.modules?.[moduleKey];
      if (!saved) return;
      nextModules[moduleKey].enabledByUser = saved.enabledByUser;
      nextModules[moduleKey].lastLoadedVersion = versionMatches ? saved.lastLoadedVersion : null;
    });

    set({ hydrated: true, modules: nextModules });
    persistState(nextModules);
  },

  requestModuleActivation: (moduleKey, options) => {
    const existing = get().modules[moduleKey];
    if (existing.enabledByUser) {
      void get().ensureModuleLoaded(moduleKey);
      return;
    }
    if (existing.lastLoadedVersion === CURRENT_APP_VERSION && existing.status === 'loaded') {
      return;
    }
    set({
      dialog: {
        isOpen: true,
        moduleKey,
        title: options?.title?.trim() || DEFAULT_TITLES[moduleKey],
        description: options?.description?.trim() || DEFAULT_DESCRIPTIONS[moduleKey],
        loading: false,
        error: null,
      },
    });
  },

  dismissDialog: () => {
    const dialog = get().dialog;
    if (dialog.loading) return;
    set({ dialog: defaultDialogState() });
  },

  confirmDialogAndLoad: async () => {
    const dialog = get().dialog;
    const moduleKey = dialog.moduleKey;
    if (!dialog.isOpen || !moduleKey) return;

    set((state) => ({
      modules: {
        ...state.modules,
        [moduleKey]: {
          ...state.modules[moduleKey],
          enabledByUser: true,
          error: null,
        },
      },
      dialog: defaultDialogState(),
    }));
    persistState(get().modules);

    try {
      await get().ensureModuleLoaded(moduleKey);
    } catch (err) {
      const message = String((err as Error)?.message ?? err ?? '扩展模块加载失败');
      set({
        dialog: {
          isOpen: true,
          moduleKey,
          title: DEFAULT_TITLES[moduleKey],
          description: DEFAULT_DESCRIPTIONS[moduleKey],
          loading: false,
          error: message,
        },
      });
    }
  },

  ensureModuleLoaded: async (moduleKey) => {
    const current = get().modules[moduleKey];
    if (current.status === 'loaded' && current.lastLoadedVersion === CURRENT_APP_VERSION) return;

    set({ loadingOverlay: { isOpen: true, moduleKey } });
    const existingPending = pendingLoads.get(moduleKey);
    if (existingPending) {
      try {
        await existingPending;
      } finally {
        set((state) => ({
          loadingOverlay:
            state.modules[moduleKey].status === 'loading'
              ? state.loadingOverlay
              : defaultLoadingOverlayState(),
        }));
      }
      return;
    }

    const promise = (async () => {
      set((state) => ({
        modules: {
          ...state.modules,
          [moduleKey]: {
            ...state.modules[moduleKey],
            status: 'loading',
            error: null,
          },
        },
      }));
      persistState(get().modules);

      try {
        await loaders[moduleKey]();
        set((state) => ({
          modules: {
            ...state.modules,
            [moduleKey]: {
              ...state.modules[moduleKey],
              status: 'loaded',
              enabledByUser: true,
              lastLoadedVersion: CURRENT_APP_VERSION,
              error: null,
            },
          },
        }));
        persistState(get().modules);
      } catch (err) {
        const message = String((err as Error)?.message ?? err ?? '扩展模块加载失败');
        set((state) => ({
          modules: {
            ...state.modules,
            [moduleKey]: {
              ...state.modules[moduleKey],
              status: 'error',
              error: message,
            },
          },
        }));
        persistState(get().modules);
        throw err;
      } finally {
        pendingLoads.delete(moduleKey);
        set({ loadingOverlay: defaultLoadingOverlayState() });
      }
    })();

    pendingLoads.set(moduleKey, promise);
    return promise;
  },

  resetModuleError: (moduleKey) => {
    set((state) => ({
      modules: {
        ...state.modules,
        [moduleKey]: {
          ...state.modules[moduleKey],
          status: state.modules[moduleKey].lastLoadedVersion === CURRENT_APP_VERSION ? 'loaded' : 'idle',
          error: null,
        },
      },
    }));
    persistState(get().modules);
  },
}));

export function getFeatureModuleStatus(moduleKey: FeatureModuleKey) {
  return useFeatureModuleStore.getState().modules[moduleKey];
}
