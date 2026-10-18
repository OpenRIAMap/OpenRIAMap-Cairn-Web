import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser();checks=[]
for mode in ['main','preview']:
 b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/render-acceptance.html?subject=1&class=RLE&scenario=singleLine&mode='+mode});b.wait('!!window.acceptance?.map');time.sleep(.2)
 for direction in ['3','0','1']:
  b.evaluate("window.acceptance.setDataset({features:[{World:'zth',Class:'RLE',ID:'rail-code',Name:'正式名称',bureau:'T',line:'1',direction:"+json.dumps(direction)+",color:'#e6007e',CoordL:[[[-240,-64,-32],[240,-64,-32]]]}]});true")
  for level in range(9):
   b.evaluate('window.acceptance.map.setZoom('+str(level-3)+',{animate:false});true');time.sleep(.3)
   texts=b.evaluate("[...document.querySelectorAll('.leaflet-marker-icon')].map(e=>e.textContent.trim()).filter(Boolean)")
   if direction=='3' and 2<=level<=4:
    b.wait("[...document.querySelectorAll('.leaflet-marker-icon')].some(e=>e.textContent.trim()==='T1')")
    pill=b.evaluate("(()=>{const e=[...document.querySelectorAll('.leaflet-marker-icon')].find(e=>e.textContent.trim()==='T1'),p=[...e.querySelectorAll('*')].find(x=>getComputedStyle(x).backgroundColor==='rgb(230, 0, 126)');return p?{color:getComputedStyle(p).backgroundColor,font:getComputedStyle(p).fontSize}:null})()")
    assert pill and pill['font']=='11px',pill
   elif direction=='3' and 5<=level<=8:
    b.wait("[...document.querySelectorAll('.leaflet-marker-icon')].some(e=>e.textContent.trim()==='正式名称')")
   else:assert 'T1' not in texts,(mode,direction,level,texts)
   checks.append({'mode':mode,'direction':direction,'zoom':level,'text':texts})
 b.evaluate("window.acceptance.setDataset({features:[{World:'zth',Class:'RLE',ID:'rail-code',Name:'正式名称',bureau:'T',line:'1',direction:'3',color:'#e6007e',CoordL:[[[-240,-64,-32],[240,-64,-32]]]}]});window.acceptance.map.setZoom(0,{animate:false});true")
 b.wait("[...document.querySelectorAll('.leaflet-marker-icon')].some(e=>e.textContent.trim()==='T1')")
 b.screenshot('subject-rle-capsule-'+mode+'.png')
assert not b.errors,b.errors
(OUT/'subject-rle-capsules.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'scope':'54 real main/validator combinations; code only 2–4 direction3, legacy full-name capsules remain 5–8; SVG-only bug fixed without ROD changes'},ensure_ascii=False,indent=2),encoding='utf-8')
print('RLE: 54 real main/validator Zoom/direction checks, T1 11px colored code capsules and existing full-name capsules passed')
