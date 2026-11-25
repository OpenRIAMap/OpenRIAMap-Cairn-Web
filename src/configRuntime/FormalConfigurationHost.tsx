import {useLoadingStore} from '../store/loadingStore';
import { useEffect, useSyncExternalStore } from 'react';
import MapContainer from '../components/Map/MapContainer';
import PWAInstallPrompt from '../components/PWAInstallPrompt/PWAInstallPrompt';
import { getFormalConfiguration, subscribeFormalConfiguration, loadFormalConfiguration } from './formalConfiguration';

export default function FormalConfigurationHost() {
  const value = useSyncExternalStore(subscribeFormalConfiguration, getFormalConfiguration);
  const initialized=useLoadingStore(s=>s.initialized);
  useEffect(() => {
    void loadFormalConfiguration().catch(()=>undefined);
  }, []);
  if (!value) return <main className="h-screen" style={{background:'var(--cm-page-bg,#f5f5f5)'}} aria-label="地图加载中"/>;
  return <><MapContainer configRuntime={value.config} />{initialized?<PWAInstallPrompt />:null}{value.warning && <div role="status" className="fixed bottom-3 left-1/2 z-[14000] max-w-lg -translate-x-1/2 rounded border bg-white p-3 text-sm shadow">{value.warning}{value.availableIdentity && <button className="ml-2 rounded border px-2 py-1" onClick={() => { const url = new URL(location.href); url.searchParams.set('refreshConfiguration','1'); location.assign(url); }}>刷新更新</button>}</div>}</>;
}
