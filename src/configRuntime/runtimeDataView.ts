import type {ConfigPackageV3,ClassificationPath} from '../configStudio/types';
import type {RuleWorldDataset} from '../components/Rules/data/sourceTypes';
import {readableClassification} from './classificationCompatibility';
let config:ConfigPackageV3|undefined;
export const getRuntimeConfiguration=()=>config;
const originals=new WeakMap<RuleWorldDataset,RuleWorldDataset>(),listeners=new Set<()=>void>();
const diagnostics=new Map<string,{legacyPlaceholders:number;unknown:Array<{id:string;path:ClassificationPath}>}>();
export const subscribeRuntimeConfiguration=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};};
export function setRuntimeConfiguration(value:ConfigPackageV3){config=value;diagnostics.clear();for(const listener of listeners)listener();}
export const getRuntimeDataDiagnostics=()=>Object.fromEntries(diagnostics);
export function runtimeDatasetView(dataset:RuleWorldDataset):RuleWorldDataset {
  if(!config)return dataset;
  const raw=originals.get(dataset)??dataset,report={legacyPlaceholders:0,unknown:[] as Array<{id:string;path:ClassificationPath}>};
  const features=raw.features.flatMap(record=>{
    const path={class:String(record.Class??''),...(record.Kind?{kind:String(record.Kind)}:{}),...(record.SKind??record.Skind?{skind:String(record.SKind??record.Skind)}:{}),...(record.SKind2??record.Skind2?{skind2:String(record.SKind2??record.Skind2)}:{})};
    const supported=readableClassification(config!,path);
    if(!supported){report.unknown.push({id:String(record.ID??''),path});return [];}
    if(JSON.stringify(path)===JSON.stringify(supported))return [record];
    const value={...record};delete value.SKind;delete value.Skind;delete value.SKind2;delete value.Skind2;
    if(supported.skind)value.SKind=supported.skind;if(supported.skind2)value.SKind2=supported.skind2;
    report.legacyPlaceholders++;return [value];
  });
  const view={...raw,features};originals.set(view,raw);diagnostics.set(raw.worldId,report);return view;
}
