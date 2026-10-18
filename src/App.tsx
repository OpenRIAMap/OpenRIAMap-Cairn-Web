import { lazy, Suspense, useEffect } from 'react';
import FormalConfigurationHost from './configRuntime/FormalConfigurationHost';
import FeatureModuleLoadDialog from './components/Common/FeatureModuleLoadDialog'
import FeatureModuleLoadingOverlay from './components/Common/FeatureModuleLoadingOverlay'
import DataSourceRecoveryHost from './components/Settings/DataSourceRecoveryHost'
import { useFeatureModuleStore, type FeatureModuleKey } from './store/featureModuleStore';

const ConfigurationEntry = lazy(() => import('./entrypoints/configurationEntry'));
function closeWorkspace() {
  const params = new URLSearchParams(location.search);
  const back = params.get('workspace') === 'config-studio' ? sessionStorage.getItem('cairnmap-config-studio-return') : null;
  if (back) { sessionStorage.removeItem('cairnmap-config-studio-return'); location.assign(back); return; }
  location.assign('/');
}
function AdmittedWorkspace({ workspace, moduleKey }: { workspace: string; moduleKey: FeatureModuleKey }) {
  const hydrated = useFeatureModuleStore(state => state.hydrated);
  const state = useFeatureModuleStore(state => state.modules[moduleKey]);
  useEffect(() => { if (hydrated) useFeatureModuleStore.getState().requestModuleActivation(moduleKey); }, [hydrated, moduleKey]);
  useEffect(() => { if (state.status === 'loaded' && moduleKey === 'legacy-v1') location.replace('/legacy-v1/runtime/index.html'); }, [state.status, moduleKey]);
  if (state.status !== 'loaded' || moduleKey === 'legacy-v1') return <main className="flex h-screen items-center justify-center bg-slate-100"><div className="space-y-3 rounded border bg-white p-6"><p>此页面需要加载{moduleKey === 'configuration' ? '配置编辑分包' : 'V1 兼容分包'}。</p><button className="rounded border px-3 py-2" onClick={() => useFeatureModuleStore.getState().requestModuleActivation(moduleKey)}>加载分包</button><button className="ml-3 rounded border px-3 py-2" onClick={closeWorkspace}>返回主地图</button></div></main>;
  return <Suspense fallback={<p role="status">正在打开配置编辑器…</p>}><ConfigurationEntry workspace={workspace} onClose={closeWorkspace} /></Suspense>;
}

function App() {
  const hydrateFeatureModules = useFeatureModuleStore((state) => state.hydrate)

  useEffect(() => {
    hydrateFeatureModules()
  }, [hydrateFeatureModules])

  const params = new URLSearchParams(window.location.search);
  const workspace = params.get('workspace');
  const legacy = location.pathname === '/legacy-v1/' || workspace === 'config-lab' && params.get('configMode') === 'v1';
  const isConfigStudio = workspace === 'config-studio'
  const isConfigLab = workspace === 'config-lab'
  const isWorkflowStudio = workspace === 'config-workflow'
  const entryModule=legacy?'legacy-v1':isConfigStudio||isConfigLab||isWorkflowStudio?'configuration':undefined;

  const workspaceContent = legacy ? <AdmittedWorkspace workspace="legacy-v1" moduleKey="legacy-v1" /> : isConfigStudio || isConfigLab || isWorkflowStudio ? <AdmittedWorkspace workspace={workspace!} moduleKey="configuration" /> : <FormalConfigurationHost />;

  return (
    <div className="app-root h-screen w-screen">
      {workspaceContent}
      <FeatureModuleLoadDialog onCancel={moduleKey=>{if(moduleKey===entryModule)closeWorkspace();}} />
      <FeatureModuleLoadingOverlay />
      <DataSourceRecoveryHost />
    </div>
  )
}

export default App
