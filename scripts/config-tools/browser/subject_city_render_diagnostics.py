"""Whole-data V1/V3 city diagnostics; never a pixel-parity pass assertion."""
import json,time
from sync01_transport import install
install()
from browser_check import Browser,APP_URL,OUT
from app_probe import PROBE
b=Browser();rows=[]
for mode in ['v1','v3']:
 b.call('Page.navigate',{'url':APP_URL+'/?workspace=config-lab&configMode='+mode})
 b.wait(PROBE.replace('return map&&projection?','return map&&projection&&records.length===495?'),45)
 b.evaluate("window.addEventListener('ria:mobileFloorPanelState',e=>window.floorState=e.detail);window.appProbe.map.setView(window.appProbe.projection.locationToLatLng(5480,64,4850),3,{animate:false});true")
 time.sleep(.6)
 for level in [0,1,2,3,5,6,8]:
  b.evaluate('window.appProbe.map.setZoom('+str(level-3)+',{animate:false});true');time.sleep(.4)
  info=b.evaluate("({text:[...document.querySelectorAll('.leaflet-marker-icon')].map(e=>e.textContent.trim()),paths:[...document.querySelectorAll('.leaflet-pane svg path')].map(e=>({stroke:e.getAttribute('stroke'),fill:e.getAttribute('fill'),width:e.getAttribute('stroke-width'),opacity:e.getAttribute('opacity'),fillOpacity:e.getAttribute('fill-opacity'),strokeOpacity:e.getAttribute('stroke-opacity')})),floor:window.floorState,lineAudit:window.RIA?.debug?.lineLabels?.(),labError:document.body.innerText.includes('配置运行实验室错误')})")
  info['visibleText']=b.evaluate("(()=>{const m=document.querySelector('.leaflet-container').getBoundingClientRect();return [...document.querySelectorAll('.leaflet-marker-icon')].filter(e=>{const x=e.firstElementChild??e,r=x.getBoundingClientRect(),s=getComputedStyle(x);return r.width&&r.height&&s.visibility!=='hidden'&&s.display!=='none'&&Number(s.opacity)>0&&r.right>m.x&&r.x<m.right&&r.bottom>m.y&&r.y<m.bottom}).map(e=>e.textContent.trim())})()")
  assert not info['labError']
  rows.append({'mode':mode,'zoom':level,**info})
 b.screenshot('subject-real-city-'+mode+'.png')
result={'rows':rows,'runtimeErrors':b.errors,'scope':'actual production App, published 495-record city view; counts/text/path styles are diagnostics and include invisible/off-screen/hit shapes, not whole-map pixel-equality evidence'}
(OUT/'subject-city-render-diagnostics.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps([{'mode':r['mode'],'zoom':r['zoom'],'labels':len(r['text']),'paths':len(r['paths']),'floor':r.get('floor')} for r in rows],ensure_ascii=False))
assert not b.errors,b.errors
