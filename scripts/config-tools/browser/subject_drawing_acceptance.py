"""TPP task backtracking through the real production MeasuringModule and map."""
import json,time
from pathlib import Path
from browser_check import Browser,OUT,APP_URL
b=Browser();checks=[]
fixtures=json.loads(Path('scripts/config-tools/fixtures/v1-workflow-output-parity.json').read_text(encoding='utf-8'))['cases']
fixture=next(case for case in fixtures if case['schemaKey']=='tpp_teleport')
def value(selector,data):
 b.evaluate("(()=>{const e=document.querySelector("+json.dumps(selector)+");if(!e)throw Error('Missing '+"+json.dumps(selector)+");const p=e.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(e,"+json.dumps(str(data))+");e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));})()")
def point(x,z):
 r=b.evaluate('window.workflowAcceptance.screenPointAt('+str(x)+','+str(z)+')')
 assert b.evaluate('(()=>{const r=document.querySelector(".leaflet-container").getBoundingClientRect();return '+str(r['x'])+'>r.left&&'+str(r['x'])+'<r.right&&'+str(r['y'])+'>r.top&&'+str(r['y'])+'<r.bottom;})()'),r
 for event in ['mousePressed','mouseReleased']:b.call('Input.dispatchMouseEvent',{'type':event,'button':'left','clickCount':1,**r})
 time.sleep(.15)
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/workflow-acceptance.html?final=1'})
b.wait('!!window.workflowAcceptance?.measurement',40)
workflow=b.evaluate("window.workflowAcceptance.config.workflows.find(w=>w.id==='v3-tpp_teleport')")
b.click('测绘');b.click('开始测绘(快捷)')
b.evaluate("(()=>{const s=[...document.querySelectorAll('select')].find(e=>[...e.options].some(o=>o.value==='v3-tpp_teleport'));s.value='v3-tpp_teleport';s.dispatchEvent(new Event('change',{bubbles:true}));})()")
b.click('开始');b.wait("!!document.querySelector('input[aria-label=填写人]')")
value('input[aria-label=填写人]','drawing-session-test');b.click('下一页')
form=next(step for step in workflow['steps'] if step['kind']=='form')
for control in form.get('controls',[]):
 selector='[data-workflow-control='+json.dumps(control['id'])+']'
 if control['kind']=='classificationPicker':
  for level,title in [('class','Class'),('kind','Kind'),('skind','SKind'),('skind2','SKind2')]:
   sel=selector+' select[aria-label="工作流分类 '+title+'"]'
   if b.evaluate('!!document.querySelector('+json.dumps(sel)+')'):value(sel,fixture['classification'].get(level,''))
 elif control.get('slot') and control['kind'] not in ['featureSearch','tagsExtensions']:
  slot=control['slot'];key=control['id'][len(fixture['schemaKey'])+1:-(len(slot)+1)]
  data=fixture['inputs'].get(key)
  if data is not None:value(selector+(' select' if control['kind']=='select' else ' input'),data)
b.click('下一页')
main=next(step for step in workflow['steps'] if step['kind']=='geometry' and step.get('geometryRole')!='auxiliary')
extra=next(step for step in workflow['steps'] if step['kind']=='geometry' and step.get('geometryRole')=='auxiliary')
b.wait('document.querySelector("[data-workflow-step]").dataset.workflowStep==='+json.dumps(main['id']))
assert not b.evaluate("[...document.querySelectorAll('button')].some(e=>['进入绘制','采用当前绘制'].includes(e.textContent.trim()))")
point(15,17);b.wait("document.body.innerText.includes('当前 1 个坐标')")
b.click('下一页');b.wait('document.querySelector("[data-workflow-step]").dataset.workflowStep==='+json.dumps(extra['id']))
for control in extra.get('controls',[]):
 if control['kind']=='number':value('[data-workflow-control='+json.dumps(control['id'])+'] input',21)
point(80,45);b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent==='确认保存输出'&&!e.disabled)")
b.click('上一页');b.wait('document.querySelector("[data-workflow-step]").dataset.workflowStep==='+json.dumps(main['id']))
b.click('上一页');b.wait('document.querySelector("[data-workflow-step]").dataset.workflowStep==='+json.dumps(form['id']))
b.click('撤销');point(55,66)
b.click('下一页');b.wait("document.body.innerText.includes('当前 1 个坐标')")
b.click('下一页');b.wait("[...document.querySelectorAll('button')].some(e=>e.textContent==='确认保存输出'&&!e.disabled)")
b.click('确认保存输出');b.wait('window.workflowAcceptance.measurement.getCommittedFeatures().length===1',15)
record=b.evaluate('window.workflowAcceptance.measurement.getCommittedFeatures()[0]')
assert record['CoordP']==[[55,-64,66]],record
assert record['TGTcoordinate']=={'x':80,'y':21,'z':45},record
assert record['TGTelevation']==21,record
checks.append('target -> main -> information keeps main drawing; information-page undo/new point survives re-entry; target coordinates and height remain isolated')
assert not b.errors,b.errors
(OUT/'subject-drawing-session.json').write_text(json.dumps({'checks':checks,'record':record,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False))
b.ws.close()
