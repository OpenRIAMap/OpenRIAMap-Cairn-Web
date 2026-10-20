import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser();checks=[]
def js(s):return b.evaluate(s)
def count():return js("[...document.querySelectorAll('.leaflet-container .leaflet-marker-icon')].filter(el=>['Alpha','Beta'].includes(el.textContent.trim())).length")
try:
    b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/render-acceptance.html?subject=1&class=SBP&scenario=singlePoint'})
    b.wait('!!window.acceptance?.map',35);js('window.acceptance.upgrade();true');b.wait('window.acceptance.config.contractRevision===12')
    js("""(()=>{const a=window.acceptance;const c=structuredClone(a.config),p=c.nodes.find(n=>n.nodeId==='class-sbp').geometryProfiles.Point,r=structuredClone(p.zoomPriority.rules.find(r=>r.label?.visible)??p.zoomPriority.rules[0]);r.id='bounds-test';r.representation='point';r.when={zoom:{min:0,max:8}};r.label.visible=true;r.label.placement='center';r.label.offsetX=0;r.label.offsetY=0;r.label.withDot=false;r.extensions.anchor={strategy:'featureCenter',candidates:['C'],candidatePlacement:'aroundAnchor'};r.extensions.density={...r.extensions.density,enabled:false};r.extensions.stability={...r.extensions.stability,enabled:false};r.style={symbolVisibility:'withLabel',symbolAnchor:'geometry',pointSymbol:{kind:'externalImage',image:{mode:'fixed',url:'/icons/pinhead/v25/bus.svg',presentation:{sizePx:{width:24,height:24},placement:{anchor:{mode:'center'},offsetPx:{x:0,y:0}}}},fallback:{pointShape:'circle',size:5,weight:1,lineCap:'round',lineJoin:'round',stroke:{mode:'fixed',color:'#334155'},fill:{mode:'fixed',color:'#2563eb'},strokeOpacity:1,fillOpacity:1}}};p.zoomPriority.rules=[r];a.setConfig(c);window.boundsConfig=c;const features=['Alpha','Beta'].map((name,i)=>{const w=a.projection.latLngToLocation(a.map.containerPointToLatLng([420+i*150,450]));return {ID:'bounds-'+i,Name:name,World:'zth',Class:'SBP',Type:'Points',CoordP:[[w.x,w.y,w.z]]};});a.setDataset({features});return true;})()""")
    b.wait("document.querySelectorAll('.leaflet-container img[src$=\"/icons/pinhead/v25/bus.svg\"]').length===2",30);time.sleep(.4);assert count()==2,count()
    js("(()=>{const c=structuredClone(window.boundsConfig);c.nodes.find(n=>n.nodeId==='class-sbp').geometryProfiles.Point.zoomPriority.rules[0].style.pointSymbol.image.presentation.sizePx={width:240,height:40};window.acceptance.setConfig(c);return true;})()")
    time.sleep(.7);assert count()==1,count()
    assert js("document.querySelectorAll('.leaflet-container img[src$=\"/icons/pinhead/v25/bus.svg\"]').length")==1
    checks.append('same URL 24px→240px updates actual withLabel rectangle; overlapping image/Label combinations reduce from2 to1')
    b.screenshot('with-label-image-bounds.png')
    js('window.acceptance.setConfig(structuredClone(window.boundsConfig));true');time.sleep(.7);assert count()==2
    checks.append('restoring per-image width restores2 visible combinations without stale occupancy or duplicate image')
    assert not b.errors,b.errors
    (OUT/'r12-bounds-results.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');print('r12 image occupancy:2 groups passed',flush=True)
except Exception:
    b.screenshot('bounds-failure.png');(OUT/'r12-bounds-failure.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'body':js('document.body.innerText')},ensure_ascii=False,indent=2),encoding='utf-8');raise
finally:b.ws.close()
