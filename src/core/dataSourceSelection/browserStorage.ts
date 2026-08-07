import type { DataSourceSelectionStorage } from './contracts';

export function createBrowserDataSourceSelectionStorage(): DataSourceSelectionStorage {
  return {
    read: (storageKey) => window.localStorage.getItem(storageKey),
    write: (storageKey, value) => window.localStorage.setItem(storageKey, value),
  };
}
