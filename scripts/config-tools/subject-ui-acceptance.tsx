import { ConfigBootstrap } from '../../src/configStudio/ConfigBootstrap';
import { ConfigStudio } from '../../src/configStudio/ConfigStudio';
import { getActiveConfigSnapshot, restoreApplicationDefault } from '../../src/configStudio/defaultConfigProvider';
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
  (window as unknown as {applicationAcceptance:unknown}).applicationAcceptance={snapshot:getActiveConfigSnapshot,restoreDefault:restoreApplicationDefault};
  createRoot(document.getElementById('subject-ui')!).render(<React.StrictMode>{new URLSearchParams(location.search).get('mode')==='general'?<ConfigBootstrap><ConfigStudio initialTab="general" mountedRecords={[]} onClose={()=>undefined}/></ConfigBootstrap>:new URLSearchParams(location.search).get('mode')==='inherit'?<CardHarness/>:new URLSearchParams(location.search).get('mode')==='role'?<RoleHarness/>:new URLSearchParams(location.search).get('mode')==='search'?<SearchHarness/>:<Harness/>}</React.StrictMode>);
}
void main();
