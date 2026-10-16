"""Actual App/Lab, animated zooms, same frozen downstream data transport."""
import sync01_transport
sync01_transport.install()
import json,time
from browser_check import Browser,APP_URL,OUT
from app_probe import PROBE
b=Browser();rows=[]
b.call('Page.navigate',{'url':APP_URL+'/?workspace=config-lab&configMode=v3'})
b.wait("!!document.querySelector('.leaflet-container')",40)
b.wait(PROBE.replace('return map&&projection?', 'return map&&projection&&records.length>=463?'),45)
host=b.evaluate(PROBE);assert host['contract']==11
center=b.evaluate("(()=>{const a=window.appProbe,rails=a.records.filter(r=>r.meta.Class==='RLE'&&String(r.featureInfo.direction)==='3').sort((a,b)=>(b.coords3?.length??0)-(a.coords3?.length??0));const pts=rails[0].coords3.map(p=>a.projection.locationToLatLng(p.x,p.y,p.z));const lat=pts.map(p=>p.lat),lng=pts.map(p=>p.lng);return [(Math.min(...lat)+Math.max(...lat))/2,(Math.min(...lng)+Math.max(...lng))/2];})()")
b.evaluate('window.appProbe.map.setView('+json.dumps(center)+',1,{animate:false});true')
b.wait("window.RIA?.debug.lineLabels?.()?.zoomLevel===4",15);time.sleep(.3)
initial=b.evaluate("window.RIA.debug.lineLabels().rows.filter(r=>r.classCode==='RLE'&&r.displayed)")
assert initial,'real data scene has no initial RLE code labels'
for level in [1,0,4,0,4,1,4]:
 b.evaluate('window.appProbe.map.setView('+json.dumps(center)+','+str(level-3)+',{animate:true});true')
 b.wait('window.RIA?.debug.lineLabels?.()?.zoomLevel==='+str(level)+'&&!window.appProbe.map._animatingZoom',15);time.sleep(.3)
 live=b.evaluate("window.RIA.debug.lineLabels().rows.filter(r=>r.classCode==='RLE').map(r=>({id:r.id,displayed:r.displayed,expected:r.expectedLabel,text:r.labelText}))")
 if level<2:assert not any(r['displayed'] for r in live),(level,live)
 else:assert any(r['displayed'] for r in live),(level,'no labels after re-entry')
 rows.append({'zoom':level,'rails':live})
 # Real pan with the last zoom's state, not a synthetic renderer reset.
 b.evaluate('window.appProbe.map.panBy([100,-35],{animate:false});true');time.sleep(.3)
 if level<2:assert not b.evaluate("window.RIA.debug.lineLabels().rows.some(r=>r.classCode==='RLE'&&r.displayed)")
assert not b.errors,b.errors
b.screenshot('lifecycle-app.png')
(OUT/'app-lifecycle.json').write_text(json.dumps({'url':APP_URL,'host':host,'initialCodes':len(initial),'checks':rows,'runtimeErrors':b.errors,'transport':'unchanged frozen downstream responses; not a production backend availability check'},ensure_ascii=False,indent=2),encoding='utf-8')
print('Actual App/Lab animated zoom and pan: '+str(len(initial))+' initial codes, low Zoom none, re-entry recalculates; runtime errors 0',flush=True);b.ws.close()
