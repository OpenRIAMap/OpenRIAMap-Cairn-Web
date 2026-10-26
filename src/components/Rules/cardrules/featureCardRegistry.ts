import type { ComponentType } from 'react';

import FeatureInteractionCard from '@/components/Rules/core/FeatureInteractionCard';
import TRPFeatureInteractionCard from './TRPFeatureInteractionCard';

import type { FeatureRecord } from '@/components/Rules/rendering/renderPrimitives';
import type { CardFeatureLinkTarget, ResolveFeatureById } from './cardInteractions';
import type { FeatureSharePayload } from '@/lib/featureShareLink';
import type {ConfigPackageV3} from '@/configStudio/types';
import {resolveCardConfiguration} from '@/configStudio/runtime';
import {recordCategory} from '@/configStudio/multipartPolicy';
import type {InfoSections} from './fieldRules';

export type FeatureCardCommonProps = {
  configuration?: ConfigPackageV3;
  componentOptions?: Record<string,unknown>;
  configRuntimeCard?: ConfigPackageV3;
  disableFieldRules?: boolean;
  infoSectionsOverride?: InfoSections;
  open: boolean;
  feature?: FeatureRecord | null;
  onClose?: () => void;
  // Optional hooks used by the default card; special cards may ignore.
  resolveFeatureById?: ResolveFeatureById;
  onTryTriggerLabelClickById?: (id: string, linkTarget?: CardFeatureLinkTarget) => void;
  variant?: 'floating' | 'embedded';
  onOpenJsonPanel?: (payload: { title: string; jsonText: string; filename: string }) => void;
  onOpenSharePanel?: (payload: FeatureSharePayload) => void;
};

export const CARD_COMPONENT_EXECUTORS: Record<string, ComponentType<FeatureCardCommonProps>> = {
  TRP: TRPFeatureInteractionCard,
};

/** Shared desktop/mobile resolver. Keys select code capabilities, never taxonomy. */
export function resolveConfiguredFeatureCard(config:ConfigPackageV3|undefined,feature:FeatureRecord|null|undefined):{Component:ComponentType<FeatureCardCommonProps>;props:Partial<FeatureCardCommonProps>}{
 const empty:InfoSections={mainRows:[],otherRows:[]};
 if(!config||!feature)return {Component:FeatureInteractionCard,props:{disableFieldRules:true,infoSectionsOverride:empty}};
 const card=resolveCardConfiguration(config,recordCategory(feature.featureInfo));
 if(card?.mode==='component'){
  const Component=CARD_COMPONENT_EXECUTORS[card.componentKey];
  if(!Component)return {Component:FeatureInteractionCard,props:{disableFieldRules:true,infoSectionsOverride:{mainRows:[{label:'信息卡配置',value:'未登记的组件：'+card.componentKey}],otherRows:[]}}};
  return {Component,props:{configuration:config,componentOptions:card.options,disableFieldRules:true}};
 }
 return {Component:FeatureInteractionCard,props:{configRuntimeCard:config,disableFieldRules:true,...(!card?{infoSectionsOverride:empty}:{})}};
}
