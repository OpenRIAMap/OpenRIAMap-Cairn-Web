import type { DataSourceSelectionStorage } from './contracts';

export function createBrowserDataSourceSelectionStorage(): DataSourceSelectionStorage {
  // A lab frame may explore sources without changing the main page's selection.
  const isolated = typeof window!=='undefined' && new URLSearchParams(window.location?.search??'').get('workspace')==='config-lab-frame';
  const local = new Map<string,string>();
  return {
    read: (storageKey) => isolated ? local.get(storageKey) ?? null : window.localStorage.getItem(storageKey),
    write: (storageKey, value) => isolated ? void local.set(storageKey, value) : window.localStorage.setItem(storageKey, value),
  };
}
