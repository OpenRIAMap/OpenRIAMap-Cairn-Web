import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../../src/styles/index.css';
import {V3WorkflowRunner} from '../../../src/configStudio/V3WorkflowRunner';
import {NativeWorkflowEditPanel} from '../../../src/components/Mapping/Workflow/NativeWorkflowEditPanel';
import {prepareNativeWorkflowCommit} from '../../../src/configStudio/nativeWorkflowCommit';
import {prepareNativeWorkflowEdit} from '../../../src/configStudio/workflowEditCommit';
import {compileWorkflowEditPlan,hydrateWorkflowEdit} from '../../../src/configStudio/workflowEditing';
import {syncWorkflowClassification} from '../../../src/configStudio/systemClassification';
import {drawingKey} from '../../../src/configStudio/workflowDrawing';
import {multipartGeometryFromSinglePath,readMultipartGeometry,type MultipartCoord} from '../../../src/core/geometry/multipartGeometry';
import {validateWorkflowDefinition} from '../../../src/configStudio/runtime';
import type {ConfigPackageV3,WorkflowDefinition,WorkflowStep} from '../../../src/configStudio/types';
import kernel from '../../../vendor/configuration-r11/manifest.json';
import formalIdentity from './workflow-classification-source.json';

const metrics={unexpectedRequests:[] as string[],trustedChanges:0,trustedClicks:0};
const nativeFetch=window.fetch.bind(window);
window.fetch=(input,init)=>{
 const url=new URL(input instanceof Request?input.url:String(input),location.href),method=(init?.method??(input instanceof Request?input.method:'GET')).toUpperCase();
 if(url.origin!==location.origin||url.pathname.startsWith('/api/')||!['GET','HEAD'].includes(method)){metrics.unexpectedRequests.push(method+' '+url.href);throw Error('Unexpected remote/business request in isolated acceptance.');}
 return nativeFetch(input,init);
};
document.addEventListener('change',event=>{if(event.isTrusted)metrics.trustedChanges++;});
document.addEventListener('click',event=>{if(event.isTrusted)metrics.trustedClicks++;});

const base:ConfigPackageV3=await fetch('./workflow-classification.config.json.gz').then(response=>response.json());
const formal:ConfigPackageV3=await fetch('./workflow-classification-water.config.json.gz').then(response=>response.json());
function Harness(){
 const [config,setConfig]=useState(base),[workflow,setWorkflow]=useState(base.workflows[0]),[generation,setGeneration]=useState(0),[active,setActive]=useState<string>(),[revision,setRevision]=useState(0);
 const [mode,setMode]=useState<'capture'|'edit'>('capture'),[record,setRecord]=useState<Record<string,unknown>>(),[status,setStatus]=useState(''),[error,setError]=useState('');
 const [draft,setDraft]=useState<ReturnType<typeof hydrateWorkflowEdit>>(),[editor,setEditor]=useState('tester');
 const [pageKind,setPageKind]=useState('actor');
 const mapElement=useRef<HTMLDivElement>(null),map=useRef<L.Map>(),drawing=useRef<MultipartCoord[]>([]),layers=useRef<L.LayerGroup>(),current=useRef({active,mode,type:workflow.outputs[0].geometry.selected});
 current.current={active,mode,type:workflow.outputs[0].geometry.selected};
 useEffect(()=>{
   const instance=L.map(mapElement.current!,{crs:L.CRS.Simple,zoomControl:false,attributionControl:false}).setView([0,0],1);map.current=instance;layers.current=L.layerGroup().addTo(instance);
   instance.on('click',event=>{if(!current.current.active)return;const point={x:Math.round(event.latlng.lng),y:64,z:-Math.round(event.latlng.lat)};
     drawing.current=current.current.type==='Point'?[point]:[...drawing.current,point];layers.current!.clearLayers();
     const points=drawing.current.map(point=>L.latLng(-point.z,point.x));
     (current.current.type==='Point'?L.circleMarker(points[0],{radius:6}):current.current.type==='Polygon'&&points.length>=3?L.polygon(points):L.polyline(points)).addTo(layers.current!);
     setRevision(value=>value+1);
   });return ()=>instance.remove();
 },[]);
 const reset=(kind='mixed')=>{
   let next=structuredClone(base),flow=next.workflows[0];
   if(kind==='water'){next=structuredClone(formal);flow=next.workflows.find(row=>row.id==='v3-isg_ngf_wtb')!;}
   if(kind==='single'){flow.outputs[0].classificationGroup!.selectors=[{id:'single',mode:'self',path:{class:'WFTEST'}}];flow=syncWorkflowClassification(next,flow);}
   if(kind==='polygon'){flow.outputs[0].geometry.selected='Polygon';flow.steps.find(step=>step.kind==='geometry')!.geometry=['Polygon'];flow.steps.find(step=>step.kind==='geometry')!.drawing!.returnFormat='coordG';flow=syncWorkflowClassification(next,flow);}
   setConfig(next);setWorkflow(flow);setGeneration(value=>value+1);setMode('capture');setActive(undefined);setStatus('');setError('');drawing.current=[];layers.current?.clearLayers();
 };
 const enterEdit=()=>{try{
   if(!record)throw Error('请先保存一条要素。');
   const flow={...base.workflows[0],editor:{enabled:true,scope:{class:'WFTEST'}}};
   const plan=compileWorkflowEditPlan(flow,base);setDraft(hydrateWorkflowEdit(plan,record));setConfig(base);setWorkflow(flow);setMode('edit');setStatus('');setError('');setActive(flow.outputs[0].id);
   const geometry=readMultipartGeometry(record,'Point').geometry!;drawing.current=geometry.type==='Point'?geometry.parts:[];
 }catch(error){setError(String(error));}};
 const plan=mode==='edit'?compileWorkflowEditPlan(workflow,config):undefined;
 const state={generation,mode,status,error,record,pageKind,metrics,kernel:kernel.sha256,formalIdentity,workflowReport:validateWorkflowDefinition(workflow,config),coordinates:drawing.current.length};
 (window as any).classificationHarness=()=>state;
 return <main style={{padding:20,maxWidth:1120,margin:'auto'}}>
   <h1 className="mb-3 text-lg font-semibold">工作流分类实际操作验收</h1>
   <div className="mb-4 flex flex-wrap gap-2">{[['mixed','混合层级'],['water','当前水域'],['single','单个精确分类'],['polygon','混合树只绘制面']].map(([id,label])=><button key={id} id={'scenario-'+id} className="rounded border px-3 py-1" onClick={()=>reset(id)}>{label}</button>)}<button id="edit" className="rounded border px-3 py-1" onClick={enterEdit}>编辑已保存要素</button><button id="invalidate" className="rounded border px-3 py-1" onClick={()=>setConfig({...config,nodes:config.nodes.filter(node=>node.nodeId!=='test-skind2')})}>移除深层候选</button></div>
   <div className="grid grid-cols-2 items-start gap-5"><div id="workflow">
    {mode==='edit'&&plan&&draft?<><NativeWorkflowEditPanel config={config} plan={plan} draft={draft} onChange={setDraft} records={[]} world="zth" editor={editor} onEditorChange={setEditor} onCancel={()=>reset()}/><button id="save-edit" className="mt-3 rounded bg-blue-600 px-3 py-1 text-white" onClick={()=>{try{const next=prepareNativeWorkflowEdit(config,workflow,record!,draft,multipartGeometryFromSinglePath('Point',drawing.current),'zth',editor,[]);setRecord(next);setStatus('编辑已保存');setError('');}catch(error){setError(String(error));}}}>保存编辑</button></>:<V3WorkflowRunner key={generation} config={config} workflow={workflow} worldId="zth" initialActor="tester" activeDrawingKey={active} drawingRevision={revision}
     onStepChange={(step?:WorkflowStep)=>{setPageKind(step?.kind??'');setActive(step?.kind==='geometry'?drawingKey(step):undefined);}}
     onCaptureGeometry={()=>({coordinates:drawing.current,geometry:multipartGeometryFromSinglePath(workflow.outputs[0].geometry.selected,drawing.current)})}
     onRequestGeometry={id=>{setActive(id);}}
     onSubmit={outputs=>{const result=prepareNativeWorkflowCommit(config,workflow,outputs,'zth');setRecord(result[0].record);setStatus('采集已保存');setError('');}}/>}
   </div><div><div ref={mapElement} id="map" style={{height:340,background:'#e7eef5',border:'1px solid #bdc7d2',borderRadius:8}}/><p className="mt-2 text-sm">进入绘制页后点击地图采集坐标。{drawing.current.length} 个点。</p></div></div>
   <p id="status" className="mt-3 text-emerald-700">{status}</p><p id="error" role={error?'alert':undefined} className="text-rose-700">{error}</p>
   <pre id="record" className="mt-4 max-h-64 overflow-auto rounded bg-slate-100 p-3 text-xs">{JSON.stringify(record??null,null,2)}</pre>
 </main>;
}
createRoot(document.getElementById('root')!).render(<Harness/>);
