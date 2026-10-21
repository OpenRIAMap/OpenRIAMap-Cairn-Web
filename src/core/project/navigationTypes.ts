import type { ClassificationPath, LocalizedText } from '../../configStudio/types';

export type RailwaySelectors = { lines: ClassificationPath[]; platforms: ClassificationPath[]; stationAreas: ClassificationPath[]; stations: ClassificationPath[] };
export type RailwayRole = keyof RailwaySelectors;
export type SharedRailwayRoles = { schemaVersion: 'cairnmap.railway-roles.v1'; selectors: RailwaySelectors };
export type RailParameters = { transferWalkSpeed: number; railRideSpeed: number; transferCostFactor: number; normalPlatformTransferCost: number };
export type NavigationSettings = {
  schemaVersion: 'cairnmap.navigation.v1';
  rail: { enabled: boolean; name: LocalizedText; parameters: RailParameters; selectors: RailwaySelectors };
  teleport: { enabled: boolean; name: LocalizedText; hubTableId: string; selectors: { teleportPoints: ClassificationPath[]; warpPoints: ClassificationPath[] } };
  road: { enabled: boolean; name: LocalizedText; travelModesTableId: string; selectors: { roads: ClassificationPath[] } };
  common: { elytraSpeed: number; walkSpeed: number };
};
