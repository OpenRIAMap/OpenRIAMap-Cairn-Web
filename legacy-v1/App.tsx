import MapContainer from './components/Map/MapContainer';
import FeatureModuleLoadDialog from './components/Common/FeatureModuleLoadDialog';
import FeatureModuleLoadingOverlay from './components/Common/FeatureModuleLoadingOverlay';
import DataSourceRecoveryHost from './components/Settings/DataSourceRecoveryHost';
import { useEffect } from 'react';
import { useFeatureModuleStore } from './store/featureModuleStore';

/** Separate document and frozen dependency graph: never boot the V3 provider. */
export default function App() {
  useEffect(() => { useFeatureModuleStore.getState().hydrate(); }, []);
  return <div className="app-root h-screen w-screen"><MapContainer />
    <a href="/" className="fixed bottom-2 left-1/2 z-[14000] -translate-x-1/2 rounded border bg-white px-3 py-1 text-xs shadow">V1 兼容 · 5b3e9c2 · 返回正式地图</a>
    <FeatureModuleLoadDialog /><FeatureModuleLoadingOverlay /><DataSourceRecoveryHost />
  </div>;
}
