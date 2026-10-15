import { getApplicationDefinition, getApplicationSettings } from './applicationRuntime';
import { defaultSourceSettings, resourceGroupForWorld } from './applicationResources';
import type {
  CairnMapDataSourcesConfig,
  CairnMapFormalDataSourceRuntimeConfig,
  CairnMapRuleButtonsConfig,
  CairnMapWorldsConfig,
  CairnMapSearchProfilesConfig,
  CairnMapSourceLinkModesConfig,
  CairnMapStorageProfilesConfig,
  CairnMapNativeRelayPackageProtocolConfig,
  CairnMapMediaIndexContractConfig,
} from './environmentTypes';

import sourceLinkModesConfigJson from '../../../project-config/packages/openriamap-ria/environment/sourceLinkModes.json';
import dataSourcesConfigJson from '../../../project-config/packages/openriamap-ria/environment/dataSources.json';
import formalDataSourcesConfigJson from '../../../.cairn/formal-data-source-runtime.json';
import ruleButtonsConfigJson from '../../../project-config/packages/openriamap-ria/environment/ruleButtons.json';
import searchProfilesConfigJson from '../../../project-config/packages/openriamap-ria/environment/searchProfiles.json';
import worldsConfigJson from '../../../project-config/packages/openriamap-ria/environment/worlds.json';
import storageProfilesConfigJson from '../../../project-config/packages/openriamap-ria/environment/storageProfiles.json';
import relayPackageProtocolConfigJson from '../../../project-config/packages/openriamap-ria/environment/relayPackageProtocol.json';
import mediaIndexContractConfigJson from '../../../project-config/packages/openriamap-ria/environment/mediaIndexContract.json';

export function getOpenRIAMapSourceLinkModesConfig(worldId?:string): CairnMapSourceLinkModesConfig {
  const application=getApplicationDefinition(),value=(worldId?resourceGroupForWorld(application,worldId)?.sources:undefined)?.linkModes??defaultSourceSettings(application).linkModes;return {...sourceLinkModesConfigJson,storageKey:value.storageKey,legacyStorageKeys:value.legacyStorageKeys,items:value.items.map(item=>({id:item.id,label:item.label[getApplicationSettings().preferences.language],rawCompatibleBaseUrl:item.baseUrl,default:item.default}))} as CairnMapSourceLinkModesConfig;
}

export function getOpenRIAMapDataSourcesConfig(): CairnMapDataSourcesConfig {
  return {...dataSourcesConfigJson,items:getApplicationSettings().worlds.map(world=>({id:world.id,worldId:world.id,baseUrl:'',files:[],sourceMode:'dat' as const,pictureSourceMode:'dat' as const}))};
}

export function getOpenRIAMapFormalDataSourceRuntimeConfig(worldId?:string): CairnMapFormalDataSourceRuntimeConfig {
  const application=getApplicationDefinition(),value=(worldId?resourceGroupForWorld(application,worldId)?.sources:undefined)??defaultSourceSettings(application);return {...formalDataSourcesConfigJson,selection:{schemaVersion:'cairnmap.data-source-selection.v1',storageKey:value.storageKey,sources:value.items.map(item=>({id:item.id,label:item.label[getApplicationSettings().preferences.language],readerKind:item.readerKind,enabled:item.enabled,selectable:item.selectable})),policy:{defaultSourceId:value.defaultSourceId,selectionMode:value.selectionMode,requireExplicitApply:true,automaticFallback:false,clearCacheOnApply:'source-dependent',retryOnFailure:value.retryOnFailure}},bindings:value.items.map(({label:_label,enabled:_enabled,selectable:_selectable,...binding})=>binding),githubRawTransport:{sourceIds:value.github.sourceIds,repository:{owner:value.github.owner,repo:value.github.repo,branch:value.github.branch}}};
}

export function getOpenRIAMapRuleButtonsConfig(): CairnMapRuleButtonsConfig {
  const value=getApplicationSettings().buttons;return {...ruleButtonsConfigJson,storageKey:value.storageKey,legacyStorageKeys:value.legacyStorageKeys,policy:{maxActive:value.maxActive},defaults:{fallback:value.fallback,byWorld:value.byWorld},items:value.items.map(item=>({...item,label:item.names[getApplicationSettings().preferences.language]}))};
}

export function getOpenRIAMapSearchProfilesConfig(): CairnMapSearchProfilesConfig {
  return searchProfilesConfigJson as CairnMapSearchProfilesConfig;
}

export function getOpenRIAMapWorldsConfig(): CairnMapWorldsConfig {
  return {...worldsConfigJson,items:getApplicationSettings().worlds.map(world=>({...world,label:world.label[getApplicationSettings().preferences.language]}))};
}

export function getOpenRIAMapStorageProfilesConfig(): CairnMapStorageProfilesConfig {
  return storageProfilesConfigJson as CairnMapStorageProfilesConfig;
}

export function getOpenRIAMapRelayPackageProtocolConfig(): CairnMapNativeRelayPackageProtocolConfig {
  return relayPackageProtocolConfigJson as CairnMapNativeRelayPackageProtocolConfig;
}

export function getOpenRIAMapMediaIndexContractConfig(): CairnMapMediaIndexContractConfig {
  return mediaIndexContractConfigJson as CairnMapMediaIndexContractConfig;
}
