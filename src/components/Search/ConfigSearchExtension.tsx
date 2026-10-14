import type {ConfigPackageV3} from '../../configStudio/types';
import type {FeatureRecord} from '../Rules/rendering/renderRules';
import type {RailNewIndex} from '../Navigation/railNewIndex';
import {resolveNodeFieldSettings} from '../../configStudio/nodeFieldSettings';
import {recordPath,recordValue} from '../../configStudio/structureRoleIndex';
import {normalizeSearchColor,relatedLineTokens} from './relatedLineTokens';

export function ConfigSearchExtension({config,record,railIndex}:{config:ConfigPackageV3;record:FeatureRecord;railIndex?:RailNewIndex|null}){
  const value=resolveNodeFieldSettings(config,recordPath(record)).value.search?.extension;if(!value||value.mode==='none')return null;
  if(value.mode==='lineChips')return <span data-config-search-extension className="flex flex-wrap items-center gap-1">{relatedLineTokens(record,railIndex,value.lineChipSource??'platform').map((token,index)=><span key={`${token.label}-${index}`} className="rounded border px-1.5 text-[9px] font-semibold leading-[14px] text-white" style={{borderColor:token.color,backgroundColor:token.color}} title={token.title}>{token.label}</span>)}</span>;
  const color=normalizeSearchColor(value.colorField?recordValue(record,value.colorField):'')||value.fallbackColor||'#64748b';
  const name=value.nameField?String(recordValue(record,value.nameField)??''):'';
  return <span data-config-search-extension className="inline-flex min-h-[14px] min-w-[22px] items-center rounded-sm px-1 text-[9px] font-semibold text-white" title={name||color} style={{backgroundColor:color}}>{value.displayName===false?'':name}</span>;
}
