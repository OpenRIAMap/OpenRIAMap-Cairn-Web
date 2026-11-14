import { useSyncExternalStore } from 'react';

export type ColorPreference = 'light' | 'dark' | 'system';
export type PanelLayout = 'cards' | 'floating' | 'compact';
type AppearancePreferences = { color: ColorPreference; layout: PanelLayout };

const storageKey = 'cairn-appearance-preferences';
const defaults: AppearancePreferences = { color: 'system', layout: 'cards' };
const listeners = new Set<() => void>();

function readPreferences(): AppearancePreferences {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const { color, layout } = JSON.parse(saved) ?? {};
      return {
        color: color === 'dark' || color === 'light' ? color : 'system',
        layout: layout === 'floating' || layout === 'compact' ? layout : 'cards',
      };
    }
    const preview = localStorage.getItem('cairn-panel-appearance');
    if (preview === 'editor') return { color: 'light', layout: 'compact' };
    if (preview === 'night' || preview === 'paper') return { color: preview === 'night' ? 'dark' : 'light', layout: 'cards' };
  } catch { /* Appearance preferences are optional when storage is unavailable. */ }
  return defaults;
}

let preferences = readPreferences();
const browserScheme = window.matchMedia('(prefers-color-scheme: dark)');

function applyAppearance() {
  const dark = preferences.color === 'dark' || (preferences.color === 'system' && browserScheme.matches);
  const root = document.documentElement;
  root.dataset.colorScheme = dark ? 'dark' : 'light';
  root.dataset.panelLayout = preferences.layout;
  const pageBackground = getComputedStyle(root).getPropertyValue('--cm-page-bg').trim();
  if (pageBackground) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', pageBackground);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useAppearancePreferences() {
  return useSyncExternalStore(subscribe, () => preferences, () => defaults);
}

export function setAppearancePreferences(change: Partial<AppearancePreferences>) {
  preferences = { ...preferences, ...change };
  try { localStorage.setItem(storageKey, JSON.stringify(preferences)); } catch { /* Apply in this tab anyway. */ }
  applyAppearance();
  listeners.forEach(listener => listener());
}

export function initializeAppearance() {
  applyAppearance();
  browserScheme.addEventListener('change', applyAppearance);
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    preferences = readPreferences();
    applyAppearance();
    listeners.forEach(listener => listener());
  });
}
