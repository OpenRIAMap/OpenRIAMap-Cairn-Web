import {HelpLabel} from './SettingHelp';
import type {ClassificationPath,ConfigPackageV3,HaloSettings} from './types';
import {defaultHalo,HALO_WIDTH_LIMIT} from './halo';
import {ColorBindingEditor} from './ColorBindingEditor';
export function HaloEditor({config,path,fields,value,onChange,inherit=false}:{config:ConfigPackageV3;path:ClassificationPath;fields:string[];value?:HaloSettings;onChange:(value:HaloSettings|undefined)=>void;inherit?:boolean}){
  if(config.contractRevision<14)return null;
  const halo=value??defaultHalo();
  return <fieldset className="cm-subsection space-y-2" aria-label="Halo 外环"><legend className="px-1 text-xs font-medium">Halo 外环</legend>{inherit?<HelpLabel context="HaloEditor" className="block text-xs"><input type="checkbox" checked={value===undefined} onChange={e=>onChange(e.target.checked?undefined:defaultHalo())}/> 沿用主规则 Halo</HelpLabel>:null}<HelpLabel context="HaloEditor" className="inline-flex items-center gap-1 text-xs"><input type="checkbox" disabled={inherit&&!value} checked={halo.enabled} onChange={e=>onChange({...halo,enabled:e.target.checked})}/>启用 Halo 外环</HelpLabel>{halo.enabled?<div className="space-y-2"><HelpLabel context="HaloEditor" className="block text-xs">粗细 px<input type="number" min={0} max={HALO_WIDTH_LIMIT} step={0.5} className="ml-2 w-24 rounded border px-2 py-1" value={Number.isFinite(halo.widthPx)?halo.widthPx:''} onChange={e=>onChange({...halo,widthPx:e.target.value===''?NaN:Number(e.target.value)})}/></HelpLabel><ColorBindingEditor config={config} sourcePath={path} fields={fields} label="Halo 颜色" value={halo.color} onChange={color=>onChange({...halo,color})}/></div>:null}</fieldset>;
}
