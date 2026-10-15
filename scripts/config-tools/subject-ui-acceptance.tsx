import { ConfigBootstrap } from '../../src/configStudio/ConfigBootstrap';
import { ConfigStudio } from '../../src/configStudio/ConfigStudio';
import { getActiveConfigSnapshot, loadActiveConfig, persistActiveConfig, restoreApplicationDefault } from '../../src/configStudio/defaultConfigProvider';
import { migrateConfigToR11 } from '../../src/configStudio/r11Migration';
import { applicationWorld } from '../../src/core/project/applicationRuntime';
import { getRuleDataSourceSnapshot } from '../../src/components/Rules/data/formalDataSourceRuntime';
import {SearchBar} from '../../src/components/Search/SearchBar';
import {NavigationPanel} from '../../src/components/Navigation/NavigationPanel';
import {setRuleSearchPool} from '../../src/components/Rules/search/ruleSearchRegistry';
import {compileConfigRuntime} from '../../src/configStudio/runtime';
import type {FeatureRecord} from '../../src/components/Rules/rendering/renderRules';
import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import '../../src/styles/index.css';
import type {ConfigPackageV3} from '../../src/configStudio/types';
import {LookupTablesEditor} from '../../src/configStudio/LookupTablesEditor';
import {TableOptionsEditor} from '../../src/configStudio/TableOptionsEditor';
import {defaultLookupTables} from '../../src/configStudio/lookupTables';
import {migrateConfigToR10} from '../../src/configStudio/r10Migration';
import {NodeFieldSettingsEditor} from '../../src/configStudio/NodeFieldSettingsEditor';
import {V3CardEditor} from '../../src/configStudio/V3CardEditor';
import {bindOptionsTable} from '../../src/configStudio/lookupTables';
import type {WorkflowControl} from '../../src/configStudio/types';

async function main(){
  const initial=await(await fetch('/src/configStudio/defaults/r9-r5.config.json')).json() as ConfigPackageV3;
  initial.contractRevision=10;initial.lookupTables=defaultLookupTables();
  initial.nodes[0].fields.push({fieldId:'TABLE_UI',key:'TableTest',type:'enum',input:'select',cardinality:'single',labels:{zh:'测试',en:''},description:{zh:'',en:''}});
  function CardHarness(){
    const [config,setConfig]=useState(()=>migrateConfigToR10({...initial,contractRevision:9,lookupTables:undefined}).config);
    const root=config.nodes.find(node=>node.path.class==='BUD'&&!node.path.kind)!,child=config.nodes.find(node=>node.path.class==='BUD'&&node.path.kind&&!node.path.skind)!;
    const [childMode,setChildMode]=useState(true),node=childMode?child:root;
    (window as unknown as {cardAcceptance:unknown}).cardAcceptance={config,node,childMode};
    return <div id="card-harness" className="config-editor min-h-screen bg-white p-4"><div className="mb-4 flex gap-2"><button onClick={()=>setChildMode(!childMode)}>切换父子验收</button><button onClick={()=>{const next=structuredClone(config),card=next.nodes.find(node=>node.nodeId===root.nodeId)!.card;if(card?.mode==='fields')card.items[0].label={zh:'父名称更新',en:''};setConfig(next);}}>更新父名称验收</button></div><V3CardEditor config={config} node={node} onChange={next=>setConfig({...config,nodes:config.nodes.map(node=>node.nodeId===next.nodeId?next:node)})}/></div>;
  }
  function RoleHarness(){const [config,setConfig]=useState(()=>migrateConfigToR10({...initial,contractRevision:9,lookupTables:undefined}).config),node=config.nodes.find(node=>node.path.class==='FLR'&&!node.path.kind)!;(window as unknown as {roleAcceptance:unknown}).roleAcceptance={config,node};return <div id="role-harness" className="config-editor min-h-screen bg-white p-4"><NodeFieldSettingsEditor config={config} node={node} onChange={next=>setConfig({...config,nodes:config.nodes.map(node=>node.nodeId===next.nodeId?next:node)})}/></div>;}
  function SearchHarness(){
    const config=useMemo(()=>{const seed=structuredClone(initial);seed.nodes[0].fields=seed.nodes[0].fields.filter(field=>field.fieldId!=='TABLE_UI');return compileConfigRuntime(migrateConfigToR10({...seed,contractRevision:9,lookupTables:undefined}).config,true);},[]);
    const [records,setRecords]=useState<FeatureRecord[]>(()=>['BUD','STB','FLR'].map((Class,index)=>{const ID=index===0?'HOST':index===1?'STATION':'FLOOR';return {uid:ID,type:'Points',p3:{x:index*10,y:-64,z:index*10},featureInfo:{World:'zth',Class,ID,Name:index===0?'原建筑':index===1?'车站建筑':'302房',...(Class==='FLR'?{BuildingID:'HOST',NofFloor:'3'}:{})},meta:{Class,Type:'Points',World:'zth',idField:'ID',idValue:ID,sig:{},signatureKey:ID,groups:{}}};}));
    useEffect(()=>setRuleSearchPool('zth',records),[records]);
    return <div id="search-harness" className="min-h-screen bg-white p-4"><button className="mb-4 rounded border p-2" onClick={()=>setRecords(records.map(record=>record.meta.Class==='BUD'?{...record,featureInfo:{...record.featureInfo,Name:'更新后建筑'}}:record))}>更新建筑名验收</button><div id="main-search" className="mb-8 max-w-2xl"><SearchBar configRuntime={config} stations={[]} landmarks={[]} lines={[]} worldId="zth" onSelect={()=>undefined}/></div><div id="navigation-search" className="max-w-3xl"><NavigationPanel configRuntime={config} stations={[]} landmarks={[]} lines={[]} worldId="zth" onClose={()=>undefined}/></div></div>;
  }
  function Harness(){
    const [config,setConfig]=useState(initial),field=config.nodes[0].fields.find(field=>field.fieldId==='TABLE_UI')!;
    (window as unknown as {tableAcceptance:unknown}).tableAcceptance={config,field};
    return <div id="table-harness" className="config-editor min-h-screen min-w-0 bg-white p-4"><LookupTablesEditor config={config} onChange={setConfig}/><TableOptionsEditor config={config} value={field} onChange={next=>setConfig({...config,nodes:config.nodes.map((node,index)=>index?node:{...node,fields:node.fields.map(field=>field.fieldId==='TABLE_UI'?{...field,...next}:field)})})}/></div>;
  }
  function ReuseHarness(){
    const [config,setConfig]=useState(()=>{const seed=structuredClone(initial);seed.nodes[0].fields=seed.nodes[0].fields.filter(f=>f.fieldId!=='TABLE_UI');const next=migrateConfigToR11({...seed,contractRevision:9}).config,node=next.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind)!;node.fields.push(bindOptionsTable(next,{fieldId:'reuse-source',key:'SharedTest',type:'enum',cardinality:'single',input:'select',labels:{zh:'共用字段',en:'Shared'},description:{zh:'',en:''}},'road-travel-modes'));node.card={mode:'fields',items:[{id:'reuse-card',source:'SharedTest',visible:true,renderer:'text',label:{zh:'本地',en:''}}]};return next;});
    const [control,setControl]=useState<WorkflowControl>({id:'reuse-select',slot:'TEST',kind:'select',columns:1,label:{zh:'选项',en:''}});
    const node=config.nodes.find(n=>n.path.class==='BUD'&&!n.path.kind)!;
    (window as unknown as {reuseAcceptance:unknown}).reuseAcceptance={config,control};
    return <div id="reuse-harness" className="config-editor min-h-screen bg-white p-4"><button className="rounded border p-2" onClick={()=>{const next=structuredClone(config);next.lookupTables!.find(t=>t.id==='road-travel-modes')!.rows[0].label.zh='更新后步行';next.nodes.find(n=>n.nodeId===node.nodeId)!.fields.find(f=>f.fieldId==='reuse-source')!.labels.zh='更新后字段';setConfig(next);}}>更新来源验收</button><section aria-label="下拉对照验收"><TableOptionsEditor config={config} value={control} onChange={next=>setControl({...control,...next})} initialPath={node.path}/></section><V3CardEditor config={config} node={node} onChange={next=>setConfig({...config,nodes:config.nodes.map(n=>n.nodeId===next.nodeId?next:n)})}/></div>;
  }
  if(new URLSearchParams(location.search).get('resources')==='1'){await loadActiveConfig();if(new URLSearchParams(location.search).get('reset')==='1')await restoreApplicationDefault();const active=getActiveConfigSnapshot();if(active.contractRevision<11)await persistActiveConfig(migrateConfigToR11(active).config,true);}
  (window as unknown as {applicationAcceptance:unknown}).applicationAcceptance={snapshot:getActiveConfigSnapshot,restoreDefault:restoreApplicationDefault,resourceWorld:applicationWorld,resourceSource:getRuleDataSourceSnapshot};
  createRoot(document.getElementById('subject-ui')!).render(<React.StrictMode>{new URLSearchParams(location.search).get('mode')==='reuse'?<ReuseHarness/>:new URLSearchParams(location.search).get('mode')==='general'?<ConfigBootstrap><ConfigStudio initialTab="general" mountedRecords={[]} onClose={()=>undefined}/></ConfigBootstrap>:new URLSearchParams(location.search).get('mode')==='inherit'?<CardHarness/>:new URLSearchParams(location.search).get('mode')==='role'?<RoleHarness/>:new URLSearchParams(location.search).get('mode')==='search'?<SearchHarness/>:<Harness/>}</React.StrictMode>);
}
void main();
