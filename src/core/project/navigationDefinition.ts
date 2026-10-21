import type { ClassificationPath } from '../../configStudio/types';
import type { NavigationSettings, RailwaySelectors, RailParameters, SharedRailwayRoles } from './navigationTypes';

export const RAILWAY_ROLES = ['lines', 'platforms', 'stationAreas', 'stations'] as const;
export function defaultRailwaySelectors(): RailwaySelectors {
  return { lines: [{ class: 'RLE' }], platforms: [{ class: 'PLF' }], stationAreas: [{ class: 'STA' }], stations: [{ class: 'STB' }, { class: 'SBP' }] };
}
export function defaultSharedRailwayRoles(): SharedRailwayRoles { return { schemaVersion: 'cairnmap.railway-roles.v1', selectors: defaultRailwaySelectors() }; }
export function defaultNavigationSettings(parameters?: RailParameters): NavigationSettings {
  return {
    schemaVersion: 'cairnmap.navigation.v1',
    rail: { enabled: true, name: { zh: '铁路（新）', en: '' }, parameters: structuredClone(parameters ?? { transferWalkSpeed: 3, railRideSpeed: 16, transferCostFactor: 1, normalPlatformTransferCost: 5 }), selectors: defaultRailwaySelectors() },
    teleport: { enabled: true, name: { zh: '传送（新）', en: '' }, hubTableId: 'teleport-hubs', selectors: { teleportPoints: [{ class: 'TPP' }], warpPoints: [{ class: 'WRP' }] } },
    road: { enabled: true, name: { zh: '道路', en: '' }, travelModesTableId: 'road-travel-modes', selectors: { roads: [{ class: 'ROD' }] } },
    common: { elytraSpeed: 40, walkSpeed: 4.317 },
  };
}
export function pathCovers(scope: ClassificationPath, path: ClassificationPath): boolean {
  return (['class', 'kind', 'skind', 'skind2'] as const).every(key => !scope[key] || scope[key] === path[key]);
}
export function pathsMatch(paths: ClassificationPath[], path: ClassificationPath): boolean { return paths.some(scope => pathCovers(scope, path)); }
export function rawClassification(value: Record<string, unknown>): ClassificationPath {
  return { class: String(value.Class ?? value.class ?? '').trim(), kind: value.Kind as string | undefined, skind: (value.SKind ?? value.Skind) as string | undefined, skind2: (value.SKind2 ?? value.Skind2) as string | undefined };
}
export function matchesRaw(paths: ClassificationPath[], value: Record<string, unknown>): boolean { return pathsMatch(paths, rawClassification(value)); }
