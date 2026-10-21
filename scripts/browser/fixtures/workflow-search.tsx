import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import '../../../src/styles/index.css';
import Search from '../../../src/components/Mapping/Workflow/WorkflowFeatureSearchSelect';
import type {WorkflowBridge} from '../../../src/components/Mapping/Workflow/WorkflowHost';
import {useRuleDataStore} from '../../../src/store/ruleDataStore';
import {applicationWorldDataset} from '../../../src/components/Rules/data/worldRuleDatasetLoader';
import {getRuleDataSourceSnapshot} from '../../../src/components/Rules/data/formalDataSourceRuntime';

const metrics={reads:0,aborts:0};
let mode='memory';
const source=getRuleDataSourceSnapshot('zth');
window.fetch=async(input,options)=>{
  if(String(input).startsWith(source.rootUrl)){
    metrics.reads++;
    if(mode==='error')return new Response('offline',{status:503});
    return new Promise((_,reject)=>options?.signal?.addEventListener('abort',()=>{metrics.aborts++;reject(Error('cancelled'));},{once:true}));
  }
  throw Error('Unexpected fetch in browser fixture: '+String(input));
};
const records=[{ID:'a',Class:'WRP',Name:'第一目标',World:'zth'},{ID:'b',Class:'WRP',Name:'第二目标',World:'zth'}];
function memory(next=records){useRuleDataStore.setState({datasets:{zth:applicationWorldDataset({worldId:'zth',mergeVersion:'fixture',releaseId:'fixture',sourceId:source.sourceId,transportId:source.transportId,readerSchemaVersion:source.readerSchemaVersion,loadedAt:Date.now(),features:next},source,'zth')}});}
memory();
const config={cacheKey:'browser-test',filter:(record:any)=>record.Class==='WRP',getId:(record:any)=>record.ID,getName:(record:any)=>record.Name,formatOption:(name:string,id:string)=>`${name}(${id})`};
function Harness(){
  const [value,setValue]=useState(''),[count,setCount]=useState(0),[committed,setCommitted]=useState<any[]>([]),[deleted,setDeleted]=useState<string[]>([]);
  const bridge={getCurrentWorldId:()=> 'zth',getCommittedLayerJsonInfos:()=>committed.map(featureInfo=>({featureInfo})),getDeleteMarkedFeatureIds:()=>deleted} as unknown as WorkflowBridge;
  (window as any).harness={metrics,memory,rerender:()=>setCount(c=>c+1),overlay:()=>setCommitted([{ID:'local',Class:'WRP',World:'zth',Name:'本地图层目标'}]),deleteA:()=>setDeleted(['a']),mode:(next:string)=>{mode=next;next==='memory'?memory():useRuleDataStore.setState({datasets:{}});},value:()=>value};
  return <main style={{margin:24,width:460}} className="space-y-6"><h1>关联搜索交互回归</h1><p>编辑草稿：<span id="draft">{value}</span> / 重渲染 {count}</p><div id="first"><Search bridge={bridge} label="关联 A" value={value} onChange={setValue} config={config}/></div><div id="second"><Search bridge={bridge} label="关联 B" value="" onChange={()=>{}} config={config}/></div><button id="unrelated" onClick={()=>setCount(c=>c+1)}>其他编辑操作</button></main>;
}
createRoot(document.getElementById('root')!).render(<Harness/>);
