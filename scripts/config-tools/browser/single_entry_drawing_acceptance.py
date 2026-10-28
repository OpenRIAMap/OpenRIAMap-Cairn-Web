"""Real MeasuringModule/NativeWorkflowHost regression; localhost only, no uploads.

UI creates all geometry. The existing React bridge is inspected read-only to
compare the visible editor, task archives, previews and saved native records.
"""
import copy,gzip,json,os,time,traceback,urllib.request,zipfile
from pathlib import Path
from browser_check import Browser,APP_URL,OUT

assert APP_URL.startswith('http://127.0.0.1:')
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
BASE=json.load(opener.open(APP_URL+'/configuration/releases/e8f258de720cbcc49938b6edac21e5b6178990cf499fc3c782b495d4cf877036/config.json'))
b=Browser();checks=[]
b.call('Page.addScriptToEvaluateOnNewDocument',{'source':r"""
window.singleEntryRequests=[];window.singleEntryAlerts=[];window.confirm=()=>true;window.alert=m=>window.singleEntryAlerts.push(String(m));
const native=window.fetch.bind(window);window.fetch=(input,init)=>{const url=new URL(typeof input==='string'?input:input.url,location.href);const method=(init?.method??input?.method??'GET').toUpperCase();if(url.origin!==location.origin||!['GET','HEAD'].includes(method)){window.singleEntryRequests.push(method+' '+url.href);return Promise.reject(Error('Isolated drawing acceptance blocks remote or write requests.'));}return native(input,init);};
"""})

def click(label):b.click(label)
def press(expression):
 at=b.evaluate('(()=>{const e='+expression+';if(!e||e.matches(":disabled"))throw Error("Button unavailable");e.scrollIntoView({block:"center"});const r=e.getBoundingClientRect();if(!r.width||!r.height)throw Error("Button is in an inactive layout shell");return {x:r.x+r.width/2,y:r.y+r.height/2};})()')
 for event in ['mousePressed','mouseReleased']:b.call('Input.dispatchMouseEvent',{'type':event,'button':'left','clickCount':1,**at})
 time.sleep(.13)
def val(selector,value):
 val_expr('[...document.querySelectorAll('+json.dumps(selector)+')].find(e=>e.getBoundingClientRect().height&&!e.matches(":disabled"))',value)
def val_expr(expression,value):
 b.wait('(()=>{const e='+expression+';return Boolean(e&&!e.matches(":disabled")&&e.getBoundingClientRect().height);})()')
 b.evaluate('(()=>{const e='+expression+';if(!e||e.matches(":disabled"))throw Error("Input unavailable");const proto=e.tagName==="SELECT"?HTMLSelectElement.prototype:e.tagName==="TEXTAREA"?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,"value").set.call(e,'+json.dumps(str(value))+');e.dispatchEvent(new Event(e.tagName==="SELECT"?"change":"input",{bubbles:true}));})()');time.sleep(.1)
def probe():
 return b.evaluate(r"""(()=>{const el=document.querySelector('.leaflet-container');let root=el?.[Object.keys(el??{}).find(k=>k.startsWith('__reactFiber'))];if(!root)return false;while(root.return)root=root.return;root=root.stateNode?.current??root;const todo=[root],seen=new Set();let bridge,session,runner;
 while(todo.length){const f=todo.pop();if(!f||seen.has(f))continue;seen.add(f);const p=f.memoizedProps;if(p?.bridge&&p?.workflow&&p?.onCommit)bridge=p.bridge;if(f.type?.name==='V3WorkflowRunner')runner=f;
 let h=f.memoizedState;const hs=new Set();while(h&&typeof h==='object'&&!hs.has(h)){hs.add(h);const s=h.memoizedState;if(s?.drafts instanceof Map&&s?.capture&&s?.switchPage)session=s;h=h.next;}if(f.child)todo.push(f.child);if(f.sibling)todo.push(f.sibling);}
 window.singleEntryProbe={bridge,session,runner};return {bridge:!!bridge,session:!!session,runner:!!runner};})()""")
def geometry():
 probe();return b.evaluate('window.singleEntryProbe.bridge.getDrawingGeometry()')
def draft():
 probe();return b.evaluate('window.singleEntryProbe.bridge.getDrawingDraft()')
def captures():
 probe();return b.evaluate(r"""(()=>{let h=window.singleEntryProbe.runner?.memoizedState;const result={},seen=new Set();while(h&&typeof h==='object'&&!seen.has(h)){seen.add(h);const v=h.memoizedState?.current;if(v&&typeof v==='object')for(const [key,value]of Object.entries(v))if(value?.geometry?.parts)result[key]=value.geometry;h=h.next;}return result;})()""")
def records():return b.evaluate('window.workflowAcceptance.measurement.getCommittedFeatures()')
def draw(points):
 for x,z in points:
  at=b.evaluate('window.workflowAcceptance.screenPointAt('+str(x)+','+str(z)+')')
  assert 0<at['x']<1440 and 0<at['y']<1000,at
  for event in ['mousePressed','mouseReleased']:b.call('Input.dispatchMouseEvent',{'type':event,'button':'left','clickCount':1,**at})
  time.sleep(.1)
def array(points):
 click('数组');selector='textarea[placeholder^="请输入严格 JSON 数组"]';b.wait('!!document.querySelector('+json.dumps(selector)+')');val(selector,json.dumps([[x,64,z] for x,z in points]));click('校验');click('完成');b.wait('!document.querySelector('+json.dumps(selector)+')')
def page():return b.evaluate('document.querySelector("[data-workflow-step]")?.dataset.workflowStep')
def fresh(config):
 b.call('Storage.clearDataForOrigin',{'origin':APP_URL,'storageTypes':'all'})
 b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/workflow-acceptance.html?subject=1&edit=1&strict=1'})
 b.wait('!!window.workflowAcceptance?.measurement',60)
 b.evaluate('window.workflowAcceptance.setConfig('+json.dumps(config,ensure_ascii=False)+');true');time.sleep(.4)
def open_flow(config,flow_id,tag):
 fresh(config)
 click('测绘');click('开始测绘(快捷)')
 b.evaluate('(()=>{const s=[...document.querySelectorAll("select")].find(e=>[...e.options].some(o=>o.value==='+json.dumps(flow_id)+'));s.value='+json.dumps(flow_id)+';s.dispatchEvent(new Event("change",{bubbles:true}));})()');click('开始')
 val('input[aria-label="填写人"]','SINGLEENTRYQA');click('下一页')
 flow=next(w for w in config['workflows'] if w['id']==flow_id)
 for control in [c for step in flow['steps'] if step['kind']=='form' for c in step.get('controls',[])]:
  base='[data-workflow-control="'+control['id']+'"]'
  if control['kind']=='classificationPicker':
   b.evaluate('(()=>{const e=document.querySelector('+json.dumps(base+' select')+');if(e){const o=[...e.options].find(o=>o.value&&o.textContent.includes("NOM"))??[...e.options].find(o=>o.value);if(o){e.value=o.value;e.dispatchEvent(new Event("change",{bubbles:true}));}}})()')
  elif control['kind']=='toggle' and control.get('required'):
   press('[...document.querySelector('+json.dumps(base)+').querySelectorAll("button")].find(e=>e.textContent.trim()==="否")')
  elif control['kind'] in ('text','textarea','number') and (control.get('required') or any(t in control.get('label',{}).get('zh','') for t in ['名称','名字','简称'])):
   selector=base+(' textarea' if control['kind']=='textarea' else ' input')
   if b.evaluate('!!document.querySelector('+json.dumps(selector)+')'):
    val(selector,'2' if control['kind']=='number' else tag)
 click('下一页');b.wait('!!document.querySelector("[data-workflow-step]")&&document.querySelector("[data-workflow-step]").textContent.includes("固定绘制类型")')
 assert not b.evaluate('[...document.querySelectorAll("[data-workflow-step] button")].some(e=>["添加部件","添加孔环"].includes(e.textContent.trim()))')
 assert not b.evaluate('document.querySelector("[data-workflow-step]").textContent.includes("采用当前绘制")')
 probe();return flow

def canonical(g):
 def xyz(p):return [p['x'],p['y'],p['z']]
 if g['type']=='Point':return [xyz(p) for p in g['parts']]
 if g['type']=='LineString':return [[xyz(p) for p in part] for part in g['parts']]
 return [[[xyz(p) for p in ring] for ring in part] for part in g['parts']]

def permit_parts(config,flow_id):
 flow=next(w for w in config['workflows'] if w['id']==flow_id)
 output=flow['outputs'][0];kind=output['geometry']['selected']
 classes={s['path']['class'] for s in output['classificationGroup']['selectors']}
 for node in config['nodes']:
  if node['path']['class'] in classes and kind in node.get('geometryProfiles',{}):node['geometryProfiles'][kind]['allowMultipleParts']=True
 for step in flow['steps']:
  if step['kind']=='geometry' and step.get('geometryRole')!='auxiliary':step.setdefault('drawing',{})['multiple']=True
 return flow
def panel_button(panel,text):return '[...document.querySelector('+json.dumps('[data-panel-id="'+panel+'"]')+').querySelectorAll("button")].find(e=>e.textContent.trim()==='+json.dumps(text)+')'
def close_panel(panel):press('document.querySelector('+json.dumps('[data-panel-id="'+panel+'"]')+').querySelector("button")')
def minimize_layers():
 press('[...document.querySelectorAll("[data-panel-id]")].find(e=>e.getBoundingClientRect().height&&e.querySelector("h3")?.textContent.trim()==="图层").querySelector(\'button[aria-label="最小化面板"]\')')
def download(suffix):
 for _ in range(100):
  found=list(downloads.glob('*'+suffix))
  if found:return found[-1]
  time.sleep(.1)
 raise AssertionError('Actual download missing: '+suffix)
def save_config(name,config):
 with gzip.open(OUT/('single-entry-'+name+'-config.json.gz'),'wt',encoding='utf8') as stream:json.dump(config,stream,ensure_ascii=False)

def assert_fixed_geometry(expected):
 actual=b.evaluate('''(async()=>{const {DynmapProjection,ZTH_FLAT_CONFIG}=await import('/src/lib/DynmapProjection.ts');const p=new DynmapProjection(ZTH_FLAT_CONFIG),world=pair=>{const v=p.latLngToLocation({lng:pair[0],lat:pair[1]},64);return [Number(v.x.toFixed(6)),Number(v.z.toFixed(6))];};return Object.values(window.workflowAcceptance.map._layers).filter(l=>typeof l.getLatLngs==='function'||typeof l.getLatLng==='function').map(l=>l.toGeoJSON?.().geometry).filter(Boolean).flatMap(g=>g.type==='Point'?[world(g.coordinates)]:g.type==='LineString'?[g.coordinates.map(world)]:g.type==='Polygon'?[g.coordinates.map(r=>r.map(world))]:[]);})()''')
 def xy(point):return [round(point['x'],6),round(point['z'],6)]
 desired=[xy(p) for p in expected['parts']] if expected['type']=='Point' else [[xy(p) for p in part] for part in expected['parts']] if expected['type']=='LineString' else [[[xy(p) for p in ring] for ring in part] for part in expected['parts']]
 if expected['type']=='Polygon':
  for collection in [actual,desired]:
   for part in collection:
    for ring in part:
     if len(ring)>1 and ring[0]==ring[-1]:ring.pop()
 assert actual==desired,{'actual fixed geometry':actual,'expected complete geometry':desired}

try:
 config=copy.deepcopy(BASE);flow=open_flow(config,'v3-bud_building','SEPOLYGON')
 save_config('polygon',config)
 draw([(0,0),(70,0),(70,70),(0,70)]);click('多部件和内洞设置');array([(0,0),(70,0),(70,70),(0,70)])
 click('内部空间');click('添加内部洞');draw([(10,10),(20,10),(20,20)]);array([(10,10),(20,10),(20,20),(10,20)])
 click('添加部件');draw([(20,-50),(70,-50),(70,-20)]);array([(20,-50),(70,-50),(70,-20),(20,-20)])
 click('内部空间');click('添加内部洞');draw([(30,-40),(40,-40),(40,-30)]);array([(30,-40),(40,-40),(40,-30),(30,-30)])
 expected=geometry();assert len(expected['parts'])==2 and all(len(p)==2 for p in expected['parts']),expected
 b.wait('Object.keys('+"("+r"(()=>{let h=window.singleEntryProbe.runner?.memoizedState;while(h){const v=h.memoizedState?.current;if(v&&Object.values(v).some(x=>x?.geometry?.parts))return v;h=h.next;}return {};})()"+")"+').length>0')
 assert next(iter(captures().values()))==expected
 before=draft();click('上一页');click('下一页');assert draft()==before
 checks.append('A01/A05/A10: only original structure controls; both Polygon parts and their holes, selected hole, panel and redo survive backtrack; runner equals complete editor')
 # Change a non-final part/hole and keep all unrelated geometry intact.
 val('select[aria-label="部件编号"]','0');click('编辑所选内洞');array([(12,12),(22,12),(22,22),(12,22)])
 updated=geometry();assert updated['parts'][1]==expected['parts'][1];assert updated['parts'][0][0]==expected['parts'][0][0]
 before=geometry();draw([(120,0)]);assert geometry()==before
 checks.append('A05/A06: non-last part/hole edits preserve siblings; outside map point rejected with geometry unchanged')
 # Every original coordinate-input route is tested against the same active hole.
 click('手动输入');val('[data-panel-id="manual-point-input"] input[placeholder="例如 10 / 10.1"]','120');val('[data-panel-id="manual-point-input"] input[placeholder="例如 -64 / -64.3"]','64');val('[data-panel-id="manual-point-input"] input[placeholder="例如 20 / 20.1"]','0');press(panel_button('manual-point-input','完成'));assert geometry()==before;close_panel('manual-point-input')
 click('数组');val('textarea[placeholder^="请输入严格 JSON 数组"]','[[120,64,0],[130,64,0],[130,64,10]]');click('校验');assert geometry()==before
 assert b.evaluate(panel_button('cpT-array-editor-panel','完成')+'.disabled');close_panel('cpT-array-editor-panel')
 click('曲线输入')
 for i,(x,z) in enumerate([(120,0),(130,10)]):
  val_expr('document.querySelectorAll(\'[data-panel-id="curve-input"] input[placeholder="X(0.1)"]\')['+str(i)+']',x);val_expr('document.querySelectorAll(\'[data-panel-id="curve-input"] input[placeholder="Z(0.1)"]\')['+str(i)+']',z);press(panel_button('curve-input','设起点' if i==0 else '设终点'))
 press('[...document.querySelector(\'[data-panel-id="curve-input"]\').querySelectorAll("button")].find(e=>e.textContent.includes("添加曲柄"))');press(panel_button('curve-input','输出'));assert geometry()==before
 if b.evaluate('!!document.querySelector(\'[data-panel-id="curve-input"]\')'):close_panel('curve-input')
 click('修改');draw([(12,12)]);draw([(120,0)])
 assert '外边界' in b.evaluate('document.querySelector(\'[data-panel-id="cpT-edit-panel"]\').textContent')
 press('[...document.querySelector(\'[data-panel-id="cpT-edit-panel"]\').querySelectorAll("button")].find(e=>e.textContent.includes("保存"))');assert geometry()==before
 click('反转');click('反转');assert geometry()==before
 click('添加内部洞');draw([(30,30),(40,30),(40,40)]);array([(30,30),(40,30),(40,40),(30,40)])
 before=geometry();draw([(15,15)]);assert geometry()==before
 checks.append('A06: original manual/array/curve/control-point inputs reject outside-hole edits, reverse roundtrip is isolated, and points inside another hole are rejected')
 click('显示部件编号');locked=draft()
 assert b.evaluate('[...document.querySelectorAll("button")].find(e=>e.title==="添加部件").disabled')
 assert all(b.evaluate('[...document.querySelectorAll("button")].find(e=>e.textContent.trim()==='+json.dumps(label)+').disabled') for label in ['撤销','重做','数组','修改','添加','删除','反转'])
 b.evaluate('document.activeElement?.blur()')
 for key,code,n in [('z','KeyZ',90),('y','KeyY',89)]:
  b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':key,'code':code,'windowsVirtualKeyCode':n,'modifiers':2});b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':key,'code':code,'windowsVirtualKeyCode':n})
 assert draft()==locked
 click('上一页');click('下一页');assert draft()==locked
 b.screenshot('single-entry-numbering-lock.png');click('显示部件编号')
 checks.append('A07/A07b: numbering locks primary controls, existing undo/redo/array/control tools and real Ctrl+Z/Y; lock and exact draft survive page re-entry')
 expected=geometry();assert next(iter(captures().values()))==expected
 click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1')
 saved=records()[0];assert saved['CoordG']==canonical(expected),(saved,expected)
 assert_fixed_geometry(expected)
 (OUT/'single-entry-polygon-record.json').write_text(json.dumps(saved,ensure_ascii=False,indent=2),encoding='utf8')
 checks.append('A13: actual confirm/save writes both Polygon parts and every hole into canonical CoordG')
 # Normal layer edit, standard ZIP, complete JSON and import use actual UI.
 if not b.evaluate('[...document.querySelectorAll("button")].some(e=>e.textContent.trim()==="切换到完整模式"&&e.getBoundingClientRect().height)'):click('测绘')
 click('切换到完整模式')
 row='[...document.querySelectorAll("div")].find(e=>e.getBoundingClientRect().height&&typeof e.className==="string"&&e.className.includes("whitespace-nowrap")&&e.textContent.includes('+json.dumps(saved['ID'])+'))'
 press('('+row+').querySelector(\'button[title="展开工具栏"]\')');press('[...('+row+').querySelectorAll("button")].find(e=>e.textContent.trim()==="编辑")')
 b.wait('!!document.querySelector(\'section[aria-label="V3 工作流式编辑"]\')')
 assert b.evaluate('document.querySelector("select[aria-label=部件编号]").options.length')==2
 val('input[aria-label="工作流编辑人"]','SINGLEENTRYEDIT');click('保存编辑图层');b.wait('!document.querySelector(\'section[aria-label="V3 工作流式编辑"]\')')
 assert records()[0]['CoordG']==saved['CoordG'] and records()[0]['ID']==saved['ID']
 downloads=OUT/'single-entry-downloads'/str(time.time_ns());downloads.mkdir(parents=True)
 b.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(downloads.resolve())})
 click('导出标准包');b.wait('[...document.querySelectorAll("h3")].some(e=>e.textContent==="导出标准包")')
 val_expr('[...document.querySelectorAll("h3")].find(e=>e.textContent==="导出标准包").parentElement.parentElement.querySelector("input")','SINGLEENTRYQA')
 click('生成标准包');click('点击下载标准包');archive=download('.zip')
 with zipfile.ZipFile(archive) as bundle:
  bundled=[json.loads(bundle.read(name).decode('utf-8-sig')) for name in bundle.namelist() if name.endswith('.json')]
  exported_record=next(r for r in bundled if isinstance(r,dict) and r.get('ID')==saved['ID']);assert exported_record['CoordG']==saved['CoordG']
 click('整体JSON');click('下载(完整)');exported=json.loads(download('.json').read_text(encoding='utf-8-sig'));assert exported[0]['CoordG']==saved['CoordG']
 fresh(BASE);click('测绘');click('开始测绘(完整)');minimize_layers();click('导入数据');val('textarea[placeholder^="批量 JSON"]',json.dumps(exported));click('导入');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1')
 assert records()[0]['CoordG']==saved['CoordG']
 fresh(BASE);click('测绘');click('开始测绘(完整)');minimize_layers();click('导入数据')
 b.wait('!!document.querySelector(\'[data-panel-id="measuring-import"] input[type=file]\')')
 root=b.call('DOM.getDocument')['root']['nodeId'];node=b.call('DOM.querySelector',{'nodeId':root,'selector':'[data-panel-id="measuring-import"] input[type=file]'})['nodeId'];b.call('DOM.setFileInputFiles',{'nodeId':node,'files':[str(archive.resolve())]});b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1')
 assert records()[0]['CoordG']==saved['CoordG'] and records()[0]['ID']==saved['ID']
 checks.append('A12/A13: actual layer edit/readback, standard ZIP and complete JSON download, JSON import and ZIP file import preserve every part/hole and ID')
 # Policy fixture changes only existing allowMultipleParts properties.
 config=copy.deepcopy(BASE)
 for node in config['nodes']:
  if node['path']['class']=='BUD' and 'Polygon' in node.get('geometryProfiles',{}):node['geometryProfiles']['Polygon']['allowMultipleParts']=False
 open_flow(config,'v3-bud_building','SESINGLE');click('多部件和内洞设置')
 assert b.evaluate('document.querySelector("select[aria-label=部件编号]").disabled')
 assert b.evaluate('[...document.querySelectorAll("button")].find(e=>e.title==="添加部件").disabled')
 draw([(0,0),(70,0),(70,70),(0,70)]);click('内部空间');click('添加内部洞');draw([(10,10),(20,10),(20,20)]);array([(10,10),(20,10),(20,20),(10,20)])
 assert len(geometry()['parts'])==1 and len(geometry()['parts'][0])==2
 click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1')
 checks.append('A02: actual selected-class policy immediately locks original selector/add controls, retains holes, and saves one part with its hole')
 # A classification change may restrict the draft, but may never trim it.
 config=copy.deepcopy(BASE)
 for node in config['nodes']:
  if node['path']['class']=='BUD' and node['path'].get('kind')=='SPE' and 'Polygon' in node.get('geometryProfiles',{}):node['geometryProfiles']['Polygon']['allowMultipleParts']=False
 open_flow(config,'v3-bud_building','SECLASS');draw([(0,0),(60,0),(60,60)]);click('多部件和内洞设置');click('添加部件');draw([(20,-50),(60,-50),(60,-20)]);intact=draft()
 click('上一页')
 def choose_class(code):
  expr='[...document.querySelectorAll("[data-workflow-control] select")].find(e=>e.getBoundingClientRect().height&&[...e.options].some(o=>o.textContent.includes('+json.dumps(code)+')))'
  option=b.evaluate('(()=>{const e='+expr+';return [...e.options].find(o=>o.textContent.includes('+json.dumps(code)+')).value;})()');val_expr(expr,option)
 choose_class('SPE');click('下一页');assert draft()==intact
 assert b.evaluate('document.querySelector("select[aria-label=部件编号]").disabled')
 assert b.evaluate('[...document.querySelectorAll("[data-workflow-step] button")].find(e=>e.textContent.trim()==="确认保存输出").disabled')
 assert records()==[]
 click('上一页');choose_class('NOM');click('下一页');assert draft()==intact
 click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1');assert records()[0]['CoordG']==canonical(intact['geometry'])
 checks.append('A09: selecting a no-multipart class retains the entire existing draft, locks original controls and blocks save; returning to an allowed class restores save without data loss')
 # Point collection and multipart line use real current workflow definitions;
 # only their existing multipart policy is enabled in this local fixture.
 for flow_id,kind,tag in [('v3-ngf_lis_lap','Point','SEPOINT'),('v3-rod_road','LineString','SELINE')]:
  config=copy.deepcopy(BASE);permit_parts(config,flow_id);open_flow(config,flow_id,tag)
  save_config(kind,config)
  if kind=='Point':
   draw([(10,10),(20,20)]);assert len(geometry()['parts'])==1,'A map click updates the current point; other point parts require the original add control.'
  else:draw([(0,0),(40,0)])
  click('多部件和内洞设置')
  if kind=='LineString':array([(0,0),(40,0)])
  first=geometry();click('添加部件')
  assert b.evaluate('[...document.querySelectorAll("[data-workflow-step] button")].find(e=>e.textContent.trim()==="确认保存输出").disabled')
  assert len(geometry()['parts'])==2
  if kind=='Point':
   assert b.evaluate('Number.isNaN(window.singleEntryProbe.bridge.getDrawingGeometry().parts[1].x)')
   draw([(40,40)])
  else:draw([(20,-30),(60,-30)]);array([(20,-30),(60,-30)])
  second=copy.deepcopy(geometry()['parts'][1]);val('select[aria-label="部件编号"]','0')
  if kind=='Point':draw([(30,30)])
  else:array([(10,0),(50,0)])
  assert geometry()['parts'][1]==second and geometry()['parts'][0]!=first['parts'][0]
  if kind=='Point':
   intact=geometry();click('数组');val('textarea[placeholder^="请输入严格 JSON 数组"]','[[1,64,1],[2,64,2]]');click('校验');assert geometry()==intact;assert b.evaluate(panel_button('cpT-array-editor-panel','完成')+'.disabled');close_panel('cpT-array-editor-panel')
  else:
   array([(round(10+i*.1,1),round(10+(i%11)*.1,1)) for i in range(500)])
   probe();perf=b.evaluate(r"""(()=>{const s=window.singleEntryProbe.session,b=window.singleEntryProbe.bridge,before=JSON.stringify(b.getDrawingGeometry()),times=[];for(let i=0;i<100;i++){const t=performance.now();s.capture(s.active);times.push(performance.now()-t);}times.sort((a,b)=>a-b);return {kind:'read-only session capture, not frame/render timing',vertices:502,reads:100,p95Ms:times[94],maxMs:times[99],unchanged:before===JSON.stringify(b.getDrawingGeometry())};})()""")
   assert perf['unchanged'];(OUT/'single-entry-capture-performance.json').write_text(json.dumps(perf,ensure_ascii=False,indent=2),encoding='utf8')
   checks.append('A14: 502-vertex multipart draft captured 100 times without structural changes; measured capture-only timing recorded separately')
  expected=geometry();before=draft();click('上一页');click('下一页');assert draft()==before
  assert next(iter(captures().values()))==expected
  click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1')
  saved=records()[0];field='CoordP' if kind=='Point' else 'CoordL';assert saved[field]==canonical(expected)
  assert_fixed_geometry(expected)
  (OUT/('single-entry-'+kind+'-record.json')).write_text(json.dumps(saved,ensure_ascii=False,indent=2),encoding='utf8')
  checks.append('A03/A04/A11/A13: '+kind+' original part controls, unfinished-part blocking, non-last-part correction, backtrack and exact canonical save')
 # Two independent Polygon tasks plus an auxiliary point. The fixture builder
 # is also validated by the Node regression and never alters the formal file.
 config=b.evaluate('import("/scripts/config-tools/fixtures/single-entry-drawing.ts").then(m=>m.singleEntryDrawingFixture('+json.dumps(BASE,ensure_ascii=False)+',true))')
 save_config('multi-output',config)
 flow=open_flow(config,'v3-bud_building','SETASKS')
 draw([(0,0),(60,0),(60,60),(0,60)]);click('多部件和内洞设置');array([(0,0),(60,0),(60,60),(0,60)])
 click('内部空间');click('添加内部洞');draw([(10,10),(20,10),(20,20)]);array([(10,10),(20,10),(20,20),(10,20)])
 first_task=draft()
 click('数组');val('textarea[placeholder^="请输入严格 JSON 数组"]','[[11,64,11],[21,64,11],[21,64,21],[11,64,21]]');b.evaluate('window.confirm=()=>false');click('下一页')
 assert geometry()==first_task['geometry'] and b.evaluate('window.singleEntryProbe.session.active')==flow['outputs'][0]['id']
 assert b.evaluate('document.querySelector(\'textarea[placeholder^="请输入严格 JSON 数组"]\').value')=='[[11,64,11],[21,64,11],[21,64,21],[11,64,21]]'
 click('上一页');b.evaluate('window.confirm=()=>true');click('校验');click('完成');first_task=draft()
 checks.append('A10: declining the original tool-discard confirmation retains its pending array and task; applying it still updates the original task before switching')
 click('下一页');draw([(0,0),(60,0),(60,60),(0,60)]);second_task=draft()
 click('下一页');draw([(30,30)]);aux=draft()
 click('上一页');assert draft()==second_task
 click('上一页');assert draft()==first_task
 click('下一页');assert draft()==second_task
 click('下一页');assert draft()==aux
 checks.append('A08: two output tasks with coincident coordinates and an auxiliary point restore their own complete geometry/cursors without cross-task merging')
 before=draft();b.evaluate('window.workflowAcceptance.setWorld("eden");true');time.sleep(.3)
 assert b.evaluate('window.singleEntryProbe.session.paused')
 b.evaluate('window.workflowAcceptance.setWorld("zth");true');time.sleep(.3);click('恢复绘制');b.wait('!!window.singleEntryProbe.bridge.getDrawingDraft()')
 assert draft()==before
 checks.append('A10: world mismatch pauses and hides active drawing; explicit resume restores the exact complete task')
 # A responsive layout moves the stable host rather than clearing its state.
 before=draft();b.call('Emulation.setDeviceMetricsOverride',{'width':600,'height':1000,'deviceScaleFactor':1,'mobile':False});time.sleep(.35)
 b.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False});time.sleep(.35)
 assert draft()==before
 checks.append('A10: desktop/compact layout changes preserve one host, current geometry and editing target')
 # Disable and re-enable the second output from the existing configured form.
 click('上一页');click('上一页');click('上一页');click('否')
 click('下一页');assert draft()==first_task
 click('下一页');assert draft()==aux
 click('上一页');click('上一页');click('是')
 click('下一页');assert draft()==first_task
 click('下一页');assert draft()==second_task
 click('下一页');assert draft()==aux
 checks.append('A09: conditional task skipping/restoration preserves separate drafts and does not inherit another task geometry')
 click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===2')
 rows=records();assert rows[0]['CoordG']==canonical(first_task['geometry']) and rows[1]['CoordG']==canonical(second_task['geometry'])
 assert rows[0]['ID']!=rows[1]['ID']
 (OUT/'single-entry-multi-output-records.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf8')
 checks.append('A08/A13: actual multi-output submit saves two independent canonical records with distinct IDs and no auxiliary record')
 # Capture the second output, then turn it off before the real submit. Its
 # archived geometry must not leak into the final record batch.
 open_flow(config,'v3-bud_building','SESKIP')
 draw([(0,0),(50,0),(50,50),(0,50)]);main_only=geometry();click('下一页');draw([(0,0),(50,0),(50,50),(0,50)]);click('下一页');draw([(20,20)])
 click('上一页');click('上一页');click('上一页');click('否');click('下一页');click('下一页');click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1')
 assert records()[0]['CoordG']==canonical(main_only) and not records()[0]['ID'].endswith('_SECOND')
 (OUT/'single-entry-disabled-output-record.json').write_text(json.dumps(records()[0],ensure_ascii=False,indent=2),encoding='utf8')
 checks.append('A09/A13: previously captured but subsequently disabled output is absent from the actual saved batch')
 config=copy.deepcopy(BASE);next(step for step in next(flow for flow in config['workflows'] if flow['id']=='v3-bud_building')['steps'] if step['kind']=='geometry')['drawing']['enabledFromThisPage']=False
 open_flow(config,'v3-bud_building','SEMANUAL');assert b.evaluate('window.singleEntryProbe.session.paused');draw([(0,0)]);assert geometry() is None
 click('恢复绘制');draw([(0,0),(50,0),(50,50)]);click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1')
 checks.append('A10: configured manual start remains paused until the existing resume button is clicked; drawing notifications do not auto-start it')
 # Canonical display Y is not a measured height. Preserve raw optional Y so
 # explicit zero/height controls and manual-coordinate precedence survive tasks.
 save_config('heights',BASE)
 for tag,manual_y,expected_y in [('SEHEIGHTZERO',None,0),('SEHEIGHTMANUAL',80,80)]:
  open_flow(BASE,'v3-tpp_teleport',tag);draw([(20,20)]);val('[data-workflow-control="tpp_teleport-elevation"] input',0)
  if manual_y is not None:
   click('手动输入');val('[data-panel-id="manual-point-input"] input[placeholder="例如 10 / 10.1"]',20);val('[data-panel-id="manual-point-input"] input[placeholder="例如 -64 / -64.3"]',manual_y);val('[data-panel-id="manual-point-input"] input[placeholder="例如 20 / 20.1"]',20);press(panel_button('manual-point-input','完成'));close_panel('manual-point-input')
  original=draft();click('下一页');draw([(40,40)]);val('[data-workflow-control="tpp_teleport-target-elevation"] input',32);click('上一页');assert draft()==original
  if manual_y is None:assert b.evaluate('window.singleEntryProbe.bridge.getDrawingDraft().point.y===undefined')
  click('下一页');click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1');r=records()[0]
  assert r['elevation']==expected_y and r['TGTelevation']==32 and r['TGTcoordinate']['y']==32,r
  (OUT/('single-entry-'+tag+'-record.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2),encoding='utf8')
 checks.append('A08/A10/A13: TPP zero height, auxiliary height 32 and explicit manual Y precedence survive task switches and actual saved records')
 assert not b.errors,b.errors
 assert b.evaluate('window.singleEntryRequests')==[]
 (OUT/'single-entry-drawing-failure.json').unlink(missing_ok=True);(OUT/'single-entry-drawing-error.png').unlink(missing_ok=True)
 (OUT/'single-entry-drawing-result.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors,'remoteOrWriteRequests':b.evaluate('window.singleEntryRequests'),'sourceRevision':93,'sourceContract':17},ensure_ascii=False,indent=2),encoding='utf8')
 print(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False))
except Exception:
 b.screenshot('single-entry-drawing-error.png')
 (OUT/'single-entry-drawing-failure.json').write_text(json.dumps({'checks':checks,'trace':traceback.format_exc(),'body':b.evaluate('document.body.innerText')[-6000:],'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf8')
 raise
