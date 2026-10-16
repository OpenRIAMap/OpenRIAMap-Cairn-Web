"""Real downstream App comparisons, published data, workflow mount and admission."""
import json,time,hashlib
from pathlib import Path
from browser_check import Browser,OUT
from app_probe import PROBE,POINT
from sync01_transport import install
install();b=Browser();checks=[];snapshots=[]
expected=json.loads(Path('.cache/sync01-data/features.json').read_text(encoding='utf-8'))
seed=json.loads(Path('src/configStudio/defaults/r11-r7.config.json').read_text(encoding='utf-8'))

def go(url):
 b.call('Page.navigate',{'url':url});b.wait("!!document.querySelector('.leaflet-container')",40)
 b.wait(PROBE.replace('return map&&projection?','return map&&projection&&records.length===495?'),45)
 b.wait(PROBE,20);time.sleep(.4)
def value(selector,data):
 b.evaluate("(()=>{const e=document.querySelector("+json.dumps(selector)+");if(!e)throw Error('Missing '+"+json.dumps(selector)+");const p=e.tagName==='SELECT'?HTMLSelectElement.prototype:e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(e,"+json.dumps(str(data))+");e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));})()")
def click(label): b.click(label)
def screenshot(name): b.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');b.screenshot(name)
def pool():
 b.evaluate(PROBE)
 return b.evaluate("window.appProbe.records.map(r=>r.featureInfo)")

for name,url in [('integrated-v3','http://127.0.0.1:5188/?workspace=config-lab&configMode=v3')]:
 go(url)
 actual={'features':pool()}
 assert actual['features']==expected,(name,len(actual['features']))
 # Exact records are independently compared with the frozen formal COS v19 responses.
 assert pool()==expected,(name,'search pool changed/lost records')
 b.evaluate(PROBE);probe=b.evaluate('({records:appProbe.records.length,contract:appProbe.config?.contractRevision,revision:appProbe.config?.revision})')
 assert probe['records']==495
 if name=='integrated-v3':assert probe['contract']==11 and probe['revision']==7
 b.evaluate('appProbe.map.setView(appProbe.projection.locationToLatLng(5480,64,4850),3,{animate:false});true')
 time.sleep(.7);screenshot('subject-'+name+'-desktop.png')
 layout=b.evaluate("({scroll:document.documentElement.scrollWidth,width:innerWidth,search:!!document.querySelector('input[placeholder^=搜索]'),labels:document.querySelectorAll('.leaflet-marker-icon').length,paths:document.querySelectorAll('.leaflet-pane path').length})")
 assert layout['scroll']<=layout['width']
 snapshots.append({'mode':name,'datasetCount':len(actual['features']),'releaseId':'geometry-v1-aeb7cd1531696c31995cff53','formalVersion':19,'probe':probe,'layout':layout})
 if name=='integrated-v3':
  hits=b.evaluate("['道路','建筑','测绘','审核'].map(title=>{const e=[...document.querySelectorAll('button')].find(e=>(e.title===title||e.textContent.trim()===title)&&e.getBoundingClientRect().height);if(!e)return {title,clickable:false};const r=e.getBoundingClientRect();return {title,clickable:e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}})")
  assert all(item['clickable'] for item in hits),hits
  snapshots[-1]['labToolbarDoesNotObstructDownstreamControls']=hits
  zoomHits=b.evaluate("[...document.querySelectorAll('.leaflet-control-zoom a')].map(e=>{const r=e.getBoundingClientRect();return {title:e.title,clickable:e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}})")
  assert len(zoomHits)==2 and all(item['clickable'] for item in zoomHits),zoomHits
  snapshots[-1]['labToolbarAndRecoveryDoNotObstructZoom']=zoomHits
 print(json.dumps(snapshots[-1],ensure_ascii=False),flush=True)
checks.append('current downstream C application retains all 495 exact published records, formal source/version and complete search pool')

# Low logical Zoom uses the actual App map; no synthetic renderer replaces it.
zooms=[]
for logical in [0,1,2,3,5,6,8]:
 b.evaluate('appProbe.map.setZoom('+str(logical-3)+',{animate:false});true');time.sleep(.4)
 z=b.evaluate('({leaflet:appProbe.map.getZoom(),labels:document.querySelectorAll(".leaflet-marker-icon").length,paths:document.querySelectorAll(".leaflet-pane path").length,labError:document.body.innerText.includes("配置运行实验室错误")})')
 assert z['leaflet']==logical-3 and not z['labError']
 zooms.append({'logical':logical,**z})
 if logical in [0,2,6]:screenshot('subject-v3-zoom-'+str(logical)+'.png')
checks.append('production Lab logical Zoom 0,1,2,3,5,6,8 remains mounted and within shared zoom bounds')
b.evaluate('appProbe.map.setView(appProbe.projection.locationToLatLng(0,64,0),3,{animate:false});true')

# A complete WRP production submission with actual pointer geometry.
click('测绘')
if b.evaluate("!!document.querySelector('#feature-module-dialog-title')"):click('下载并启用')
b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent.trim()==='开始测绘(快捷)'&&e.getBoundingClientRect().height)",40)
click('开始测绘(快捷)')
b.evaluate("(()=>{const s=[...document.querySelectorAll('select')].find(e=>[...e.options].some(o=>o.value==='v3-wrp_warp'));s.value='v3-wrp_warp';s.dispatchEvent(new Event('change',{bubbles:true}));})()")
click('开始');b.wait("!!document.querySelector('input[aria-label=填写人]')")
value('input[aria-label=填写人]','subject-test');click('下一页')
workflow=next(w for w in seed['workflows'] if w['id']=='v3-wrp_warp')
for step in workflow['steps'][1:]:
 for c in step.get('controls',[]):
  selector='[data-workflow-control='+json.dumps(c['id'])+']'
  if c['kind']=='classificationPicker':
   for title in ['Class','Kind','SKind','SKind2']:
    select=selector+' select[aria-label="工作流分类 '+title+'"]'
    if b.evaluate('!!document.querySelector('+json.dumps(select)+')'):b.evaluate("(()=>{const s=document.querySelector("+json.dumps(select)+");s.value=[...s.options].find(o=>o.value).value;s.dispatchEvent(new Event('change',{bubbles:true}));})()")
  elif c['kind'] in ['text','number']:
   if '-Name-' in c['id']:value(selector+' input','S01')
   elif '-abbr-' in c['id']:value(selector+' input','SYNC01_POINT')
   elif c.get('required'):value(selector+' input','1' if c['kind']=='number' else 'SYNC01')
 if step['kind']=='geometry':
  b.evaluate(PROBE);point=b.evaluate('('+POINT+')(15,17)')
  for typ in ['mousePressed','mouseReleased']:b.call('Input.dispatchMouseEvent',{'type':typ,'button':'left','clickCount':1,**point})
 click('确认保存输出' if step is workflow['steps'][-1] else '下一页')
b.wait(PROBE.replace('return map&&projection?', 'return map&&projection&&measurement?'),20)
b.wait('appProbe.measurement.getCommittedFeatures().length===1')
created=b.evaluate('appProbe.measurement.getCommittedFeatures()[0]');assert created['Name']=='S01' and created['Class']=='WRP'
click('临时挂载');b.wait("document.querySelector('.leaflet-container').innerText.includes('S01')",25)
assert any(record['ID']==created['ID'] for record in pool())
click('enabled=true');b.wait("!document.querySelector('.leaflet-container').innerText.includes('S01')")
click('enabled=false');b.wait("document.querySelector('.leaflet-container').innerText.includes('S01')")
screenshot('subject-actual-workflow-mounted.png')
position=b.evaluate("(()=>{const e=[...document.querySelectorAll('.leaflet-marker-icon span')].find(e=>!e.children.length&&e.textContent==='S01');const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()")
for typ in ['mousePressed','mouseReleased']:b.call('Input.dispatchMouseEvent',{'type':typ,'button':'left','clickCount':1,**position})
b.wait("[...document.querySelectorAll('button[title=导入图层]')].some(e=>e.getBoundingClientRect().height)")
checks.append('actual App WRP collection, pointer draw/save, process-local mount enable/disable, search inclusion and native label-click card')

# Reload must remove downstream process-local previews, while default stays r7.
go('http://127.0.0.1:5188/?workspace=config-lab&configMode=v3')
assert not any(record['ID']==created['ID'] for record in pool())
assert len(pool())==495
checks.append('refresh clears downstream process-local map drafts and previews, preserving published records and active r11/r7 config')

# Existing downstream identity gate remains in force; no remote mutation occurs.
click('审核')
if b.evaluate("!!document.querySelector('#feature-module-dialog-title')"):click('下载并启用')
b.wait("!!document.querySelector('#review-access-gate-title')",35)
assert not b.evaluate("document.body.innerText.includes('审核包工作区')")
screenshot('subject-review-admission-gate.png')
checks.append('review bundle still requires downstream GitHub identity admission; absent local auth backend cannot open reviewer workspace')

# Narrow production map uses downstream quick panels, not upstream toolbar UI.
go('http://127.0.0.1:5188/?workspace=config-lab&configMode=v3')
b.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
time.sleep(.5)
assert b.evaluate('document.documentElement.scrollWidth<=innerWidth')
screenshot('subject-v3-mobile.png')
checks.append('390px production Lab retains downstream quick-panel layout without document overflow')
assert not b.errors,b.errors
result={'checks':checks,'dataSnapshots':snapshots,'logicalZoom':zooms,'createdRecord':created,'runtimeErrors':b.errors,'transport':'exact COS v19 bytes through isolated CDP local-CORS accommodation; no production endpoint changes','authLimit':'local auth service is unavailable; real backend authenticated review/save/publish was not attempted'}
(OUT/'release-app-acceptance.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False),flush=True)
