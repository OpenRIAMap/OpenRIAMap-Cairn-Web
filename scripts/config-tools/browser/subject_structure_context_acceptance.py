"""Real generic host/member layer filtering and desktop/mobile selection."""
import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser();checks=[]
for mode in ['main','preview']:
 for host_class in ['BUD','STB']:
  b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/render-acceptance.html?subject=1&class=FLR&scenario=smallPolygon&context=1&mode='+mode})
  b.wait('!!window.acceptance?.map')
  b.evaluate("window.addEventListener('ria:mobileFloorPanelState',e=>window.floorState=e.detail);true")
  b.evaluate("(()=>{const c=structuredClone(window.acceptance.config);for(const n of c.nodes.filter(n=>n.path.class==='FLR')){if(n.fieldSettings?.structure)n.fieldSettings.structure.visibility='activeLevel';for(const p of Object.values(n.geometryProfiles))for(const r of p.zoomPriority.rules){if(r.label)r.label.collision.hideWhenColliding=false;r.extensions={...r.extensions,collision:{hidePolicy:'forceShow',allowOverlap:true}};}}window.acceptance.setConfig(c);})()")
  records=[{'World':'zth','Class':host_class,'Kind':'NOM','SKind':'NOM','ID':'host','Name':'主结构','Type':'Polygon','CoordG':[[[[-180,-64,-180],[180,-64,-180],[180,-64,180],[-180,-64,180]]]]}]
  for index,cls in enumerate(['FLR','FLR']):
   z=40*index
   records.append({'World':'zth','Class':cls,'Kind':'NOM','SKind':'NOM','ID':'member-'+str(index),'Name':'单元'+str(index),'Type':'Polygon','BuildingID':'host','NofFloor':index,'CoordG':[[[[-60,-64,z],[60,-64,z],[60,-64,z+30],[-60,-64,z+30]]]]})
  b.evaluate('window.acceptance.setDataset({features:'+json.dumps(records,ensure_ascii=False)+'});true')
  b.wait("window.floorState?.visible&&window.floorState.floorOptions.length===2")
  assert b.evaluate('window.floorState.floorOptions.map(o=>o.value)')==['1','0']
  b.click('G')
  b.wait("window.floorState.floorOptions[window.floorState.activeFloorIndex].value==='0'")
  b.wait("[...document.querySelectorAll('.leaflet-marker-icon')].some(e=>e.textContent.trim()==='单元0')")
  b.click('1F')
  b.wait("window.floorState.floorOptions[window.floorState.activeFloorIndex].value==='1'")
  b.wait("[...document.querySelectorAll('.leaflet-marker-icon')].some(e=>e.textContent.trim()==='单元1')&&![...document.querySelectorAll('.leaflet-marker-icon')].some(e=>e.textContent.trim()==='单元0')")
  # The same public event is dispatched by the production mobile floor panel.
  b.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':False})
  b.evaluate("window.dispatchEvent(new CustomEvent('ria:mobileFloorSelect',{detail:{index:window.floorState.floorOptions.findIndex(o=>o.value==='0')}}));true")
  b.wait("window.floorState.floorOptions[window.floorState.activeFloorIndex].value==='0'")
  b.wait("[...document.querySelectorAll('.leaflet-marker-icon')].some(e=>e.textContent.trim()==='单元0')")
  checks.append({'mode':mode,'hostClass':host_class,'zeroLevelValid':True,'desktopRealButton':True,'mobilePublicSelectionEvent':True,'filteredIndependentMemberLabels':True})
  b.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
  b.screenshot('subject-context-'+mode+'-'+host_class+'.png')
assert not b.errors,b.errors
(OUT/'subject-structure-context.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'scope':'four real shared layer/validator hosts; mobile public selection event, separate actual App mobile panel entry tested elsewhere'},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False))
