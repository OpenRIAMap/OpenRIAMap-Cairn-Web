import type {
  CairnMapDataSourcesConfig,
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
import ruleButtonsConfigJson from '../../../project-config/packages/openriamap-ria/environment/ruleButtons.json';
import searchProfilesConfigJson from '../../../project-config/packages/openriamap-ria/environment/searchProfiles.json';
import worldsConfigJson from '../../../project-config/packages/openriamap-ria/environment/worlds.json';
import storageProfilesConfigJson from '../../../project-config/packages/openriamap-ria/environment/storageProfiles.json';
import relayPackageProtocolConfigJson from '../../../project-config/packages/openriamap-ria/environment/relayPackageProtocol.json';
import mediaIndexContractConfigJson from '../../../project-config/packages/openriamap-ria/environment/mediaIndexContract.json';

export function getOpenRIAMapSourceLinkModesConfig(): CairnMapSourceLinkModesConfig {
  return sourceLinkModesConfigJson as CairnMapSourceLinkModesConfig;
}

export function getOpenRIAMapDataSourcesConfig(): CairnMapDataSourcesConfig {
  return dataSourcesConfigJson as CairnMapDataSourcesConfig;
}

export function getOpenRIAMapRuleButtonsConfig(): CairnMapRuleButtonsConfig {
  return ruleButtonsConfigJson as CairnMapRuleButtonsConfig;
}

export function getOpenRIAMapSearchProfilesConfig(): CairnMapSearchProfilesConfig {
  return searchProfilesConfigJson as CairnMapSearchProfilesConfig;
}

export function getOpenRIAMapWorldsConfig(): CairnMapWorldsConfig {
  return worldsConfigJson as CairnMapWorldsConfig;
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
