import { useEffect, useState } from 'react';
import MapContainer from '../components/Map/MapContainer';
import PWAInstallPrompt from '../components/PWAInstallPrompt/PWAInstallPrompt';
import { checkForFormalUpdate, loadFormalConfiguration, type FormalConfiguration } from './formalConfiguration';

export default function FormalConfigurationHost() {
  const [value, setValue] = useState<FormalConfiguration>();
  const [error, setError] = useState(''), [update, setUpdate] = useState(false);
  useEffect(() => {
    let live = true;
    void loadFormalConfiguration().then(value => { if (live) setValue(value); }).catch(error => { if (live) setError(String(error)); });
    const check = () => { void checkForFormalUpdate().then(next => { if (live && next) setUpdate(true); }).catch(() => {}); };
    const timer = window.setInterval(check, 120000); window.addEventListener('focus', check);
    return () => { live = false; clearInterval(timer); window.removeEventListener('focus', check); };
  }, []);
  if (!value) return <main className="flex h-screen items-center justify-center bg-slate-100"><div role={error ? 'alert' : 'status'} className="rounded border bg-white p-5">{error || '正在核验正式配置…'}{error && <button className="ml-3 rounded border px-3 py-1" onClick={() => location.reload()}>重新加载</button>}</div></main>;
  return <><MapContainer configRuntime={value.config} /><PWAInstallPrompt />{(update || value.warning) && <div role="status" className="fixed bottom-3 left-1/2 z-[14000] max-w-lg -translate-x-1/2 rounded border bg-white p-3 text-sm shadow">{update ? '新的正式配置已发布；本次会话继续使用原版本。完成当前操作后刷新以更新。' : value.warning}</div>}</>;
}
