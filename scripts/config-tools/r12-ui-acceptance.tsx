import RuleButtonPanel from '../../src/components/Rules/ButtonRule/RuleButtonPanel';
import { RenderRuleTitle } from '../../src/configStudio/RenderRuleTitle';
import { useLayoutEffect } from 'react';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as L from 'leaflet';
import { RenderRuleEditor, ConfigStudio } from '../../src/configStudio/ConfigStudio';
import { RuntimePreviewProvider, RulePreviewScope, ConnectedConfigRuntimePreview, PreviewNameSelector } from '../../src/configStudio/RuntimePreviewContext';
import { migrateConfigToR12, r12RenderRule } from '../../src/configStudio/r12Migration';
import { defaultRenderRule } from '../../src/configStudio/v32Defaults';
import { applyApplicationSettings } from '../../src/core/project/applicationRuntime';
import { validateConfigPackage } from '../../src/configStudio/runtime';
import { loadActiveConfig, persistActiveConfig } from '../../src/configStudio/defaultConfigProvider';
import { buildCjkGlyphPathPlanResult } from '../../src/components/Rules/rendering/label/labelGlyphPath';
import { makeCjkGlyphPathLabelMarkerResult } from '../../src/components/Rules/rendering/label/labelGlyphPathLayer';
import type { ConfigPackageV3, FieldDefinition } from '../../src/configStudio/types';
import '../../src/styles/index.css';

document.body.style.fontFamily='system-ui,-apple-system,Segoe UI,Microsoft YaHei,sans-serif';
const host=window as unknown as { r12Harness: Record<string, unknown> };
const identity=await(await fetch('/configuration/current.json')).json();
const config=migrateConfigToR12(await(await fetch(identity.configUrl)).json()).config;
const node=config.nodes.find(node=>node.nodeId==='class-sbp')!;
node.classificationLabels={class:{zh:'车站建筑',en:'Station building'}};
node.fields.push({fieldId:'r12-ui-choice',key:'previewChoice',type:'enum',input:'select',cardinality:'single',required:false,labels:{zh:'预览分类',en:'Preview choice'},description:{zh:'',en:''},optionValueType:'string',options:['airport','bus','park'].map(value=>({value,label:{zh:value,en:value}}))},{fieldId:'r12-ui-flag',key:'previewFlag',type:'boolean',input:'toggle',cardinality:'single',required:false,labels:{zh:'预览开关',en:'Preview flag'},description:{zh:'',en:''}} as FieldDefinition);
const base=r12RenderRule(defaultRenderRule('Point','r12-ui-base'),'Point');
base.when={zoom:{min:0,max:8}};delete base.minZoom;delete base.maxZoom;
const conditional=structuredClone(base);conditional.id='r12-ui-conditional';conditional.when={zoom:{min:2,max:6},fields:{op:'all',items:[],formula:{expression:'C1',terms:[{id:'C1',relation:'AND',condition:{kind:'fieldCompare',field:'previewFlag',operator:'eq',value:false}}]}}};
node.geometryProfiles.Point!.zoomPriority.rules=[base,conditional];
applyApplicationSettings(config.application);
const report=validateConfigPackage(config);if(!report.valid)throw Error(JSON.stringify(report.issues.filter(i=>i.severity==='error')));
host.r12Harness={initialHash:identity.configSha256};
function Harness(){
  const [draft,setDraft]=useState<ConfigPackageV3>(config),selected=draft.nodes.find(n=>n.nodeId===node.nodeId)!;
  host.r12Harness.config=draft;host.r12Harness.report=validateConfigPackage(draft);
  return <div className="config-editor cm-editor-design min-h-screen bg-slate-100 p-4"><RuntimePreviewProvider config={draft} node={selected} scenario="singlePoint" onShow={()=>undefined}><div style={{display:"grid",gridTemplateColumns:innerWidth>1024?"420px minmax(0,1fr)":"minmax(0,1fr)",gap:16,minHeight:"100vh"}}><section className="sticky top-4 h-[600px] min-w-0 space-y-2 rounded-xl border bg-white p-3"><strong>显示规则验证器</strong><PreviewNameSelector/><div className="h-[480px]"><ConnectedConfigRuntimePreview config={draft} node={selected} scenario="singlePoint" onMapReady={map=>{
    host.r12Harness.map=map;
    host.r12Harness.glyphProbe=(text:string,points:number[][],patch:Record<string,unknown>={})=>{const anchor={lineTextOrientationPolicy:'scriptAware' as const,lineTextPathLengthMode:'actualText' as const,cjkGlyphMaxCount:64,cjkGlyphPathMode:'auto' as const,cjkGlyphMaxAngleDeltaDeg:45,cjkGlyphMaxTotalBendDeg:100,textPathPaddingPx:28,textPathLetterSpacingPx:.5,textPathCurvedLetterSpacingPx:1.8,textPathCurvedSpacingMinBendDeg:30,...patch},pathLatLngs=points.map(p=>map.containerPointToLatLng(L.point(p[0],p[1])));const result=buildCjkGlyphPathPlanResult({map,text,pathLatLngs,anchor,fontSizePx:14});return result;};
    host.r12Harness.showGlyph=(text:string,points:number[][])=>{const previous=host.r12Harness.glyph as L.Layer|undefined;if(previous)map.removeLayer(previous);const result=makeCjkGlyphPathLabelMarkerResult({map,latlng:map.getCenter(),text,pathLatLngs:points.map(p=>map.containerPointToLatLng(L.point(p[0],p[1]))),styleKey:'gm-outline-14',anchor:{lineTextOrientationPolicy:'scriptAware',lineTextPathLengthMode:'actualText',cjkGlyphMaxCount:64,cjkGlyphPathMode:'auto',cjkGlyphMaxAngleDeltaDeg:45,cjkGlyphMaxTotalBendDeg:100,textPathPaddingPx:28}});if(result.marker){result.marker.addTo(map);host.r12Harness.glyph=result.marker;}return {status:result.status,glyphCount:result.glyphCount};};
  }}/></div></section><main className="min-w-0"><RulePreviewScope ruleId="r12-ui-conditional" geometry="Point"><RenderRuleEditor config={draft} path={selected.path} geometry="Point" profile={selected.geometryProfiles.Point!} onChange={profile=>setDraft({...draft,nodes:draft.nodes.map(n=>n.nodeId===selected.nodeId?{...n,geometryProfiles:{...n.geometryProfiles,Point:profile}}:n)})}/></RulePreviewScope></main></div></RuntimePreviewProvider></div>;
}
function PanelHarness(){
  const [count,setCount]=useState(2),[side,setSide]=useState('right'),[ready,setReady]=useState(-1),[mobile,setMobile]=useState(false);
  useLayoutEffect(()=>{const next=structuredClone(config.application!);next.buttons.items=Array.from({length:count},(_,i)=>({...next.buttons.items[i%next.buttons.items.length],id:'accept-'+i,names:{zh:'按钮 '+i,en:''},defaultEnabled:false}));next.buttons.fallback=[];next.buttons.byWorld={};applyApplicationSettings(next);setReady(count);},[count]);
  return <main style={{height:'100vh',background:'#e2e8f0'}}><aside data-map-world-controls style={{position:'absolute',left:16,top:16,width:300,height:150,background:'white'}}>世界／搜索控件保留区</aside><div style={{position:'absolute',right:16,top:16,left:side==='left'?16:undefined}}><div data-desktop-map-toolbar data-toolbar-side={side} style={{display:'flex',alignItems:'start',gap:8,flexWrap:'wrap',maxWidth:'calc(100vw - 2rem)'}}><div style={{display:'flex',gap:4}} data-rule-panel-ready={ready}><RuleButtonPanel mode={mobile?'mobile':'desktop'} activeButtonIds={[]} onToggle={()=>undefined} onTogglePlayers={()=>undefined}/><button style={{width:44,height:44}}>收起</button></div><div style={{width:320,height:72,background:'white',flexShrink:0}}>其他工具面板</div></div></div><div style={{position:'absolute',bottom:8,left:16,display:'flex',gap:8}}>{[2,9,18,40].map(n=><button key={n} onClick={()=>setCount(n)}>数量 {n}</button>)}<button onClick={()=>setSide(v=>v==='right'?'left':'right')}>切换左右</button><button onClick={()=>setMobile(v=>!v)}>切换移动端</button></div></main>;
}
function TitleHarness(){const rule=structuredClone(conditional);rule.when!.fields={op:'all',items:[{kind:'fieldCompare',field:'Name',operator:'eq',value:'中英混合 very long readable rule value '.repeat(20)}]};return <div data-title-probe style={{width:600,fontSize:14,lineHeight:1.5,margin:16,border:'1px solid #ccc'}}><details open><summary><RenderRuleTitle rule={rule} index={1}/></summary></details></div>;}
const mode=new URLSearchParams(location.search).get('mode');
if(mode==='panel'){createRoot(document.getElementById('r12-ui')!).render(<PanelHarness/>);}
else if(mode==='title'){createRoot(document.getElementById('r12-ui')!).render(<TitleHarness/>);}
else if(mode==='studio'){
  await loadActiveConfig();await persistActiveConfig(config,true);createRoot(document.getElementById('r12-ui')!).render(<ConfigStudio onClose={()=>undefined} mountedRecords={[]}/>);
}else createRoot(document.getElementById('r12-ui')!).render(<React.StrictMode><Harness/></React.StrictMode>);
