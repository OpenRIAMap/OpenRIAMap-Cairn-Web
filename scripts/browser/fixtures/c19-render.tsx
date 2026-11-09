import { createRoot } from 'react-dom/client';
import type { Map as LeafletMap } from 'leaflet';
import { ConfigRuntimePreview } from '../../../src/configStudio/ConfigRuntimePreview';
import { migratePackageToContract } from '../../../src/configStudio/contractMigration';
import { validateConfigPackage } from '../../../src/configStudio/runtime';
import { defaultSymbolBehavior } from '../../../src/configStudio/c19Render';
import { basePointFromLegacy } from '../../../src/configStudio/pointSymbol';
import { defaultHalo } from '../../../src/configStudio/halo';
import type { ConfigPackageV3, RenderColorBinding } from '../../../src/configStudio/types';

const digest='20fda5b8d97d17c95473ae1aa3ef4e07685ccf00448260eab9c07cbc20d388cc';
const source = await fetch('/configuration/releases/'+digest+'/config.json').then(response=>response.json()) as ConfigPackageV3;
const config = migratePackageToContract(source).config;
const area = config.nodes.find(item=>item.path.class==='PTA'&&item.path.kind==='AIR'&&item.geometryProfiles.Polygon?.zoomPriority.rules.length)!;
const point = config.nodes.find(item=>item.path.class==='TRP'&&!item.path.kind&&item.geometryProfiles.Point?.zoomPriority.rules.length)!;
const areaRule = area.geometryProfiles.Polygon!.zoomPriority.rules.find(item=>item.when!.zoom.min<=6&&item.when!.zoom.max>=6)!;
const pointRule = point.geometryProfiles.Point!.zoomPriority.rules.find(item=>item.when!.zoom.min<=6&&item.when!.zoom.max>=6)!;
const color = (value:string):RenderColorBinding=>({mode:'fixed',color:value});
const shape = (fill:string)=>({ ...basePointFromLegacy({size:7,fill:color(fill),stroke:color(fill),weight:1},19),halo:defaultHalo(),behavior:defaultSymbolBehavior() });
const ring = (x:number,z:number,r:number) => [[x-r,-64,z-r],[x+r,-64,z-r],[x+r,-64,z+r],[x-r,-64,z+r]];
const features = (count:number)=>Array.from({length:count},(_,i)=>{
  const x=count===2?0:(i%20-10)*7,z=count===2?0:(Math.floor(i/20)-9)*7;
  const p=i%2===0, path=p?area.path:point.path;
  return {ID:'c19-fixture-'+i,Name:p?'C19 area '+i:'C19 point '+i,World:'zth',Class:path.class,Kind:path.kind,SKind:path.skind,SKind2:path.skind2,
    ...(p?{Type:'Polygon',CoordG:[[ring(x,z,12),ring(x-4,z-4,2)],[ring(x+20,z+20,4)]]}:{Type:'Points',CoordP:[[x,-64,z]]})};
});
const root=createRoot(document.querySelector('#root')!);
let map:LeafletMap|undefined;
const errors:string[]=[];
const panePrefix='leaflet-ria-c19-geometry-';
const pane=(el:Element|null)=>el?.closest('.leaflet-pane[class*="'+panePrefix+'"]') as HTMLElement|null;
const wait=async(predicate:()=>boolean)=>{
  const end=performance.now()+10000;
  while(performance.now()<end){if(predicate())return;await new Promise(resolve=>setTimeout(resolve,30));}
  throw Error('Timed out waiting for rendered fixture '+JSON.stringify(stats()));
};
const stats=()=>({
  buckets:document.querySelectorAll('.leaflet-pane[class*="'+panePrefix+'"][class*="-z"]').length,
  paths:document.querySelectorAll('svg path').length,
  symbols:document.querySelectorAll('.ria-config-shape-marker').length,
  errors,
});
const getShape=(fill:string)=>[...document.querySelectorAll('.ria-config-shape-marker svg [fill]')].find(el=>el.getAttribute('fill')===fill)??null;
const getArea=()=>document.querySelector('path[stroke="#e00000"]');
const mount=(areaZ:number,pointZ:number,count:number)=>{
  const candidate=structuredClone(config);
  const candidateArea=candidate.nodes.find(node=>node.nodeId===area.nodeId)!;
  const candidatePoint=candidate.nodes.find(node=>node.nodeId===point.nodeId)!;
  const a=candidateArea.geometryProfiles.Polygon!.zoomPriority.rules.find(rule=>rule.id===areaRule.id)!;
  const b=candidatePoint.geometryProfiles.Point!.zoomPriority.rules.find(rule=>rule.id===pointRule.id)!;
  a.representation='geometryWithPoint';a.geometryStack={zLevel:areaZ};
  a.multipartAnchor='featureBbox';a.interaction={triggers:{point:true}};
  a.style={...a.style,stroke:color('#e00000'),fill:color('#ee2200'),weight:3,
    midpoint:{pointSymbol:{kind:'shape',mode:'fixed',shape:shape('#00bb00')}}};
  a.label={...a.label!,visible:true,source:'Name',placement:'center'};
  a.logic!.overrides.admission={screenGate:{mode:'override',minScreenAreaPx:0}};
  b.representation='geometry';b.geometryStack={zLevel:pointZ};
  b.style={pointSymbol:{kind:'shape',mode:'valueMap',shape:shape('#00bbee'),mapping:{field:'ID',entries:[{value:'c19-fixture-1',item:shape('#0022ee')}]}}};
  b.label={...b.label!,visible:false};
  b.logic!.overrides.admission={screenGate:{mode:'override'}};
  const validation=validateConfigPackage(candidate);
  if(!validation.valid)throw Error(JSON.stringify(validation.issues.filter(issue=>issue.severity==='error').slice(0,8)));
  root.render(<ConfigRuntimePreview config={candidate} node={candidateArea} scenario="smallPolygon" fixture={{features:features(count)}} onMapReady={value=>{map=value;}} onRuntimeError={error=>errors.push(error.message)}/>);
};
Object.assign(window,{runC19RenderChecks:async()=>{
  const begin=performance.now();
  mount(800,700,2);
  await wait(()=>Boolean(getArea()?.getAttribute('d')?.includes('L')&&getShape('#00bb00')&&getShape('#0022ee')));
  if(pane(getArea())?.parentElement!==pane(getShape('#0022ee'))?.parentElement)throw Error('Point and path do not share the same outer layer');
  if(Number(pane(getArea())?.style.zIndex)<=Number(pane(getShape('#0022ee'))?.style.zIndex))
    throw Error('Higher-z path must paint above the point');
  if(Number(pane(getShape('#00bb00'))?.style.zIndex)<=Number(pane(getArea())?.style.zIndex))
    throw Error('Midpoint must paint above its area at the same z');
  if(!getShape('#00bb00')?.closest('.leaflet-interactive'))throw Error('A midpoint-only click trigger needs a hit target');
  if((getArea()?.getAttribute('d')?.match(/M/g)?.length??0)<3)throw Error('Multipart area lost a ring or hole');
  const creationMs=performance.now()-begin;
  mount(650,700,2);
  await wait(()=>Boolean(pane(getArea())&&Number(pane(getArea())!.style.zIndex)<Number(pane(getShape('#0022ee'))?.style.zIndex)));
  const start=performance.now();
  mount(800,700,360);
  await wait(()=>stats().symbols>=100);
  const denseCreateMs=performance.now()-start;
  const dense=stats();
  const update=performance.now();
  map?.panBy([8,0],{animate:false});
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const denseUpdateMs=performance.now()-update;
  root.unmount();
  await new Promise(resolve=>requestAnimationFrame(resolve));
  const after=stats();
  if(after.buckets||after.symbols||errors.length)throw Error('Unexpected cleanup/runtime results '+JSON.stringify(after));
  return {creationMs,denseCreateMs,denseUpdateMs,dense,after};
}});
