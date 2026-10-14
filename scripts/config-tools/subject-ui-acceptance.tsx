import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import '../../src/styles/index.css';
import type {ConfigPackageV3} from '../../src/configStudio/types';
import {LookupTablesEditor} from '../../src/configStudio/LookupTablesEditor';
import {TableOptionsEditor} from '../../src/configStudio/TableOptionsEditor';
import {defaultLookupTables} from '../../src/configStudio/lookupTables';

async function main(){
  const initial=await(await fetch('/src/configStudio/defaults/r9-r5.config.json')).json() as ConfigPackageV3;
  initial.contractRevision=10;initial.lookupTables=defaultLookupTables();
  initial.nodes[0].fields.push({fieldId:'TABLE_UI',key:'TableTest',type:'enum',input:'select',cardinality:'single',labels:{zh:'测试',en:''},description:{zh:'',en:''}});
  function Harness(){
    const [config,setConfig]=useState(initial),field=config.nodes[0].fields.find(field=>field.fieldId==='TABLE_UI')!;
    (window as unknown as {tableAcceptance:unknown}).tableAcceptance={config,field};
    return <div id="table-harness" className="config-editor min-h-screen min-w-0 bg-white p-4"><LookupTablesEditor config={config} onChange={setConfig}/><TableOptionsEditor config={config} value={field} onChange={next=>setConfig({...config,nodes:config.nodes.map((node,index)=>index?node:{...node,fields:node.fields.map(field=>field.fieldId==='TABLE_UI'?{...field,...next}:field)})})}/></div>;
  }
  createRoot(document.getElementById('subject-ui')!).render(<React.StrictMode><Harness/></React.StrictMode>);
}
void main();
