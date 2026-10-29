// Local-only physical-click tests of the production rule-driven renderer.
import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigRuntimePreview } from '../../src/configStudio/ConfigRuntimePreview';
import { editableGeometryProfile } from '../../src/configStudio/renderRuleTemplates';
import { basePointFromLegacy, defaultSymbolPlacement } from '../../src/configStudio/pointSymbol';
import { validateConfigPackage } from '../../src/configStudio/runtime';
import { applyApplicationSettings } from '../../src/core/project/applicationRuntime';
import type { CategoryNode, ConfigPackageV3 } from '../../src/configStudio/types';
import '../../src/styles/index.css';

const identity=await(await fetch('/configuration/current.json')).json();
const base:ConfigPackageV3=await(await fetch(identity.configUrl)).json();
applyApplicationSettings(base.application);
const events:Array<{open:boolean;id:unknown}>=[];
window.addEventListener('ria:ruleFeatureCardState',((event:CustomEvent)=>events.push({open:event.detail.open,id:event.detail.feature?.id??event.detail.feature?.featureInfo?.ID})) as EventListener);
function Harness(){
  const [mode,setMode]=useState('polygon-icon'),[enabled,setEnabled]=useState(true),[label,setLabel]=useState(false),[epoch,setEpoch]=useState(0);
  const config=useMemo(()=>{
    const next=structuredClone(base),polygon=mode.startsWith('polygon'),geometry=polygon?'Polygon':'Point';
    const profile=editableGeometryProfile(geometry,17),rule=profile.zoomPriority.rules[0];
    rule.when={zoom:{min:0,max:8}};rule.representation=polygon?'point':'geometry';
    rule.label={visible:label,source:'Name',style:{family:'bubble-dark',size:14},placement:'E',offsetX:24,offsetY:1.7,collision:{role:'optional',basePriority:2500,hideWhenColliding:true}};
    rule.interaction={triggers:{point:enabled,label:false,line:false,boundary:false,interior:false}};
    const fallback=basePointFromLegacy({size:4},17);
    rule.style={symbolVisibility:'independent',symbolAnchor:'geometry',pointSymbol:mode.endsWith('icon')?{kind:'icon',icon:{mode:'single',item:{library:'pinhead',id:'plane_up',sizePx:15,foreground:{mode:'fixed',color:'#000000'},foregroundOpacity:1,placement:{...defaultSymbolPlacement(),offsetPx:{x:4,y:-3}},halo:{enabled:true,widthPx:1.5,color:{mode:'fixed',color:'#ffffff'}}}},fallback}:{kind:'externalImage',image:{mode:'fixed',sourceForm:'library',url:mode==='missing-image'?'/image-library/not-present.png':'/image-library/N1.png',presentation:{sizePx:{width:32,height:32},placement:{...defaultSymbolPlacement(),offsetPx:{x:4,y:-3}},halo:{enabled:true,widthPx:1.5,color:{mode:'fixed',color:'#ffffff'}}}},fallback}};
    profile.zoomPriority.rules=[rule];
    const node:CategoryNode={nodeId:'physical-icon-hit',geometryType:geometry,path:{class:'HIT'},children:[],geometryProfiles:{[geometry]:profile},classificationLabels:{class:{zh:'点击测试',en:'Hit test'}},fields:[{fieldId:'hit-name',key:'Name',type:'string',input:'text',cardinality:'single',required:true,labels:{zh:'命中测试',en:'Hit test'},description:{zh:'',en:''}}],card:{mode:"fields",items:[{id:'hit-name-card',renderer:'text',source:'Name',label:{zh:'命中名称',en:''},visible:true,section:'main'}]}};
    next.nodes.push(node);return next;
  },[mode,enabled,label]);
  const node=config.nodes.find(node=>node.nodeId==='physical-icon-hit')!;
  Object.assign(window,{iconHitAcceptance:{config,events,report:validateConfigPackage(config)}});
  return <main className="config-editor cm-editor-design p-4"><div className="flex gap-3">
    <label>场景<select aria-label="点击场景" value={mode} onChange={e=>{setMode(e.target.value);setEpoch(value=>value+1);}}>{['polygon-icon','point-icon','polygon-image','point-image','missing-image'].map(mode=><option key={mode}>{mode}</option>)}</select></label>
    <label><input aria-label="点击点" type="checkbox" checked={enabled} onChange={e=>{setEnabled(e.target.checked);}}/>点击点</label>
    <label><input aria-label="显示 Label" type="checkbox" checked={label} onChange={e=>{setLabel(e.target.checked);}}/>显示 Label</label>
    <button onClick={()=>setEpoch(value=>value+1)}>重建预览</button></div>
    <section className="mt-3 h-[700px] w-[1000px]" aria-label="图标实际点击地图"><ConfigRuntimePreview key={epoch} config={config} node={node} scenario={mode.startsWith('polygon')?'smallPolygon':'singlePoint'} onMapReady={map=>Object.assign(window,{iconHitMap:map})}/></section>
  </main>;
}
createRoot(document.getElementById('icon-hit-test')!).render(<Harness/>);
