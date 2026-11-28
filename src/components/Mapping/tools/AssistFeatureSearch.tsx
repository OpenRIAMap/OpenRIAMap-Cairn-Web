import {useEffect,useRef,useState} from 'react';
import {matchesSearchQuery} from '@/configStudio/searchMatch';
import AppButton from '@/components/ui/AppButton';

export type AssistFeatureOption={key:string;id:string;name:string;description:string};
export function AssistFeatureSearch({getOptions,onApply}:{getOptions:()=>AssistFeatureOption[];onApply:(key:string)=>boolean}){
  const [query,setQuery]=useState(''),[pending,setPending]=useState(''),[options,setOptions]=useState<AssistFeatureOption[]>([]),[error,setError]=useState('');
  const optionsRef=useRef(getOptions);optionsRef.current=getOptions;
  useEffect(()=>{const timer=setTimeout(()=>{try{setOptions(optionsRef.current().filter(option=>[option.id,option.name,option.description].some(value=>matchesSearchQuery(value,query,'contains'))).slice(0,50));setError('');}catch{setError('挂载记录暂不可用，请重试。');}},150);return()=>clearTimeout(timer);},[query]);
  return <div className="space-y-2" onPointerDown={e=>e.stopPropagation()}>
    <label className="block text-xs">搜索当前挂载要素<input aria-label="搜索当前挂载要素" className="mt-1 w-full rounded border px-2 py-1" value={query} placeholder="输入ID或名称" onChange={e=>{setQuery(e.target.value);setPending('');}}/></label>
    <div className="max-h-44 overflow-auto rounded border" role="listbox" aria-label="辅助线要素搜索结果">{options.map(option=><button type="button" role="option" aria-selected={pending===option.key} className={'block w-full border-b px-2 py-1 text-left text-xs '+(pending===option.key?'ring-2 ring-inset ring-blue-500':'')} key={option.key} onClick={()=>setPending(option.key)}>{option.id}（{option.name||'未命名'}）<small className="ml-2 opacity-70">{option.description}</small></button>)}{!options.length?<p className="p-2 text-xs">没有匹配的已挂载线／面。</p>:null}</div>
    <AppButton type="button" disabled={!pending} className="rounded border px-3 py-1 text-sm" onClick={()=>{if(onApply(pending))setError('');else setError('目标已卸除或几何无效，请重新选择。');}}>应用</AppButton>
    {error?<p role="alert" className="text-xs text-red-500">{error}</p>:null}
  </div>;
}
