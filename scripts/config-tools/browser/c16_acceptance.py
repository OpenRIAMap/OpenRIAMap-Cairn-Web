"""Actual native full-editor controls in an isolated local browser. No store writes or uploads."""
import json,os,time,urllib.request,traceback
from pathlib import Path
from browser_check import Browser,APP_URL,OUT
assert APP_URL.startswith('http://127.0.0.1:')
port=os.environ.get('CAIRNMAP_CDP_PORT','9338');endpoint='http://127.0.0.1:'+port
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
fresh=json.load(opener.open(urllib.request.Request(endpoint+'/json/new?about:blank',method='PUT')))
for page in json.load(opener.open(endpoint+'/json')):
 if page['type']=='page' and page['id']!=fresh['id'] and (page['url']=='about:blank' or page['url'].startswith(APP_URL)):opener.open(endpoint+'/json/close/'+page['id']).read()
b=Browser();checks=[]
def target(selector):return '[...document.querySelectorAll('+json.dumps(selector)+')].find(e=>e.getBoundingClientRect().height&&!e.closest("[inert]"))'
def click(label):
 expr='[...document.querySelectorAll("button,summary")].find(e=>(e.textContent.trim()==='+json.dumps(label)+'||e.title==='+json.dumps(label)+'||e.getAttribute("aria-label")==='+json.dumps(label)+')&&e.getBoundingClientRect().height&&!e.disabled&&!e.closest("[inert]"))'
 b.wait('Boolean('+expr+')');b.evaluate(expr+'.click()');time.sleep(.15)
def value(selector,data):
 expr=target(selector);b.wait('Boolean('+expr+')');b.evaluate('(()=>{const e='+expr+';if(e.disabled)throw Error("Input disabled");const p=e.tagName==="SELECT"?HTMLSelectElement.prototype:e.tagName==="TEXTAREA"?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,"value").set.call(e,'+json.dumps(str(data))+');e.dispatchEvent(new Event(e.tagName==="SELECT"?"change":"input",{bubbles:true}));})()');time.sleep(.12)
def path(parts):
 for level,part in zip(['Class','Kind','SKind','SKind2'],parts):value('select[aria-label="要素分类 '+level+'"]',part)
def draw(points):
 for x,y in points:
  for event in ['mousePressed','mouseReleased']:b.call('Input.dispatchMouseEvent',{'type':event,'button':'left','clickCount':1,'x':x,'y':y})
  time.sleep(.1)
def records():return b.evaluate('window.workflowAcceptance.measurement.getCommittedFeatures()')
def navigate():
 b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/workflow-acceptance.html?c16=1&edit=1'});b.wait('Boolean(window.workflowAcceptance?.measurement)',60);b.evaluate('window.confirm=()=>true;window.alerts=[];window.alert=message=>window.alerts.push(message)');b.errors=[]
try:
 navigate();click('测绘');click('开始测绘(完整)')
 for key,shape,points in [('POINT','点',[(800,600)]),('LINE','线',[(800,600),(950,630)]),('AREA','面',[(750,580),(950,580),(950,730),(750,730)])]:
  click(shape);path(['C16TEST','PARENT',key,'LEAF']);b.wait('Boolean('+target('input[aria-label="新建要素 ID"]')+')')
  value('input[aria-label="新建要素 ID"]','MANUAL_'+key);value('[data-edit-control="name"] input','Actual '+key);value('input[aria-label="工作流编辑人"]','local-user')
  assert b.evaluate(target('[data-edit-control="count"] input')+'.value')=='0'
  draw(points);click('完成当前图层');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length==='+str(len(checks)+1))
  row=records()[-1];assert row['ID']=='MANUAL_'+key and row['Class']=='C16TEST' and row['SKind']==key and row['SKind2']=='LEAF';assert row['Count']==0 and row['CreateBy']=='local-user' and not row.get('ModifityBy');checks.append('four-level '+key+' manual ID/native defaults/creation metadata')
 b.screenshot('c16-full-created.png')
 (OUT/'c16-created-records.json').write_text(json.dumps(records(),ensure_ascii=False,indent=2),encoding='utf-8')
 print(b.evaluate('document.body.innerText')[:2500])
 # Reopen the saved layer through its actual toolbar; creation information must survive.
 click('>');click('编辑');b.wait('Boolean('+target('input[aria-label="编辑要素 ID"]')+')');assert b.evaluate(target('input[aria-label="编辑要素 ID"]')+'.value')=='MANUAL_POINT'
 value('[data-edit-control="name"] input','Actual edited');value('input[aria-label="工作流编辑人"]','editing-user');click('保存编辑图层');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures()[0].Name==="Actual edited"')
 edited=records()[0];assert edited['CreateBy']=='local-user' and edited['ModifityBy']=='editing-user' and edited['ID']=='MANUAL_POINT';checks.append('actual reopen/edit preserves original identity/creation metadata and sets modification metadata')
 # Exercise the ordinary complete JSON download and batch-import controls.
 directory=OUT/'c16-download';directory.mkdir(parents=True,exist_ok=True)
 for old in directory.glob('*.json'):old.unlink()
 b.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(directory.resolve())});click('整体JSON');click('下载(完整)')
 deadline=time.time()+20
 while not list(directory.glob('*.json')) and time.time()<deadline:time.sleep(.1)
 exported=json.loads(next(directory.glob('*.json')).read_text(encoding='utf-8'));assert len(exported)==3 and exported[0]['Name']=='Actual edited';click('关闭')
 navigate();click('测绘');click('开始测绘(完整)');click('导入数据');value('textarea[placeholder^="批量 JSON"]',json.dumps(exported));click('导入');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===3');assert records()==exported;checks.append('actual native complete JSON export/import roundtrip uses full paths and preserves all coordinates')
 b.screenshot('c16-roundtrip.png')
 assert not b.errors,b.errors
 (OUT/'c16-browser-result.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(checks,ensure_ascii=False))
except Exception:
 b.screenshot('c16-failure.png');(OUT/'c16-failure.json').write_text(json.dumps({'text':b.evaluate('document.body.innerText'),'alerts':b.evaluate('window.alerts'),'errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');raise
