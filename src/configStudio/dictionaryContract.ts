import type { CardItem, ConfigPackageV3 } from './types';
import type { OptionsOwner } from './lookupTables';
/** Converts only authored local rows. Never resolves a live reference into a copy. */
export function canonicalDictionaryOwner<T extends OptionsOwner>(owner:T):T {
  const next={...owner};
  if(next.optionsFieldRef||next.optionsTableId){delete next.options;delete next.optionTable;}
  else if(next.optionTable){delete next.options;next.optionValueType=next.optionTable.valueType;}
  else if(next.options?.length){next.optionValueType=next.optionValueType??'string';next.optionTable={valueType:next.optionValueType,rows:structuredClone(next.options)};delete next.options;}
  return next;
}
export function canonicalCardDictionary(item:CardItem):CardItem {
  const owner=canonicalDictionaryOwner({...item,options:item.valueOptions});
  return {...item,optionTable:owner.optionTable,optionsFieldRef:owner.optionsFieldRef,optionsTableId:owner.optionsTableId,optionValueType:owner.optionValueType,valueOptions:owner.options};
}
export function canonicalDictionaries(config:ConfigPackageV3):ConfigPackageV3 {
  if(config.contractRevision<11)return config;
  return {...config,nodes:config.nodes.map(node=>({...node,fields:node.fields.map(canonicalDictionaryOwner),card:node.card?.mode==='fields'?{...node.card,items:node.card.items.map(canonicalCardDictionary)}:node.card})),workflows:config.workflows.map(workflow=>({...workflow,steps:workflow.steps.map(step=>({...step,controls:step.controls?.map(control=>({...canonicalDictionaryOwner(control),group:control.group?{...control.group,itemFields:control.group.itemFields.map(canonicalDictionaryOwner)}:undefined}))}))}))};
}
