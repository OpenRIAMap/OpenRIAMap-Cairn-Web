import { useEffect, useState, useSyncExternalStore } from 'react';
import MapContainer from '../components/Map/MapContainer';
import PWAInstallPrompt from '../components/PWAInstallPrompt/PWAInstallPrompt';
import { getFormalConfiguration, subscribeFormalConfiguration, loadFormalConfiguration } from './formalConfiguration';

export default function FormalConfigurationHost() {
  const value = useSyncExternalStore(subscribeFormalConfiguration, getFormalConfiguration);
  const [error, setError] = useState('');
  useEffect(() => {
    let live = true;
    void loadFormalConfiguration().catch(error => { if (live) setError(String(error)); });
    return () => { live = false; };
  }, []);
  if (!value) return <main className="relative h-screen bg-[#1a1a2e]" aria-label="地图加载中"><div role={error ? 'alert' : 'status'} className="absolute left-4 top-4 max-w-sm rounded-2xl border bg-white/95 p-4 text-sm shadow">{error || '正在加载数据…'}{error && <button className="ml-3 rounded border px-3 py-1" onClick={() => location.reload()}>重新加载</button>}</div></main>;
  return <><MapContainer configRuntime={value.config} /><PWAInstallPrompt />{value.warning && <div role="status" className="fixed bottom-3 left-1/2 z-[14000] max-w-lg -translate-x-1/2 rounded border bg-white p-3 text-sm shadow">{value.warning}{value.availableIdentity && <button className="ml-2 rounded border px-2 py-1" onClick={() => { const url = new URL(location.href); url.searchParams.set('refreshConfiguration','1'); location.assign(url); }}>刷新更新</button>}</div>}</>;
}
