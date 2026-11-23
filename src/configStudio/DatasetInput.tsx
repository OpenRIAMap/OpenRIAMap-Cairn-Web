import {useEffect,useRef} from 'react';
import type {ClassificationPath,ConfigPackageV3} from './types';
import {datasetOptions} from './c21Workflow';
export function DatasetInput({config,world,path,value,onChange}:{config:ConfigPackageV3;world:string;path?:ClassificationPath;value:unknown;onChange:(value:string|undefined)=>void}){
 const options=datasetOptions(config,world,path),signature=JSON.stringify([world,path,config.lookupTables?.find(t=>t.functionKind==='dataset')]);const previous=useRef(signature);
 useEffect(()=>{if(previous.current!==signature&&value&&!options.some(o=>o.value===value))onChange(undefined);previous.current=signature;},[signature,value,options,onChange]);
 return <select aria-label="所属数据集" className="w-full rounded border px-2 py-1 text-sm" value={String(value??'')} onChange={e=>onChange(e.target.value||undefined)}><option value="">无</option>{value&&!options.some(o=>o.value===value)?<option value={String(value)}>历史引用：{String(value)}（请核对）</option>:null}{options.map(o=><option key={o.value} value={o.value}>{o.label[config.application?.preferences.language??'zh']||o.label.zh||o.value}</option>)}</select>;
}
