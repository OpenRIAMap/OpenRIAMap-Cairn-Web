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
def expr_value(expr,data):
 b.wait('Boolean('+expr+')');b.evaluate('(()=>{const e='+expr+';const p=e.tagName==="SELECT"?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,"value").set.call(e,'+json.dumps(str(data))+');e.dispatchEvent(new Event(e.tagName==="SELECT"?"change":"input",{bubbles:true}));})()');time.sleep(.12)
def click_in(expr,text):
 selector='[...('+expr+').querySelectorAll("button")].find(e=>e.textContent.trim()==='+json.dumps(text)+')';b.wait('Boolean('+selector+')');b.evaluate(selector+'.click()');time.sleep(.12)
def form(i):return '[...document.querySelectorAll(\'section[aria-label="V3 工作流式编辑"]\')].filter(e=>e.getBoundingClientRect().height)['+str(i)+']'
def input_at(expr,selector,index=0):return '[...('+expr+').querySelectorAll('+json.dumps(selector)+')]['+str(index)+']'
def fill_form(i,role,ident):
 f=form(i);expr_value(input_at(f,'input[aria-label="新建要素 ID"]'),ident);expr_value(input_at(f,'[data-edit-control="edit-'+role+'-Name"] input'),'actual '+role);expr_value(input_at(f,'input[aria-label="工作流编辑人"]'),'tool-user')
 if role=='PLF':
  click_in(f,'添加经行线路');expr_value(input_at(f,'[data-edit-control="edit-PLF-lines"] input[type=text]'),'test-line')
  for index in range(5):b.evaluate(input_at(f,'[data-edit-control="edit-PLF-lines"] [role=group] button:nth-child(1)',index)+'.click()');time.sleep(.1)
 elif role=='STA':
  expr_value(input_at(f,'[data-edit-control="edit-STA-STBuilding"] input'),'test-building');click_in(f,'添加包含站台');expr_value(input_at(f,'[data-edit-control="edit-STA-platforms"] input'),'MERGE_P1')
 elif role=='PFB':expr_value(input_at(f,'[data-edit-control="edit-PFB-LineID"] input'),'test-line')
def by_label(text,index=0,tag='input'):
 return '[...document.querySelectorAll("label")].filter(e=>e.getBoundingClientRect().height&&e.textContent.includes('+json.dumps(text)+')&&e.querySelector('+json.dumps(tag)+'))['+str(index)+']?.querySelector('+json.dumps(tag)+')'
try:
 navigate();click('测绘');click('开始测绘(完整)');click('点');path(['RIL','PLF']);click('多点合一');click('添加站台');click('添加站台');click('添加站场')
 fill_form(0,'PLF','MERGE_P1');fill_form(1,'PLF','MERGE_P2');fill_form(2,'STA','MERGE_S');draw([(800,600)]);click('完成当前图层');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===3');rows=records();assert [r['Kind'] for r in rows]==['PLF','PLF','STA'];assert rows[0]['CoordP']==rows[1]['CoordP']==rows[2]['CoordP'];checks.append('actual point merge: two platforms and one station saved atomically with independent IDs and a shared coordinate')
 b.screenshot('c16-point-merge.png')
 click('面');path(['RIL','PFB']);click('多面合一');click('添加站台轮廓');click('添加车站建筑');fill_form(0,'PFB','MERGE_OUTLINE');fill_form(1,'STB','MERGE_BUILDING');draw([(750,580),(950,580),(950,730),(750,730)]);click('完成当前图层');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===5');rows=records();assert rows[3]['CoordG']==rows[4]['CoordG'];assert [r['Kind'] for r in rows[-2:]]==['PFB','STB'];checks.append('actual polygon merge: outline and building retain independent native records and identical complete geometry')
 b.screenshot('c16-polygon-merge.png')
 navigate();click('测绘');click('开始测绘(快捷)');expr_value('[...document.querySelectorAll("select")].find(e=>[...e.options].some(o=>o.value==="external-trp-integrated"))','external-trp-integrated');click('开始')
 expr_value(by_label('填写者ID'),'trade-author');click('下一步');expr_value(by_label('类型',tag='select'),json.dumps({'class':'TRP','kind':'NOM','skind':'NOM'},separators=(',',':')));expr_value(by_label('交易点名'),'actual trade');expr_value(by_label('字符简称'),'C16TRADE')
 land='[...document.querySelectorAll("div.space-y-1")].find(e=>e.querySelector(":scope > div")?.textContent.includes("所属地理单元")&&e.querySelector(":scope > input")).querySelector(":scope > input")'
 expr_value(land,'C16Land');b.wait('[...document.querySelectorAll("button")].some(e=>e.textContent.includes("C16Land（C16_LAND）"))');assert not b.evaluate('[...document.querySelectorAll("button")].some(e=>e.textContent.includes("C16_FOREIGN")||e.textContent.includes("C16_WRONG"))');click('C16Land（C16_LAND）');click('下一步')
 expr_value(by_label('物品名称',0),'Stone');expr_value(by_label('物品名称',1),'Emerald');expr_value(by_label('数量',0),'0');expr_value(by_label('数量',1),'1');click('下一步');draw([(800,600)]);print(b.evaluate('document.body.innerText')[-800:]);click('下一步');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1');trade=records()[0];assert trade['Class']=='TRP' and trade['tags']['Land']=='C16_LAND' and trade['Trade'][0]['OfferItems'][0]['Count']==0;checks.append('actual trade capture: native terminal category, scoped feature search excludes wrong class/world, nested Trade keeps valid zero')
 click('切换到完整模式');click('>');click('编辑');b.wait('document.body.innerText.includes("TRP 外部编辑")');value('[data-editor-field=Name] input','actual trade edited');click('保存编辑图层');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures()[0].Name==="actual trade edited"');edited=records()[0];assert edited['CreateBy']=='trade-author' and edited['Trade']==trade['Trade'];checks.append('actual TRP private editor preserves creation identity, nested trades and explicit reference values')
 b.screenshot('c16-trade-edited.png')
 navigate();click('测绘');click('开始测绘(完整)');click('线');path(['RIL','RLE']);value('input[aria-label="新建要素 ID"]','REVERSE_RAIL')
 for key,data in [('Name','reverse rail'),('bureau','TEST'),('line','A'),('color','#123456'),('startplf','START'),('endplf','END')]:value('[data-edit-control="edit-RLE-'+key+'"] input',data)
 value('[data-edit-control="edit-RLE-direction"] select','2');value('input[aria-label="工作流编辑人"]','rail-author');draw([(750,600),(950,630)]);click('方向反转');click('完成当前图层');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1');rail=records()[0];assert rail['startplf']=='END' and rail['endplf']=='START' and rail['CoordL'][0][0][0]>rail['CoordL'][0][-1][0];checks.append('actual railway reverse swaps the geometry and native endpoint fields together')
 assert not b.errors,b.errors
 (OUT/'c16-tools-result.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(checks,ensure_ascii=False))
except Exception:
 b.screenshot('c16-tools-failure.png');(OUT/'c16-tools-failure.json').write_text(json.dumps({'text':b.evaluate('document.body.innerText'),'alerts':b.evaluate('window.alerts'),'errors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');raise
