import {HelpLabel} from './SettingHelp';
import {useState} from 'react';
import type {ClassificationPath,ConfigPackageV3,WorkflowOutput} from './types';
import {workflowClassificationGroup} from './workflowClassificationGroup';
import {classificationPathKey,workflowPathLabel,pathMatchesScope} from './runtime';
const levels=['class','kind','skind','skind2'] as const;
const labels=['Class','Kind','SKind','SKind2'];
const decode=(value:string):Partial<ClassificationPath>=>{try{return JSON.parse(value)||{};}catch{return {};}};
export function WorkflowGroupCategoryInput({config,output,value,onChange}:{config:ConfigPackageV3;output:WorkflowOutput;value:string;onChange:(value:string)=>void}){
 const paths=workflowClassificationGroup(config,output).paths,[draft,setDraft]=useState<Partial<ClassificationPath>>(()=>decode(value));
 const selected=value?decode(value):draft,exact=paths.some(path=>classificationPathKey(path)===classificationPathKey(selected as ClassificationPath));
 const committed=Boolean(value&&exact),choose=(next:Partial<ClassificationPath>)=>{
  setDraft(next);const match=paths.find(path=>classificationPathKey(path)===classificationPathKey(next as ClassificationPath));
  const children=paths.some(path=>pathMatchesScope(path,next as ClassificationPath)&&classificationPathKey(path)!==classificationPathKey(next as ClassificationPath));
  onChange(match&&!children?JSON.stringify(next):'');
 };
 return <div className="grid gap-2">{levels.map((key,index)=>{
  if(index>0&&!selected[levels[index-1]])return null;
  const matches=paths.filter(path=>levels.slice(0,index).every(parent=>path[parent]===selected[parent]));
  const values=[...new Set(matches.flatMap(path=>path[key]?[path[key]!]:[]))];if(!values.length)return null;
  return <HelpLabel context="WorkflowGroupCategoryInput" key={key} className="grid gap-1 text-xs">{labels[index]}<select aria-label={'工作流分类 '+labels[index]} value={selected[key]??''} onChange={e=>{const next:Partial<ClassificationPath>={};for(const parent of levels.slice(0,index))if(selected[parent])next[parent]=selected[parent];if(e.target.value)next[key]=e.target.value;choose(next);}}><option value="">请选择下一级；选择父级本身请点击下方按钮</option>{values.map(code=>{const path=Object.fromEntries([...levels.slice(0,index).map(key=>[key,selected[key]]),[key,code]]) as ClassificationPath;return <option value={code} key={code}>{workflowPathLabel(config,path)}</option>;})}</select></HelpLabel>;
 })}{exact&&!committed?<button type="button" className="rounded border px-2 py-1 text-xs" onClick={()=>onChange(JSON.stringify(selected))}>使用当前分类本身：{workflowPathLabel(config,selected as ClassificationPath)}</button>:null}{committed?<p className="text-xs text-emerald-700">已选择：{workflowPathLabel(config,selected as ClassificationPath)}</p>:<p role={value?'alert':undefined} className={value?'text-xs text-rose-700':'text-xs text-slate-500'}>{value?'原选择已不属于当前分类组，请重新选择。':'请选择分类组中的一个具体分类；有子分类的父级需要明确确认。'}</p>}</div>;
}
