import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {bindGeometryHalo,nativeImageIcon} from '../../../src/components/Rules/rendering/geometryHalo';
import {composeIconSvg,iconCompositionStats} from '../../../src/configStudio/iconComposition';
import {defaultIconItem} from '../../../src/configStudio/PointSymbolEditor';
const frame=()=>new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
const check=(condition:unknown,message:string)=>{if(!condition)throw Error(message);};
const map=L.map('map',{crs:L.CRS.Simple,zoomControl:false,attributionControl:false}).setView([0,0],1);
Object.assign(window,{runC14RenderChecks:async()=>{
  const businessLayerCount=()=>Object.values((map as unknown as {_layers:Record<string,L.Layer>})._layers).filter(layer=>!(layer instanceof L.Renderer)).length;
  const baselineLayers=businessLayerCount();
  const cases:L.Path[]=[
    L.polyline([[-40,-100],[40,-60],[-20,-10]],{weight:8,dashArray:'8 4',dashOffset:'3',lineCap:'square',lineJoin:'bevel'}),
    L.polygon([[[60,0],[60,80],[0,80],[0,0]],[[45,20],[15,20],[15,55],[45,55]]],{weight:2,fillOpacity:0,color:'#99bbee'}),
    L.polygon([[[0,-100],[0,-60],[-40,-60],[-40,-100]],[[-50,0],[-50,40],[-80,40],[-80,0]]],{weight:3,fillOpacity:.45}),
    L.circleMarker([40,100],{radius:12,weight:0,fillOpacity:1}),
  ];
  cases.forEach((path,i)=>{path.addTo(map);bindGeometryHalo(path,{widthPx:i===0?.5:3,color:'#ffffff'});});
  await frame();
  check(document.querySelectorAll('.ria-geometry-halo').length===4,'one halo per projected path');
  for(const path of cases){const original=path.getElement()!,halo=original.previousElementSibling!;check(halo.getAttribute('d')===original.getAttribute('d'),'holes/multipart share projected coordinates');check(halo.getAttribute('pointer-events')!=='auto'&&(halo as SVGElement).style.pointerEvents==='none','no duplicate interaction');check(halo.getAttribute('stroke-dasharray')===original.getAttribute('stroke-dasharray'),'dash preserved');}
  cases[0].setStyle({weight:10,dashArray:'3 9',dashOffset:'5'});map.setZoom(2);await frame();
  check(cases[0].getElement()!.previousElementSibling!.getAttribute('stroke-width')==='11','half CSS pixel halo survives zoom');
  check(cases[0].getElement()!.previousElementSibling!.getAttribute('d')===cases[0].getElement()!.getAttribute('d'),'zoom projection reused');
  bindGeometryHalo(cases[0],{widthPx:0,color:'#ffffff'});check(document.querySelectorAll('.ria-geometry-halo').length===3,'zero disables extra path');
  cases[1].remove();check(document.querySelectorAll('.ria-geometry-halo').length===2,'remove cleans halo');cases[1].addTo(map);check(document.querySelectorAll('.ria-geometry-halo').length===3,'readd restores single halo');
  bindGeometryHalo(cases[1]);check(!cases[1].getElement()!.previousElementSibling?.classList.contains('ria-geometry-halo'),'rule off cleans halo');
  const image=nativeImageIcon({iconSize:[24,20],iconAnchor:[3,7],imageHalo:{widthPx:4,color:'#ffffff'}},'/icons/pinhead/v25/bus.svg');
  check(image.options.iconSize?.toString()==='24,20'&&image.options.iconAnchor?.toString()==='3,7','image size/anchor unchanged');
  const marker=L.marker([0,120],{icon:image}).addTo(map);await frame();const img=marker.getElement()!.querySelector('img')!;check(getComputedStyle(img).outlineWidth==='4px','image rectangular outline');check(getComputedStyle(img).width==='24px','image not enlarged');
  const item=defaultIconItem(14);item.halo!.enabled=true;const color=(binding:typeof item.foreground,fallback:string)=>binding.mode==='fixed'?binding.color:fallback;
  const path='M2 2 L14 2 L14 14 L2 14 Z';composeIconSvg(item,path,color);const hits=iconCompositionStats.hits;for(let i=0;i<100;i++)composeIconSvg(item,path,color);check(iconCompositionStats.hits===hits+100,'composed SVG cache reused');
  cases.forEach(path=>path.remove());marker.remove();check(document.querySelectorAll('.ria-geometry-halo').length===0,'no residue');
  const measure=async(enabled:boolean)=>{const group=L.featureGroup().addTo(map);const begin=performance.now();for(let i=0;i<600;i++){const y=(i%40)*2-40,x=Math.floor(i/40)*4-30;const p=L.polyline([[y,x],[y+2,x+3],[y-1,x+5]],{weight:2});group.addLayer(p);if(enabled)bindGeometryHalo(p,{widthPx:2,color:'#fff'});}await frame();const createMs=performance.now()-begin,update=performance.now();map.panBy([3,2],{animate:false});await frame();const updateMs=performance.now()-update,result={createMs,updateMs,paths:document.querySelectorAll('path').length,halos:document.querySelectorAll('.ria-geometry-halo').length,businessLayers:group.getLayers().length};group.remove();await frame();check(document.querySelectorAll('.ria-geometry-halo').length===0,'dense cleanup');return result;};
  const samples=[];for(let i=0;i<3;i++)samples.push({off:await measure(false),on:await measure(true)});
  check(businessLayerCount()===baselineLayers,'business layers cleaned');
  const memory=(performance as unknown as {memory?:{usedJSHeapSize:number;totalJSHeapSize:number;jsHeapSizeLimit:number}}).memory;
  return {checks:['line dash/cap/join/update/zoom','transparent polygon with hole and multipart','circle with no stroke','zero/off/remove/readd cleanup','image rectangle with original size and custom anchor','100 SVG cache hits','600-path off/on creation and pan comparison'],device:{userAgent:navigator.userAgent,dpr:devicePixelRatio,hardwareConcurrency:navigator.hardwareConcurrency},samples,memory:memory?{usedJSHeapSize:memory.usedJSHeapSize,totalJSHeapSize:memory.totalJSHeapSize,jsHeapSizeLimit:memory.jsHeapSizeLimit}:null};
}});
