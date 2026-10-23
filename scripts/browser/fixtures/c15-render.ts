import {createNativePathHitProxy} from '../../../src/components/Rules/rendering/nativePathHitProxy';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {bindGeometryHalo,nativeImageIcon} from '../../../src/components/Rules/rendering/geometryHalo';
import {makeConfigShapeMarker} from '../../../src/components/Rules/rendering/configShapeMarker';
import {pointSymbolMetrics} from '../../../src/components/Rules/rendering/pointSymbolMetrics';
import {composeIconSvg,iconCompositionStats} from '../../../src/configStudio/iconComposition';
import {defaultSymbolPlacement} from '../../../src/configStudio/pointSymbol';
import type {IconItem} from '../../../src/configStudio/types';
const frame=()=>new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
const check=(value:unknown,message:string)=>{if(!value)throw Error(message);};
let activeObservers=0;
const NativeObserver=window.MutationObserver;
window.MutationObserver=class extends NativeObserver{active=false;override observe(target:Node,options?:MutationObserverInit){if(!this.active){activeObservers++;this.active=true;}super.observe(target,options);}override disconnect(){if(this.active){activeObservers--;this.active=false;}super.disconnect();}};
const longTasks:Array<{startTime:number;duration:number}>=[];if(PerformanceObserver.supportedEntryTypes?.includes('longtask'))new PerformanceObserver(list=>{for(const entry of list.getEntries())longTasks.push({startTime:entry.startTime,duration:entry.duration});}).observe({entryTypes:['longtask']});
const map=L.map('map',{crs:L.CRS.Simple,zoomControl:false,attributionControl:false,zoomAnimation:false}).setView([0,0],1);
const checks:string[]=[];
const pixels=async(svg:string)=>{const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const c=canvas.getContext('2d')!;const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await img.decode();c.drawImage(img,(128-img.width)/2,(128-img.height)/2);return c.getImageData(0,0,128,128).data;};
const percentile=(values:number[],p:number)=>[...values].sort((a,b)=>a-b)[Math.min(values.length-1,Math.ceil(values.length*p)-1)];
Object.assign(window,{runC15RenderChecks:async(performanceChecks=true)=>{
 checks.length=0;map.setView([0,0],1,{animate:false});await frame();const baseline=Object.values((map as any)._layers).filter(layer=>!(layer instanceof L.Renderer)).length;
 for(const shape of ['circle','square','triangle','regular4','regular5','regular6'])for(const opacity of [1,.9,.5])for(const weight of [0,3.5]){
  const base={kind:'shape',shape,radius:12.5,style:{color:'#0000ff',fillColor:'#00ff00',weight,opacity,fillOpacity:opacity,lineCap:'round',lineJoin:'round'}};
  const off=makeConfigShapeMarker(L.latLng(0,0),base,'markerPane',false),on=makeConfigShapeMarker(L.latLng(0,0),{...base,halo:{widthPx:3,color:'#ff00ff',cutout:true}},'markerPane',false);
  const a=await pixels(String(off.options.icon!.options.html)),b=await pixels(String(on.options.icon!.options.html));
  const solid=await pixels(String(makeConfigShapeMarker(L.latLng(0,0),{...base,style:{...base.style,opacity:1,fillOpacity:1}},'markerPane',false).options.icon!.options.html));
  for(let y=55;y<73;y++)for(let x=55;x<73;x++){const i=(y*128+x)*4;if([-1,0,1].every(dy=>[-1,0,1].every(dx=>solid[((y+dy)*128+x+dx)*4+3]===255)))check(Math.abs(a[i]-b[i])<3&&Math.abs(a[i+1]-b[i+1])<3&&Math.abs(a[i+2]-b[i+2])<3,`Halo leaked into ${shape} opacity ${opacity}`);}
 }
 checks.push('72 shape/opacity/zero-stroke pixel comparisons preserve original inner color');
 for(const radius of [0,.5,1,1.5,8,8.5]){
  const plan={kind:'shape',shape:'circle',radius,style:{weight:.5},halo:{widthPx:1.5,color:'#fff',cutout:true}};
  const marker=makeConfigShapeMarker(L.latLng(0,0),plan,'markerPane',pointSymbolMetrics(plan).visible).addTo(map);
  check(pointSymbolMetrics(plan).radius===radius,'fractional radius exact');
  check(radius>0?marker.getElement()!.querySelector('svg > g circle')!.getAttribute('r')===String(radius):!marker.getElement()!.querySelector('circle'),'zero shape and Halo invisible');marker.remove();
 }
 checks.push('circle decimals 0/.5/1/1.5/8/8.5; zero suppresses shape and halo');
 const cases:L.Path[]=[L.polyline([[-40,-100],[40,-60],[-20,-10]],{weight:8,dashArray:'8 4',dashOffset:'3',lineCap:'square',lineJoin:'bevel'}),L.polygon([[[60,0],[60,80],[0,80],[0,0]],[[45,20],[15,20],[15,55],[45,55]]],{weight:2,fillOpacity:1,color:'#99bbee'}),L.polygon([[[0,-100],[0,-60],[-40,-60],[-40,-100]],[[-50,0],[-50,40],[-80,40],[-80,0]]],{weight:3,fillOpacity:.45})];
 cases.forEach((path,i)=>{path.addTo(map);bindGeometryHalo(path,{widthPx:i===0?.5:3,color:'#fff',cutout:true,showInner:i===1});});await frame();
 check(document.querySelectorAll('.ria-geometry-halo').length===3,'single Halo per path');
 for(const path of cases){const original=path.getElement()!,ring=original.previousElementSibling!;check(ring.getAttribute('d')===original.getAttribute('d'),'projected geometry reused');check(ring.getAttribute('stroke-dasharray')===original.getAttribute('stroke-dasharray'),'dashes preserved');check((ring as SVGElement).style.pointerEvents==='none','Halo noninteractive');}
 check(cases[1].getElement()!.getAttribute('fill-opacity')==='0','opaque fill split so inner halo is visible');
 check(document.querySelectorAll('.ria-halo-original-fill').length===1,'one original fill, no opacity double paint');
 cases[0].setStyle({weight:10,dashArray:'3 9',dashOffset:'5'});map.setZoom(2);await frame();check(cases[0].getElement()!.previousElementSibling!.getAttribute('stroke-width')==='11','fractional path halo after update');
 bindGeometryHalo(cases[1]);check(cases[1].getElement()!.getAttribute('fill-opacity')==='1','opaque fill restored after off');
 for(let i=0;i<12;i++){cases[2].remove();cases[2].addTo(map);bindGeometryHalo(cases[2],{widthPx:i%2?2.5:0,color:'#fff',cutout:true,showInner:!!(i%2)});}
 cases.forEach(path=>path.remove());await frame();check(document.querySelectorAll('.ria-geometry-halo,.ria-halo-original-fill,mask').length===0,'path off/remove/readd clears all rings, masks and split fill');checks.push('dash/cap/join, hole/multipart, opaque inner layer, style/zoom/12 lifecycle cycles');
 for(const widthPx of [.5,1.5]){const marker=L.marker([0,0],{icon:nativeImageIcon({iconSize:[24.5,20.5],iconAnchor:[3.25,7.75],imageHalo:{widthPx,color:'#fff',cutout:true}},'/icons/pinhead/v25/bus.svg')}).addTo(map);const element=marker.getElement()!,img=element.querySelector('img')!,ring=element.querySelector('svg > rect')!;check(getComputedStyle(img).width==='24.5px','fractional image width retained');check(ring.getAttribute('stroke-width')===String(2*widthPx),'image halo fractional svg ring');check(marker.options.icon!.options.iconAnchor?.toString()==='3.25,7.75','image anchor retained');marker.remove();}
 checks.push('image rectangle .5/1.5px Halo; fractional image size and anchor');
 for(const [boundary,interior]of [[true,false],[false,true],[true,true],[false,false]]){
  const proxy=createNativePathHitProxy('Polygon',[],[[-10,-10],[-10,10],[10,10],[10,-10]],'overlayPane',4,3,{boundary,interior}).addTo(map) as L.Path;await frame();
  const element=proxy.getElement()!;const hit=(lat:number,lng:number)=>{const p=map.latLngToContainerPoint([lat,lng]),box=map.getContainer().getBoundingClientRect();return document.elementFromPoint(box.x+p.x,box.y+p.y)===element;};
  check(hit(0,0)===interior,'interior trigger has separate actual SVG hit surface');
  check(hit(10.5,0)===boundary,'boundary trigger controls outside stroke hit surface');
  let count=0;proxy.on('click',()=>count++);if(interior){const p=map.latLngToContainerPoint([0,0]),box=map.getContainer().getBoundingClientRect();element.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:box.x+p.x,clientY:box.y+p.y}));check(count===1,'single click executes once');}proxy.remove();
 }
 checks.push('actual SVG hit testing: polygon boundary/interior independent, no duplicate click');
 const item:IconItem={library:'pinhead',id:'bus',sizePx:24,foreground:{mode:'fixed',color:'#334455'},foregroundOpacity:.5,placement:defaultSymbolPlacement(),halo:{enabled:true,widthPx:2.5,color:{mode:'fixed',color:'#ff00ff'}}};const color=(binding:any,fallback:string)=>binding.mode==='fixed'?binding.color:fallback,path='M2 2 L14 2 L14 14 L2 14 Z';
 for(const shape of [undefined,'circle','square','roundedRect','pin'] as const){const value={...item,...(shape?{plate:{shape,paddingPx:2,fill:{mode:'fixed' as const,color:'#00ff00'},stroke:{mode:'fixed' as const,color:'#0000ff'},strokeWidthPx:1.5,fillOpacity:.5,strokeOpacity:.5}}:{})};check(composeIconSvg(value,path,color,true).includes('mask='),'icon exclusion mask');}
 const hits=iconCompositionStats.hits;for(let i=0;i<100;i++)composeIconSvg(item,path,color,true);check(iconCompositionStats.hits>=hits+99,'icon cache reused');checks.push('icons: no plate/circle/square/roundedRect/pin; stable cache key and 100 reuses');
 const scenes=['lines600','symbols600','icons600','polygons200','mixed1200'];const samples:Record<string,any[]>={};
 const measure=async(scene:string,cutout:boolean)=>{
  map.setView([0,0],2,{animate:false});await frame();const group=L.featureGroup().addTo(map);await frame();const begin=performance.now(),count=scene==='mixed1200'?1200:scene==='polygons200'?200:600;
  for(let i=0;i<count;i++){
   const y=(i%40)*2-40,x=Math.floor(i/40)*4-30,kind=scene==='mixed1200'?i%3:scene==='lines600'?0:scene==='symbols600'||scene==='icons600'?1:2;
   if(kind===1){const marker=scene==='icons600'||scene==='mixed1200'&&i%2?L.marker([y,x],{icon:L.icon({iconUrl:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(composeIconSvg(item,path,color,cutout)),iconSize:[32,32],iconAnchor:[16,16]}),interactive:false}):makeConfigShapeMarker(L.latLng(y,x),{kind:'shape',shape:i%2?'circle':'triangle',radius:4.5,style:{weight:1.5,opacity:.5,fillOpacity:.5},halo:{widthPx:1.5,color:'#fff',cutout}},'markerPane',false);group.addLayer(marker);}
   else{const p=kind===0?L.polyline([[y,x],[y+2,x+3],[y-1,x+5]],{weight:2.5,opacity:.5,dashArray:i%2?'3 4':undefined}):L.polygon([[[y,x],[y+3,x],[y+3,x+3],[y,x+3]],[[y+1,x+1],[y+1,x+2],[y+2,x+2],[y+2,x+1]]],{weight:1.5,fillOpacity:.5});group.addLayer(p);bindGeometryHalo(p,{widthPx:1.5,color:'#fff',cutout,showInner:i%2===0});}
  }
  const createMs=performance.now()-begin;await frame();const painted=group.getLayers().filter(layer=>layer instanceof L.Path?Boolean(layer.getElement()?.getAttribute('d')):layer instanceof L.Marker&&Boolean(layer.getElement())).length;check(painted===count,'all benchmark features are painted inside the reset viewport');const updates=[];
  for(let i=0;i<4;i++){await frame();const begin=performance.now();map.panBy([i%2?3:-3,2],{animate:false});await frame();updates.push(performance.now()-begin);}
  const result={paintedFeatures:painted,createMs,updateMs:percentile(updates,.95),updates,masks:document.querySelectorAll('mask').length,paths:document.querySelectorAll('path').length};group.remove();await frame();check(document.querySelectorAll('.ria-geometry-halo,.ria-halo-original-fill,mask').length===0&&activeObservers===0,'dense cleanup includes observers');return result;
 };
 if(performanceChecks)for(const scene of scenes){await measure(scene,false);await measure(scene,true);samples[scene]=[];for(let i=0;i<7;i++){const order=i%2?['c15','c14']:['c14','c15'];const row:any={};for(const mode of order)row[mode]=await measure(scene,mode==='c15');samples[scene].push(row);}}
 const summary=Object.fromEntries(Object.entries(samples).map(([scene,rows])=>{const modes=Object.fromEntries(['c14','c15'].map(mode=>[mode,{createMedian:percentile(rows.map(row=>row[mode].createMs),.5),createP95:percentile(rows.map(row=>row[mode].createMs),.95),updateP95:percentile(rows.flatMap(row=>row[mode].updates),.95)}]));return [scene,{...modes,creationTarget:modes.c15.createP95<=modes.c14.createP95*1.5+50,interactionTarget:modes.c15.updateP95-modes.c14.updateP95<=16.7}];}));
 check(Object.values((map as any)._layers).filter(layer=>!(layer instanceof L.Renderer)).length===baseline,'only SVG renderer remains after cleanup');
 return {checks:[...checks],device:{userAgent:navigator.userAgent,dpr:devicePixelRatio,viewport:[innerWidth,innerHeight]},samples,summary,remaining:{masks:document.querySelectorAll('mask').length,rings:document.querySelectorAll('.ria-geometry-halo').length,activeObservers},longTasks:PerformanceObserver.supportedEntryTypes?.includes('longtask')?longTasks:null,memory:(performance as any).memory?.usedJSHeapSize??null};
}});
