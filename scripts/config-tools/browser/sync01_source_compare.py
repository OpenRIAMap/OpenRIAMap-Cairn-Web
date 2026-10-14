"""Compare the unchanged upstream r9 renderer with downstream on identical real data."""
import os,json,time
from pathlib import Path
from browser_check import Browser,OUT
from app_probe import PROBE
b=Browser();features=json.loads(Path('.cache/sync01-data/features.json').read_text(encoding='utf8'))
os.environ['CAIRNMAP_APP_URL']='http://127.0.0.1:5188'
results=[]
for mode in ['v1','v3']:
 comparisons=[]
 for name,base in [('upstream-r9','http://127.0.0.1:5188'),('downstream-integrated','http://127.0.0.1:5191')]:
  b.call('Page.navigate',{'url':base+'/scripts/config-tools/render-acceptance.html?final=1&class=BUD&scenario=smallPolygon'+('&mode=v1' if mode=='v1' else '')})
  b.wait('!!window.acceptance?.map',30)
  b.evaluate('window.acceptance.setDataset({features:'+json.dumps(features)+'});true')
  b.wait(PROBE.replace('return map&&projection?', 'return map&&projection&&records.length===495?'),30)
  b.evaluate('appProbe.map.setView(appProbe.projection.locationToLatLng(5480,64,4850),3,{animate:false});true')
  time.sleep(.7)
  snapshot=b.evaluate("({labels:[...document.querySelectorAll('.leaflet-marker-icon')].map(e=>{const r=e.getBoundingClientRect();return {text:e.textContent.trim(),x:Math.round(r.x),y:Math.round(r.y),style:e.getAttribute('style')}}).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))),paths:[...document.querySelectorAll('.leaflet-pane path')].map(e=>({d:e.getAttribute('d'),stroke:e.getAttribute('stroke'),fill:e.getAttribute('fill'),width:e.getAttribute('stroke-width')})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))})")
  comparisons.append(snapshot);b.screenshot('sync01-source-compare-'+mode+'-'+name+'.png')
 assert comparisons[0]==comparisons[1],(mode,'renderer mismatch',len(comparisons[0]['labels']),len(comparisons[1]['labels']))
 results.append({'mode':mode,'records':495,'visibleLabels':len(comparisons[0]['labels']),'paths':len(comparisons[0]['paths']),'sameLabelPositionsStylesAndPathGeometry':True})
assert not b.errors,b.errors
(OUT/'sync01-source-render-comparison.json').write_text(json.dumps({'comparisons':results,'scope':'production RuleDrivenLayer inside identical controlled map harnesses; exact COS v19 records; fixed logical Zoom6 city viewport; no transient sources','runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(results,ensure_ascii=False),flush=True)
