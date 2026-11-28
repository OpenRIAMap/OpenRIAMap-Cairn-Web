import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ConfigRuntimePreview,makeConfigPreviewFixture} from '../../../src/configStudio/ConfigRuntimePreview';
import {readConfigPackageWithDiagnostics} from '../../../src/configStudio/package';
import type {ConfigPackageV3,PreviewScenario} from '../../../src/configStudio/types';
import '../../../src/styles/index.css';
function Fixture(){
 const [config,setConfig]=useState<ConfigPackageV3>(),[path,setPath]=useState('RIL/PLF'),[name,setName]=useState('甲乙丙丁戊己庚辛壬癸一二三四五六七八九十天地玄黄宇宙洪荒日月盈昃'),[zoom,setZoom]=useState(6),[token,setToken]=useState(0),[error,setError]=useState('');
 const node=config?.nodes.find(n=>[n.path.class,n.path.kind,n.path.skind,n.path.skind2].filter(Boolean).join('/')===path);
 const geometry=node?.geometryProfiles.Point?.enabled?'Point':node?.geometryProfiles.LineString?.enabled?'LineString':'Polygon';
 const scenario:PreviewScenario=geometry==='Point'?'singlePoint':geometry==='LineString'?'singleLine':'smallPolygon';
 const base=config&&node?makeConfigPreviewFixture(config,node,scenario):undefined;
 const fixture=base?{features:base.features.map((record:any,i)=>({...record,Name:i===base.features.length-1?name:record.Name,...(record.Type==='Polyline'?{CoordL:[[[-240,-64,-32],[0,-64,-32],[240,-64,-32]]]}:{})}))}:undefined;
 return <><header style={{height:70,display:'flex',gap:10,alignItems:'center'}}><input type="file" aria-label="验收配置包" onChange={e=>{const file=e.target.files?.[0];if(file)void readConfigPackageWithDiagnostics(file).then(value=>setConfig(value.config)).catch(e=>setError(String(e)));}}/><input aria-label="验收分类" value={path} onChange={e=>setPath(e.target.value)}/><input aria-label="验收名称" value={name} onChange={e=>setName(e.target.value)}/><input aria-label="验收缩放" type="number" value={zoom} onChange={e=>{setZoom(Number(e.target.value));setToken(n=>n+1);}}/><output>{config?'配置已读入':''}{error}</output></header><main style={{height:'calc(100% - 70px)'}}>{config&&node&&fixture?<ConfigRuntimePreview key={path} config={config} node={node} scenario={scenario} fixture={fixture} zoomRequest={{value:zoom,token}} onRuntimeError={e=>setError(e.message)}/>:null}</main></>;
}
createRoot(document.getElementById('root')!).render(<Fixture/>);
