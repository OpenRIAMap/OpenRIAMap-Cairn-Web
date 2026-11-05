import type { LocalizedText } from '../../configStudio/types';

export type RailwaySelectors = { lines: import('../../configStudio/classificationScope').ClassificationRange; platforms: import('../../configStudio/classificationScope').ClassificationRange; stationAreas: import('../../configStudio/classificationScope').ClassificationRange; stations: import('../../configStudio/classificationScope').ClassificationRange };
export type RailwayRole = keyof RailwaySelectors;
export type SharedRailwayRoles = { schemaVersion: 'cairnmap.railway-roles.v1'; selectors: RailwaySelectors };
export type RailParameters = { transferWalkSpeed: number; railRideSpeed: number; transferCostFactor: number; normalPlatformTransferCost: number };
export type NavigationSettings = {
  schemaVersion: 'cairnmap.navigation.v1';
  rail: { enabled: boolean; name: LocalizedText; parameters: RailParameters; selectors: RailwaySelectors };
  teleport: { enabled: boolean; name: LocalizedText; hubTableId: string; selectors: { teleportPoints: import('../../configStudio/classificationScope').ClassificationRange; warpPoints: import('../../configStudio/classificationScope').ClassificationRange } };
  road: { enabled: boolean; name: LocalizedText; travelModesTableId: string; selectors: { roads: import('../../configStudio/classificationScope').ClassificationRange } };
  common: { elytraSpeed: number; walkSpeed: number };
};
