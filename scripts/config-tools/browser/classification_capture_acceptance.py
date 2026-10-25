"""Actual production MeasuringModule controls; isolated localhost, no uploads."""
import json,os,time,traceback,urllib.request,zipfile
from pathlib import Path
from browser_check import Browser,APP_URL,OUT
assert APP_URL.startswith('http://127.0.0.1:') and os.environ['CAIRNMAP_CDP_PORT']=='9502'
endpoint='http://127.0.0.1:9502';opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
fresh=json.load(opener.open(urllib.request.Request(endpoint+'/json/new?about:blank',method='PUT')))
for page in json.load(opener.open(endpoint+'/json')):
 if page['type']=='page' and page['id']!=fresh['id'] and (page['url']=='about:blank' or page['url'].startswith('http://127.0.0.1:')):opener.open(endpoint+'/json/close/'+page['id']).read()
b=Browser();checks=[]
def q(selector):return 'document.querySelector('+json.dumps(selector)+')'
def click(label):
 target='[...document.querySelectorAll("button,summary")].find(e=>(e.textContent.trim()==='+json.dumps(label)+'||e.title==='+json.dumps(label)+'||e.getAttribute("aria-label")==='+json.dumps(label)+')&&e.getBoundingClientRect().height&&!e.disabled)'
 b.wait('Boolean('+target+')');b.evaluate(target+'.click()');time.sleep(.15)
def value(selector,data):
 b.evaluate('(()=>{const e=document.querySelector('+json.dumps(selector)+');if(!e||e.disabled)throw Error("Input unavailable");const p=e.tagName==="SELECT"?HTMLSelectElement.prototype:e.tagName==="TEXTAREA"?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,"value").set.call(e,'+json.dumps(str(data))+');e.dispatchEvent(new Event(e.tagName==="SELECT"?"change":"input",{bubbles:true}));})()');time.sleep(.12)
def fill():
 b.evaluate('(()=>{const s=[...document.querySelectorAll("fieldset")].find(e=>e.innerText.includes("填写者ID")||e.innerText.includes("车站和站台")||e.innerText.includes("铁路"));for(const e of s.querySelectorAll("input,textarea")){if(!e.getBoundingClientRect().height||e.disabled||["checkbox","radio","color"].includes(e.type))continue;const label=e.closest("label")?.textContent??e.parentElement.textContent;const v=label.includes("色号")?"2277aa":e.type==="number"?"1":"CAPTURE";const p=e.tagName==="TEXTAREA"?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,"value").set.call(e,v);e.dispatchEvent(new Event("input",{bubbles:true}));}})()');time.sleep(.2)
def draw(points):
 for x,y in points:
  for event in ['mousePressed','mouseReleased']:b.call('Input.dispatchMouseEvent',{'type':event,'button':'left','clickCount':1,'x':x,'y':y})
  time.sleep(.12)
def world_draw(points):
 draw([tuple(b.evaluate('window.workflowAcceptance.screenPointAt('+str(x)+','+str(z)+')').values()) for x,z in points])
def array(coords):
 click('数组编辑');selector='textarea[placeholder^="请输入严格 JSON 数组"]';b.wait('Boolean(document.querySelector('+json.dumps(selector)+'))');value(selector,json.dumps(coords));click('校验');click('完成');b.wait('!document.querySelector('+json.dumps(selector)+')')
def navigate():
 b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/workflow-acceptance.html?classification=1&edit=1'})
 b.wait('Boolean(window.workflowAcceptance?.measurement)',60)
 b.evaluate('window.confirm=()=>true;window.alerts=[];window.alert=message=>window.alerts.push(message)')
def begin_station():
 navigate();click('测绘');click('开始测绘(快捷)')
 b.evaluate('(()=>{const s=[...document.querySelectorAll("select")].find(e=>[...e.options].some(o=>o.value==="external-station-integrated"));s.value="external-station-integrated";s.dispatchEvent(new Event("change",{bubbles:true}));})()');click('开始');b.wait('document.body.innerText.includes("填写者ID")');fill();click('下一步');fill();click('下一步')
def records():return b.evaluate('window.workflowAcceptance.measurement.getCommittedFeatures()')
try:
 begin_station();click('跳过')
 # Real mouse starts the first polygon; array editor supplies exact rings.
 draw([(700,600),(900,600),(900,750),(700,750)])
 click('多部件和内洞设置');array([[0,64,0],[100,64,0],[100,64,60],[0,64,60]])
 click('内部空间');click('添加内部洞');world_draw([(24,24),(36,24),(36,36)]);array([[20,64,20],[40,64,20],[40,64,40],[20,64,40]])
 value('select[aria-label="部件编号"]','0');click('添加部件');world_draw([(20,-50),(70,-50),(70,-20)]);array([[20,64,-50],[70,64,-50],[70,64,-20],[20,64,-20]])
 click('上一步');click('下一步')
 assert b.evaluate(q('select[aria-label="部件编号"]')+'.options.length')==2
 value('select[aria-label="部件编号"]','0');assert b.evaluate(q('select[aria-label="内部洞编号"]')+'.options.length')==1
 click('下一步');pfb=next(r for r in records() if r.get('Kind')=='PFB');assert pfb['Class']=='RIL' and len(pfb['CoordG'])==2 and len(pfb['CoordG'][0])==2
 for _ in range(3):fill();draw([(800,680)]);click('下一步')
 captured=records();assert [r['Kind'] for r in captured]==['PFB','PLF','PLF','STA'];assert all(r['Class']=='RIL' for r in captured)
 checks.append('skip STB, two PFB parts and hole survive return-to-base/re-entry, both platform directions and station capture output exact RIL roles')
 b.screenshot('classification-station-full-capture.png')
 # Read the saved PFB through the normal layer editor and preserve every ring.
 click('切换到完整模式')
 row='[...document.querySelectorAll("div")].find(e=>e.className.includes("whitespace-nowrap")&&e.textContent.includes('+json.dumps(pfb['ID'])+'))'
 b.evaluate('('+row+').querySelector('+json.dumps('button[title="展开工具栏"]')+')?.click()');time.sleep(.2)
 b.evaluate('[...('+row+').querySelectorAll("button")].find(e=>e.textContent==="编辑").click()')
 b.wait('Boolean('+q('section[aria-label="V3 工作流式编辑"]')+')')
 assert b.evaluate(q('select[aria-label="部件编号"]')+'.options.length')==2
 value('input[aria-label="工作流编辑人"]','capture-editor');click('保存编辑图层');b.wait('!'+q('section[aria-label="V3 工作流式编辑"]'))
 updated=next(r for r in records() if r['ID']==pfb['ID']);assert updated['CoordG']==pfb['CoordG'];assert updated['ID']==pfb['ID']
 checks.append('actual native edit reloads all PFB rings and saves without changing historical ID or any part/hole')
 (OUT/'classification-captured-records.json').write_text(json.dumps(records(),ensure_ascii=False,indent=2),encoding='utf-8')
 downloads=OUT/'downloads'/str(time.time_ns());downloads.mkdir(parents=True)
 b.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(downloads.resolve())})
 click('整体JSON');click('下载(完整)')
 for _ in range(60):
  files=list(downloads.glob('*.json'))
  if files:break
  time.sleep(.1)
 assert files,'actual JSON download missing'
 exported=json.loads(files[0].read_text(encoding='utf-8'));assert next(r for r in exported if r['ID']==pfb['ID'])['CoordG']==pfb['CoordG']
 navigate();click('测绘');click('开始测绘(完整)');click('导入数据');value('textarea[placeholder^="批量 JSON"]',json.dumps(exported));click('导入')
 b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===4')
 assert next(r for r in records() if r['ID']==pfb['ID'])['CoordG']==pfb['CoordG']
 checks.append('actual complete JSON download and normal batch import preserve both PFB parts and all hole rings')
 invalid={**pfb,'ID':'INVALID_MULTI_STB','Class':'RIL','Kind':'STB'}
 click('导入数据');value('textarea[placeholder^="批量 JSON"]',json.dumps([invalid]));click('导入');time.sleep(.2)
 assert all(r['ID']!='INVALID_MULTI_STB' for r in records())
 assert any('多部件' in message or '部件' in message for message in b.evaluate('window.alerts')),b.evaluate('window.alerts')
 checks.append('actual import rejects illegal multipart STB with a concrete reason and never truncates it to one part')
 begin_station();fill();draw([(700,600),(900,600),(900,750),(700,750)]);click('多部件和内洞设置')
 assert b.evaluate('[...document.querySelectorAll("button")].find(e=>e.title==="添加部件").disabled')
 click('下一步');stb=next(r for r in records() if r.get('Kind')=='STB');assert len(stb['CoordG'])==1
 click('从车站总建筑导入坐标');click('下一步');pfb2=next(r for r in records() if r.get('Kind')=='PFB');assert pfb2['CoordG']==stb['CoordG']
 checks.append('STB forbids a second part while its complete saved geometry imports into PFB through the existing button')
 navigate();click('测绘');click('开始测绘(快捷)')
 b.evaluate('(()=>{const s=[...document.querySelectorAll("select")].find(e=>[...e.options].some(o=>o.value==="external-railway-integrated"));s.value="external-railway-integrated";s.dispatchEvent(new Event("change",{bubbles:true}));})()');click('开始');fill();click('下一步')
 b.evaluate('(()=>{const s=[...document.querySelectorAll("select")].find(e=>[...e.options].some(o=>o.value==="其他"));s.value="其他";s.dispatchEvent(new Event("change",{bubbles:true}));})()')
 draw([(700,650),(900,650)]);click('下一步');fill();click('完成并输出')
 rail=records();assert len(rail)==1 and rail[0]['Class']=='RIL' and rail[0]['Kind']=='RLE' and len(rail[0]['CoordL'][0])==2
 checks.append('actual railway component retains its algorithm and ID convention while outputting the declared RIL/RLE path')
 for role,format,shape,fields in [('STF','车站建筑楼层','面',{'ID':'CAPTURE_STF','Name':'Capture floor','NofFloor':'1','staBuildingID':'CAPTURE_STB'}),('SBP','车站建筑点','点',{'ID':'CAPTURE_SBP','Name':'Capture station point'})]:
  navigate();click('测绘');click('开始测绘(完整)');click(shape)
  b.evaluate('(()=>{const s=[...document.querySelectorAll("select")].find(e=>[...e.options].some(o=>o.value==='+json.dumps(format)+'));s.value='+json.dumps(format)+';s.dispatchEvent(new Event("change",{bubbles:true}));})()');time.sleep(.2)
  for key,data in fields.items():value('input[placeholder='+json.dumps(key)+']',data)
  if role=='SBP':
   click('添加站台条目')
   b.evaluate('(()=>{const e=[...document.querySelectorAll("input[placeholder=ID]")].at(-1);Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(e,"CAPTURE_PLF");e.dispatchEvent(new Event("input",{bubbles:true}));})()')
  value('input[placeholder^="可选：用于写入"]','capture-author')
  draw([(700,600),(900,600),(900,750),(700,750)] if shape=='面' else [(800,680)]);click('完成当前图层')
  b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1');record=records()[0];assert record['Class']=='RIL' and record['Kind']==role and record['ID']==fields['ID']
 checks.append('actual full-mode STF and SBP creation use declared RIL roles; manual IDs and field formats remain unchanged')
 navigate();click('测绘');click('开始测绘(完整)')
 historical={**pfb,'Class':'PFB','elevation':'','height':None};historical.pop('Kind',None)
 replacement={**historical,'Class':'RIL','Kind':'PFB'}
 # Isolated fixture setup only. All migration actions use production controls.
 b.evaluate('window.workflowAcceptance.setRecords('+json.dumps([historical])+')');time.sleep(.3)
 click('删除要素')
 candidate='[...document.querySelectorAll("div.flex.items-center.gap-2.rounded.border.bg-white.p-2")].find(e=>e.textContent.includes('+json.dumps(historical['ID'])+'))'
 b.wait('Boolean('+candidate+')');b.evaluate('('+candidate+').querySelector("button").click()');click('确认')
 click('导入数据');value('textarea[placeholder^="批量 JSON"]',json.dumps([replacement]));click('导入')
 b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1');assert records()[0]==replacement
 download_dir=OUT/'downloads'/str(time.time_ns());download_dir.mkdir(parents=True)
 b.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(download_dir.resolve())})
 click('导出标准包')
 value('input.w-full.border.rounded.px-3.py-2.text-sm','capture-migration-test');click('生成标准包');click('点击下载标准包')
 for _ in range(100):
  archives=list(download_dir.glob('*.zip'))
  if archives and zipfile.is_zipfile(archives[0]):break
  time.sleep(.1)
 with zipfile.ZipFile(archives[0]) as archive:
  deletion=json.loads(archive.read(next(n for n in archive.namelist() if n.endswith('/Delete.json') or n=='Delete.json')))
  assert deletion['items'][0]['classCode']=='PFB' and deletion['items'][0]['ID']==historical['ID']
  upsert=json.loads(archive.read(next(n for n in archive.namelist() if (n.startswith('Data_Spilt/') or '/Data_Spilt/' in n) and n.endswith('.json'))))
  assert upsert==replacement
 checks.append('actual delete selector, classification-only import and standard ZIP retain old delete Class, new upsert Class, exact ID, raw optional blanks and complete geometry in one candidate')
 for workflow,path,name_control,abbr_control,geometry in [
  ('v3-isg_ngf_lad','NGF/LAD/CON','isg_ngf_lad-Name-A','isg_ngf_lad-abbr-E','Polygon'),
  ('v3-ngf_lis_lal','NGF/LIS/LAL/MTL','isg_ngf_lis-Name-A','isg_ngf_lis-abbr-G','LineString'),
  ('v3-ngf_lis_lap','NGF/LIS/LAP/PEK','isg_ngf_lis-Name-A','isg_ngf_lis-abbr-G','Point'),
  ('v3-isl_adm_dbl','ADM/DBL/LBD','isl_adm_dbl-Name-A','isl_adm_dbl-abbr-I','LineString'),
  ('v3-pta_air','PTA/AIR/NOM','bud_building-Name-A','bud_building-abbr-I','Polygon')]:
  navigate();click('测绘');click('开始测绘(快捷)')
  b.evaluate('(()=>{const e=[...document.querySelectorAll("select")].find(e=>[...e.options].some(o=>o.value==='+json.dumps(workflow)+'));e.value='+json.dumps(workflow)+';e.dispatchEvent(new Event("change",{bubbles:true}));})()');click('开始')
  value('input[aria-label="填写人"]','capture-author');click('下一页')
  if b.evaluate('Boolean(document.querySelector(\'select[aria-label="工作流分类"]\'))'):value('select[aria-label="工作流分类"]',path)
  value('[data-workflow-control='+json.dumps(name_control)+'] input','New native category');value('[data-workflow-control='+json.dumps(abbr_control)+'] input','NATIVE_TEST')
  click('下一页');draw([(700,600)] if geometry=='Point' else [(700,600),(900,600)] if geometry=='LineString' else [(700,600),(900,600),(900,750),(700,750)])
  click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1');original=records()[0]
  click('切换到完整模式');row='[...document.querySelectorAll("div")].find(e=>e.classList.contains("whitespace-nowrap")&&e.getBoundingClientRect().height)'
  b.evaluate('('+row+').querySelector(\'button[title="展开工具栏"]\').click()');time.sleep(.15)
  b.evaluate('[...('+row+').querySelectorAll("button")].find(e=>e.textContent==="编辑"&&!e.disabled).click()');b.wait('Boolean(document.querySelector(\'section[aria-label="V3 工作流式编辑"]\'))')
  value('input[aria-label="工作流编辑人"]','native-editor');click('保存编辑图层');b.wait('!document.querySelector(\'section[aria-label="V3 工作流式编辑"]\')')
  edited=records()[0];assert edited['ID']==original['ID'] and edited['Name']==original['Name']
  assert edited.get('CoordP')==original.get('CoordP') and edited.get('CoordL')==original.get('CoordL') and edited.get('CoordG')==original.get('CoordG')
 checks.append('new NGF point/line/polygon, ADM and PTA captures reopen and save through native editors without relying on the legacy format registry or changing ID/geometry')
 assert not b.evaluate('window.alerts.length'),b.evaluate('window.alerts');assert not b.errors,b.errors
 (OUT/'classification-capture-browser-result.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False),flush=True)
except Exception:
 b.screenshot('classification-capture-failure.png');(OUT/'classification-capture-failure.txt').write_text(traceback.format_exc()+'\n'+b.evaluate('document.body.innerText'),encoding='utf-8');raise
